import { loadLocalEnv } from "./lib/load-local-env";
loadLocalEnv();

import { createHash } from "node:crypto";
import postgres from "postgres";
import { getEnv } from "@/env";
import { hashTrackingPin } from "@/lib/tracking/security";

/**
 * Salinan algoritma `createLicenseFingerprint` di src/services/store.ts.
 * Sengaja diduplikasi di sini supaya script seeding tidak perlu memuat modul
 * `server-only` + seluruh service store hanya untuk satu fungsi hash.
 */
function licenseFingerprint(
  orderCode: string,
  buyerEmail: string,
  buyerWhatsapp: string,
  salt: string,
): string {
  return createHash("sha256")
    .update(`${orderCode}|${buyerEmail}|${buyerWhatsapp}|${salt}`)
    .digest("hex")
    .slice(0, 24)
    .toUpperCase();
}

interface SeedProduct {
  id: string;
  title: string;
  slug: string;
  productType: "source_code" | "ui_template";
  tagline: string;
  summary: string;
  thumbnailMediaId: string | null;
  gallery: Array<{ mediaId: string; caption?: string }>;
  demoUrl: string | null;
  videoUrl: string | null;
  videoKey: string | null;
  relatedProjectId: string | null;
  priceSingle: number;
  priceCommercial: number;
  compareAtPriceSingle: number;
  compareAtPriceCommercial: number;
  setupServicePrice: number;
  techStack: string[];
  features: string[];
  includedFiles: string[];
  version: string;
  packageSizeBytes: number;
  changelog: string;
  githubRepoInfo: string | null;
  isFeatured: boolean;
  salesCount: number;
  ratingAverage: number;
  ratingCount: number;
  status: "published" | "draft";
  sortOrder: number;
}

interface SeedCoupon {
  id: string;
  code: string;
  description: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date | null;
}

interface SeedOrder {
  id: string;
  orderCode: string;
  productId: string;
  licenseTier: "single" | "commercial";
  buyerName: string;
  buyerWhatsapp: string;
  buyerEmail: string;
  buyerGithub: string | null;
  notes: string | null;
  amount: number;
  baseAmount: number;
  setupFeeAmount: number;
  discountAmount: number;
  couponCode: string | null;
  includeSetupService: boolean;
  paymentStatus: "paid" | "pending" | "cancelled" | "expired";
  /** Plain 6-digit PIN; the scrypt hash is derived at seed time (never stored raw). */
  accessPin: string;
  pinVersion: number;
  downloadCount: number;
  maxDownloads: number;
  expiresAt: Date | null;
  isRevoked: boolean;
  paidAt: Date | null;
}

interface SeedReview {
  id: string;
  productId: string;
  orderId: string | null;
  buyerName: string;
  licenseTier: "single" | "commercial";
  rating: number;
  comment: string;
  mediaItems: Array<{ mediaId: string; caption?: string }>;
  status: "approved" | "pending" | "rejected";
  adminReply: string | null;
}

