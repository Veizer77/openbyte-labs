/**
 * Pembacaan konten publik (F3-01).
 *
 * Setiap query menyebut `where`, `depth`, `select`, `sort`, dan `limit` secara
 * eksplisit (PRD 2.4). Hasilnya selalu dipetakan ke DTO sebelum meninggalkan
 * lapisan ini; dokumen Payload mentah tidak pernah diserahkan ke komponen.
 *
 * Parameter `preview` dipakai oleh rute pratinjau: query membaca dokumen draft
 * dan melewati cache. Nilai default selalu publik.
 */

import type { Where } from 'payload'
import { FALLBACK_MENU, sanitizeMenuItems } from '@/lib/content/links'
import type {
  AddonDto,
  CalculatorConfigDto,
  CalculatorOptionDto,
  FaqItemDto,
  PageDto,
  PackageDto,
  ProjectCardDto,
  ProjectDetailDto,
  ServiceCardDto,
  SiteSettingsDto,
  TestimonialDto,
} from '@/lib/content/types'
import { cacheContent, CONTENT_TAGS } from './cache'
import {
  toAddonDto,
  toFaqItem,
  toPackageDto,
  toPageDto,
  toProjectCard,
  toProjectDetail,
  toServiceCard,
  toSettingsDto,
  toTestimonial,
  type PageBlockContext,
} from './mappers'
import { reportUnknownBlocks } from './observability'
import { getContentPayload } from './payload'

type ReadOptions = { preview?: boolean }

/** Route statis yang selalu ada di Rilis 1. */
const STATIC_PUBLIC_ROUTES = ['/', '/proyek', '/paket', '/kalkulator', '/konsultasi', '/pesan'] as const

const HOMEPAGE_SLUG = 'home'

function nowIso(): string {
  return new Date().toISOString()
}

/** Filter proyek publik: published dan `publishedAt` sudah lewat. */
function publishedProjectWhere(): Where {
  return {
    and: [
      { _status: { equals: 'published' } },
      { publishedAt: { less_than_equal: nowIso() } },
    ],
  }
}

/* ------------------------------------------------------------------ settings */

const loadSettings = cacheContent(
  'settings:public',
  [CONTENT_TAGS.settings, CONTENT_TAGS.pages],
  async ({ preview = false }: ReadOptions): Promise<SiteSettingsDto> => {
    const payload = await getContentPayload()

    const [doc, pageSlugs] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: true }),
      payload.find({
        collection: 'pages',
        where: preview ? {} : { _status: { equals: 'published' } },
        depth: 0,
        limit: 200,
        pagination: false,
        select: { slug: true },
        draft: preview,
        overrideAccess: true,
      }),
    ])

    const allowedPaths = new Set<string>(STATIC_PUBLIC_ROUTES)
    for (const page of pageSlugs.docs) {
      if (page.slug && page.slug !== HOMEPAGE_SLUG) allowedPaths.add(`/${page.slug}`)
    }

    const sanitizedMenu = sanitizeMenuItems(doc?.navigation?.menuItems, allowedPaths)
    // Menu CMS adalah sumber otoritatif. Daftar bawaan hanya dipakai bila CMS
    // belum punya satu pun menu aktif, supaya situs tetap bisa dijelajahi.
    const menu = sanitizedMenu.length ? sanitizedMenu : [...FALLBACK_MENU]
    return toSettingsDto(doc, menu)
  },
)

export function getPublicSettings(options: ReadOptions = {}): Promise<SiteSettingsDto> {
  return loadSettings({ preview: options.preview === true })
}

/* --------------------------------------------------------------------- pages */

const loadPageBySlug = cacheContent(
  'pages:by-slug',
  [CONTENT_TAGS.pages],
  async (slug: string, { preview = false }: ReadOptions) => {
    const payload = await getContentPayload()
    const result = await payload.find({
      collection: 'pages',
      where: preview
        ? { slug: { equals: slug } }
        : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      depth: 1,
      limit: 1,
      pagination: false,
      draft: preview,
      overrideAccess: true,
      select: {
        slug: true,
        title: true,
        layout: true,
        meta: true,
      },
    })

    return result.docs[0] ?? null
  },
)

