import type { CollectionConfig } from 'payload'
import { closedAccess, hasRole } from '@/access/roles'
import { preventAvailabilityOverlap } from '@/hooks/prevent-availability-overlap'
import { auditCollectionChange, auditCollectionDelete } from '@/hooks/audit-collection-change'

const isClock = (value: unknown): value is string =>
  typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

export const AvailabilityRules: CollectionConfig = {
  slug: 'availability-rules',
  labels: { singular: 'Aturan Ketersediaan', plural: 'Aturan Ketersediaan' },
  admin: {
    useAsTitle: 'startTime',
    group: 'Operasional Klien',
    hidden: ({ user }) => !hasRole(user, 'owner'),
    defaultColumns: ['weekday', 'startTime', 'endTime', 'isActive'],
  },
  access: closedAccess,
  hooks: {
    beforeChange: [preventAvailabilityOverlap],
    afterChange: [auditCollectionChange('availability-rules')],
    afterDelete: [auditCollectionDelete('availability-rules')],
  },
  fields: [
    {
      name: 'weekday',
      type: 'number',
      required: true,
      min: 0,
      max: 6,
      validate: (value: unknown) =>
        value == null ||
        (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 6) ||
        'Pilih hari dengan angka 0 sampai 6.',
    },
    {
      name: 'startTime',
      type: 'text',
      required: true,
      validate: (value: unknown) => isClock(value) || 'Gunakan format jam HH:mm.',
    },
    {
      name: 'endTime',
      type: 'text',
      required: true,
      validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) => {
        if (!isClock(value)) return 'Gunakan format jam HH:mm.'
        if (!isClock(siblingData?.startTime)) return true
        return value > siblingData.startTime || 'Jam selesai harus setelah jam mulai.'
      },
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
