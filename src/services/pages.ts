import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  pageInputSchema,
  pageListOptionsSchema,
  pageRecordSchema,
  pageVersionSnapshotSchema,
  type PageInput,
  type PageListOptions,
  type PageRecord,
  type PageVersionSnapshot,
} from "@/schemas/pages";
import {
  contentVersionListOptionsSchema,
  contentVersionRecordSchema,
  type ContentVersionRecord,
} from "@/schemas/content-versions";

type ContentChangeType = "draft" | "publish" | "restore";
type AuditAction = "create" | "update" | "publish" | "delete" | "restore";

export interface PageTransaction {
  readCurrent(id: string): Promise<unknown | null>;
  ensureMediaReady(ids: string[]): Promise<void>;
  save(id: string | null, value: PageInput): Promise<string | null>;
  setPublished(id: string, publishedAt: Date): Promise<boolean>;
  setTrash(id: string, trashed: boolean): Promise<boolean>;
  readVersion(id: string, version: number): Promise<unknown | null>;
  appendVersion(
    id: string,
    snapshot: PageVersionSnapshot,
    changeType: ContentChangeType,
    actorId: string,
  ): Promise<void>;
  audit(actorId: string, action: AuditAction, id: string): Promise<void>;
}

export interface PageStore {
  list(options: PageListOptions): Promise<unknown[]>;
  listVersions(
    id: string,
    options: z.output<typeof contentVersionListOptionsSchema>,
  ): Promise<unknown[]>;
  transaction<T>(callback: (tx: PageTransaction) => Promise<T>): Promise<T>;
}

const publishOptionsSchema = z
  .object({ publishedAt: z.iso.datetime({ offset: true }).optional() })
  .strict();

function pageInputFromRecord(record: PageRecord): PageInput {
  return {
    slug: record.slug,
    title: record.title,
    layout: record.layout,
    metaTitle: record.metaTitle,
    metaDescription: record.metaDescription,
    ogImageId: record.ogImageId,
    sortOrder: record.sortOrder,
  };
}

function pageSnapshotFromRecord(record: PageRecord): PageVersionSnapshot {
  return pageVersionSnapshotSchema.parse({
    ...pageInputFromRecord(record),
    status: record.status,
    publishedAt: record.publishedAt?.toISOString() ?? null,
  });
}

function pageMediaIds(value: PageInput): string[] {
  const ids = [value.ogImageId];
  for (const block of value.layout) {
    if (block.type === "hero") ids.push(block.heroImageId);
    if (block.type === "about") ids.push(block.imageId);
  }
  return [...new Set(ids.filter((id): id is string => id !== null))];
}

function hasUnresolvedPlaceholder(value: unknown): boolean {
  return /\[ISI(?::|\])/i.test(JSON.stringify(value));
}

