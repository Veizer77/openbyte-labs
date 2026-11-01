import { z } from "zod";

const safeLink = z
  .string()
  .max(2048)
  .refine((value) => {
    try {
      const url = new URL(value);
      return (
        ["https:", "http:", "mailto:", "tel:"].includes(url.protocol) &&
        !/[\u0000-\u001f\u007f\\]/.test(value) &&
        !url.username &&
        !url.password
      );
    } catch {
      return false;
    }
  }, "URL tidak aman.");

const inline = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: z.string().max(10_000) }).strict(),
  z
    .object({
      type: z.literal("link"),
      text: z.string().min(1).max(1000),
      url: safeLink,
    })
    .strict(),
]);
const content = z.array(inline).max(100);
const block = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), children: content }).strict(),
  z
    .object({
      type: z.literal("heading"),
      level: z.union([z.literal(2), z.literal(3)]),
      children: content,
    })
    .strict(),
  z
    .object({
      type: z.literal("list"),
      ordered: z.boolean(),
      items: z.array(content).max(100),
    })
    .strict(),
]);

/** Limited, versioned data; rendering must use React nodes, never raw HTML. */
export const richTextSchema = z
  .object({
    version: z.literal(1),
    blocks: z.array(block).max(200),
  })
  .strict()
  .refine(
    (document) => JSON.stringify(document).length <= 50_000,
    "Dokumen terlalu panjang.",
  );

export type RichText = z.output<typeof richTextSchema>;