/** Slug halaman yang sudah published, dipakai sitemap dan validasi menu. */
const loadPublishedPageSlugs = cacheContent(
  'pages:published-slugs',
  [CONTENT_TAGS.pages],
  async ({ preview = false }: ReadOptions): Promise<string[]> => {
    const payload = await getContentPayload()
    const result = await payload.find({
      collection: 'pages',
      where: preview ? {} : { _status: { equals: 'published' } },
      depth: 0,
      limit: 200,
      pagination: false,
      sort: 'slug',
      select: { slug: true },
      draft: preview,
      overrideAccess: true,
    })

    return result.docs.flatMap((page) => (page.slug ? [page.slug] : []))
  },
)

export function getPublishedPageSlugs(options: ReadOptions = {}): Promise<string[]> {
  return loadPublishedPageSlugs({ preview: options.preview === true })
}

/* ------------------------------------------------------------------ projects */

const loadProjects = cacheContent(
  'projects:published',
  [CONTENT_TAGS.projects, CONTENT_TAGS.categories],
  async ({ preview = false }: ReadOptions): Promise<ProjectCardDto[]> => {
    const payload = await getContentPayload()
    const result = await payload.find({
      collection: 'projects',
      where: preview ? {} : publishedProjectWhere(),
      depth: 2,
      limit: 200,
      pagination: false,
      sort: ['_order', '-publishedAt'],
      draft: preview,
      overrideAccess: true,
      select: {
        slug: true,
        title: true,
        tagline: true,
        summary: true,
        featuredImage: true,
        categories: true,
        technologies: true,
        isFeatured: true,
        publishedAt: true,
      },
    })

    return result.docs.map(toProjectCard)
  },
)

export function listPublishedProjects(options: ReadOptions = {}): Promise<ProjectCardDto[]> {
  return loadProjects({ preview: options.preview === true })
}

const loadProjectBySlug = cacheContent(
  'projects:by-slug',
  [CONTENT_TAGS.projects, CONTENT_TAGS.categories],
  async (
    slug: string,
    { preview = false }: ReadOptions,
  ): Promise<{ project: ProjectDetailDto; related: ProjectCardDto[] } | null> => {
    const payload = await getContentPayload()
    const result = await payload.find({
      collection: 'projects',
      where: preview
        ? { slug: { equals: slug } }
        : { and: [{ slug: { equals: slug } }, publishedProjectWhere()] },
      depth: 3,
      limit: 1,
      pagination: false,
      draft: preview,
      overrideAccess: true,
      select: {
        slug: true,
        title: true,
        tagline: true,
        summary: true,
        clientName: true,
        year: true,
        publishedAt: true,
        featuredImage: true,
        gallery: true,
        contentBlocks: true,
        links: true,
        isFeatured: true,
        categories: true,
        technologies: true,
        meta: true,
      },
    })

    const doc = result.docs[0]
    if (!doc) return null

    const categoryIds = Array.isArray(doc.categories)
      ? doc.categories.flatMap((category) => (typeof category === 'number' ? [category] : [category.id]))
      : []

    const relatedWhere: Where = { slug: { not_equals: slug } }
    const related = categoryIds.length
      ? await payload.find({
          collection: 'projects',
          where: preview
            ? { and: [{ categories: { in: categoryIds } }, relatedWhere] }
            : { and: [publishedProjectWhere(), { categories: { in: categoryIds } }, relatedWhere] },
          depth: 2,
          limit: 3,
          sort: ['_order', '-publishedAt'],
          draft: preview,
          overrideAccess: true,
          select: {
            slug: true,
            title: true,
            tagline: true,
            summary: true,
            featuredImage: true,
            categories: true,
            technologies: true,
            isFeatured: true,
            publishedAt: true,
          },
        })
      : { docs: [] }

    return {
      project: toProjectDetail(doc),
      related: related.docs.map(toProjectCard),
    }
  },
)

