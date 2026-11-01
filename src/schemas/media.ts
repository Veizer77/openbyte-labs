import { z } from "zod";

export const mediaMimeTypeSchema = z.enum([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export interface PublicMediaAsset {
  alt: string;
  urls: {
    thumb: string;
    card: string;
    hero: string;
    og: string;
  };
}

export const mediaVariantSchema = z.enum(["thumb", "card", "hero", "og"]);

const variantsSchema = z
  .object({
    thumb: z.string().min(1).optional(),
    card: z.string().min(1).optional(),
    hero: z.string().min(1).optional(),
    og: z.string().min(1).optional(),
  })
  .strict();

export const mediaRecordSchema = z
  .object({
    id: z.uuid(),
    key: z.string().min(1).max(1024),
    filename: z.string().min(1).max(255),
    mimeType: z.string().min(1).max(100),
    sizeBytes: z.number().int().positive().max(2_147_483_647),
    width: z.number().int().positive().nullable(),
    height: z.number().int().positive().nullable(),
    alt: z.string().max(250),
    variants: variantsSchema,
    uploadedBy: z.string().nullable(),
    finalizedAt: z.date().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const mediaUploadInputSchema = z
  .object({
    filename: z.string().trim().min(1).max(255),
    mimeType: mediaMimeTypeSchema,
    sizeBytes: z
      .number()
      .int()
      .positive()
      .max(15 * 1024 * 1024),
  })
  .strict();

export const mediaFinalizeInputSchema = z
  .object({
    id: z.uuid(),
    alt: z.string().trim().min(1).max(250),
  })
  .strict();

export const mediaUploadGrantSchema = z
  .object({
    id: z.uuid(),
    uploadUrl: z.url(),
    headers: z.object({ "Content-Type": mediaMimeTypeSchema }).strict(),
    expiresAt: z.iso.datetime({ offset: true }),
  })
  .strict();

export const mediaAssetSchema = mediaRecordSchema
  .extend({
    urls: z
      .object({
        thumb: z.url(),
        card: z.url(),
        hero: z.url(),
        og: z.url(),
      })
      .strict(),
  })
  .strict();

export const mediaListOptionsSchema = z
  .object({
    query: z.string().trim().max(120).optional(),
    limit: z.number().int().min(1).max(100).default(50),
    offset: z.number().int().min(0).max(1_000_000).default(0),
  })
  .strict();

export type MediaMimeType = z.output<typeof mediaMimeTypeSchema>;
export type MediaVariant = z.output<typeof mediaVariantSchema>;
export type MediaRecord = z.output<typeof mediaRecordSchema>;
export type MediaUploadInput = z.output<typeof mediaUploadInputSchema>;
export type MediaAsset = z.output<typeof mediaAssetSchema>;
export type MediaListOptions = z.output<typeof mediaListOptionsSchema>;
export type MediaUploadGrant = z.output<typeof mediaUploadGrantSchema>;
