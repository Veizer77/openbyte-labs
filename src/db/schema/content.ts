import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { RichText } from "@/schemas/rich-text";
import type {
  ContentStatus,
  PageBlock,
  ProjectContentBlock,
  ProjectLink,
} from "@/schemas/blocks";
import { adminProfiles } from "./admin-profile";
import { categories } from "./packages";

/** R2 metadata; pending keys are private staging paths, finalized keys are public. */
export const media = pgTable(
  "media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull().unique(),
    filename: text("filename").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    width: integer("width"),
    height: integer("height"),
    alt: text("alt").notNull().default(""),
    /** WebP derivatives produced during upload finalization. */
    variants: jsonb("variants")
      .$type<Partial<Record<"thumb" | "card" | "hero" | "og", string>>>()
      .notNull()
      .default({}),
    uploadedBy: text("uploaded_by").references(() => adminProfiles.id, {
      onDelete: "set null",
    }),
    finalizedAt: timestamp("finalized_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("media_size_check", sql`${table.sizeBytes} >= 0`),
    check(
      "media_finalize_check",
      sql`${table.finalizedAt} IS NULL OR length(${table.alt}) > 0`,
    ),
    index("media_created_idx").on(table.createdAt),
  ],
);

/** Pages built from ordered blocks (Beranda, Tentang, Legal). */
export const pages = pgTable(
  "pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    layout: jsonb("layout").$type<PageBlock[]>().notNull().default([]),
    publicationEnabled: boolean("publication_enabled").notNull().default(false),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    ogImageId: uuid("og_image_id").references(() => media.id, {
      onDelete: "set null",
    }),
    status: text("status").$type<ContentStatus>().notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("pages_slug_active_unique")
      .on(table.slug)
      .where(sql`${table.deletedAt} IS NULL`),
    check("pages_status_check", sql`${table.status} IN ('draft', 'published')`),
    check(
      "pages_publish_check",
      sql`(${table.status} = 'draft' AND ${table.publishedAt} IS NULL) OR (${table.status} = 'published' AND ${table.publishedAt} IS NOT NULL)`,
    ),
    check(
      "pages_layout_array_check",
      sql`jsonb_typeof(${table.layout}) = 'array'`,
    ),
  ],
);

export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
    /** Lucide icon name, validated against an allowlist in the service layer. */
    icon: text("icon").notNull().default(""),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("services_order_check", sql`${table.sortOrder} >= 0`),
    check(
      "services_highlights_array_check",
      sql`jsonb_typeof(${table.highlights}) = 'array'`,
    ),
    index("services_active_order_idx").on(table.isActive, table.sortOrder),
  ],
);

export const technologies = pgTable(
  "technologies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    icon: text("icon").notNull().default(""),
    /** #RRGGBB only. */
    color: text("color").notNull().default("#000000"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "technologies_color_check",
      sql`${table.color} ~ '^#[0-9A-Fa-f]{6}$'`,
    ),
  ],
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    tagline: text("tagline").notNull().default(""),
    publicationEnabled: boolean("publication_enabled").notNull().default(false),
    clientName: text("client_name"),
    year: integer("year"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    featuredImageId: uuid("featured_image_id").references(() => media.id, {
      onDelete: "restrict",
    }),
    gallery: jsonb("gallery")
      .$type<{ mediaId: string; alt: string }[]>()
      .notNull()
      .default([]),
    summary: text("summary").notNull().default(""),
    contentBlocks: jsonb("content_blocks")
      .$type<ProjectContentBlock[]>()
      .notNull()
      .default([]),
    links: jsonb("links").$type<ProjectLink[]>().notNull().default([]),
    isFeatured: boolean("is_featured").notNull().default(false),
    status: text("status").$type<ContentStatus>().notNull().default("draft"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    ogImageId: uuid("og_image_id").references(() => media.id, {
      onDelete: "set null",
    }),
    sortOrder: integer("sort_order").notNull().default(0),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("projects_slug_active_unique")
      .on(table.slug)
      .where(sql`${table.deletedAt} IS NULL`),
    check(
      "projects_status_check",
      sql`${table.status} IN ('draft', 'published')`,
    ),
    // A published project must carry a featured image (PRD 3.2).
    check(
      "projects_publish_image_check",
      sql`${table.status} = 'draft' OR (${table.publishedAt} IS NOT NULL AND ${table.featuredImageId} IS NOT NULL)`,
    ),
    check("projects_order_check", sql`${table.sortOrder} >= 0`),
    check(
      "projects_year_check",
      sql`${table.year} IS NULL OR (${table.year} BETWEEN 1900 AND 2200)`,
    ),
    index("projects_public_idx").on(
      table.status,
      table.publishedAt,
      table.sortOrder,
    ),
  ],
);

export const projectCategories = pgTable(
  "project_categories",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
  },
  (table) => [
    uniqueIndex("project_categories_pair_unique").on(
      table.projectId,
      table.categoryId,
    ),
    index("project_categories_category_idx").on(table.categoryId),
  ],
);

export const projectTechnologies = pgTable(
  "project_technologies",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    technologyId: uuid("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "restrict" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    uniqueIndex("project_technologies_pair_unique").on(
      table.projectId,
      table.technologyId,
    ),
    check("project_technologies_order_check", sql`${table.sortOrder} >= 0`),
  ],
);

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorName: text("author_name").notNull(),
    authorRole: text("author_role").notNull().default(""),
    quote: text("quote").notNull(),
    photoId: uuid("photo_id").references(() => media.id, {
      onDelete: "set null",
    }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    isActive: boolean("is_active").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("testimonials_order_check", sql`${table.sortOrder} >= 0`),
    index("testimonials_active_order_idx").on(table.isActive, table.sortOrder),
  ],
);

/** Draft/publish snapshots for versioned content (`pages`, `projects`). */
export const contentVersions = pgTable(
  "content_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    collection: text("collection").$type<"pages" | "projects">().notNull(),
    docId: uuid("doc_id").notNull(),
    version: integer("version").notNull(),
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
    changeType: text("change_type")
      .$type<"draft" | "publish" | "restore">()
      .notNull(),
    actorId: text("actor_id").references(() => adminProfiles.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("content_versions_unique").on(
      table.collection,
      table.docId,
      table.version,
    ),
    check(
      "content_versions_collection_check",
      sql`${table.collection} IN ('pages', 'projects')`,
    ),
    check(
      "content_versions_change_check",
      sql`${table.changeType} IN ('draft', 'publish', 'restore')`,
    ),
    check("content_versions_version_check", sql`${table.version} > 0`),
    index("content_versions_doc_idx").on(table.collection, table.docId),
  ],
);

export type MediaRow = typeof media.$inferSelect;
export type PageRow = typeof pages.$inferSelect;
export type ServiceRow = typeof services.$inferSelect;
export type ProjectRow = typeof projects.$inferSelect;
export type TestimonialRow = typeof testimonials.$inferSelect;
export type RichTextValue = RichText;
