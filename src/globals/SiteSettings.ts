import type { GlobalConfig } from 'payload'
import { isAdmin, isOwnerField } from '@/access/roles'
import { revalidateSettings } from '@/hooks/revalidate-content'
import { validateWhatsAppTemplate } from '@/lib/whatsapp/template'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Sistem' },
  custom: { totp: { disableAccessWrapper: { read: true, update: true } } },
  access: { read: isAdmin, update: isAdmin },
  hooks: { afterChange: [revalidateSettings] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Umum',
          name: 'general',
          fields: [
            { name: 'brandName', type: 'text', required: true, defaultValue: 'OpenByte Labs' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
            { name: 'whatsappNumber', type: 'text' },
            { name: 'contactEmail', type: 'email' },
            { name: 'address', type: 'text' },
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Hero',
          name: 'hero',
          fields: [
            { name: 'headline', type: 'text' },
            { name: 'subheadline', type: 'textarea' },
            { name: 'primaryCtaLabel', type: 'text' },
            { name: 'secondaryCtaLabel', type: 'text' },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            {
              name: 'trustMetrics',
              type: 'array',
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Navigasi & Footer',
          name: 'navigation',
          fields: [
            {
              name: 'menuItems',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'target', type: 'text', required: true },
                { name: 'isActive', type: 'checkbox', defaultValue: true },
              ],
            },
            { name: 'footerText', type: 'textarea' },
          ],
        },
        {
          label: 'SEO',
          name: 'seo',
          fields: [
            { name: 'defaultTitle', type: 'text' },
            { name: 'defaultDescription', type: 'textarea' },
            { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
            { name: 'analyticsId', type: 'text' },
          ],
        },
        {
          label: 'WhatsApp',
          name: 'whatsapp',
          access: { update: isOwnerField },
          fields: [
            {
              name: 'tplCalculator',
              type: 'textarea',
              access: { update: isOwnerField },
              validate: validateWhatsAppTemplate,
            },
            {
              name: 'tplPackageOrder',
              type: 'textarea',
              access: { update: isOwnerField },
              validate: validateWhatsAppTemplate,
            },
            {
              name: 'tplBookingConfirm',
              type: 'textarea',
              access: { update: isOwnerField },
              validate: validateWhatsAppTemplate,
            },
            {
              name: 'tplTrackingLink',
              type: 'textarea',
              access: { update: isOwnerField },
              validate: validateWhatsAppTemplate,
            },
            {
              name: 'tplRevisionNotice',
              type: 'textarea',
              access: { update: isOwnerField },
              validate: validateWhatsAppTemplate,
            },
          ],
        },
        {
          label: 'Kalkulator',
          name: 'calculator',
          fields: [
            { name: 'disclaimer', type: 'textarea' },
            {
              name: 'minimumPrice',
              type: 'number',
              min: 0,
              defaultValue: 500000,
              validate: (value: unknown) =>
                value == null ||
                (typeof value === 'number' && Number.isInteger(value)) ||
                'Nilai harus berupa bilangan Rupiah bulat.',
            },
            { name: 'showRange', type: 'checkbox', defaultValue: true },
          ],
        },
        {
          label: 'Booking',
          name: 'booking',
          fields: [
            {
              name: 'slotDurationMinutes',
              type: 'number',
              required: true,
              min: 1,
              defaultValue: 60,
            },
            { name: 'bufferMinutes', type: 'number', required: true, min: 0, defaultValue: 0 },
            { name: 'minDaysAhead', type: 'number', required: true, min: 0, defaultValue: 1 },
            { name: 'maxDaysAhead', type: 'number', required: true, min: 1, defaultValue: 30 },
            {
              name: 'availableModes',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Google Meet', value: 'google_meet' },
                { label: 'Telepon WhatsApp', value: 'whatsapp_call' },
                { label: 'Tatap muka', value: 'offline' },
              ],
            },
          ],
        },
        {
          label: 'Tracking',
          name: 'tracking',
          access: { update: isOwnerField },
          fields: [
            {
              name: 'trackingEnabled',
              type: 'checkbox',
              defaultValue: false,
              access: { update: isOwnerField },
            },
            { name: 'revisionPolicy', type: 'richText', access: { update: isOwnerField } },
            {
              name: 'revisionWindowDays',
              type: 'number',
              defaultValue: 14,
              min: 0,
              access: { update: isOwnerField },
            },
            {
              name: 'bugWarrantyDays',
              type: 'number',
              defaultValue: 30,
              min: 0,
              access: { update: isOwnerField },
            },
            {
              name: 'maxLoginAttempts',
              type: 'number',
              defaultValue: 5,
              min: 1,
              access: { update: isOwnerField },
            },
            {
              name: 'lockMinutes',
              type: 'number',
              defaultValue: 15,
              min: 1,
              access: { update: isOwnerField },
            },
            {
              name: 'sessionMinutes',
              type: 'number',
              defaultValue: 120,
              min: 1,
              access: { update: isOwnerField },
            },
          ],
        },
        {
          label: 'Legal',
          name: 'legal',
          fields: [
            { name: 'privacyPolicy', type: 'richText' },
            { name: 'consentText', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
