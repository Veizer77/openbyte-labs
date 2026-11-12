import "server-only";
import { sql } from "drizzle-orm";
import type { Database } from "@/db/connection";

/**
 * Atomic namespaced budget backed by the `rate_limits` table. One row per
 * (scope, key hash); the window resets 15 minutes after it first opened.
 * Used by the Digital Store checkout and licence-verification gates.
 */
export async function rateLimit(
  db: Database,
  scope: "store-checkout" | "store-license-verify",
  keyHash: string,
  maxRequests: number,
): Promise<boolean> {
  if (!/^[a-f0-9]{64}$/.test(keyHash)) throw new Error("Hash kunci tidak valid.");
  if (!Number.isInteger(maxRequests) || maxRequests < 1 || maxRequests > 10_000) {
    throw new Error("Batas rate limit tidak valid.");
  }
  const rows = await db.execute(sql`
    INSERT INTO "rate_limits" ("scope", "key_hash", "count", "window_started_at", "updated_at")
    VALUES (${scope}, ${keyHash}, 1, statement_timestamp(), statement_timestamp())
    ON CONFLICT ("scope", "key_hash") DO UPDATE SET
      "count" = CASE
        WHEN "rate_limits"."window_started_at" + interval '15 minutes' <= statement_timestamp() THEN 1
        ELSE "rate_limits"."count" + 1
      END,
      "window_started_at" = CASE
        WHEN "rate_limits"."window_started_at" + interval '15 minutes' <= statement_timestamp() THEN statement_timestamp()
        ELSE "rate_limits"."window_started_at"
      END,
      "updated_at" = statement_timestamp()
    WHERE "rate_limits"."window_started_at" + interval '15 minutes' <= statement_timestamp()
      OR "rate_limits"."count" < ${maxRequests}
    RETURNING "count"
  `);
  return rows.length === 1;
}
