import { z } from 'zod'

const optional = z.preprocess((value) => value === '' ? undefined : value, z.string().optional())
function parseUrl(value: string): URL | null {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

const postgresUrl = z.string().refine((value) => {
  const url = parseUrl(value)
  return Boolean(url && ['postgres:', 'postgresql:'].includes(url.protocol) && url.hostname && url.pathname.length > 1)
})
const origin = z.string().refine((value) => {
  const url = parseUrl(value)
  return Boolean(url && ['https:', 'http:'].includes(url.protocol) && url.pathname === '/' &&
    !url.search && !url.hash && !url.username && !url.password)
})

const schema = z.object({
  SITE_URL: origin,
  BETTER_AUTH_URL: origin,
  BETTER_AUTH_SECRET: z.string().min(32),
  DATABASE_URI: postgresUrl,
  DATABASE_URI_DIRECT: postgresUrl,
  R2_ACCOUNT_ID: optional,
  R2_ACCESS_KEY_ID: optional,
  R2_SECRET_ACCESS_KEY: optional,
  R2_BUCKET_PUBLIC: optional,
  R2_PUBLIC_BASE_URL: optional,
  R2_BUCKET_PRIVATE: optional,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optional,
  TURNSTILE_SECRET_KEY: optional,
  IP_HASH_SALT: optional,
  TRUSTED_IP_HEADER: optional,
  SENTRY_DSN: optional,
  WA_DEFAULT_NUMBER: optional,
  TRACKING_SESSION_SECRET: optional,
}).superRefine((values, context) => {
  const authUrl = parseUrl(values.BETTER_AUTH_URL)
  const siteUrl = parseUrl(values.SITE_URL)
  if (authUrl && siteUrl && authUrl.origin !== siteUrl.origin) {
    context.addIssue({ code: 'custom', path: ['BETTER_AUTH_URL'], message: 'Origin auth harus sama dengan situs.' })
  }
  const storage = [values.R2_ACCOUNT_ID, values.R2_ACCESS_KEY_ID, values.R2_SECRET_ACCESS_KEY, values.R2_BUCKET_PUBLIC, values.R2_PUBLIC_BASE_URL]
  if (storage.some(Boolean) && !storage.every(Boolean)) {
    context.addIssue({ code: 'custom', path: ['R2_ACCOUNT_ID'], message: 'Konfigurasi R2 publik harus lengkap.' })
  }
  if (values.R2_PUBLIC_BASE_URL) {
    try {
      if (new URL(values.R2_PUBLIC_BASE_URL).protocol !== 'https:') throw new Error('protocol')
    } catch {
      context.addIssue({ code: 'custom', path: ['R2_PUBLIC_BASE_URL'], message: 'URL media harus HTTPS.' })
    }
  }
})

export function parseEnvironment(source: Record<string, string | undefined>) {
  const result = schema.safeParse(source)
  if (!result.success) {
    const fields = [...new Set(result.error.issues.map((issue) => issue.path.join('.')))]
    throw new Error(`Konfigurasi environment tidak valid: ${fields.join(', ')}`)
  }
  return result.data
}

export function getEnvironment() {
  return parseEnvironment(process.env)
}
