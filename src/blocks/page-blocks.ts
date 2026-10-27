import type { Block } from 'payload'

const visibilityField = {
  name: 'isVisible',
  type: 'checkbox' as const,
  defaultValue: true,
  admin: { position: 'sidebar' as const },
}

export const pageBlocks: Block[] = [
  {
    slug: 'hero',
    labels: { singular: 'Hero', plural: 'Hero' },
    fields: [
      visibilityField,
      { name: 'headline', type: 'text', required: true },
      { name: 'subheadline', type: 'textarea' },
      { name: 'primaryCtaLabel', type: 'text' },
      { name: 'primaryCtaTarget', type: 'text' },
      { name: 'secondaryCtaLabel', type: 'text' },
      { name: 'secondaryCtaTarget', type: 'text' },
      { name: 'image', type: 'upload', relationTo: 'media' },
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
    slug: 'servicesGrid',
    labels: { singular: 'Grid Layanan', plural: 'Grid Layanan' },
    fields: [
      visibilityField,
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true },
    ],
  },
  {
    slug: 'portfolioShowcase',
    labels: { singular: 'Showcase Portofolio', plural: 'Showcase Portofolio' },
    fields: [
      visibilityField,
      { name: 'title', type: 'text' },
      { name: 'featuredOnly', type: 'checkbox', defaultValue: true },
      { name: 'limit', type: 'number', min: 1, max: 12, defaultValue: 3 },
    ],
  },
  {
    slug: 'calculator',
    labels: { singular: 'Kalkulator', plural: 'Kalkulator' },
    fields: [
      visibilityField,
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
    ],
  },
  {
    slug: 'pricing',
    labels: { singular: 'Paket Harga', plural: 'Paket Harga' },
    fields: [
      visibilityField,
      { name: 'title', type: 'text' },
      {
        name: 'servicePackages',
        type: 'relationship',
        relationTo: 'service-packages',
        hasMany: true,
      },
    ],
  },
  {
    slug: 'testimonials',
    labels: { singular: 'Testimoni', plural: 'Testimoni' },
    fields: [visibilityField, { name: 'title', type: 'text' }],
  },
  {
    slug: 'faq',
    labels: { singular: 'FAQ', plural: 'FAQ' },
    fields: [visibilityField, { name: 'title', type: 'text' }],
  },
  {
    slug: 'about',
    labels: { singular: 'Tentang', plural: 'Tentang' },
    fields: [visibilityField, { name: 'title', type: 'text' }, { name: 'body', type: 'richText' }],
  },
  {
    slug: 'ctaBanner',
    labels: { singular: 'Banner CTA', plural: 'Banner CTA' },
    fields: [
      visibilityField,
      { name: 'headline', type: 'text', required: true },
      { name: 'body', type: 'textarea' },
      { name: 'ctaLabel', type: 'text' },
      { name: 'ctaTarget', type: 'text' },
    ],
  },
  {
    slug: 'richText',
    labels: { singular: 'Teks', plural: 'Teks' },
    fields: [visibilityField, { name: 'content', type: 'richText', required: true }],
  },
]

export const projectContentBlocks: Block[] = [
  {
    slug: 'richText',
    labels: { singular: 'Teks', plural: 'Teks' },
    fields: [{ name: 'content', type: 'richText', required: true }],
  },
  {
    slug: 'image',
    labels: { singular: 'Gambar', plural: 'Gambar' },
    fields: [
      { name: 'image', type: 'upload', relationTo: 'media', required: true },
      { name: 'alt', type: 'text', required: true },
      { name: 'caption', type: 'text' },
    ],
  },
  {
    slug: 'gallery',
    labels: { singular: 'Galeri', plural: 'Galeri' },
    fields: [
      {
        name: 'images',
        type: 'array',
        minRows: 1,
        fields: [
          { name: 'image', type: 'upload', relationTo: 'media', required: true },
          { name: 'alt', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    slug: 'video',
    labels: { singular: 'Video', plural: 'Video' },
    fields: [
      {
        name: 'url',
        type: 'text',
        required: true,
        validate: (value: unknown) => {
          if (!value) return true
          if (typeof value !== 'string') return 'Masukkan URL video yang valid.'
          try {
            const url = new URL(value)
            return [
              'youtube.com',
              'www.youtube.com',
              'youtu.be',
              'vimeo.com',
              'www.vimeo.com',
            ].includes(url.hostname)
              ? true
              : 'Gunakan URL YouTube atau Vimeo.'
          } catch {
            return 'Masukkan URL video yang valid.'
          }
        },
      },
    ],
  },
  {
    slug: 'stats',
    labels: { singular: 'Data Dampak', plural: 'Data Dampak' },
    fields: [
      {
        name: 'items',
        type: 'array',
        fields: [
          { name: 'value', type: 'text' },
          { name: 'label', type: 'text' },
        ],
      },
    ],
  },
  {
    slug: 'quote',
    labels: { singular: 'Kutipan', plural: 'Kutipan' },
    fields: [
      { name: 'quote', type: 'textarea', required: true },
      { name: 'attribution', type: 'text' },
    ],
  },
  {
    slug: 'bullets',
    labels: { singular: 'Daftar Poin', plural: 'Daftar Poin' },
    fields: [
      { name: 'items', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    ],
  },
  {
    slug: 'problemSolutionImpact',
    labels: { singular: 'Masalah, Solusi, Dampak', plural: 'Masalah, Solusi, Dampak' },
    fields: [
      { name: 'problem', type: 'richText', required: true },
      { name: 'solution', type: 'richText', required: true },
      { name: 'impact', type: 'richText', required: true },
    ],
  },
]