export function getPublishedProjectBySlug(
  slug: string,
  options: ReadOptions = {},
): Promise<{ project: ProjectDetailDto; related: ProjectCardDto[] } | null> {
  return loadProjectBySlug(slug, { preview: options.preview === true })
}

/* ------------------------------------------------------------------- catalog */

const loadServices = cacheContent(
  'services:active',
  [CONTENT_TAGS.services],
  async ({ preview = false }: ReadOptions): Promise<{ items: ServiceCardDto[]; byId: Map<number, ServiceCardDto> }> => {
    const payload = await getContentPayload()
    const result = await payload.find({
      collection: 'services',
      where: preview ? {} : { isActive: { equals: true } },
      depth: 0,
      limit: 50,
      pagination: false,
      sort: '_order',
      overrideAccess: true,
      select: { title: true, description: true, highlights: true, icon: true, size: true },
    })

    const items = result.docs.map(toServiceCard)
    const byId = new Map<number, ServiceCardDto>()
    result.docs.forEach((doc, index) => byId.set(doc.id, items[index]))
    return { items, byId }
  },
)

const loadPackages = cacheContent(
  'packages:active',
  [CONTENT_TAGS.packages, CONTENT_TAGS.categories],
  async ({
    preview = false,
  }: ReadOptions): Promise<{ items: PackageDto[]; byId: Map<number, PackageDto> }> => {
    const payload = await getContentPayload()
    const result = await payload.find({
      collection: 'service-packages',
      where: preview ? {} : { isActive: { equals: true } },
      depth: 2,
      limit: 100,
      pagination: false,
      sort: '_order',
      overrideAccess: true,
      select: {
        slug: true,
        name: true,
        price: true,
        discountPrice: true,
        discountEndsAt: true,
        billingType: true,
        estimatedDays: true,
        includedRevisions: true,
        extraRevisionPrice: true,
        features: true,
        ctaLabel: true,
        isPopular: true,
        category: true,
      },
    })

    const now = new Date()
    const items = result.docs.map((doc) =>
      toPackageDto(
        doc,
        typeof doc.category === 'number' ? null : (doc.category?.name ?? null),
        now,
      ),
    )
    const byId = new Map<number, PackageDto>()
    result.docs.forEach((doc, index) => byId.set(doc.id, items[index]))
    return { items, byId }
  },
)

const loadAddons = cacheContent(
  'addons:active',
  [CONTENT_TAGS.packages],
  async ({ preview = false }: ReadOptions): Promise<AddonDto[]> => {
    const payload = await getContentPayload()
    const result = await payload.find({
      collection: 'service-addons',
      where: preview ? {} : { isActive: { equals: true } },
      depth: 0,
      limit: 50,
      pagination: false,
      sort: '_order',
      overrideAccess: true,
      select: { name: true, description: true, price: true, billingType: true },
    })

    return result.docs.map(toAddonDto)
  },
)

const loadFaqs = cacheContent(
  'faqs:active',
  [CONTENT_TAGS.faqs],
  async ({ preview = false }: ReadOptions): Promise<FaqItemDto[]> => {
    const payload = await getContentPayload()
    const result = await payload.find({
      collection: 'faqs',
      where: preview ? {} : { isActive: { equals: true } },
      depth: 0,
      limit: 50,
      pagination: false,
      sort: '_order',
      overrideAccess: true,
      select: { question: true, answer: true },
    })

    return result.docs.flatMap((doc) => {
      const item = toFaqItem(doc)
      return item ? [item] : []
    })
  },
)

