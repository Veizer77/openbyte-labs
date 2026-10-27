import { describe, expect, it, vi } from 'vitest'
import { verifyTurnstileToken } from '../../src/server/security/turnstile'

describe('server-side Turnstile verification', () => {
  it('sends the token to Cloudflare and validates hostname, action, and timestamp', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      challenge_ts: '2026-10-27T11:59:00.000Z',
      hostname: 'openbyte.example',
      action: 'public_form',
    }), { status: 200, headers: { 'content-type': 'application/json' } }))

    const result = await verifyTurnstileToken({
      token: 'browser-token',
      secret: 'server-secret',
      expectedHostname: 'openbyte.example',
      expectedAction: 'public_form',
      now: new Date('2026-10-27T12:00:00.000Z'),
      fetcher,
    })

    expect(result).toBe(true)
    expect(fetcher).toHaveBeenCalledTimes(1)
    const [url, init] = fetcher.mock.calls[0]
    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify')
    expect(init?.method).toBe('POST')
    expect(String(init?.body)).toContain('response=browser-token')
    expect(String(init?.body)).toContain('secret=server-secret')
  })

  it('fails closed when credentials are missing, when Cloudflare rejects replay, or on network errors', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
      success: false,
      'error-codes': ['timeout-or-duplicate'],
    }), { status: 200, headers: { 'content-type': 'application/json' } }))
    const required = {
      expectedHostname: 'openbyte.example',
      expectedAction: 'public_form',
      fetcher,
    }

    await expect(verifyTurnstileToken({ ...required, token: 'token', secret: '' })).resolves.toBe(false)
    await expect(verifyTurnstileToken({ ...required, token: '', secret: 'secret' })).resolves.toBe(false)
    await expect(verifyTurnstileToken({ ...required, token: 'replayed', secret: 'secret' })).resolves.toBe(false)

    const rejectedFetch = vi.fn<typeof fetch>().mockRejectedValue(new Error('network failure'))
    await expect(verifyTurnstileToken({
      ...required,
      token: 'token',
      secret: 'secret',
      fetcher: rejectedFetch,
    })).resolves.toBe(false)
  })
})
