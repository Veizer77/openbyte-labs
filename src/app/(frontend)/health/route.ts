import type { PostgresAdapter } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'

import { checkDatabaseHealth } from '@/lib/health'

import config from '@payload-config'

export const dynamic = 'force-dynamic'

/**
 * `/health` — pemeriksaan koneksi database untuk uptime monitor eksternal
 * (PRD 4.1, 6.7). Respons dinamis tanpa cache, hanya berisi status tanpa
 * detail konfigurasi, dan 503 ketika database gagal. Interval monitor
 * >= 5 menit agar Neon tetap bisa suspend (PRD 6.7).
 */
export async function GET(): Promise<Response> {
  const health = await checkDatabaseHealth(async () => {
    const payload = await getPayload({ config })
    const adapter = payload.db as unknown as PostgresAdapter
    await adapter.pool.query('select 1')
  })

  return Response.json(health, {
    status: health.status === 'ok' ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  })
}
