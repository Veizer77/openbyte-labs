import 'server-only'

import { headers } from 'next/headers'
import type { z } from 'zod'
import type { PublicSubmissionFields, PublicSubmissionGuardResult } from '../../lib/security/guard-submission'
import { guardPublicSubmission } from '../../lib/security/guard-submission'
import { env } from '../../lib/env'
import { resolveTrustedClientIp } from './client-ip'
import { hashClientIp } from './ip-hash'
import { checkPublicFormRateLimit } from './public-form-rate-limit'
import { verifyTurnstileToken } from './turnstile'

/** Request-aware adapter for the shared guard. Actions must write only after this succeeds. */
export async function guardPublicRequest<T extends PublicSubmissionFields>(
  schema: z.ZodType<T>,
  input: unknown,
): Promise<PublicSubmissionGuardResult<T>> {
  const requestHeaders = await headers()
  const expectedHostname = new URL(env.SITE_URL).hostname

  return guardPublicSubmission({
    schema,
    input,
    origin: requestHeaders.get('origin'),
    siteUrl: env.SITE_URL,
    verifyTurnstile: (token) => verifyTurnstileToken({
      token,
      secret: env.TURNSTILE_SECRET_KEY,
      expectedHostname,
      expectedAction: 'public_form',
    }),
    resolveClientIp: () => resolveTrustedClientIp({
      headers: requestHeaders,
      trustedHeader: env.TRUSTED_IP_HEADER,
      trustedProxyHops: env.TRUSTED_IP_PROXY_HOPS,
    }),
    checkRateLimit: checkPublicFormRateLimit,
    hashClientIp: (ip) => hashClientIp(ip, env.IP_HASH_SALT),
  })
}
