import type { Metadata } from 'next'
import { SiteFooter } from '@/components/public/site-footer'
import { SiteHeader } from '@/components/public/site-header'
import { getPublishedPageSlugs, getPublicSettings } from '@/server/content'
import './styles.css'
import './blocks.css'

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000'
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings()

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: settings.seo.defaultTitle ?? settings.brandName,
      template: `%s | ${settings.brandName}`,
    },
    description: settings.seo.defaultDescription ?? settings.hero.subheadline ?? undefined,
    ...(settings.favicon ? { icons: { icon: settings.favicon.url } } : {}),
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const [settings, pageSlugs] = await Promise.all([getPublicSettings(), getPublishedPageSlugs()])

  return (
    <html lang="id">
      <body>
        <a className="skip-link" href="#konten-utama">
          Lewati ke konten
        </a>
        <SiteHeader settings={settings} />
        <main id="konten-utama">{children}</main>
        <SiteFooter
          settings={settings}
          hasPrivacyPage={pageSlugs.includes('kebijakan-privasi')}
        />
      </body>
    </html>
  )
}
