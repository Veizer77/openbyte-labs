import { z } from "zod";
import type { ServiceAddonRecord } from "@/schemas/service-addons";
import type { TestimonialRecord } from "@/schemas/testimonials";
import type { PublicMediaAsset } from "@/schemas/media";

export const publicTestimonialSchema = z
  .object({
    authorName: z.string(),
    authorRole: z.string(),
    quote: z.string(),
    photoUrl: z.url().nullable(),
  })
  .strict();

export const publicServiceAddonSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    price: z.number().int().nonnegative(),
    billingType: z.enum(["one_time", "monthly", "yearly"]),
  })
  .strict();

export type PublicTestimonial = z.output<typeof publicTestimonialSchema>;
export type PublicServiceAddon = z.output<typeof publicServiceAddonSchema>;

export function projectPublicTestimonials(
  records: readonly TestimonialRecord[],
  mediaById: ReadonlyMap<string, PublicMediaAsset>,
): PublicTestimonial[] {
  return records.map((record) =>
    publicTestimonialSchema.parse({
      authorName: record.authorName,
      authorRole: record.authorRole,
      quote: record.quote,
      photoUrl: record.photoId
        ? (mediaById.get(record.photoId)?.urls.card ?? null)
        : null,
    }),
  );
}

export function projectPublicServiceAddons(
  records: readonly ServiceAddonRecord[],
): PublicServiceAddon[] {
  return records.map((record) =>
    publicServiceAddonSchema.parse({
      name: record.name,
      description: record.description,
      price: record.price,
      billingType: record.billingType,
    }),
  );
}
