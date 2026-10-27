import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Konsultasi Proyek',
  description: 'Pratinjau alur booking konsultasi proyek OpenByte Labs.',
  alternates: { canonical: '/konsultasi' },
}

export default function ConsultationPage() {
  return (
    <>
      <section className="page-hero consultation-hero wrap" aria-labelledby="consultation-title">
        <div>
          <span className="section-kicker">Diskusi kebutuhan</span>
          <h1 id="consultation-title">Jadwalkan sesi konsultasi teknis.</h1>
          <p>
            Pilih waktu yang sesuai dan siapkan gambaran kebutuhan Anda. Pemilihan slot akan aktif
            setelah jadwal tersedia terhubung.
          </p>
        </div>
        <div className="consultation-hero__mark" aria-hidden="true">
          <span className="material-symbols-outlined">calendar_month</span>
          <span>WIB</span>
        </div>
      </section>

      <section
        className="consultation-section section--subtle"
        aria-label="Pratinjau booking konsultasi"
      >
        <div className="wrap consultation-layout">
          <div className="consultation-calendar">
            <div className="consultation-calendar__heading">
              <div>
                <span className="section-kicker">Pilih tanggal</span>
                <h2>Jadwal konsultasi</h2>
              </div>
              <span className="timezone-label">
                <span className="material-symbols-outlined" aria-hidden="true">
                  schedule
                </span>{' '}
                WIB
              </span>
            </div>
            <div className="availability-empty" role="status">
              <span className="material-symbols-outlined" aria-hidden="true">
                event_busy
              </span>
              <h3>Jadwal belum tersedia.</h3>
              <p>
                Slot konsultasi akan ditampilkan di sini setelah kalender operasional terhubung.
                Tidak ada tanggal atau jam yang sedang ditawarkan.
              </p>
            </div>
            <div className="availability-legend">
              <span className="material-symbols-outlined" aria-hidden="true">
                info
              </span>
              <small>Kalender dan slot belum terhubung.</small>
            </div>
          </div>

          <section className="consultation-form-preview" aria-labelledby="booking-form-title">
            <div className="preview-status">
              <span className="material-symbols-outlined" aria-hidden="true">
                visibility
              </span>{' '}
              Pratinjau formulir
            </div>
            <h2 id="booking-form-title">Detail konsultasi</h2>
            <p>Kolom pemesanan belum aktif dan tidak menyimpan masukan.</p>
            <form>
              <label>
                Nama
                <input disabled placeholder="Nama lengkap" />
              </label>
              <label>
                WhatsApp
                <input disabled placeholder="08xxxxxxxxxx" />
              </label>
              <label>
                Email <span>(opsional)</span>
                <input disabled placeholder="nama@email.com" />
              </label>
              <label>
                Instansi atau bisnis
                <input disabled placeholder="Nama instansi atau bisnis" />
              </label>
              <label>
                Kategori layanan
                <select disabled defaultValue="">
                  <option value="" disabled>
                    Pilih kategori
                  </option>
                  <option>Website</option>
                  <option>Sistem informasi</option>
                  <option>Aplikasi mobile</option>
                </select>
              </label>
              <fieldset className="meeting-options" disabled>
                <legend>Mode pertemuan</legend>
                <label>
                  <input type="radio" name="mode" /> Google Meet
                </label>
                <label>
                  <input type="radio" name="mode" /> Telepon WhatsApp
                </label>
                <label>
                  <input type="radio" name="mode" /> Tatap muka
                </label>
              </fieldset>
              <label>
                Ringkasan kebutuhan
                <textarea disabled placeholder="Apa yang ingin didiskusikan?" rows={3} />
              </label>
              <label className="consent-preview">
                <input type="checkbox" disabled />
                <span>Saya menyetujui pemrosesan data sesuai Kebijakan Privasi.</span>
              </label>
              <button className="button button--dark order-submit" disabled type="button">
                Jadwal konsultasi belum aktif
              </button>
            </form>
            <p className="form-preview-notice" role="status">
              Formulir dan ketersediaan belum terhubung. Tidak ada booking yang dibuat.
            </p>
          </section>
        </div>
      </section>

      <section className="consultation-help wrap">
        <div>
          <span className="section-kicker">Belum siap booking?</span>
          <h2>Lihat pilihan layanan terlebih dahulu.</h2>
        </div>
        <Link className="button button--light" href="/paket">
          Bandingkan paket
        </Link>
      </section>
    </>
  )
}
