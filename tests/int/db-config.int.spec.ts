import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'

import {
  assertDisposableTestDatabase,
  parseEnvironment,
  resolveDatabaseConnectionString,
} from '../../src/lib/env'

const originalMigrateDirect = process.env.PAYLOAD_MIGRATE_DIRECT

afterAll(() => {
  if (originalMigrateDirect === undefined) {
    delete process.env.PAYLOAD_MIGRATE_DIRECT
  } else {
    process.env.PAYLOAD_MIGRATE_DIRECT = originalMigrateDirect
  }
})

describe('database connection selection', () => {
  it('uses the direct connection for migrations', () => {
    expect(
      resolveDatabaseConnectionString({
        migrateDirect: true,
        pooledUri: 'postgres://pooled.example/openbyte',
        directUri: 'postgres://direct.example/openbyte',
      }),
    ).toBe('postgres://direct.example/openbyte')
  })

  it('uses the pooled connection at runtime', () => {
    expect(
      resolveDatabaseConnectionString({
        migrateDirect: false,
        pooledUri: 'postgres://pooled.example/openbyte',
        directUri: 'postgres://direct.example/openbyte',
      }),
    ).toBe('postgres://pooled.example/openbyte')
  })

  it('refuses to migrate without a direct connection', () => {
    expect(() =>
      resolveDatabaseConnectionString({
        migrateDirect: true,
        pooledUri: 'postgres://pooled.example/openbyte',
      }),
    ).toThrow('DATABASE_URI_DIRECT')
  })

  it('refuses to run without a pooled connection', () => {
    expect(() =>
      resolveDatabaseConnectionString({
        migrateDirect: false,
        directUri: 'postgres://direct.example/openbyte',
      }),
    ).toThrow('DATABASE_URI')
  })
})

describe('disposable test database guard', () => {
  it('accepts local disposable targets', () => {
    expect(() =>
      assertDisposableTestDatabase('postgres://postgres:postgres@localhost:5432/openbyte_test'),
    ).not.toThrow()
  })

  it('accepts loopback IPv6 targets', () => {
    expect(() =>
      assertDisposableTestDatabase('postgres://postgres:postgres@[::1]:5432/openbyte_test'),
    ).not.toThrow()
  })

  it('refuses remote targets by default', () => {
    expect(() =>
      assertDisposableTestDatabase(
        'postgresql://user:secret@ep-example-pooler.example.neon.tech/openbyte_labs',
      ),
    ).toThrow(/non-disposable/)
  })

  it('allows a remote target only when its database name is approved explicitly', () => {
    const uri = 'postgresql://user:secret@ep-example-pooler.example.neon.tech/openbyte_labs__test'
    expect(() => assertDisposableTestDatabase(uri)).toThrow(/non-disposable/)
    expect(() =>
      assertDisposableTestDatabase(uri, { allowRemoteDatabase: 'openbyte_labs__test' }),
    ).not.toThrow()
    expect(() =>
      assertDisposableTestDatabase(uri, { allowRemoteDatabase: 'openbyte_labs' }),
    ).toThrow(/non-disposable/)
  })

  it('refuses malformed URIs and unnamed databases', () => {
    expect(() => assertDisposableTestDatabase('bukan-database-uri')).toThrow()
    expect(() =>
      assertDisposableTestDatabase('postgresql://user:secret@localhost:5432/'),
    ).toThrow(/database name/)
  })
})

describe('drop database flag guard', () => {
  it('refuses PAYLOAD_DROP_DATABASE in environment parsing', () => {
    expect(() =>
      parseEnvironment({
        PAYLOAD_SECRET: 'test-payload-secret-that-is-longer-than-32-characters',
        SITE_URL: 'http://localhost:3000',
        DATABASE_URI: 'postgres://postgres:postgres@localhost:5432/openbyte_test',
        DATABASE_URI_DIRECT: 'postgres://postgres:postgres@localhost:5432/openbyte_test',
        PAYLOAD_DROP_DATABASE: 'true',
      }),
    ).toThrow('PAYLOAD_DROP_DATABASE')
  })

  it('refuses to build the payload config while PAYLOAD_DROP_DATABASE is set', async () => {
    process.env.PAYLOAD_MIGRATE_DIRECT = '0'
    process.env.PAYLOAD_DROP_DATABASE = 'true'
    vi.resetModules()
    try {
      await expect(import('../../src/payload.config')).rejects.toThrow('PAYLOAD_DROP_DATABASE')
    } finally {
      delete process.env.PAYLOAD_DROP_DATABASE
      vi.resetModules()
    }
  }, 60000)
})

