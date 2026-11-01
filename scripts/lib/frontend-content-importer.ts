import { createInterface } from "node:readline/promises";
import { stdin, stderr, stdout } from "node:process";
import { basename, isAbsolute, join, relative, resolve, sep } from "node:path";
import { readFile, realpath, stat } from "node:fs/promises";
import postgres from "postgres";
import sharp from "sharp";
import { createDatabase } from "@/db/connection";
import { createMediaStore } from "@/db/media-store";
import { validateBootstrapTarget } from "@/auth/bootstrap-target";
import { createR2MediaStorage } from "@/lib/server/r2-media-storage";
import { importMediaAsset } from "@/services/media";
import { projectInputSchema, type ProjectInput } from "@/schemas/projects";
import { serviceInputSchema } from "@/schemas/services";
import {
  FRONTEND_CONTENT_MANIFEST,
  type FrontendContentManifest,
  type FrontendProjectEntry,
  type FrontendServiceEntry,
  type FrontendAssetEntry,
} from "@/seed/frontend-content/manifest";
import {
  assertPublicImagePath,
  approvedProjectFeaturedAssetKeys,
  classifyImportItem,
  detectImageMimeType,
  expectedImageMimeType,
  manifestChecksum,
  payloadChecksum,
  sha256,
  shouldActivateService,
  shouldPublishProject,
  sourceChecksum,
  validateFrontendContentManifest,
  type ImportDecision,
  type LocalAssetInspection,
} from "@/seed/frontend-content/validation";
import { hasOperatorConfirmation } from "./operator-confirmation";

const DATASET_KEY = "openbyte-frontend-r1";
const TARGET_HOST = "ep-calm-mouse-azykslas.c-3.ap-southeast-1.aws.neon.tech";
const TARGET_DATABASE = "openbyte_labs_dev";
const STAGING_BUCKET = "openbytelabs-staging";
const PUBLIC_BUCKET = "openbytelabs";
const PUBLIC_R2_HOST = "pub-56e1d9e9745541f7bbe1141aa7cc3be3.r2.dev";
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 40_000_000;
const MAX_DIMENSION = 10_000;

type SqlSession = postgres.Sql | postgres.TransactionSql;
type Collection = "projects" | "services" | "media";
type TaxonomyCollection = "categories" | "technologies";
type ImportCollection = Collection | TaxonomyCollection;

interface Target {
  uri: string;
  host: string;
  database: string;
}

interface PreparedAsset {
  inspection: LocalAssetInspection;
  bytes: Uint8Array;
}

interface TaxonomyRow {
  id: string;
  name: string;
  slug: string;
}

interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  client_name: string | null;
  year: number | null;
  featured_image_id: string | null;
  gallery: unknown;
  summary: string;
  content_blocks: unknown;
  links: unknown;
  is_featured: boolean;
  status: "draft" | "published";
  meta_title: string | null;
  meta_description: string | null;
  og_image_id: string | null;
  sort_order: number;
  deleted_at: Date | null;
  category_ids: string[];
  technology_ids: string[];
}

interface ServiceRow {
  id: string;
  title: string;
  description: string;
  highlights: unknown;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

interface MediaRow {
  id: string;
  key: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt: string;
  uploaded_by: string | null;
  finalized_at: Date | null;
  deleted_at: Date | null;
}

interface MarkerRow {
  collection: ImportCollection;
  doc_id: string;
  action: string;
  diff: unknown;
  created_at: Date;
}

interface ImportMarker {
  collection: ImportCollection;
  targetId: string;
  action: string;
  createdAt: Date;
  diff: Record<string, unknown>;
}

interface FoundationCounts {
  categories: number;
  servicePackages: number;
  serviceAddons: number;
  faqs: number;
  activeFaqs: number;
  trackingFaqs: number;
  calculatorGroups: number;
  calculatorItems: number;
}

interface Snapshot {
  categories: TaxonomyRow[];
  technologies: TaxonomyRow[];
  projects: ProjectRow[];
  services: ServiceRow[];
  media: MediaRow[];
  markers: ImportMarker[];
  foundation: FoundationCounts;
}

interface TaxonomyPlanItem {
  collection: TaxonomyCollection;
  name: string;
  slug: string;
  sourceKeys: string[];
  action: "create" | "reuse" | "conflict";
  id?: string;
}

interface AssetPlanItem {
  entry: FrontendAssetEntry;
  prepared: PreparedAsset;
  id: string;
  decision: ImportDecision;
  targetId?: string;
  reason?: string;
}

interface ProjectPlanItem {
  entry: FrontendProjectEntry;
  decision: ImportDecision;
  targetId?: string;
  reason?: string;
}

interface ServicePlanItem {
  entry: FrontendServiceEntry;
  decision: ImportDecision;
  targetId?: string;
  reason?: string;
}

interface ImportPlan {
  assets: AssetPlanItem[];
  projects: ProjectPlanItem[];
  services: ServicePlanItem[];
  taxonomy: TaxonomyPlanItem[];
  manifestChecksum: string;
}

interface ImportResult {
  sourceKey: string;
  collection: Collection | TaxonomyCollection;
  decision: string;
  targetId?: string;
  note?: string;
}

interface Counters {
  taxonomyCreated: number;
  mediaUploaded: number;
  mediaReused: number;
  servicesCreated: number;
  servicesReused: number;
  projectsCreated: number;
  projectsReused: number;
  failures: number;
}

function cliMode(): "dry-run" | "apply" {
  const args = process.argv.slice(2);
  const allowed = args.filter(
    (arg) => arg === "--dry-run" || arg === "--apply" || arg.startsWith("--confirm-target="),
  );
  if (allowed.length !== args.length)
    throw new Error("Flag yang didukung: --dry-run, --apply, dan --confirm-target=...");
  if (args.includes("--dry-run") && args.includes("--apply"))
    throw new Error("Pilih salah satu mode: --dry-run atau --apply.");
  return args.includes("--apply") ? "apply" : "dry-run";
}

async function confirmDirectTarget(): Promise<Target> {
  const uri = process.env.DATABASE_URI_DIRECT ?? process.env.DATABASE_DIRECT_URL ?? "";
  const approvedTarget = process.env.DATABASE_SEED_TARGET ?? "";
  const target = validateBootstrapTarget(uri, approvedTarget);
  if (target.host !== TARGET_HOST || target.database !== TARGET_DATABASE)
    throw new Error("Importer hanya diizinkan menuju Neon branch dev yang telah ditetapkan.");

  if (stdin.isTTY && stdout.isTTY) {
    const terminal = createInterface({ input: stdin, output: stdout });
    try {
      stdout.write(`Target langsung: ${target.host}/${target.database}\n`);
      if ((await terminal.question("Ketik nama database untuk melanjutkan: ")) !== TARGET_DATABASE)
        throw new Error("Konfirmasi target tidak cocok.");
    } finally {
      terminal.close();
    }
  } else if (!hasOperatorConfirmation(process.argv, TARGET_DATABASE)) {
    throw new Error(`Mode non-interaktif memerlukan --confirm-target=${TARGET_DATABASE}.`);
  }

  return { uri, host: target.host, database: target.database };
}

function assertR2Target(): void {
  if (
    process.env.R2_BUCKET_STAGING !== STAGING_BUCKET ||
    process.env.R2_BUCKET_PUBLIC !== PUBLIC_BUCKET
  )
    throw new Error("Nama bucket R2 tidak cocok dengan resource staging dan publik yang diverifikasi.");
  let publicUrl: URL;
  try {
    publicUrl = new URL(process.env.R2_PUBLIC_BASE_URL ?? "");
  } catch {
    throw new Error("URL publik R2 belum dikonfigurasi.");
  }
  if (publicUrl.hostname !== PUBLIC_R2_HOST || publicUrl.protocol !== "https:")
    throw new Error("URL publik R2 tidak cocok dengan domain bucket yang diverifikasi.");
}

async function inspectAsset(
  root: string,
  imagesRoot: string,
  asset: FrontendAssetEntry,
): Promise<PreparedAsset> {
  const sourcePath = assertPublicImagePath(asset.sourcePath);
  const candidate = resolve(root, sourcePath);
  const candidateRelativeToImages = relative(imagesRoot, candidate);
  if (
    isAbsolute(candidateRelativeToImages) ||
    candidateRelativeToImages === ".." ||
    candidateRelativeToImages.startsWith(`..${sep}`)
  )
    throw new Error(`Path media ${asset.sourceKey} berada di luar public/images.`);

  const resolved = await realpath(candidate);
  const resolvedRelativeToImages = relative(imagesRoot, resolved);
  if (
    isAbsolute(resolvedRelativeToImages) ||
    resolvedRelativeToImages === ".." ||
    resolvedRelativeToImages.startsWith(`..${sep}`)
  )
    throw new Error(`Path media ${asset.sourceKey} melalui symlink di luar public/images.`);

  const file = await stat(resolved);
  if (!file.isFile()) throw new Error(`Aset ${asset.sourceKey} bukan file reguler.`);
  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES)
    throw new Error(`Ukuran aset ${asset.sourceKey} tidak didukung.`);

