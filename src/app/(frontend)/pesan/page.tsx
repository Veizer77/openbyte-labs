import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { servicePackages } from '@/lib/public-content'

type OrderPageProps = { searchParams: Promise<{ paket?: string }> }

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export const metadata: Metadata = {
  title: 'Pemesanan Paket',
  description: 'Tinjau paket layanan sebelum pemesanan OpenByte Labs tersedia.',
  robots: { index: false, follow: false },
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const { paket } = await searchParams
  const selectedPackage = servicePackages.find((item) => item.slug === paket)

  if (!selectedPackage) notFound()

  return (
    <>
      <section className="page-hero page-hero--compact wrap" aria-labelledby="order-title">
        <span className="section-kicker">Pemesanan paket</span>
        <h1 id="order-title">Tinjau kebutuhan proyek Anda.</h1>
        <p>
          Halaman ini adalah pratinjau alur pemesanan. Formulir belum menerima atau mengirim data.
        </p>
      </section>

      <section className="order-section section--subtle">
        <div className="wrap order-layout">
          <article className="order-package">
            <span className="section-kicker">Paket yang dipilih</span>
            <h2>{selectedPackage.name}</h2>
            <p>{selectedPackage.description}</p>
            <div className="order-package__price">
              <strong>{rupiah.format(selectedPackage.price)}</strong>
              <span>harga paket awal</span>
            </div>
            <dl className="order-facts">
              <div>
                <dt>Durasi awal</dt>
                <dd>{selectedPackage.durationDays} hari kerja</dd>
              </div>
              <div>
                <dt>Revisi termasuk</dt>
                <dd>{selectedPackage.revisions}x</dd>
              </div>
              <div>
                <dt>Revisi tambahan</dt>
                <dd>{rupiah.format(selectedPackage.extraRevisionPrice)}</dd>
              </div>
            </dl>
            <ul className="order-feature-list">
              {selectedPackage.features.map((feature) => (
                <li key={feature}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    check
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link className="text-link" href="/paket">
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_back
              </span>{' '}
              Kembali ke daftar paket
            </Link>
          </article>

          <section className="order-form-preview" aria-labelledby="order-form-title">
            <div className="preview-status">
              <span className="material-symbols-outlined" aria-hidden="true">
                visibility
              </span>{' '}
              Pratinjau formulir
            </div>
            <h2 id="order-form-title">Ceritakan kebutuhan Anda.</h2>
            <p className="order-form-preview__intro">
              Bagian ini menunjukkan alur yang akan tersedia setelah integrasi formulir diaktifkan.
            </p>
            <form>
              <label>
                Nama
                <input disabled placeholder="Nama lengkap" />
              </label>
              <div className="form-row">
                <label>
                  WhatsApp
                  <input disabled placeholder="08xxxxxxxxxx" />
                </label>
                <label>
                  Email <span>(opsional)</span>
                  <input disabled placeholder="nama@email.com" />
                </label>
              </div>
              <label>
                Instansi atau bisnis
                <input disabled placeholder="Nama instansi atau bisnis" />
              </label>
              <label>
                Ringkasan kebutuhan
                <textarea disabled placeholder="Ceritakan kebutuhan proyek Anda" rows={4} />
              </label>
              <label className="consent-preview">
                <input type="checkbox" disabled />
                <span>Saya menyetujui pemrosesan data sesuai Kebijakan Privasi.</span>
              </label>
              <button className="button button--dark order-submit" disabled type="button">
                Pemesanan belum tersedia
              </button>
            </form>
            <p className="form-preview-notice" role="status">
              Belum ada data yang dikirim. Paket dan harga ini merupakan daftar awal, konfirmasi
              akhir dilakukan setelah konsultasi.
            </p>
          </section>
        </div>
      </section>
    </>
  )
}
