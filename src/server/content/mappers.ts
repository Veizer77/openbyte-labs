/**
 * Pemetaan dokumen Payload -> DTO publik (F3-01).
 *
 * Prinsip: DTO hanya memuat field yang memang dipakai tampilan publik. Field
 * internal/operasional (template WhatsApp, konfigurasi tracking, catatan admin,
 * kontak pengunjung, id database) tidak pernah ikut. Nilai yang tidak lolos
 * validasi tautan dibuang, bukan diperbaiki diam-diam.
 */

import type { Category, Media, SiteSetting, Technology } from '@/payload-types'
import { selectRenderableBlocks } from '@/lib/content/blocks'
import { isSafeHref, toLinkDto } from '@/lib/content/links'
import { resolvePrice } from '@/lib/content/pricing'
import type {
  AddonDto,
  FaqItemDto,
  LinkDto,
  MediaImage,
  PageBlockDto,
  PageDto,
  PackageDto,
  ProjectBlockDto,
  ProjectCardDto,
  ProjectDetailDto,
  RichTextValue,
  ServiceCardDto,
  SiteSettingsDto,
  TestimonialDto,
} from '@/lib/content/types'

/**
 * Tipe masukan mapper bersifat struktural dan toleran terhadap `select`:
 * query hanya mengambil field yang dipakai, sehingga field lain (createdAt,
 * updatedAt, field internal) memang tidak tersedia di sini.
 */
export type ProjectCardInput = {
  slug: string
  title: string
  tagline?: string | null
  summary?: string | null
  featuredImage?: number | Media | null
  categories?: (number | Category)[] | null
  technologies?: (number | Technology)[] | null
  isFeatured?: boolean | null
  publishedAt?: string | null
}

export type ProjectDetailInput = ProjectCardInput & {
  clientName?: string | null
  year?: number | null
  gallery?: { image?: number | Media | null; alt?: string | null }[] | null
  contentBlocks?: unknown
  links?: unknown
  meta?: { title?: string | null; description?: string | null; ogImage?: number | Media | null } | null
}

export type ServiceInput = {
  title: string
  description?: string | null
  highlights?: { text?: string | null }[] | null
  icon?: string | null
  size?: string | null
}

export type PackageInput = {
  slug: string
  name: string
  price: number
  discountPrice?: number | null
  discountEndsAt?: string | null
  billingType?: string | null
  estimatedDays?: number | null
  includedRevisions?: number | null
  extraRevisionPrice?: number | null
  features?: { text?: string | null }[] | null
  ctaLabel?: string | null
  isPopular?: boolean | null
  category?: number | Category | null
}

export type AddonInput = {
  name: string
  description?: string | null
  price: number
  billingType?: string | null
}

export type FaqInput = { question?: string | null; answer?: unknown }

export type TestimonialInput = {
  authorName?: string | null
  authorRole?: string | null
  quote?: string | null
  photo?: number | Media | null
}

export type PageInput = {
  slug: string
  title: string
  layout?: readonly unknown[] | null
  meta?: { title?: string | null; description?: string | null; ogImage?: number | Media | null } | null
}

type MaybeMedia = number | Media | null | undefined

const ALLOWED_VIDEO_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'www.vimeo.com',
])

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

function trimmed(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const result = value.trim()
  return result ? result : null
}

/** Media -> DTO. Media tanpa URL (belum tersimpan di storage) dianggap tidak ada. */
export function toImage(value: MaybeMedia): MediaImage | null {
  if (!value || typeof value === 'number') return null
  const url = trimmed(value.url)
  if (!url) return null

  const sizes = value.sizes ?? {}
  const sizesDto: MediaImage['sizes'] = {}
  for (const key of ['thumb', 'card', 'hero', 'og'] as const) {
    const sizeUrl = trimmed(sizes[key]?.url)
    if (sizeUrl) sizesDto[key] = sizeUrl
  }

  return {
    url,
    alt: trimmed(value.alt) ?? '',
    width: value.width ?? null,
    height: value.height ?? null,
    sizes: sizesDto,
  }
}

function relationIds(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  const ids: number[] = []
  for (const item of value) {
    if (typeof item === 'number') {
      ids.push(item)
      continue
    }
    const id = asRecord(item).id
    if (typeof id === 'number') ids.push(id)
  }
  return ids
}

export function toRichText(value: unknown): RichTextValue | null {
  if (!value || typeof value !== 'object') return null
  return value as RichTextValue
}

/* ------------------------------------------------------------------ settings */

