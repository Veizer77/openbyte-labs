import { z } from "zod";
import { normalizeWhatsapp } from "@/lib/whatsapp";
import { publicMediaUrlSchema } from "./media";

/** Zod v4 conventions: top-level string formats + .strict() on every object. */
const money = z.number().int().min(0).max(2_147_483_647);
const nullableUuid = z.uuid().nullable();
const timestamp = z.coerce.date();
const nullableTimestamp = z.coerce.date().nullable();

export const storeGalleryItemSchema = z
  .object({
    mediaId: z.uuid(),
    caption: z.string().trim().max(250).optional(),
  })
  .strict();
export type StoreGalleryItem = z.output<typeof storeGalleryItemSchema>;

const productFields = {
  title: z.string().trim().min(1).max(250),
  slug: z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung."),
  productType: z.enum(["source_code", "ui_template"]),
  tagline: z.string().trim().max(500),
  summary: z.string().trim().max(10_000),
  thumbnailMediaId: nullableUuid,
  gallery: z.array(storeGalleryItemSchema).max(24),
  demoUrl: z.url().max(2048).nullable(),
  videoUrl: z.url().max(2048).nullable(),
  videoKey: z.string().trim().max(500).nullable(),
  relatedProjectId: nullableUuid,
  priceSingle: money,
  priceCommercial: money.nullable(),
  compareAtPriceSingle: money.nullable(),
  compareAtPriceCommercial: money.nullable(),
  setupServicePrice: money.nullable(),
  packageSizeBytes: money.nullable(),
  changelog: z.string().trim().max(10_000),
  techStack: z.array(z.string().trim().min(1).max(80)).max(30),
  features: z.array(z.string().trim().min(1).max(300)).max(40),
  includedFiles: z.array(z.string().trim().min(1).max(200)).max(40),
  version: z.string().trim().min(1).max(40),
  privateFileId: nullableUuid,
  githubRepoInfo: z.string().trim().max(250).nullable(),
  isFeatured: z.boolean(),
  sortOrder: money,
};

/** Commercial licence may never be cheaper than the single-project licence. */
function validatePrices(
  value: {
    priceSingle: number;
    priceCommercial: number | null;
    compareAtPriceSingle: number | null;
    compareAtPriceCommercial: number | null;
  },
  ctx: z.RefinementCtx,
): void {
  if (
    value.priceCommercial !== null &&
    value.priceCommercial < value.priceSingle
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["priceCommercial"],
      message: "Harga Commercial License tidak boleh lebih rendah dari Single License.",
    });
  }
  if (
    value.compareAtPriceSingle !== null &&
    value.compareAtPriceSingle < value.priceSingle
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["compareAtPriceSingle"],
      message: "Harga coret Single tidak boleh lebih kecil dari harga jual Single.",
    });
  }
  if (
    value.compareAtPriceCommercial !== null &&
    (value.priceCommercial === null ||
      value.compareAtPriceCommercial < value.priceCommercial)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["compareAtPriceCommercial"],
      message:
        "Harga coret Commercial harus lebih besar atau sama dengan harga Commercial.",
    });
  }
}

export const digitalProductInputSchema = z
  .object(productFields)
  .strict()
  .superRefine(validatePrices);
export type DigitalProductInput = z.output<typeof digitalProductInputSchema>;

export const digitalProductRecordSchema = z
  .object({
    ...productFields,
    id: z.uuid(),
    status: z.enum(["draft", "published"]),
    salesCount: z.number().int().min(0),
    ratingAverage: z.number().int().min(0).max(500),
    ratingCount: z.number().int().min(0),
    publishedAt: nullableTimestamp,
    deletedAt: nullableTimestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  })
  .strict()
  .superRefine(validatePrices);
export type DigitalProductRecord = z.output<typeof digitalProductRecordSchema>;

/** Public projection: no privateFileId and no R2 object key ever reaches the browser. */
const mediaUrlSchema = publicMediaUrlSchema;

export const publicStoreProductSchema = z
  .object({
    id: z.uuid(),
    slug: z.string(),
    title: z.string(),
    productType: z.enum(["source_code", "ui_template"]),
    tagline: z.string(),
    summary: z.string(),
    version: z.string(),
    priceSingle: money,
    priceCommercial: money.nullable(),
    compareAtPriceSingle: money.nullable(),
    compareAtPriceCommercial: money.nullable(),
    setupServicePrice: money.nullable(),
    packageSizeBytes: money.nullable(),
    videoUrl: z.url().max(2048).nullable(),
    changelog: z.string(),
    salesCount: z.number().int().min(0),
    ratingAverage: z.number().int().min(0).max(500),
    ratingCount: z.number().int().min(0),
    techStack: z.array(z.string()),
    features: z.array(z.string()),
    includedFiles: z.array(z.string()),
    demoUrl: z.url().max(2048).nullable(),
    githubRepoInfo: z.string().nullable(),
    isFeatured: z.boolean(),
    sortOrder: z.number().int(),
    thumbnail: z
      .object({ url: mediaUrlSchema, alt: z.string() })
      .strict()
      .nullable(),
    gallery: z
      .array(
        z
          .object({
            url: mediaUrlSchema,
            alt: z.string(),
            caption: z.string().optional(),
          })
          .strict(),
      )
      .max(24),
    hasPackage: z.boolean(),
  })
  .strict();
