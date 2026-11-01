import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const adminLoginFailures = pgTable(
  "admin_login_failures",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    keyHash: text("key_hash").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("admin_login_failures_key_time_idx").on(
      table.keyHash,
      table.occurredAt,
    ),
  ],
);