export const REAL_PRODUCTS: SeedProduct[] = [
  // 1. SINDUKSADATI
  {
    id: "a0110000-0000-4000-a000-000000000001",
    title: "SINDUKSADATI — Sistem Informasi Kependudukan, KK, Kas & Pemetaan GIS Warga",
    slug: "sinduksadati-sistem-informasi-kependudukan",
    productType: "source_code",
    tagline: "Platform Satu Data Terpadu Warga, Pemetaan GIS Leaflet, Kas RT/RW Transparan & Cetak Surat Ber-QR",
    summary:
      "Sistem Informasi Kependudukan Satu Data Terintegrasi (SINDUKSADATI) berbasis Next.js 14 dan PostgreSQL untuk tata kelola administrasi warga RW/Desa. Dilengkapi pemetaan spasial rumah warga interaktif (Leaflet GIS), manajemen buku induk kependudukan & Kartu Keluarga (KK), pencatatan iuran kas transparan, generator surat pengantar otomatis ke format PDF ber-QR code sah, serta modul migrasi impor data sensus massal dari file Excel (SheetJS).",
    thumbnailMediaId: "e0110000-0000-4000-a000-000000000101",
    gallery: [
      {
        mediaId: "e0110000-0000-4000-a000-000000000101",
        caption: "Dasbor Demografi & Statistik Kependudukan RW 06 Desa Mojorejo",
      },
      {
        mediaId: "e0110000-0000-4000-a000-000000000102",
        caption: "Pemetaan Spasial GIS Sebaran Hunian & Titik Rumah Warga (Leaflet Engine)",
      },
      {
        mediaId: "e0110000-0000-4000-a000-000000000103",
        caption: "Database Induk Kartu Keluarga & Generator Surat Pengantar PDF dengan Barcode",
      },
      {
        mediaId: "e0110000-0000-4000-a000-000000000104",
        caption: "Modul Transparansi Kas Iuran Warga & Impor Massal Data Excel SheetJS",
      },
    ],
    demoUrl: null,
    videoUrl: null,
    videoKey: null,
    relatedProjectId: "5e11350e-7ab6-4aa9-bbea-a9fd0a19a686",
    priceSingle: 550000,
    priceCommercial: 1450000,
    compareAtPriceSingle: 850000,
    compareAtPriceCommercial: 2100000,
    setupServicePrice: 250000,
    techStack: [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "Chart.js",
      "Leaflet GIS",
      "PostgreSQL",
      "React Hook Form",
      "Zod",
      "SheetJS (XLSX)",
    ],
    features: [
      "Dasbor eksekutif demografi real-time dengan grafik piramida usia dan produktivitas Chart.js",
      "Pemetaan spasial hunian warga berbasis Leaflet GIS dengan kontrol layer RT dan status kepemilikan",
      "Manajemen database induk Kartu Keluarga (KK) dan individu warga dengan validasi NIK ganda",
      "Otomasi generator surat pengantar desa resmi (KTP, Domisili, SKCK, Kelahiran) berstempel & QR code",
      "Pencatatan mutasi kependudukan (Kelahiran, Kematian, Pindah, Datang) berjenjang operator",
      "Modul kas keuangan dan iuran warga RW transparan dengan rekapitulasi status bayar otomatis",
      "Impor massal data sensus format Excel (.xlsx / .csv) dengan auto-detection schema SheetJS",
      "Role-Based Access Control 5 tingkat: Super Admin, Admin RW, Operator RT, Bendahara, dan Portal Warga",
    ],
    includedFiles: [
      "Source code fullstack Next.js 14 (App Router & Server Actions)",
      "Skrip skema migrasi database PostgreSQL / Supabase lengkap dengan data demo",
      "Komponen Leaflet GIS & utilitas parsing GeoJSON batas wilayah RT/RW",
      "Template cetak surat PDF resmi dengan stempel QR verifikasi dokumen",
      "Dokumentasi lengkap instalasi, konfigurasi environment & deployment Docker VPS",
    ],
    version: "1.0.0",
    packageSizeBytes: 24961431,
    changelog:
      "v1.0.0: Rilis produksi SINDUKSADATI RW 06 Desa Mojorejo. Mendukung pemetaan spasial GIS, impor Excel SheetJS, modul kas iuran, dan generator surat berstempel QR.",
    githubRepoInfo: "openbyte-labs/sinduksadati",
    isFeatured: true,
    salesCount: 19,
    ratingAverage: 490,
    ratingCount: 12,
    status: "published",
    sortOrder: 1,
  },

  // 2. SIPANDU
  {
    id: "a0110000-0000-4000-a000-000000000002",
    title: "SIPANDU — Sistem Informasi Posyandu ILP, Alur 5 Meja & Kurva KMS WHO 2006",
    slug: "sipandu-sistem-informasi-posyandu-digital",
    productType: "source_code",
    tagline: "Aplikasi Posyandu ILP Terintegrasi Alur 5 Meja Kemenkes, Kalkulator Z-Score WHO 2006 & Laporan Resmi L-01",
    summary:
      "SIPANDU adalah aplikasi Single Page Application (React 18 + Vite + TypeScript) untuk digitalisasi menyeluruh layanan Posyandu ILP (Integrasi Layanan Primer) tingkat RW/Desa. Mengimplementasikan alur 5 Meja Hari H Kementerian Kesehatan RI mulai dari registrasi digital, pengukuran antropometri dengan kalkulator LMS Z-Score WHO 2006 real-time (BB/U, TB/U, BB/TB), pencatatan, pelayanan kesehatan (Vitamin A, PMT, imunisasi), hingga edukasi kelompok. Dilengkapi RBAC 5 peran (Kader, Bidan Desa, Ketua TP PKK, Kepala Desa, Super Admin), kurva pertumbuhan KMS digital, deteksi dini stunting/2T/BGM, generator laporan resmi L-01 berkop Pemkot Batu siap cetak, serta integrasi Citizen 360 dengan SINDUKSADATI.",
    thumbnailMediaId: "e0110000-0000-4000-a000-000000000201",
    gallery: [
      {
        mediaId: "e0110000-0000-4000-a000-000000000201",
        caption: "Dasbor Monitoring Posyandu ILP Flamboyan RW 06 & Deteksi Dini Risiko Stunting",
      },
      {
        mediaId: "e0110000-0000-4000-a000-000000000202",
        caption: "Profil Balita, Kurva Pertumbuhan KMS WHO 2006 & Matriks Imunisasi Dasar",
      },
      {
        mediaId: "e0110000-0000-4000-a000-000000000203",
        caption: "Alur 5 Meja Hari H: Pengukuran Antropometri & Kalkulator Z-Score Real-Time",
      },
      {
        mediaId: "e0110000-0000-4000-a000-000000000204",
        caption: "Generator Laporan Resmi L-01 Berkop Pemkot Batu Siap Cetak PDF",
      },
    ],
    demoUrl: null,
    videoUrl: null,
    videoKey: null,
    relatedProjectId: "f329a3a1-7ea5-4cdf-a161-305e2dc4ce12",
    priceSingle: 490000,
    priceCommercial: 1290000,
    compareAtPriceSingle: 750000,
    compareAtPriceCommercial: 1850000,
    setupServicePrice: 200000,
    techStack: [
      "React 18",
      "Vite 5",
      "TypeScript",
      "Tailwind CSS 3",
      "React Router v6",
      "InsForge BaaS (PostgreSQL)",
      "Vitest",
    ],
    features: [
      "Alur 5 Meja Hari H Posyandu ILP lengkap: registrasi, antropometri, pencatatan, pelayanan, dan edukasi",
      "Kalkulator LMS Z-Score WHO 2006 real-time (BB/U, TB/U, BB/TB) dengan klasifikasi status gizi otomatis",
      "Grafik kurva pertumbuhan Kartu Menuju Sehat (KMS) digital interaktif per balita",
      "Deteksi dini risiko stunting, 2T (tidak naik dua kali), dan BGM (Bawah Garis Merah) otomatis",
      "RBAC 5 peran: Kader Posyandu, Bidan Desa, Ketua TP PKK, Kepala Desa, dan Super Admin",
      "Dashboard eksekutif per peran: capaian D/S per RT, prevalensi stunting, dan rekomendasi dana desa",
      "Manajemen master kependudukan RW 06: Kartu Keluarga, anggota keluarga, dan auto-klasifikasi sasaran",
      "Generator laporan resmi L-01 berkop Pemkot Batu/Desa Mojorejo siap cetak PDF",
      "Integrasi Citizen 360 dengan SINDUKSADATI sebagai Single Source of Truth kependudukan RW 06",
      "Audit log, manajemen pengguna, dan pengaturan profil Posyandu untuk Super Admin",
    ],
    includedFiles: [
      "Source code SPA React 18 + Vite + TypeScript lengkap dengan Tailwind CSS",
      "Tabel LMS antropometri WHO 2006 (Laki-laki & Perempuan) untuk kalkulasi Z-Score",
      "Skema database InsForge PostgreSQL + seluruh skrip migrasi",
      "Template cetak laporan resmi L-01 (kop surat Pemkot Batu) dengan @media print",
      "Panduan instalasi, konfigurasi environment, dan modul pelatihan kader Posyandu",
    ],
    version: "3.0.0",
    packageSizeBytes: 642665,
    changelog:
      "v3.0.0: Penambahan Bagian 42 — Perencanaan Integrasi SINDUKSADATI (Citizen 360, linking penduduk, sinkronisasi lifecycle warga) beserta pembaruan pada Bagian 4, 13, 20, dan 40.",
    githubRepoInfo: "openbyte-labs/sipandu",
    isFeatured: true,
    salesCount: 16,
    ratingAverage: 495,
    ratingCount: 9,
    status: "published",
    sortOrder: 2,
  },

  // 3. HIPPAM
  {
    id: "a0110000-0000-4000-a000-000000000003",
    title: "HIPPAM Dual-Platform (Next.js Web + Flutter Mobile) — Billing Air, Catat Meter Mandiri & AI Copilot",
    slug: "hippam-billing-air-web-mobile-ai",
    productType: "source_code",
    tagline: "Solusi Terpadu Pengelolaan Air Bersih Desa: Web Admin Next.js 16 + Flutter Android Mobile + AI Inspector",
    summary:
      "Arsitektur dual-platform mutakhir untuk pengelolaan air bersih HIPPAM/BPSPAM tingkat desa. Memadukan panel web admin modern (Next.js 16, React 19, Tailwind v4) dengan aplikasi mobile Flutter 3 untuk petugas lapangan dan warga. Dilengkapi modul AI Copilot untuk mendeteksi anomali pemakaian atau kebocoran pipa bawah tanah, form warga kirim foto & angka meteran air mandiri, tarif pemakaian berjenjang (m³), peta jaringan pipa Leaflet GIS, serta otomasi invoice tagihan via WhatsApp Gateway.",
    thumbnailMediaId: "e0110000-0000-4000-a000-000000000301",
    gallery: [
      {
        mediaId: "e0110000-0000-4000-a000-000000000301",
        caption: "Dasbor Admin Next.js 16 Billing Air Bersih, Tarif Berjenjang & Analitik M3",
      },
      {
        mediaId: "e0110000-0000-4000-a000-000000000302",
        caption: "Portal Warga Catat Meter Mandiri & Verifikasi Foto Fisik Meteran Air",
      },
      {
        mediaId: "e0110000-0000-4000-a000-000000000303",
        caption: "Asisten AI Copilot Deteksi Kebocoran Pipa & Generator Tagihan WhatsApp",
      },
      {
        mediaId: "e0110000-0000-4000-a000-000000000304",
        caption: "Aplikasi Flutter Mobile Petugas Catat Meter & Portal Cek Tagihan Warga",
      },
    ],
    demoUrl: null,
    videoUrl: null,
    videoKey: null,
    relatedProjectId: "1309810d-6034-4c61-80ab-66aecbd1917c",
    priceSingle: 690000,
    priceCommercial: 1750000,
    compareAtPriceSingle: 990000,
    compareAtPriceCommercial: 2500000,
    setupServicePrice: 300000,
    techStack: [
      "Next.js 16",
      "React 19",
      "Flutter 3",
      "Dart",
      "Tailwind CSS 4",
      "Supabase",
      "Leaflet GIS",
      "Motion",
      "Recharts",
    ],
    features: [
      "Arsitektur Monorepo Dual-Platform: Web Admin Next.js 16 + Aplikasi Mobile Flutter Android/iOS",
      "AI Copilot anomali pemakaian air: mendeteksi dini kebocoran pipa bawah tanah dan lonjakan drastis",
      "Portal catat meter mandiri warga dengan validasi foto fisik meteran dan cap waktu geotagged",
      "Aplikasi Flutter Mobile offline-first untuk petugas lapangan mencatat meter di wilayah tanpa sinyal",
      "Skema tarif air berjenjang (Tier 1: 0-10 m³, Tier 2: 11-20 m³, Tier 3: >20 m³) + biaya abonemen",
      "Otomasi pengiriman invoice dan struk tagihan air langsung ke WhatsApp pelanggan via gateway",
      "Pemetaan GIS jaringan pipa transmisi, katup kontrol, dan titik water meter pelanggan (Leaflet)",
      "Laporan keuangan kas masuk/keluar, rekap tunggakan pelanggan, dan rasio kehilangan air (NRW)",
    ],
    includedFiles: [
      "Source code Web Admin Next.js 16 & React 19 (folder web/)",
      "Source code Aplikasi Mobile Flutter 3 & Dart (folder mobile/)",
      "Skrip database Supabase / PostgreSQL lengkap dengan tabel tarif, meter, dan tagihan",
      "Integrasi Supabase Storage untuk foto bukti meteran dan Supabase Realtime",
      "Panduan kompilasi APK Android Flutter dan deployment Web Admin ke Vercel/VPS",
    ],
    version: "1.0.0",
    packageSizeBytes: 4221926,
    changelog:
      "v1.0.0: Rilis awal HIPPAM Dual-Platform. Terdiri dari Next.js 16 Web Admin, Flutter 3 Mobile App, integrasi AI Copilot deteksi anomali, dan tagihan WhatsApp otomatis.",
    githubRepoInfo: "openbyte-labs/hippam-project",
    isFeatured: true,
    salesCount: 22,
    ratingAverage: 490,
    ratingCount: 14,
    status: "published",
    sortOrder: 3,
  },

  // 4. UMKM-KU
  {
    id: "a0110000-0000-4000-a000-000000000004",
    title: "UMKM-KU — Portal Direktori Usaha Warga, Pemetaan GIS & Verifikasi Terpadu",
    slug: "umkm-ku-direktori-gis-usaha-warga",
    productType: "source_code",
    tagline: "Katalog Direktori Usaha Lokal, Pemetaan Spasial GIS Leaflet & Sistem Verifikasi Operator RW/Desa",
    summary:
      "UMKM-KU adalah platform direktori dan pemberdayaan ekonomi warga tingkat desa berbasis React 18, Vite 6, Hono API, dan Neon Serverless PostgreSQL. Mengakomodasi pendaftaran usaha mandiri oleh warga, etalase katalog produk/jasa lengkap, pemetaan spasial lokasi usaha (Leaflet GIS) dengan penunjuk arah radius terdekat, verifikasi berjenjang oleh operator RW, serta integrasi pemesanan WhatsApp tanpa potongan komisi.",
    thumbnailMediaId: "e0110000-0000-4000-a000-000000000401",
    gallery: [
      {
        mediaId: "e0110000-0000-4000-a000-000000000401",
        caption: "Portal Direktori Usaha Warga RW 06 & Filter Kategori Usaha Terpadu",
      },
      {
        mediaId: "e0110000-0000-4000-a000-000000000402",
        caption: "Pemetaan Spasial GIS Lokasi Usaha Warga & Penunjuk Radius Jarak (Leaflet)",
      },
      {
        mediaId: "e0110000-0000-4000-a000-000000000403",
        caption: "Profil Lengkap Toko Usaha, Katalog Menu Produk & Direct Chat WhatsApp",
      },
      {
        mediaId: "e0110000-0000-4000-a000-000000000404",
        caption: "Dasbor Pemilik Usaha Mandiri & Alur Verifikasi Operator Berjenjang RW/Desa",
      },
    ],
    demoUrl: null,
    videoUrl: null,
    videoKey: null,
    relatedProjectId: "6283dca7-df55-41d8-b0b4-52ff3f5a469f",
    priceSingle: 450000,
    priceCommercial: 1150000,
    compareAtPriceSingle: 690000,
    compareAtPriceCommercial: 1650000,
    setupServicePrice: 200000,
    techStack: [
      "React 18",
      "Vite 6",
      "TypeScript",
      "Tailwind CSS",
      "Hono API",
      "Neon PostgreSQL",
      "Leaflet GIS",
      "TanStack Query",
    ],
    features: [
      "Katalog direktori UMKM modern dengan pencarian instan, filter kategori, dan sortir rating/jarak",
      "Peta interaktif Leaflet GIS penunjuk lokasi usaha warga dengan visualisasi radius jangkauan terdekat",
      "Halaman profil detail usaha: etalase produk/menu, jam operasional, legalitas NIB/PIRT & rating",
      "Pemesanan langsung ke penjual via tombol WhatsApp tanpa potongan biaya komisi pihak ketiga",
      "Form pendaftaran mandiri oleh warga dengan unggah foto produk & penentuan titik peta GPS",
      "Panel verifikasi berjenjang operator RW/Desa untuk menjaga keaslian dan legalitas data usaha",
      "Dasbor analitik pemilik usaha: grafik klik kontak WhatsApp, jumlah pengunjung, dan ulasan pembeli",
      "Arsitektur monolit ringan Hono + Neon PostgreSQL Serverless yang sangat hemat biaya hosting",
    ],
    includedFiles: [
      "Source code frontend React 18 + Vite 6 + Tailwind CSS",
      "Source code backend API Hono (Edge & Node compatible)",
      "Skrip database SQL Neon / PostgreSQL lengkap dengan data usaha contoh",
      "Konfigurasi Leaflet GIS peta satelit / jalan dan marker kustom",
      "Dokumentasi instalasi lokal, deployment Vercel/Cloudflare Pages & Neon setup",
    ],
    version: "1.3.0",
    packageSizeBytes: 1369752,
    changelog:
      "v1.3.0: Peningkatan performa peta Leaflet dengan clustering marker, integrasi Hono RPC, optimasi gambar webp, dan penambahan alur verifikasi operator.",
    githubRepoInfo: "openbyte-labs/umkm-ku",
    isFeatured: false,
    salesCount: 15,
    ratingAverage: 485,
    ratingCount: 10,
    status: "published",
    sortOrder: 4,
  },

];

