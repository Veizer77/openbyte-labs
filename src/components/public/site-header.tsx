import Image from 'next/image'
import Link from 'next/link'

const links = [
  { href: '/', label: 'Beranda' },
  { href: '/#layanan', label: 'Layanan' },
  { href: '/proyek', label: 'Portofolio' },
  { href: '/paket', label: 'Paket' },
  { href: '/kalkulator', label: 'Estimasi' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href="/" aria-label="OpenByte Labs — Beranda">
          <Image
            src="/brand/openbyte-labs-official-brand-logo.svg"
            alt="OpenByte Labs"
            width={184}
            height={44}
            priority
          />
        </Link>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <Link className="nav-cta" href="/konsultasi">
            Konsultasi{' '}
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </nav>

        <details className="mobile-nav">
          <summary aria-label="Buka navigasi">
            <span className="material-symbols-outlined" aria-hidden="true">
              menu
            </span>
          </summary>
          <nav aria-label="Navigasi seluler">
            {links.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
            <Link className="nav-cta" href="/konsultasi">
              Konsultasi{' '}
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </nav>
        </details>
      </div>
    </header>
  )
}
