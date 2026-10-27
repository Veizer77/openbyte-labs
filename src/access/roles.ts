import type { Access, FieldAccess, Where } from 'payload'

type UserWithRoles = { roles?: string[]; _strategy?: string } | null | undefined

export function hasRole(user: UserWithRoles, role: 'owner' | 'editor'): boolean {
  return Boolean(user?.roles?.includes(role))
}

function isAdminUser(user: UserWithRoles): boolean {
  return (hasRole(user, 'owner') && user?._strategy === 'totp') || hasRole(user, 'editor')
}

export const isOwner: Access = ({ req }) => hasRole(req.user as UserWithRoles, 'owner')
export const isOwnerBoolean = ({ req }: { req: { user?: unknown } }): boolean =>
  hasRole(req.user as UserWithRoles, 'owner')
export const isEditor: Access = ({ req }) => hasRole(req.user as UserWithRoles, 'editor')
export const isAdmin: Access = ({ req }) => {
  return isAdminUser(req.user as UserWithRoles)
}

export const isOwnerField: FieldAccess = ({ req }) => {
  const user = req.user as UserWithRoles
  return hasRole(user, 'owner') && user?._strategy === 'totp'
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
