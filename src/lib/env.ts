import { z } from 'zod'

const optionalValue = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().optional(),
)

const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().url().optional(),
)

const envSchema = z.object({
  PAYLOAD_SECRET: z.string().min(32),
  SITE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  DATABASE_URI: z.string().url(),
  DATABASE_URI_DIRECT: z.string().url(),
  R2_ACCOUNT_ID: optionalValue,
  R2_ACCESS_KEY_ID: optionalValue,
  R2_SECRET_ACCESS_KEY: optionalValue,
  R2_BUCKET_PUBLIC: optionalValue,
  R2_BUCKET_PRIVATE: optionalValue,
  R2_PUBLIC_BASE_URL: optionalUrl,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalValue,
  TURNSTILE_SECRET_KEY: optionalValue,
  SENTRY_DSN: optionalUrl,
  IP_HASH_SALT: optionalValue,
  TRACKING_SESSION_SECRET: optionalValue,
  WA_DEFAULT_NUMBER: optionalValue,
  TRUSTED_IP_HEADER: optionalValue,
})

export function parseEnvironment(source: Record<string, string | undefined> = process.env) {
  if (source.PAYLOAD_DROP_DATABASE === 'true') {
    throw new Error(
      'PAYLOAD_DROP_DATABASE is not allowed in this project: schema changes go through Payload migrations only',
    )
  }

  const result = envSchema
    .superRefine((values, context) => {
      const locationValues = [
        values.R2_ACCOUNT_ID,
        values.R2_BUCKET_PUBLIC,
        values.R2_PUBLIC_BASE_URL,
      ]
      const credentialValues = [values.R2_ACCESS_KEY_ID, values.R2_SECRET_ACCESS_KEY]
      const configuredLocationValues = locationValues.filter(Boolean).length
      const configuredCredentialValues = credentialValues.filter(Boolean).length
      const isProductionRuntime =
        source.NODE_ENV === 'production' && source.NEXT_PHASE !== 'phase-production-build'

      if (configuredLocationValues > 0 && configuredLocationValues < locationValues.length) {
        context.addIssue({
          code: 'custom',
          message: 'R2 public location variables must be configured together',
          path: ['R2_ACCOUNT_ID'],
        })
      }

      if (configuredCredentialValues === 1) {
        context.addIssue({
          code: 'custom',
          message: 'R2 upload credentials must be configured together',
          path: ['R2_ACCESS_KEY_ID'],
        })
      }

      if (configuredCredentialValues === 2 && configuredLocationValues !== locationValues.length) {
        context.addIssue({
          code: 'custom',
          message: 'R2 upload credentials require a complete public location configuration',
          path: ['R2_ACCOUNT_ID'],
        })
      }

      if (
        isProductionRuntime && configuredCredentialValues !== credentialValues.length
      ) {
        context.addIssue({
          code: 'custom',
          message: 'R2 upload credentials are required in production',
          path: ['R2_ACCESS_KEY_ID'],
        })
      }

      if (isProductionRuntime && configuredLocationValues !== locationValues.length) {
        context.addIssue({
          code: 'custom',
          message: 'R2 public storage is required in production',
          path: ['R2_ACCOUNT_ID'],
        })
      }
    })
    .safeParse(source)

  if (!result.success) {
    const invalidKeys = result.error.issues.map((issue) => issue.path.join('.'))
    throw new Error(`Invalid environment configuration: ${invalidKeys.join(', ')}`)
  }

  return result.data
}

export const env = parseEnvironment()

export type DatabaseConnectionSelection = {
  /** True saat menjalankan migrasi (PAYLOAD_MIGRATE_DIRECT=1). */
  migrateDirect: boolean
  pooledUri?: string
  directUri?: string
}

/**
 * Memilih koneksi database: direct hanya untuk migrasi, pooled untuk runtime.
 * Skema hanya boleh berubah lewat migrasi, sehingga migrasi wajib memakai
 * koneksi direct dan gagal cepat bila koneksi itu tidak tersedia.
 */
export function resolveDatabaseConnectionString({
  migrateDirect,
  pooledUri,
  directUri,
}: DatabaseConnectionSelection): string {
  if (migrateDirect) {
    if (!directUri) {
      throw new Error('DATABASE_URI_DIRECT is required when PAYLOAD_MIGRATE_DIRECT=1 (migrations)')
    }
    return directUri
  }

  if (!pooledUri) {
    throw new Error('DATABASE_URI is required for the runtime connection')
  }

  return pooledUri
}

const DISPOSABLE_TEST_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1'])

export type DisposableTestDatabaseOptions = {
  /**
   * Nama database remote yang disetujui pemilik untuk dipakai tes.
   * Harus sama persis dengan nama database pada URI target.
   */
  allowRemoteDatabase?: string
}

/**
 * Menolak operasi yang menulis database bila target bukan database uji
 * disposable. Identitas diperiksa dari URI target (host + nama database),
 * bukan dari nama berkas .env. Target remote hanya diterima bila pemilik
 * menyetujui nama database-nya secara eksplisit.
 */
export function assertDisposableTestDatabase(
  rawUri: string,
  { allowRemoteDatabase }: DisposableTestDatabaseOptions = {},
): void {
  let uri: URL
  try {
    uri = new URL(rawUri)
  } catch {
    throw new Error('Test target database URI is not a valid URL')
  }

  const databaseName = uri.pathname.replace(/^\//, '')
  if (!databaseName) {
    throw new Error('Test target database URI has no database name')
  }

  if (DISPOSABLE_TEST_HOSTS.has(uri.hostname)) {
    return
  }

  if (allowRemoteDatabase && allowRemoteDatabase === databaseName) {
    return
  }

  throw new Error(
    `Refusing to run database-writing operations against non-disposable target '${uri.hostname}/${databaseName}'. ` +
      'Use a disposable local database, or explicitly approve the remote test database name via allowRemoteDatabase.',
  )
}
