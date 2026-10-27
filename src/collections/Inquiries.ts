import type { CollectionConfig } from 'payload'
import { closedAccess } from '@/access/roles'
import { createReference } from '@/hooks/create-reference'
import { auditCollectionChange } from '@/hooks/audit-collection-change'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry / Pemesanan', plural: 'Inquiry / Pemesanan' },
  admin: {
    useAsTitle: 'reference',
    group: 'Operasional Klien',
    defaultColumns: ['reference', 'name', 'servicePackage', 'status', 'createdAt'],
  },
  access: closedAccess,
  hooks: {
    beforeValidate: [createReference('INQ')],
    afterChange: [auditCollectionChange('inquiries')],
  },
  fields: [
    { name: 'reference', type: 'text', unique: true, index: true, admin: { readOnly: true } },
    { name: 'servicePackage', type: 'relationship', relationTo: 'service-packages' },
    { name: 'quoteRequest', type: 'relationship', relationTo: 'quote-requests' },
    { name: 'name', type: 'text', required: true },
    { name: 'whatsapp', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'organizationOrBusiness', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'source',
      type: 'select',
      required: true,
      options: ['package', 'calculator', 'contact'],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: ['new', 'contacted', 'converted', 'dropped'],
    },
    { name: 'adminNotes', type: 'textarea' },
    { name: 'consentAt', type: 'date', required: true },
  ],
}
