import Link from 'next/link'

export const metadata = {
  title: 'Tentang Kami & Prinsip Rekayasa • OpenByte Labs',
  description:
    'Profil studio rekayasa perangkat lunak independen OpenByte Labs, metodologi kerja, dan tim inti arsitektur sistem.',
}

export default function AboutPage() {
  const principles = [
    {
      icon: 'architecture',
      title: 'Arsitektur Modular',
      desc: 'Sistem dibangun modular agar mudah dimigrasi, dites, dan diskalakan tanpa ketergantungan vendor tunggal.',
    },
    {
      icon: 'verified_user',
      title: 'Security by Design',
      desc: 'Sanitasi input, hashing kriptografis, dan audit trail mutasi data aktif sejak baris kode pertama ditulis.',
    },
    {
      icon: 'visibility',
      title: 'Transparansi Penuh',
      desc: 'Klien memantau progres staging, changelog commit, dan dokumen BAST secara berkala pada setiap tahap deliverable.',
    },
    {
      icon: 'handshake',
      title: '90 Hari Garansi SLA',
      desc: 'Dukungan perbaikan bug tanpa biaya tambahan selama 90 hari paska serah terima resmi (BAST).',
    },
  ]

  const methodology = [
    {
      step: '01',
      title: 'Blueprint & Arsitektur',
      desc: 'Spesifikasi SRS, ERD, dan skema database disepakati secara definitif sebelum proses coding dimulai.',
    },
    {
      step: '02',
      title: 'Sprint Iteratif 2-Mingguan',
      desc: 'Rilis staging terisolasi tiap akhir sprint untuk pengujian langsung oleh pihak instansi/klien.',
    },
    {
      step: '03',
      title: 'Audit & Penetration Test',
      desc: 'Pengujian kerentanan OWASP dan validasi beban stress test sebelum rilis produksi publik.',
    },
    {
      step: '04',
      title: 'BAST & Garansi 90 Hari',
      desc: 'Penandatanganan serah terima resmi, transfer kode repositori penuh, dan masa retensi garansi SLA.',
    },
  ]

  const team = [
    {
      initial: 'M',
      name: 'Muhammad Izzat Farahidi',
      role: 'Principal Architect & Lead Engineer',
      desc: 'Spesialis arsitektur sistem data terdistribusi, Next.js, Flutter, dan PostgreSQL.',
    },
    {
      initial: 'R',
      name: 'Raden Arya Pratama, S.T.',
      role: 'Lead Spatial & GIS Specialist',
      desc: 'Spesialis topologi PostGIS, geospasial pemetaan desa, dan engine Mapbox.',
    },
    {
      initial: 'F',
      name: 'Faisal Akbar, S.Kom',
      role: 'DevOps & Cloud Security',
      desc: 'Spesialis containerization Docker, Cloudflare Zero Trust, dan automasi CI/CD.',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Dark Obsidian */}
      <section className="bg-[#18181a] px-6 py-16 text-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex max-w-3xl flex-col gap-4">
            <div className="flex items-center gap-2 rounded-full bg-[#d2d88f]/10 px-3 py-1 w-fit">
              <span className="h-2 w-2 rounded-full bg-[#d2d88f]"></span>
              <span className="text-[11px] font-bold tracking-wider text-[#d2d88f] uppercase">
                Profil Studio & Prinsip Rekayasa
              </span>
            </div>
            <h1 className="text-[36px] font-bold tracking-tight text-white sm:text-[44px]">
              Rekayasa Perangkat Lunak Presisi Tinggi untuk Sektor Strategis
            </h1>
            <p className="text-[15px] leading-relaxed text-[#a1a1aa]">
              OpenByte Labs adalah studio rekayasa perangkat lunak independen yang mengkhususkan diri pada portal web terdistribusi, sistem informasi geospasial (WebGIS), serta integritas data instansi pemerintah dan enterprise di Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Prinsip Fundamental */}
      <section className="mx-auto max-w-[1440px] px-6 py-14">
        <div className="flex flex-col gap-6">
          <span className="text-[12px] font-bold tracking-wider text-[#71717a] uppercase">
            4 Prinsip Fundamental Kami
          </span>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((pr, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2.5 rounded-xl border border-[#eaeaea] bg-[#f9f9fb] p-5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[24px] text-[#18181a]">
                  {pr.icon}
                </span>
                <h3 className="text-[16px] font-bold text-[#18181a]">{pr.title}</h3>
                <p className="text-[13px] leading-relaxed text-[#52525b]">{pr.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alur Kerja & Metodologi */}
      <section className="border-t border-[#eaeaea] bg-white px-6 py-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-6">
            <span className="text-[12px] font-bold tracking-wider text-[#71717a] uppercase">
              Alur Kerja & Metodologi Rekayasa
            </span>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {methodology.map((m, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-sm"
                >
                  <span className="text-[28px] font-black text-[#82b440]">{m.step}</span>
                  <h3 className="text-[15px] font-bold text-[#18181a]">{m.title}</h3>
                  <p className="text-[13px] leading-relaxed text-[#52525b]">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tim Inti */}
      <section className="border-t border-[#eaeaea] bg-[#f9f9fb] px-6 py-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-6">
            <span className="text-[12px] font-bold tracking-wider text-[#71717a] uppercase">
              Tim Inti Rekayasa
            </span>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {team.map((t, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2.5 rounded-xl border border-[#eaeaea] bg-white p-6 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#18181a] text-[18px] font-bold text-[#d2d88f]">
                    {t.initial}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#18181a]">{t.name}</h3>
                    <div className="text-[12px] font-semibold text-[#82b440]">{t.role}</div>
                  </div>
                  <p className="text-[12px] text-[#71717a]">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[#eaeaea] bg-white px-6 py-12 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
          <h2 className="text-[24px] font-bold text-[#18181a]">
            Siap Membangun Sistem Presisi Anda?
          </h2>
          <p className="text-[14px] text-[#52525b]">
            Konsultasikan rencana digitalisasi instansi atau bisnis Anda langsung bersama tim arsitek kami.
          </p>
          <Link
            href="/layanan"
            className="flex items-center gap-2 rounded-xl bg-[#18181a] px-6 py-3 text-[13px] font-semibold text-white hover:bg-[#242427]"
          >
            <span>Mulai Konsultasi</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
