import Link from 'next/link'

export function ServicesGrid() {
  const services = [
    {
      title: 'Sistem Informasi & Satu Data',
      category: 'Enterprise & Sektor Publik',
      description:
        'Platform tata kelola data instansi, sensus kependudukan terpadu, dan otomasi persuratan digital berstempel barcode aman terenkripsi.',
      icon: 'dataset',
      highlight: false,
      span: 'lg:col-span-7',
      slug: 'sistem-informasi-satu-data',
    },
    {
      title: 'Aplikasi Mobile Lintas Platform',
      category: 'iOS & Android',
      description:
        'Aplikasi Flutter native dengan sinkronisasi offline-first otomatis. Produktif mencatat dan mengolah data tanpa ketergantungan sinyal.',
      icon: 'phone_iphone',
      highlight: false,
      span: 'lg:col-span-5',
      slug: 'aplikasi-mobile-lintas-platform',
    },
    {
      title: 'Website & Web App Bisnis',
      category: 'Bisnis & Komersial',
      description:
        'Portal web berperforma super cepat dengan skor Lighthouse 100/100, SEO modern, dan alur konversi langsung terhubung WhatsApp.',
      icon: 'speed',
      highlight: false,
      span: 'lg:col-span-5',
      slug: 'website-web-app-bisnis',
    },
    {
      title: 'Sistem Kustom & Event Interaktif',
      category: 'Interaktif & Real-time',
      description:
        'Microsite kustom dengan visual interaktif, sistem check-in barcode real-time, dan otomasi database tersinkronisasi cepat.',
      icon: 'code',
      highlight: true,
      span: 'lg:col-span-7',
      slug: 'sistem-kustom-event-interaktif',
    },
  ]

  return (
    <section className="mx-auto max-w-[1440px] px-6 py-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold tracking-wider text-[#71717a] uppercase">
            Katalog Rekayasa & Eksekusi
          </span>
          <h2 className="text-[26px] font-semibold tracking-tight text-[#18181a] sm:text-[30px]">
            Layanan Unggulan Berstandar Industri
          </h2>
        </div>
        <p className="max-w-md text-[13px] leading-relaxed text-[#52525b]">
          Dirancang dari fondasi arsitektur bersih, keamanan role-based bertingkat, serta dokumentasi API modular yang siap diaudit.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {services.map((item) => (
          <div
            key={item.slug}
            className={`flex flex-col justify-between rounded-2xl border border-[#eaeaea] bg-white p-6 shadow-sm transition-all hover:border-[#d2d88f] ${item.span}`}
          >
            <div className="flex flex-col gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  item.highlight ? 'bg-[#d2d88f]' : 'bg-[#f0f0f0]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    item.highlight ? 'text-[#18181a]' : 'text-[#18181a]'
                  }`}
                >
                  {item.icon}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[18px] font-semibold tracking-tight text-[#18181a]">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[#52525b]">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#eaeaea] pt-4">
              <span className="text-[11px] font-medium text-[#71717a]">
                {item.category}
              </span>
              <Link
                href="/layanan"
                className="flex items-center gap-1 text-[13px] font-semibold text-[#18181a] hover:text-[#5d6226]"
              >
                <span>Pelajari Solusi</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
