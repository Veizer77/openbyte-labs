import { describe, expect, it } from 'vitest'
import { isStaffBoolean, isOwnerField } from '../../src/access/roles'
import { Users, validatePasswordStrength } from '../../src/collections/Users'
import { Inquiries } from '../../src/collections/Inquiries'
import { ConsultationBookings } from '../../src/collections/ConsultationBookings'
import { SiteSettings } from '../../src/globals/SiteSettings'

function mockReq(roles?: string[], strategy = 'totp') {
  return {
    req: {
      user: roles ? { roles, _strategy: strategy } : null,
    },
  } as never
}

describe('F2-01: Admin roles, editor restrictions, and password strength', () => {
  describe('isStaffBoolean (access.admin)', () => {
    it('allows owner to access admin UI', () => {
      expect(isStaffBoolean(mockReq(['owner']))).toBe(true)
    })

    it('allows editor to access admin UI', () => {
      expect(isStaffBoolean(mockReq(['editor']))).toBe(true)
    })

    it('denies anonymous visitors', () => {
      expect(isStaffBoolean(mockReq())).toBe(false)
    })

    it('denies non-staff roles', () => {
      expect(isStaffBoolean(mockReq(['client']))).toBe(false)
    })
  })

  describe('Users collection access & visibility', () => {
    it('allows editor to login to admin panel via access.admin', () => {
      const adminAccess = Users.access?.admin as ((args: { req: unknown }) => boolean)
      expect(adminAccess(mockReq(['editor']))).toBe(true)
    })

    it('denies editor from CRUD on Users collection even with TOTP', () => {
      const editorReq = mockReq(['editor'], 'totp')
      expect(Users.access?.read?.(editorReq)).toBe(false)
      expect(Users.access?.create?.(editorReq)).toBe(false)
      expect(Users.access?.update?.(editorReq)).toBe(false)
      expect(Users.access?.delete?.(editorReq)).toBe(false)
    })

    it('allows owner with TOTP full CRUD on Users collection', () => {
      const ownerReq = mockReq(['owner'], 'totp')
      expect(Users.access?.read?.(ownerReq)).toBe(true)
      expect(Users.access?.create?.(ownerReq)).toBe(true)
      expect(Users.access?.update?.(ownerReq)).toBe(true)
      expect(Users.access?.delete?.(ownerReq)).toBe(true)
    })

    it('hides Users collection from editor sidebar', () => {
      const hiddenFn = Users.admin?.hidden as ((args: { user: unknown }) => boolean)
      expect(hiddenFn({ user: { roles: ['editor'] } })).toBe(true)
      expect(hiddenFn({ user: { roles: ['owner'] } })).toBe(false)
    })
  })

  describe('Password strength validation', () => {
    it('rejects short passwords', () => {
      expect(() =>
        validatePasswordStrength({
          data: { password: 'Short1!' },
          operation: 'create',
          req: {},
        } as never),
      ).toThrow(/Kata sandi minimal 16 karakter/)
    })

    it('rejects password without symbol', () => {
      expect(() =>
        validatePasswordStrength({
          data: { password: 'NoSymbolPassword12345' },
          operation: 'create',
          req: {},
        } as never),
      ).toThrow(/Kata sandi minimal 16 karakter/)
    })

    it('rejects password without number', () => {
      expect(() =>
        validatePasswordStrength({
          data: { password: 'NoNumberPasswordHere!' },
          operation: 'create',
          req: {},
        } as never),
      ).toThrow(/Kata sandi minimal 16 karakter/)
    })

    it('accepts strong password meeting all criteria', () => {
      const result = validatePasswordStrength({
        data: { password: 'VeryStrongPassword123!' },
        operation: 'create',
        req: {},
      } as never)
      expect(result).toEqual({ password: 'VeryStrongPassword123!' })
    })

    it('skips validation when password is not being updated', () => {
      const result = validatePasswordStrength({
        data: { name: 'Editor Name' },
        operation: 'update',
        req: {},
      } as never)
      expect(result).toEqual({ name: 'Editor Name' })
    })
  })

  describe('SiteSettings editor permissions', () => {
    it('is placed in Konten Website group for editor visibility (D-04)', () => {
      expect(SiteSettings.admin?.group).toBe('Konten Website')
    })

    it('denies editor access to WhatsApp and Tracking tabs via isOwnerField (D-03)', () => {
      const editorReq = mockReq(['editor'], 'totp')
      expect(isOwnerField(editorReq)).toBe(false)

      const ownerReq = mockReq(['owner'], 'totp')
      expect(isOwnerField(ownerReq)).toBe(true)
    })
  })

  describe('Operational collections editor protection', () => {
    it('denies editor access to inquiries and bookings', () => {
      const editorReq = mockReq(['editor'], 'totp')
      expect(Inquiries.access?.read?.(editorReq)).toBe(false)
      expect(ConsultationBookings.access?.read?.(editorReq)).toBe(false)
    })

    it('hides operational collections from editor in admin UI', () => {
      const inquiriesHidden = Inquiries.admin?.hidden as ((args: { user: unknown }) => boolean)
      expect(inquiriesHidden({ user: { roles: ['editor'] } })).toBe(true)
      expect(inquiriesHidden({ user: { roles: ['owner'] } })).toBe(false)

      const bookingsHidden = ConsultationBookings.admin?.hidden as ((args: { user: unknown }) => boolean)
      expect(bookingsHidden({ user: { roles: ['editor'] } })).toBe(true)
      expect(bookingsHidden({ user: { roles: ['owner'] } })).toBe(false)
    })
  })
})
