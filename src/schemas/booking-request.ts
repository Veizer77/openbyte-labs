import { z } from "zod";
import { normalizeWhatsapp } from "@/lib/whatsapp";

export const bookingRequestSchema = z
  .object({
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
    serviceInterest: z.string().trim().max(250),
    projectBrief: z.string().trim().max(4000),
    slotStart: z.iso.datetime({ offset: true }),
    consultationMode: z.enum(["google_meet", "whatsapp_call", "offline"]),
    consent: z.literal(true),
    turnstileToken: z.string().max(2048),
    honeypot: z.string().max(200),
  })
  .strict();

export type BookingRequest = z.output<typeof bookingRequestSchema>;
