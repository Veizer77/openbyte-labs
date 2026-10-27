import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { hasRole, isOwner, isStaffBoolean } from '@/access/roles'
import { auditCollectionChange, auditCollectionDelete } from '@/hooks/audit-collection-change'

export const validatePasswordStrength: CollectionBeforeValidateHook = ({ data }) => {
  if (data?.password) {
    const password = String(data.password)
    if (
      password.length < 16 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password) ||
      !/[^A-Za-z\d]/.test(password)
    ) {
      throw new Error(
        'Kata sandi minimal 16 karakter serta harus memuat huruf kecil, huruf besar, angka, dan simbol.',
      )
    }
  }
  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Pengguna', plural: 'Pengguna' },
  admin: {
    useAsTitle: 'email',
    group: 'Sistem',
    hidden: ({ user }) => !hasRole(user, 'owner'),
  },
  access: {
    admin: isStaffBoolean,
    create: isOwner,
    read: isOwner,
    update: isOwner,
    delete: isOwner,
  },
  hooks: {
    beforeValidate: [validatePasswordStrength],
    afterChange: [auditCollectionChange('users')],
    afterDelete: [auditCollectionDelete('users')],
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 60 * 60,
    cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' },
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Owner', value: 'owner' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
}
