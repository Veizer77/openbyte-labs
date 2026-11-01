import { z } from "zod";
import { pageLayoutSchema } from "./blocks";

const slug = z
  .string()
  .trim()
  .min(1)
  .max(150)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const optionalMetaText = z.string().trim().max(250).nullable();

export const pageInputSchema = z
  .object({
    slug,
    title: z.string().trim().min(1).max(250),
    layout: pageLayoutSchema,
    metaTitle: optionalMetaText,
    metaDescription: z.string().trim().max(1000).nullable(),
    ogImageId: z.uuid().nullable(),
    sortOrder: z.number().int().min(0).max(2_147_483_647),
  })
  .strict();

export const pageRecordSchema = pageInputSchema
  .extend({
    id: z.uuid(),
    status: z.enum(["draft", "published"]),
    publishedAt: z.date().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const pageVersionSnapshotSchema = pageInputSchema
  .extend({
    status: z.enum(["draft", "published"]),
    publishedAt: z.iso.datetime({ offset: true }).nullable(),
  })
  .strict();

export const pageListOptionsSchema = z
  .object({
    query: z.string().trim().max(120).optional(),
    status: z.enum(["draft", "published"]).optional(),
    trashOnly: z.boolean().default(false),
    limit: z.number().int().min(1).max(100).default(50),
    offset: z.number().int().min(0).max(1_000_000).default(0),
  })
  .strict();

export type PageInput = z.output<typeof pageInputSchema>;
export type PageRecord = z.output<typeof pageRecordSchema>;
export type PageVersionSnapshot = z.output<typeof pageVersionSnapshotSchema>;
export type PageListOptions = z.output<typeof pageListOptionsSchema>;
