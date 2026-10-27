import config from '@payload-config'
import { getPayload } from 'payload'
import { env } from '../../lib/env'
import { consumeRateLimit, publicFormRateLimit } from '../../lib/security/rate-limit'
import { createPublicFormRateLimitKey } from './ip-hash'
import { createPostgresRateLimitStore, type PostgresQueryClient } from './postgres-rate-limit'

/** Uses Payload's existing PostgreSQL pool and the atomically-upserted rate_limits table. */
export async function checkPublicFormRateLimit(ip: string) {
  if (!env.IP_HASH_SALT) throw new Error('Public form security is not configured')

  const payload = await getPayload({ config })
  const database = payload.db as unknown as { drizzle?: { $client?: PostgresQueryClient } }
  const client = database.drizzle?.$client
  if (!client) throw new Error('Public form security is not configured')

  const key = createPublicFormRateLimitKey(ip, env.IP_HASH_SALT)
  return consumeRateLimit(createPostgresRateLimitStore(client), {
    key,
    now: new Date(),
    ...publicFormRateLimit,
  })
}
