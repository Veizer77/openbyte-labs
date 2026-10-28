import { describe, it, expect } from 'vitest'
import { assertSafeDatabaseTarget } from '../../scripts/db-guard.mjs'
import { user, session, account, verification, twoFactor } from '../../src/db/schema/auth'
import { users, auditLogs } from '../../src/db/schema/domain'

describe('Database Foundation & Safety Guard (F0-08)', () => {
  it('menolak target remote tanpa ALLOW_DB_MIGRATE=true', () => {
    delete process.env.ALLOW_DB_MIGRATE
    expect(() => {
      assertSafeDatabaseTarget('postgresql://user:pass@production-host.neon.tech/neondb')
    }).toThrow(/DB SAFETY GUARD/)
  })

  it('mengizinkan target localhost secara default', () => {
    delete process.env.ALLOW_DB_MIGRATE
    expect(() => {
      assertSafeDatabaseTarget('postgresql://postgres:postgres@localhost:5432/testdb')
    }).not.toThrow()
  })

  it('mengizinkan target remote jika ALLOW_DB_MIGRATE=true', () => {
    process.env.ALLOW_DB_MIGRATE = 'true'
    expect(() => {
      assertSafeDatabaseTarget('postgresql://user:pass@ep-test-sample.neon.tech/testdb')
    }).not.toThrow()
    delete process.env.ALLOW_DB_MIGRATE
  })

  it('mendefinisikan schema auth dan domain dengan tabel yang benar', () => {
    expect(user).toBeDefined()
    expect(session).toBeDefined()
    expect(account).toBeDefined()
    expect(verification).toBeDefined()
    expect(twoFactor).toBeDefined()
    expect(users).toBeDefined()
    expect(auditLogs).toBeDefined()
  })
})