export async function listAdminPages(
  store: PageStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<PageRecord[]> {
  authorize(principal, "pages", "read");
  const options = pageListOptionsSchema.parse(input);
  return z.array(pageRecordSchema).parse(await store.list(options));
}

export async function savePage(
  store: PageStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
): Promise<string> {
  authorize(principal, "pages", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const value = pageInputSchema.parse(input);

  return store.transaction(async (tx) => {
    if (id !== null) {
      const current = await tx.readCurrent(id);
      if (!current) throw new Error("Halaman tidak ditemukan.");
      const existing = pageRecordSchema.parse(current);
      if (existing.deletedAt)
        throw new Error("Pulihkan halaman dari Trash sebelum mengubahnya.");
      if (existing.status === "published") await tx.appendVersion(id, pageSnapshotFromRecord(existing), "publish", principal.id);
    }
    await tx.ensureMediaReady(pageMediaIds(value));
    const savedId = await tx.save(id, value);
    if (!savedId) throw new Error("Halaman tidak ditemukan.");
    const saved = pageRecordSchema.parse(await tx.readCurrent(savedId));
    await tx.appendVersion(
      savedId,
      pageSnapshotFromRecord(saved),
      "draft",
      principal.id,
    );
    await tx.audit(principal.id, id === null ? "create" : "update", savedId);
    return savedId;
  });
}

export async function publishPage(
  store: PageStore,
  principal: AdminPrincipal | null,
  id: string,
  input: unknown,
  now = new Date(),
): Promise<void> {
  authorize(principal, "pages", "publish");
  z.uuid().parse(id);
  if (!Number.isFinite(now.getTime())) throw new Error("Jam server tidak valid.");
  const options = publishOptionsSchema.parse(input);
  const publishedAt = options.publishedAt ? new Date(options.publishedAt) : now;

  await store.transaction(async (tx) => {
    const current = await tx.readCurrent(id);
    if (!current) throw new Error("Halaman tidak ditemukan.");
    const record = pageRecordSchema.parse(current);
    if (record.deletedAt) throw new Error("Pulihkan halaman dari Trash dahulu.");
    const value = pageInputFromRecord(record);
    if (hasUnresolvedPlaceholder(value))
      throw new Error("Konten [ISI] belum boleh dipublikasikan.");
    await tx.ensureMediaReady(pageMediaIds(value));
    if (!(await tx.setPublished(id, publishedAt)))
      throw new Error("Halaman tidak ditemukan.");
    const published = pageRecordSchema.parse(await tx.readCurrent(id));
    await tx.appendVersion(
      id,
      pageSnapshotFromRecord(published),
      "publish",
      principal.id,
    );
    await tx.audit(principal.id, "publish", id);
  });
}

export async function setPageTrash(
  store: PageStore,
  principal: AdminPrincipal | null,
  id: string,
  trashed: boolean,
): Promise<void> {
  z.uuid().parse(id);
  const isTrashing = z.boolean().parse(trashed);
  authorize(principal, "pages", isTrashing ? "delete" : "restore");
  await store.transaction(async (tx) => {
    if (! (await tx.setTrash(id, isTrashing)))
      throw new Error("Halaman tidak ditemukan atau status Trash tidak berubah.");
    await tx.audit(principal.id, isTrashing ? "delete" : "restore", id);
  });
}

export async function listPageVersions(
  store: PageStore,
  principal: AdminPrincipal | null,
  id: string,
  input: unknown,
): Promise<ContentVersionRecord[]> {
  authorize(principal, "pages", "read");
  z.uuid().parse(id);
  const options = contentVersionListOptionsSchema.parse(input);
  const versions = z.array(contentVersionRecordSchema).parse(
    await store.listVersions(id, options),
  );
  return versions.filter(
    (version) => version.collection === "pages" && version.docId === id,
  );
}

export async function restorePageVersion(
  store: PageStore,
  principal: AdminPrincipal | null,
  id: string,
  version: number,
): Promise<void> {
  authorize(principal, "pages", "restore");
  z.uuid().parse(id);
  const versionNumber = z.number().int().positive().parse(version);

  await store.transaction(async (tx) => {
    const current = await tx.readCurrent(id);
    if (!current) throw new Error("Halaman tidak ditemukan.");
    if (pageRecordSchema.parse(current).deletedAt)
      throw new Error("Pulihkan halaman dari Trash sebelum memulihkan versi.");
    const storedSnapshot = await tx.readVersion(id, versionNumber);
    if (!storedSnapshot) throw new Error("Versi halaman tidak ditemukan.");
    const snapshot = pageVersionSnapshotSchema.parse(storedSnapshot);
    const value = pageInputSchema.parse({
      slug: snapshot.slug,
      title: snapshot.title,
      layout: snapshot.layout,
      metaTitle: snapshot.metaTitle,
      metaDescription: snapshot.metaDescription,
      ogImageId: snapshot.ogImageId,
      sortOrder: snapshot.sortOrder,
    });
    await tx.ensureMediaReady(pageMediaIds(value));
    if (!(await tx.save(id, value))) throw new Error("Halaman tidak ditemukan.");
    const restored = pageRecordSchema.parse(await tx.readCurrent(id));
    await tx.appendVersion(
      id,
      pageSnapshotFromRecord(restored),
      "restore",
      principal.id,
    );
    await tx.audit(principal.id, "restore", id);
  });
}
