import { describe, expect, it } from 'vitest'

const baseEnvironment = {
  PAYLOAD_SECRET: 'test-payload-secret-that-is-longer-than-32-characters',
  SITE_URL: 'http://localhost:3000',
  DATABASE_URI: 'postgres://postgres:postgres@localhost:5432/openbyte',
  DATABASE_URI_DIRECT: 'postgres://postgres:postgres@localhost:5432/openbyte',
}

Object.assign(process.env, baseEnvironment)
const { parseEnvironment } = await import('../../src/lib/env')

describe('environment validation', () => {
  it('allows a complete R2 public location without upload credentials outside production', () => {
    const result = parseEnvironment({
      ...baseEnvironment,
      R2_ACCOUNT_ID: '4d946cbcb0dcf790e67c01658cf52c20',
      R2_BUCKET_PUBLIC: 'openbytelabs',
      R2_PUBLIC_BASE_URL: 'https://pub-56e1d9e9745541f7bbe1141aa7cc3be3.r2.dev',
    })

    expect(result.R2_BUCKET_PUBLIC).toBe('openbytelabs')
    expect(result.R2_ACCESS_KEY_ID).toBeUndefined()
  })

  it('requires both upload credentials when either credential is configured', () => {
    expect(() =>
      parseEnvironment({
        ...baseEnvironment,
        R2_ACCESS_KEY_ID: 'access-key-only',
      }),
    ).toThrow('R2_ACCESS_KEY_ID')
  })

  it('requires R2 upload credentials in production', () => {
    expect(() =>
      parseEnvironment({
        ...baseEnvironment,
        NODE_ENV: 'production',
        R2_ACCOUNT_ID: '4d946cbcb0dcf790e67c01658cf52c20',
        R2_BUCKET_PUBLIC: 'openbytelabs',
        R2_PUBLIC_BASE_URL: 'https://pub-56e1d9e9745541f7bbe1141aa7cc3be3.r2.dev',
      }),
    ).toThrow('R2_ACCESS_KEY_ID')
  })

  it('allows a production build without deployment-only R2 credentials', () => {
    const result = parseEnvironment({
      ...baseEnvironment,
      NODE_ENV: 'production',
      NEXT_PHASE: 'phase-production-build',
      R2_ACCOUNT_ID: '4d946cbcb0dcf790e67c01658cf52c20',
      R2_BUCKET_PUBLIC: 'openbytelabs',
      R2_PUBLIC_BASE_URL: 'https://pub-56e1d9e9745541f7bbe1141aa7cc3be3.r2.dev',
    })

    expect(result.R2_ACCESS_KEY_ID).toBeUndefined()
  })

  it('parses a trusted proxy hop count only with the forwarded-for header', () => {
    const result = parseEnvironment({
      ...baseEnvironment,
      TRUSTED_IP_HEADER: 'x-forwarded-for',
      TRUSTED_IP_PROXY_HOPS: '2',
    })

    expect(result.TRUSTED_IP_PROXY_HOPS).toBe(2)
    expect(() => parseEnvironment({
      ...baseEnvironment,
      TRUSTED_IP_HEADER: 'cf-connecting-ip',
      TRUSTED_IP_PROXY_HOPS: '1',
    })).toThrow('TRUSTED_IP_PROXY_HOPS')
  })
})
