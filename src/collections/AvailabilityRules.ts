import type { CollectionConfig } from 'payload'
import { closedAccess } from '@/access/roles'
import { preventAvailabilityOverlap } from '@/hooks/prevent-availability-overlap'

const isClock = (value: unknown): value is string =>
  typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

export const AvailabilityRules: CollectionConfig = {
  slug: 'availability-rules',
  labels: { singular: 'Aturan Ketersediaan', plural: 'Aturan Ketersediaan' },
  admin: {
    useAsTitle: 'startTime',
    group: 'Operasional Klien',
    defaultColumns: ['weekday', 'startTime', 'endTime', 'isActive'],
  },
  access: closedAccess,
  hooks: { beforeChange: [preventAvailabilityOverlap] },
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
