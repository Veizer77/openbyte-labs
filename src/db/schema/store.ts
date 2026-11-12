import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { media, projects } from "./content";
import { privateFiles } from "./portal";

/**
 * Digital Store (Rilis 3). `privateFileId` points at the private R2 bucket;
 * the object key is deliberately never part of any public payload.
 */
export type StoreGalleryItem = {
  mediaId: string;
  caption?: string;
};

export const digitalProducts = pgTable(
  "digital_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    productType: text("product_type")
      .$type<"source_code" | "ui_template">()
      .notNull()
      .default("source_code"),
    tagline: text("tagline").notNull().default(""),
    summary: text("summary").notNull().default(""),
    thumbnailMediaId: uuid("thumbnail_media_id").references(() => media.id, {
      onDelete: "set null",
    }),
    gallery: jsonb("gallery").$type<StoreGalleryItem[]>().notNull().default([]),
    demoUrl: text("demo_url"),
    videoUrl: text("video_url"),
    videoKey: text("video_key"),
    relatedProjectId: uuid("related_project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    priceSingle: integer("price_single").notNull(),
    priceCommercial: integer("price_commercial"),
    compareAtPriceSingle: integer("compare_at_price_single"),
    compareAtPriceCommercial: integer("compare_at_price_commercial"),
    setupServicePrice: integer("setup_service_price"),
    techStack: jsonb("tech_stack").$type<string[]>().notNull().default([]),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    includedFiles: jsonb("included_files").$type<string[]>().notNull().default([]),
    version: text("version").notNull().default("1.0.0"),
    packageSizeBytes: integer("package_size_bytes"),
    changelog: text("changelog").notNull().default(""),
    privateFileId: uuid("private_file_id").references(() => privateFiles.id, {
      onDelete: "set null",
    }),
    githubRepoInfo: text("github_repo_info"),
    isFeatured: boolean("is_featured").notNull().default(false),
    salesCount: integer("sales_count").notNull().default(0),
    ratingAverage: integer("rating_average").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    status: text("status")
      .$type<"draft" | "published">()
      .notNull()
      .default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    sortOrder: integer("sort_order").notNull().default(0),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("digital_products_slug_active_unique")
      .on(table.slug)
      .where(sql`${table.deletedAt} IS NULL`),
    index("digital_products_public_idx").on(
      table.status,
      table.productType,
      table.sortOrder,
    ),
    check(
      "digital_products_type_check",
      sql`${table.productType} IN ('source_code', 'ui_template')`,
    ),
    check(
      "digital_products_status_check",
      sql`${table.status} IN ('draft', 'published')`,
    ),
    check(
      "digital_products_price_check",
      sql`${table.priceSingle} >= 0 AND (${table.priceCommercial} IS NULL OR ${table.priceCommercial} >= ${table.priceSingle})`,
    ),
    check(
      "digital_products_compare_single_check",
      sql`${table.compareAtPriceSingle} IS NULL OR ${table.compareAtPriceSingle} >= ${table.priceSingle}`,
    ),
    check(
      "digital_products_compare_commercial_check",
      sql`${table.compareAtPriceCommercial} IS NULL OR (${table.priceCommercial} IS NOT NULL AND ${table.compareAtPriceCommercial} >= ${table.priceCommercial})`,
    ),
    check(
      "digital_products_setup_price_check",
      sql`${table.setupServicePrice} IS NULL OR ${table.setupServicePrice} >= 0`,
    ),
  ],
);