export const REAL_COUPONS: SeedCoupon[] = [
  {
    id: "b0110000-0000-4000-a000-000000000001",
    code: "KARYAOPENBYTE",
    description: "Diskon 15% untuk semua source code proyek nyata OpenByte Labs",
    discountType: "percent",
    discountValue: 15,
    minOrderAmount: 400000,
    maxDiscountAmount: 150000,
    maxUses: 100,
    usedCount: 24,
    isActive: true,
    expiresAt: new Date("2027-12-31T23:59:59.000Z"),
  },
  {
    id: "b0110000-0000-4000-a000-000000000002",
    code: "STORELAUNCH",
    description: "Potongan langsung Rp 50.000 spesial peluncuran digital store",
    discountType: "fixed",
    discountValue: 50000,
    minOrderAmount: 400000,
    maxDiscountAmount: 50000,
    maxUses: 50,
    usedCount: 38,
    isActive: true,
    expiresAt: new Date("2027-06-30T23:59:59.000Z"),
  },
  {
    id: "b0110000-0000-4000-a000-000000000003",
    code: "BUNDLEDESA",
    description: "Diskon 20% untuk instansi desa dan pemberdayaan masyarakat",
    discountType: "percent",
    discountValue: 20,
    minOrderAmount: 800000,
    maxDiscountAmount: 300000,
    maxUses: 30,
    usedCount: 12,
    isActive: true,
    expiresAt: new Date("2027-12-31T23:59:59.000Z"),
  },
];

