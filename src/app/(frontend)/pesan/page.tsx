import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPackageBySlug } from '@/server/content'
import { formatRupiah } from '@/lib/format'

type OrderPageProps = { searchParams: Promise<{ paket?: string }> }

export const metadata: Metadata = {
  title: 'Pemesanan Paket',
  description: 'Tinjau paket layanan sebelum pemesanan OpenByte Labs tersedia.',
  robots: { index: false, follow: false },
}

/**
 * Halaman pemesanan paket (F3-03).
 *
 * Paket dibaca ulang dari CMS memakai slug, sehingga paket nonaktif atau tidak
 * ada berakhir 404 — bukan menampilkan data lama. Formulir masih nonaktif
 * sampai F4-04 menyelesaikan Server Action inquiry.
 */
export default async function OrderPage({ searchParams }: OrderPageProps) {
  const { paket } = await searchParams

  if (!paket) {
    return (
      <section className="page-hero page-hero--compact wrap" aria-labelledby="order-title">
        <span className="section-kicker">Pemesanan paket</span>
        <h1 id="order-title">Pilih paket terlebih dahulu.</h1>
        <p>Halaman ini memerlukan pilihan paket. Buka daftar paket untuk memilih salah satu.</p>
        <p>
          <Link className="text-link" href="/paket">
            Lihat daftar paket{' '}
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </p>
      </section>
    )
  }

  const selectedPackage = await getPackageBySlug(paket)
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
            {selectedPackage.categoryName ? <p>{selectedPackage.categoryName}</p> : null}
            <div className="order-package__price">
              <strong>{formatRupiah(selectedPackage.price)}</strong>
              {selectedPackage.originalPrice ? (
                <s>{formatRupiah(selectedPackage.originalPrice)}</s>
              ) : null}
              <span>harga paket</span>
            </div>
            <dl className="order-facts">
              {selectedPackage.estimatedDays ? (
                <div>
                  <dt>Durasi awal</dt>
                  <dd>{selectedPackage.estimatedDays} hari kerja</dd>
                </div>
              ) : null}
              <div>
                <dt>Revisi termasuk</dt>
                <dd>{selectedPackage.includedRevisions}x</dd>
              </div>
              {selectedPackage.extraRevisionPrice ? (
                <div>
                  <dt>Revisi tambahan</dt>
                  <dd>{formatRupiah(selectedPackage.extraRevisionPrice)}</dd>
                </div>
              ) : null}
            </dl>
            {selectedPackage.features.length ? (
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
            ) : null}
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
              Belum ada data yang dikirim. Konfirmasi akhir dilakukan setelah konsultasi.
            </p>
          </section>
        </div>
      </section>
    </>
  )
}
