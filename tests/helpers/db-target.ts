import { assertDisposableTestDatabase } from '../../src/lib/env'

/**
 * Menolak tes yang menulis database bila targetnya bukan database uji
 * disposable. Identitas diperiksa dari koneksi yang BENAR-BENAR dipakai
 * payload config (DATABASE_URI / DATABASE_URI_DIRECT), bukan dari nama
 * berkas .env. Saat .env menunjuk branch Neon pengembangan, tes wajib
 * gagal cepat dengan pesan ini alih-alih menulis data di sana.
 */
export async function assertTestDatabaseTargetIsDisposable(): Promise<void> {
  const { databaseAdapterArgs } = await import('../../src/payload.config')
  const uri = databaseAdapterArgs().pool.connectionString
  assertDisposableTestDatabase(uri)
}

export async function canRunDatabaseTests(): Promise<boolean> {
  try {
    await assertTestDatabaseTargetIsDisposable()
    return true
  } catch {
    return false
  }
}