export const REAL_ORDERS: SeedOrder[] = [
  {
    id: "c0110000-0000-4000-a000-000000000001",
    orderCode: "OBL-STR-SIND001",
    productId: "a0110000-0000-4000-a000-000000000001", // SINDUKSADATI
    licenseTier: "single",
    buyerName: "Drs. Hendro Wibowo",
    buyerWhatsapp: "081234567801",
    buyerEmail: "hendro.wibowo@desa-mandiri.id",
    buyerGithub: "hendrowibowo-dev",
    notes: "Implementasi sistem informasi kependudukan desa di Kabupaten Malang",
    amount: 550000,
    baseAmount: 550000,
    setupFeeAmount: 0,
    discountAmount: 0,
    couponCode: null,
    includeSetupService: false,
    paymentStatus: "paid",
    accessPin: "246801",
    pinVersion: 1,
    downloadCount: 3,
    maxDownloads: 10,
    expiresAt: new Date("2027-11-12T00:00:00.000Z"),
    isRevoked: false,
    paidAt: new Date("2026-11-02T09:30:00.000Z"),
  },
  {
    id: "c0110000-0000-4000-a000-000000000002",
    orderCode: "OBL-STR-SIPA002",
    productId: "a0110000-0000-4000-a000-000000000002", // SIPANDU
    licenseTier: "commercial",
    buyerName: "Bd. Siti Nurhaliza, S.Tr.Keb",
    buyerWhatsapp: "081234567802",
    buyerEmail: "siti.nurhaliza@posyandudigital.org",
    buyerGithub: null,
    notes: "Pengadaan sistem digitalisasi Posyandu untuk 8 posyandu binaan",
    amount: 1490000,
    baseAmount: 1290000,
    setupFeeAmount: 200000,
    discountAmount: 0,
    couponCode: null,
    includeSetupService: true,
    paymentStatus: "paid",
    accessPin: "357912",
    pinVersion: 1,
    downloadCount: 2,
    maxDownloads: 10,
    expiresAt: new Date("2027-11-12T00:00:00.000Z"),
    isRevoked: false,
    paidAt: new Date("2026-11-05T14:15:00.000Z"),
  },
  {
    id: "c0110000-0000-4000-a000-000000000003",
    orderCode: "OBL-STR-HIPP003",
    productId: "a0110000-0000-4000-a000-000000000003", // HIPPAM
    licenseTier: "single",
    buyerName: "Ir. Agus Priyanto",
    buyerWhatsapp: "081234567803",
    buyerEmail: "agus.priyanto@tirtabening.co.id",
    buyerGithub: "aguspri-dev",
    notes: "Sistem billing air minum BPSPAM Tirta Bening",
    amount: 690000,
    baseAmount: 690000,
    setupFeeAmount: 0,
    discountAmount: 0,
    couponCode: null,
    includeSetupService: false,
    paymentStatus: "paid",
    accessPin: "468023",
    pinVersion: 1,
    downloadCount: 4,
    maxDownloads: 10,
    expiresAt: new Date("2027-11-12T00:00:00.000Z"),
    isRevoked: false,
    paidAt: new Date("2026-11-07T11:45:00.000Z"),
  },
  {
    id: "c0110000-0000-4000-a000-000000000004",
    orderCode: "OBL-STR-UMKM004",
    productId: "a0110000-0000-4000-a000-000000000004", // UMKM-KU
    licenseTier: "single",
    buyerName: "Rian Hidayat",
    buyerWhatsapp: "081234567804",
    buyerEmail: "rian.hidayat@umkmjuara.id",
    buyerGithub: "rianhidayat99",
    notes: "Portal promosi UMKM kecamatan",
    amount: 450000,
    baseAmount: 450000,
    setupFeeAmount: 0,
    discountAmount: 0,
    couponCode: null,
    includeSetupService: false,
    paymentStatus: "paid",
    accessPin: "579134",
    pinVersion: 1,
    downloadCount: 1,
    maxDownloads: 10,
    expiresAt: new Date("2027-11-12T00:00:00.000Z"),
    isRevoked: false,
    paidAt: new Date("2026-11-09T16:20:00.000Z"),
  },
];