  const bytes = await readFile(resolved);
  const detectedMime = detectImageMimeType(bytes);
  if (
    detectedMime !== asset.expectedMimeType ||
    detectedMime !== expectedImageMimeType(sourcePath)
  )
    throw new Error(`Tipe isi aset ${asset.sourceKey} tidak cocok dengan manifest.`);

  const metadata = await sharp(bytes, {
    failOn: "error",
    limitInputPixels: MAX_IMAGE_PIXELS,
    sequentialRead: true,
  }).metadata();
  if (
    !metadata.width ||
    !metadata.height ||
    metadata.width > MAX_DIMENSION ||
    metadata.height > MAX_DIMENSION ||
    metadata.width * metadata.height > MAX_IMAGE_PIXELS ||
    (metadata.pages ?? 1) > 1
  )
    throw new Error(`Dimensi atau jumlah frame aset ${asset.sourceKey} tidak didukung.`);

  return {
    bytes,
    inspection: {
      sourceKey: asset.sourceKey,
      sourcePath,
      mimeType: detectedMime,
      sizeBytes: bytes.byteLength,
      width: metadata.width,
      height: metadata.height,
      sha256: sha256(bytes),
    },
  };
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
}

function deterministicUuid(sourceKey: string): string {
  const chars = sha256(`${DATASET_KEY}:${sourceKey}`).slice(0, 32).split("");
  chars[12] = "5";
  chars[16] = ((Number.parseInt(chars[16]!, 16) & 0x3) | 0x8).toString(16);
  const hex = chars.join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
        return parsed as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

async function readSnapshot(session: SqlSession): Promise<Snapshot> {
  const categories = await session<TaxonomyRow[]>`
    SELECT id::text AS id, name, slug FROM categories ORDER BY name
  `;
  const technologies = await session<TaxonomyRow[]>`
    SELECT id::text AS id, name, slug FROM technologies ORDER BY name
  `;
  const projects = await session<ProjectRow[]>`
    SELECT
      p.id::text AS id, p.title, p.slug, p.tagline, p.client_name, p.year,
      p.featured_image_id::text AS featured_image_id, p.gallery, p.summary,
      p.content_blocks, p.links, p.is_featured, p.status, p.meta_title,
      p.meta_description, p.og_image_id::text AS og_image_id, p.sort_order,
      p.deleted_at,
      COALESCE((
        SELECT array_agg(pc.category_id::text ORDER BY c.sort_order, c.name)
        FROM project_categories pc
        JOIN categories c ON c.id = pc.category_id
        WHERE pc.project_id = p.id
      ), ARRAY[]::text[]) AS category_ids,
      COALESCE((
        SELECT array_agg(pt.technology_id::text ORDER BY pt.sort_order, t.name)
        FROM project_technologies pt
        JOIN technologies t ON t.id = pt.technology_id
        WHERE pt.project_id = p.id
      ), ARRAY[]::text[]) AS technology_ids
    FROM projects p
  `;
  const services = await session<ServiceRow[]>`
    SELECT id::text AS id, title, description, highlights, icon, is_active, sort_order
    FROM services
  `;
  const media = await session<MediaRow[]>`
    SELECT id::text AS id, key, filename, mime_type, size_bytes, width, height,
      alt, uploaded_by, finalized_at, deleted_at
    FROM media
  `;
  const markerRows = await session<MarkerRow[]>`
    SELECT collection, doc_id, action, diff, created_at
    FROM audit_logs
    WHERE actor_type = 'system'
      AND action IN ('import', 'import_started', 'import_complete')
      AND diff->>'datasetKey' = ${DATASET_KEY}
    ORDER BY created_at ASC, id ASC
  `;
  const markers = markerRows.map((row) => ({
    collection: row.collection,
    targetId: row.doc_id,
    action: row.action,
    createdAt: row.created_at,
    diff: asRecord(row.diff),
  }));
  const [foundationRow] = await session<{
    categories: number;
    service_packages: number;
    service_addons: number;
    faqs: number;
    active_faqs: number;
    tracking_faqs: number;
    calculator_groups: number;
    calculator_items: number;
  }[]>`
    SELECT
      (SELECT count(*)::int FROM categories) AS categories,
      (SELECT count(*)::int FROM service_packages) AS service_packages,
      (SELECT count(*)::int FROM service_addons) AS service_addons,
      (SELECT count(*)::int FROM faqs) AS faqs,
      (SELECT count(*)::int FROM faqs WHERE is_active AND NOT requires_tracking) AS active_faqs,
      (SELECT count(*)::int FROM faqs WHERE requires_tracking) AS tracking_faqs,
      (SELECT count(*)::int FROM calculator_groups) AS calculator_groups,
      (SELECT count(*)::int FROM calculator_items) AS calculator_items
  `;
  if (!foundationRow) throw new Error("Snapshot fondasi database tidak tersedia.");
  return {
    categories,
    technologies,
    projects,
    services,
    media,
    markers,
    foundation: {
      categories: foundationRow.categories,
      servicePackages: foundationRow.service_packages,
      serviceAddons: foundationRow.service_addons,
      faqs: foundationRow.faqs,
      activeFaqs: foundationRow.active_faqs,
      trackingFaqs: foundationRow.tracking_faqs,
      calculatorGroups: foundationRow.calculator_groups,
      calculatorItems: foundationRow.calculator_items,
    },
  };
}

function latestMarker(
  snapshot: Snapshot,
  collection: Collection,
  sourceKey: string,
): ImportMarker | undefined {
  for (let index = snapshot.markers.length - 1; index >= 0; index -= 1) {
    const marker = snapshot.markers[index]!;
    if (marker.collection === collection && marker.diff.sourceKey === sourceKey)
      return marker;
  }
  return undefined;
}

function taxonomyPlan(
  manifest: FrontendContentManifest,
  collection: TaxonomyCollection,
  rows: TaxonomyRow[],
): TaxonomyPlanItem[] {
  const projects = manifest.projects;
  const expected = new Map<string, { name: string; sourceKeys: string[] }>();
  for (const project of projects) {
    const values =
      collection === "categories"
        ? project.payload.categoryNames
        : project.payload.technologies;
    for (const name of values) {
      const key = name.trim().toLocaleLowerCase("id-ID");
      const item = expected.get(key) ?? { name, sourceKeys: [] };
      if (!item.sourceKeys.includes(project.sourceKey))
        item.sourceKeys.push(project.sourceKey);
      expected.set(key, item);
    }
  }

  return [...expected.values()].map(({ name, sourceKeys }) => {
    const slug = slugify(name);
    const normalizedName = name.trim().toLocaleLowerCase("id-ID");
    const nameMatches = rows.filter(
      (row) => row.name.trim().toLocaleLowerCase("id-ID") === normalizedName,
    );
    if (nameMatches.length === 1)
      return { collection, name, slug, sourceKeys, action: "reuse", id: nameMatches[0]!.id };
    if (nameMatches.length > 1)
      return { collection, name, slug, sourceKeys, action: "conflict" };
    const slugMatches = rows.filter((row) => row.slug === slug);
    if (slugMatches.length > 0)
      return { collection, name, slug, sourceKeys, action: "conflict" };
    return { collection, name, slug, sourceKeys, action: "create" };
  });
}

function mediaPlan(
  entry: FrontendAssetEntry,
  prepared: PreparedAsset,
  snapshot: Snapshot,
): AssetPlanItem {
  const id = deterministicUuid(entry.sourceKey);
  const marker = latestMarker(snapshot, "media", entry.sourceKey);
  const current = snapshot.media.find((item) => item.id === (marker?.targetId ?? id));
  const filename = basename(prepared.inspection.sourcePath);
  const contentHash = payloadChecksum({
    filename,
    alt: entry.altCandidate,
    mimeType: prepared.inspection.mimeType,
    sizeBytes: prepared.inspection.sizeBytes,
    sha256: prepared.inspection.sha256,
  });

  if (marker) {
    if (
      marker.targetId !== id ||
      marker.diff.sourceChecksum !== prepared.inspection.sha256 ||
      marker.diff.importedPayloadChecksum !== contentHash
    )
      return { entry, prepared, id, decision: "source_changed_skipped", targetId: marker.targetId };
    if (!current) {
      return marker.diff.stage === "started"
        ? { entry, prepared, id, decision: "create", targetId: id }
        : { entry, prepared, id, decision: "target_deleted_review", targetId: id };
    }
    if (current.deleted_at)
      return { entry, prepared, id, decision: "target_deleted_review", targetId: current.id };
    if (current.finalized_at) {
      const matchesImportedValue =
        current.filename === filename &&
        current.size_bytes === prepared.inspection.sizeBytes &&
        current.width === prepared.inspection.width &&
        current.height === prepared.inspection.height &&
        current.alt === entry.altCandidate;
      return {
        entry,
        prepared,
        id,
        decision: matchesImportedValue ? "reuse" : "target_edited_skipped",
        targetId: current.id,
      };
    }
    return current.key === `pending/${id}/source` && current.uploaded_by === null
      ? { entry, prepared, id, decision: "create", targetId: id }
      : { entry, prepared, id, decision: "conflict", targetId: current.id };
  }

  if (current)
    return { entry, prepared, id, decision: "conflict", targetId: current.id };
  const filenameMatches = snapshot.media.filter(
    (item) => item.filename.toLowerCase() === filename.toLowerCase(),
  );
  if (filenameMatches.length > 0)
    return {
      entry,
      prepared,
      id,
      decision: "needs_mapping",
      targetId: filenameMatches[0]!.id,
      reason: "Media dengan nama file sama sudah ada tanpa penanda sumber impor.",
    };
  return { entry, prepared, id, decision: "create" };
}

function projectInputForExisting(row: ProjectRow): ProjectInput | null {
  const parsed = projectInputSchema.safeParse({
    title: row.title,
    slug: row.slug,
    tagline: row.tagline,
    clientName: row.client_name,
    year: row.year,
    featuredImageId: row.featured_image_id,
    gallery: row.gallery,
    summary: row.summary,
    contentBlocks: row.content_blocks,
    links: row.links,
    isFeatured: row.is_featured,
    categoryIds: row.category_ids,
    technologyIds: row.technology_ids,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    ogImageId: row.og_image_id,
    sortOrder: row.sort_order,
  });
  return parsed.success ? parsed.data : null;
}

function projectDecision(
  entry: FrontendProjectEntry,
  snapshot: Snapshot,
  taxonomy: TaxonomyPlanItem[],
  assets: AssetPlanItem[],
): ProjectPlanItem {
  const marker = latestMarker(snapshot, "projects", entry.sourceKey);
  const naturalMatches = snapshot.projects.filter((row) => row.slug === entry.payload.slug);
  if (marker) {
    const row = snapshot.projects.find((item) => item.id === marker.targetId);
    const currentInput = row ? projectInputForExisting(row) : null;
    const targetState = !row
      ? "missing"
      : row.deleted_at || row.status !== entry.intendedStatus
        ? "trashed"
        : "active";
    const decision = classifyProject(entry, {
      existing: {
        targetId: marker.targetId,
        targetState,
        sourceChecksum: String(marker.diff.sourceChecksum ?? ""),
        importedPayloadChecksum: String(marker.diff.importedPayloadChecksum ?? ""),
        currentPayloadChecksum: currentInput ? payloadChecksum(currentInput) : null,
      },
    });
    return { entry, decision, targetId: marker.targetId };
  }

  const matchingTaxonomy = taxonomy.filter(
    (item) =>
      item.action === "conflict" &&
      (entry.payload.categoryNames.includes(item.name) ||
        entry.payload.technologies.includes(item.name)),
  );
  if (matchingTaxonomy.length > 0)
    return { entry, decision: "conflict", reason: "Kategori atau teknologi memiliki slug yang berbenturan." };
  if (naturalMatches.length > 0) {
    const decision = classifyProject(entry, { naturalKeyMatches: naturalMatches.length });
    return {
      entry,
      decision,
      targetId: naturalMatches.length === 1 ? naturalMatches[0]!.id : undefined,
      reason: "Slug proyek sudah dipakai; record existing tidak akan ditimpa.",
    };
  }
  if (!shouldPublishProject(entry)) {
    const decision = classifyProject(entry, { mediaReady: true });
    return {
      entry,
      decision: decision === "create" ? "needs_review" : decision,
      reason: "Proyek dan aset ditahan sampai status published serta payload disetujui pemilik.",
    };
  }
  const featuredImageSourceKey = entry.payload.featuredImageSourceKey;
  if (!featuredImageSourceKey)
    return {
      entry,
      decision: "media_pending",
      reason: "Gambar utama proyek belum ditetapkan untuk publikasi.",
    };
  const asset = assets.find((item) => item.entry.sourceKey === featuredImageSourceKey);
  if (!asset || !["create", "reuse"].includes(asset.decision))
    return {
      entry,
      decision: asset?.decision ?? "media_pending",
      targetId: asset?.targetId,
      reason: asset?.reason ?? "Media utama belum dapat dipetakan.",
    };
  return { entry, decision: classifyProject(entry, { mediaReady: true }) };
}

function classifyProject(
  entry: FrontendProjectEntry,
  options: Parameters<typeof classifyImportItem>[1] = {},
): ImportDecision {
  return classifyImportItem(entry, options);
}

function serviceInputForExisting(row: ServiceRow) {
  const parsed = serviceInputSchema.safeParse({
    title: row.title,
    description: row.description,
    highlights: row.highlights,
    icon: row.icon,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  });
  return parsed.success ? parsed.data : null;
}

function serviceDecision(
  entry: FrontendServiceEntry,
  snapshot: Snapshot,
): ServicePlanItem {
  const marker = latestMarker(snapshot, "services", entry.sourceKey);
  if (marker) {
    const row = snapshot.services.find((item) => item.id === marker.targetId);
    const currentInput = row ? serviceInputForExisting(row) : null;
    const decision = classifyImportItem(entry, {
      existing: {
        targetId: marker.targetId,
        targetState: !row ? "missing" : row.is_active ? "active" : "trashed",
        sourceChecksum: String(marker.diff.sourceChecksum ?? ""),
        importedPayloadChecksum: String(marker.diff.importedPayloadChecksum ?? ""),
        currentPayloadChecksum: currentInput ? payloadChecksum(currentInput) : null,
      },
    });
    return { entry, decision, targetId: marker.targetId };
  }

  const naturalMatches = snapshot.services.filter(
    (row) => row.title.trim().toLocaleLowerCase("id-ID") === entry.payload.title.trim().toLocaleLowerCase("id-ID"),
  );
  return {
    entry,
    decision: classifyImportItem(entry, { naturalKeyMatches: naturalMatches.length }),
    targetId: naturalMatches.length === 1 ? naturalMatches[0]!.id : undefined,
    reason: naturalMatches.length
      ? "Nama layanan sudah ada; record existing tidak akan ditimpa."
      : undefined,
  };
}

function buildPlan(
  manifest: FrontendContentManifest,
  preparedAssets: Map<string, PreparedAsset>,
  snapshot: Snapshot,
): ImportPlan {
  const categories = taxonomyPlan(manifest, "categories", snapshot.categories);
  const technologies = taxonomyPlan(manifest, "technologies", snapshot.technologies);
  const taxonomy = [...categories, ...technologies];
  const requiredAssetKeys = approvedProjectFeaturedAssetKeys(manifest.projects);
  const assets = manifest.assets
    .filter((entry) => requiredAssetKeys.has(entry.sourceKey))
    .map((entry) => {
      const prepared = preparedAssets.get(entry.sourceKey);
      if (!prepared) throw new Error(`Pemeriksaan aset ${entry.sourceKey} tidak tersedia.`);
      return mediaPlan(entry, prepared, snapshot);
    });
  return {
    assets,
    projects: manifest.projects.map((entry) =>
      projectDecision(entry, snapshot, taxonomy, assets),
    ),
    services: manifest.services.map((entry) => serviceDecision(entry, snapshot)),
    taxonomy,
    manifestChecksum: manifestChecksum(manifest),
  };
}

function projectInputForImport(
  entry: FrontendProjectEntry,
  imageId: string,
  categories: Map<string, string>,
  technologies: Map<string, string>,
): ProjectInput {
  return projectInputSchema.parse({
    title: entry.payload.title,
    slug: entry.payload.slug,
    tagline: entry.payload.tagline,
    clientName: entry.payload.clientName,
    year: entry.payload.year,
    featuredImageId: imageId,
    gallery: [],
    summary: entry.payload.summary,
    contentBlocks: entry.payload.contentBlocks,
    links: entry.payload.links,
    isFeatured: entry.payload.isFeatured,
    categoryIds: entry.payload.categoryNames.map((name) => {
      const id = categories.get(name.trim().toLocaleLowerCase("id-ID"));
      if (!id) throw new Error(`Kategori proyek ${entry.sourceKey} belum tersedia.`);
      return id;
    }),
    technologyIds: entry.payload.technologies.map((name) => {
      const id = technologies.get(name.trim().toLocaleLowerCase("id-ID"));
      if (!id) throw new Error(`Teknologi proyek ${entry.sourceKey} belum tersedia.`);
      return id;
    }),
    metaTitle: null,
    metaDescription: null,
    ogImageId: null,
    sortOrder: entry.payload.sortOrder,
  });
}

async function writeAudit(
  session: SqlSession,
  input: {
    collection: string;
    docId: string;
    action: string;
    summary: string;
    diff?: Record<string, unknown>;
  },
): Promise<void> {
  await session`
    INSERT INTO audit_logs (actor_id, actor_type, action, collection, doc_id, summary, diff)
    VALUES (NULL, 'system', ${input.action}, ${input.collection}, ${input.docId},
      ${input.summary}, ${input.diff ? session.json(input.diff) : null}::jsonb)
  `;
}

async function ensureTaxonomy(
  db: postgres.Sql,
  plan: ImportPlan,
  counters: Counters,
  results: ImportResult[],
): Promise<{ categories: Map<string, string>; technologies: Map<string, string> }> {
  const createdIds: Record<TaxonomyCollection, Map<string, string>> = {
    categories: new Map(),
    technologies: new Map(),
  };
  for (const item of plan.taxonomy) {
    if (item.action === "conflict") continue;
    if (item.action === "reuse" && item.id) {
      createdIds[item.collection].set(item.name.trim().toLocaleLowerCase("id-ID"), item.id);
      continue;
    }
    await db.begin(async (tx) => {
      let row: TaxonomyRow | undefined;
      if (item.collection === "categories") {
        [row] = await tx<TaxonomyRow[]>`
          INSERT INTO categories (name, slug, icon, show_in_filter, is_active, sort_order)
          VALUES (${item.name}, ${item.slug}, '', TRUE, TRUE,
            1000 + (SELECT count(*)::int FROM categories))
          ON CONFLICT (slug) DO NOTHING
          RETURNING id::text AS id, name, slug
        `;
      } else {
        [row] = await tx<TaxonomyRow[]>`
          INSERT INTO technologies (name, slug, icon, color)
          VALUES (${item.name}, ${item.slug}, '', '#000000')
          ON CONFLICT (slug) DO NOTHING
          RETURNING id::text AS id, name, slug
        `;
      }
      if (!row) {
        const existing =
          item.collection === "categories"
            ? await tx<TaxonomyRow[]>`SELECT id::text AS id, name, slug FROM categories WHERE slug = ${item.slug}`
            : await tx<TaxonomyRow[]>`SELECT id::text AS id, name, slug FROM technologies WHERE slug = ${item.slug}`;
        row = existing[0];
      }
      if (!row || row.name !== item.name)
        throw new Error(`Slug taksonomi ${item.slug} berubah saat impor; tidak ada data yang ditimpa.`);
      await writeAudit(tx, {
        collection: item.collection,
        docId: row.id,
        action: "import",
        summary: "Taksonomi dibuat dari manifest konten frontend",
        diff: {
          datasetKey: DATASET_KEY,
          sourceKey: item.sourceKeys.join(","),
          sourceKeys: item.sourceKeys,
          name: item.name,
          slug: item.slug,
          stage: "complete",
        },
      });
      createdIds[item.collection].set(item.name.trim().toLocaleLowerCase("id-ID"), row.id);
    });
    counters.taxonomyCreated += 1;
    results.push({
      sourceKey: item.sourceKeys.join(","),
      collection: item.collection,
      decision: "created",
    });
  }

  const categoryRows = await db<TaxonomyRow[]>`
    SELECT id::text AS id, name, slug FROM categories
  `;
  const technologyRows = await db<TaxonomyRow[]>`
    SELECT id::text AS id, name, slug FROM technologies
  `;
  for (const row of categoryRows)
    createdIds.categories.set(row.name.trim().toLocaleLowerCase("id-ID"), row.id);
  for (const row of technologyRows)
    createdIds.technologies.set(row.name.trim().toLocaleLowerCase("id-ID"), row.id);
  return createdIds;
}

async function recordMediaStart(
  db: postgres.Sql,
  item: AssetPlanItem,
): Promise<void> {
  const filename = basename(item.prepared.inspection.sourcePath);
  const importedPayloadChecksum = payloadChecksum({
    filename,
    alt: item.entry.altCandidate,
    mimeType: item.prepared.inspection.mimeType,
    sizeBytes: item.prepared.inspection.sizeBytes,
    sha256: item.prepared.inspection.sha256,
  });
  const [existing] = await db<MarkerRow[]>`
    SELECT collection, doc_id, action, diff, created_at
    FROM audit_logs
    WHERE actor_type = 'system'
      AND collection = 'media'
      AND diff->>'datasetKey' = ${DATASET_KEY}
      AND diff->>'sourceKey' = ${item.entry.sourceKey}
      AND action IN ('import_started', 'import_complete')
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `;
  if (existing) return;
  await writeAudit(db, {
    collection: "media",
    docId: item.id,
    action: "import_started",
    summary: "Import media R2 dimulai",
    diff: {
      datasetKey: DATASET_KEY,
      sourceKey: item.entry.sourceKey,
      sourceChecksum: item.prepared.inspection.sha256,
      importedPayloadChecksum,
      stage: "started",
    },
  });
}

async function recordMediaComplete(
  db: postgres.Sql,
  item: AssetPlanItem,
): Promise<void> {
  const filename = basename(item.prepared.inspection.sourcePath);
  await writeAudit(db, {
    collection: "media",
    docId: item.id,
    action: "import_complete",
    summary: "Import media R2 selesai",
    diff: {
      datasetKey: DATASET_KEY,
      sourceKey: item.entry.sourceKey,
      sourceChecksum: item.prepared.inspection.sha256,
      importedPayloadChecksum: payloadChecksum({
        filename,
        alt: item.entry.altCandidate,
        mimeType: item.prepared.inspection.mimeType,
        sizeBytes: item.prepared.inspection.sizeBytes,
        sha256: item.prepared.inspection.sha256,
      }),
      stage: "complete",
    },
  });
}

async function importAssets(
  db: postgres.Sql,
  storage: ReturnType<typeof createR2MediaStorage>,
  mediaStore: ReturnType<typeof createMediaStore>,
  plan: ImportPlan,
  counters: Counters,
  results: ImportResult[],
): Promise<Map<string, string>> {
  const ids = new Map<string, string>();
  for (const item of plan.assets) {
    if (item.decision === "reuse" && item.targetId) {
      ids.set(item.entry.sourceKey, item.targetId);
      counters.mediaReused += 1;
      results.push({ sourceKey: item.entry.sourceKey, collection: "media", decision: "reused", targetId: item.targetId });
      continue;
    }
    if (item.decision !== "create") {
      results.push({ sourceKey: item.entry.sourceKey, collection: "media", decision: item.decision, targetId: item.targetId, note: item.reason });
      continue;
    }
    try {
      await recordMediaStart(db, item);
      const asset = await importMediaAsset(mediaStore, storage, {
        id: item.id,
        filename: basename(item.prepared.inspection.sourcePath),
        mimeType: item.prepared.inspection.mimeType,
        bytes: item.prepared.bytes,
        alt: item.entry.altCandidate,
      });
      if (!asset.finalizedAt || asset.deletedAt)
        throw new Error("Media tidak berstatus final.");
      await recordMediaComplete(db, item);
      ids.set(item.entry.sourceKey, asset.id);
      counters.mediaUploaded += 1;
      results.push({ sourceKey: item.entry.sourceKey, collection: "media", decision: "uploaded_and_finalized", targetId: asset.id });
    } catch (error) {
      counters.failures += 1;
      results.push({ sourceKey: item.entry.sourceKey, collection: "media", decision: "failed", targetId: item.id, note: safeFailureCode(error) });
    }
  }
  return ids;
}

async function createService(
  db: postgres.Sql,
  plan: ImportPlan,
  item: ServicePlanItem,
  counters: Counters,
): Promise<ImportResult> {
  const input = serviceInputSchema.parse(item.entry.payload);
  if (!shouldActivateService(item.entry) || !input.isActive)
    throw new Error("Layanan belum disetujui untuk publikasi.");
  const id = await db.begin(async (tx) => {
    const matches = await tx<{ id: string }[]>`
      SELECT id::text AS id FROM services
      WHERE lower(trim(title)) = lower(trim(${input.title}))
      FOR UPDATE
    `;
    if (matches.length > 0)
      throw new Error("Natural-key conflict; layanan existing tidak ditimpa.");
    const [row] = await tx<{ id: string }[]>`
      INSERT INTO services (title, description, highlights, icon, is_active, sort_order)
      VALUES (${input.title}, ${input.description}, ${tx.json(input.highlights)}::jsonb,
        ${input.icon}, ${input.isActive}, ${input.sortOrder})
      RETURNING id::text AS id
    `;
    if (!row) throw new Error("Record layanan tidak terbentuk.");
    const marker = {
      datasetKey: DATASET_KEY,
      sourceKey: item.entry.sourceKey,
      sourceChecksum: sourceChecksum(item.entry),
      importedPayloadChecksum: payloadChecksum(input),
      manifestChecksum: plan.manifestChecksum,
      stage: "complete",
    };
    await writeAudit(tx, {
      collection: "services",
      docId: row.id,
      action: "create",
      summary: "Layanan disetujui dibuat dari manifest frontend",
      diff: marker,
    });
    await writeAudit(tx, {
      collection: "services",
      docId: row.id,
      action: "import",
      summary: "Penanda sumber import layanan",
      diff: marker,
    });
    return row.id;
  });
  counters.servicesCreated += 1;
  return { sourceKey: item.entry.sourceKey, collection: "services", decision: "created_active", targetId: id };
}

async function createProject(
  db: postgres.Sql,
  plan: ImportPlan,
  item: ProjectPlanItem,
  input: ProjectInput,
  counters: Counters,
): Promise<ImportResult> {
  const id = await db.begin(async (tx) => {
    const naturalMatches = await tx<{ id: string; deleted_at: Date | null }[]>`
      SELECT id::text AS id, deleted_at FROM projects WHERE slug = ${input.slug} FOR UPDATE
    `;
    if (naturalMatches.length > 0)
      throw new Error("Natural-key conflict; proyek existing tidak ditimpa atau dipulihkan.");

    const [created] = await tx<{ id: string }[]>`
      INSERT INTO projects (
        title, slug, tagline, client_name, year, published_at, featured_image_id,
        gallery, summary, content_blocks, links, is_featured, status, meta_title,
        meta_description, og_image_id, sort_order
      ) VALUES (
        ${input.title}, ${input.slug}, ${input.tagline}, ${input.clientName}, ${input.year},
        NULL, ${input.featuredImageId}, ${tx.json(input.gallery)}::jsonb,
        ${input.summary}, ${tx.json(input.contentBlocks)}::jsonb,
        ${tx.json(input.links)}::jsonb, ${input.isFeatured}, 'draft', ${input.metaTitle},
        ${input.metaDescription}, ${input.ogImageId}, ${input.sortOrder}
      )
      RETURNING id::text AS id
    `;
    if (!created) throw new Error("Record proyek tidak terbentuk.");

    for (const categoryId of input.categoryIds)
      await tx`INSERT INTO project_categories (project_id, category_id) VALUES (${created.id}, ${categoryId})`;
    for (const [sortOrder, technologyId] of input.technologyIds.entries())
      await tx`INSERT INTO project_technologies (project_id, technology_id, sort_order) VALUES (${created.id}, ${technologyId}, ${sortOrder})`;

    const draftSnapshot = { ...input, status: "draft", publishedAt: null };
    await tx`
      INSERT INTO content_versions (collection, doc_id, version, snapshot, change_type, actor_id)
      VALUES ('projects', ${created.id}, 1, ${tx.json(draftSnapshot)}::jsonb, 'draft', NULL)
    `;
    const publish = shouldPublishProject(item.entry);
    const publishedAt = publish ? new Date() : null;
    if (publishedAt) {
      const [published] = await tx<{ id: string }[]>`
        UPDATE projects
        SET status = 'published', publication_enabled = true, published_at = ${publishedAt}, updated_at = ${publishedAt}
        WHERE id = ${created.id} AND status = 'draft' AND deleted_at IS NULL
        RETURNING id::text AS id
      `;
      if (!published) throw new Error("Publikasi proyek tidak berhasil.");

      const publishedSnapshot = {
        ...input,
        status: "published",
        publishedAt: publishedAt.toISOString(),
      };
      await tx`
        INSERT INTO content_versions (collection, doc_id, version, snapshot, change_type, actor_id)
        VALUES ('projects', ${created.id}, 2, ${tx.json(publishedSnapshot)}::jsonb, 'publish', NULL)
      `;
    }
    const marker = {
      datasetKey: DATASET_KEY,
      sourceKey: item.entry.sourceKey,
      sourceChecksum: sourceChecksum(item.entry),
      importedPayloadChecksum: payloadChecksum(input),
      manifestChecksum: plan.manifestChecksum,
      stage: "complete",
      publishedAt: publishedAt?.toISOString() ?? null,
    };
    await writeAudit(tx, {
      collection: "projects",
      docId: created.id,
      action: "create",
      summary: "Proyek dibuat dari manifest konten yang ditinjau",
      diff: marker,
    });
    if (publish)
      await writeAudit(tx, {
        collection: "projects",
        docId: created.id,
        action: "publish",
        summary: "Proyek dipublikasikan setelah persetujuan pemilik",
        diff: marker,
      });
    await writeAudit(tx, {
      collection: "projects",
      docId: created.id,
      action: "import",
      summary: "Penanda sumber import proyek",
      diff: marker,
    });
    return created.id;
  });
  counters.projectsCreated += 1;
  return {
    sourceKey: item.entry.sourceKey,
    collection: "projects",
    decision: shouldPublishProject(item.entry) ? "created_published" : "created_draft",
    targetId: id,
  };
}

function resultForSkipped<T extends { sourceKey: string }>(
  collection: Collection,
  item: T,
  decision: ImportDecision,
  targetId?: string,
  reason?: string,
): ImportResult {
  return { sourceKey: item.sourceKey, collection, decision, targetId, note: reason };
}

function safeFailureCode(error: unknown): string {
  const name = error instanceof Error ? error.name : "Error";
  const code =
    error && typeof error === "object" && "code" in error &&
    typeof error.code === "string"
      ? error.code
      : undefined;
  if (error instanceof Error) {
    const message = error.message
      .replace(/(?:postgres(?:ql)?|https?):\/\/[^\s"'<>]+/gi, "[URL redacted]")
      .replace(
        /(password|secret|token|authorization|accessKeyId|credential)\s*[:=]\s*[^,\s]+/gi,
        "$1=[redacted]",
      )
      .slice(0, 180);
    return `${name}${code ? ` (${code})` : ""}${message ? `: ${message}` : ""}`;
  }
  if (code) return code;
  return "unknown_error";
}

function planResults(plan: ImportPlan): ImportResult[] {
  const results: ImportResult[] = [];
  for (const item of plan.taxonomy)
    if (item.action !== "create")
      results.push({ sourceKey: item.name, collection: item.collection, decision: item.action, targetId: item.id });
  for (const item of plan.assets)
    results.push({ sourceKey: item.entry.sourceKey, collection: "media", decision: item.decision, targetId: item.targetId, note: item.reason });
  for (const item of plan.services)
    results.push(resultForSkipped("services", item.entry, item.decision, item.targetId, item.reason));
  for (const item of plan.projects)
    results.push(resultForSkipped("projects", item.entry, item.decision, item.targetId, item.reason));
  return results;
}

function countPlan(plan: ImportPlan) {
  const count = (items: Array<{ decision: string }>, value: string) =>
    items.filter((item) => item.decision === value).length;
  return {
    taxonomy: {
      create: plan.taxonomy.filter((item) => item.action === "create").length,
      reuse: plan.taxonomy.filter((item) => item.action === "reuse").length,
      conflict: plan.taxonomy.filter((item) => item.action === "conflict").length,
    },
    media: {
      create: count(plan.assets, "create"),
      reuse: count(plan.assets, "reuse"),
      conflict: count(plan.assets, "conflict"),
      review: plan.assets.filter((item) => !["create", "reuse"].includes(item.decision)).length,
    },
    projects: {
      create: count(plan.projects, "create"),
      reuse: count(plan.projects, "reuse"),
      skipped: plan.projects.filter((item) => !["create", "reuse"].includes(item.decision)).length,
    },
    services: {
      create: count(plan.services, "create"),
      reuse: count(plan.services, "reuse"),
      skipped: plan.services.filter((item) => !["create", "reuse"].includes(item.decision)).length,
    },
  };
}

async function verifyIdentity(db: postgres.Sql, target: Target): Promise<void> {
  const [identity] = await db<{ database: string; role: string }[]>`
    SELECT current_database() AS database, current_user AS role
  `;
  if (identity?.database !== TARGET_DATABASE || target.database !== identity.database)
    throw new Error("Koneksi aktif bukan database dev yang dikonfirmasi.");
  await db`
    SELECT to_regclass('public.projects'), to_regclass('public.services'),
      to_regclass('public.media'), to_regclass('public.audit_logs'),
      to_regclass('public.content_versions'), to_regclass('public.technologies')
  `;
}

async function main(): Promise<void> {
  const mode = cliMode();
  const manifest = validateFrontendContentManifest(FRONTEND_CONTENT_MANIFEST);
  const target = await confirmDirectTarget();
  const root = process.cwd();
  const imagesRoot = await realpath(join(root, "public", "images"));
  const inspected = await Promise.all(
    manifest.assets.map(async (asset) => [asset.sourceKey, await inspectAsset(root, imagesRoot, asset)] as const),
  );
  const preparedAssets = new Map(inspected);
  const db = postgres(target.uri, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
  });
  const counters: Counters = {
    taxonomyCreated: 0,
    mediaUploaded: 0,
    mediaReused: 0,
    servicesCreated: 0,
    servicesReused: 0,
    projectsCreated: 0,
    projectsReused: 0,
    failures: 0,
  };
  const results: ImportResult[] = [];
  let mediaDatabase: ReturnType<typeof createDatabase> | undefined;
  let lockHeld = false;
  try {
    await verifyIdentity(db, target);
    let snapshot: Snapshot;
    if (mode === "dry-run") {
      snapshot = await db.begin(async (tx) => {
        await tx`SET TRANSACTION READ ONLY`;
        return readSnapshot(tx);
      });
    } else {
      assertR2Target();
      await db`SELECT pg_advisory_lock(hashtext(${DATASET_KEY})::bigint)`;
      lockHeld = true;
      snapshot = await readSnapshot(db);
    }

    const plan = buildPlan(manifest, preparedAssets, snapshot);
    const planned = countPlan(plan);
    if (mode === "dry-run") {
      const output = {
        mode,
        target: { host: target.host, database: target.database, connection: "direct" },
        manifestVersion: manifest.manifestVersion,
        manifestChecksum: plan.manifestChecksum,
        writes: { database: 0, r2: 0, cacheInvalidations: 0 },
        plan: planned,
        foundationPreserved: snapshot.foundation,
        heldForReview: {
          testimonials: manifest.testimonials.map((item) => ({
            sourceKey: item.sourceKey,
            reason: "Nama narasumber dan verifikasi kutipan tidak tersedia.",
          })),
          faqCandidates: manifest.faqCandidates.map((item) => ({
            sourceKey: item.sourceKey,
            reason: item.reviewFlags[0] ?? "FAQ existing dipertahankan tanpa perubahan.",
          })),
        },
        items: planResults(plan),
        assets: inspected.map(([, asset]) => asset.inspection),
      };
      console.log(JSON.stringify(output, null, 2));
      return;
    }

    if (plan.taxonomy.some((item) => item.action === "conflict")) {
      for (const item of plan.taxonomy.filter((candidate) => candidate.action === "conflict"))
        results.push({ sourceKey: item.name, collection: item.collection, decision: "conflict", note: "Nama atau slug taksonomi tidak unik." });
    }

    const taxonomy = await ensureTaxonomy(db, plan, counters, results);
    mediaDatabase = createDatabase(target.uri, { max: 1 });
    const storage = createR2MediaStorage();
    const mediaStore = createMediaStore(mediaDatabase.db);
    const mediaIds = await importAssets(db, storage, mediaStore, plan, counters, results);

    for (const item of plan.services) {
      if (item.decision === "reuse" && item.targetId) {
        counters.servicesReused += 1;
        results.push({ sourceKey: item.entry.sourceKey, collection: "services", decision: "reused_active", targetId: item.targetId });
        continue;
      }
      if (item.decision !== "create") {
        results.push(resultForSkipped("services", item.entry, item.decision, item.targetId, item.reason));
        continue;
      }
      try {
        results.push(await createService(db, plan, item, counters));
      } catch (error) {
        counters.failures += 1;
        results.push({ sourceKey: item.entry.sourceKey, collection: "services", decision: "failed", note: safeFailureCode(error) });
      }
    }

    const categoryIds = taxonomy.categories;
    const technologyIds = taxonomy.technologies;
    for (const item of plan.projects) {
      if (item.decision === "reuse" && item.targetId) {
        counters.projectsReused += 1;
        results.push({ sourceKey: item.entry.sourceKey, collection: "projects", decision: "reused_published", targetId: item.targetId });
        continue;
      }
      if (item.decision !== "create") {
        results.push(resultForSkipped("projects", item.entry, item.decision, item.targetId, item.reason));
        continue;
      }
      const featuredImageSourceKey = item.entry.payload.featuredImageSourceKey;
      const imageId = featuredImageSourceKey
        ? mediaIds.get(featuredImageSourceKey)
        : undefined;
      if (!imageId) {
        results.push({ sourceKey: item.entry.sourceKey, collection: "projects", decision: "media_pending", note: "Gambar utama belum siap; publikasi tidak dijalankan." });
        continue;
      }
      try {
        const input = projectInputForImport(item.entry, imageId, categoryIds, technologyIds);
        results.push(await createProject(db, plan, item, input, counters));
      } catch (error) {
        counters.failures += 1;
        results.push({ sourceKey: item.entry.sourceKey, collection: "projects", decision: "failed", note: safeFailureCode(error) });
      }
    }

    const after = await readSnapshot(db);
    const publishedSlugs = new Set(
      after.projects.filter((row) => row.status === "published" && !row.deleted_at).map((row) => row.slug),
    );
    const draftSlugs = new Set(
      after.projects.filter((row) => row.status === "draft" && !row.deleted_at).map((row) => row.slug),
    );
    const activeServiceTitles = new Set(
      after.services.filter((row) => row.is_active).map((row) => row.title.trim().toLocaleLowerCase("id-ID")),
    );
    const expectedPublishedProjects = manifest.projects.filter(shouldPublishProject);
    const expectedDraftProjects = manifest.projects.filter((item) => !shouldPublishProject(item));
    const verifiedPublishedProjects = expectedPublishedProjects.filter((item) => publishedSlugs.has(item.payload.slug)).length;
    const verifiedDraftProjects = expectedDraftProjects.filter((item) => draftSlugs.has(item.payload.slug)).length;
    const verifiedServices = manifest.services.filter((item) => activeServiceTitles.has(item.payload.title.trim().toLocaleLowerCase("id-ID"))).length;
    const verifiedMedia = plan.assets.filter((item) => {
      const id = mediaIds.get(item.entry.sourceKey) ?? item.targetId;
      return after.media.some((row) => row.id === id && row.finalized_at && !row.deleted_at);
    }).length;
    const output = {
      mode,
      target: { host: target.host, database: target.database, connection: "direct" },
      manifestVersion: manifest.manifestVersion,
      manifestChecksum: plan.manifestChecksum,
      summary: {
        taxonomyCreated: counters.taxonomyCreated,
        mediaUploaded: counters.mediaUploaded,
        mediaReused: counters.mediaReused,
        projectsCreated: counters.projectsCreated,
        projectsReused: counters.projectsReused,
        servicesCreatedAndActive: counters.servicesCreated,
        servicesReused: counters.servicesReused,
        failed: counters.failures,
        heldTestimonials: manifest.testimonials.length,
        faqCandidatesPreserved: manifest.faqCandidates.length,
      },
      verification: {
        expectedPublishedProjects: expectedPublishedProjects.length,
        publishedProjects: verifiedPublishedProjects,
        expectedDraftProjects: expectedDraftProjects.length,
        draftProjects: verifiedDraftProjects,
        expectedServices: manifest.services.length,
        activeServices: verifiedServices,
        expectedMedia: plan.assets.length,
        finalizedMedia: verifiedMedia,
        ok:
          verifiedPublishedProjects === expectedPublishedProjects.length &&
          verifiedDraftProjects === expectedDraftProjects.length &&
          verifiedServices === manifest.services.length &&
          verifiedMedia === plan.assets.length,
      },
      foundationPreserved: after.foundation,
      cacheInvalidations: "Tidak diperlukan; route publik memakai force-dynamic dan membaca database per request.",
      items: results,
    };
    console.log(JSON.stringify(output, null, 2));
    if (!output.verification.ok || counters.failures > 0) process.exitCode = 1;
  } finally {
    if (lockHeld) {
      try {
        await db`SELECT pg_advisory_unlock(hashtext(${DATASET_KEY})::bigint)`;
      } catch {
        // The connection close releases the session lock if the server is unavailable.
      }
    }
    await mediaDatabase?.close();
    await db.end({ timeout: 5 });
  }
}

export async function runFrontendContentImport(): Promise<void> {
  try {
    await main();
  } catch (error) {
    stderr.write(`Frontend content importer dihentikan: ${safeFailureCode(error)}. Tidak ada kredensial yang dicetak.\n`);
    process.exitCode = 1;
  }
}
