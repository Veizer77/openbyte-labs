import type { CollectionConfig } from 'payload'
import { activeContentAccess, contentTotpWrapperBypass } from '@/access/roles'
import { auditCollectionChange, auditCollectionDelete } from '@/hooks/audit-collection-change'
import { revalidateCollectionTag } from '@/hooks/revalidate-content'

const revalidation = revalidateCollectionTag('faqs')

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'Pertanyaan Umum', plural: 'Pertanyaan Umum' },
  admin: { useAsTitle: 'question', group: 'Konten Website' },
  access: activeContentAccess,
  custom: contentTotpWrapperBypass,
  orderable: true,
  hooks: {
    afterChange: [auditCollectionChange('faqs'), revalidation.afterChange],
    afterDelete: [auditCollectionDelete('faqs'), revalidation.afterDelete],
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
