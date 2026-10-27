import { describe, expect, it, vi } from 'vitest'
import { guardPublicSubmission } from '../../src/lib/security/guard-submission'
import { inquirySubmissionSchema } from '../../src/lib/security/submissions'

const validInquiry = {
  name: 'Budi Santoso',
  whatsapp: '081234567890',
  message: 'Mohon informasi layanan lebih lanjut.',
  consent: true,
  turnstileToken: 'private-browser-token',
  website: '',
}

const shared = {
  schema: inquirySubmissionSchema,
  siteUrl: 'https://openbyte.example',
  input: validInquiry,
  origin: 'https://openbyte.example',
  verifyTurnstile: vi.fn(async () => true),
  resolveClientIp: vi.fn(async () => '198.51.100.10'),
  checkRateLimit: vi.fn(async () => ({
    allowed: true,
    remaining: 4,
    resetAt: new Date('2026-10-27T12:15:00.000Z'),
    retryAfterSeconds: 0,
  })),
  hashClientIp: vi.fn(() => 'a'.repeat(64)),
}

describe('shared public submission security gate', () => {
  it('checks the Origin before running validation or external services', async () => {
    const verifyTurnstile = vi.fn(async () => true)
    const result = await guardPublicSubmission({
      ...shared,
      origin: 'https://attacker.example',
      verifyTurnstile,
    })

    expect(result).toEqual({ ok: false, reason: 'origin' })
    expect(verifyTurnstile).not.toHaveBeenCalled()
    expect(shared.resolveClientIp).not.toHaveBeenCalled()
    expect(shared.checkRateLimit).not.toHaveBeenCalled()
  })

  it('validates schema, honeypot, Turnstile, and rate limit in order', async () => {
    const calls: string[] = []
    const result = await guardPublicSubmission({
      ...shared,
      verifyTurnstile: async () => { calls.push('turnstile'); return true },
      resolveClientIp: async () => { calls.push('ip'); return '198.51.100.10' },
      checkRateLimit: async () => {
        calls.push('rate-limit')
        return { allowed: true, remaining: 4, resetAt: new Date(), retryAfterSeconds: 0 }
      },
      hashClientIp: () => { calls.push('hash'); return 'b'.repeat(64) },
    })

    expect(calls).toEqual(['turnstile', 'ip', 'rate-limit', 'hash'])
    expect(result).toMatchObject({ ok: true, clientIpHash: 'b'.repeat(64) })
    if (result.ok) {
      expect(result.data.whatsapp).toBe('6281234567890')
      expect(JSON.stringify(result)).not.toContain('198.51.100.10')
      expect(JSON.stringify(result)).not.toContain('private-browser-token')
    }
  })

  it('does not call Turnstile or rate limiting for invalid data or a filled honeypot', async () => {
    const verifyTurnstile = vi.fn(async () => true)
    const checkRateLimit = vi.fn(shared.checkRateLimit)

    const invalid = await guardPublicSubmission({
      ...shared,
      input: { ...validInquiry, whatsapp: 'invalid' },
      verifyTurnstile,
      checkRateLimit,
    })
    expect(invalid).toMatchObject({ ok: false, reason: 'invalid' })

    const bot = await guardPublicSubmission({
      ...shared,
      input: { ...validInquiry, website: 'bot filled this' },
      verifyTurnstile,
      checkRateLimit,
    })
    expect(bot).toEqual({ ok: false, reason: 'spam' })
    expect(verifyTurnstile).not.toHaveBeenCalled()
    expect(checkRateLimit).not.toHaveBeenCalled()
  })

  it('does not consume a rate-limit attempt when Turnstile rejects the token', async () => {
    const checkRateLimit = vi.fn(shared.checkRateLimit)
    const result = await guardPublicSubmission({
      ...shared,
      verifyTurnstile: async () => false,
      checkRateLimit,
    })

    expect(result).toEqual({ ok: false, reason: 'turnstile' })
    expect(checkRateLimit).not.toHaveBeenCalled()
  })

  it('returns a generic unavailable result if a security dependency fails', async () => {
    const result = await guardPublicSubmission({
      ...shared,
      resolveClientIp: async () => { throw new Error('proxy detail') },
    })

    expect(result).toEqual({ ok: false, reason: 'unavailable' })
    expect(JSON.stringify(result)).not.toContain('proxy detail')
  })

  it('returns a retry delay without exposing the persisted request count', async () => {
    const result = await guardPublicSubmission({
      ...shared,
      checkRateLimit: async () => ({
        allowed: false,
        remaining: 0,
        resetAt: new Date('2026-10-27T12:15:00.000Z'),
        retryAfterSeconds: 521,
      }),
    })

    expect(result).toEqual({ ok: false, reason: 'rate-limit', retryAfterSeconds: 521 })
  })
})
