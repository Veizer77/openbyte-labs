import { z } from "zod";

const amount = z.number().int().min(0).max(2_147_483_647);

export const testimonialInputSchema = z
  .object({
    authorName: z.string().trim().min(1).max(120),
    authorRole: z.string().trim().max(160),
    quote: z.string().trim().min(1).max(2_000),
    photoId: z.uuid().nullable(),
    projectId: z.uuid().nullable(),
    isActive: z.boolean(),
    sortOrder: amount,
  })
  .strict();

export const testimonialRecordSchema = testimonialInputSchema.extend({
  id: z.uuid(),
});

export type TestimonialInput = z.output<typeof testimonialInputSchema>;
export type TestimonialRecord = z.output<typeof testimonialRecordSchema>;
