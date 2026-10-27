import type { CollectionConfig } from 'payload'
import { contentTotpWrapperBypass, isAdmin, publishedProjectsOrAdmin } from '@/access/roles'
import { projectContentBlocks } from '@/blocks/page-blocks'
import { createSlug } from '@/hooks/create-slug'
import { auditCollectionChange, auditCollectionDelete } from '@/hooks/audit-collection-change'
import { revalidateCollectionTag } from '@/hooks/revalidate-content'

const revalidation = revalidateCollectionTag('projects')

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Proyek Showcase', plural: 'Proyek Showcase' },
  admin: {
    useAsTitle: 'title',
    group: 'Konten Website',
    defaultColumns: ['title', 'slug', 'publishedAt', '_status', 'isFeatured'],
    preview: (doc) => {
      if (!doc?.slug) return ''
      return `/api/draft?collection=projects&slug=${doc.slug}`
    },
  },
  access: {
    read: publishedProjectsOrAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  custom: contentTotpWrapperBypass,
  orderable: true,
  versions: { drafts: true },
  trash: true,
  hooks: {
    beforeValidate: [createSlug('title')],
    afterChange: [auditCollectionChange('projects'), revalidation.afterChange],
    afterDelete: [auditCollectionDelete('projects'), revalidation.afterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'tagline', type: 'text' },
    { name: 'clientName', type: 'text' },
    {
      name: 'year',
      type: 'number',
      min: 2000,
      max: 2100,
      validate: (value: unknown) =>
        value == null ||
        (typeof value === 'number' && Number.isInteger(value)) ||
        'Tahun harus berupa bilangan bulat.',
    },
    { name: 'publishedAt', type: 'date', index: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text', required: true },
      ],
    },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'contentBlocks', type: 'blocks', blocks: projectContentBlocks },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: ['demo', 'github', 'playstore', 'appstore', 'video', 'lainnya'],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          validate: (value: unknown) => {
            if (!value) return true
            if (typeof value !== 'string') return 'Masukkan URL HTTPS yang valid.'
            try {
              return (
                new URL(value).protocol === 'https:' || 'Tautan proyek harus menggunakan HTTPS.'
              )
            } catch {
              return 'Masukkan URL HTTPS yang valid.'
            }
          },
        },
      ],
    },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
    },
    { name: 'technologies', type: 'relationship', relationTo: 'technologies', hasMany: true },
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