export function toSettingsDto(doc: SiteSetting | null, menu: SiteSettingsDto['menu']): SiteSettingsDto {
  const general = doc?.general
  const hero = doc?.hero
  const seo = doc?.seo
  const calculator = doc?.calculator
  const legal = doc?.legal

  const socialLinks: LinkDto[] = []
  for (const item of general?.socialLinks ?? []) {
    const link = toLinkDto(item.label, item.url)
    if (link) socialLinks.push(link)
  }

  return {
    brandName: trimmed(general?.brandName) ?? 'OpenByte Labs',
    logo: toImage(general?.logo),
    favicon: toImage(general?.favicon),
    whatsappNumber: trimmed(general?.whatsappNumber),
    contactEmail: trimmed(general?.contactEmail),
    address: trimmed(general?.address),
    socialLinks,
    hero: {
      headline: trimmed(hero?.headline),
      subheadline: trimmed(hero?.subheadline),
      primaryCtaLabel: trimmed(hero?.primaryCtaLabel),
      secondaryCtaLabel: trimmed(hero?.secondaryCtaLabel),
      image: toImage(hero?.heroImage),
      trustMetrics: (hero?.trustMetrics ?? [])
        .map((metric) => ({ value: trimmed(metric.value) ?? '', label: trimmed(metric.label) ?? '' }))
        .filter((metric) => metric.value && metric.label),
    },
    menu,
    footerText: trimmed(doc?.navigation?.footerText),
    seo: {
      defaultTitle: trimmed(seo?.defaultTitle),
      defaultDescription: trimmed(seo?.defaultDescription),
      ogImage: toImage(seo?.defaultOgImage),
    },
    calculator: {
      disclaimer: trimmed(calculator?.disclaimer),
      minimumPrice:
        typeof calculator?.minimumPrice === 'number' && calculator.minimumPrice >= 0
          ? calculator.minimumPrice
          : 0,
      showRange: calculator?.showRange !== false,
    },
    legal: {
      consentText: trimmed(legal?.consentText),
    },
  }
}

/* ------------------------------------------------------------------ projects */

export function toProjectCard(doc: ProjectCardInput): ProjectCardDto {
  const categories = Array.isArray(doc.categories)
    ? doc.categories.flatMap((category) =>
        typeof category === 'number'
          ? []
          : [{ slug: category.slug, name: category.name }],
      )
    : []

  const technologies = Array.isArray(doc.technologies)
    ? doc.technologies.flatMap((technology) =>
        typeof technology === 'number' ? [] : [technology.name],
      )
    : []

  return {
    slug: doc.slug,
    href: `/proyek/${doc.slug}`,
    title: doc.title,
    tagline: trimmed(doc.tagline),
    summary: doc.summary ?? '',
    featuredImage: toImage(doc.featuredImage),
    categories,
    technologies,
    isFeatured: doc.isFeatured === true,
    publishedAt: doc.publishedAt ?? null,
  }
}

