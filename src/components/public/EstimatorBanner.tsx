import Link from 'next/link'

export function EstimatorBanner() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-6">
      <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl bg-[#e2e89d] p-8 shadow-sm lg:flex-row lg:items-center">
        {/* Konten Kiri */}
        <div className="flex max-w-2xl flex-col gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-[#1b1d00]/10 px-3 py-1 w-fit">
            <span className="material-symbols-outlined text-[16px] text-[#1b1d00]">calculate</span>
            <span className="text-[11px] font-bold tracking-wider text-[#1b1d00] uppercase">
              Estimasi Anggaran Transparan
            </span>
          </div>
          <h3 className="text-[24px] font-bold tracking-tight text-[#1b1d00] sm:text-[28px]">
            Rencanakan Kebutuhan Sistem Anda Tanpa Estimasi Ambigu.
          </h3>
          <p className="text-[14px] leading-relaxed text-[#1b1d00]/80">
            Gunakan simulasi interaktif kami untuk memilih modul data, kapabilitas offline, integrasi API pihak ketiga, dan dapatkan ringkasan spesifikasi teknis beserta estimasi timeline siap cetak.
          </p>
        </div>

        {/* Aksi Kanan */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-white/90 px-4 py-2.5 text-center shadow-sm backdrop-blur-sm">
            <div className="text-[11px] font-medium text-[#52525b]">Waktu Estimasi</div>
            <div className="text-[15px] font-bold text-[#18181a]">2 Menit Selesai</div>
          </div>
          <Link
            href="/layanan"
            className="flex items-center gap-2 rounded-xl bg-[#18181a] px-6 py-3.5 text-[13px] font-semibold text-white shadow-md hover:bg-[#242427]"
          >
            <span>Mulai Konsultasi & Estimasi</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
