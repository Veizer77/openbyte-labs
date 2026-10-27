export type PublicProject = {
  slug: string
  title: string
  tagline: string
  summary: string
  category: string
  image: string
  imageAlt: string
  technology: string[]
}

export const publicProjects: PublicProject[] = [
  {
    slug: 'sinduksadati',
    title: 'SINDUKSADATI',
    tagline: 'Satu data wilayah RW dengan peta GIS dan otomasi surat.',
    summary:
      'Sistem satu data untuk RW 06 Mojorejo: peta batas wilayah RT/RW, profil warga terpadu (Citizen 360), dan otomasi permohonan surat dengan QR.',
    category: 'Instansi / Pemdes',
    image: '/images/e55781324f767410.jpg',
    imageAlt: 'Tampilan sistem informasi wilayah SINDUKSADATI',
    technology: ['Next.js 14', 'PostGIS 3', 'InsForge', 'Leaflet GIS', 'QR Surat'],
  },
  {
    slug: 'sipandu',
    title: 'SIPANDU',
    tagline: 'Alur 5-Meja Posyandu dan deteksi dini stunting.',
    summary:
      'Sistem informasi Posyandu Flamboyan RW 06 dengan alur 5-Meja Kemenkes, kalkulator Z-Score WHO 2006, dan deteksi dini stunting (2T).',
    category: 'Instansi / Pemdes',
    image: '/images/79a2a220f9d6cba2.jpg',
    imageAlt: 'Tampilan aplikasi SIPANDU untuk alur layanan Posyandu',
    technology: ['React 18 SPA', 'Vite', 'InsForge SDK', 'Vitest'],
  },
  {
    slug: 'hippam-web-mobile',
    title: 'HIPPAM Web & Mobile',
    tagline: 'Pencatatan meter air swadaya, web dan mobile.',
    summary:
      'Aplikasi web dan mobile untuk pembacaan meter air swadaya, dengan kompresi foto meteran dan tarif berjenjang.',
    category: 'Aplikasi Mobile (Flutter)',
    image: '/images/6dee120ceda5d3fb.jpg',
    imageAlt: 'Tampilan aplikasi pencatatan meter air HIPPAM',
    technology: ['Next.js 16', 'Flutter 3.x', 'Supabase PostgreSQL', 'RLS'],
  },
  {
    slug: 'umkm-ku',
    title: 'UMKM-KU',
    tagline: 'Direktori UMKM warga dengan checkout WhatsApp.',
    summary:
      'Direktori UMKM warga dengan verifikasi NIK melalui SINDUKSADATI dan pemesanan lewat WhatsApp.',
    category: 'Bisnis & UMKM',
    image: '/images/42c9b04def8ce132.jpg',
    imageAlt: 'Tampilan direktori UMKM-KU',
    technology: ['React Router v7', 'Neon Serverless Postgres', 'AWS S3'],
  },
  {
    slug: 'terapis-jogoroto',
    title: 'Terapis Jogoroto',
    tagline: 'Landing page pijat akupresur dengan booking WhatsApp.',
    summary:
      'Landing page bernuansa emas hangat untuk pijat akupresur, dengan alur terapi lima langkah dan pemesanan langsung lewat WhatsApp.',
    category: 'Bisnis & UMKM',
    image: '/images/9d6384a0fe3b2863.jpg',
    imageAlt: 'Tampilan landing page Terapis Jogoroto',
    technology: ['HTML5 Semantic', 'Modern CSS', 'WhatsApp Direct Booking'],
  },
  {
    slug: 'undangan-fajar-fifi',
    title: 'Undangan Digital',
    tagline: 'Undangan digital dengan amplop 3D dan RSVP.',
    summary:
      'Undangan digital dengan animasi kelopak, amplop 3D bersegel lilin, musik latar, dan RSVP yang tersinkron ke spreadsheet.',
    category: 'Undangan Digital & Event',
    image: '/images/bd8f8e3c60f7fe33.jpg',
    imageAlt: 'Tampilan undangan digital dengan RSVP',
    technology: ['HTML5 Canvas', 'Web Audio API', 'Sheet RSVP Sync'],
  },
]

export const solutionCards = [
  {
    icon: 'map',
    title: 'Sistem Informasi & Satu Data',
    description:
      'Sistem terpadu untuk data wilayah dan layanan publik: dari peta GIS sampai otomasi permohonan surat.',
    details: ['Peta wilayah RT/RW', 'Profil warga terpadu', 'Surat ber-QR'],
    size: 'wide',
  },
  {
    icon: 'phone_iphone',
    title: 'Aplikasi Mobile Lintas Platform',
    description:
      'Aplikasi Android dengan Flutter, termasuk fitur kamera, penyimpanan offline, dan integrasi API.',
    details: ['Flutter', 'Kamera & offline', 'Integrasi API'],
    size: 'normal',
  },
  {
    icon: 'language',
    title: 'Website Bisnis & UMKM',
    description: 'Landing page, profil usaha, dan katalog dengan pemesanan lewat WhatsApp.',
    details: ['Responsif', 'SEO dasar', 'Pesan via WhatsApp'],
    size: 'normal',
  },
  {
    icon: 'mail',
    title: 'Undangan Digital Interaktif',
    description: 'Undangan web dengan animasi, musik, dan RSVP yang terhubung ke spreadsheet.',
    details: ['Animasi', 'Musik latar', 'RSVP'],
    size: 'wide',
  },
] as const