export type PublicStoreProduct = z.output<typeof publicStoreProductSchema>;

const orderFields = {
  id: z.uuid(),
  orderCode: z.string().regex(/^OBL-STR-[A-Z0-9]{6,10}$/),
  productId: z.uuid(),
  licenseTier: z.enum(["single", "commercial"]),
  buyerName: z.string().trim().min(2).max(120),
  buyerWhatsapp: z.string().trim().min(8).max(20),
  buyerEmail: z.email().max(254),
  buyerGithub: z.string().trim().max(100).nullable(),
  notes: z.string().trim().max(1000),
  amount: money,
  baseAmount: money,
  setupFeeAmount: money,
  discountAmount: money,
  couponCode: z.string().nullable(),
  includeSetupService: z.boolean(),
  paymentStatus: z.enum(["pending", "paid", "cancelled", "refunded"]),
  accessPinHash: z.string().nullable(),
  pinVersion: z.number().int().positive(),
  licenseFingerprint: z.string().min(24).max(24),
  downloadCount: z.number().int().min(0),
  maxDownloads: z.number().int().min(0),
  expiresAt: nullableTimestamp,
  isRevoked: z.boolean(),
  revokedReason: z.string().nullable(),
  paidAt: nullableTimestamp,
  lastDownloadedAt: nullableTimestamp,
  lastDownloadIpHash: z.string().nullable(),
  paymentProofFileId: nullableUuid,
  paymentProofUploadedAt: nullableTimestamp,
  createdAt: timestamp,
  updatedAt: timestamp,
};

export const digitalOrderRecordSchema = z.object(orderFields).strict();
export type DigitalOrderRecord = z.output<typeof digitalOrderRecordSchema>;

export const digitalOrderAdminRecordSchema = digitalOrderRecordSchema.extend({
  productTitle: z.string(),
  productVersion: z.string(),
  zipFilename: z.string().nullable(),
});
export type DigitalOrderAdminRecord = z.output<typeof digitalOrderAdminRecordSchema>;

/** Internal lookup shape; only the curated licence view is returned to browsers. */
export const storeOrderLookupSchema = digitalOrderRecordSchema.extend({
  productTitle: z.string(),
  productSlug: z.string(),
  productVersion: z.string(),
  hasPackage: z.boolean(),
});
export type StoreOrderLookup = z.output<typeof storeOrderLookupSchema>;

export const storeCheckoutInputSchema = z
  .object({
    productSlug: z.string().min(1).max(120),
    licenseTier: z.enum(["single", "commercial"]),
    buyerName: z.string().trim().min(2).max(120),
    buyerWhatsapp: z.string().transform((value, ctx) => {
      const normalized = normalizeWhatsapp(value);
      if (!normalized) {
        ctx.addIssue({ code: "custom", message: "Nomor WhatsApp tidak valid." });
        return z.NEVER;
      }
      return normalized;
    }),
    buyerEmail: z
      .email()
      .trim()
      .max(254)
      .transform((value) => value.toLowerCase()),
    buyerGithub: z.string().trim().max(100).optional(),
    notes: z.string().trim().max(1000).optional(),
    includeSetupService: z.boolean().optional(),
    couponCode: z.string().trim().toUpperCase().max(32).optional(),
    consent: z.literal(true),
    turnstileToken: z.string().max(2048).optional(),
    honeypot: z.string().max(0).optional(),
  })
  .strict();
export type StoreCheckoutInput = z.output<typeof storeCheckoutInputSchema>;

export const storeLicenseVerifyInputSchema = z
  .object({
    orderCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^OBL-STR-[A-Z0-9]{6,10}$/, "Format kode lisensi tidak valid."),
    pin: z.string().trim().regex(/^\d{6}$/, "PIN harus 6 digit."),
  })
  .strict();
export type StoreLicenseVerifyInput = z.output<typeof storeLicenseVerifyInputSchema>;

export const storeLicenseAccessInputSchema = z
  .object({
    orderCode: storeLicenseVerifyInputSchema.shape.orderCode,
    pin: storeLicenseVerifyInputSchema.shape.pin,
    ipHash: z.string().regex(/^[a-f0-9]{64}$/),
    mode: z.enum(["inspect", "download"]),
  })
  .strict();
