import "server-only";
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  sql,
  type SQL,
} from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { categories } from "./schema/packages";
import {
  contentVersions,
  media,
  projectCategories,
  projectTechnologies,
  projects,
  technologies,
} from "./schema/content";
import type { ProjectStore } from "@/services/projects";

const projectFields = {
  id: projects.id,
  title: projects.title,
  slug: projects.slug,
  tagline: projects.tagline,
  clientName: projects.clientName,
  year: projects.year,
  publishedAt: projects.publishedAt,
  featuredImageId: projects.featuredImageId,
  gallery: projects.gallery,
  summary: projects.summary,
  contentBlocks: projects.contentBlocks,
  links: projects.links,
  isFeatured: projects.isFeatured,
  status: projects.status,
  metaTitle: projects.metaTitle,
  metaDescription: projects.metaDescription,
  ogImageId: projects.ogImageId,
  sortOrder: projects.sortOrder,
  deletedAt: projects.deletedAt,
  createdAt: projects.createdAt,
  updatedAt: projects.updatedAt,
};

export function createProjectStore(db: Database): ProjectStore {
  return {
    async list(options) {
      const filters: SQL[] = [
        options.trashOnly
          ? isNotNull(projects.deletedAt)
          : isNull(projects.deletedAt),
      ];
      if (options.status) filters.push(eq(projects.status, options.status));
      if (options.query) {
        const pattern = `%${options.query}%`;
        filters.push(
          sql`(${ilike(projects.title, pattern)} OR ${ilike(projects.slug, pattern)} OR ${ilike(projects.tagline, pattern)})`,
        );
      }
      const rows = await db
        .select(projectFields)
        .from(projects)
        .where(and(...filters))
        .orderBy(asc(projects.sortOrder), desc(projects.updatedAt), asc(projects.id))
        .limit(options.limit)
        .offset(options.offset);
      if (!rows.length) return [];

      const ids = rows.map((row) => row.id);
      const [categoryRows, technologyRows] = await Promise.all([
        db
          .select({ projectId: projectCategories.projectId, id: projectCategories.categoryId })
          .from(projectCategories)
          .where(inArray(projectCategories.projectId, ids))
          .orderBy(asc(projectCategories.projectId), asc(projectCategories.categoryId)),
        db
          .select({
            projectId: projectTechnologies.projectId,
            id: projectTechnologies.technologyId,
          })
          .from(projectTechnologies)
          .where(inArray(projectTechnologies.projectId, ids))
          .orderBy(
            asc(projectTechnologies.projectId),
            asc(projectTechnologies.sortOrder),
            asc(projectTechnologies.technologyId),
          ),
      ]);
      const categoriesByProject = new Map<string, string[]>();
      const technologiesByProject = new Map<string, string[]>();
      for (const row of categoryRows) {
        const values = categoriesByProject.get(row.projectId) ?? [];
        values.push(row.id);
        categoriesByProject.set(row.projectId, values);
      }
      for (const row of technologyRows) {
        const values = technologiesByProject.get(row.projectId) ?? [];
        values.push(row.id);
        technologiesByProject.set(row.projectId, values);
      }
      return rows.map((row) => ({
        ...row,
        categoryIds: categoriesByProject.get(row.id) ?? [],
        technologyIds: technologiesByProject.get(row.id) ?? [],
      }));
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
            eq(contentVersions.collection, "projects"),
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
              .select(projectFields)
              .from(projects)
              .where(eq(projects.id, id))
              .for("update");
            if (!row) return null;
            const [categoryRows, technologyRows] = await Promise.all([
              tx
                .select({ id: projectCategories.categoryId })
                .from(projectCategories)
                .where(eq(projectCategories.projectId, id))
                .orderBy(asc(projectCategories.categoryId)),
              tx
                .select({ id: projectTechnologies.technologyId })
                .from(projectTechnologies)
                .where(eq(projectTechnologies.projectId, id))
                .orderBy(
                  asc(projectTechnologies.sortOrder),
                  asc(projectTechnologies.technologyId),
                ),
            ]);
            return {
              ...row,
              categoryIds: categoryRows.map((item) => item.id),
              technologyIds: technologyRows.map((item) => item.id),
            };
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
          async ensureRelationsReady(categoryIds, technologyIds) {
            if (categoryIds.length) {
              const rows = await tx
                .select({ id: categories.id })
                .from(categories)
                .where(and(inArray(categories.id, categoryIds), eq(categories.isActive, true)));
              if (rows.length !== categoryIds.length)
                throw new Error("Kategori proyek tidak tersedia atau tidak aktif.");
            }
            if (technologyIds.length) {
              const rows = await tx
                .select({ id: technologies.id })
                .from(technologies)
                .where(inArray(technologies.id, technologyIds));
              if (rows.length !== technologyIds.length)
                throw new Error("Teknologi proyek tidak ditemukan.");
            }
          },
          async save(id, value) {
            const { categoryIds, technologyIds, ...content } = value;
            const rows =
              id === null
                ? await tx
                    .insert(projects)
                    .values({ ...content, status: "draft", publishedAt: null })
                    .returning({ id: projects.id })
                : await tx
                    .update(projects)
                    .set({
                      ...content,
                      status: "draft",
                      publishedAt: null,
                      updatedAt: new Date(),
                    })
                    .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
                    .returning({ id: projects.id });
            const savedId = rows[0]?.id;
            if (!savedId) return null;

            await tx
              .delete(projectCategories)
              .where(eq(projectCategories.projectId, savedId));
            if (categoryIds.length)
              await tx.insert(projectCategories).values(
                categoryIds.map((categoryId) => ({
                  projectId: savedId,
                  categoryId,
                })),
              );

            await tx
              .delete(projectTechnologies)
              .where(eq(projectTechnologies.projectId, savedId));
            if (technologyIds.length)
              await tx.insert(projectTechnologies).values(
                technologyIds.map((technologyId, sortOrder) => ({
                  projectId: savedId,
                  technologyId,
                  sortOrder,
                })),
              );
            return savedId;
          },
          async setPublished(id, publishedAt) {
            const rows = await tx
              .update(projects)
              .set({ status: "published", publishedAt, publicationEnabled: true, updatedAt: new Date() })
              .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
              .returning({ id: projects.id });
            return rows.length === 1;
          },
          async setTrash(id, trashed) {
            const rows = await tx
              .update(projects)
              .set({
                deletedAt: trashed ? new Date() : null,
                publicationEnabled: false,
                status: "draft",
                publishedAt: null,
                updatedAt: new Date(),
              })
              .where(
                and(
                  eq(projects.id, id),
                  trashed
                    ? isNull(projects.deletedAt)
                    : isNotNull(projects.deletedAt),
                ),
              )
              .returning({ id: projects.id });
            return rows.length === 1;
          },
          async readVersion(id, version) {
            const [row] = await tx
              .select({ snapshot: contentVersions.snapshot })
              .from(contentVersions)
              .where(
                and(
                  eq(contentVersions.collection, "projects"),
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
                  eq(contentVersions.collection, "projects"),
                  eq(contentVersions.docId, id),
                ),
              );
            await tx.insert(contentVersions).values({
              collection: "projects",
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
              collection: "projects",
              docId: id,
              summary: `Proyek ${action === "create" ? "dibuat" : "diperbarui"}`,
            });
          },
        }),
      ),
  };
}