function toProjectLinks(value: unknown): LinkDto[] {
  if (!Array.isArray(value)) return []
  const links: LinkDto[] = []
  for (const item of value) {
    const record = asRecord(item)
    const url = trimmed(record.url)
    const label = trimmed(record.label)
    if (!url || !label) continue
    if (!isSafeHref(url)) continue
    // Tautan proyek hanya https (validasi koleksi); URL internal tidak relevan.
    if (!/^https:\/\//i.test(url)) continue
    links.push({ label, href: url, external: true })
  }
  return links
}

function toProjectBlocks(value: unknown): ProjectBlockDto[] {
  if (!Array.isArray(value)) return []
  const blocks: ProjectBlockDto[] = []

  for (const item of value) {
    const record = asRecord(item)
    switch (record.blockType) {
      case 'richText': {
        const content = toRichText(record.content)
        if (content) blocks.push({ type: 'richText', content })
        break
      }
      case 'image': {
        const image = toImage(record.image as MaybeMedia)
        const alt = trimmed(record.alt)
        if (image && alt) blocks.push({ type: 'image', image, alt, caption: trimmed(record.caption) })
        break
      }
      case 'gallery': {
        const images = Array.isArray(record.images)
          ? record.images.flatMap((entry) => {
              const entryRecord = asRecord(entry)
              const image = toImage(entryRecord.image as MaybeMedia)
              const alt = trimmed(entryRecord.alt)
              return image && alt ? [{ image, alt }] : []
            })
          : []
        if (images.length) blocks.push({ type: 'gallery', images })
        break
      }
      case 'video': {
        const url = trimmed(record.url)
        if (!url || !isSafeHref(url)) break
        try {
          const parsed = new URL(url)
          if (!ALLOWED_VIDEO_HOSTS.has(parsed.hostname)) break
          blocks.push({ type: 'video', url: parsed.toString() })
        } catch {
          break
        }
        break
      }
      case 'stats': {
        const items = Array.isArray(record.items)
          ? record.items.map((entry) => {
              const entryRecord = asRecord(entry)
              return { value: trimmed(entryRecord.value), label: trimmed(entryRecord.label) }
            })
          : []
        if (items.length) blocks.push({ type: 'stats', items })
        break
      }
      case 'quote': {
        const quote = trimmed(record.quote)
        if (quote) blocks.push({ type: 'quote', quote, attribution: trimmed(record.attribution) })
        break
      }
      case 'bullets': {
        const items = Array.isArray(record.items)
          ? record.items.flatMap((entry) => {
              const text = trimmed(asRecord(entry).text)
              return text ? [text] : []
            })
          : []
        if (items.length) blocks.push({ type: 'bullets', items })
        break
      }
      case 'problemSolutionImpact': {
        const problem = toRichText(record.problem)
        const solution = toRichText(record.solution)
        const impact = toRichText(record.impact)
        if (problem && solution && impact) {
          blocks.push({ type: 'problemSolutionImpact', problem, solution, impact })
        }
        break
      }
      default:
        break
    }
  }

  return blocks
}

export function toProjectDetail(doc: ProjectDetailInput): ProjectDetailDto {
  const gallery = Array.isArray(doc.gallery)
    ? doc.gallery.map((entry) => ({
        image: toImage(entry.image),
        alt: trimmed(entry.alt) ?? '',
      }))
    : []

  return {
    ...toProjectCard(doc),
    clientName: trimmed(doc.clientName),
    year: doc.year ?? null,
    gallery,
    links: toProjectLinks(doc.links),
    blocks: toProjectBlocks(doc.contentBlocks),
    meta: {
      title: trimmed(doc.meta?.title),
      description: trimmed(doc.meta?.description),
      ogImage: toImage(doc.meta?.ogImage),
    },
  }
}

/* ------------------------------------------------------------------ services */

export function toServiceCard(doc: ServiceInput): ServiceCardDto {
  const highlights = Array.isArray(doc.highlights)
    ? doc.highlights.flatMap((entry) => {
        const text = trimmed(entry.text)
        return text ? [text] : []
      })
    : []

  const size = doc.size === 'wide' || doc.size === 'tall' ? doc.size : 'normal'

  return {
    title: doc.title,
    description: doc.description ?? '',
    highlights,
    icon: doc.icon ?? '',
    size,
  }
}

/* ------------------------------------------------------------------ packages */

export function toPackageDto(
  doc: PackageInput,
  categoryName: string | null,
  now: Date = new Date(),
): PackageDto {
  const resolved = resolvePrice(
    {
      price: doc.price,
      discountPrice: doc.discountPrice ?? null,
      discountEndsAt: doc.discountEndsAt ?? null,
    },
    now,
  )

  return {
    slug: doc.slug,
    name: doc.name,
    categoryName,
    price: resolved.price,
    originalPrice: resolved.originalPrice,
    isDiscounted: resolved.isDiscounted,
    discountEndsAt: resolved.discountEndsAt,
    billingType:
      doc.billingType === 'subscription_yearly' || doc.billingType === 'custom'
        ? doc.billingType
        : 'one_time',
    estimatedDays: doc.estimatedDays ?? null,
    includedRevisions: doc.includedRevisions ?? 0,
    extraRevisionPrice: doc.extraRevisionPrice ?? null,
    features: Array.isArray(doc.features)
      ? doc.features.flatMap((feature) => {
          const text = trimmed(feature.text)
          return text ? [text] : []
        })
      : [],
    ctaLabel: trimmed(doc.ctaLabel),
    isPopular: doc.isPopular === true,
  }
}

export function toAddonDto(doc: AddonInput): AddonDto {
  return {
    name: doc.name,
    description: trimmed(doc.description),
    price: doc.price,
    billingType:
      doc.billingType === 'monthly' || doc.billingType === 'yearly' ? doc.billingType : 'one_time',
  }
}

/* -------------------------------------------------------------- faqs/testimoni */

export function toFaqItem(doc: FaqInput): FaqItemDto | null {
  const answer = toRichText(doc.answer)
  const question = trimmed(doc.question)
  if (!question || !answer) return null
  return { question, answer }
}

export function toTestimonial(doc: TestimonialInput): TestimonialDto | null {
  const quote = trimmed(doc.quote)
  const authorName = trimmed(doc.authorName)
  if (!quote || !authorName) return null
  return {
    authorName,
    authorRole: trimmed(doc.authorRole),
    quote,
    photo: toImage(doc.photo),
  }
}

/* -------------------------------------------------------------- page blocks */

export type PageBlockContext = {
  settings: SiteSettingsDto
  services: ServiceCardDto[]
  serviceById: Map<number, ServiceCardDto>
  packages: PackageDto[]
  packageById: Map<number, PackageDto>
  projects: ProjectCardDto[]
  faqs: FaqItemDto[]
  testimonials: TestimonialDto[]
}

export type PageMappingResult = {
  blocks: PageBlockDto[]
  unknownTypes: string[]
  hiddenCount: number
}

function mapBlock(record: Record<string, unknown>, context: PageBlockContext): PageBlockDto | null {
  switch (record.blockType) {
    case 'hero': {
      const headline = trimmed(record.headline) ?? context.settings.hero.headline
      if (!headline) return null

      const primaryTarget = trimmed(record.primaryCtaTarget)
      const secondaryTarget = trimmed(record.secondaryCtaTarget)
      const trustMetrics = Array.isArray(record.trustMetrics)
        ? record.trustMetrics
            .map((metric) => {
              const metricRecord = asRecord(metric)
              return {
                value: trimmed(metricRecord.value) ?? '',
                label: trimmed(metricRecord.label) ?? '',
              }
            })
            .filter((metric) => metric.value && metric.label)
        : []

      return {
        type: 'hero',
        headline,
        subheadline: trimmed(record.subheadline) ?? context.settings.hero.subheadline,
        primaryCta: primaryTarget
          ? toLinkDto(trimmed(record.primaryCtaLabel) ?? context.settings.hero.primaryCtaLabel, primaryTarget)
          : null,
        secondaryCta: secondaryTarget
          ? toLinkDto(
              trimmed(record.secondaryCtaLabel) ?? context.settings.hero.secondaryCtaLabel,
              secondaryTarget,
            )
          : null,
        image: toImage(record.image as MaybeMedia) ?? context.settings.hero.image,
        trustMetrics: trustMetrics.length ? trustMetrics : context.settings.hero.trustMetrics,
      }
    }

    case 'servicesGrid': {
      const ids = relationIds(record.services)
      const selected = ids.length
        ? ids.flatMap((id) => {
            const service = context.serviceById.get(id)
            return service ? [service] : []
          })
        : context.services

      return {
        type: 'servicesGrid',
        title: trimmed(record.title),
        description: trimmed(record.description),
        services: selected,
      }
    }

    case 'portfolioShowcase': {
      const featuredOnly = record.featuredOnly === true
      const limit =
        typeof record.limit === 'number' && record.limit > 0 ? Math.min(record.limit, 24) : 3
      const pool = featuredOnly ? context.projects.filter((project) => project.isFeatured) : context.projects

      return {
        type: 'portfolioShowcase',
        title: trimmed(record.title),
        projects: pool.slice(0, limit),
        totalProjects: context.projects.length,
      }
    }

    case 'calculator':
      return {
        type: 'calculator',
        title: trimmed(record.title),
        description: trimmed(record.description),
        disclaimer: context.settings.calculator.disclaimer,
      }

    case 'pricing': {
      const ids = relationIds(record.servicePackages)
      const selected = ids.length
        ? ids.flatMap((id) => {
            const servicePackage = context.packageById.get(id)
            return servicePackage ? [servicePackage] : []
          })
        : context.packages

      return { type: 'pricing', title: trimmed(record.title), packages: selected }
    }

    case 'testimonials':
      return {
        type: 'testimonials',
        title: trimmed(record.title),
        items: context.testimonials,
      }

    case 'faq':
      return { type: 'faq', title: trimmed(record.title), items: context.faqs }

    case 'about':
      return {
        type: 'about',
        title: trimmed(record.title),
        body: toRichText(record.body),
      }

    case 'ctaBanner': {
      const headline = trimmed(record.headline)
      if (!headline) return null
      return {
        type: 'ctaBanner',
        headline,
        body: trimmed(record.body),
        cta: toLinkDto(record.ctaLabel, record.ctaTarget),
      }
    }

    case 'richText': {
      const content = toRichText(record.content)
      return content ? { type: 'richText', content } : null
    }

    default:
      return null
  }
}

export type PageDtoResult = {
  page: PageDto
  unknownTypes: string[]
  hiddenCount: number
}

export function toPageDto(doc: PageInput, context: PageBlockContext): PageDtoResult {
  const layout = Array.isArray(doc.layout) ? doc.layout : []
  const selection = selectRenderableBlocks(layout.map((block) => asRecord(block)))

  const blocks: PageBlockDto[] = []
  for (const record of selection.blocks) {
    const mapped = mapBlock(record, context)
    if (mapped) blocks.push(mapped)
  }

  return {
    page: {
      slug: doc.slug,
      title: doc.title,
      blocks,
      meta: {
        title: trimmed(doc.meta?.title),
        description: trimmed(doc.meta?.description),
        ogImage: toImage(doc.meta?.ogImage),
      },
    },
    unknownTypes: selection.unknownTypes,
    hiddenCount: selection.hiddenCount,
  }
}
