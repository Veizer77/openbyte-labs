import type { Metadata } from 'next'
import Link from 'next/link'
import { calculatorGroups } from '@/lib/public-content'

export const metadata: Metadata = {
  title: 'Kalkulator Estimasi Biaya',
  description: 'Pilih platform dan modul untuk menyiapkan kebutuhan estimasi proyek.',
  alternates: { canonical: '/kalkulator' },
  openGraph: {
    title: 'Kalkulator Estimasi OpenByte Labs',
    description: 'Susun platform dan modul yang diperlukan untuk proyek Anda.',
    type: 'website',
  },
}

export default function CalculatorPage() {
  return (
    <>
      <section className="calculator-intro wrap" aria-labelledby="calculator-title">
        <div className="calculator-intro__status">
          <span className="material-symbols-outlined" aria-hidden="true">
            calculate
          </span>
          Kalkulator estimasi
        </div>
        <span className="section-kicker">Modul kebutuhan proyek</span>
        <h1 id="calculator-title">Kalkulator Estimasi Biaya & Durasi Proyek</h1>
        <p>
          Susun kebutuhan solusi Anda. Hasil kalkulasi dan pengiriman estimasi akan tersedia setelah
          integrasi kalkulator diaktifkan.
        </p>
      </section>

      <section className="calculator-section section--subtle" aria-label="Pilihan kebutuhan proyek">
        <div className="wrap calculator-layout">
          <div className="calculator-options">
            {calculatorGroups.map((group, groupIndex) => (
              <fieldset className="calculator-group" key={group.title}>
                <legend className="calculator-group__heading">
                  <span>{groupIndex + 1}</span>
                  <span>
                    <strong>{group.title}</strong>
                    <small>{group.description}</small>
                  </span>
                  <span className={group.required ? 'required-chip' : 'optional-chip'}>
                    {group.required ? 'Wajib' : 'Opsional'}
                  </span>
                </legend>
                <div className="calculator-choice-grid">
                  {group.options.map((option, optionIndex) => (
                    <label className="calculator-choice" key={option.label}>
                      <input
                        type={group.type}
                        name={`group-${groupIndex}`}
                        value={option.label}
                        defaultChecked={groupIndex === 0 && optionIndex === 0}
                        required={group.required && optionIndex === 0}
                      />
                      <span
                        className="calculator-choice__icon material-symbols-outlined"
                        aria-hidden="true"
                      >
                        {groupIndex === 0 ? 'devices' : groupIndex === 1 ? 'layers' : 'extension'}
                      </span>
                      <span className="calculator-choice__copy">
                        <strong>{option.label}</strong>
                        <small>{option.detail}</small>
                      </span>
                      <span className="calculator-choice__indicator" aria-hidden="true" />
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <div className="calculator-footnote">
              <span className="material-symbols-outlined" aria-hidden="true">
                info
              </span>
              <p>
                Pilihan ini hanya pratinjau antarmuka. Harga belum dihitung, dan tidak ada data yang
                dikirim atau disimpan.
              </p>
            </div>
          </div>

          <aside className="estimate-panel" aria-labelledby="estimate-title">
            <div className="estimate-panel__top">
              <span className="material-symbols-outlined" aria-hidden="true">
                receipt_long
              </span>
              Ringkasan kebutuhan
            </div>
            <h2 id="estimate-title">Estimasi proyek</h2>
            <p className="estimate-panel__intro">
              Pilih platform dan solusi untuk melihat ringkasan saat kalkulator aktif.
            </p>
            <div className="estimate-total">
              <span>Rentang estimasi</span>
              <strong>Belum tersedia</strong>
              <small>Estimasi awal, bukan penawaran final</small>
            </div>
            <div className="estimate-panel__row">
              <span>Durasi pengerjaan</span>
              <strong>Belum tersedia</strong>
            </div>
            <div className="estimate-panel__row">
              <span>Modul dipilih</span>
              <strong>Pratinjau</strong>
            </div>
            <div className="estimate-panel__notice">
              <span className="material-symbols-outlined" aria-hidden="true">
                lock
              </span>
              Kalkulasi dan pengiriman rincian belum diaktifkan.
            </div>
            <button className="button button--dark estimate-submit" type="button" disabled>
              Kirim Rincian Estimasi{' '}
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </button>
            <Link className="estimate-secondary" href="/konsultasi">
              Tanya tentang kebutuhan proyek <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>
      </section>
    </>
  )
}