export type StoreLicenseAccessInput = z.output<typeof storeLicenseAccessInputSchema>;

export const storeLicenseViewSchema = z
  .object({
    orderCode: z.string(),
    productTitle: z.string(),
    productSlug: z.string(),
    productVersion: z.string(),
    licenseTier: z.enum(["single", "commercial"]),
    buyerName: z.string(),
    buyerEmail: z.string(),
    licenseFingerprint: z.string(),
    maxDownloads: z.number().int(),
    downloadCount: z.number().int(),
    remainingDownloads: z.number().int(),
    expiresAt: z.string().nullable(),
    certificate: z.string(),
    hasPackage: z.boolean(),
    downloadUrl: z.string().optional(),
    expiresInSeconds: z.number().int().optional(),
  })
  .strict();
export type StoreLicenseView = z.output<typeof storeLicenseViewSchema>;

export const storeProductListOptionsSchema = z
  .object({
    limit: z.number().int().min(1).max(100).default(100),
    offset: z.number().int().min(0).max(1_000_000).default(0),
    query: z.string().trim().max(120).optional(),
    productType: z.enum(["source_code", "ui_template"]).optional(),
    status: z.enum(["draft", "published"]).optional(),
    trashOnly: z.boolean().optional(),
    publicOnly: z.boolean().optional(),
  })
  .strict();
export type StoreProductListOptions = z.output<typeof storeProductListOptionsSchema>;

export const storeOrderListOptionsSchema = z
  .object({
    limit: z.number().int().min(1).max(100).default(100),
    offset: z.number().int().min(0).max(1_000_000).default(0),
    query: z.string().trim().max(120).optional(),
    paymentStatus: z.enum(["pending", "paid", "cancelled", "refunded"]).optional(),
    revoked: z.boolean().optional(),
  })
  .strict();
export type StoreOrderListOptions = z.output<typeof storeOrderListOptionsSchema>;

export const storeZipUploadInputSchema = z
  .object({
    productId: z.uuid(),
    filename: z.string().trim().min(1).max(200),
  })
  .strict();

export const storeZipFinalizeInputSchema = z
  .object({
    productId: z.uuid(),
    key: z.string().min(1).max(512),
    filename: z.string().trim().min(1).max(200),
  })
  .strict();

export const storeZipAttachmentSchema = z
  .object({
    key: z.string().min(1).max(512),
    filename: z.string().trim().min(1).max(200),
    mimeType: z.literal("application/zip"),
    sizeBytes: z.number().int().positive().max(200 * 1024 * 1024),
  })
  .strict();
export type StoreZipAttachment = z.output<typeof storeZipAttachmentSchema>;

/* -------------------------------------------------------------------------- */
/* Fase 2: e-commerce (kupon, ulasan, media video, bukti bayar)               */
/* -------------------------------------------------------------------------- */

const couponFields = {
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_-]{3,32}$/, "Kode kupon hanya huruf, angka, - dan _."),
  description: z.string().trim().max(500),
  discountType: z.enum(["percent", "fixed"]),
  discountValue: z.number().int().positive().max(2_147_483_647),
  minOrderAmount: money,
  maxDiscountAmount: money.nullable(),
  maxUses: z.number().int().positive().nullable(),
  productId: nullableUuid,
  isActive: z.boolean(),
  expiresAt: nullableTimestamp,
};

export const digitalCouponInputSchema = z
  .object(couponFields)
  .strict()
  .superRefine((value, ctx) => {
    if (value.discountType === "percent" && value.discountValue > 100) {
      ctx.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Diskon persentase maksimal 100%.",
      });
    }
  });
export type DigitalCouponInput = z.output<typeof digitalCouponInputSchema>;

export const digitalCouponRecordSchema = z
  .object({
    ...couponFields,
    id: z.uuid(),
    usedCount: z.number().int().min(0),
    createdAt: timestamp,
    updatedAt: timestamp,
  })
  .strict();
export type DigitalCouponRecord = z.output<typeof digitalCouponRecordSchema>;

export const storeCouponPreviewInputSchema = z
  .object({
    code: z.string().trim().toUpperCase().min(1).max(32),
    productSlug: z.string().trim().min(1).max(120),
    licenseTier: z.enum(["single", "commercial"]),
    includeSetupService: z.boolean().optional(),
  })
  .strict();
export type StoreCouponPreviewInput = z.output<typeof storeCouponPreviewInputSchema>;

export const storeCouponPreviewResultSchema = z
  .object({
    code: z.string(),
    description: z.string(),
    discountType: z.enum(["percent", "fixed"]),
    discountValue: z.number().int(),
    baseAmount: z.number().int().min(0),
    setupFeeAmount: z.number().int().min(0),
    discountAmount: z.number().int().min(0),
    totalAmount: z.number().int().min(0),
  })
  .strict();