const loadTestimonials = cacheContent(
  'testimonials:active',
  [CONTENT_TAGS.testimonials],
  async ({ preview = false }: ReadOptions): Promise<TestimonialDto[]> => {
    const payload = await getContentPayload()
    const result = await payload.find({
      collection: 'testimonials',
      where: preview ? {} : { isActive: { equals: true } },
      depth: 1,
      limit: 24,
      pagination: false,
      sort: '_order',
      overrideAccess: true,
      select: { authorName: true, authorRole: true, quote: true, photo: true },
    })

    return result.docs.flatMap((doc) => {
      const item = toTestimonial(doc)
      return item ? [item] : []
    })
  },
)

export type CatalogData = {
  services: ServiceCardDto[]
  serviceById: Map<number, ServiceCardDto>
  packages: PackageDto[]
  packageById: Map<number, PackageDto>
  addons: AddonDto[]
  faqs: FaqItemDto[]
  testimonials: TestimonialDto[]
  projects: ProjectCardDto[]
}

export async function getCatalog(options: ReadOptions = {}): Promise<CatalogData> {
  const opts = { preview: options.preview === true }
  const [services, packages, addons, faqs, testimonials, projects] = await Promise.all([
    loadServices(opts),
    loadPackages(opts),
    loadAddons(opts),
    loadFaqs(opts),
    loadTestimonials(opts),
    loadProjects(opts),
  ])

  return {
    services: services.items,
    serviceById: services.byId,
    packages: packages.items,
    packageById: packages.byId,
    addons,
    faqs,
    testimonials,
    projects,
  }
}

/* ----------------------------------------------------------- page composition */

export type PageViewData = {
  page: PageDto
  settings: SiteSettingsDto
  unknownBlockTypes: string[]
  hiddenBlockCount: number
}

export async function getPageViewData(
  slug: string,
  options: ReadOptions = {},
): Promise<PageViewData | null> {
  const opts = { preview: options.preview === true }

  const [settings, doc] = await Promise.all([getPublicSettings(opts), loadPageBySlug(slug, opts)])
  if (!doc) return null

  const catalog = await getCatalog(opts)

  const context: PageBlockContext = {
    settings,
    services: catalog.services,
    serviceById: catalog.serviceById,
    packages: catalog.packages,
    packageById: catalog.packageById,
    projects: catalog.projects,
    faqs: catalog.faqs,
    testimonials: catalog.testimonials,
  }

  const { page, unknownTypes, hiddenCount } = toPageDto(doc, context)

  // Blok tak dikenal dilewati (halaman tetap tampil) tetapi dicatat aman.
  reportUnknownBlocks(slug, unknownTypes)

  return {
    page,
    settings,
    unknownBlockTypes: unknownTypes,
    hiddenBlockCount: hiddenCount,
  }
}

export function getHomePageData(options: ReadOptions = {}): Promise<PageViewData | null> {
  return getPageViewData(HOMEPAGE_SLUG, options)
}

/* ------------------------------------------------------------------- paket */

export async function getPackagesViewData(
  options: ReadOptions = {},
): Promise<{ settings: SiteSettingsDto; packages: PackageDto[]; addons: AddonDto[] }> {
  const opts = { preview: options.preview === true }
  const [settings, packages, addons] = await Promise.all([
    getPublicSettings(opts),
    loadPackages(opts),
    loadAddons(opts),
  ])

  return { settings, packages: packages.items, addons }
}

export async function getPackageBySlug(
  slug: string,
  options: ReadOptions = {},
): Promise<PackageDto | null> {
  const packages = await loadPackages({ preview: options.preview === true })
  return packages.items.find((item) => item.slug === slug) ?? null
}

/* ----------------------------------------------------------------- kategori */

const loadProjectCategories = cacheContent(
  'categories:project-filters',
  [CONTENT_TAGS.categories, CONTENT_TAGS.projects],
  async ({ preview = false }: ReadOptions): Promise<{ slug: string; name: string }[]> => {
    const payload = await getContentPayload()
    const result = await payload.find({
      collection: 'categories',
      where: preview
        ? {}
        : { and: [{ isActive: { equals: true } }, { showInFilter: { equals: true } }] },
      depth: 0,
      limit: 50,
      pagination: false,
      sort: '_order',
      overrideAccess: true,
      select: { slug: true, name: true },
    })

    return result.docs.map((doc) => ({ slug: doc.slug, name: doc.name }))
  },
)

