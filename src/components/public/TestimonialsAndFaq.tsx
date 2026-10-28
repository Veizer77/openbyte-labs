'use client'

import { useState } from 'react'
import Link from 'next/link'

export function TestimonialsAndFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Bagaimana jaminan keamanan dan kepemilikan kode sumber (source code)?',
      a: 'Seluruh repositori kode sumber, hak cipta intelektual, dan dokumentasi arsitektur diserahkan 100% penuh kepada instansi atau klien setelah Berita Acara Serah Terima (BAST) ditandatangani. Tanpa biaya lisensi tersembunyi.',
    },
    {
      q: 'Apakah sistem dapat beroperasi jika instansi tidak memiliki server lokal fisik?',
      a: 'Tentu. Kami menyediakan arsitektur berbasis cloud serverless atau dedicated VPS tersertifikasi berlatensi rendah (~28ms di Indonesia) yang otomatis di-backup berkala dan dilengkapi perlindungan DDoS.',
    },
    {
      q: 'Berapa lama masa garansi bug dan pendampingan operasional paska rilis?',
      a: 'Setiap proyek dilindungi garansi bebas bug hingga 90 hari paska peluncuran resmi. Kami juga menyediakan masa pendampingan operasional serta pelatihan langsung bagi staf admin pengguna.',
    },
    {
      q: 'Bagaimana mekanisme pelaporan progres pengerjaan proyek?',
      a: 'Kami menerapkan transparansi pengiriman bertahap (milestone-based). Setiap tahap diverifikasi langsung melalui demo runtime terisolasi sebelum masuk ke tahap pengerjaan berikutnya.',
    },
  ]

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Kolom Kiri: Validasi Klien & Testimoni */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#eaeaea] bg-white p-6 shadow-sm lg:col-span-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold tracking-wider text-[#71717a] uppercase">
                Validasi Klien
              </span>
              <h3 className="text-[20px] font-semibold text-[#18181a]">
                Kepercayaan Instansi & Pengelola Sistem
              </h3>
            </div>

            {/* Testimoni 1 */}
            <div className="flex flex-col gap-3 rounded-xl bg-[#f0f0f0] p-4">
              <div className="flex items-center gap-1 text-[#82b440]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[16px]">
                    star
                  </span>
                ))}
              </div>
              <p className="text-[13px] leading-relaxed italic text-[#18181a]">
                “Digitalisasi data penduduk melalui SINDUKSADATI mengubah birokrasi berhari-hari menjadi hitungan menit. Verifikasi barcode pada surat desa membuat pelayanan bebas pungli dan transparan.”
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2e2e2] text-[12px] font-bold text-[#18181a]">
                  KD
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#18181a]">
                    Kepala Urusan Tata Usaha
                  </span>
                  <span className="text-[11px] text-[#52525b]">
                    Instansi Pemerintah Desa Sedati
                  </span>
                </div>
              </div>
            </div>

            {/* Testimoni 2 */}
            <div className="flex flex-col gap-3 rounded-xl bg-[#f0f0f0] p-4">
              <div className="flex items-center gap-1 text-[#82b440]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[16px]">
                    star
                  </span>
                ))}
              </div>
              <p className="text-[13px] leading-relaxed italic text-[#18181a]">
                “Arsitektur offline SIPANDU adalah penyelamat di lokasi puskesmas pembantu tanpa internet. Begitu kader kembali ke balai desa, ribuan rekam data balita tersinkron tanpa konflik data satu pun.”
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2e2e2] text-[12px] font-bold text-[#18181a]">
                  SK
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#18181a]">
                    Koordinator Posyandu Balita
                  </span>
                  <span className="text-[11px] text-[#52525b]">
                    Wilayah Kesehatan Terpadu
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 border-t border-[#eaeaea] pt-4 text-[12px] font-medium text-[#52525b]">
            <span className="material-symbols-outlined text-[18px] text-[#82b440]">verified</span>
            <span>Surat Kepuasan Pekerjaan & BAST Resmi Tersedia</span>
          </div>
        </div>

        {/* Kolom Kanan: Pertanyaan Umum (FAQ Accordion) */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#eaeaea] bg-white p-6 shadow-sm lg:col-span-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold tracking-wider text-[#71717a] uppercase">
                Pertanyaan Umum
              </span>
              <h3 className="text-[20px] font-semibold text-[#18181a]">
                Transparansi Alur Kerja & Garansi Sistem
              </h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl bg-[#f0f0f0] transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="flex w-full items-center justify-between p-4 text-left cursor-pointer"
                  >
                    <span className="text-[13px] font-semibold text-[#18181a]">
                      {faq.q}
                    </span>
                    <span
                      className={`material-symbols-outlined text-[20px] text-[#52525b] transition-transform ${
                        openIndex === idx ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {openIndex === idx && (
                    <div className="border-t border-[#eaeaea] px-4 pb-4 pt-3 text-[13px] leading-relaxed text-[#52525b]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prompt Tanya Langsung */}
          <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-xl bg-[#f0f0f0] p-4 sm:flex-row sm:items-center">
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#18181a]">
                Ada pertanyaan teknis spesifik?
              </span>
              <span className="text-[11px] text-[#52525b]">
                Konsultasikan kebutuhan arsitektur Anda langsung bersama Engineer.
              </span>
            </div>
            <Link
              href="/layanan"
              className="rounded-lg bg-[#18181a] px-3.5 py-2 text-[12px] font-medium text-white hover:bg-[#242427]"
            >
              Jadwalkan Diskusi
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
