import { z } from "zod";

export const projectInvoiceInputSchema = z
  .object({
    clientProjectId: z.uuid(),
    invoiceNumber: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^INV-[0-9]{4}-[A-Z0-9-]{3,32}$/),
    title: z.string().trim().min(1).max(250),
    amount: z.number().int().min(1).max(2_147_483_647),
    dueAt: z.iso.date(),
    status: z.enum(["draft", "issued", "void"]),
    note: z.string().trim().max(2_000),
  })
  .strict();

export const projectInvoiceRecordSchema = projectInvoiceInputSchema.extend({
  id: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProjectInvoiceInput = z.output<typeof projectInvoiceInputSchema>;
export type ProjectInvoiceRecord = z.output<typeof projectInvoiceRecordSchema>;
