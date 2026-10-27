import type { Access, FieldAccess, Where } from 'payload'

type UserWithRoles = { roles?: string[]; _strategy?: string } | Record<string, unknown> | null | undefined

export function hasRole(user: unknown, role: 'owner' | 'editor'): boolean {
  if (!user || typeof user !== 'object') return false
  const roles = (user as { roles?: unknown }).roles
  return Array.isArray(roles) && roles.includes(role)
}

/**
 * D-05 (keputusan pemilik 27 Oktober 2026): 2FA wajib untuk SEMUA user admin
 * (owner dan editor). Hanya sesi yang sudah lolos verifikasi TOTP
 * (`_strategy === 'totp'`, strategi plugin payload-totp) boleh mengoperasikan
 * koleksi admin — termasuk koleksi konten yang membypass wrapper TOTP plugin
 * (`contentTotpWrapperBypass`), karena di sana wrapper tidak lagi menahan
 * sesi password-only.
 */
function isAdminUser(user: UserWithRoles): boolean {
  return Boolean(user?._strategy === 'totp' && (hasRole(user, 'owner') || hasRole(user, 'editor')))
}

export const isOwner: Access = ({ req }) => {
  const user = req.user as UserWithRoles
  return hasRole(user, 'owner') && user?._strategy === 'totp'
}
export const isOwnerBoolean = ({ req }: { req: { user?: unknown } }): boolean =>
  hasRole(req.user as UserWithRoles, 'owner')
export const isStaffBoolean = ({ req }: { req: { user?: unknown } }): boolean => {
  const user = req.user as UserWithRoles
  return hasRole(user, 'owner') || hasRole(user, 'editor')
}
export const isEditor: Access = ({ req }) => hasRole(req.user as UserWithRoles, 'editor')
export const isAdmin: Access = ({ req }) => {
  return isAdminUser(req.user as UserWithRoles)
}

export const isOwnerField: FieldAccess = ({ req }) => {
  const user = req.user as UserWithRoles
  return hasRole(user, 'owner') && user?._strategy === 'totp'
}

/**
 * Sesi admin yang sudah lolos 2FA. Dipakai juga oleh rute pratinjau draft
 * (F2-04) agar cookie Draft Mode tidak bisa dipakai sesi password-only.
 */
export function hasAdminSession(user: unknown): boolean {
  return isAdminUser(user as UserWithRoles)
}

export const contentTotpWrapperBypass = {
  totp: {
    disableAccessWrapper: {
      read: true,
      create: true,
      update: true,
      delete: true,
    },
  },
}

export const adminOnly: Access = ({ req }) => Boolean(req.user)

export const publicOrAdmin: Access = ({ req }) => {
  if (isAdminUser(req.user as UserWithRoles)) return true
  return { _status: { equals: 'published' } }
}

export const activePublicOrAdmin: Access = ({ req }) => {
  if (isAdminUser(req.user as UserWithRoles)) return true
  return { isActive: { equals: true } }
}

export const publishedProjectsOrAdmin: Access = ({ req }) => {
  if (isAdminUser(req.user as UserWithRoles)) return true
  const where: Where = {
    and: [
      { _status: { equals: 'published' } },
      { publishedAt: { less_than_equal: new Date().toISOString() } },
    ],
  }
  return where
}

export const closedAccess = {
  read: isOwner,
  create: isOwner,
  update: isOwner,
  delete: isOwner,
}

export const ownerEditorAccess = {
  read: isAdmin,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}

export const publicContentAccess = {
  read: publicOrAdmin,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}

export const activeContentAccess = {
  read: activePublicOrAdmin,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}
