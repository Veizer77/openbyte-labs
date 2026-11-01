import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { QuoteSelectionSnapshot } from "@/schemas/quote-request";

export const calculatorGroups = pgTable(
  "calculator_groups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    selectionType: text("selection_type")
      .$type<"single" | "multiple">()
      .notNull(),
    isRequired: boolean("is_required").notNull().default(false),
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
      "calculator_group_selection_check",
      sql`${table.selectionType} IN ('single', 'multiple')`,
    ),
    check("calculator_group_order_check", sql`${table.sortOrder} >= 0`),
  ],
);

export const calculatorItems = pgTable(
  "calculator_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => calculatorGroups.id, { onDelete: "restrict" }),
    label: text("label").notNull(),
    description: text("description").notNull().default(""),
    pricingType: text("pricing_type")
      .$type<"flat" | "per_unit">()
      .notNull()
      .default("flat"),
    unitLabel: text("unit_label"),
    maxUnits: integer("max_units"),
    priceMin: integer("price_min").notNull().default(0),
    priceMax: integer("price_max"),
    daysMin: integer("days_min").notNull().default(0),
    daysMax: integer("days_max"),
    isDefault: boolean("is_default").notNull().default(false),
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
      "calculator_item_pricing_check",
      sql`${table.pricingType} IN ('flat', 'per_unit') AND (${table.pricingType} <> 'per_unit' OR (${table.maxUnits} IS NOT NULL AND ${table.maxUnits} > 0))`,
    ),
    check(
      "calculator_item_price_check",
      sql`${table.priceMin} >= 0 AND (${table.priceMax} IS NULL OR ${table.priceMax} >= ${table.priceMin})`,
    ),
    check(
      "calculator_item_days_check",
      sql`${table.daysMin} >= 0 AND (${table.daysMax} IS NULL OR ${table.daysMax} >= ${table.daysMin})`,
    ),
    check("calculator_item_order_check", sql`${table.sortOrder} >= 0`),
    index("calculator_items_group_idx").on(table.groupId),
  ],
);

export const calculatorRules = pgTable(
  "calculator_rules",
  {
    itemId: uuid("item_id")
      .notNull()
      .references(() => calculatorItems.id, { onDelete: "cascade" }),
    relatedItemId: uuid("related_item_id")
      .notNull()
      .references(() => calculatorItems.id, { onDelete: "restrict" }),
    ruleType: text("rule_type").$type<"requires" | "excludes">().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.itemId, table.relatedItemId, table.ruleType],
    }),
    check(
      "calculator_rule_type_check",
      sql`${table.ruleType} IN ('requires', 'excludes')`,
    ),
    check(
      "calculator_rule_self_check",
      sql`${table.itemId} <> ${table.relatedItemId}`,
    ),
    index("calculator_rules_related_idx").on(table.relatedItemId),
  ],
);

export const quoteRequests = pgTable(
  "quote_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reference: text("reference").notNull().unique(),
    selection: jsonb("selection").$type<QuoteSelectionSnapshot[]>().notNull(),
    priceMin: integer("price_min").notNull(),
    priceMax: integer("price_max").notNull(),
    daysMin: integer("days_min").notNull(),
    daysMax: integer("days_max").notNull(),
    contactName: text("contact_name"),
    contactWhatsapp: text("contact_whatsapp"),
    ipHash: text("ip_hash").notNull(),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    status: text("status")
      .$type<"new" | "contacted" | "converted" | "dropped">()
      .notNull()
      .default("new"),
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
      "quote_price_check",
      sql`${table.priceMin} >= 0 AND ${table.priceMax} >= ${table.priceMin}`,
    ),
    check(
      "quote_days_check",
      sql`${table.daysMin} >= 0 AND ${table.daysMax} >= ${table.daysMin}`,
    ),
    check(
      "quote_status_check",
      sql`${table.status} IN ('new', 'contacted', 'converted', 'dropped')`,
    ),
    index("quote_status_created_idx").on(table.status, table.createdAt),
  ],
);
