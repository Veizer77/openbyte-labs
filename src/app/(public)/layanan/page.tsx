export const metadata = {
  title: 'Pilihan Paket Layanan & Investasi Sistem • OpenByte Labs',
  description:
    'Transparansi spesifikasi teknis, jangka waktu kerja terjamin, serta kuota revisi definitif tanpa biaya tersembunyi.',
}

export default function ServicesPricingPage() {
  const packages = [
    {
      tier: 'TIER 01 • WEB PRESENTASI',
      name: 'Starter UMKM & Bisnis',
      timeline: 'Estimasi 7 Hari',
      price: '1.000.000',
      description: 'Landing page konversi tinggi dengan arsitektur modern & loading sub-detik.',
      subtitle: 'Investasi awal • One-time payment',
      revisions: '2x Sesi',
      extraRevision: 'Rp 100.000/sesi',
      features: [
        'Landing page / profil instansi hingga 5 halaman modular',
        'Desain responsif mobile-first & ultra-fast Core Web Vitals',
        'Integrasi tombol interaktif WhatsApp Direct order router',
        'SEO on-page dasar (Schema JSON-LD, OpenGraph, Sitemap)',
        'Setup domain, DNS management, & SSL Cloudflare',
      ],
      popular: false,
      cta: 'Pilih Paket Starter',
    },
    {
      tier: 'TIER 02 • SISTEM INFORMASI',
      name: 'Sistem Informasi / Instansi',
      timeline: 'Estimasi 21 Hari',
      price: '3.500.000',
      description: 'Solusi operasional otomatis, basis data relasional stabil, dan kontrol akses berjenjang.',
      subtitle: 'Direkomendasikan untuk Efisiensi Bisnis',
      revisions: '3x Sesi Penuh',
      extraRevision: 'Rp 250.000/sesi',
      features: [
        'Web App custom Next.js dengan arsitektur database relasional PostgreSQL',
        'Sistem autentikasi aman Better Auth dengan proteksi TOTP 2FA',
        'Dashboard admin CMS custom untuk audit dan manajemen konten',
        'Ekspor laporan otomatis (PDF berstempel QR dinamis & Excel)',
        'Perlindungan audit trail append-only dan backup berkala',
      ],
      popular: true,
      cta: 'Pilih Paket Terpopuler',
    },
    {
      tier: 'TIER 03 • MULTIPLATFORM',
      name: 'Mobile Application Flutter',
      timeline: 'Estimasi 30 Hari',
      price: '4.500.000',
      description: 'Aplikasi ponsel berperforma 60fps dengan kemampuan sinkronisasi offline-first.',
      subtitle: 'Siap rilis produksi Android',
      revisions: '4x Sesi',
      extraRevision: 'Rp 300.000/sesi',
      features: [
        'Aplikasi Android native-feel dibangun dengan Flutter & Dart',
        'Arsitektur offline-first berbasis local database SQLite / Hive',
        'Akses hardware teruji: Geolocation GPS & integrasi modul kamera',
        'Integrasi REST API backend, token refresh, & data sync queue',
        'Build APK produksi tersign & panduan publish Google Play Store',
      ],
      popular: false,
      cta: 'Pilih Paket Mobile App',
    },
  ]

  const addons = [
    {
      name: 'Integrasi WhatsApp Gateway Bot',
      price: 'Rp 450.000',
      desc: 'Pengiriman pesan notifikasi otomatis untuk tagihan, OTP, atau konfirmasi booking.',
    },
    {
      name: 'Penyimpanan Media S3 / R2 Cloud',
      price: 'Rp 350.000',
      desc: 'Konfigurasi bucket Cloudflare R2 dengan validasi byte Sharp & CDN global.',
    },
    {
      name: 'Multi-Role Staff RBAC Tingkat Lanjut',
      price: 'Rp 600.000',
      desc: 'Penambahan hierarki hak akses kustom untuk lebih dari 2 divisi operasional.',
    },
    {
      name: 'Modul Ekspor PDF Ber-QR Kriptografis',
      price: 'Rp 500.000',
      desc: 'Penerbitan surat atau sertifikat resmi dengan verifikasi barcode anti-pemalsuan.',
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-10">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-[#eaeaea] pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <div className="flex items-center gap-2 rounded-full bg-[#f0f0f0] px-3 py-1 w-fit">
            <span className="h-2 w-2 rounded-full bg-[#82b440]"></span>
            <span className="text-[11px] font-semibold tracking-wider text-[#52525b] uppercase">
              Katalog Resmi & Penawaran Terstandar
            </span>
          </div>
          <h1 className="text-[32px] font-semibold tracking-tight text-[#18181a] sm:text-[38px]">
            Pilihan Paket Layanan & Investasi Sistem
          </h1>
          <p className="text-[14px] leading-relaxed text-[#52525b]">
            Transparansi spesifikasi teknis, jangka waktu kerja terjamin, serta kuota revisi definitif tanpa biaya tersembunyi. Didukung standar arsitektur modular, audit keamanan, dan jaminan purna jual.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-[#eaeaea] bg-white p-3 shadow-sm">
            <span className="material-symbols-outlined text-[20px] text-[#82b440]">verified_user</span>
            <div>
              <div className="text-[11px] font-medium text-[#71717a]">Garansi Purna Jual</div>
              <div className="text-[14px] font-bold text-[#18181a]">30 Hari Bug-Free</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-[#eaeaea] bg-white p-3 shadow-sm">
            <span className="material-symbols-outlined text-[20px] text-[#5d6226]">contract_edit</span>
            <div>
              <div className="text-[11px] font-medium text-[#71717a]">Legalitas Kerja</div>
              <div className="text-[14px] font-bold text-[#18181a]">SLA & SPK Resmi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 3 Paket */}
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {packages.map((pkg, idx) => (
          <div
            key={idx}
            className={`flex flex-col justify-between rounded-2xl p-6 transition-all ${
              pkg.popular
                ? 'relative bg-[#18181a] text-white shadow-xl ring-2 ring-[#d2d88f]'
                : 'border border-[#eaeaea] bg-white text-[#18181a] shadow-sm'
            }`}
          >
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold tracking-wider uppercase ${
                    pkg.popular ? 'text-[#d2d88f]' : 'text-[#71717a]'
                  }`}
                >
                  {pkg.tier}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    pkg.popular ? 'bg-[#242427] text-[#d2d88f]' : 'bg-[#f0f0f0] text-[#52525b]'
                  }`}
                >
                  {pkg.timeline}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-[22px] font-bold tracking-tight">{pkg.name}</h3>
                <p
                  className={`text-[13px] leading-relaxed ${
                    pkg.popular ? 'text-[#a8a8ad]' : 'text-[#52525b]'
                  }`}
                >
                  {pkg.description}
                </p>
              </div>

              {/* Harga */}
              <div className="flex flex-col gap-1 border-y border-[#eaeaea]/20 py-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-[14px] font-medium">Rp</span>
                  <span className="text-[36px] font-bold tracking-tight">{pkg.price}</span>
                </div>
                <span
                  className={`text-[11px] ${pkg.popular ? 'text-[#d2d88f]' : 'text-[#71717a]'}`}
                >
                  {pkg.subtitle}
                </span>
              </div>

              {/* Kuota Revisi */}
              <div
                className={`grid grid-cols-2 gap-2 rounded-xl p-3 ${
                  pkg.popular ? 'bg-[#242427]' : 'bg-[#f0f0f0]'
                }`}
              >
                <div>
                  <div className="text-[11px] text-[#71717a]">Revisi Gratis</div>
                  <div className="text-[14px] font-semibold">{pkg.revisions}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#71717a]">Ekstra Revisi</div>
                  <div className="text-[14px] font-semibold">{pkg.extraRevision}</div>
                </div>
              </div>

              {/* Fitur */}
              <div className="flex flex-col gap-2.5 pt-2">
                <span className="text-[11px] font-semibold tracking-wider text-[#71717a] uppercase">
                  Spesifikasi Deliverable:
                </span>
                {pkg.features.map((f, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-[13px]">
                    <span className="material-symbols-outlined mt-0.5 text-[16px] text-[#82b440]">
                      check_circle
                    </span>
                    <span className={pkg.popular ? 'text-gray-200' : 'text-[#18181a]'}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4">
              <a
                href={`https://wa.me/6281234567890?text=Halo%20OpenByte%20Labs,%20saya%20tertarik%20dengan%20${encodeURIComponent(
                  pkg.name,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-semibold transition-colors ${
                  pkg.popular
                    ? 'bg-[#d2d88f] text-[#18181a] hover:bg-[#c2c87f]'
                    : 'bg-[#18181a] text-white hover:bg-[#242427]'
                }`}
              >
                <span>{pkg.cta}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Katalog Add-on Modular */}
      <div className="mt-16 rounded-2xl border border-[#eaeaea] bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#eaeaea] pb-6">
          <span className="text-[11px] font-semibold tracking-wider text-[#71717a] uppercase">
            Fleksibilitas Tambahan
          </span>
          <h2 className="text-[22px] font-bold text-[#18181a]">
            Katalog Add-On Modular Kustom
          </h2>
          <p className="text-[13px] text-[#52525b]">
            Perluas fungsionalitas sistem Anda dengan modul terverifikasi tanpa perlu merombak seluruh arsitektur dasar.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {addons.map((add, aIdx) => (
            <div
              key={aIdx}
              className="flex flex-col justify-between rounded-xl bg-[#f0f0f0] p-4 transition-all hover:bg-[#eaeaea]"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-[14px] font-semibold text-[#18181a]">{add.name}</h4>
                  <span className="rounded-md bg-white px-2 py-0.5 text-[12px] font-bold text-[#18181a]">
                    {add.price}
                  </span>
                </div>
                <p className="text-[12px] text-[#52525b]">{add.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
