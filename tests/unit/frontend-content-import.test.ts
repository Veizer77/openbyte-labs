import { describe, expect, it } from "vitest";
import {
  FRONTEND_CONTENT_MANIFEST,
  type FrontendProjectEntry,
} from "@/seed/frontend-content/manifest";
import {
  assertPublicImagePath,
  approvedProjectFeaturedAssetKeys,
  classifyImportItem,
  checksum,
  detectImageMimeType,
  manifestChecksum,
  payloadChecksum,
  shouldActivateService,
  sourceChecksum,
  shouldPublishProject,
  summarizeManifest,
  validateFrontendContentManifest,
} from "@/seed/frontend-content/validation";

describe("frontend content import manifest", () => {
  it("validates the reviewed inventory and holds anonymous projects as drafts", () => {
    const manifest = validateFrontendContentManifest(FRONTEND_CONTENT_MANIFEST);

    expect(manifest.projects).toHaveLength(6);
    expect(manifest.services).toHaveLength(4);
    expect(manifest.testimonials).toHaveLength(2);
    expect(manifest.faqCandidates).toHaveLength(4);
    expect(manifest.assets).toHaveLength(0);
    expect(
      manifest.projects.every(
        (entry) => entry.payload.featuredImageSourceKey === null,
      ),
    ).toBe(true);
    expect(approvedProjectFeaturedAssetKeys(manifest.projects).size).toBe(0);
    expect(
      manifest.projects.every(
        (entry) =>
          entry.intendedStatus === "draft" &&
          !entry.canonicalPayloadApproved,
      ),
    ).toBe(true);
    expect(
      manifest.services.every(
        (entry) =>
          entry.intendedStatus === "draft" &&
          !entry.canonicalPayloadApproved &&
          !entry.payload.isActive &&
          entry.reviewFlags.length > 0,
      ),
    ).toBe(true);
    expect(
      manifest.testimonials.every(
        (entry) => entry.intendedStatus === "inactive",
      ),
    ).toBe(true);
    expect(
      manifest.testimonials.every(
        (entry) => entry.authorNameCandidate === null,
      ),
    ).toBe(true);
    expect(
      manifest.faqCandidates.every((entry) => !entry.payload.isActive),
    ).toBe(true);
    expect(
      manifest.protectedFoundation.every(
        (entry) => entry.action === "preserve_existing",
      ),
    ).toBe(true);
    expect(summarizeManifest(manifest)).toMatchObject({
      conflict: 6,
      needs_review: 10,
      media_pending: 0,
      create: 0,
    });
  });

  it("only publishes an explicitly approved project", () => {
    expect(
      shouldPublishProject({
        intendedStatus: "published",
        canonicalPayloadApproved: true,
      }),
    ).toBe(true);
    expect(
      shouldPublishProject({
        intendedStatus: "published",
        canonicalPayloadApproved: false,
      }),
    ).toBe(false);
    expect(
      shouldPublishProject({
        intendedStatus: "draft",
        canonicalPayloadApproved: true,
      }),
    ).toBe(false);

    const approved = {
      ...FRONTEND_CONTENT_MANIFEST.projects[0]!,
      intendedStatus: "published" as const,
      canonicalPayloadApproved: true,
      payload: {
        ...FRONTEND_CONTENT_MANIFEST.projects[0]!.payload,
        featuredImageSourceKey: "image:approved-project",
      },
    };
    expect(approvedProjectFeaturedAssetKeys([approved])).toEqual(
      new Set(["image:approved-project"]),
    );
    const draftWithAsset = {
      ...approved,
      intendedStatus: "draft" as const,
    };
    const publishedWithoutApproval = {
      ...approved,
      canonicalPayloadApproved: false,
    };
    expect(
      approvedProjectFeaturedAssetKeys([
        draftWithAsset,
        publishedWithoutApproval,
      ]).size,
    ).toBe(0);

    const notApproved = structuredClone(FRONTEND_CONTENT_MANIFEST) as unknown as {
      projects: Array<{ intendedStatus: "draft" | "published" }>;
    };
    notApproved.projects[0]!.intendedStatus = "published";
    expect(() => validateFrontendContentManifest(notApproved)).toThrow(
      "persetujuan pemilik",
    );
  });

  it("keeps service candidates inactive until canonical approval", () => {
    const service = FRONTEND_CONTENT_MANIFEST.services[0]!;
    expect(shouldActivateService(service)).toBe(false);
    expect(classifyImportItem(service)).toBe("needs_review");

    const approved = {
      ...service,
      intendedStatus: "active" as const,
      canonicalPayloadApproved: true,
      reviewFlags: [],
      payload: { ...service.payload, isActive: true },
    };
    expect(shouldActivateService(approved)).toBe(true);

    const invalid = structuredClone(FRONTEND_CONTENT_MANIFEST) as unknown as {
      services: Array<{
        intendedStatus: "draft" | "active";
        canonicalPayloadApproved: boolean;
        payload: { isActive: boolean };
        reviewFlags: string[];
      }>;
    };
    invalid.services[0]!.intendedStatus = "active";
    invalid.services[0]!.payload.isActive = true;
    invalid.services[0]!.reviewFlags = [];
    expect(() => validateFrontendContentManifest(invalid)).toThrow(
      "payload kanonis disetujui",
    );
  });

  it("rejects duplicated source keys and broken asset relations", () => {
    const duplicated = structuredClone(
      FRONTEND_CONTENT_MANIFEST,
    ) as unknown as {
      projects: Array<{ sourceKey: string }>;
    };
    duplicated.projects[1]!.sourceKey = duplicated.projects[0]!.sourceKey;
    expect(() => validateFrontendContentManifest(duplicated)).toThrow(
      "sourceKey konten duplikat",
    );

    const broken = structuredClone(FRONTEND_CONTENT_MANIFEST) as unknown as {
      projects: Array<{ payload: { featuredImageSourceKey: string } }>;
    };
    broken.projects[0]!.payload.featuredImageSourceKey = "image:not-present";
    expect(() => validateFrontendContentManifest(broken)).toThrow(
      "Referensi aset image:not-present tidak ditemukan",
    );
  });

  it("rejects fields outside the explicitly supported content collections", () => {
    const withTransactions = {
      ...FRONTEND_CONTENT_MANIFEST,
      transactions: [{ amount: 100 }],
    };
    expect(() => validateFrontendContentManifest(withTransactions)).toThrow();
  });

  it("classifies review and media prerequisites without making writes", () => {
    const manifest = validateFrontendContentManifest(FRONTEND_CONTENT_MANIFEST);
    const project = manifest.projects[0]!;
    expect(classifyImportItem(project)).toBe("conflict");

    const reviewed = {
      ...project,
      conflicts: [],
      reviewFlags: [],
    } satisfies FrontendProjectEntry;
    expect(classifyImportItem(reviewed)).toBe("media_pending");
    expect(classifyImportItem(reviewed, { mediaReady: true })).toBe("create");
    expect(classifyImportItem(reviewed, { naturalKeyMatches: 1 })).toBe(
      "needs_mapping",
    );
    expect(classifyImportItem(reviewed, { naturalKeyMatches: 2 })).toBe(
      "conflict",
    );
  });

  it("never recreates a trashed or missing target and preserves edits on rerun", () => {
    const manifest = validateFrontendContentManifest(FRONTEND_CONTENT_MANIFEST);
    const entry = {
      ...manifest.services[0]!,
      reviewFlags: [],
    };
    const checksumAtImport = sourceChecksum(entry);
    const payloadHash = payloadChecksum(entry.payload);
    const base = {
      targetId: "00000000-0000-4000-8000-000000000001",
      sourceChecksum: checksumAtImport,
      importedPayloadChecksum: payloadHash,
      currentPayloadChecksum: payloadHash,
    } as const;

    expect(
      classifyImportItem(entry, {
        existing: { ...base, targetState: "trashed" },
      }),
    ).toBe("target_deleted_review");
    expect(
      classifyImportItem(entry, {
        existing: { ...base, targetState: "missing" },
      }),
    ).toBe("target_deleted_review");
    expect(
      classifyImportItem(entry, {
        existing: {
          ...base,
          targetState: "active",
          currentPayloadChecksum: "edited",
        },
      }),
    ).toBe("target_edited_skipped");
    expect(
      classifyImportItem(entry, {
        existing: {
          ...base,
          targetState: "active",
          sourceChecksum: "new-source",
        },
      }),
    ).toBe("source_changed_skipped");
    expect(
      classifyImportItem(entry, {
        existing: { ...base, targetState: "active" },
      }),
    ).toBe("reuse");
  });

  it("restricts media to local public/images and detects MIME from file bytes", () => {
    expect(assertPublicImagePath("public/images/photo.jpg")).toBe(
      "public/images/photo.jpg",
    );
    for (const path of [
      "../secrets.jpg",
      "public/images/../secrets.jpg",
      "https://example.com/image.jpg",
      "public/prototype/image.svg",
      "public\\images\\photo.jpg",
    ])
      expect(() => assertPublicImagePath(path)).toThrow();

    expect(detectImageMimeType(Uint8Array.from([0xff, 0xd8, 0xff, 0x00]))).toBe(
      "image/jpeg",
    );
    expect(
      detectImageMimeType(
        Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
    ).toBe("image/png");
    expect(
      detectImageMimeType(
        Uint8Array.from([
          ...Buffer.from("RIFF"),
          0,
          0,
          0,
          0,
          ...Buffer.from("WEBP"),
        ]),
      ),
    ).toBe("image/webp");
    expect(detectImageMimeType(new Uint8Array([0, 1, 2]))).toBeNull();
  });

  it("computes stable checksums and changes when the frozen payload changes", () => {
    const manifest = validateFrontendContentManifest(FRONTEND_CONTENT_MANIFEST);
    expect(checksum({ b: 2, a: 1 })).toBe(checksum({ a: 1, b: 2 }));
    expect(manifestChecksum(manifest)).toMatch(/^[a-f0-9]{64}$/);

    const entry = manifest.projects[0]!;
    expect(sourceChecksum({ ...entry, sourceVersion: "changed" })).not.toBe(
      sourceChecksum(entry),
    );
    expect(payloadChecksum({ title: "changed" })).not.toBe(
      payloadChecksum(entry.payload),
    );
  });
});