export const digitalOrders = pgTable(
  "digital_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderCode: text("order_code").notNull().unique(),
    productId: uuid("product_id")
      .notNull()
      .references(() => digitalProducts.id, { onDelete: "restrict" }),
    licenseTier: text("license_tier")
      .$type<"single" | "commercial">()
      .notNull()
      .default("single"),
    buyerName: text("buyer_name").notNull(),
    buyerWhatsapp: text("buyer_whatsapp").notNull(),
    buyerEmail: text("buyer_email").notNull(),
    buyerGithub: text("buyer_github"),
    notes: text("notes").notNull().default(""),
    amount: integer("amount").notNull(),
    baseAmount: integer("base_amount").notNull().default(0),
    setupFeeAmount: integer("setup_fee_amount").notNull().default(0),
    discountAmount: integer("discount_amount").notNull().default(0),
    couponCode: text("coupon_code"),
    includeSetupService: boolean("include_setup_service")
      .notNull()
      .default(false),
    paymentStatus: text("payment_status")
      .$type<"pending" | "paid" | "cancelled" | "refunded">()
      .notNull()
      .default("pending"),
    accessPinHash: text("access_pin_hash"),
    pinVersion: integer("pin_version").notNull().default(1),
    licenseFingerprint: text("license_fingerprint").notNull(),
    downloadCount: integer("download_count").notNull().default(0),
    maxDownloads: integer("max_downloads").notNull().default(3),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    isRevoked: boolean("is_revoked").notNull().default(false),
    revokedReason: text("revoked_reason"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    lastDownloadedAt: timestamp("last_downloaded_at", { withTimezone: true }),
    lastDownloadIpHash: text("last_download_ip_hash"),
    paymentProofFileId: uuid("payment_proof_file_id").references(
      () => privateFiles.id,
      { onDelete: "set null" },
    ),
    paymentProofUploadedAt: timestamp("payment_proof_uploaded_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("digital_orders_product_idx").on(table.productId),
    index("digital_orders_status_idx").on(table.paymentStatus, table.createdAt),
    check(
      "digital_orders_tier_check",
      sql`${table.licenseTier} IN ('single', 'commercial')`,
    ),
    check(
      "digital_orders_payment_status_check",
      sql`${table.paymentStatus} IN ('pending', 'paid', 'cancelled', 'refunded')`,
    ),
    check(
      "digital_orders_amount_check",
      sql`${table.amount} >= 0 AND ${table.downloadCount} >= 0 AND ${table.maxDownloads} >= 0 AND ${table.baseAmount} >= 0 AND ${table.setupFeeAmount} >= 0 AND ${table.discountAmount} >= 0`,
    ),
  ],
);

export const digitalCoupons = pgTable(
  "digital_coupons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    description: text("description").notNull().default(""),
    discountType: text("discount_type")
      .$type<"percent" | "fixed">()
      .notNull()
      .default("percent"),
    discountValue: integer("discount_value").notNull(),
    minOrderAmount: integer("min_order_amount").notNull().default(0),
    maxDiscountAmount: integer("max_discount_amount"),
    maxUses: integer("max_uses"),
    usedCount: integer("used_count").notNull().default(0),
    productId: uuid("product_id").references(() => digitalProducts.id, {
      onDelete: "cascade",
    }),
    isActive: boolean("is_active").notNull().default(true),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("digital_coupons_active_idx").on(table.isActive, table.code),
    check(
      "digital_coupons_type_check",
      sql`${table.discountType} IN ('percent', 'fixed')`,
    ),
    check(
      "digital_coupons_value_check",
      sql`${table.discountValue} > 0 AND (${table.discountType} != 'percent' OR ${table.discountValue} <= 100) AND ${table.minOrderAmount} >= 0 AND ${table.usedCount} >= 0`,
    ),
  ],
);

export type StoreReviewMediaItem = {
  kind: "image" | "video";
  url: string;
  caption?: string;
};

export const digitalReviews = pgTable(
  "digital_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => digitalProducts.id, { onDelete: "cascade" }),
    orderId: uuid("order_id")
      .notNull()
      .unique()
      .references(() => digitalOrders.id, { onDelete: "cascade" }),
    buyerName: text("buyer_name").notNull(),
    licenseTier: text("license_tier")
      .$type<"single" | "commercial">()
      .notNull()
      .default("single"),
    rating: integer("rating").notNull(),
    comment: text("comment").notNull(),
    mediaItems: jsonb("media_items")
      .$type<StoreReviewMediaItem[]>()
      .notNull()
      .default([]),
    status: text("status")
      .$type<"approved" | "hidden">()
      .notNull()
      .default("approved"),
    adminReply: text("admin_reply"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("digital_reviews_product_idx").on(
      table.productId,
      table.status,
      table.createdAt,
    ),
    check(
      "digital_reviews_rating_check",
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
    ),
    check(
      "digital_reviews_status_check",
      sql`${table.status} IN ('approved', 'hidden')`,
    ),
  ],
);

export type DigitalProductRow = typeof digitalProducts.$inferSelect;
export type DigitalOrderRow = typeof digitalOrders.$inferSelect;
export type DigitalCouponRow = typeof digitalCoupons.$inferSelect;
export type DigitalReviewRow = typeof digitalReviews.$inferSelect;
