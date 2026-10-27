import type { CollectionConfig } from 'payload'
import { activeContentAccess, contentTotpWrapperBypass } from '@/access/roles'
import { auditCollectionChange, auditCollectionDelete } from '@/hooks/audit-collection-change'
import { revalidateCollectionTag } from '@/hooks/revalidate-content'

const revalidation = revalidateCollectionTag('packages')

export const ServiceAddons: CollectionConfig = {
  slug: 'service-addons',
  labels: { singular: 'Add-on Layanan', plural: 'Add-on Layanan' },
  admin: { useAsTitle: 'name', group: 'Konten Website' },
  access: activeContentAccess,
  custom: contentTotpWrapperBypass,
  orderable: true,
  hooks: {
    afterChange: [auditCollectionChange('service-addons'), revalidation.afterChange],
    afterDelete: [auditCollectionDelete('service-addons'), revalidation.afterDelete],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      validate: (value: unknown) =>
        value == null ||
        (typeof value === 'number' && Number.isInteger(value)) ||
        'Harga harus berupa bilangan bulat Rupiah.',
    },
    {
      name: 'billingType',
      type: 'select',
      required: true,
      defaultValue: 'one_time',
      options: ['one_time', 'monthly', 'yearly'],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
