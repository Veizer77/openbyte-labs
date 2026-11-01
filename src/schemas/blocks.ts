import { z } from "zod";
import { richTextSchema } from "./rich-text";

export type ContentStatus = "draft" | "published";

const shortText = z.string().trim().max(250);
const longText = z.string().trim().max(20_000);
const mediaId = z.uuid();

/**
 * Block contracts for the Page Builder (PRD 4.2). Only the block types the
 * prototype actually renders are modelled; every block carries `isVisible`.
 */
const blockBase = { id: z.string().min(1).max(64), isVisible: z.boolean() };

export const heroBlockSchema = z
  .object({
    ...blockBase,
    type: z.literal("hero"),
    headline: shortText.min(1),
    subheadline: z.string().max(2000),
    primaryCtaLabel: shortText,
    secondaryCtaLabel: shortText,
    heroImageId: mediaId.nullable(),
    trustMetrics: z
      .array(z.object({ value: shortText, label: shortText }).strict())
      .max(20),
  })
  .strict();

export const servicesGridBlockSchema = z
  .object({
    ...blockBase,
    type: z.literal("servicesGrid"),
    title: shortText,
    description: z.string().max(2000),
  })
  .strict();

export const portfolioShowcaseBlockSchema = z
  .object({
    ...blockBase,
    type: z.literal("portfolioShowcase"),
    title: shortText,
    limit: z.number().int().min(1).max(24),
    featuredOnly: z.boolean(),
  })
  .strict();

export const calculatorBlockSchema = z
  .object({
    ...blockBase,
    type: z.literal("calculator"),
    title: shortText,
    disclaimer: z.string().max(2000),
  })
  .strict();

export const pricingBlockSchema = z
  .object({
    ...blockBase,
    type: z.literal("pricing"),
    title: shortText,
    showAddons: z.boolean(),
  })
  .strict();

export const testimonialsBlockSchema = z
  .object({
    ...blockBase,
    type: z.literal("testimonials"),
    title: shortText,
    limit: z.number().int().min(1).max(24),
  })
  .strict();

export const faqBlockSchema = z
  .object({
    ...blockBase,
    type: z.literal("faq"),
    title: shortText,
    limit: z.number().int().min(1).max(50),
  })
  .strict();

export const aboutBlockSchema = z
  .object({
    ...blockBase,
    type: z.literal("about"),
    title: shortText,
    body: richTextSchema,
    imageId: mediaId.nullable(),
  })
  .strict();

export const ctaBannerBlockSchema = z
  .object({
    ...blockBase,
    type: z.literal("ctaBanner"),
    title: shortText,
    text: z.string().max(2000),
    primaryCtaLabel: shortText,
    secondaryCtaLabel: shortText,
  })
  .strict();

export const richTextBlockSchema = z
  .object({
    ...blockBase,
    type: z.literal("richText"),
    body: richTextSchema,
  })
  .strict();

export const pageBlockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  servicesGridBlockSchema,
  portfolioShowcaseBlockSchema,
  calculatorBlockSchema,
  pricingBlockSchema,
  testimonialsBlockSchema,
  faqBlockSchema,
  aboutBlockSchema,
  ctaBannerBlockSchema,
  richTextBlockSchema,
]);

export const pageLayoutSchema = z.array(pageBlockSchema).max(40);

export type PageBlock = z.output<typeof pageBlockSchema>;

/** Project detail blocks (PRD 3.2). `problemSolutionImpact` is a preset. */
const httpsUrl = z.string().max(2048).refine((value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}, "URL harus menggunakan HTTPS.");

export const ALLOWED_VIDEO_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "player.vimeo.com",
  "vimeo.com",
] as const;

export const projectContentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("richText"), body: richTextSchema }).strict(),
  z
    .object({
      type: z.literal("image"),
      mediaId,
      alt: shortText.min(1),
      caption: shortText,
    })
    .strict(),
  z
    .object({
      type: z.literal("gallery"),
      images: z
        .array(z.object({ mediaId, alt: shortText.min(1) }).strict())
        .max(24),
    })
    .strict(),
  z
    .object({ type: z.literal("video"), url: httpsUrl })
    .strict()
    .refine((value) => {
      try {
        const host = new URL(value.url).hostname.toLowerCase();
        return (ALLOWED_VIDEO_HOSTS as readonly string[]).includes(host);
      } catch {
        return false;
      }
    }, "Penyedia video tidak diizinkan."),
  z
    .object({
      type: z.literal("stats"),
      items: z
        .array(
          z.object({ value: shortText.min(1), label: shortText }).strict(),
        )
        .min(1)
        .max(12),
    })
    .strict(),
  z.object({ type: z.literal("quote"), text: longText, author: shortText }).strict(),
  z
    .object({
      type: z.literal("bullets"),
      items: z.array(shortText.min(1)).min(1).max(20),
    })
    .strict(),
  z
    .object({
      type: z.literal("problemSolutionImpact"),
      problem: longText,
      solution: longText,
      impact: longText,
    })
    .strict(),
]);

export type ProjectContentBlock = z.output<typeof projectContentBlockSchema>;

export const PROJECT_LINK_TYPES = [
  "demo",
  "github",
  "playstore",
  "appstore",
  "video",
  "lainnya",
] as const;

export const projectLinkSchema = z
  .object({
    label: shortText.min(1),
    type: z.enum(PROJECT_LINK_TYPES),
    url: httpsUrl,
  })
  .strict();

export type ProjectLink = z.output<typeof projectLinkSchema>;
