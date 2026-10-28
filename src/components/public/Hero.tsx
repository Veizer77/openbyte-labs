import Link from 'next/link'

export function Hero() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Kartu Kiri (Kanvas Terang) */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#eaeaea] bg-white p-6 shadow-sm lg:col-span-7">
          <div className="flex flex-col gap-5">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f0f0f0] px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-[#82b440]"></span>
              <span className="text-[11px] font-medium tracking-wider text-[#52525b] uppercase">
                OpenByte • Enterprise Digital Systems
              </span>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-3">
              <h1 className="text-[32px] font-semibold tracking-tight text-[#18181a] sm:text-[38px] sm:leading-[1.15]">
                Rekayasa Perangkat Lunak & Sistem Presisi Tinggi
              </h1>
              <p className="max-w-2xl text-[15px] leading-relaxed text-[#52525b]">
                Membangun arsitektur web dan mobile modern untuk instansi dan bisnis. Skalabilitas tinggi, performa tanpa kompromi, dan jaminan kode produksi yang siap diaudit.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/layanan"
                className="flex items-center gap-2 rounded-xl bg-[#18181a] px-6 py-3 text-[13px] font-medium text-white shadow-sm hover:bg-[#242427]"
              >
                <span>Konsultasi Proyek</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-[#eaeaea] bg-white px-5 py-3 text-[13px] font-medium text-[#18181a] shadow-sm hover:bg-[#f9f9f9]"
              >
                <span className="material-symbols-outlined text-[16px] text-[#82b440]">chat</span>
                <span>WhatsApp Direct</span>
              </a>
            </div>
          </div>

          {/* Metric Bar */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#eaeaea] pt-5">
            <div className="rounded-xl bg-[#f0f0f0] p-3">
              <div className="text-[11px] font-medium text-[#52525b]">Ketersediaan Sistem</div>
              <div className="text-[16px] font-bold text-[#82b440]">99.8% Uptime</div>
            </div>
            <div className="rounded-xl bg-[#f0f0f0] p-3">
              <div className="text-[11px] font-medium text-[#52525b]">Penyelesaian Proyek</div>
              <div className="text-[16px] font-bold text-[#18181a]">100% On-Time</div>
            </div>
            <div className="rounded-xl bg-[#f0f0f0] p-3">
              <div className="text-[11px] font-medium text-[#52525b]">Integritas Data</div>
              <div className="text-[16px] font-bold text-[#18181a]">Zero Data Loss</div>
            </div>
          </div>
        </div>

        {/* Kartu Kanan (Kontainer Obsidian #18181a) */}
        <div className="flex flex-col justify-between rounded-2xl bg-[#18181a] p-6 text-white shadow-lg lg:col-span-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#d2d88f]">dns</span>
                <span className="text-[11px] font-medium tracking-wider text-[#a8a8ad] uppercase">
                  Live Architecture Node
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[#242427] px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#82b440]"></span>
                <span className="text-[11px] text-[#a8a8ad]">Operational</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-[18px] font-semibold text-white">
                Arsitektur & Performa Terpantau
              </h3>
              <p className="text-[12px] leading-relaxed text-[#a8a8ad]">
                Metrik latensi dan infrastruktur cloud terisolasi dengan jaminan zero downtime deployment.
              </p>
            </div>

            {/* Sub-metrik Latensi */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-[#242427] p-3">
                <div className="text-[11px] text-[#a8a8ad]">Rata-rata Latensi</div>
                <div className="text-[16px] font-semibold text-[#82b440]">~28ms avg</div>
              </div>
              <div className="rounded-xl bg-[#242427] p-3">
                <div className="text-[11px] text-[#a8a8ad]">Throughput Kapasitas</div>
                <div className="text-[16px] font-semibold text-[#d2d88f]">4.2k req/s</div>
              </div>
            </div>

            {/* Komponen Sistem Terhubung */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between rounded-lg bg-[#242427] px-3 py-2 text-[12px]">
                <div className="flex items-center gap-2 text-[#a8a8ad]">
                  <span className="material-symbols-outlined text-[14px]">database</span>
                  <span>Database Neon PostgreSQL</span>
                </div>
                <span className="font-medium text-[#82b440]">Active Sync</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[#242427] px-3 py-2 text-[12px]">
                <div className="flex items-center gap-2 text-[#a8a8ad]">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>Better Auth 2FA TOTP</span>
                </div>
                <span className="font-medium text-[#82b440]">Enforced</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[#2e2e32] pt-4 text-[11px] text-[#a8a8ad]">
            <span>Sistem Terverifikasi OpenByte</span>
            <span className="font-mono text-[#d2d88f]">TLS 1.3 • AES-256</span>
          </div>
        </div>
      </div>
    </section>
  )
}
