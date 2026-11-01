import { z } from "zod";
import {
  normalizeWhatsapp,
  validateWhatsappTemplate,
  WHATSAPP_TEMPLATE_FIELDS,
} from "@/lib/whatsapp";
import { richTextSchema } from "./rich-text";

const shortText = z.string().trim().max(250);
const webUrl = z.url().refine((value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}, "URL harus menggunakan HTTPS.");
const template = (allowed: readonly string[]) =>
  z
    .string()
    .max(4000)
    .refine(
      (value) => validateWhatsappTemplate(value, allowed),
      "Sintaks atau placeholder template tidak valid untuk pesan ini.",
    );
export const settingsSchemas = {
  general: z
    .object({
      brandName: shortText.min(1),
      logoId: z.string().uuid().nullable(),
      faviconId: z.string().uuid().nullable(),
      whatsappNumber: z
        .string()
        .refine(
          (value) => value === "" || normalizeWhatsapp(value) !== null,
          "Nomor WhatsApp tidak valid.",
        ),
      contactEmail: z.union([z.email(), z.literal("")]),
      address: shortText,
      socialLinks: z
        .array(z.object({ label: shortText.min(1), url: webUrl }).strict())
        .max(20),
    })
    .strict(),
  hero: z
    .object({
      headline: shortText.min(1),
      subheadline: z.string().max(2000),
      primaryCtaLabel: shortText,
      secondaryCtaLabel: shortText,
      heroImageId: z.string().uuid().nullable(),
      trustMetrics: z
        .array(z.object({ value: shortText, label: shortText }).strict())
        .max(20),
    })
    .strict(),
  navigation: z
    .object({
      menuItems: z
        .array(
          z
            .object({
              label: shortText.min(1),
              target: z
                .string()
                .max(500)
                .refine((value) => {
                  if (
                    /^\/(?![\/\\])/.test(value) &&
                    !/[\\\u0000-\u001f]/.test(value)
                  )
                    return true;
                  try {
                    return (
                      new URL(value).protocol === "https:" &&
                      !/[\\\u0000-\u001f]/.test(value)
                    );
                  } catch {
                    return false;
                  }
                }, "Tautan harus berupa path lokal atau HTTPS."),
              isActive: z.boolean(),
            })
            .strict(),
        )
        .max(30),
      footerText: z.string().max(2000),
    })
    .strict(),
  seo: z
    .object({
      defaultTitle: shortText,
      defaultDescription: z.string().max(500),
      defaultOgImageId: z.string().uuid().nullable(),
      analyticsId: z
        .string()
        .max(50)
        .regex(/^[A-Za-z0-9-]*$/, "ID analitik tidak valid."),
    })
    .strict(),
  whatsapp: z
    .object({
      tplCalculator: template(WHATSAPP_TEMPLATE_FIELDS.tplCalculator),
      tplPackageOrder: template(WHATSAPP_TEMPLATE_FIELDS.tplPackageOrder),
      tplBookingConfirm: template(WHATSAPP_TEMPLATE_FIELDS.tplBookingConfirm),
      tplTrackingLink: template(WHATSAPP_TEMPLATE_FIELDS.tplTrackingLink),
      tplRevisionNotice: template(WHATSAPP_TEMPLATE_FIELDS.tplRevisionNotice),
    })
    .strict(),
  calculator: z
    .object({
      disclaimer: z.string().max(2000),
      minimumPrice: z.number().int().min(0).max(2_147_483_647),
      showRange: z.boolean(),
    })
    .strict(),
  booking: z
    .object({
      slotDurationMinutes: z.number().int().min(1).max(1440),
      bufferMinutes: z.number().int().min(0).max(1440),
      minDaysAhead: z.number().int().min(0).max(365),
      maxDaysAhead: z.number().int().min(0).max(365),
      availableModes: z
        .array(z.enum(["google_meet", "whatsapp_call", "offline"]))
        .min(1)
        .max(3)
        .refine(
          (values) => new Set(values).size === values.length,
          "Mode konsultasi tidak boleh duplikat.",
        ),
    })
    .strict()
    .refine((value) => value.maxDaysAhead >= value.minDaysAhead, {
      message: "Batas maksimum harus sama atau lebih besar dari minimum.",
      path: ["maxDaysAhead"],
    }),
  tracking: z
    .object({
      trackingEnabled: z.boolean(),
      revisionPolicy: richTextSchema,
      revisionWindowDays: z.number().int().min(0).max(3650),
      bugWarrantyDays: z.number().int().min(0).max(3650),
      maxLoginAttempts: z.number().int().min(1).max(100),
      lockMinutes: z.number().int().min(1).max(1440),
      sessionMinutes: z.number().int().min(1).max(1440),
    })
    .strict(),
  legal: z
    .object({
      privacyPolicy: richTextSchema,
      consentText: z.string().max(2000),
    })
    .strict(),
} satisfies Record<string, z.ZodType>;

export type SettingsSection = keyof typeof settingsSchemas;
export const settingsDocumentSchema = z.object(settingsSchemas).strict();
export type SettingsDocument = z.output<typeof settingsDocumentSchema>;
export type SettingsValue<K extends SettingsSection> = z.output<
  (typeof settingsSchemas)[K]
>;
