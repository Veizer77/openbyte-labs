import Link from 'next/link'
import Image from 'next/image'

export function PortfolioShowcase() {
  const projects = [
    {
      title: 'SINDUKSADATI — Satu Data Desa',
      category: 'PEMERINTAHAN PUBLIK',
      description:
        'Digitalisasi kependudukan dan persuratan digital berstempel QR dinamis dengan enkripsi keamanan terverifikasi.',
      status: 'Live in Production',
      image: '/images/f40eddcc52e0adef.jpg',
      slug: 'sinduksadati',
    },
    {
      title: 'SIPANDU — Rekam Medis Anak',
      category: 'LAYANAN KESEHATAN',
      description:
        'Aplikasi pencatatan kurva WHO offline-first untuk operasional kader posyandu tanpa jaringan internet.',
      status: '12 Posyandu Aktif',
      image: '/images/6e9d8c47439268a8.jpg',
      slug: 'sipandu',
    },
    {
      title: 'HIPPAM — Smart Water Meter',
      category: 'UTILITAS & BILLING',
      description:
        'Sistem audit meter air dan otomasi tagihan berjadwal dengan integrasi WhatsApp notifikasi langsung ke warga.',
      status: '1,200+ Pelanggan',
      image: '/images/34c0bcdeb733122c.jpg',
      slug: 'hippam',
    },
  ]

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold tracking-wider text-[#71717a] uppercase">
            Studi Kasus Produksi
          </span>
          <h2 className="text-[26px] font-semibold tracking-tight text-[#18181a] sm:text-[30px]">
            Proyek Pilihan & Implementasi Nyata
          </h2>
        </div>
        <Link
          href="/portofolio"
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#18181a] hover:text-[#5d6226]"
        >
          <span>Buka Semua Studi Kasus</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {projects.map((p) => (
          <div
            key={p.slug}
            className="flex flex-col overflow-hidden rounded-2xl border border-[#eaeaea] bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative h-[200px] w-full overflow-hidden bg-[#f0f0f0]">
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-medium tracking-wider text-[#71717a] uppercase">
                  {p.category}
                </span>
                <h3 className="text-[17px] font-semibold text-[#18181a]">
                  {p.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[#52525b]">
                  {p.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#eaeaea] pt-4">
                <span className="text-[11px] font-semibold text-[#82b440]">
                  {p.status}
                </span>
                <Link
                  href={`/portofolio/${p.slug}`}
                  className="flex items-center gap-1 text-[13px] font-medium text-[#18181a] hover:text-[#5d6226]"
                >
                  <span>Studi Kasus</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