export function listProjectCategories(
  options: ReadOptions = {},
): Promise<{ slug: string; name: string }[]> {
  return loadProjectCategories({ preview: options.preview === true })
}

/* ---------------------------------------------------------------- kalkulator */

/**
 * DTO konfigurasi kalkulator (F3-01). Blok kalkulator di beranda belum aktif
 * sampai Fase 4, tetapi kontrak datanya sudah disiapkan di sini agar F4-03
 * memakai pembacaan yang sama dan tidak membuat jalur kedua.
 */
const loadCalculatorConfig = cacheContent(
  'calculator:config',
  [CONTENT_TAGS.calculator, CONTENT_TAGS.settings],
  async ({ preview = false }: ReadOptions): Promise<CalculatorConfigDto> => {
    const payload = await getContentPayload()

    const [groups, items, settings] = await Promise.all([
      payload.find({
        collection: 'calculator-groups',
        where: preview ? {} : { isActive: { equals: true } },
        depth: 0,
        limit: 50,
        pagination: false,
        sort: '_order',
        overrideAccess: true,
        select: { title: true, description: true, selectionType: true, isRequired: true },
      }),
      payload.find({
        collection: 'calculator-items',
        where: preview ? {} : { isActive: { equals: true } },
        depth: 0,
        limit: 200,
        pagination: false,
        sort: '_order',
        overrideAccess: true,
        select: {
          group: true,
          label: true,
          description: true,
          pricingType: true,
          unitLabel: true,
          maxUnits: true,
          priceMin: true,
          priceMax: true,
          daysMin: true,
          daysMax: true,
          isDefault: true,
          rules: true,
        },
      }),
      getPublicSettings({ preview }),
    ])

    const itemsByGroup = new Map<number, CalculatorOptionDto[]>()
    for (const item of items.docs) {
      const groupId = typeof item.group === 'number' ? item.group : item.group?.id
      if (typeof groupId !== 'number') continue

      const rules = Array.isArray(item.rules) ? item.rules : []
      const ruleIds = (ruleType: 'requires' | 'excludes'): number[] =>
        rules.flatMap((rule) => {
          if (rule.ruleType !== ruleType) return []
          const related = rule.relatedItem
          if (typeof related === 'number') return [related]
          if (related && typeof related === 'object' && typeof related.id === 'number') {
            return [related.id]
          }
          return []
        })

      const option: CalculatorOptionDto = {
        id: item.id,
        label: item.label,
        description: item.description ?? null,
        pricingType: item.pricingType === 'per_unit' ? 'per_unit' : 'flat',
        unitLabel: item.unitLabel ?? null,
        maxUnits: item.maxUnits ?? null,
        priceMin: item.priceMin,
        priceMax: item.priceMax ?? null,
        daysMin: item.daysMin,
        daysMax: item.daysMax ?? null,
        isDefault: item.isDefault === true,
        requires: ruleIds('requires'),
        excludes: ruleIds('excludes'),
      }

      const bucket = itemsByGroup.get(groupId)
      if (bucket) bucket.push(option)
      else itemsByGroup.set(groupId, [option])
    }

    return {
      groups: groups.docs.map((group) => ({
        id: group.id,
        title: group.title,
        description: group.description ?? null,
        selectionType: group.selectionType === 'multiple' ? 'multiple' : 'single',
        isRequired: group.isRequired === true,
        options: itemsByGroup.get(group.id) ?? [],
      })),
      disclaimer: settings.calculator.disclaimer,
      minimumPrice: settings.calculator.minimumPrice,
      showRange: settings.calculator.showRange,
    }
  },
)

export function getCalculatorConfig(options: ReadOptions = {}): Promise<CalculatorConfigDto> {
  return loadCalculatorConfig({ preview: options.preview === true })
}
