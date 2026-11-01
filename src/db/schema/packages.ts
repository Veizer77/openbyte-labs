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
  uuid,
} from "drizzle-orm/pg-core";
import type { RichText } from "@/schemas/rich-text";
import { quoteRequests } from "./calculator";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    icon: text("icon").notNull(),
    showInFilter: boolean("show_in_filter").notNull().default(true),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("categories_sort_order_check", sql`${table.sortOrder} >= 0`),
  ],
);

export const servicePackages = pgTable(
  "service_packages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    targetMarket: text("target_market").notNull().default(""),
    price: integer("price").notNull(),
    discountPrice: integer("discount_price"),
    discountEndsAt: timestamp("discount_ends_at", { withTimezone: true }),
    billingType: text("billing_type")
      .$type<"one_time" | "subscription_yearly" | "custom">()
      .notNull(),
    estimatedDays: integer("estimated_days").notNull(),
    features: jsonb("features").$type<string[]>().notNull(),
    includedRevisions: integer("included_revisions").notNull().default(2),
    extraRevisionPrice: integer("extra_revision_price"),
    revisionPolicy: jsonb("revision_policy").$type<RichText>(),
    ctaLabel: text("cta_label").notNull().default(""),
    isPopular: boolean("is_popular").notNull().default(false),
    isActive: boolean("is_active").notNull().default(false),
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
    check(
      "package_price_check",
      sql`${table.price} >= 0 AND (${table.discountPrice} IS NULL OR (${table.discountPrice} >= 0 AND ${table.discountPrice} <= ${table.price}))`,
    ),
    check(
      "package_discount_check",
      sql`(${table.discountPrice} IS NULL AND ${table.discountEndsAt} IS NULL) OR (${table.discountPrice} IS NOT NULL AND ${table.discountEndsAt} IS NOT NULL)`,
    ),
    check(
      "package_numeric_check",
      sql`${table.estimatedDays} >= 0 AND ${table.includedRevisions} >= 0 AND (${table.extraRevisionPrice} IS NULL OR ${table.extraRevisionPrice} >= 0) AND ${table.sortOrder} >= 0`,
    ),
    check(
      "package_billing_check",
      sql`${table.billingType} IN ('one_time', 'subscription_yearly', 'custom')`,
    ),
    check(
      "package_features_array_check",
      sql`jsonb_typeof(${table.features}) = 'array'`,
    ),
    index("service_packages_category_idx").on(table.categoryId),
  ],
);

export const serviceAddons = pgTable(
  "service_addons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    price: integer("price").notNull(),
    billingType: text("billing_type")
      .$type<"one_time" | "monthly" | "yearly">()
      .notNull(),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "addon_price_order_check",
      sql`${table.price} >= 0 AND ${table.sortOrder} >= 0`,
    ),
    check(
      "addon_billing_check",
      sql`${table.billingType} IN ('one_time', 'monthly', 'yearly')`,
    ),
  ],
);

export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: text("reference").notNull().unique(),
    servicePackageId: uuid("service_package_id").references(
      () => servicePackages.id,
      { onDelete: "restrict" },
    ),
    quoteRequestId: uuid("quote_request_id").references(
      () => quoteRequests.id,
      { onDelete: "restrict" },
    ),
    packageName: text("package_name"),
    packagePrice: integer("package_price"),
    packageBillingType: text("package_billing_type"),
    name: text("name").notNull(),
    whatsapp: text("whatsapp").notNull(),
    email: text("email"),
    organizationOrBusiness: text("organization_or_business")
      .notNull()
      .default(""),
    message: text("message").notNull(),
    source: text("source")
      .$type<"package" | "calculator" | "contact">()
      .notNull(),
    status: text("status")
      .$type<"new" | "contacted" | "converted" | "dropped">()
      .notNull()
      .default("new"),
    adminNotes: text("admin_notes").notNull().default(""),
    ipHash: text("ip_hash").notNull(),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "inquiry_source_check",
      sql`(${table.source} = 'package' AND ${table.servicePackageId} IS NOT NULL AND ${table.quoteRequestId} IS NULL AND ${table.packageName} IS NOT NULL AND ${table.packagePrice} IS NOT NULL AND ${table.packageBillingType} IS NOT NULL) OR (${table.source} = 'contact' AND ${table.servicePackageId} IS NULL AND ${table.quoteRequestId} IS NULL AND ${table.packageName} IS NULL AND ${table.packagePrice} IS NULL AND ${table.packageBillingType} IS NULL) OR (${table.source} = 'calculator' AND ${table.quoteRequestId} IS NOT NULL AND ${table.servicePackageId} IS NULL AND ${table.packageName} IS NULL AND ${table.packagePrice} IS NULL AND ${table.packageBillingType} IS NULL)`,
    ),
    check(
      "inquiry_package_price_check",
      sql`${table.packagePrice} IS NULL OR ${table.packagePrice} >= 0`,
    ),
    check(
      "inquiry_status_check",
      sql`${table.status} IN ('new', 'contacted', 'converted', 'dropped')`,
    ),
    index("inquiry_status_created_idx").on(table.status, table.createdAt),
  ],
);
