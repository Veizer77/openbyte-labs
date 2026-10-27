import type { CollectionConfig } from 'payload'
import { closedAccess, hasRole } from '@/access/roles'
import { auditCollectionChange, auditCollectionDelete } from '@/hooks/audit-collection-change'

const isDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
const isClock = (value: unknown): value is string =>
  typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

export const BlockedDates: CollectionConfig = {
  slug: 'blocked-dates',
  labels: { singular: 'Tanggal Ditutup', plural: 'Tanggal Ditutup' },
  admin: {
    useAsTitle: 'date',
    group: 'Operasional Klien',
    hidden: ({ user }) => !hasRole(user, 'owner'),
    defaultColumns: ['date', 'startTime', 'endTime', 'reason'],
  },
  access: closedAccess,
  hooks: {
    afterChange: [auditCollectionChange('blocked-dates')],
    afterDelete: [auditCollectionDelete('blocked-dates')],
  },
  fields: [
    {
      name: 'date',
      type: 'text',
      required: true,
      index: true,
      validate: (value: unknown) => isDate(value) || 'Gunakan format tanggal YYYY-MM-DD.',
    },
    {
      name: 'startTime',
      type: 'text',
      validate: (value: unknown) =>
        value == null || value === '' || isClock(value) || 'Gunakan format jam HH:mm.',
    },
    {
      name: 'endTime',
      type: 'text',
      validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) => {
        if (value == null || value === '') return true
        if (!isClock(value)) return 'Gunakan format jam HH:mm.'
        if (!isClock(siblingData?.startTime))
          return 'Isi jam mulai atau kosongkan kedua jam untuk menutup satu hari penuh.'
        return value > siblingData.startTime || 'Jam selesai harus setelah jam mulai.'
      },
    },
    { name: 'reason', type: 'text' },
  ],
}
