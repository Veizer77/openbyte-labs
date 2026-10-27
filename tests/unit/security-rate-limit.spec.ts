import { describe, expect, it } from 'vitest'
import {
  advanceRateLimitWindow,
  consumeRateLimit,
  publicFormRateLimit,
  type AtomicRateLimitStore,
  type RateLimitWindowState,
} from '../../src/lib/security/rate-limit'

const minute = 60_000

function createInMemoryAtomicStore(): AtomicRateLimitStore {
  const entries = new Map<string, RateLimitWindowState>()
  let serial = Promise.resolve()

  return {
    consumeAtomic({ key, now, windowMs }) {
      const result = serial.then(() => {
        const next = advanceRateLimitWindow(entries.get(key), now, windowMs)
        entries.set(key, next)
        return next
      })
      serial = result.then(() => undefined)
      return result
    },
  }
}

describe('public form rate limit (5 submissions per 15 minutes per IP)', () => {
  it('allows the first five requests and rejects the sixth without exposing a count', async () => {
    const store = createInMemoryAtomicStore()
    const now = new Date('2026-10-27T12:00:00.000Z')
    const decisions = await Promise.all(Array.from({ length: 6 }, () => consumeRateLimit(store, {
      key: 'opaque-ip-key',
      now,
      ...publicFormRateLimit,
    })))

    expect(decisions.filter((decision) => decision.allowed)).toHaveLength(5)
    expect(decisions.at(-1)).toMatchObject({ allowed: false, remaining: 0, retryAfterSeconds: 900 })
    expect(decisions.at(-1)).not.toHaveProperty('count')
  })

  it('starts a new window exactly at the expiry boundary', () => {
    const startedAt = new Date('2026-10-27T12:00:00.000Z')
    const previous = { count: 5, windowStartedAt: startedAt }
    const next = advanceRateLimitWindow(previous, new Date(startedAt.getTime() + 15 * minute), 15 * minute)

    expect(next).toEqual({ count: 1, windowStartedAt: new Date(startedAt.getTime() + 15 * minute) })
  })

  it('does not reset a window one millisecond before expiry', () => {
    const startedAt = new Date('2026-10-27T12:00:00.000Z')
    const next = advanceRateLimitWindow(
      { count: 5, windowStartedAt: startedAt },
      new Date(startedAt.getTime() + 15 * minute - 1),
      15 * minute,
    )

    expect(next).toEqual({ count: 6, windowStartedAt: startedAt })
  })

  it('does not share rate-limit buckets across opaque client keys', async () => {
    const store = createInMemoryAtomicStore()
    const now = new Date('2026-10-27T12:00:00.000Z')
    const first = await consumeRateLimit(store, { key: 'ip-a', now, ...publicFormRateLimit })
    const second = await consumeRateLimit(store, { key: 'ip-b', now, ...publicFormRateLimit })

    expect(first.allowed).toBe(true)
    expect(second.allowed).toBe(true)
    expect(first.remaining).toBe(4)
    expect(second.remaining).toBe(4)
  })

  it('validates configuration before calling the store', async () => {
    let called = false
    const store: AtomicRateLimitStore = {
      consumeAtomic: async () => {
        called = true
        return { count: 1, windowStartedAt: new Date() }
      },
    }

    await expect(consumeRateLimit(store, {
      key: '',
      now: new Date(),
      maxAttempts: 5,
      windowMs: 0,
    })).rejects.toThrow()
    expect(called).toBe(false)
  })
})
