import { describe, expect, it } from 'vitest'

import { checkDatabaseHealth } from '../../src/lib/health'

describe('checkDatabaseHealth', () => {
  it('melaporkan sehat saat kueri berhasil', async () => {
    await expect(checkDatabaseHealth(async () => 1)).resolves.toEqual({
      status: 'ok',
      database: 'up',
    })
  })

  it('melaporkan tidak sehat saat kueri gagal', async () => {
    await expect(
      checkDatabaseHealth(async () => {
        throw new Error('connection refused')
      }),
    ).resolves.toEqual({ status: 'unhealthy', database: 'down' })
  })

  it('melaporkan tidak sehat saat kueri melebihi batas waktu', async () => {
    await expect(
      checkDatabaseHealth(() => new Promise(() => undefined), { timeoutMs: 20 }),
    ).resolves.toEqual({ status: 'unhealthy', database: 'down' })
  })

  it('hasil tidak pernah memuat detail konfigurasi', async () => {
    const result = await checkDatabaseHealth(async () => {
      throw new Error('postgres://secret@host/db gagal')
    })
    expect(JSON.stringify(result)).not.toContain('postgres://')
    expect(Object.keys(result).sort()).toEqual(['database', 'status'])
  })
})
