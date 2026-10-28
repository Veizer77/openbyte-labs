import { describe, expect, it, vi } from 'vitest'
import { checkHealth } from '../../src/services/health'

describe('database health', () => {
  it('returns success only after the database probe succeeds', async () => {
    const probe = vi.fn().mockResolvedValue(undefined)
    const response = await checkHealth(probe)
    expect(probe).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(await response.json()).toEqual({ status: 'ok', database: 'up' })
  })
  it('reports an unavailable database without leaking errors', async () => {
    const response = await checkHealth(async () => { throw new Error('private connection detail') })
    expect(response.status).toBe(503)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(await response.json()).toEqual({ status: 'unavailable', database: 'down' })
  })
})
