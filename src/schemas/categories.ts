import { z } from "zod";

export const categoryInputSchema = z
  .object({
    name: z.string().trim().min(1).max(150),
    slug: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    icon: z
      .string()
      .max(80)
      .regex(/^[a-zA-Z0-9_-]*$/),
    showInFilter: z.boolean(),
    isActive: z.boolean(),
    sortOrder: z.number().int().min(0).max(2_147_483_647),
  })
  .strict();
export const categoryRecordSchema = categoryInputSchema.extend({
  id: z.uuid(),
});
export type CategoryInput = z.output<typeof categoryInputSchema>;
export type CategoryRecord = z.output<typeof categoryRecordSchema>;
