import type { CollectionConfig } from 'payload'
import { contentTotpWrapperBypass, publicContentAccess } from '@/access/roles'
import { pageBlocks } from '@/blocks/page-blocks'
import { createSlug } from '@/hooks/create-slug'
import { auditCollectionChange, auditCollectionDelete } from '@/hooks/audit-collection-change'
import { revalidateCollectionTag } from '@/hooks/revalidate-content'

const revalidation = revalidateCollectionTag('pages')

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Halaman', plural: 'Halaman' },
  admin: {
    useAsTitle: 'title',
    group: 'Konten Website',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    preview: (doc) => {
      if (!doc?.slug) return ''
      return `/api/draft?collection=pages&slug=${doc.slug}`
    },
  },
  access: publicContentAccess,
  custom: contentTotpWrapperBypass,
  versions: { drafts: true },
  trash: true,
  hooks: {
    beforeValidate: [createSlug('title')],
    afterChange: [auditCollectionChange('pages'), revalidation.afterChange],
    afterDelete: [auditCollectionDelete('pages'), revalidation.afterDelete],
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'layout', type: 'blocks', blocks: pageBlocks, required: true },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