export const publicFaqs = [
  {
    question: 'Berapa biaya membuat website atau aplikasi?',
    answer:
      'Biaya bergantung pada jenis solusi dan fiturnya. Gunakan kalkulator di situs untuk estimasi awal, atau lihat paket kami. Harga final ditetapkan setelah konsultasi kebutuhan.',
  },
  {
    question: 'Berapa lama pengerjaannya?',
    answer:
      'Perkiraan waktu bergantung pada jenis proyek dan kelengkapan kebutuhan serta materi. Jadwal dibahas saat konsultasi.',
  },
  {
    question: 'Apakah domain dan hosting sudah termasuk?',
    answer:
      'Biaya domain dan hosting pihak ketiga ditanggung klien. Pemasangan awal atau layanan setup dapat dibahas sesuai paket.',
  },
  {
    question: 'Bagaimana alur pengerjaannya?',
    answer:
      'Alur kerja mencakup pembahasan kebutuhan dan kontrak, desain, pengembangan, pengujian, review, lalu deployment dan serah terima.',
  },
]

export type ServicePackage = {
  slug: string
  name: string
  category: string
  price: number
  durationDays: number
  revisions: number
  extraRevisionPrice: number
  description: string
  features: string[]
}

// Presentational seed from PRD 8.4. The live CMS remains the source after integration.
export const servicePackages: ServicePackage[] = [
  {
    slug: 'starter-umkm-bisnis',
    name: 'Starter UMKM & Bisnis',
    category: 'Bisnis & UMKM',
    price: 1_000_000,
    durationDays: 7,
    revisions: 2,
    extraRevisionPrice: 100_000,
    description:
      'Website presentasi untuk memperkenalkan usaha dan memudahkan calon pelanggan menghubungi Anda.',
    features: [
      'Landing page atau profil hingga 5 halaman',
      'Tampilan responsif',
      'Tombol WhatsApp',
      'SEO dasar',
      'Setup domain & hosting awal',
    ],
  },
  {
    slug: 'sistem-informasi-instansi',
    name: 'Sistem Informasi / Instansi',
    category: 'Instansi / Pemdes',
    price: 3_500_000,
    durationDays: 21,
    revisions: 3,
    extraRevisionPrice: 250_000,
    description:
      'Sistem terintegrasi dengan database, pengelolaan peran, dan dashboard operasional.',
    features: ['Database terintegrasi', 'Multi-role', 'Dashboard operasional', 'Ekspor laporan'],
  },
  {
    slug: 'mobile-application-flutter',
    name: 'Mobile Application (Flutter)',
    category: 'Aplikasi Mobile',
    price: 4_500_000,
    durationDays: 30,
    revisions: 4,
    extraRevisionPrice: 300_000,
    description: 'Aplikasi Android dengan dukungan offline, kamera, dan integrasi API.',
    features: ['Android native-feel', 'Penyimpanan offline', 'Akses kamera', 'Integrasi API'],
  },
]

export const serviceAddons = [
  {
    name: 'Maintenance bulanan',
    description: 'Perbaikan bug, pembaruan minor, dan backup.',
    price: 150_000,
    unit: 'per bulan',
  },
  {
    name: 'Maintenance tahunan',
    description: 'Perawatan rutin untuk menjaga layanan tetap terbarui.',
    price: 1_500_000,
    unit: 'per tahun',
  },
  {
    name: 'Pelatihan admin',
    description: 'Satu sesi online hingga dua jam.',
    price: 250_000,
    unit: 'sekali bayar',
  },
  {
    name: 'Setup domain & hosting',
    description: 'Tersedia untuk paket di luar Starter.',
    price: 200_000,
    unit: 'sekali bayar',
  },
]

export const calculatorGroups = [
  {
    title: 'Platform Utama',
    description: 'Pilih media target rilis aplikasi Anda.',
    type: 'radio',
    required: true,
    options: [
      { label: 'Web Saja', detail: 'Responsive browser' },
      { label: 'Mobile Android Saja (Flutter)', detail: 'Aplikasi Android' },
      { label: 'Web + Android (Flutter)', detail: 'Web dan Android' },
    ],
  },
  {
    title: 'Jenis Solusi',
    description: 'Pilih jenis solusi yang paling sesuai kebutuhan.',
    type: 'radio',
    required: true,
    options: [
      { label: 'Landing Page Profil', detail: 'Profil dan informasi usaha' },
      { label: 'Katalog & Toko Online', detail: 'Checkout melalui WhatsApp' },
      { label: 'Sistem Informasi Database', detail: 'Data dan proses terintegrasi' },
      { label: 'Undangan Digital', detail: 'Undangan web interaktif' },
    ],
  },
  {
    title: 'Modul Tambahan',
    description: 'Opsional. Beberapa modul memerlukan Sistem Informasi Database.',
    type: 'checkbox',
    required: false,
    options: [
      { label: 'Multi-User RBAC', detail: 'Kontrol peran pengguna' },
      { label: 'Pemetaan Wilayah (GIS & Geolocation)', detail: 'Peta dan data geospasial' },
      { label: 'Cetak Laporan (PDF & Excel)', detail: 'Ekspor laporan' },
      {
        label: 'Notifikasi / Gateway WhatsApp Otomatis',
        detail: 'Biaya gateway pihak ketiga terpisah',
      },
      { label: 'Integrasi Pembayaran (QRIS / Payment Gateway)', detail: 'Integrasi pembayaran' },
      { label: 'Halaman Tambahan', detail: 'Biaya dihitung per halaman' },
    ],
  },
] as const
