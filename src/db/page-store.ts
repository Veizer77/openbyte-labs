import "server-only";
import {
  and,
  asc,
  desc,
  eq,
  inArray,
  ilike,
  isNotNull,
  isNull,
  sql,
  type SQL,
} from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { contentVersions, media, pages } from "./schema/content";
import type { PageStore } from "@/services/pages";

const pageFields = {
  id: pages.id,
  slug: pages.slug,
  title: pages.title,
  layout: pages.layout,
  metaTitle: pages.metaTitle,
  metaDescription: pages.metaDescription,
  ogImageId: pages.ogImageId,
  status: pages.status,
  publishedAt: pages.publishedAt,
  deletedAt: pages.deletedAt,
  sortOrder: pages.sortOrder,
  createdAt: pages.createdAt,
  updatedAt: pages.updatedAt,
};

export function createPageStore(db: Database): PageStore {
  return {
    async list(options) {
      const filters: SQL[] = [
        options.trashOnly ? isNotNull(pages.deletedAt) : isNull(pages.deletedAt),
      ];
      if (options.status) filters.push(eq(pages.status, options.status));
      if (options.query) {
        const pattern = `%${options.query}%`;
        filters.push(
          sql`(${ilike(pages.title, pattern)} OR ${ilike(pages.slug, pattern)})`,
        );
      }
      return db
        .select(pageFields)
        .from(pages)
        .where(and(...filters))
        .orderBy(asc(pages.sortOrder), desc(pages.updatedAt), asc(pages.id))
        .limit(options.limit)
        .offset(options.offset);
    },
    async listVersions(id, options) {
      return db
        .select({
          id: contentVersions.id,
          collection: contentVersions.collection,
          docId: contentVersions.docId,
          version: contentVersions.version,
          snapshot: contentVersions.snapshot,
          changeType: contentVersions.changeType,
          actorId: contentVersions.actorId,
          createdAt: contentVersions.createdAt,
        })
        .from(contentVersions)
        .where(
          and(
            eq(contentVersions.collection, "pages"),
            eq(contentVersions.docId, id),
          ),
        )
        .orderBy(desc(contentVersions.version))
        .limit(options.limit)
        .offset(options.offset);
    },
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async readCurrent(id) {
            const [row] = await tx
              .select(pageFields)
              .from(pages)
              .where(eq(pages.id, id))
              .for("update");
            return row ?? null;
          },
          async ensureMediaReady(ids) {
            if (!ids.length) return;
            const rows = await tx
              .select({ id: media.id })
              .from(media)
              .where(
                and(
                  inArray(media.id, ids),
                  isNotNull(media.finalizedAt),
                  isNull(media.deletedAt),
                ),
              );
            if (rows.length !== ids.length)
              throw new Error("Media belum selesai diunggah atau sudah dihapus.");
          },
          async save(id, value) {
            const rows =
              id === null
                ? await tx
                    .insert(pages)
                    .values({ ...value, status: "draft", publishedAt: null })
                    .returning({ id: pages.id })
                : await tx
                    .update(pages)
                    .set({
                      ...value,
                      status: "draft",
                      publishedAt: null,
                      updatedAt: new Date(),
                    })
                    .where(and(eq(pages.id, id), isNull(pages.deletedAt)))
                    .returning({ id: pages.id });
            return rows[0]?.id ?? null;
          },
          async setPublished(id, publishedAt) {
            const rows = await tx
              .update(pages)
              .set({ status: "published", publishedAt, publicationEnabled: true, updatedAt: new Date() })
              .where(and(eq(pages.id, id), isNull(pages.deletedAt)))
              .returning({ id: pages.id });
            return rows.length === 1;
          },
          async setTrash(id, trashed) {
            const rows = await tx
              .update(pages)
              .set({
                deletedAt: trashed ? new Date() : null,
                publicationEnabled: false,
                status: "draft",
                publishedAt: null,
                updatedAt: new Date(),
              })
              .where(
                and(
                  eq(pages.id, id),
                  trashed ? isNull(pages.deletedAt) : isNotNull(pages.deletedAt),
                ),
              )
              .returning({ id: pages.id });
            return rows.length === 1;
          },
          async readVersion(id, version) {
            const [row] = await tx
              .select({ snapshot: contentVersions.snapshot })
              .from(contentVersions)
              .where(
                and(
                  eq(contentVersions.collection, "pages"),
                  eq(contentVersions.docId, id),
                  eq(contentVersions.version, version),
                ),
              )
              .limit(1);
            return row?.snapshot ?? null;
          },
          async appendVersion(id, snapshot, changeType, actorId) {
            const [latest] = await tx
              .select({
                version: sql<number>`coalesce(max(${contentVersions.version}), 0)`,
              })
              .from(contentVersions)
              .where(
                and(
                  eq(contentVersions.collection, "pages"),
                  eq(contentVersions.docId, id),
                ),
              );
            await tx.insert(contentVersions).values({
              collection: "pages",
              docId: id,
              version: (latest?.version ?? 0) + 1,
              snapshot,
              changeType,
              actorId,
            });
          },
          async audit(actorId, action, id) {
            await tx.insert(auditLogs).values({
              actorId,
              actorType: "admin",
              action,
              collection: "pages",
              docId: id,
              summary: `Halaman ${action === "create" ? "dibuat" : "diperbarui"}`,
            });
          },
        }),
      ),
  };
}