export const REAL_REVIEWS: SeedReview[] = [
  // 1. SINDUKSADATI Review
  {
    id: "d0110000-0000-4000-a000-000000000001",
    productId: "a0110000-0000-4000-a000-000000000001",
    orderId: "c0110000-0000-4000-a000-000000000001",
    buyerName: "Drs. Hendro Wibowo",
    licenseTier: "single",
    rating: 5,
    comment:
      "Source code SINDUKSADATI ini sangat matang dan terstruktur rapi. Fitur pemetaan Leaflet GIS dan generator surat PDF dengan verifikasi QR code langsung jalan sempurna di server desa kami. Dokumentasi instalasinya juga sangat jelas!",
    mediaItems: [],
    status: "approved",
    adminReply:
      "Terima kasih Pak Hendro! Senang sekali SINDUKSADATI dapat membantu digitalisasi pelayanan warga di desa Bapak.",
  },
  // 2. SIPANDU Review
  {
    id: "d0110000-0000-4000-a000-000000000002",
    productId: "a0110000-0000-4000-a000-000000000002",
    orderId: "c0110000-0000-4000-a000-000000000002",
    buyerName: "Bd. Siti Nurhaliza, S.Tr.Keb",
    licenseTier: "commercial",
    rating: 5,
    comment:
      "Aplikasi SIPANDU sangat memudahkan kader Posyandu kami. Perhitungan otomatis Z-Score baku WHO dan grafik kurva KMS-nya sangat akurat. Pembuatan laporan bulanan F-III Gizi Puskesmas yang tadinya butuh berhari-hari kini selesai dalam hitungan menit.",
    mediaItems: [],
    status: "approved",
    adminReply:
      "Alhamdulillah, terima kasih Bu Bidan Siti Nurhaliza. Sukses selalu untuk posyandu binaannya dalam menurunkan angka stunting!",
  },
  // 3. HIPPAM Review
  {
    id: "d0110000-0000-4000-a000-000000000003",
    productId: "a0110000-0000-4000-a000-000000000003",
    orderId: "c0110000-0000-4000-a000-000000000003",
    buyerName: "Ir. Agus Priyanto",
    licenseTier: "single",
    rating: 5,
    comment:
      "Kombinasi Web Next.js dan Flutter mobile-nya sangat solid. Petugas kami bisa catat meter offline saat tidak ada sinyal di pelosok, dan modul AI Copilot-nya terbukti berhasil mendeteksi kebocoran pipa bawah tanah dari anomali pemakaian air pelanggan.",
    mediaItems: [],
    status: "approved",
    adminReply:
      "Terima kasih Pak Agus! Efisiensi operasional dan pengurangan rasio air hilang (NRW) memang salah satu fokus utama arsitektur HIPPAM ini.",
  },
  // 4. UMKM-KU Review
  {
    id: "d0110000-0000-4000-a000-000000000004",
    productId: "a0110000-0000-4000-a000-000000000004",
    orderId: "c0110000-0000-4000-a000-000000000004",
    buyerName: "Rian Hidayat",
    licenseTier: "single",
    rating: 5,
    comment:
      "Framework Hono + Neon PostgreSQL-nya luar biasa kencang dan hemat resource. Warga pelaku UMKM sangat senang karena pesanan masuk langsung ke WhatsApp tanpa ribet dan tanpa potongan persenan komisi.",
    mediaItems: [],
    status: "approved",
    adminReply:
      "Terima kasih Mas Rian! Semoga UMKM warga semakin maju dan laris manis dengan hadirnya portal direktori lokal ini.",
  },
];

