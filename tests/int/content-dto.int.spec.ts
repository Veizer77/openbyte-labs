import { describe, expect, it } from 'vitest'
import type { PageBlockContext } from '../../src/server/content/mappers'
import {
  toImage,
  toPackageDto,
  toPageDto,
  toProjectCard,
  toProjectDetail,
  toSettingsDto,
} from '../../src/server/content/mappers'
import type { SiteSettingsDto } from '../../src/lib/content/types'

const settings: SiteSettingsDto = {
  brandName: 'OpenByte Labs',
  logo: null,
  favicon: null,
  whatsappNumber: '0895386011371',
  contactEmail: 'halo@example.com',
  address: null,
  socialLinks: [],
  hero: {
    headline: 'Headline dari Settings',
    subheadline: 'Sub dari Settings',
    primaryCtaLabel: 'Mulai',
    secondaryCtaLabel: null,
    image: null,
    trustMetrics: [{ value: '1', label: 'Metrik Settings' }],
  },
  menu: [],
  footerText: null,
  seo: { defaultTitle: null, defaultDescription: null, ogImage: null },
  calculator: { disclaimer: 'Estimasi awal, bukan penawaran final.', minimumPrice: 500_000, showRange: true },
  legal: { consentText: null },
}

const context: PageBlockContext = {
  settings,
  services: [],
  serviceById: new Map(),
  packages: [],
  packageById: new Map(),
  projects: [],
  faqs: [],
  testimonials: [],
}

const media = {
  id: 7,
  alt: 'Tangkapan layar proyek',
  url: 'https://media.example.com/media/foto.jpg',
  width: 1600,
  height: 1000,
  sizes: {
    card: { url: 'https://media.example.com/media/foto-720x520.jpg' },
    hero: { url: 'https://media.example.com/media/foto-1600x1000.jpg' },
  },
}

describe('DTO media', () => {
  it('menolak id mentah dan media tanpa URL', () => {
    expect(toImage(7)).toBeNull()
    expect(toImage(null)).toBeNull()
    expect(toImage({ id: 1, alt: 'x' } as never)).toBeNull()
  })

  it('memetakan URL turunan WebP yang tersedia', () => {
    const image = toImage(media as never)
    expect(image).not.toBeNull()
    expect(image?.url).toBe('https://media.example.com/media/foto.jpg')
    expect(image?.sizes.card).toBe('https://media.example.com/media/foto-720x520.jpg')
    expect(image?.sizes.hero).toBe('https://media.example.com/media/foto-1600x1000.jpg')
    expect(image?.sizes.thumb).toBeUndefined()
  })
})

describe('DTO proyek', () => {
  const project = {
    slug: 'hippam-web-mobile',
    title: 'HIPPAM Web & Mobile',
    tagline: 'Pencatatan meter air',
    summary: 'Aplikasi web dan mobile untuk pembacaan meter air.',
    featuredImage: media,
    isFeatured: true,
    publishedAt: '2026-09-01T00:00:00.000Z',
    categories: [
      { id: 1, slug: 'instansi-pemdes', name: 'Instansi / Pemdes' },
      { id: 2, slug: 'aplikasi-mobile', name: 'Aplikasi Mobile' },
    ],
    technologies: [{ id: 3, name: 'Next.js 16' }],
  }

  it('memuat semua kategori agar proyek muncul di setiap tab filter', () => {
    const card = toProjectCard(project as never)
    expect(card.categories.map((category) => category.slug)).toEqual([
      'instansi-pemdes',
      'aplikasi-mobile',
    ])
    expect(card.href).toBe('/proyek/hippam-web-mobile')
    expect(card.technologies).toEqual(['Next.js 16'])
    expect(card.featuredImage?.url).toBe(media.url)
  })

  it('tidak meneruskan field internal dokumen ke DTO kartu', () => {
    const card = toProjectCard(project as never)
    expect(Object.keys(card)).not.toContain('clientName')
    expect(Object.keys(card)).not.toContain('contentBlocks')
    expect(Object.keys(card)).not.toContain('meta')
  })

  it('membuang tautan proyek yang tidak aman dan hanya menerima https', () => {
    const detail = toProjectDetail({
      ...project,
      links: [
        { label: 'Demo', url: 'https://demo.example.com' },
        { label: 'HTTP', url: 'http://demo.example.com' },
        { label: 'Skrip', url: 'javascript:alert(1)' },
        { label: 'Internal', url: '/admin' },
      ],
    } as never)

    expect(detail.links.map((link) => link.href)).toEqual(['https://demo.example.com'])
  })

  it('hanya menerima video dari host yang diizinkan', () => {
    const detail = toProjectDetail({
      ...project,
      contentBlocks: [
        { blockType: 'video', url: 'https://www.youtube.com/watch?v=abc' },
        { blockType: 'video', url: 'https://evil.example.com/video' },
      ],
    } as never)

    expect(detail.blocks).toHaveLength(1)
    expect(detail.blocks[0]).toMatchObject({ type: 'video' })
  })
})

