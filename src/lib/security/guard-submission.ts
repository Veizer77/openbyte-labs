import type { z } from 'zod'
import { isSameOriginRequest } from './origin'
import { isHoneypotFilled } from './submissions'
import type { RateLimitDecision } from './rate-limit'

export interface PublicSubmissionFields {
  turnstileToken: string
  website?: string
}

export type PublicSubmissionGuardResult<T> =
  | { ok: true; data: Omit<T, 'turnstileToken' | 'website'>; clientIpHash: string }
  | {
      ok: false
      reason: 'origin' | 'invalid' | 'spam' | 'turnstile' | 'rate-limit' | 'unavailable'
      fieldErrors?: Record<string, string[]>
      retryAfterSeconds?: number
    }

export interface GuardPublicSubmissionOptions<T extends PublicSubmissionFields> {
  schema: z.ZodType<T>
  input: unknown
  origin: string | null | undefined
  siteUrl: string
  verifyTurnstile: (token: string) => Promise<boolean>
  resolveClientIp: () => string | Promise<string>
  checkRateLimit: (ip: string) => Promise<RateLimitDecision>
  hashClientIp: (ip: string) => string
}

/** Shared public-write gate. Keep authoritative database reads and Local API writes after this succeeds. */
export async function guardPublicSubmission<T extends PublicSubmissionFields>({
  schema,
  input,
  origin,
  siteUrl,
  verifyTurnstile,
  resolveClientIp,
  checkRateLimit,
  hashClientIp,
}: GuardPublicSubmissionOptions<T>): Promise<PublicSubmissionGuardResult<T>> {
  if (!isSameOriginRequest(origin, siteUrl)) return { ok: false, reason: 'origin' }

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'form')
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message]
    }
    return { ok: false, reason: 'invalid', fieldErrors }
  }

  if (isHoneypotFilled(parsed.data.website)) return { ok: false, reason: 'spam' }

  try {
    if (!await verifyTurnstile(parsed.data.turnstileToken)) {
      return { ok: false, reason: 'turnstile' }
    }

    const clientIp = await resolveClientIp()
    const rateLimit = await checkRateLimit(clientIp)
    if (!rateLimit.allowed) {
      return {
        ok: false,
        reason: 'rate-limit',
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      }
    }

    const { turnstileToken: _turnstileToken, website: _website, ...data } = parsed.data
    void _turnstileToken
    void _website
    return { ok: true, data, clientIpHash: hashClientIp(clientIp) }
  } catch {
    return { ok: false, reason: 'unavailable' }
  }
}
