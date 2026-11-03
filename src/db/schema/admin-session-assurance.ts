import { sql } from "drizzle-orm";
import { check, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { adminProfiles } from "./admin-profile";
import { authSession } from "./admin-identity";

// A user-level 2FA flag alone does not prove that this particular session passed MFA.
export const adminSessionAssurances = pgTable(
  "admin_session_assurances",
  {
    sessionId: text("session_id")
      .primaryKey()
      .references(() => authSession.id, { onDelete: "cascade" }),
    adminProfileId: text("admin_profile_id")
      .notNull()
      .references(() => adminProfiles.id, { onDelete: "restrict" }),
    // `dev_bypass` is only ever written by the development-only quick login, so
    // the audit trail never claims a real second factor was verified.
    method: text("method")
      .$type<"totp" | "recovery_code" | "dev_bypass">()
      .notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    check(
      "admin_session_assurance_method_check",
      sql`${table.method} IN ('totp', 'recovery_code', 'dev_bypass')`,
    ),
    check(
      "admin_session_assurance_expiry_check",
      sql`${table.expiresAt} > ${table.verifiedAt}`,
    ),
    index("admin_session_assurance_profile_idx").on(table.adminProfileId),
  ],
);
