import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { adminProfiles } from "./admin-profile";

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: text("actor_id").references(() => adminProfiles.id, {
    onDelete: "restrict",
  }),
  actorType: text("actor_type").notNull(),
  action: text("action").notNull(),
  collection: text("collection").notNull(),
  docId: text("doc_id").notNull(),
  summary: text("summary").notNull(),
  diff: jsonb("diff").$type<Record<string, unknown>>(),
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
