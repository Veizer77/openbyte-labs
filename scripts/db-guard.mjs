/**
 * Guard keselamatan target database.
 * Mencegah migrasi tidak sengaja berjalan di database produksi tanpa izin eksplisit.
 */
export function assertSafeDatabaseTarget(uri) {
  if (!uri) {
    throw new Error('DATABASE_URI atau DATABASE_URI_DIRECT belum ditentukan.')
  }

  let url
  try {
    url = new URL(uri)
  } catch {
    throw new Error('URI database tidak valid.')
  }

  const hostname = url.hostname.toLowerCase()
  const isLocal = ['localhost', '127.0.0.1', '::1'].includes(hostname)
  const isAllowedTest = Boolean(process.env.ALLOW_DB_MIGRATE === 'true')

  if (!isLocal && !isAllowedTest) {
    throw new Error(
      `[DB SAFETY GUARD]: Migrasi ke host remote "${hostname}" ditolak. Setel ALLOW_DB_MIGRATE=true untuk konfirmasi target tes yang diizinkan.`
    )
  }
}
