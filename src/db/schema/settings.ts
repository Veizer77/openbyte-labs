import { sql } from "drizzle-orm";
import { check, integer, jsonb, pgTable, timestamp } from "drizzle-orm/pg-core";
import type { SettingsDocument } from "@/schemas/site-settings";

// Singleton record. Field-level authorization is enforced in the service layer.
export const siteSettings = pgTable(
  "site_settings",
  {
    id: integer("id").primaryKey().default(1),
    data: jsonb("data").$type<SettingsDocument>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [check("site_settings_singleton", sql`${table.id} = 1`)],
);
