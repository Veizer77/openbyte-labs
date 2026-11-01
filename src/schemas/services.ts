import { z } from "zod";

const amount = z.number().int().min(0).max(2_147_483_647);

/** Icon names rendered by the public services section; never accept arbitrary module paths. */
export const serviceIconNames = [
  "",
  "BarChart3",
  "Boxes",
  "Building2",
  "Cloud",
  "Code",
  "Cpu",
  "Database",
  "Globe",
  "Image",
  "Layers",
  "Layout",
  "Monitor",
  "Palette",
  "Rocket",
  "ShieldCheck",
  "ShoppingCart",
  "Smartphone",
  "Sparkles",
  "Video",
  "Workflow",
  "Zap",
] as const;

export const serviceInputSchema = z
  .object({
    title: z.string().trim().min(1).max(150),
    description: z.string().trim().max(2_000),
    highlights: z.array(z.string().trim().min(1).max(160)).max(12),
    icon: z.enum(serviceIconNames),
    isActive: z.boolean(),
    sortOrder: amount,
  })
  .strict();

export const serviceRecordSchema = serviceInputSchema.extend({ id: z.uuid() });

export type ServiceInput = z.output<typeof serviceInputSchema>;
export type ServiceRecord = z.output<typeof serviceRecordSchema>;
