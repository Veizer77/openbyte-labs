import type { Metadata } from 'next'
import Link from 'next/link'
import { PackageCard } from '@/components/public/package-card'
import { serviceAddons, servicePackages } from '@/lib/public-content'

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export const metadata: Metadata = {
  title: 'Paket Layanan',
  description: 'Paket layanan dan opsi tambahan OpenByte Labs.',
  alternates: { canonical: '/paket' },
  openGraph: {
    title: 'Paket Layanan OpenByte Labs',
    description: 'Pilihan paket layanan untuk website, sistem informasi, dan aplikasi mobile.',
    type: 'website',
  },
}

export default function PackagesPage() {
  return (
    <>
      <section className="page-hero package-hero wrap" aria-labelledby="packages-title">
        <div>
          <span className="section-kicker">Paket & spesifikasi layanan</span>
          <h1 id="packages-title">Pilihan paket layanan.</h1>
          <p>
            Ruang lingkup, durasi, dan kuota revisi dijelaskan di awal. Harga domain dan hosting
            pihak ketiga ditanggung klien.
          </p>
        </div>
        <div className="package-trust-row" aria-label="Informasi paket">
          <div>
            <span className="material-symbols-outlined" aria-hidden="true">
              receipt_long
            </span>
            <span>Harga per paket</span>
          </div>
          <div>
            <span className="material-symbols-outlined" aria-hidden="true">
              schedule
            </span>
            <span>Durasi jelas</span>
          </div>
        </div>
      </section>

      <section className="package-section section--subtle" aria-label="Daftar paket layanan">
        <div className="wrap">
          <div className="package-grid">
            {servicePackages.map((servicePackage) => (
              <PackageCard key={servicePackage.slug} servicePackage={servicePackage} />
            ))}
          </div>
          <p className="package-data-note">
            Informasi paket ini mengikuti daftar awal. Pemesanan belum tersambung dan belum mengirim
            data.
          </p>
        </div>
      </section>

      <section className="section addons-section" aria-labelledby="addons-title">
        <div className="wrap">
          <div className="section-heading section-heading--split">
            <div>
              <span className="section-kicker">Tambahan sesuai kebutuhan</span>
              <h2 id="addons-title">Add-on layanan.</h2>
            </div>
            <p>Tambahkan dukungan lanjutan untuk kebutuhan proyek Anda.</p>
          </div>
          <div className="addon-grid">
            {serviceAddons.map((addon) => (
              <article className="addon-card" key={addon.name}>
                <span className="material-symbols-outlined addon-card__icon" aria-hidden="true">
                  add_circle
                </span>
                <h3>{addon.name}</h3>
                <p>{addon.description}</p>
                <div>
                  <strong>{rupiah.format(addon.price)}</strong>
                  <span>{addon.unit}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-bottom wrap">
        <div>
          <span className="section-kicker">Butuh komposisi berbeda?</span>
          <h2>Susun kebutuhan Anda di kalkulator estimasi.</h2>
          <p>
            Perhitungan interaktif belum diaktifkan. Layar kalkulator dapat ditinjau tanpa mengirim
            data.
          </p>
        </div>
        <Link className="button button--lime" href="/kalkulator">
          Buka kalkulator{' '}
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_forward
          </span>
        </Link>
      </section>
    </>
  )
}
