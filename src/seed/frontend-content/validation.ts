import "server-only";

import { createHash } from "node:crypto";
import { frontendContentManifestSchema } from "./manifest";
import type {
  FrontendAssetEntry,
  FrontendContentManifest,
  FrontendFaqCandidate,
  FrontendProjectEntry,
  FrontendServiceEntry,
  FrontendTestimonialEntry,
} from "./manifest";

export type FrontendContentEntry =
  | FrontendProjectEntry
  | FrontendServiceEntry
  | FrontendTestimonialEntry
  | FrontendFaqCandidate;

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value))
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
    .join(",")}}`;
}

export function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

export function checksum(value: unknown): string {
  return sha256(canonicalJson(value));
}

/** Parse and validate the complete, versioned manifest and all source relations. */
export function validateFrontendContentManifest(
  value: unknown,
): FrontendContentManifest {
  const manifest = frontendContentManifestSchema.parse(value);
  const recordKeys = [
    ...manifest.projects.map((entry) => entry.sourceKey),
    ...manifest.services.map((entry) => entry.sourceKey),
    ...manifest.testimonials.map((entry) => entry.sourceKey),
    ...manifest.faqCandidates.map((entry) => entry.sourceKey),
  ];
  assertUnique(recordKeys, "sourceKey konten");
  assertUnique(
    manifest.assets.map((entry) => entry.sourceKey),
    "sourceKey media",
  );

  const assetKeys = new Set(manifest.assets.map((entry) => entry.sourceKey));
  const contentKeys = new Set(recordKeys);
  for (const project of manifest.projects) {
    if (project.payload.featuredImageSourceKey)
      assertAssetReference(assetKeys, project.payload.featuredImageSourceKey);
    for (const key of project.payload.galleryImageSourceKeys)
      assertAssetReference(assetKeys, key);
    for (const variant of project.sourceVariants)
      if (variant.imageSourceKey)
        assertAssetReference(assetKeys, variant.imageSourceKey);
  }
  for (const asset of manifest.assets)
    for (const sourceKey of asset.usageSourceKeys)
      if (!contentKeys.has(sourceKey))
        throw new Error(
          `Aset ${asset.sourceKey} menunjuk sourceKey yang tidak ada.`,
        );
  for (const testimonial of manifest.testimonials)
    if (
      !manifest.projects.some(
        (project) => project.sourceKey === testimonial.relatedProjectSourceKey,
      )
    )
      throw new Error(
        `Relasi testimoni ${testimonial.sourceKey} menunjuk proyek yang tidak ada.`,
      );

  return manifest;
}

function assertUnique(values: string[], label: string): void {
  if (new Set(values).size !== values.length)
    throw new Error(`${label} duplikat ditemukan.`);
}

function assertAssetReference(assetKeys: Set<string>, key: string): void {
  if (!assetKeys.has(key))
    throw new Error(`Referensi aset ${key} tidak ditemukan.`);
}

export function manifestChecksum(manifest: FrontendContentManifest): string {
  return checksum(manifest);
}

export function sourceChecksum(entry: FrontendContentEntry): string {
  return checksum(entry);
}

export function payloadChecksum(payload: unknown): string {
  return checksum(payload);
}

export type ImportDecision =
  | "create"
  | "reuse"
  | "conflict"
  | "needs_review"
  | "needs_mapping"
  | "media_pending"
  | "source_changed_skipped"
  | "target_edited_skipped"
  | "target_deleted_review";

export function shouldPublishProject(
  entry: Pick<FrontendProjectEntry, "intendedStatus" | "canonicalPayloadApproved">,
): boolean {
  return entry.intendedStatus === "published" && entry.canonicalPayloadApproved;
}

export function shouldActivateService(
  entry: Pick<
    FrontendServiceEntry,
    "intendedStatus" | "canonicalPayloadApproved" | "payload"
  >,
): boolean {
  return (
    entry.intendedStatus === "active" &&
    entry.canonicalPayloadApproved &&
    entry.payload.isActive
  );
}

export function approvedProjectFeaturedAssetKeys(
  projects: readonly FrontendProjectEntry[],
): Set<string> {
  return new Set(
    projects.flatMap((entry) =>
      shouldPublishProject(entry) && entry.payload.featuredImageSourceKey
        ? [entry.payload.featuredImageSourceKey]
        : [],
    ),
  );
}

export interface ExistingImportState {
  targetId: string;
  targetState: "active" | "trashed" | "deleted" | "missing";
  sourceChecksum: string;
  importedPayloadChecksum: string;
  currentPayloadChecksum: string | null;
}

export function classifyImportItem(
  entry: FrontendContentEntry,
  options: {
    existing?: ExistingImportState;
    naturalKeyMatches?: number;
    mediaReady?: boolean;
  } = {},
): ImportDecision {
  if (
    "intendedStatus" in entry &&
    entry.intendedStatus === "active" &&
    "canonicalPayloadApproved" in entry &&
    !entry.canonicalPayloadApproved
  )
    return "needs_review";

  const existing = options.existing;
  if (existing) {
    if (existing.targetState !== "active") return "target_deleted_review";
    if (existing.sourceChecksum !== sourceChecksum(entry))
      return "source_changed_skipped";
    if (
      existing.currentPayloadChecksum === null ||
      existing.currentPayloadChecksum !== existing.importedPayloadChecksum
    )
      return "target_edited_skipped";
    return "reuse";
  }

  if (
    "conflicts" in entry &&
    entry.conflicts.length > 0 &&
    !("canonicalPayloadApproved" in entry && entry.canonicalPayloadApproved)
  )
    return "conflict";
  if (options.naturalKeyMatches && options.naturalKeyMatches > 1)
    return "conflict";
  if (options.naturalKeyMatches === 1) return "needs_mapping";
  if (entry.reviewFlags.length > 0) return "needs_review";
  if ("payload" in entry && !options.mediaReady && entryUsesMedia(entry))
    return "media_pending";
  return "create";
}

function entryUsesMedia(entry: FrontendContentEntry): boolean {
  if ("payload" in entry && "featuredImageSourceKey" in entry.payload)
    return true;
  return "photoId" in entry;
}

export interface LocalAssetInspection {
  sourceKey: string;
  sourcePath: string;
  mimeType: FrontendAssetEntry["expectedMimeType"];
  sizeBytes: number;
  width: number;
  height: number;
  sha256: string;
}

/**
 * Restrict manifest paths to local public/images files. The caller must still
 * resolve real paths before reading, because a symlink could escape the tree.
 */
export function assertPublicImagePath(sourcePath: string): string {
  if (
    !/^public\/images\/[A-Za-z0-9_. -]+\.(?:jpe?g|png|webp)$/i.test(
      sourcePath,
    ) ||
    sourcePath.includes("..") ||
    sourcePath.includes("\\")
  )
    throw new Error(
      "Path aset harus berupa file gambar lokal di public/images.",
    );
  return sourcePath;
}

export function expectedImageMimeType(sourcePath: string): string {
  const normalized = sourcePath.toLowerCase();
  if (normalized.endsWith(".jpg") || normalized.endsWith(".jpeg"))
    return "image/jpeg";
  if (normalized.endsWith(".png")) return "image/png";
  if (normalized.endsWith(".webp")) return "image/webp";
  throw new Error("Ekstensi aset gambar tidak didukung.");
}

export function detectImageMimeType(bytes: Uint8Array): string | null {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  )
    return "image/jpeg";
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  )
    return "image/png";
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  )
    return "image/webp";
  return null;
}

export function summarizeManifest(
  manifest: FrontendContentManifest,
): Record<ImportDecision, number> {
  const summary: Record<ImportDecision, number> = {
    create: 0,
    reuse: 0,
    conflict: 0,
    needs_review: 0,
    needs_mapping: 0,
    media_pending: 0,
    source_changed_skipped: 0,
    target_edited_skipped: 0,
    target_deleted_review: 0,
  };
  const entries: FrontendContentEntry[] = [
    ...manifest.projects,
    ...manifest.services,
    ...manifest.testimonials,
    ...manifest.faqCandidates,
  ];
  for (const entry of entries) summary[classifyImportItem(entry)] += 1;
  return summary;
}
