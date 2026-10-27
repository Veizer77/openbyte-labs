import type { Access, FieldAccess } from 'payload'
import { describe, expect, it } from 'vitest'

import { isAdmin, isOwner, isOwnerBoolean, isOwnerField } from '../../src/access/roles'

/**
 * Simulasi argumen akses Payload untuk sesi tertentu — murni, tanpa database.
 * D-05 (keputusan pemilik 27 Oktober 2026): 2FA wajib untuk SEMUA user admin
 * (owner dan editor); sesi password (`_strategy: 'local-jwt'`) tidak dihitung
 * verifikasi 2FA.
 */
function accessArgs(user: Record<string, unknown> | null): Parameters<Access>[0] {
  return { req: { user }, user } as unknown as Parameters<Access>[0]
}

function fieldAccessArgs(user: Record<string, unknown> | null): Parameters<FieldAccess>[0] {
  return { req: { user }, user } as unknown as Parameters<FieldAccess>[0]
}

describe('isAdmin (D-05: 2FA wajib semua user admin)', () => {
  it('owner dengan sesi TOTP boleh mengoperasikan admin', () => {
    expect(isAdmin(accessArgs({ roles: ['owner'], _strategy: 'totp' }))).toBe(true)
  })

  it('editor dengan sesi TOTP boleh mengoperasikan admin', () => {
    expect(isAdmin(accessArgs({ roles: ['editor'], _strategy: 'totp' }))).toBe(true)
  })

  it('owner dengan sesi password (local-jwt) ditolak', () => {
    expect(isAdmin(accessArgs({ roles: ['owner'], _strategy: 'local-jwt' }))).toBe(false)
  })

  it('editor dengan sesi password (local-jwt) ditolak', () => {
    expect(isAdmin(accessArgs({ roles: ['editor'], _strategy: 'local-jwt' }))).toBe(false)
  })

  it('editor tanpa strategi TOTP ditolak', () => {
    expect(isAdmin(accessArgs({ roles: ['editor'] }))).toBe(false)
  })

  it('sesi api-key tidak dihitung verifikasi 2FA', () => {
    expect(isAdmin(accessArgs({ roles: ['owner'], _strategy: 'api-key' }))).toBe(false)
  })

  it('tanpa user ditolak', () => {
    expect(isAdmin(accessArgs(null))).toBe(false)
  })

  it('user tanpa role admin ditolak meski sesi TOTP', () => {
    expect(isAdmin(accessArgs({ roles: [], _strategy: 'totp' }))).toBe(false)
  })
})

describe('isOwner (D-05: sesi owner juga wajib TOTP)', () => {
  it('owner dengan sesi TOTP boleh', () => {
    expect(isOwner(accessArgs({ roles: ['owner'], _strategy: 'totp' }))).toBe(true)
  })

  it('owner dengan sesi password (local-jwt) ditolak', () => {
    expect(isOwner(accessArgs({ roles: ['owner'], _strategy: 'local-jwt' }))).toBe(false)
  })

  it('editor dengan sesi TOTP tetap bukan owner', () => {
    expect(isOwner(accessArgs({ roles: ['editor'], _strategy: 'totp' }))).toBe(false)
  })

  it('tanpa user ditolak', () => {
    expect(isOwner(accessArgs(null))).toBe(false)
  })
})

describe('isOwnerField (field access owner wajib TOTP)', () => {
  it('owner dengan sesi TOTP boleh', () => {
    expect(isOwnerField(fieldAccessArgs({ roles: ['owner'], _strategy: 'totp' }))).toBe(true)
  })

  it('owner dengan sesi password (local-jwt) ditolak', () => {
    expect(isOwnerField(fieldAccessArgs({ roles: ['owner'], _strategy: 'local-jwt' }))).toBe(false)
  })

  it('editor dengan sesi TOTP ditolak', () => {
    expect(isOwnerField(fieldAccessArgs({ roles: ['editor'], _strategy: 'totp' }))).toBe(false)
  })
})

describe('isOwnerBoolean (penanda panel admin koleksi users)', () => {
  it('owner dengan sesi TOTP dianggap pemilik panel', () => {
    expect(isOwnerBoolean({ req: { user: { roles: ['owner'], _strategy: 'totp' } } })).toBe(true)
  })

  it('editor dengan sesi TOTP bukan pemilik panel', () => {
    expect(isOwnerBoolean({ req: { user: { roles: ['editor'], _strategy: 'totp' } } })).toBe(false)
  })
})
