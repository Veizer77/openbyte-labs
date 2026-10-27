import type { AtomicRateLimitStore, RateLimitWindowState } from '../../lib/security/rate-limit'

export interface PostgresQueryClient {
  query(
    sql: string,
    values?: unknown[],
  ): Promise<{ rows: Array<Record<string, unknown>> }>
}

const consumeRateLimitSql = `
INSERT INTO "rate_limits" ("key", "count", "window_started_at")
VALUES ($1, 1, $2::timestamptz)
ON CONFLICT ("key") DO UPDATE SET
  "count" = CASE
    WHEN "rate_limits"."window_started_at" + ($3::bigint * INTERVAL '1 millisecond') <= $2::timestamptz THEN 1
    ELSE "rate_limits"."count" + 1
  END,
  "window_started_at" = CASE
    WHEN "rate_limits"."window_started_at" + ($3::bigint * INTERVAL '1 millisecond') <= $2::timestamptz THEN $2::timestamptz
    ELSE "rate_limits"."window_started_at"
  END,
  "locked_until" = NULL,
  "updated_at" = $2::timestamptz
RETURNING "count", "window_started_at"
`

export function createPostgresRateLimitStore(client: PostgresQueryClient): AtomicRateLimitStore {
  return {
    async consumeAtomic({ key, now, windowMs }): Promise<RateLimitWindowState> {
      const result = await client.query(consumeRateLimitSql, [key, now, windowMs])
      const row = result.rows[0]
      if (!row) throw new Error('Rate-limit update returned no state')

      const count = Number(row.count)
      const windowStartedAt = row.window_started_at instanceof Date
        ? row.window_started_at
        : new Date(String(row.window_started_at))
      if (!Number.isSafeInteger(count) || count < 1 || !Number.isFinite(windowStartedAt.getTime())) {
        throw new Error('Rate-limit database returned invalid state')
      }
      return { count, windowStartedAt }
    },
  }
}
