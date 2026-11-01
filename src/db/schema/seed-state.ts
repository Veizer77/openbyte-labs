import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const seedState = pgTable("seed_state", {
  key: text("key").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
