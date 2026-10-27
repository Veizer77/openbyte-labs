export const publicFormRateLimit = Object.freeze({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
})

export interface RateLimitWindowState {
  count: number
  windowStartedAt: Date
}

export interface AtomicRateLimitStore {
  /** Must increment and return the persisted state in one atomic database operation. */
  consumeAtomic(input: { key: string; now: Date; windowMs: number }): Promise<RateLimitWindowState>
}

export interface ConsumeRateLimitInput {
  key: string
  now: Date
  maxAttempts: number
  windowMs: number
}

export interface RateLimitDecision {
  allowed: boolean
  remaining: number
  resetAt: Date
  retryAfterSeconds: number
}

/** Deterministic window transition, used by tests and mirrored by the SQL upsert. */
export function advanceRateLimitWindow(
  previous: RateLimitWindowState | undefined,
  now: Date,
  windowMs: number,
): RateLimitWindowState {
  assertValidWindow(now, windowMs)

  if (!previous || previous.windowStartedAt.getTime() + windowMs <= now.getTime()) {
    return { count: 1, windowStartedAt: new Date(now.getTime()) }
  }

  if (!Number.isSafeInteger(previous.count) || previous.count < 1 || !Number.isFinite(previous.windowStartedAt.getTime())) {
    throw new Error('Invalid persisted rate-limit state')
  }

  return {
    count: previous.count + 1,
    windowStartedAt: new Date(previous.windowStartedAt.getTime()),
  }
}

export async function consumeRateLimit(
  store: AtomicRateLimitStore,
  input: ConsumeRateLimitInput,
): Promise<RateLimitDecision> {
  if (!input.key || input.key.length > 512) {
    throw new Error('Invalid rate-limit key')
  }
  if (!Number.isSafeInteger(input.maxAttempts) || input.maxAttempts < 1) {
    throw new Error('Invalid rate-limit maximum')
  }
  assertValidWindow(input.now, input.windowMs)

  const state = await store.consumeAtomic({
    key: input.key,
    now: input.now,
    windowMs: input.windowMs,
  })
  if (!Number.isSafeInteger(state.count) || state.count < 1 || !Number.isFinite(state.windowStartedAt.getTime())) {
    throw new Error('Invalid persisted rate-limit state')
  }

  const resetAt = new Date(state.windowStartedAt.getTime() + input.windowMs)
  const allowed = state.count <= input.maxAttempts
  return {
    allowed,
    remaining: Math.max(0, input.maxAttempts - state.count),
    resetAt,
    retryAfterSeconds: allowed
      ? 0
      : Math.max(0, Math.ceil((resetAt.getTime() - input.now.getTime()) / 1000)),
  }
}

function assertValidWindow(now: Date, windowMs: number): void {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
    throw new Error('Invalid rate-limit timestamp')
  }
  if (!Number.isSafeInteger(windowMs) || windowMs < 1) {
    throw new Error('Invalid rate-limit window')
  }
}
