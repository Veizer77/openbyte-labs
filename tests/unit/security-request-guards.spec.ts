import { describe, expect, it } from 'vitest'
import { isSameOriginRequest } from '../../src/lib/security/origin'
import { isValidTurnstileResult } from '../../src/lib/security/turnstile'
import { resolveTrustedClientIp } from '../../src/server/security/client-ip'
import { createPublicFormRateLimitKey, hashClientIp } from '../../src/server/security/ip-hash'

describe('public request security guards', () => {
  it('accepts only an exact configured origin and rejects missing, malformed, or cross-site origins', () => {
    expect(isSameOriginRequest('https://openbyte.example/path', 'https://openbyte.example/base')).toBe(true)
    expect(isSameOriginRequest('https://openbyte.example:443', 'https://openbyte.example')).toBe(true)
    expect(isSameOriginRequest('https://attacker.example', 'https://openbyte.example')).toBe(false)
    expect(isSameOriginRequest(null, 'https://openbyte.example')).toBe(false)
    expect(isSameOriginRequest('null', 'https://openbyte.example')).toBe(false)
  })

  it('accepts a fresh Turnstile response only for the expected hostname and action', () => {
    const now = new Date('2026-10-27T12:00:00.000Z')
    const response = {
      success: true,
      challenge_ts: '2026-10-27T11:59:00.000Z',
      hostname: 'openbyte.example',
      action: 'public_form',
    }

    expect(isValidTurnstileResult(response, {
      expectedHostname: 'openbyte.example',
      expectedAction: 'public_form',
      now,
    })).toBe(true)
    expect(isValidTurnstileResult({ ...response, hostname: 'attacker.example' }, {
      expectedHostname: 'openbyte.example', expectedAction: 'public_form', now,
    })).toBe(false)
    expect(isValidTurnstileResult({ ...response, action: 'other_action' }, {
      expectedHostname: 'openbyte.example', expectedAction: 'public_form', now,
    })).toBe(false)
  })

  it('rejects failed, replayed, expired, future, and incomplete Turnstile responses', () => {
    const now = new Date('2026-10-27T12:00:00.000Z')
    const expected = { expectedHostname: 'openbyte.example', expectedAction: 'public_form', now }
    const validResponse = {
      success: true,
      challenge_ts: '2026-10-27T11:59:00.000Z',
      hostname: 'openbyte.example',
      action: 'public_form',
    }

    expect(isValidTurnstileResult({ ...validResponse, success: false }, expected)).toBe(false)
    expect(isValidTurnstileResult({ ...validResponse, challenge_ts: '2026-10-27T11:54:59.999Z' }, expected)).toBe(false)
    expect(isValidTurnstileResult({ ...validResponse, challenge_ts: '2026-10-27T12:00:31.000Z' }, expected)).toBe(false)
    expect(isValidTurnstileResult({ success: true, hostname: 'openbyte.example' }, expected)).toBe(false)
  })

  it('uses only explicitly configured proxy headers and requires a trustworthy client address', () => {
    expect(resolveTrustedClientIp({
      headers: { 'x-forwarded-for': '198.51.100.10, 203.0.113.8' },
      trustedHeader: 'x-forwarded-for',
      trustedProxyHops: 1,
    })).toBe('203.0.113.8')

    expect(resolveTrustedClientIp({
      headers: { 'x-forwarded-for': '198.51.100.10, 203.0.113.8' },
      trustedHeader: 'x-forwarded-for',
      trustedProxyHops: 2,
    })).toBe('198.51.100.10')

    expect(resolveTrustedClientIp({
      headers: { 'cf-connecting-ip': '2001:db8::1' },
      trustedHeader: 'cf-connecting-ip',
    })).toBe('2001:db8::1')

    expect(() => resolveTrustedClientIp({
      headers: { 'x-forwarded-for': '198.51.100.10' },
      trustedHeader: 'x-forwarded-for',
    })).toThrow()
    expect(() => resolveTrustedClientIp({
      headers: { 'x-forwarded-for': 'spoofed, 203.0.113.8' },
      trustedHeader: 'x-forwarded-for',
      trustedProxyHops: 1,
    })).toThrow()
    expect(() => resolveTrustedClientIp({
      headers: { 'x-forwarded-for': '198.51.100.10' },
      trustedHeader: 'x-forwarded-for',
      trustedProxyHops: 2,
    })).toThrow()
    expect(() => resolveTrustedClientIp({
      headers: { 'x-forwarded-for': '198.51.100.10' },
      trustedHeader: 'x-custom-client-ip',
      trustedProxyHops: 1,
    })).toThrow()
  })

  it('stores salted one-way IP hashes, never the raw address', () => {
    const ip = '198.51.100.10'
    const hash = hashClientIp(ip, 'test-only-salt')
    const key = createPublicFormRateLimitKey(ip, 'test-only-salt')

    expect(hash).toMatch(/^[a-f0-9]{64}$/)
    expect(key).toMatch(/^[a-f0-9]{64}$/)
    expect(hash).not.toContain(ip)
    expect(key).not.toContain(ip)
    expect(hashClientIp(ip, 'different-salt')).not.toBe(hash)
    expect(() => hashClientIp(ip, '')).toThrow()
    expect(() => hashClientIp('not-an-ip', 'test-only-salt')).toThrow()
  })
})
