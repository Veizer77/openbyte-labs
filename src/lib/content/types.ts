/**
 * Tipe DTO publik (F3-01).
 *
 * Modul ini sengaja bebas dari impor Payload, Next.js, atau React supaya bisa
 * dipakai Client Component (filter galeri) dan diuji sebagai TypeScript murni.
 * Dokumen mentah Payload tidak pernah melewati batas ini: setiap field yang
 * tidak dibutuhkan publik (adminNotes, kontak pengunjung, template WhatsApp,
 * konfigurasi tracking, field internal) dibuang oleh mapper di
 * `src/server/content/mappers.ts`.
 */

/** Nilai rich text Lexical (JSON) yang sudah tersanitasi strukturnya saat render. */
export type RichTextValue = Record<string, unknown>

export type MediaImage = {
  url: string
  alt: string
  width: number | null
  height: number | null
  /** URL ukuran turunan Payload (WebP). Kunci yang tidak tersedia dibiarkan kosong. */
  sizes: Partial<Record<'thumb' | 'card' | 'hero' | 'og', string>>
}

export type LinkDto = {
  label: string
  href: string
  external: boolean
}

export type SiteMenuItem = LinkDto

export type SiteSettingsDto = {
  brandName: string
  logo: MediaImage | null
  favicon: MediaImage | null
  whatsappNumber: string | null
  contactEmail: string | null
  address: string | null
  socialLinks: LinkDto[]
  hero: {
    headline: string | null
    subheadline: string | null
    primaryCtaLabel: string | null
    secondaryCtaLabel: string | null
    image: MediaImage | null
    trustMetrics: { value: string; label: string }[]
  }
  menu: SiteMenuItem[]
  footerText: string | null
  seo: {
    defaultTitle: string | null
    defaultDescription: string | null
    ogImage: MediaImage | null
  }
  calculator: {
    disclaimer: string | null
    minimumPrice: number
    showRange: boolean
  }
  legal: {
    consentText: string | null
  }
}

export type CategoryRefDto = { slug: string; name: string }

export type ProjectCardDto = {
  slug: string
  href: string
  title: string
  tagline: string | null
  summary: string
  featuredImage: MediaImage | null
  categories: CategoryRefDto[]
  technologies: string[]
  isFeatured: boolean
  publishedAt: string | null
}

export type ProjectBlockDto =
  | { type: 'richText'; content: RichTextValue }
  | { type: 'image'; image: MediaImage | null; alt: string; caption: string | null }
  | { type: 'gallery'; images: { image: MediaImage | null; alt: string }[] }
  | { type: 'video'; url: string }
  | { type: 'stats'; items: { value: string | null; label: string | null }[] }
  | { type: 'quote'; quote: string; attribution: string | null }
  | { type: 'bullets'; items: string[] }
  | {
      type: 'problemSolutionImpact'
      problem: RichTextValue
      solution: RichTextValue
      impact: RichTextValue
    }

export type ProjectDetailDto = ProjectCardDto & {
  clientName: string | null
  year: number | null
  gallery: { image: MediaImage | null; alt: string }[]
  links: LinkDto[]
  blocks: ProjectBlockDto[]
  meta: {
    title: string | null
    description: string | null
    ogImage: MediaImage | null
  }
}

export type ServiceCardDto = {
  title: string
  description: string
  highlights: string[]
  icon: string
  size: 'normal' | 'wide' | 'tall'
}

export type PackageDto = {
  slug: string
  name: string
  categoryName: string | null
  /** Harga yang benar-benar berlaku hari ini (setelah diskon bila masih aktif). */
  price: number
  /** Harga normal bila sedang diskon; null bila tidak ada diskon aktif. */
  originalPrice: number | null
  isDiscounted: boolean
  discountEndsAt: string | null
  billingType: 'one_time' | 'subscription_yearly' | 'custom'
  estimatedDays: number | null
  includedRevisions: number
  extraRevisionPrice: number | null
  features: string[]
  ctaLabel: string | null
  isPopular: boolean
}

export type AddonDto = {
  name: string
  description: string | null
  price: number
  billingType: 'one_time' | 'monthly' | 'yearly'
}

export type TestimonialDto = {
  authorName: string
  authorRole: string | null
  quote: string
  photo: MediaImage | null
}

export type FaqItemDto = {
  question: string
  answer: RichTextValue
}

export type PageBlockDto =
  | {
      type: 'hero'
      headline: string
      subheadline: string | null
      primaryCta: LinkDto | null
      secondaryCta: LinkDto | null
      image: MediaImage | null
      trustMetrics: { value: string; label: string }[]
    }
  | {
      type: 'servicesGrid'
      title: string | null
      description: string | null
      services: ServiceCardDto[]
    }
  | {
      type: 'portfolioShowcase'
      title: string | null
      projects: ProjectCardDto[]
      totalProjects: number
    }
  | {
      type: 'calculator'
      title: string | null
      description: string | null
      disclaimer: string | null
    }
  | { type: 'pricing'; title: string | null; packages: PackageDto[] }
  | { type: 'testimonials'; title: string | null; items: TestimonialDto[] }
  | { type: 'faq'; title: string | null; items: FaqItemDto[] }
  | { type: 'about'; title: string | null; body: RichTextValue | null }
  | {
      type: 'ctaBanner'
      headline: string
      body: string | null
      cta: LinkDto | null
    }
  | { type: 'richText'; content: RichTextValue }

export type PageDto = {
  slug: string
  title: string
  blocks: PageBlockDto[]
  meta: {
    title: string | null
    description: string | null
    ogImage: MediaImage | null
  }
}

export type CalculatorOptionDto = {
  id: number
  label: string
  description: string | null
  pricingType: 'flat' | 'per_unit'
  unitLabel: string | null
  maxUnits: number | null
  priceMin: number
  priceMax: number | null
  daysMin: number
  daysMax: number | null
  isDefault: boolean
  /** Id item yang wajib ikut dipilih. */
  requires: number[]
  /** Id item yang tidak boleh dipilih bersamaan. */
  excludes: number[]
}

export type CalculatorGroupDto = {
  id: number
  title: string
  description: string | null
  selectionType: 'single' | 'multiple'
  isRequired: boolean
  options: CalculatorOptionDto[]
}

export type CalculatorConfigDto = {
  groups: CalculatorGroupDto[]
  disclaimer: string | null
  minimumPrice: number
  showRange: boolean
}
