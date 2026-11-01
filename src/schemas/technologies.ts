import { z } from "zod";

export const technologyInputSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    icon: z.string().trim().max(100).regex(/^[a-zA-Z0-9_-]*$/),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  })
  .strict();

export const technologyRecordSchema = technologyInputSchema.extend({
  id: z.uuid(),
});

export type TechnologyInput = z.output<typeof technologyInputSchema>;
export type TechnologyRecord = z.output<typeof technologyRecordSchema>;
