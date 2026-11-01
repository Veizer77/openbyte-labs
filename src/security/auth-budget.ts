import "server-only";
import { sql } from "drizzle-orm";
import type { Database } from "@/db/connection";

export type AuthBudgetScope = "admin-enroll" | "admin-login-ip";

/**
 * Atomic fixed-window budget for authentication endpoints. One statement, so
 * parallel attempts cannot read-modify-write past the limit.
 */
export async function consumeAuthBudget(
  db: Database,
  input: {
    scope: AuthBudgetScope;
    ipHash: string;
    limit: number;
    windowMinutes?: number;
  },
): Promise<boolean> {
  if (!/^[a-f0-9]{64}$/.test(input.ipHash)) throw new Error("Hash IP tidak valid.");
  if (!Number.isInteger(input.limit) || input.limit < 1 || input.limit > 1000)
    throw new Error("Batas percobaan tidak valid.");
  const windowMinutes = input.windowMinutes ?? 15;
  if (!Number.isInteger(windowMinutes) || windowMinutes < 1 || windowMinutes > 1440)
    throw new Error("Jendela waktu tidak valid.");

  const rows = await db.execute(sql`
    INSERT INTO "rate_limits" ("scope", "key_hash", "count", "window_started_at", "updated_at")
    VALUES (${input.scope}, ${input.ipHash}, 1, statement_timestamp(), statement_timestamp())
    ON CONFLICT ("scope", "key_hash") DO UPDATE SET
      "count" = CASE
        WHEN "rate_limits"."window_started_at" + make_interval(mins => ${windowMinutes}) <= statement_timestamp() THEN 1
        ELSE "rate_limits"."count" + 1
      END,
      "window_started_at" = CASE
        WHEN "rate_limits"."window_started_at" + make_interval(mins => ${windowMinutes}) <= statement_timestamp() THEN statement_timestamp()
        ELSE "rate_limits"."window_started_at"
      END,
      "updated_at" = statement_timestamp()
    WHERE "rate_limits"."window_started_at" + make_interval(mins => ${windowMinutes}) <= statement_timestamp()
      OR "rate_limits"."count" < ${input.limit}
    RETURNING "count"
  `);
  return rows.length === 1;
}
