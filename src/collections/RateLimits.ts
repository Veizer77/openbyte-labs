import type { CollectionConfig } from 'payload'

export const RateLimits: CollectionConfig = {
  slug: 'rate-limits',
  labels: { singular: 'Pembatasan Laju', plural: 'Pembatasan Laju' },
  admin: { hidden: true, group: 'Sistem' },
  access: { read: () => false, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true, index: true },
    { name: 'count', type: 'number', required: true, defaultValue: 0, min: 0 },
    { name: 'windowStartedAt', type: 'date', required: true },
    { name: 'lockedUntil', type: 'date' },
  ],
}
