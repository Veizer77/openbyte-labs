import type { Metadata } from 'next'
import { SiteFooter } from '@/components/public/site-footer'
import { SiteHeader } from '@/components/public/site-header'
import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'OpenByte Labs: Website, Aplikasi Mobile & Sistem Informasi',
    template: '%s | OpenByte Labs',
  },
  description:
    'Software house personal untuk website bisnis, aplikasi mobile Flutter, sistem informasi, dan undangan digital.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="id">
      <body>
        <a className="skip-link" href="#konten-utama">
          Lewati ke konten
        </a>
        <SiteHeader />
        <main id="konten-utama">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
