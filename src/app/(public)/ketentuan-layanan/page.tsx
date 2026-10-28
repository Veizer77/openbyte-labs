export const metadata = {
  title: 'Ketentuan Layanan, SLA & Privasi Data • OpenByte Labs',
  description:
    'Komitmen transparansi kontrak OpenByte Labs. Mengatur hak kepemilikan kode sumber 100%, jaminan SLA, masa garansi 90 hari, dan kepatuhan UU PDP.',
}

export default function TermsPage() {
  const sections = [
    {
      icon: 'verified_user',
      title: '1. Service Level Agreement (SLA) & Garansi Retensi 90 Hari',
      points: [
        'Ketersediaan infrastruktur cloud dan portal produksi ditargetkan pada tingkat ketersediaan 99.9% Uptime.',
        'Masa garansi perbaikan bug dan cacat logika pemrograman berlaku selama 90 hari kalender sejak tanggal penandatanganan Berita Acara Serah Terima (BAST).',
        'Penanganan tiket kritis dengan dampak downtime total memiliki SLA respons maksimal 2 jam dalam jam kerja (WIB).',
      ],
    },
    {
      icon: 'code',
      title: '2. Kepemilikan Hak Cipta & Kode Sumber (Source Code 100%)',
      points: [
        'Seluruh hak cipta intelektual, skema database, repositori git, dan dokumentasi arsitektur diserahkan sepenuhnya kepada klien setelah seluruh kewajiban pembayaran termin diselesaikan.',
        'OpenByte Labs tidak menahan kunci lisensi tersembunyi (no vendor lock-in). Sistem dapat dijalankan mandiri oleh tim internal instansi.',
        'OpenByte Labs berhak mencantumkan nama proyek dan tangkapan layar tampilan antarmuka non-rahasia sebagai portofolio publik, kecuali disepakati Non-Disclosure Agreement (NDA) tertulis.',
      ],
    },
    {
      icon: 'lock',
      title: '3. Kebijakan Kepatuhan Perlindungan Data Pribadi (UU No. 27/2022)',
      points: [
        'Data kependudukan, nomor identitas, riwayat kesehatan, dan transaksi klien diproses menggunakan enkripsi standar industri (AES-256 dan TLS 1.3).',
        'OpenByte Labs bertindak sebagai Pemroses Data (Data Processor) dan tidak pernah menjual, menyewakan, atau membagikan data kepada pihak ketiga.',
        'Seluruh jejak audit perubahan data operasional dicatat secara append-only dan diamankan dari manipulasi sepihak.',
      ],
    },
    {
      icon: 'sync_alt',
      title: '4. Batasan Revisi & Perubahan Ruang Lingkup (Scope Change)',
      points: [
        'Setiap paket layanan memiliki kuota sesi revisi gratis yang tertera secara definitif dalam dokumen Surat Perjanjian Kerja (SPK).',
        'Revisi mencakup penyesuaian tata letak visual, perbaikan teks, dan penyempurnaan alur kerja dalam lingkup fungsionalitas yang telah disepakati.',
        'Permintaan fitur baru di luar spesifikasi awal (Scope Creep) akan diproses melalui addendum kontrak dengan estimasi biaya dan waktu tambahan yang disepakati bersama.',
      ],
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Dark */}
      <section className="bg-[#18181a] px-6 py-16 text-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex max-w-3xl flex-col gap-4">
            <div className="flex items-center gap-2 rounded-full bg-[#d2d88f]/10 px-3 py-1 w-fit">
              <span className="h-2 w-2 rounded-full bg-[#d2d88f]"></span>
              <span className="text-[11px] font-bold tracking-wider text-[#d2d88f] uppercase">
                Legalitas, SLA & Privasi Data
              </span>
            </div>
            <h1 className="text-[34px] font-bold tracking-tight text-white sm:text-[40px]">
              Ketentuan Layanan, SLA & Tata Kelola Rekayasa
            </h1>
            <p className="text-[15px] leading-relaxed text-[#a1a1aa]">
              Komitmen transparansi kontrak OpenByte Labs. Mengatur hak kepemilikan kode sumber 100%, jaminan SLA 99.9%, masa retensi garansi 90 hari, serta kepatuhan UU Perlindungan Data Pribadi (UU No. 27 Tahun 2022).
            </p>
          </div>
        </div>
      </section>

      {/* Konten Legal */}
      <section className="mx-auto max-w-[1440px] px-6 py-12">
        <div className="flex flex-col gap-8">
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-4 rounded-2xl border border-[#eaeaea] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0f0f0] text-[#18181a]">
                  <span className="material-symbols-outlined text-[20px]">{sec.icon}</span>
                </div>
                <h2 className="text-[18px] font-bold text-[#18181a]">{sec.title}</h2>
              </div>

              <div className="flex flex-col gap-3 pl-12">
                {sec.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5 text-[18px] text-[#82b440]">
                      check_circle
                    </span>
                    <p className="text-[14px] leading-relaxed text-[#52525b]">{pt}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-[#f0f0f0] p-6 text-[13px] text-[#71717a]">
          Dokumen ketentuan layanan ini berlaku efektif untuk seluruh proyek per 2026. Untuk pertanyaan legal spesifik atau penyusunan klausul NDA instansi khusus, silakan menghubungi tim legal kami melalui jalur resmi.
        </div>
      </section>
    </div>
  )
}
