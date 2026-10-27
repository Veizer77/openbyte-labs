import Link from 'next/link'
import { PackageCard } from '@/components/public/package-card'
import { formatRupiah } from '@/lib/format'
import type { AddonDto, PackageDto } from '@/lib/content/types'

const BILLING_LABEL: Record<AddonDto['billingType'], string> = {
  one_time: 'sekali bayar',
  monthly: 'per bulan',
  yearly: 'per tahun',
}

/** Halaman paket (F3-03). Jumlah kartu bebas mengikuti data aktif di CMS. */
export function PackagesView({
  packages,
  addons,
}: {
  packages: PackageDto[]
  addons: AddonDto[]
}) {
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
          {packages.length ? (
            <div className="package-grid">
              {packages.map((servicePackage) => (
                <PackageCard key={servicePackage.slug} servicePackage={servicePackage} />
              ))}
            </div>
          ) : (
            <p className="projects-empty" role="status">
              Belum ada paket aktif yang ditampilkan.
            </p>
          )}
        </div>
      </section>

      {addons.length ? (
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
              {addons.map((addon) => (
                <article className="addon-card" key={addon.name}>
                  <span className="material-symbols-outlined addon-card__icon" aria-hidden="true">
                    add_circle
                  </span>
                  <h3>{addon.name}</h3>
                  {addon.description ? <p>{addon.description}</p> : null}
                  <div>
                    <strong>{formatRupiah(addon.price)}</strong>
                    <span>{BILLING_LABEL[addon.billingType]}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
