import { z } from "zod";
import { normalizeWhatsapp } from "@/lib/whatsapp";
import {
  settingsDocumentSchema,
  type SettingsDocument,
} from "./site-settings";
import { richTextSchema } from "./rich-text";
import { publicMediaUrlSchema } from "./media";

export interface PublicMediaImage {
  alt: string;
  urls: { thumb: string; card: string; hero: string; og: string };
}

/** Whitelisted settings safe to pass from a Server Component to the browser. */
export const publicSiteSettingsSchema = z
  .object({
    trackingEnabled: z.boolean().default(false),
    general: z
      .object({
        brandName: z.string(),
        logoUrl: publicMediaUrlSchema.nullable(),
        faviconUrl: publicMediaUrlSchema.nullable(),
        whatsappNumber: z.string(),
        contactEmail: z.union([z.email(), z.literal("")]),
        address: z.string(),
        socialLinks: z.array(
          z.object({ label: z.string(), url: z.url() }).strict(),
        ),
      })
      .strict(),
    hero: z
      .object({
        headline: z.string(),
        subheadline: z.string(),
        primaryCtaLabel: z.string(),
        secondaryCtaLabel: z.string(),
        heroImageUrl: publicMediaUrlSchema.nullable(),
        heroImageAlt: z.string(),
        trustMetrics: z.array(
          z.object({ value: z.string(), label: z.string() }).strict(),
        ),
      })
      .strict(),
    navigation: z
      .object({
        menuItems: z.array(
          z.object({ label: z.string(), target: z.string() }).strict(),
        ),
        footerText: z.string(),
      })
      .strict(),
    seo: z
      .object({
        defaultTitle: z.string(),
        defaultDescription: z.string(),
        defaultOgImageUrl: publicMediaUrlSchema.nullable(),
      })
      .strict(),
    calculator: z
      .object({
        disclaimer: z.string(),
        minimumPrice: z.number().int().nonnegative(),
        showRange: z.boolean(),
      })
      .strict(),
    booking: z
      .object({
        slotDurationMinutes: z.number().int().positive(),
        bufferMinutes: z.number().int().nonnegative(),
        minDaysAhead: z.number().int().nonnegative(),
        maxDaysAhead: z.number().int().nonnegative(),
        availableModes: z.array(
          z.enum(["google_meet", "whatsapp_call", "offline"]),
        ),
      })
      .strict(),
    legal: z
      .object({
        privacyPolicy: richTextSchema.nullable(),
        consentText: z.string(),
      })
      .strict(),
  })
  .strict();

export type PublicSiteSettings = z.output<typeof publicSiteSettingsSchema>;

function publicPrivacyPolicy(settings: SettingsDocument) {
  const policy = settings.legal.privacyPolicy;
  const text = policy.blocks.flatMap((block) =>
    block.type === "list"
      ? block.items.flatMap((item) => item.map((node) => node.text))
      : block.children.map((node) => node.text),
  ).join(" ");
  const hasUnresolvedPlaceholder =
    /\[ISI(?::|\])/i.test(text) ||
    /\{(?!whatsappNumber\}|contactEmail\})[a-zA-Z][a-zA-Z0-9]*\}/.test(text);
  return policy.blocks.length && !hasUnresolvedPlaceholder ? policy : null;
}

/**
 * Validate the persisted document, then explicitly project only public fields.
 * Auth, tracking, and WhatsApp message templates are never serialized to public
 * components.
 */
export function toPublicSiteSettings(
  input: unknown,
  mediaById: ReadonlyMap<string, PublicMediaImage> = new Map(),
): PublicSiteSettings {
  const settings: SettingsDocument = settingsDocumentSchema.parse(input);
  const phone = settings.general.whatsappNumber
    ? normalizeWhatsapp(settings.general.whatsappNumber)
    : null;
  if (settings.general.whatsappNumber && !phone)
    throw new Error("Nomor WhatsApp publik tidak valid.");

  return publicSiteSettingsSchema.parse({
    trackingEnabled: settings.tracking.trackingEnabled,
    general: {
      brandName: settings.general.brandName,
      logoUrl: settings.general.logoId
        ? (mediaById.get(settings.general.logoId)?.urls.card ?? null)
        : null,
      faviconUrl: settings.general.faviconId
        ? (mediaById.get(settings.general.faviconId)?.urls.thumb ?? null)
        : null,
      whatsappNumber: phone ?? "",
      contactEmail: settings.general.contactEmail,
      address: settings.general.address,
      socialLinks: settings.general.socialLinks,
    },
    hero: {
      headline: settings.hero.headline,
      subheadline: settings.hero.subheadline,
      primaryCtaLabel: settings.hero.primaryCtaLabel,
      secondaryCtaLabel: settings.hero.secondaryCtaLabel,
      heroImageUrl: settings.hero.heroImageId
        ? (mediaById.get(settings.hero.heroImageId)?.urls.hero ?? null)
        : null,
      heroImageAlt: settings.hero.heroImageId
        ? (mediaById.get(settings.hero.heroImageId)?.alt ?? "")
        : "",
      trustMetrics: settings.hero.trustMetrics,
    },
    navigation: {
      menuItems: settings.navigation.menuItems
        .filter((item) => item.isActive)
        .map(({ label, target }) => ({ label, target })),
      footerText: settings.navigation.footerText,
    },
    seo: {
      defaultTitle: settings.seo.defaultTitle,
      defaultDescription: settings.seo.defaultDescription,
      defaultOgImageUrl: settings.seo.defaultOgImageId
        ? (mediaById.get(settings.seo.defaultOgImageId)?.urls.og ?? null)
        : null,
    },
    calculator: settings.calculator,
    booking: settings.booking,
    legal: {
      privacyPolicy: publicPrivacyPolicy(settings),
      consentText: settings.legal.consentText,
    },
  });
}

/** Internal IDs needed only by the server-side media resolver. */
export function publicSiteSettingsMediaIds(input: unknown): string[] {
  const settings: SettingsDocument = settingsDocumentSchema.parse(input);
  return [
    settings.general.logoId,
    settings.general.faviconId,
    settings.hero.heroImageId,
    settings.seo.defaultOgImageId,
  ].filter((id): id is string => id !== null);
}
