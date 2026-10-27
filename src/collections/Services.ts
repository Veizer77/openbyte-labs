import type { CollectionConfig } from 'payload'
import { activeContentAccess, contentTotpWrapperBypass } from '@/access/roles'
import { auditCollectionChange } from '@/hooks/audit-collection-change'
import { revalidateCollectionTag } from '@/hooks/revalidate-content'

const revalidation = revalidateCollectionTag('services')

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Layanan', plural: 'Layanan' },
  admin: {
    useAsTitle: 'title',
    group: 'Konten Website',
    defaultColumns: ['title', 'size', 'isActive', 'sortOrder'],
  },
  access: activeContentAccess,
  custom: contentTotpWrapperBypass,
  orderable: true,
  hooks: {
    afterChange: [auditCollectionChange('services'), revalidation.afterChange],
    afterDelete: [revalidation.afterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'highlights', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    {
      name: 'icon',
      type: 'text',
      required: true,
      validate: (value: unknown) =>
        value == null ||
        ['database', 'smartphone', 'globe', 'mail'].includes(String(value)) ||
        'Pilih ikon yang tersedia.',
    },
    {
      name: 'size',
      type: 'select',
      required: true,
      defaultValue: 'normal',
      options: ['normal', 'wide', 'tall'],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