describe('DTO Settings publik', () => {
  it('tidak pernah memuat template WhatsApp, konfigurasi tracking, atau sesi', () => {
    const doc = {
      general: {
        brandName: 'OpenByte Labs',
        whatsappNumber: '0895386011371',
        contactEmail: 'halo@example.com',
        socialLinks: [
          { label: 'Instagram', url: 'https://instagram.com/openbytelabs' },
          { label: 'Rusak', url: 'javascript:alert(1)' },
        ],
      },
      navigation: { menuItems: [], footerText: '© {tahun} OpenByte Labs' },
      whatsapp: { tplCalculator: 'HALO {nama}', tplTrackingLink: '{link_tracking}' },
      tracking: { trackingEnabled: true, sessionMinutes: 120 },
    }

    const dto = toSettingsDto(doc as never, [
      { label: 'Beranda', href: '/', external: false },
    ])

    const serialized = JSON.stringify(dto)
    expect(serialized).not.toContain('tplCalculator')
    expect(serialized).not.toContain('trackingEnabled')
    expect(serialized).not.toContain('sessionMinutes')
    expect(serialized).not.toContain('HALO {nama}')
    expect(Object.keys(dto)).not.toContain('whatsapp')
    expect(Object.keys(dto)).not.toContain('tracking')

    expect(dto.brandName).toBe('OpenByte Labs')
    expect(dto.menu).toHaveLength(1)
    // Tautan sosial berbahaya dibuang, yang sah dipertahankan.
    expect(dto.socialLinks.map((link) => link.href)).toEqual([
      'https://instagram.com/openbytelabs',
    ])
  })

  it('memakai nilai aman ketika Settings belum diisi', () => {
    const dto = toSettingsDto(null, [])
    expect(dto.brandName).toBe('OpenByte Labs')
    expect(dto.calculator.minimumPrice).toBe(0)
    expect(dto.hero.trustMetrics).toEqual([])
    expect(dto.menu).toEqual([])
  })
})

describe('DTO paket', () => {
  const now = new Date('2026-10-27T00:00:00.000Z')

  it('memakai harga diskon aktif dan menyimpan harga normal', () => {
    const dto = toPackageDto(
      {
        slug: 'starter-umkm-bisnis',
        name: 'Starter UMKM & Bisnis',
        price: 1_000_000,
        discountPrice: 850_000,
        discountEndsAt: '2026-12-31T00:00:00.000Z',
        billingType: 'one_time',
        estimatedDays: 7,
        includedRevisions: 2,
        extraRevisionPrice: 100_000,
        features: [{ text: 'Responsif' }],
        isPopular: true,
        category: { id: 1, name: 'Bisnis & UMKM', slug: 'bisnis-umkm' },
      } as never,
      'Bisnis & UMKM',
      now,
    )

    expect(dto.price).toBe(850_000)
    expect(dto.originalPrice).toBe(1_000_000)
    expect(dto.isDiscounted).toBe(true)
    expect(dto.categoryName).toBe('Bisnis & UMKM')
    expect(dto.features).toEqual(['Responsif'])
    expect(dto.isPopular).toBe(true)
  })

  it('tidak mempertahankan diskon yang sudah berakhir', () => {
    const dto = toPackageDto(
      {
        slug: 'sistem-informasi-instansi',
        name: 'Sistem Informasi',
        price: 4_000_000,
        discountPrice: 3_500_000,
        discountEndsAt: '2026-10-01T00:00:00.000Z',
        billingType: 'custom',
        includedRevisions: 3,
      } as never,
      null,
      now,
    )

    expect(dto.price).toBe(4_000_000)
    expect(dto.isDiscounted).toBe(false)
    expect(dto.originalPrice).toBeNull()
    expect(dto.billingType).toBe('custom')
    expect(dto.features).toEqual([])
  })
})

describe('DTO halaman', () => {
  it('mengikuti urutan CMS, melewati blok tersembunyi dan tak dikenal', () => {
    const result = toPageDto(
      {
        slug: 'home',
        title: 'Beranda',
        layout: [
          { blockType: 'hero', headline: 'Judul hero', subheadline: 'Sub hero' },
          { blockType: 'faq', isVisible: false, title: 'FAQ' },
          { blockType: 'blokBaru', isVisible: true },
          { blockType: 'richText', content: { root: { children: [] } } },
        ],
        meta: { title: 'Meta judul', description: 'Meta deskripsi' },
      },
      context,
    )

    expect(result.page.blocks.map((block) => block.type)).toEqual(['hero', 'richText'])
    expect(result.unknownTypes).toEqual(['blokBaru'])
    expect(result.hiddenCount).toBe(1)
    expect(result.page.meta.title).toBe('Meta judul')
  })

  it('memakai Settings sebagai cadangan hero ketika field blok kosong', () => {
    const result = toPageDto(
      {
        slug: 'home',
        title: 'Beranda',
        layout: [{ blockType: 'hero', headline: '', trustMetrics: [] }],
      },
      context,
    )

    const hero = result.page.blocks[0]
    expect(hero).toMatchObject({
      type: 'hero',
      headline: 'Headline dari Settings',
      subheadline: 'Sub dari Settings',
      trustMetrics: [{ value: '1', label: 'Metrik Settings' }],
    })
  })

  it('tidak membuat CTA tanpa target valid', () => {
    const result = toPageDto(
      {
        slug: 'home',
        title: 'Beranda',
        layout: [
          { blockType: 'hero', headline: 'Judul', primaryCtaLabel: 'Ke tracking', primaryCtaTarget: '/tracking' },
        ],
      },
      context,
    )

    expect(result.page.blocks[0]).toMatchObject({ type: 'hero', primaryCta: null })
  })
})
