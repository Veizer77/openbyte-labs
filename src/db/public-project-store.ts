import "server-only";
import {
  and,
  asc,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  sql,
} from "drizzle-orm";
import type { Database } from "./connection";
import type { ProjectLink } from "@/schemas/blocks";
import { categories } from "./schema/packages";
import {
  media,
  projectCategories,
  projects,
  projectTechnologies,
  technologies,
  contentVersions,
} from "./schema/content";
import { projectVersionSnapshotSchema } from "@/schemas/projects";
import type { PublicProjectStore } from "@/services/public-projects";

const projectFields = {
  id: projects.id,
  slug: projects.slug,
  title: projects.title,
  tagline: projects.tagline,
  summary: projects.summary,
  clientName: projects.clientName,
  year: projects.year,
  imageKey: media.variants,
  imageAlt: media.alt,
  links: projects.links,
  isFeatured: projects.isFeatured,
};

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  clientName: string | null;
  year: number | null;
  imageKey: Partial<Record<"thumb" | "card" | "hero" | "og", string>>;
  imageAlt: string;
  links: ProjectLink[];
  isFeatured: boolean;
  snapshot?: unknown;
};

type Taxonomy = { categories: string[]; technologies: string[] };

function publicUrl(baseUrl: string | undefined, key: string | undefined) {
  if (!baseUrl || !key) return null;
  const base = new URL(baseUrl);
  if (
    base.username ||
    base.password ||
    base.search ||
    base.hash ||
    (process.env.NODE_ENV === "production" && base.protocol !== "https:")
  ) {
    throw new Error("R2_PUBLIC_BASE_URL tidak aman untuk media publik.");
  }
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base.toString().replace(/\/+$/, "")}/${encodedKey}`;
}

export function createPublicProjectStore(
  db: Database,
  publicBaseUrl?: string,
): PublicProjectStore {
  const publication = db.selectDistinctOn([contentVersions.docId], {
    docId: contentVersions.docId,
    snapshot: contentVersions.snapshot,
  }).from(contentVersions).where(and(
    eq(contentVersions.collection, "projects"),
    eq(contentVersions.changeType, "publish"),
    sql`(${contentVersions.snapshot}->>'publishedAt')::timestamptz <= statement_timestamp()`,
  )).orderBy(asc(contentVersions.docId), desc(contentVersions.version)).as("publication");
  const fields = { ...projectFields, snapshot: publication.snapshot };
  const coverId = sql`coalesce((${publication.snapshot}->>'featuredImageId')::uuid, ${projects.featuredImageId})`;
  const effectiveSlug = sql<string>`coalesce(${publication.snapshot}->>'slug', ${projects.slug})`;
  const publishedProjectFilter = and(
    eq(projects.publicationEnabled, true),
    sql`(${publication.docId} IS NOT NULL OR (${projects.status} = 'published' AND ${projects.publishedAt} <= statement_timestamp()))`,
    isNull(projects.deletedAt),
    isNotNull(media.finalizedAt),
    isNull(media.deletedAt),
  );

  async function toPublicProjects(rows: ProjectRow[]) {
    if (rows.length === 0) return [];
    rows = rows.map((row) => row.snapshot ? { ...row, ...projectVersionSnapshotSchema.parse(row.snapshot) } : row);
    const snapshots = rows.filter((row) => row.snapshot).map((row) => ({ id: row.id, value: projectVersionSnapshotSchema.parse(row.snapshot) }));
    const ids = rows.map((row) => row.id);
    const [categoryRows, technologyRows] = await Promise.all([
      db
        .select({
          projectId: projectCategories.projectId,
          name: categories.name,
        })
        .from(projectCategories)
        .innerJoin(categories, eq(categories.id, projectCategories.categoryId))
        .where(inArray(projectCategories.projectId, ids))
        .orderBy(
          asc(projectCategories.projectId),
          asc(categories.sortOrder),
          asc(categories.name),
        ),
      db
        .select({
          projectId: projectTechnologies.projectId,
          name: technologies.name,
        })
        .from(projectTechnologies)
        .innerJoin(
          technologies,
          eq(technologies.id, projectTechnologies.technologyId),
        )
        .where(inArray(projectTechnologies.projectId, ids))
        .orderBy(
          asc(projectTechnologies.projectId),
          asc(projectTechnologies.sortOrder),
          asc(technologies.name),
        ),
    ]);
    const taxonomy = new Map<string, Taxonomy>();
    for (const row of rows)
      taxonomy.set(row.id, { categories: [], technologies: [] });
    for (const row of categoryRows)
      taxonomy.get(row.projectId)?.categories.push(row.name);
    for (const row of technologyRows)
      taxonomy.get(row.projectId)?.technologies.push(row.name);
    if (snapshots.length) {
      const categoryIds = [...new Set(snapshots.flatMap((item) => item.value.categoryIds))];
      const technologyIds = [...new Set(snapshots.flatMap((item) => item.value.technologyIds))];
      const [savedCategories, savedTechnologies] = await Promise.all([
        categoryIds.length ? db.select({ id: categories.id, name: categories.name }).from(categories).where(and(inArray(categories.id, categoryIds), eq(categories.isActive, true))) : [],
        technologyIds.length ? db.select({ id: technologies.id, name: technologies.name }).from(technologies).where(inArray(technologies.id, technologyIds)) : [],
      ]);
      const categoryNames = new Map(savedCategories.map((item) => [item.id, item.name]));
      const technologyNames = new Map(savedTechnologies.map((item) => [item.id, item.name]));
      for (const item of snapshots) taxonomy.set(item.id, {
        categories: item.value.categoryIds.flatMap((id) => categoryNames.has(id) ? [categoryNames.get(id)!] : []),
        technologies: item.value.technologyIds.flatMap((id) => technologyNames.has(id) ? [technologyNames.get(id)!] : []),
      });
    }

    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      tagline: row.tagline,
      summary: row.summary,
      clientName: row.clientName,
      year: row.year,
      imageUrl: publicUrl(
        publicBaseUrl,
        row.imageKey.card ?? row.imageKey.hero ?? row.imageKey.thumb,
      ),
      imageAlt: row.imageAlt,
      links: row.links,
      isFeatured: row.isFeatured,
      categories: taxonomy.get(row.id)?.categories ?? [],
      technologies: taxonomy.get(row.id)?.technologies ?? [],
    }));
  }

  return {
    async listPublished(options) {
      const rows = await db
        .select(fields)
        .from(projects)
        .leftJoin(publication, eq(publication.docId, projects.id))
        .innerJoin(media, eq(media.id, coverId))
        .where(publishedProjectFilter)
        .orderBy(
          asc(projects.sortOrder),
          desc(projects.isFeatured),
          desc(projects.publishedAt),
          asc(projects.id),
        )
        .limit(options.limit)
        .offset(options.offset);
      return toPublicProjects(rows);
    },
    async findPublishedBySlug(slug) {
      const rows = await db
        .select({ ...fields, gallery: projects.gallery, contentBlocks: projects.contentBlocks, metaTitle: projects.metaTitle, metaDescription: projects.metaDescription, ogImageId: projects.ogImageId })
        .from(projects)
        .leftJoin(publication, eq(publication.docId, projects.id))
        .innerJoin(media, eq(media.id, coverId))
        .where(and(publishedProjectFilter, eq(effectiveSlug, slug)))
        .limit(1);
      const result = (await toPublicProjects(rows))[0];
      const detail = rows[0]?.snapshot ? projectVersionSnapshotSchema.parse(rows[0].snapshot) : rows[0];
      return result && detail ? { ...result, gallery: detail.gallery, contentBlocks: detail.contentBlocks, metaTitle: detail.metaTitle, metaDescription: detail.metaDescription, ogImageId: detail.ogImageId } : null;
    },
  };
}
