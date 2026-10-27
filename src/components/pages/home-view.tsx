import { PageBlocks } from '@/components/blocks'
import { JsonLd } from '@/components/public/json-ld'
import type { SiteSettingsDto } from '@/lib/content/types'
import type { PageViewData } from '@/server/content'

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000'
}

/** JSON-LD ProfessionalService dari Settings (F3-05). Tidak ada data rekaan. */
export function buildProfessionalServiceJsonLd(
  settings: SiteSettingsDto,
  url: string,
): Record<string, unknown> {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: settings.brandName,
    url,
  }

  if (settings.seo.defaultDescription) data.description = settings.seo.defaultDescription
  if (settings.whatsappNumber) data.telephone = settings.whatsappNumber
  if (settings.contactEmail) data.email = settings.contactEmail
  if (settings.address) {
    data.address = { '@type': 'PostalAddress', streetAddress: settings.address }
  }
  if (settings.logo) data.logo = settings.logo.url
  if (settings.socialLinks.length) data.sameAs = settings.socialLinks.map((link) => link.href)

  return data
}

export function HomeView({ data }: { data: PageViewData }) {
  return (
    <>
      <JsonLd value={buildProfessionalServiceJsonLd(data.settings, siteUrl())} />
      <PageBlocks blocks={data.page.blocks} settings={data.settings} />
    </>
  )
}