export const PORTFOLIO_GALLERY_UPDATES = [
  {
    slug: "sinduksadati",
    projectId: "5e11350e-7ab6-4aa9-bbea-a9fd0a19a686",
    gallery: [
      { mediaId: "e0110000-0000-4000-a000-000000000101", alt: "Dasbor Demografi & Statistik Kependudukan RW 06 Desa Mojorejo" },
      { mediaId: "e0110000-0000-4000-a000-000000000102", alt: "Pemetaan Spasial GIS Sebaran Hunian & Titik Rumah Warga (Leaflet Engine)" },
      { mediaId: "e0110000-0000-4000-a000-000000000103", alt: "Database Induk Kartu Keluarga & Generator Surat Pengantar PDF dengan Barcode" },
      { mediaId: "e0110000-0000-4000-a000-000000000104", alt: "Modul Transparansi Kas Iuran Warga & Impor Massal Data Excel SheetJS" },
    ],
  },
  {
    slug: "sipandu",
    projectId: "f329a3a1-7ea5-4cdf-a161-305e2dc4ce12",
    gallery: [
      { mediaId: "e0110000-0000-4000-a000-000000000201", alt: "Dasbor Pemantauan Status Gizi Balita & Deteksi Dini Risiko Stunting" },
      { mediaId: "e0110000-0000-4000-a000-000000000202", alt: "Rekam Medis Digital & Kurva Pertumbuhan Balita KMS Standar WHO (BB/U & TB/U)" },
      { mediaId: "e0110000-0000-4000-a000-000000000203", alt: "Modul Input Pengukuran Cepat Meja Kader Posyandu & Auto-Klasifikasi Z-Score" },
      { mediaId: "e0110000-0000-4000-a000-000000000204", alt: "Generator Laporan Resmi Bulanan F-III Gizi Puskesmas Format PDF & Excel" },
    ],
  },
  {
    slug: "hippam",
    projectId: "1309810d-6034-4c61-80ab-66aecbd1917c",
    gallery: [
      { mediaId: "e0110000-0000-4000-a000-000000000301", alt: "Dasbor Admin Next.js 16 Billing Air Bersih, Tarif Berjenjang & Analitik M3" },
      { mediaId: "e0110000-0000-4000-a000-000000000302", alt: "Portal Warga Catat Meter Mandiri & Verifikasi Foto Fisik Meteran Air" },
      { mediaId: "e0110000-0000-4000-a000-000000000303", alt: "Asisten AI Copilot Deteksi Kebocoran Pipa & Generator Tagihan WhatsApp" },
      { mediaId: "e0110000-0000-4000-a000-000000000304", alt: "Aplikasi Flutter Mobile Petugas Catat Meter & Portal Cek Tagihan Warga" },
    ],
  },
  {
    slug: "umkm-ku",
    projectId: "6283dca7-df55-41d8-b0b4-52ff3f5a469f",
    gallery: [
      { mediaId: "e0110000-0000-4000-a000-000000000401", alt: "Portal Direktori Usaha Warga RW 06 & Filter Kategori Usaha Terpadu" },
      { mediaId: "e0110000-0000-4000-a000-000000000402", alt: "Pemetaan Spasial GIS Lokasi Usaha Warga & Penunjuk Radius Jarak (Leaflet)" },
      { mediaId: "e0110000-0000-4000-a000-000000000403", alt: "Profil Lengkap Toko Usaha, Katalog Menu Produk & Direct Chat WhatsApp" },
      { mediaId: "e0110000-0000-4000-a000-000000000404", alt: "Dasbor Pemilik Usaha Mandiri & Alur Verifikasi Operator Berjenjang RW/Desa" },
    ],
  },
];

