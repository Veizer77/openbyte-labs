export interface TurnstileSiteVerifyResult {
  success?: unknown
  challenge_ts?: unknown
  hostname?: unknown
  action?: unknown
}

export interface TurnstileValidationOptions {
  expectedHostname: string
  expectedAction: string
  now?: Date
  maxAgeMs?: number
  clockSkewMs?: number
}

export function isValidTurnstileResult(
  result: unknown,
  options: TurnstileValidationOptions,
): boolean {
  if (!result || typeof result !== 'object') return false
  const response = result as TurnstileSiteVerifyResult
  const now = options.now ?? new Date()
  const maxAgeMs = options.maxAgeMs ?? 5 * 60 * 1000
  const clockSkewMs = options.clockSkewMs ?? 30 * 1000

  if (response.success !== true || typeof response.hostname !== 'string' || typeof response.action !== 'string') {
    return false
  }
  if (response.hostname.toLowerCase() !== options.expectedHostname.toLowerCase()) return false
  if (response.action !== options.expectedAction) return false
  if (typeof response.challenge_ts !== 'string') return false

  const challengedAt = Date.parse(response.challenge_ts)
  const nowMs = now.getTime()
  if (!Number.isFinite(challengedAt) || !Number.isFinite(nowMs)) return false
  const ageMs = nowMs - challengedAt
  return ageMs <= maxAgeMs && ageMs >= -clockSkewMs
}
