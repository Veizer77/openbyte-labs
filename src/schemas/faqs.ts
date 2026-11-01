import { z } from "zod";
import { richTextSchema } from "./rich-text";

const faqFields = z
  .object({
    question: z.string().trim().min(1).max(500),
    answer: richTextSchema,
    isActive: z.boolean(),
    requiresTracking: z.boolean(),
    sortOrder: z.number().int().min(0).max(2_147_483_647),
  })
  .strict();
function validateFaq(
  value: z.output<typeof faqFields>,
  ctx: z.RefinementCtx,
): void {
  if (!value.isActive) return;
  if (value.requiresTracking)
    ctx.addIssue({
      code: "custom",
      path: ["isActive"],
      message: "FAQ tracking belum tersedia pada Rilis 1.",
    });
  if (
    /\[ISI(?::|\])/i.test(value.question) ||
    /\[ISI(?::|\])/i.test(JSON.stringify(value.answer))
  ) {
    ctx.addIssue({
      code: "custom",
      message: "Konten [ISI] belum boleh dipublikasikan.",
    });
  }
  const text = value.answer.blocks
    .flatMap((block) =>
      block.type === "list" ? block.items.flat() : block.children,
    )
    .map((node) => node.text)
    .join("")
    .trim();
  if (!text)
    ctx.addIssue({
      code: "custom",
      path: ["answer"],
      message: "Jawaban FAQ aktif wajib diisi.",
    });
}
export const faqInputSchema = faqFields.superRefine(validateFaq);
export const faqRecordSchema = faqFields
  .extend({ id: z.uuid() })
  .superRefine(validateFaq);
export type FaqInput = z.output<typeof faqInputSchema>;

export const faqListOptionsSchema = z
  .object({
    search: z.string().trim().max(100).optional(),
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
  })
  .strict();
