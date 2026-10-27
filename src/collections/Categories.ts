import type { CollectionConfig } from 'payload'
import { activeContentAccess, contentTotpWrapperBypass } from '@/access/roles'
import { createSlug } from '@/hooks/create-slug'
import { protectCategoryDelete } from '@/hooks/protect-category-delete'
import { auditCollectionChange } from '@/hooks/audit-collection-change'
import { revalidateCollectionTag } from '@/hooks/revalidate-content'

const revalidation = revalidateCollectionTag('categories')

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Kategori', plural: 'Kategori' },
  admin: {
    useAsTitle: 'name',
    group: 'Konten Website',
    defaultColumns: ['name', 'slug', 'isActive', 'showInFilter'],
  },
  access: activeContentAccess,
  custom: contentTotpWrapperBypass,
  hooks: {
    beforeValidate: [createSlug('name')],
    beforeDelete: [protectCategoryDelete],
    afterChange: [auditCollectionChange('categories'), revalidation.afterChange],
    afterDelete: [revalidation.afterDelete],
  },
  orderable: true,
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'icon', type: 'text' },
    { name: 'showInFilter', type: 'checkbox', defaultValue: true },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
