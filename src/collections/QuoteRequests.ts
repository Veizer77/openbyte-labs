import type { CollectionConfig } from 'payload'
import { closedAccess } from '@/access/roles'
import { createReference } from '@/hooks/create-reference'
import { auditCollectionChange } from '@/hooks/audit-collection-change'

export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  labels: { singular: 'Quote Kalkulator', plural: 'Quote Kalkulator' },
  admin: {
    useAsTitle: 'reference',
    group: 'Operasional Klien',
    defaultColumns: ['reference', 'status', 'createdAt'],
  },
  access: closedAccess,
  hooks: {
    beforeValidate: [createReference('QTE')],
    afterChange: [auditCollectionChange('quote-requests')],
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true },
    },
    { name: 'selection', type: 'json', required: true },
    {
      name: 'priceMin',
      type: 'number',
      required: true,
      min: 0,
      validate: (value: unknown) =>
        value == null ||
        (typeof value === 'number' && Number.isInteger(value)) ||
        'Harga harus berupa bilangan bulat Rupiah.',
    },
    {
      name: 'priceMax',
      type: 'number',
      required: true,
      min: 0,
      validate: (value: unknown) =>
        value == null ||
        (typeof value === 'number' && Number.isInteger(value)) ||
        'Harga harus berupa bilangan bulat Rupiah.',
    },
    { name: 'daysMin', type: 'number', required: true, min: 0 },
    { name: 'daysMax', type: 'number', required: true, min: 0 },
    { name: 'contactName', type: 'text' },
    { name: 'contactWhatsapp', type: 'text' },
    {
      name: 'ipHash',
      type: 'text',
      access: { read: () => false, create: () => false, update: () => false },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: ['new', 'contacted', 'converted', 'dropped'],
    },
  ],
}
