import "server-only";
import { sql } from "drizzle-orm";
import type { Database } from "@/db/connection";

/** One atomic budget across all public forms: at most five submissions per IP in 15 minutes. */
export async function consumePublicFormBudget(
  db: Database,
  ipHash: string,
): Promise<boolean> {
  if (!/^[a-f0-9]{64}$/.test(ipHash)) throw new Error("Hash IP tidak valid.");
  const rows = await db.execute(sql`
    INSERT INTO "rate_limits" ("scope", "key_hash", "count", "window_started_at", "updated_at")
    VALUES ('public-form', ${ipHash}, 1, statement_timestamp(), statement_timestamp())
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
      OR "rate_limits"."count" < 5
    RETURNING "count"
  `);
  return rows.length === 1;
}
