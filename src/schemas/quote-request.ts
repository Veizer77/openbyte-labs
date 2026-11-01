import { z } from "zod";
import { normalizeWhatsapp } from "@/lib/whatsapp";

export const quoteRequestSchema = z
  .object({
    selection: z
      .array(
        z
          .object({
            itemId: z.uuid(),
            units: z.number().int().min(1).max(1000).optional(),
          })
          .strict(),
      )
      .min(1)
      .max(200),
    contactName: z
      .string()
      .trim()
      .max(100)
      .optional()
      .transform((value) => value || null),
    contactWhatsapp: z
      .string()
      .max(100)
      .optional()
      .refine(
        (value) => !value || normalizeWhatsapp(value) !== null,
        "Nomor WhatsApp tidak valid.",
      )
      .transform((value) => (value ? normalizeWhatsapp(value) : null)),
    consent: z.literal(true),
    turnstileToken: z.string().max(2048),
    honeypot: z.string().max(200),
  })
  .strict();
export type QuoteSelectionSnapshot = {
  itemId: string;
  label: string;
  units: number;
};
