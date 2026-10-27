import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettingsDto } from '@/lib/content/types'

const BRAND_LOGO_FALLBACK = '/brand/openbyte-labs-official-brand-logo.svg'

/**
 * Header publik (F3-03). Menu berasal dari `site-settings.navigation.menuItems`
 * yang sudah divalidasi: hanya target aman dan route yang benar-benar ada.
 * Tautan `/tracking*` tidak pernah muncul karena dibuang saat pemetaan DTO.
 */
export function SiteHeader({ settings }: { settings: SiteSettingsDto }) {
  const logo = settings.logo
  const consultation = settings.menu.find((item) => item.href === '/konsultasi')

  const brand = logo ? (
    <Image
      src={logo.url}
      alt={settings.brandName}
      width={logo.width ?? 184}
      height={logo.height ?? 44}
      priority
      style={{ height: 44, width: 'auto' }}
    />
  ) : (
    <Image src={BRAND_LOGO_FALLBACK} alt={settings.brandName} width={184} height={44} priority />
  )

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href="/" aria-label={`${settings.brandName} — Beranda`}>
          {brand}
        </Link>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          {settings.menu.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          {consultation ? (
            <Link className="nav-cta" href={consultation.href}>
              {consultation.label}{' '}
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          ) : null}
        </nav>

        <details className="mobile-nav">
          <summary aria-label="Buka navigasi">
            <span className="material-symbols-outlined" aria-hidden="true">
              menu
            </span>
          </summary>
          <nav aria-label="Navigasi seluler">
            {settings.menu.map((item) => (
              <Link href={item.href} key={`mobile-${item.href}`}>
                {item.label}
              </Link>
            ))}
            {consultation ? (
              <Link className="nav-cta" href={consultation.href}>
                {consultation.label}{' '}
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </Link>
            ) : null}
          </nav>
        </details>
      </div>
    </header>
  )
}
