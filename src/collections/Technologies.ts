import type { CollectionConfig } from 'payload'
import { contentTotpWrapperBypass, isAdmin } from '@/access/roles'
import { createSlug } from '@/hooks/create-slug'
import { auditCollectionChange } from '@/hooks/audit-collection-change'
import { revalidateCollectionTag } from '@/hooks/revalidate-content'

const revalidation = revalidateCollectionTag('projects')

export const Technologies: CollectionConfig = {
  slug: 'technologies',
  labels: { singular: 'Teknologi', plural: 'Teknologi' },
  admin: { useAsTitle: 'name', group: 'Konten Website' },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  custom: contentTotpWrapperBypass,
  hooks: {
    beforeValidate: [createSlug('name')],
    afterChange: [auditCollectionChange('technologies'), revalidation.afterChange],
    afterDelete: [revalidation.afterDelete],
  },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'icon', type: 'text' },
    {
      name: 'color',
      type: 'text',
      validate: (value: unknown) =>
        value == null ||
        value === '' ||
        (typeof value === 'string' && /^#[\da-fA-F]{6}$/.test(value)) ||
        'Gunakan format warna #RRGGBB.',
    },
  ],
}
