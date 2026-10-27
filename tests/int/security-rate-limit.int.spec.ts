import { randomUUID } from 'node:crypto'
import { beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { canRunDatabaseTests } from '../helpers/db-target'
import { createPostgresRateLimitStore, type PostgresQueryClient } from '../../src/server/security/postgres-rate-limit'
import { consumeRateLimit, publicFormRateLimit } from '../../src/lib/security/rate-limit'

const hasDisposableDb = await canRunDatabaseTests()

describe.skipIf(!hasDisposableDb)('PostgreSQL atomic public-form rate limiting', () => {
  let payload: Payload
  let store: ReturnType<typeof createPostgresRateLimitStore>
  let client: PostgresQueryClient

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const db = payload.db as unknown as { drizzle: { $client: PostgresQueryClient } }
    client = db.drizzle.$client
    store = createPostgresRateLimitStore(client)
  }, 30000)

  it('allows exactly five of 30 concurrent requests for one client bucket', async () => {
    const key = `test:${randomUUID()}`
    const now = new Date('2026-10-27T12:00:00.000Z')

    try {
      const decisions = await Promise.all(Array.from({ length: 30 }, () => consumeRateLimit(store, {
        key,
        now,
        ...publicFormRateLimit,
      })))

      expect(decisions.filter(({ allowed }) => allowed)).toHaveLength(5)
      expect(decisions.filter(({ allowed }) => !allowed)).toHaveLength(25)
      expect(decisions.every(({ remaining }) => remaining >= 0)).toBe(true)
    } finally {
      await client.query('DELETE FROM "rate_limits" WHERE "key" = $1', [key])
    }
  }, 15000)

  it('resets the persisted counter at the exact window boundary', async () => {
    const key = `test:${randomUUID()}`
    const firstWindow = new Date('2026-10-27T12:00:00.000Z')

    try {
      for (let attempt = 0; attempt < publicFormRateLimit.maxAttempts; attempt += 1) {
        await consumeRateLimit(store, { key, now: firstWindow, ...publicFormRateLimit })
      }
      const beforeExpiry = await consumeRateLimit(store, {
        key,
        now: new Date(firstWindow.getTime() + publicFormRateLimit.windowMs - 1),
        ...publicFormRateLimit,
      })
      const atExpiry = await consumeRateLimit(store, {
        key,
        now: new Date(firstWindow.getTime() + publicFormRateLimit.windowMs),
        ...publicFormRateLimit,
      })

      expect(beforeExpiry.allowed).toBe(false)
      expect(atExpiry).toMatchObject({ allowed: true, remaining: 4 })
    } finally {
      await client.query('DELETE FROM "rate_limits" WHERE "key" = $1', [key])
    }
  }, 15000)
})
