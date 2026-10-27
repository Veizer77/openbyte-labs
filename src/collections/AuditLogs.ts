import type { CollectionConfig } from 'payload'
import { isOwner } from '@/access/roles'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  labels: { singular: 'Log Aktivitas', plural: 'Log Aktivitas' },
  admin: {
    useAsTitle: 'action',
    group: 'Sistem',
    defaultColumns: ['actorType', 'action', 'collection', 'createdAt'],
  },
  access: { read: isOwner, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'actor', type: 'relationship', relationTo: 'users' },
    { name: 'actorType', type: 'select', required: true, options: ['admin', 'client', 'system'] },
    { name: 'action', type: 'text', required: true },
    { name: 'collection', type: 'text', required: true },
    { name: 'docId', type: 'text' },
    { name: 'summary', type: 'text', required: true },
    { name: 'diff', type: 'json' },
    {
      name: 'ipHash',
      type: 'text',
      access: { read: () => false, create: () => false, update: () => false },
    },
  ],
}
