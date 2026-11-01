import { z } from "zod";
import { normalizeWhatsapp } from "@/lib/whatsapp";

const fields = {
  name: z.string().trim().min(1).max(100),
  whatsapp: z
    .string()
    .max(100)
    .refine(
      (value) => normalizeWhatsapp(value) !== null,
      "Nomor WhatsApp tidak valid.",
    )
    .transform((value) => normalizeWhatsapp(value)!),
  email: z
    .union([z.email().max(254), z.literal("")])
    .optional()
    .transform((value) => value || null),
  organizationOrBusiness: z.string().trim().max(250),
  message: z.string().trim().min(1).max(4000),
  consent: z.literal(true),
  turnstileToken: z.string().max(2048),
  honeypot: z.string().max(200),
};
export const inquiryRequestSchema = z.discriminatedUnion("source", [
  z
    .object({
      ...fields,
      source: z.literal("contact"),
      servicePackageId: z.null(),
    })
    .strict(),
  z
    .object({
      ...fields,
      source: z.literal("package"),
      servicePackageId: z.uuid(),
    })
    .strict(),
]);
