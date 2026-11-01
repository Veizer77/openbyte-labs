import { z } from "zod";

const amount = z.number().int().min(0).max(2_147_483_647);

export const serviceAddonInputSchema = z
  .object({
    name: z.string().trim().min(1).max(150),
    description: z.string().trim().max(1_000),
    price: amount,
    billingType: z.enum(["one_time", "monthly", "yearly"]),
    isActive: z.boolean(),
    sortOrder: amount,
  })
  .strict();

export const serviceAddonRecordSchema = serviceAddonInputSchema.extend({
  id: z.uuid(),
});

export type ServiceAddonInput = z.output<typeof serviceAddonInputSchema>;
export type ServiceAddonRecord = z.output<typeof serviceAddonRecordSchema>;
