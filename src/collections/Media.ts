import type { CollectionConfig } from 'payload'
import { contentTotpWrapperBypass, isAdmin } from '@/access/roles'
import { auditCollectionChange, auditCollectionDelete } from '@/hooks/audit-collection-change'
import { revalidateCollectionTag } from '@/hooks/revalidate-content'

// Media dipakai lintas halaman, jadi perubahan alt/URL harus menyegarkan tag
// `content` yang dipakai semua pembacaan publik (F3-04).
const revalidation = revalidateCollectionTag('content')

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media', plural: 'Media' },
  custom: contentTotpWrapperBypass,
  admin: {
    group: 'Konten Website',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [auditCollectionChange('media'), revalidation.afterChange],
    afterDelete: [auditCollectionDelete('media'), revalidation.afterDelete],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    imageSizes: [
      {
        name: 'thumb',
        width: 320,
        height: 240,
        position: 'centre',
        formatOptions: { format: 'webp' },
      },
      {
        name: 'card',
        width: 720,
        height: 520,
        position: 'centre',
        formatOptions: { format: 'webp' },
      },
      {
        name: 'hero',
        width: 1600,
        height: 1000,
        position: 'centre',
        formatOptions: { format: 'webp' },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'webp' },
      },
    ],
  },
}
