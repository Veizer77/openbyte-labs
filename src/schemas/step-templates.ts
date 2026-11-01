import { z } from "zod";

export const stepTemplateSchema = z
  .object({
    stepNumber: z.number().int().min(1).max(6),
    title: z.string().trim().min(1).max(250),
    description: z.string().trim().max(2_000),
    defaultMilestones: z.array(z.string().trim().min(1).max(250)).max(50),
  })
  .strict();

export const stepTemplatesInputSchema = z
  .array(stepTemplateSchema)
  .length(6)
  .superRefine((templates, ctx) => {
    const numbers = new Set(templates.map((item) => item.stepNumber));
    if (numbers.size !== 6 || [1, 2, 3, 4, 5, 6].some((number) => !numbers.has(number))) {
      ctx.addIssue({ code: "custom", message: "Template harus memuat tahap 1 sampai 6 tepat satu kali." });
    }
  });

export type StepTemplateInput = z.output<typeof stepTemplateSchema>;
