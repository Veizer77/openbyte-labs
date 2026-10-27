import Image from 'next/image'
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="site-footer" id="kontak">
      <div className="site-footer__main wrap">
        <div className="site-footer__brand">
          <Link href="/" aria-label="OpenByte Labs — Beranda">
            <Image
              src="/brand/openbyte-labs-official-brand-logo.svg"
              alt="OpenByte Labs"
              width={184}
              height={44}
            />
          </Link>
          <p>Website, aplikasi mobile, dan sistem informasi untuk kebutuhan nyata.</p>
        </div>
        <div className="site-footer__links">
          <div>
            <h2>Jelajahi</h2>
            <Link href="/">Beranda</Link>
            <Link href="/#layanan">Layanan</Link>
            <Link href="/proyek">Portofolio</Link>
            <Link href="/paket">Paket layanan</Link>
            <Link href="/kalkulator">Kalkulator estimasi</Link>
            <Link href="/konsultasi">Konsultasi</Link>
          </div>
          <div>
            <h2>Informasi</h2>
            <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom wrap">
        <span>© {new Date().getFullYear()} OpenByte Labs. Semua hak dilindungi.</span>
        <span className="site-footer__note">Dibuat dengan perhatian pada detail.</span>
      </div>
    </footer>
  )
}
