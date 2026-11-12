import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  projectInputSchema,
  projectListOptionsSchema,
  projectRecordSchema,
  projectSlugSchema,
  projectVersionSnapshotSchema,
  type ProjectInput,
  type ProjectListOptions,
  type ProjectRecord,
  type ProjectVersionSnapshot,
} from "@/schemas/projects";
import {
  contentVersionListOptionsSchema,
  contentVersionRecordSchema,
  type ContentVersionRecord,
} from "@/schemas/content-versions";

type ContentChangeType = "draft" | "publish" | "restore";
type AuditAction = "create" | "update" | "publish" | "delete" | "restore";

export interface ProjectTransaction {
  readCurrent(id: string): Promise<unknown | null>;
  ensureMediaReady(ids: string[]): Promise<void>;
  ensureRelationsReady(categoryIds: string[], technologyIds: string[]): Promise<void>;
  save(id: string | null, value: ProjectInput): Promise<string | null>;
  setPublished(id: string, publishedAt: Date): Promise<boolean>;
  setTrash(id: string, trashed: boolean): Promise<boolean>;
  readVersion(id: string, version: number): Promise<unknown | null>;
  appendVersion(
    id: string,
    snapshot: ProjectVersionSnapshot,
    changeType: ContentChangeType,
    actorId: string,
  ): Promise<void>;
  audit(actorId: string, action: AuditAction, id: string): Promise<void>;
}

export interface ProjectStore {
  list(options: ProjectListOptions): Promise<unknown[]>;
  read?(id: string): Promise<unknown | null>;
  listVersions(
    id: string,
    options: z.output<typeof contentVersionListOptionsSchema>,
  ): Promise<unknown[]>;
  transaction<T>(callback: (tx: ProjectTransaction) => Promise<T>): Promise<T>;
}

const publishOptionsSchema = z
  .object({ publishedAt: z.iso.datetime({ offset: true }).optional() })
  .strict();

function normalizeProjectInput(input: unknown): ProjectInput {
  const value = projectInputSchema.parse(input);
  const generatedSlug = value.title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
  return { ...value, slug: projectSlugSchema.parse(value.slug || generatedSlug) };
}

function projectInputFromRecord(record: ProjectRecord): ProjectInput {
  return {
    title: record.title,
    slug: record.slug,
    tagline: record.tagline,
    clientName: record.clientName,
    year: record.year,
    featuredImageId: record.featuredImageId,
    gallery: record.gallery,
    summary: record.summary,
    contentBlocks: record.contentBlocks,
    links: record.links,
    isFeatured: record.isFeatured,
    categoryIds: record.categoryIds,
    technologyIds: record.technologyIds,
    metaTitle: record.metaTitle,
    metaDescription: record.metaDescription,
    ogImageId: record.ogImageId,
    sortOrder: record.sortOrder,
  };
}

function projectSnapshotFromRecord(record: ProjectRecord): ProjectVersionSnapshot {
  return projectVersionSnapshotSchema.parse({
    ...projectInputFromRecord(record),
    status: record.status,
    publishedAt: record.publishedAt?.toISOString() ?? null,
  });
}

function projectMediaIds(value: ProjectInput): string[] {
  const ids = [
    value.featuredImageId,
    value.ogImageId,
    ...value.gallery.map((image) => image.mediaId),
  ];
  for (const block of value.contentBlocks) {
    if (block.type === "image") ids.push(block.mediaId);
    if (block.type === "gallery")
      ids.push(...block.images.map((image) => image.mediaId));
  }
  return [...new Set(ids.filter((id): id is string => id !== null))];
}

function hasUnresolvedPlaceholder(value: unknown): boolean {
  return /\[ISI(?::|\])/i.test(JSON.stringify(value));
}

