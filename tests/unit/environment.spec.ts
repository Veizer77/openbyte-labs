import { describe, expect, it } from 'vitest'
import { parseEnvironment } from '../../src/lib/env'

const valid = {
  SITE_URL: 'http://localhost:3000',
  BETTER_AUTH_URL: 'http://localhost:3000',
  BETTER_AUTH_SECRET: 'only-a-test-secret-with-at-least-32-characters',
  DATABASE_URI: 'postgres://test:test@localhost:5432/openbyte_test',
  DATABASE_URI_DIRECT: 'postgres://test:test@localhost:5432/openbyte_test',
}

describe('PRD 1.5 environment', () => {
  it('accepts the new stack variables without a CMS secret', () => {
    expect(parseEnvironment(valid).BETTER_AUTH_URL).toBe(valid.SITE_URL)
  })
  it('requires an independent auth secret', () => {
    expect(() => parseEnvironment({ ...valid, BETTER_AUTH_SECRET: '' })).toThrow('BETTER_AUTH_SECRET')
  })
  it('rejects mismatched auth and site origins', () => {
    expect(() => parseEnvironment({ ...valid, BETTER_AUTH_URL: 'https://elsewhere.invalid' })).toThrow('BETTER_AUTH_URL')
  })
  it('reports malformed origins without echoing raw input', () => {
    expect(() => parseEnvironment({ ...valid, SITE_URL: 'private-invalid-origin' })).toThrow('SITE_URL')
  })
  it('reports malformed PostgreSQL URLs by field name', () => {
    expect(() => parseEnvironment({ ...valid, DATABASE_URI: 'private-invalid-database' })).toThrow('DATABASE_URI')
  })
  it('rejects a URL with a path for an origin', () => {
    expect(() => parseEnvironment({ ...valid, SITE_URL: 'https://example.invalid/admin' })).toThrow('SITE_URL')
  })
  it('requires PostgreSQL URLs for both connections', () => {
    expect(() => parseEnvironment({ ...valid, DATABASE_URI_DIRECT: 'https://example.invalid' })).toThrow('DATABASE_URI_DIRECT')
  })
  it('reports field names rather than secret values', () => {
    const sensitive = 'sensitive-invalid-auth-value'
    try {
      parseEnvironment({ ...valid, BETTER_AUTH_SECRET: sensitive })
      expect.fail('Expected validation failure')
    } catch (error) {
      expect(String(error)).toContain('BETTER_AUTH_SECRET')
      expect(String(error)).not.toContain(sensitive)
    }
  })
  it('requires all public storage settings when one is supplied', () => {
    expect(() => parseEnvironment({ ...valid, R2_ACCOUNT_ID: 'test-account' })).toThrow('R2_ACCOUNT_ID')
  })
})
