import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Portofolio Sistem & Rekayasa Perangkat Lunak • OpenByte Labs',
  description:
    'Eksplorasi kurasi arsitektur modular, platform geospasial desa, utilitas publik mandiri, hingga sistem klinis berstandar WHO.',
}

export default function PortfolioPage() {
  const projects = [
    {
      title: 'SINDUKSADATI — Satu Data Desa',
      category: 'PEMERINTAHAN PUBLIK & GEOSPASIAL',
      tag: 'Web & Geospasial',
      description:
        'Sistem informasi tata kelola kependudukan terpadu, pemetaan batas wilayah desa berbasis GIS, dan otomasi persuratan digital berstempel barcode terenkripsi.',
      status: 'Live in Production',
      metrics: '4,850+ Warga Terdata',
      image: '/images/f40eddcc52e0adef.jpg',
      slug: 'sinduksadati',
      tech: ['Next.js', 'PostgreSQL', 'GIS Mapbox', 'Better Auth'],
    },
    {
      title: 'SIPANDU — Rekam Medis Anak & Kader',
      category: 'LAYANAN KESEHATAN MASYARAKAT',
      tag: 'Mobile App',
      description:
        'Aplikasi pencatatan kurva tumbuh kembang balita sesuai standar WHO dengan kapabilitas offline-first otomatis untuk daerah tanpa sinyal internet.',
      status: '12 Posyandu Aktif',
      metrics: 'Zero Data Loss',
      image: '/images/6e9d8c47439268a8.jpg',
      slug: 'sipandu',
      tech: ['Flutter', 'SQLite Sync', 'FastAPI', 'Docker'],
    },
    {
      title: 'HIPPAM — Smart Water Meter & Billing',
      category: 'UTILITAS PUBLIK & OTOMASI',
      tag: 'IoT & Web App',
      description:
        'Sistem monitoring konsumsi air bersih swadaya, pencatatan meteran digital terintegrasi WhatsApp bot, dan manajemen invoice tagihan warga terotomasi.',
      status: '1,200+ Pelanggan',
      metrics: '99.4% Pembayaran Tepat Waktu',
      image: '/images/34c0bcdeb733122c.jpg',
      slug: 'hippam',
      tech: ['React', 'Node.js', 'WhatsApp Gateway', 'PostgreSQL'],
    },
    {
      title: 'EduCare — Portal Akademik Presisi',
      category: 'PENDIDIKAN & KAMPUS',
      tag: 'Enterprise Web',
      description:
        'Platform manajemen nilai akademik, presensi QR dynamic time-based, dan portal pengarsipan skripsi digital yang tahan beban lonjakan trafik KRS.',
      status: '15,000+ Mahasiswa',
      metrics: '3.2x Kecepatan Akses',
      image: '/images/79a2a220f9d6cba2.jpg',
      slug: 'educare',
      tech: ['Next.js', 'Tailwind', 'Redis Cache', 'PostgreSQL'],
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-10">
      {/* Header Halaman */}
      <div className="flex flex-col gap-5 border-b border-[#eaeaea] pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <div className="flex items-center gap-2 rounded-full bg-[#f0f0f0] px-3 py-1 w-fit">
            <span className="h-2 w-2 rounded-full bg-[#82b440]"></span>
            <span className="text-[11px] font-semibold tracking-wider text-[#52525b] uppercase">
              Production-Grade Architecture
            </span>
          </div>
          <h1 className="text-[32px] font-semibold tracking-tight text-[#18181a] sm:text-[38px]">
            Portofolio Sistem & Rekayasa Perangkat Lunak
          </h1>
          <p className="text-[14px] leading-relaxed text-[#52525b]">
            Eksplorasi kurasi arsitektur modular, platform geospasial desa, utilitas publik mandiri, hingga sistem klinis berstandar WHO. Setiap implementasi dirancang dengan efisiensi performa tinggi, ketahanan data, dan pengalaman pengguna presisi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#eaeaea] bg-white p-3 shadow-sm">
            <div className="text-[11px] font-medium text-[#71717a]">Total Pengguna Aktif</div>
            <div className="text-[18px] font-bold text-[#18181a]">21,000+</div>
          </div>
          <div className="rounded-xl border border-[#eaeaea] bg-white p-3 shadow-sm">
            <div className="text-[11px] font-medium text-[#71717a]">Integritas Data</div>
            <div className="text-[18px] font-bold text-[#82b440]">100%</div>
          </div>
        </div>
      </div>

      {/* Grid Portofolio */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((p) => (
          <div
            key={p.slug}
            className="flex flex-col overflow-hidden rounded-2xl border border-[#eaeaea] bg-white shadow-sm transition-all hover:border-[#d2d88f] hover:shadow-md"
          >
            <div className="relative h-[260px] w-full overflow-hidden bg-[#f0f0f0]">
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 left-4 rounded-full bg-[#18181a]/80 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                {p.tag}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold tracking-wider text-[#71717a] uppercase">
                  {p.category}
                </span>
                <h2 className="text-[20px] font-semibold text-[#18181a]">
                  {p.title}
                </h2>
                <p className="text-[13px] leading-relaxed text-[#52525b]">
                  {p.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-[#f0f0f0] px-2.5 py-1 text-[11px] font-medium text-[#52525b]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#eaeaea] pt-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#82b440]"></span>
                  <span className="text-[12px] font-medium text-[#82b440]">{p.status}</span>
                </div>
                <Link
                  href={`/portofolio/${p.slug}`}
                  className="flex items-center gap-1.5 rounded-lg bg-[#18181a] px-3.5 py-1.5 text-[12px] font-medium text-white hover:bg-[#242427]"
                >
                  <span>Baca Studi Kasus</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
