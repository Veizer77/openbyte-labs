import "server-only";
import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import type { Database } from "./connection";
import { contentVersions, pages } from "./schema/content";
import { pageVersionSnapshotSchema } from "@/schemas/pages";
import type { PublicPageStore } from "@/services/public-pages";

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

export function createPublicPageStore(db: Database): PublicPageStore {
  const publication = db.selectDistinctOn([contentVersions.docId], { docId: contentVersions.docId, snapshot: contentVersions.snapshot }).from(contentVersions)
    .where(and(eq(contentVersions.collection, "pages"), eq(contentVersions.changeType, "publish"), sql`(${contentVersions.snapshot}->>'publishedAt')::timestamptz <= statement_timestamp() + interval '5 seconds'`))
    .orderBy(asc(contentVersions.docId), desc(contentVersions.version)).as("page_publication");
  return {
    async findBySlug(slug, includeDraft) {
      const filters = [includeDraft ? eq(pages.slug, slug) : eq(sql<string>`coalesce(${publication.snapshot}->>'slug', ${pages.slug})`, slug), isNull(pages.deletedAt)];
      if (!includeDraft) filters.push(eq(pages.publicationEnabled, true));
      const [row] = await db
        .select({ ...pageFields, snapshot: publication.snapshot })
        .from(pages)
        .leftJoin(publication, eq(publication.docId, pages.id))
        .where(and(...filters))
        .limit(1);
      if (!row) return null;
      const { snapshot: storedSnapshot, ...page } = row;
      if (includeDraft) return page;
      // Editing a draft must not take the last published version offline.
      if (!storedSnapshot) return page.status === "published" ? page : null;
      const snapshot = pageVersionSnapshotSchema.parse(storedSnapshot);
      return { ...page, ...snapshot, publishedAt: snapshot.publishedAt ? new Date(snapshot.publishedAt) : null };
    },
  };
}