async function seedDatabase(databaseUrl: string, label: string, ipHashSalt: string) {
  console.log(`\n==================================================`);
  console.log(`Menjalankan Seeding Digital Store Proyek Nyata ke: ${label}`);
  console.log(`==================================================\n`);

  const client = postgres(databaseUrl, { max: 1 });
  try {
    // 0. Bersihkan produk yang tidak lagi ada di daftar REAL_PRODUCTS beserta
    //    media & paket privat miliknya, supaya tidak tersisa baris yatim.
    console.log("-> Membersihkan produk usang beserta media & paketnya...");
    const allowedProductIds = REAL_PRODUCTS.map((p) => p.id);

    const removedProducts = await client`
      SELECT id, thumbnail_media_id, gallery, private_file_id
      FROM digital_products
      WHERE id NOT IN ${client(allowedProductIds)}
    `;

    const removedMediaIds = new Set<string>();
    const removedFileIds = new Set<string>();
    for (const row of removedProducts) {
      if (row.thumbnail_media_id) removedMediaIds.add(row.thumbnail_media_id);
      for (const item of (row.gallery ?? []) as Array<{ mediaId?: string }>) {
        if (item?.mediaId) removedMediaIds.add(item.mediaId);
      }
      if (row.private_file_id) removedFileIds.add(row.private_file_id);
    }

    await client`
      DELETE FROM digital_reviews WHERE product_id NOT IN ${client(allowedProductIds)}
    `;
    await client`
      DELETE FROM digital_orders WHERE product_id NOT IN ${client(allowedProductIds)}
    `;
    await client`
      DELETE FROM digital_products WHERE id NOT IN ${client(allowedProductIds)}
    `;

    if (removedMediaIds.size > 0) {
      const ids = [...removedMediaIds];
      const deletedMedia = await client`
        DELETE FROM media WHERE id IN ${client(ids)} RETURNING id
      `;
      console.log(`   [Hapus] ${deletedMedia.length} baris media milik produk usang`);
    }
    if (removedFileIds.size > 0) {
      const ids = [...removedFileIds];
      const deletedFiles = await client`
        DELETE FROM private_files WHERE id IN ${client(ids)} RETURNING id
      `;
      console.log(`   [Hapus] ${deletedFiles.length} berkas privat milik produk usang`);
    }

    // 1. Upsert produk nyata
    console.log(`-> Upserting ${REAL_PRODUCTS.length} Real Digital Products...`);
    for (const p of REAL_PRODUCTS) {
      console.log(`   [Upsert] Produk '${p.title.slice(0, 40)}...' (${p.slug})`);
      await client`
        INSERT INTO digital_products (
          id, title, slug, product_type, tagline, summary,
          thumbnail_media_id, gallery, demo_url, video_url, video_key,
          related_project_id, price_single, price_commercial,
          compare_at_price_single, compare_at_price_commercial,
          setup_service_price, tech_stack, features, included_files,
          version, package_size_bytes, changelog, github_repo_info,
          is_featured, sales_count, rating_average, rating_count,
          status, sort_order
        ) VALUES (
          ${p.id}, ${p.title}, ${p.slug}, ${p.productType}, ${p.tagline}, ${p.summary},
          ${p.thumbnailMediaId}, ${client.json(p.gallery)}, ${p.demoUrl}, ${p.videoUrl}, ${p.videoKey},
          ${p.relatedProjectId}, ${p.priceSingle}, ${p.priceCommercial},
          ${p.compareAtPriceSingle}, ${p.compareAtPriceCommercial},
          ${p.setupServicePrice}, ${p.techStack}, ${p.features}, ${p.includedFiles},
          ${p.version}, ${p.packageSizeBytes}, ${p.changelog}, ${p.githubRepoInfo},
          ${p.isFeatured}, ${p.salesCount}, ${p.ratingAverage}, ${p.ratingCount},
          ${p.status}, ${p.sortOrder}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          product_type = EXCLUDED.product_type,
          tagline = EXCLUDED.tagline,
          summary = EXCLUDED.summary,
          thumbnail_media_id = EXCLUDED.thumbnail_media_id,
          gallery = EXCLUDED.gallery,
          demo_url = EXCLUDED.demo_url,
          video_url = EXCLUDED.video_url,
          video_key = EXCLUDED.video_key,
          related_project_id = EXCLUDED.related_project_id,
          price_single = EXCLUDED.price_single,
          price_commercial = EXCLUDED.price_commercial,
          compare_at_price_single = EXCLUDED.compare_at_price_single,
          compare_at_price_commercial = EXCLUDED.compare_at_price_commercial,
          setup_service_price = EXCLUDED.setup_service_price,
          tech_stack = EXCLUDED.tech_stack,
          features = EXCLUDED.features,
          included_files = EXCLUDED.included_files,
          version = EXCLUDED.version,
          package_size_bytes = EXCLUDED.package_size_bytes,
          changelog = EXCLUDED.changelog,
          github_repo_info = EXCLUDED.github_repo_info,
          is_featured = EXCLUDED.is_featured,
          sales_count = EXCLUDED.sales_count,
          rating_average = EXCLUDED.rating_average,
          rating_count = EXCLUDED.rating_count,
          status = EXCLUDED.status,
          sort_order = EXCLUDED.sort_order,
          updated_at = now()
      `;
    }

    // 2. Perbarui projects.gallery untuk 4 portfolio proyek
    console.log("-> Memperbarui projects.gallery pada tabel 'projects'...");
    for (const update of PORTFOLIO_GALLERY_UPDATES) {
      console.log(`   [Update] Proyek '${update.slug}' (${update.gallery.length} item galeri)`);
      await client`
        UPDATE projects
        SET gallery = ${client.json(update.gallery)}, updated_at = now()
        WHERE id = ${update.projectId}
      `;
    }

    // 3. Upsert Kupon
    console.log("-> Seeding digital_coupons...");
    for (const c of REAL_COUPONS) {
      console.log(`   [Upsert] Kupon '${c.code}'`);
      await client`
        INSERT INTO digital_coupons (
          id, code, description, discount_type, discount_value,
          min_order_amount, max_discount_amount, max_uses, used_count,
          is_active, expires_at
        ) VALUES (
          ${c.id}, ${c.code}, ${c.description}, ${c.discountType}, ${c.discountValue},
          ${c.minOrderAmount}, ${c.maxDiscountAmount}, ${c.maxUses}, ${c.usedCount},
          ${c.isActive}, ${c.expiresAt}
        )
        ON CONFLICT (id) DO UPDATE SET
          code = EXCLUDED.code,
          description = EXCLUDED.description,
          discount_type = EXCLUDED.discount_type,
          discount_value = EXCLUDED.discount_value,
          min_order_amount = EXCLUDED.min_order_amount,
          max_discount_amount = EXCLUDED.max_discount_amount,
          max_uses = EXCLUDED.max_uses,
          used_count = EXCLUDED.used_count,
          is_active = EXCLUDED.is_active,
          expires_at = EXCLUDED.expires_at,
          updated_at = now()
      `;
    }

    // 4. Upsert Pesanan
    //    `access_pin_hash` memakai skema scrypt yang sama dengan runtime
    //    (hashTrackingPin), dan `license_fingerprint` diturunkan dari
    //    createLicenseFingerprint agar lolos validasi Zod (24 char hex uppercase).
    console.log("-> Seeding digital_orders...");
    for (const o of REAL_ORDERS) {
      const accessPinHash = await hashTrackingPin(o.accessPin);
      const fingerprint = licenseFingerprint(
        o.orderCode,
        o.buyerEmail,
        o.buyerWhatsapp,
        ipHashSalt,
      );
      console.log(
        `   [Upsert] Pesanan '${o.orderCode}' (${o.buyerName}) — PIN ${o.accessPin}, fingerprint ${fingerprint}`,
      );
      await client`
        INSERT INTO digital_orders (
          id, order_code, product_id, license_tier, buyer_name,
          buyer_whatsapp, buyer_email, buyer_github, notes, amount,
          base_amount, setup_fee_amount, discount_amount, coupon_code,
          include_setup_service, payment_status, access_pin_hash,
          pin_version, license_fingerprint, download_count, max_downloads,
          expires_at, is_revoked, paid_at
        ) VALUES (
          ${o.id}, ${o.orderCode}, ${o.productId}, ${o.licenseTier}, ${o.buyerName},
          ${o.buyerWhatsapp}, ${o.buyerEmail}, ${o.buyerGithub}, ${o.notes}, ${o.amount},
          ${o.baseAmount}, ${o.setupFeeAmount}, ${o.discountAmount}, ${o.couponCode},
          ${o.includeSetupService}, ${o.paymentStatus}, ${accessPinHash},
          ${o.pinVersion}, ${fingerprint}, ${o.downloadCount}, ${o.maxDownloads},
          ${o.expiresAt}, ${o.isRevoked}, ${o.paidAt}
        )
        ON CONFLICT (id) DO UPDATE SET
          order_code = EXCLUDED.order_code,
          product_id = EXCLUDED.product_id,
          license_tier = EXCLUDED.license_tier,
          buyer_name = EXCLUDED.buyer_name,
          buyer_whatsapp = EXCLUDED.buyer_whatsapp,
          buyer_email = EXCLUDED.buyer_email,
          buyer_github = EXCLUDED.buyer_github,
          notes = EXCLUDED.notes,
          amount = EXCLUDED.amount,
          base_amount = EXCLUDED.base_amount,
          setup_fee_amount = EXCLUDED.setup_fee_amount,
          discount_amount = EXCLUDED.discount_amount,
          coupon_code = EXCLUDED.coupon_code,
          include_setup_service = EXCLUDED.include_setup_service,
          payment_status = EXCLUDED.payment_status,
          access_pin_hash = EXCLUDED.access_pin_hash,
          pin_version = EXCLUDED.pin_version,
          license_fingerprint = EXCLUDED.license_fingerprint,
          download_count = EXCLUDED.download_count,
          max_downloads = EXCLUDED.max_downloads,
          expires_at = EXCLUDED.expires_at,
          is_revoked = EXCLUDED.is_revoked,
          paid_at = EXCLUDED.paid_at,
          updated_at = now()
      `;
    }

    // 5. Upsert Ulasan
    console.log("-> Seeding digital_reviews...");
    for (const r of REAL_REVIEWS) {
      console.log(`   [Upsert] Ulasan dari '${r.buyerName}'`);
      await client`
        INSERT INTO digital_reviews (
          id, product_id, order_id, buyer_name, license_tier,
          rating, comment, media_items, status, admin_reply
        ) VALUES (
          ${r.id}, ${r.productId}, ${r.orderId}, ${r.buyerName}, ${r.licenseTier},
          ${r.rating}, ${r.comment}, ${client.json(r.mediaItems)}, ${r.status}, ${r.adminReply}
        )
        ON CONFLICT (id) DO UPDATE SET
          product_id = EXCLUDED.product_id,
          order_id = EXCLUDED.order_id,
          buyer_name = EXCLUDED.buyer_name,
          license_tier = EXCLUDED.license_tier,
          rating = EXCLUDED.rating,
          comment = EXCLUDED.comment,
          media_items = EXCLUDED.media_items,
          status = EXCLUDED.status,
          admin_reply = EXCLUDED.admin_reply,
          updated_at = now()
      `;
    }

    console.log(`\nSelesai seeding untuk: ${label}!\n`);
  } finally {
    await client.end({ timeout: 5 });
  }
}

async function main() {
  const env = getEnv();
  // 1. Seed primary App DB
  await seedDatabase(env.DATABASE_URI, "App Database (DATABASE_URI)", env.IP_HASH_SALT);

  // 2. Seed Direct DB if configured
  const directUri = process.env.DATABASE_URI_DIRECT || process.env.DATABASE_DIRECT_URL;
  if (directUri && directUri !== env.DATABASE_URI) {
    await seedDatabase(directUri, "Dev Database (DATABASE_URI_DIRECT)", env.IP_HASH_SALT);
  }
}

main()
  .then(() => {
    console.log("=== Seeding 4 Proyek Nyata Store Berhasil 100%! ===");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Gagal melakukan seeding proyek nyata store:", err);
    process.exit(1);
  });
