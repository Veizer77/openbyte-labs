import { isValidTurnstileResult } from '../../lib/security/turnstile'

const siteVerifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export interface VerifyTurnstileTokenOptions {
  token: string
  secret: string | undefined
  expectedHostname: string
  expectedAction: string
  now?: Date
  fetcher?: typeof fetch
}

/** Verifies a browser token through Cloudflare. No secret or token is logged or returned. */
export async function verifyTurnstileToken({
  token,
  secret,
  expectedHostname,
  expectedAction,
  now,
  fetcher = fetch,
}: VerifyTurnstileTokenOptions): Promise<boolean> {
  if (!token.trim() || !secret?.trim() || !expectedHostname.trim() || !expectedAction.trim()) {
    return false
  }

  const body = new URLSearchParams({ secret, response: token })
  try {
    const response = await fetcher(siteVerifyUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    })
    if (!response.ok) return false

    const result: unknown = await response.json()
    return isValidTurnstileResult(result, { expectedHostname, expectedAction, now })
  } catch {
    return false
  }
}
