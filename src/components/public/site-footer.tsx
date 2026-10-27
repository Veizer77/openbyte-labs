import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettingsDto } from '@/lib/content/types'

const BRAND_LOGO_FALLBACK = '/brand/openbyte-labs-official-brand-logo.svg'

function fillYear(text: string, year: number): string {
  return text.replace(/\{tahun\}/g, String(year))
}

/**
 * Footer publik (F3-03). Teks, menu, dan tautan sosial berasal dari CMS.
 * Tautan Kebijakan Privasi hanya dirender bila halamannya benar-benar sudah
 * diterbitkan, sehingga tidak ada tautan ke halaman yang 404.
 */
export function SiteFooter({
  settings,
  hasPrivacyPage,
}: {
  settings: SiteSettingsDto
  hasPrivacyPage: boolean
}) {
  const year = new Date().getFullYear()
  const logo = settings.logo
  const footerText = settings.footerText
    ? fillYear(settings.footerText, year)
    : `© ${year} ${settings.brandName}. Semua hak dilindungi.`

  return (
    <footer className="site-footer" id="kontak">
      <div className="site-footer__main wrap">
        <div className="site-footer__brand">
          <Link href="/" aria-label={`${settings.brandName} — Beranda`}>
            {logo ? (
              <Image
                src={logo.url}
                alt={settings.brandName}
                width={logo.width ?? 184}
                height={logo.height ?? 44}
                style={{ height: 44, width: 'auto' }}
              />
            ) : (
              <Image src={BRAND_LOGO_FALLBACK} alt={settings.brandName} width={184} height={44} />
            )}
          </Link>
          <p>
            {settings.hero.subheadline ??
              'Website, aplikasi mobile, dan sistem informasi untuk kebutuhan nyata.'}
          </p>
          {settings.socialLinks.length ? (
            <ul className="site-footer__social">
              {settings.socialLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} rel="noopener noreferrer" target="_blank">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="site-footer__links">
          <div>
            <h2>Jelajahi</h2>
            {settings.menu.map((item) => (
              <Link href={item.href} key={`footer-${item.href}`}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <h2>Informasi</h2>
            {hasPrivacyPage ? <Link href="/kebijakan-privasi">Kebijakan Privasi</Link> : null}
            {settings.contactEmail ? (
              <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="site-footer__bottom wrap">
        <span>{footerText}</span>
        {settings.address ? <span className="site-footer__note">{settings.address}</span> : null}
      </div>
    </footer>
  )
}
