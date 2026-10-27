import type { CollectionConfig } from 'payload'
import { activeContentAccess, contentTotpWrapperBypass } from '@/access/roles'
import { createSlug } from '@/hooks/create-slug'
import { auditCollectionChange } from '@/hooks/audit-collection-change'
import { revalidateCollectionTag } from '@/hooks/revalidate-content'

const revalidation = revalidateCollectionTag('packages')

const nonNegativeInteger = (value: unknown) =>
  value == null ||
  (typeof value === 'number' && Number.isInteger(value) && value >= 0) ||
  'Masukkan bilangan bulat Rupiah yang tidak negatif.'

export const ServicePackages: CollectionConfig = {
  slug: 'service-packages',
  labels: { singular: 'Paket Layanan', plural: 'Paket Layanan' },
  admin: {
    useAsTitle: 'name',
    group: 'Konten Website',
    defaultColumns: ['name', 'price', 'isActive', 'isPopular'],
  },
  access: activeContentAccess,
  custom: contentTotpWrapperBypass,
  orderable: true,
  trash: true,
  hooks: {
    beforeValidate: [createSlug('name')],
    afterChange: [auditCollectionChange('service-packages'), revalidation.afterChange],
    afterDelete: [revalidation.afterDelete],
  },
  fields: [
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'targetMarket', type: 'text' },
    { name: 'price', type: 'number', required: true, min: 0, validate: nonNegativeInteger },
    { name: 'discountPrice', type: 'number', min: 0, validate: nonNegativeInteger },
    { name: 'discountEndsAt', type: 'date' },
    {
      name: 'billingType',
      type: 'select',
      required: true,
      defaultValue: 'one_time',
      options: ['one_time', 'subscription_yearly', 'custom'],
    },
    { name: 'estimatedDays', type: 'number', min: 0, validate: nonNegativeInteger },
    { name: 'features', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    {
      name: 'includedRevisions',
      type: 'number',
      defaultValue: 2,
      min: 0,
      validate: nonNegativeInteger,
    },
    { name: 'extraRevisionPrice', type: 'number', min: 0, validate: nonNegativeInteger },
    { name: 'revisionPolicy', type: 'richText' },
    { name: 'ctaLabel', type: 'text' },
    { name: 'isPopular', type: 'checkbox', defaultValue: false },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
