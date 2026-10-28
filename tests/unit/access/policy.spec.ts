import { describe, it, expect } from 'vitest'
import { canAccess, assertAccess } from '../../../src/access/policy'
import { sanitizeUserDTO, sanitizeSubmissionDTO } from '../../../src/access/dto'
import type { Actor } from '../../../src/access/types'

describe('Access Policy & Default-Deny (F0-09)', () => {
  const anonymous: Actor = { type: 'anonymous' }
  const passwordOnly: Actor = { type: 'password_only', userId: 'usr-1', email: 'test@example.com' }
  const editor: Actor = { type: 'authenticated', userId: 'usr-2', email: 'editor@example.com', role: 'editor' }
  const owner: Actor = { type: 'authenticated', userId: 'usr-3', email: 'owner@example.com', role: 'owner' }

  describe('Tracking Portal (Rilis 1)', () => {
    it('selalu menolak akses tracking untuk semua aktor', () => {
      expect(canAccess(anonymous, 'tracking_portal', 'read')).toBe(false)
      expect(canAccess(passwordOnly, 'tracking_portal', 'read')).toBe(false)
      expect(canAccess(editor, 'tracking_portal', 'read')).toBe(false)
      expect(canAccess(owner, 'tracking_portal', 'read')).toBe(false)
    })
  })

  describe('Anonymous & Password-Only Restrictions', () => {
    it('menolak anonymous dan password-only dari admin portal', () => {
      expect(canAccess(anonymous, 'admin_portal', 'read')).toBe(false)
      expect(canAccess(passwordOnly, 'admin_portal', 'read')).toBe(false)
    })

    it('menolak anonymous dan password-only dari mutasi konten', () => {
      expect(canAccess(anonymous, 'website_content', 'create')).toBe(false)
      expect(canAccess(passwordOnly, 'website_content', 'update')).toBe(false)
    })

    it('mengizinkan anonymous membaca public content dan submit form', () => {
      expect(canAccess(anonymous, 'public_content', 'read')).toBe(true)
      expect(canAccess(anonymous, 'public_submission', 'create')).toBe(true)
      expect(canAccess(anonymous, 'public_submission', 'read')).toBe(false)
    })
  })

  describe('Editor vs Owner RBAC Boundary', () => {
    it('mengizinkan editor mengelola konten website (kecuali delete)', () => {
      expect(canAccess(editor, 'website_content', 'read')).toBe(true)
      expect(canAccess(editor, 'website_content', 'create')).toBe(true)
      expect(canAccess(editor, 'website_content', 'update')).toBe(true)
      expect(canAccess(editor, 'website_content', 'publish')).toBe(true)
      expect(canAccess(editor, 'website_content', 'delete')).toBe(false)
    })

    it('mengizinkan owner melakukan hard delete konten', () => {
      expect(canAccess(owner, 'website_content', 'delete')).toBe(true)
    })

    it('menolak editor dari data operasional (inquiry, booking, quote)', () => {
      expect(canAccess(editor, 'operational_data', 'read')).toBe(false)
      expect(canAccess(editor, 'operational_data', 'update')).toBe(false)
      expect(canAccess(owner, 'operational_data', 'read')).toBe(true)
    })

    it('menolak editor dari pengaturan sistem dan audit log', () => {
      expect(canAccess(editor, 'system_settings', 'read')).toBe(false)
      expect(canAccess(editor, 'system_settings', 'update')).toBe(false)
      expect(canAccess(editor, 'audit_logs', 'read')).toBe(false)

      expect(canAccess(owner, 'system_settings', 'read')).toBe(true)
      expect(canAccess(owner, 'system_settings', 'update')).toBe(true)
      expect(canAccess(owner, 'audit_logs', 'read')).toBe(true)
    })
  })

  describe('assertAccess Guard', () => {
    it('melempar error jika otorisasi tidak terpenuhi', () => {
      expect(() => assertAccess(editor, 'operational_data', 'read')).toThrow(/Akses ditolak/)
    })

    it('tidak melempar error jika otorisasi sah', () => {
      expect(() => assertAccess(owner, 'operational_data', 'read')).not.toThrow()
    })
  })

  describe('DTO Field-Level Sanitization', () => {
    it('menghapus field rahasia pada user DTO', () => {
      const sanitized = sanitizeUserDTO({
        id: 'u-1',
        name: 'Admin',
        email: 'admin@openbyte.id',
        role: 'owner',
        createdAt: new Date(),
        authUserId: 'secret-auth-id',
        password: 'hash-password-123',
        secret: 'totp-secret-abc',
      })

      expect(sanitized).toEqual({
        id: 'u-1',
        name: 'Admin',
        email: 'admin@openbyte.id',
        role: 'owner',
        createdAt: expect.any(Date),
      })
      expect((sanitized as unknown as Record<string, unknown>).password).toBeUndefined()
      expect((sanitized as unknown as Record<string, unknown>).secret).toBeUndefined()
      expect((sanitized as unknown as Record<string, unknown>).authUserId).toBeUndefined()
    })

    it('menghapus IP client dan catatan internal dari submission publik', () => {
      const sanitized = sanitizeSubmissionDTO({
        id: 'sub-1',
        referenceNumber: 'OBL-202610-001',
        status: 'pending',
        createdAt: new Date(),
        internalNotes: 'Catatan internal staf',
        clientIp: '192.168.1.1',
      })

      expect(sanitized).toEqual({
        id: 'sub-1',
        referenceNumber: 'OBL-202610-001',
        status: 'pending',
        createdAt: expect.any(Date),
      })
      expect((sanitized as unknown as Record<string, unknown>).internalNotes).toBeUndefined()
      expect((sanitized as unknown as Record<string, unknown>).clientIp).toBeUndefined()
    })
  })
})
