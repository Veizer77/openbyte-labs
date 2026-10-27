import type { CollectionConfig } from 'payload'
import { contentTotpWrapperBypass, ownerEditorAccess } from '@/access/roles'
import { auditCollectionChange, auditCollectionDelete } from '@/hooks/audit-collection-change'
import { revalidateCollectionTag } from '@/hooks/revalidate-content'

const revalidation = revalidateCollectionTag('calculator')

export const CalculatorGroups: CollectionConfig = {
  slug: 'calculator-groups',
  labels: { singular: 'Grup Kalkulator', plural: 'Grup Kalkulator' },
  admin: {
    useAsTitle: 'title',
    group: 'Konten Website',
    defaultColumns: ['title', 'selectionType', 'isRequired', 'isActive'],
  },
  access: ownerEditorAccess,
  custom: contentTotpWrapperBypass,
  orderable: true,
  hooks: {
    afterChange: [auditCollectionChange('calculator-groups'), revalidation.afterChange],
    afterDelete: [auditCollectionDelete('calculator-groups'), revalidation.afterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'selectionType',
      type: 'select',
      required: true,
      defaultValue: 'single',
      options: ['single', 'multiple'],
    },
    { name: 'isRequired', type: 'checkbox', defaultValue: true },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'items', type: 'join', collection: 'calculator-items', on: 'group', orderable: true },
  ],
}
