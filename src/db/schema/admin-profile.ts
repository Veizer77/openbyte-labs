import { sql } from "drizzle-orm";
import { boolean, check, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { authUser } from "./admin-identity";

export const adminProfiles = pgTable(
  "admin_profiles",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),
    authUserId: text("auth_user_id")
      .notNull()
      .unique()
      .references(() => authUser.id, { onDelete: "restrict" }),
    role: text("role").$type<"owner" | "editor">().notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "admin_profiles_role_check",
      sql`${table.role} IN ('owner', 'editor')`,
    ),
  ],
);