describe('payload config regressions', () => {
  async function importPayloadConfig() {
    const { default: configPromise, databaseAdapterArgs } = await import('../../src/payload.config')
    return { config: await configPromise, databaseAdapterArgs }
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  /**
   * DATABASE_URI dan DATABASE_URI_DIRECT boleh identik di lingkungan lain
   * (mis. CI memakai satu database service container untuk keduanya), sehingga
   * seleksi pooled/direct tidak bisa diamati bila keduanya dipakai apa adanya.
   * Tes yang menguji seleksi koneksi men-stub dua URI berbeda, lalu
   * memulihkannya, supaya asersinya bermakna di mana pun tes dijalankan.
   */
  function stubDistinctDatabaseUris(): () => void {
    const original = {
      pooled: process.env.DATABASE_URI,
      direct: process.env.DATABASE_URI_DIRECT,
    }
    process.env.DATABASE_URI = 'postgres://test-pooled@example-pooled.invalid:5432/openbyte_test'
    process.env.DATABASE_URI_DIRECT =
      'postgres://test-direct@example-direct.invalid:5432/openbyte_test'
    return () => {
      if (original.pooled === undefined) {
        delete process.env.DATABASE_URI
      } else {
        process.env.DATABASE_URI = original.pooled
      }
      if (original.direct === undefined) {
        delete process.env.DATABASE_URI_DIRECT
      } else {
        process.env.DATABASE_URI_DIRECT = original.direct
      }
    }
  }

  it('disables schema push so custom SQL objects survive development', async () => {
    process.env.PAYLOAD_MIGRATE_DIRECT = '0'
    const restoreUris = stubDistinctDatabaseUris()
    vi.resetModules()
    try {
      const { databaseAdapterArgs } = await importPayloadConfig()
      // Argumen inilah yang diteruskan ke postgresAdapter dan dijadikan
      // sumber `push` adaptor pada paket terkunci (3.92.0).
      expect(databaseAdapterArgs().push).toBe(false)
      expect(databaseAdapterArgs().pool.connectionString).toBe(process.env.DATABASE_URI)
    } finally {
      restoreUris()
    }
  }, 60000)

  it('keeps GraphQL disabled', async () => {
    process.env.PAYLOAD_MIGRATE_DIRECT = '0'
    vi.resetModules()
    const { config } = await importPayloadConfig()
    expect(config.graphQL.disable).toBe(true)
  }, 60000)

  it('pins serverURL and restricts csrf/cors to the configured site origins', async () => {
    process.env.PAYLOAD_MIGRATE_DIRECT = '0'
    vi.resetModules()
    const { config } = await importPayloadConfig()
    expect(config.serverURL).toBe(process.env.SITE_URL)
    expect(Array.isArray(config.csrf)).toBe(true)
    expect(config.csrf.length).toBeGreaterThan(0)
    expect(config.csrf).toContain(process.env.SITE_URL)
    expect(Array.isArray(config.cors)).toBe(true)
    expect(config.cors as string[]).toContain(process.env.SITE_URL)
    expect(config.cors as string[]).not.toContain('*')
    for (const origin of config.cors as string[]) {
      expect(origin).toMatch(/^https?:\/\//)
    }
  }, 60000)

  it('migrates through the direct connection when PAYLOAD_MIGRATE_DIRECT=1', async () => {
    process.env.PAYLOAD_MIGRATE_DIRECT = '1'
    const restoreUris = stubDistinctDatabaseUris()
    vi.resetModules()
    try {
      const { databaseAdapterArgs } = await importPayloadConfig()
      expect(databaseAdapterArgs().pool.connectionString).toBe(process.env.DATABASE_URI_DIRECT)
      expect(databaseAdapterArgs().pool.connectionString).not.toBe(process.env.DATABASE_URI)
    } finally {
      restoreUris()
    }
  }, 60000)

  it('runs on the pooled connection at runtime', async () => {
    process.env.PAYLOAD_MIGRATE_DIRECT = '0'
    const restoreUris = stubDistinctDatabaseUris()
    vi.resetModules()
    try {
      const { databaseAdapterArgs } = await importPayloadConfig()
      const pooled = databaseAdapterArgs().pool.connectionString
      expect(pooled).toBe(process.env.DATABASE_URI)
      expect(pooled).not.toBe(process.env.DATABASE_URI_DIRECT)
    } finally {
      restoreUris()
    }
  }, 60000)
})
