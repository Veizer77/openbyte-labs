import type { CollectionConfig } from 'payload'
import { activeContentAccess, contentTotpWrapperBypass } from '@/access/roles'
import { auditCollectionChange, auditCollectionDelete } from '@/hooks/audit-collection-change'
import { revalidateCollectionTag } from '@/hooks/revalidate-content'

const revalidation = revalidateCollectionTag('testimonials')

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimoni', plural: 'Testimoni' },
  admin: { useAsTitle: 'authorName', group: 'Konten Website' },
  access: activeContentAccess,
  custom: contentTotpWrapperBypass,
  orderable: true,
  hooks: {
    afterChange: [auditCollectionChange('testimonials'), revalidation.afterChange],
    afterDelete: [auditCollectionDelete('testimonials'), revalidation.afterDelete],
  },
  fields: [
    { name: 'authorName', type: 'text', required: true },
    { name: 'authorRole', type: 'text' },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'project', type: 'relationship', relationTo: 'projects' },
    { name: 'isActive', type: 'checkbox', defaultValue: false },
  ],
}
