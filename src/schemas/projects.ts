import { z } from "zod";
import {
  projectContentBlockSchema,
  projectLinkSchema,
} from "./blocks";

export const projectSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const slugInput = z
  .string()
  .trim()
  .max(120)
  .refine(
    (value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
    "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.",
  )
  .default("");
const idList = z
  .array(z.uuid())
  .max(50)
  .refine((ids) => new Set(ids).size === ids.length, "ID tidak boleh duplikat.");
const optionalMetaText = z.string().trim().max(250).nullable();

export const projectInputSchema = z
  .object({
    title: z.string().trim().min(1).max(250),
    slug: slugInput,
    tagline: z.string().trim().max(500),
    clientName: z.string().trim().max(250).nullable(),
    year: z.number().int().min(1900).max(2200).nullable(),
    featuredImageId: z.uuid().nullable(),
    gallery: z
      .array(
        z
          .object({
            mediaId: z.uuid(),
            alt: z.string().trim().min(1).max(250),
          })
          .strict(),
      )
      .max(24),
    summary: z.string().trim().max(4000),
    contentBlocks: z.array(projectContentBlockSchema).max(50),
    links: z.array(projectLinkSchema).max(30),
    isFeatured: z.boolean(),
    categoryIds: idList,
    technologyIds: idList,
    metaTitle: optionalMetaText,
    metaDescription: z.string().trim().max(1000).nullable(),
    ogImageId: z.uuid().nullable(),
    sortOrder: z.number().int().min(0).max(2_147_483_647),
  })
  .strict();

export const projectRecordSchema = z
  .object({
    ...projectInputSchema.shape,
    slug: projectSlugSchema,
    id: z.uuid(),
    status: z.enum(["draft", "published"]),
    publishedAt: z.date().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const projectVersionSnapshotSchema = z
  .object({
    ...projectInputSchema.shape,
    slug: projectSlugSchema,
    status: z.enum(["draft", "published"]),
    publishedAt: z.iso.datetime({ offset: true }).nullable(),
  })
  .strict();

export const projectListOptionsSchema = z
  .object({
    query: z.string().trim().max(120).optional(),
    status: z.enum(["draft", "published"]).optional(),
    trashOnly: z.boolean().default(false),
    limit: z.number().int().min(1).max(100).default(50),
    offset: z.number().int().min(0).max(1_000_000).default(0),
  })
  .strict();

export type ProjectInput = z.output<typeof projectInputSchema>;
export type ProjectRecord = z.output<typeof projectRecordSchema>;
export type ProjectVersionSnapshot = z.output<
  typeof projectVersionSnapshotSchema
>;
export type ProjectListOptions = z.output<typeof projectListOptionsSchema>;
