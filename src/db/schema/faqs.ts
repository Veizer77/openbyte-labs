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

export const faqs = pgTable(
  "faqs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    question: text("question").notNull(),
    answer: jsonb("answer").$type<RichText>().notNull(),
    isActive: boolean("is_active").notNull().default(false),
    requiresTracking: boolean("requires_tracking").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("faqs_sort_order_check", sql`${table.sortOrder} >= 0`),
    check(
      "faqs_tracking_release_check",
      sql`NOT ${table.requiresTracking} OR NOT ${table.isActive}`,
    ),
    index("faqs_active_order_idx").on(table.isActive, table.sortOrder),
  ],
);