export type StoreCouponPreviewResult = z.output<typeof storeCouponPreviewResultSchema>;

export const storeReviewMediaItemSchema = z
  .object({
    kind: z.enum(["image", "video"]),
    url: z.url().max(2048),
    caption: z.string().trim().max(200).optional(),
  })
  .strict();
export type StoreReviewMediaItem = z.output<typeof storeReviewMediaItemSchema>;

export const storeReviewSubmitInputSchema = z
  .object({
    orderCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^OBL-STR-[A-Z0-9]{6,10}$/, "Format kode lisensi tidak valid."),
    pin: z.string().trim().regex(/^\d{6}$/, "PIN harus 6 digit."),
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().min(10).max(2000),
    mediaItems: z.array(storeReviewMediaItemSchema).max(6),
  })
  .strict();
export type StoreReviewSubmitInput = z.output<typeof storeReviewSubmitInputSchema>;

export const storeReviewPublicSchema = z
  .object({
    id: z.uuid(),
    buyerName: z.string(),
    licenseTier: z.enum(["single", "commercial"]),
    rating: z.number().int().min(1).max(5),
    comment: z.string(),
    mediaItems: z.array(storeReviewMediaItemSchema),
    adminReply: z.string().nullable(),
    createdAt: timestamp,
  })
  .strict();
export type StoreReviewPublic = z.output<typeof storeReviewPublicSchema>;

export const storeReviewAdminRecordSchema = storeReviewPublicSchema
  .safeExtend({
    productId: z.uuid(),
    orderId: z.uuid(),
    productTitle: z.string(),
    productVersion: z.string(),
    status: z.enum(["approved", "hidden"]),
    updatedAt: timestamp,
  });
export type StoreReviewAdminRecord = z.output<typeof storeReviewAdminRecordSchema>;

export const storeReviewModerationInputSchema = z
  .object({
    id: z.uuid(),
    status: z.enum(["approved", "hidden"]).optional(),
    adminReply: z.string().trim().max(1000).nullable().optional(),
  })
  .strict();
export type StoreReviewModerationInput = z.output<
  typeof storeReviewModerationInputSchema
>;

export const storeReviewListOptionsSchema = z
  .object({
    productSlug: z.string().trim().min(1).max(120),
  })
  .strict();

export const storeVideoUploadInputSchema = z
  .object({
    productId: z.uuid(),
    filename: z.string().trim().min(1).max(200),
    mimeType: z.enum(["video/mp4", "video/webm"]),
  })
  .strict();

export const storeVideoFinalizeInputSchema = z
  .object({
    productId: z.uuid(),
    key: z.string().min(1).max(512),
  })
  .strict();

export const storePaymentProofFileSchema = z
  .object({
    key: z.string().min(1).max(512),
    filename: z.string().trim().min(1).max(200),
    mimeType: z.enum(["image/png", "image/jpeg", "image/webp", "application/pdf"]),
    sizeBytes: z
      .number()
      .int()
      .positive()
      .max(10 * 1024 * 1024),
  })
  .strict();
export type StorePaymentProofFile = z.output<typeof storePaymentProofFileSchema>;

export const storePaymentProofUploadInputSchema = z
  .object({
    orderCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^OBL-STR-[A-Z0-9]{6,10}$/),
    filename: z.string().trim().min(1).max(200),
    mimeType: z.enum(["image/png", "image/jpeg", "image/webp", "application/pdf"]),
  })
  .strict();

export const storePaymentProofAttachInputSchema = z
  .object({
    orderCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^OBL-STR-[A-Z0-9]{6,10}$/),
    buyerWhatsapp: z.string().trim().max(20).optional(),
    buyerEmail: z.email().max(254).optional(),
    file: storePaymentProofFileSchema,
  })
  .strict();

export const storePaymentProofFinalizeInputSchema = z
  .object({
    orderCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^OBL-STR-[A-Z0-9]{6,10}$/),
    buyerWhatsapp: z.string().trim().max(20).optional(),
    buyerEmail: z.email().max(254).optional(),
    key: z.string().min(1).max(512),
  })
  .strict();

export const storeReviewMediaUploadInputSchema = z
  .object({
    orderCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^OBL-STR-[A-Z0-9]{6,10}$/),
    filename: z.string().trim().min(1).max(200),
    mimeType: z.string().trim().min(1).max(100),
  })
  .strict();

export const storeReviewMediaVerifyInputSchema = z
  .object({
    orderCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^OBL-STR-[A-Z0-9]{6,10}$/),
    key: z.string().min(1).max(512),
  })
  .strict();