export async function listAdminProjects(
  store: ProjectStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<ProjectRecord[]> {
  authorize(principal, "projects", "read");
  const options = projectListOptionsSchema.parse(input);
  return z.array(projectRecordSchema).parse(await store.list(options));
}

export async function readAdminProject(
  store: ProjectStore,
  principal: AdminPrincipal | null,
  id: string,
): Promise<ProjectRecord | null> {
  authorize(principal, "projects", "read");
  z.uuid().parse(id);
  const raw = store.read
    ? await store.read(id)
    : await store.transaction((tx) => tx.readCurrent(id));
  if (!raw) return null;
  return projectRecordSchema.parse(raw);
}

export async function duplicateProject(
  store: ProjectStore,
  principal: AdminPrincipal | null,
  id: string,
): Promise<string> {
  authorize(principal, "projects", "create");
  z.uuid().parse(id);
  return store.transaction(async (tx) => {
    const current = await tx.readCurrent(id);
    if (!current) throw new Error("Proyek tidak ditemukan.");
    const existing = projectRecordSchema.parse(current);
    const baseInput = projectInputFromRecord(existing);
    const suffix = Date.now().toString(36).slice(-4);
    const duplicated = normalizeProjectInput({
      ...baseInput,
      title: `${existing.title} (Salinan)`.slice(0, 160),
      slug: `${existing.slug}-salinan-${suffix}`.slice(0, 120),
      isFeatured: false,
    });
    const savedId = await tx.save(null, duplicated);
    if (!savedId) throw new Error("Gagal menduplikasi proyek.");
    const saved = projectRecordSchema.parse(await tx.readCurrent(savedId));
    await tx.appendVersion(
      savedId,
      projectSnapshotFromRecord(saved),
      "draft",
      principal.id,
    );
    await tx.audit(principal.id, "create", savedId);
    return savedId;
  });
}

export async function saveProject(
  store: ProjectStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
): Promise<string> {
  authorize(principal, "projects", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const value = normalizeProjectInput(input);

  return store.transaction(async (tx) => {
    if (id !== null) {
      const current = await tx.readCurrent(id);
      if (!current) throw new Error("Proyek tidak ditemukan.");
      const existing = projectRecordSchema.parse(current);
      if (existing.deletedAt)
        throw new Error("Pulihkan proyek dari Trash sebelum mengubahnya.");
      if (existing.status === "published") await tx.appendVersion(id, projectSnapshotFromRecord(existing), "publish", principal.id);
    }
    await tx.ensureMediaReady(projectMediaIds(value));
    await tx.ensureRelationsReady(value.categoryIds, value.technologyIds);
    const savedId = await tx.save(id, value);
    if (!savedId) throw new Error("Proyek tidak ditemukan.");
    const saved = projectRecordSchema.parse(await tx.readCurrent(savedId));
    await tx.appendVersion(
      savedId,
      projectSnapshotFromRecord(saved),
      "draft",
      principal.id,
    );
    await tx.audit(principal.id, id === null ? "create" : "update", savedId);
    return savedId;
  });
}

export async function publishProject(
  store: ProjectStore,
  principal: AdminPrincipal | null,
  id: string,
  input: unknown,
  now = new Date(),
): Promise<void> {
  authorize(principal, "projects", "publish");
  z.uuid().parse(id);
  if (!Number.isFinite(now.getTime())) throw new Error("Jam server tidak valid.");
  const options = publishOptionsSchema.parse(input);
  const publishedAt = options.publishedAt ? new Date(options.publishedAt) : now;

  await store.transaction(async (tx) => {
    const current = await tx.readCurrent(id);
    if (!current) throw new Error("Proyek tidak ditemukan.");
    const record = projectRecordSchema.parse(current);
    if (record.deletedAt) throw new Error("Pulihkan proyek dari Trash dahulu.");
    const value = projectInputFromRecord(record);
    if (!value.featuredImageId)
      throw new Error("Gambar utama wajib tersedia sebelum proyek diterbitkan.");
    if (hasUnresolvedPlaceholder(value))
      throw new Error("Konten [ISI] belum boleh dipublikasikan.");
    await tx.ensureMediaReady(projectMediaIds(value));
    await tx.ensureRelationsReady(value.categoryIds, value.technologyIds);
    if (!(await tx.setPublished(id, publishedAt)))
      throw new Error("Proyek tidak ditemukan.");
    const published = projectRecordSchema.parse(await tx.readCurrent(id));
    await tx.appendVersion(
      id,
      projectSnapshotFromRecord(published),
      "publish",
      principal.id,
    );
    await tx.audit(principal.id, "publish", id);
  });
}

export async function setProjectTrash(
  store: ProjectStore,
  principal: AdminPrincipal | null,
  id: string,
  trashed: boolean,
): Promise<void> {
  z.uuid().parse(id);
  const isTrashing = z.boolean().parse(trashed);
  authorize(principal, "projects", isTrashing ? "delete" : "restore");
  await store.transaction(async (tx) => {
    if (!(await tx.setTrash(id, isTrashing)))
      throw new Error("Proyek tidak ditemukan atau status Trash tidak berubah.");
    await tx.audit(principal.id, isTrashing ? "delete" : "restore", id);
  });
}

export async function listProjectVersions(
  store: ProjectStore,
  principal: AdminPrincipal | null,
  id: string,
  input: unknown,
): Promise<ContentVersionRecord[]> {
  authorize(principal, "projects", "read");
  z.uuid().parse(id);
  const options = contentVersionListOptionsSchema.parse(input);
  const versions = z.array(contentVersionRecordSchema).parse(
    await store.listVersions(id, options),
  );
  return versions.filter(
    (version) => version.collection === "projects" && version.docId === id,
  );
}

export async function restoreProjectVersion(
  store: ProjectStore,
  principal: AdminPrincipal | null,
  id: string,
  version: number,
): Promise<void> {
  authorize(principal, "projects", "restore");
  z.uuid().parse(id);
  const versionNumber = z.number().int().positive().parse(version);

  await store.transaction(async (tx) => {
    const current = await tx.readCurrent(id);
    if (!current) throw new Error("Proyek tidak ditemukan.");
    if (projectRecordSchema.parse(current).deletedAt)
      throw new Error("Pulihkan proyek dari Trash sebelum memulihkan versi.");
    const storedSnapshot = await tx.readVersion(id, versionNumber);
    if (!storedSnapshot) throw new Error("Versi proyek tidak ditemukan.");
    const snapshot = projectVersionSnapshotSchema.parse(storedSnapshot);
    const value = normalizeProjectInput({
      title: snapshot.title,
      slug: snapshot.slug,
      tagline: snapshot.tagline,
      clientName: snapshot.clientName,
      year: snapshot.year,
      featuredImageId: snapshot.featuredImageId,
      gallery: snapshot.gallery,
      summary: snapshot.summary,
      contentBlocks: snapshot.contentBlocks,
      links: snapshot.links,
      isFeatured: snapshot.isFeatured,
      categoryIds: snapshot.categoryIds,
      technologyIds: snapshot.technologyIds,
      metaTitle: snapshot.metaTitle,
      metaDescription: snapshot.metaDescription,
      ogImageId: snapshot.ogImageId,
      sortOrder: snapshot.sortOrder,
    });
    await tx.ensureMediaReady(projectMediaIds(value));
    await tx.ensureRelationsReady(value.categoryIds, value.technologyIds);
    if (!(await tx.save(id, value))) throw new Error("Proyek tidak ditemukan.");
    const restored = projectRecordSchema.parse(await tx.readCurrent(id));
    await tx.appendVersion(
      id,
      projectSnapshotFromRecord(restored),
      "restore",
      principal.id,
    );
    await tx.audit(principal.id, "restore", id);
  });
}
