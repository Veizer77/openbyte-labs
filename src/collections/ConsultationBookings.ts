import type { CollectionConfig } from 'payload'
import { closedAccess, hasRole } from '@/access/roles'
import { createReference } from '@/hooks/create-reference'
import { auditCollectionChange, auditCollectionDelete } from '@/hooks/audit-collection-change'

export const ConsultationBookings: CollectionConfig = {
  slug: 'consultation-bookings',
  labels: { singular: 'Booking Konsultasi', plural: 'Booking Konsultasi' },
  admin: {
    useAsTitle: 'reference',
    group: 'Operasional Klien',
    hidden: ({ user }) => !hasRole(user, 'owner'),
    defaultColumns: ['reference', 'name', 'slotStart', 'status'],
  },
  access: closedAccess,
  hooks: {
    beforeValidate: [createReference('BKG')],
    afterChange: [auditCollectionChange('consultation-bookings')],
    afterDelete: [auditCollectionDelete('consultation-bookings')],
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true },
    },
    { name: 'name', type: 'text', required: true },
    { name: 'whatsapp', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'organizationOrBusiness', type: 'text' },
    { name: 'serviceInterest', type: 'text', required: true },
    { name: 'slotStart', type: 'date', required: true, index: true },
    { name: 'slotEnd', type: 'date', required: true },
    {
      name: 'consultationMode',
      type: 'select',
      required: true,
      defaultValue: 'google_meet',
      options: [
        { label: 'Google Meet', value: 'google_meet' },
        { label: 'Telepon WhatsApp', value: 'whatsapp_call' },
        { label: 'Tatap muka', value: 'offline' },
      ],
    },
    { name: 'projectBrief', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: ['pending', 'confirmed', 'completed', 'cancelled'],
    },
    {
      name: 'meetingUrl',
      type: 'text',
      validate: (value: unknown) => {
        if (!value) return true
        if (typeof value !== 'string') return 'Masukkan URL HTTPS yang valid.'
        try {
          return new URL(value).protocol === 'https:' || 'Tautan pertemuan harus menggunakan HTTPS.'
        } catch {
          return 'Masukkan URL HTTPS yang valid.'
        }
      },
    },
    { name: 'adminNotes', type: 'textarea' },
    { name: 'consentAt', type: 'date', required: true },
  ],
}
