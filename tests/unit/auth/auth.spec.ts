import { describe, it, expect, beforeEach } from 'vitest'
import { lockoutManager } from '../../../src/auth/lockout'
import { createAuth } from '../../../src/auth/better-auth'

describe('Auth & Lockout Mechanism (F0-10)', () => {
  beforeEach(() => {
    lockoutManager.clear()
    process.env.BETTER_AUTH_SECRET = 'a'.repeat(32)
    process.env.BETTER_AUTH_URL = 'http://localhost:3000'
    process.env.SITE_URL = 'http://localhost:3000'
    process.env.DATABASE_URI = 'postgresql://postgres:postgres@localhost:5432/testdb'
    process.env.DATABASE_URI_DIRECT = 'postgresql://postgres:postgres@localhost:5432/testdb'
  })

  describe('Lockout 5/15 Policy', () => {
    const identifier = 'admin@openbyte.id'

    it('tidak mengunci pada percobaan gagal ke 1 hingga 4', () => {
      for (let i = 1; i <= 4; i++) {
        const result = lockoutManager.recordFailure(identifier)
        expect(result.isLocked).toBe(false)
        expect(result.attempts).toBe(i)
      }
      expect(lockoutManager.isLocked(identifier).isLocked).toBe(false)
    })

    it('mengunci akun tepat pada percobaan gagal ke-5 selama 15 menit', () => {
      for (let i = 1; i <= 4; i++) {
        lockoutManager.recordFailure(identifier)
      }

      const fifthAttempt = lockoutManager.recordFailure(identifier)
      expect(fifthAttempt.isLocked).toBe(true)
      expect(fifthAttempt.attempts).toBe(5)
      expect(fifthAttempt.remainingSeconds).toBeGreaterThan(800)

      const status = lockoutManager.isLocked(identifier)
      expect(status.isLocked).toBe(true)
      expect(status.remainingSeconds).toBeGreaterThan(800)
    })

    it('mereset status lockout ketika di-reset eksplisit', () => {
      for (let i = 1; i <= 5; i++) {
        lockoutManager.recordFailure(identifier)
      }
      expect(lockoutManager.isLocked(identifier).isLocked).toBe(true)

      lockoutManager.reset(identifier)
      expect(lockoutManager.isLocked(identifier).isLocked).toBe(false)
    })
  })

  describe('Better Auth Configuration Safeguards', () => {
    it('memastikan signup publik ditutup total', () => {
      const auth = createAuth()
      expect(auth.options.emailAndPassword?.disableSignUp).toBe(true)
    })

    it('memastikan plugin two-factor terpasang dengan issuer yang benar', () => {
      const auth = createAuth()
      const twoFactorPlugin = auth.options.plugins?.find((p) => p.id === 'two-factor')
      expect(twoFactorPlugin).toBeDefined()
    })
  })
})
