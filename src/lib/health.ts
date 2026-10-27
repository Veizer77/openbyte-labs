/**
 * Logika health check murni (dipakai route /health dan dapat diuji tanpa
 * database). Hanya mengembalikan status; tidak pernah membocorkan
 * konfigurasi (PRD 4.1 dan 6.7).
 */
export type HealthResult = {
  status: 'ok' | 'unhealthy'
  database: 'up' | 'down'
}

/**
 * Menjalankan satu kueri pemeriksaan; hasil selalu terbatas waktu supaya
 * monitor uptime tidak menggantung saat database tidak merespons.
 */
export async function checkDatabaseHealth(
  runQuery: () => Promise<unknown>,
  { timeoutMs = 5_000 }: { timeoutMs?: number } = {},
): Promise<HealthResult> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('health check timeout')), timeoutMs)
    })
    await Promise.race([runQuery(), timeout])
    return { status: 'ok', database: 'up' }
  } catch {
    return { status: 'unhealthy', database: 'down' }
  } finally {
    if (timer) clearTimeout(timer)
  }
}
