import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

const projectData: Record<
  string,
  {
    title: string
    subtitle: string
    client: string
    year: string
    category: string
    version: string
    summary: string
    challenge: string
    solution: string
    impact: string[]
    tech: string[]
    metrics: { label: string; value: string; desc: string }[]
    image: string
  }
> = {
  sinduksadati: {
    title: 'SINDUKSADATI — Satu Data Kependudukan & GIS Desa',
    subtitle: 'Sistem Informasi Kependudukan Presisi & Tata Kelola Batas Wilayah Digital',
    client: 'Pemerintah Desa Sedati / RW 06 Mojorejo',
    year: '2025–2026',
    category: 'Pemerintahan Publik & Geospasial',
    version: 'PRODUCTION LIVE • V2.4.1',
    summary:
      'Digitalisasi menyeluruh tata kelola kependudukan terpadu, pemetaan batas wilayah berbasis spasial (GIS), dan penerbitan persuratan warga berstempel barcode QR kriptografis.',
    challenge:
      'Pencatatan kependudukan berbasis berkas kertas rentan rusak, pemutakhiran data sensus lambat, dan verifikasi tanda tangan surat rawan dipalsukan.',
    solution:
      'Membangun platform cloud berbasis Next.js dan PostgreSQL dengan arsitektur multi-tenant berorientasi peran (RW/RT/Admin Desa). Dilengkapi penandatanganan dokumen elektronik ber-QR hash dan visualisasi geospasial sebaran demografi.',
    impact: [
      'Memangkas waktu penerbitan surat pengantar dari 2 hari menjadi 3 menit.',
      'Mencapai 100% verifikasi barcode dokumen tanpa ada dokumen ganda atau palsu.',
      'Data 4,850+ warga terindeks secara akurat dengan sinkronisasi instan.',
    ],
    tech: ['Next.js App Router', 'PostgreSQL Neon', 'Mapbox GIS', 'Better Auth', 'Tailwind CSS', 'Docker'],
    metrics: [
      { label: 'Warga Terdata', value: '4,850+', desc: '100% validasi NIK' },
      { label: 'Efisiensi Waktu', value: '98%', desc: 'Dari 2 hari ke 3 menit' },
      { label: 'Uptime Sistem', value: '99.9%', desc: 'Zero data collision' },
    ],
    image: '/images/f40eddcc52e0adef.jpg',
  },
  sipandu: {
    title: 'SIPANDU — Rekam Medis Anak & Kader Offline-First',
    subtitle: 'Aplikasi Pertumbuhan Balita & Buku KIA Berstandar WHO',
    client: 'Dinas Kesehatan Wilayah & Kader Posyandu',
    year: '2025–2026',
    category: 'Layanan Kesehatan Masyarakat',
    version: 'PRODUCTION LIVE • V1.8.0',
    summary:
      'Aplikasi mobile Flutter offline-first untuk operasional kader posyandu dalam mencatat kurva pertumbuhan balita, stunting risk assessment, dan vaksinasi tanpa jaringan internet.',
    challenge:
      'Kader posyandu sering beroperasi di daerah terpencil tanpa konektivitas seluler, menyebabkan keterlambatan rekapitulasi data gizi balita ke puskesmas pusat.',
    solution:
      'Mengembangkan arsitektur database lokal SQLite terenkripsi dengan protokol sinkronisasi delta otomatis saat perangkat kembali mendeteksi sinyal internet.',
    impact: [
      'Rekapitulasi kurva pertumbuhan WHO langsung terhitung seketika tanpa kalkulasi manual.',
      'Sinkronisasi 12 posyandu aktif tanpa kegagalan integritas data.',
      'Deteksi dini risiko stunting meningkat 40% lebih cepat.',
    ],
    tech: ['Flutter', 'Dart', 'SQLite', 'FastAPI', 'Docker', 'PostgreSQL'],
    metrics: [
      { label: 'Posyandu Aktif', value: '12', desc: 'Tersebar di 3 kecamatan' },
      { label: 'Balita Terpantau', value: '1,420+', desc: 'Pencatatan kurva rutin' },
      { label: 'Sinkronisasi', value: '100%', desc: 'Tanpa konflik data' },
    ],
    image: '/images/6e9d8c47439268a8.jpg',
  },
  hippam: {
    title: 'HIPPAM — Smart Water Meter & Otomasi Billing',
    subtitle: 'Sistem Telemetri Meteran Air Bersih & Notifikasi Tagihan WhatsApp',
    client: 'Pengelola Sarana Air Bersih Mandiri',
    year: '2025',
    category: 'Utilitas Publik & Otomasi',
    version: 'PRODUCTION LIVE • V2.1.0',
    summary:
      'Sistem audit meter air dan otomasi penagihan bulanan terintegrasi WhatsApp gateway langsung ke nomor pelanggan, memudahkan pembayaran tepat waktu.',
    challenge:
      'Petugas pencatat meter air harus merekap meteran secara manual dari rumah ke rumah dan membagikan slip kertas yang sering hilang.',
    solution:
      'Platform pencatatan angka meter via kamera web app, kalkulasi tarif berbasis kubikasi pemakaian, serta penerbitan invoice PDF otomatis via WhatsApp API.',
    impact: [
      'Meningkatkan rasio pelunasan tagihan tepat waktu hingga 99.4%.',
      'Mengurangi biaya operasional cetak kertas hingga 100%.',
      'Keluhan selisih perhitungan meter turun drastis karena bukti foto terlampir.',
    ],
    tech: ['React', 'Node.js', 'WhatsApp Business API', 'PostgreSQL', 'Tailwind CSS'],
    metrics: [
      { label: 'Pelanggan Aktif', value: '1,200+', desc: 'Keluarga terlayani' },
      { label: 'Ketepatan Bayar', value: '99.4%', desc: 'Sebelum tanggal 10' },
      { label: 'Efisiensi Kertas', value: '100%', desc: 'Paperless via WA' },
    ],
    image: '/images/34c0bcdeb733122c.jpg',
  },
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = projectData[slug]

  if (!project) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[12px] text-[#71717a]">
        <Link href="/" className="hover:text-[#18181a]">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/portofolio" className="hover:text-[#18181a]">
          Portofolio
        </Link>
        <span>/</span>
        <span className="font-medium text-[#18181a]">{project.title.split('—')[0]}</span>
      </nav>

      {/* Header Proyek */}
      <div className="flex flex-col gap-4 border-b border-[#eaeaea] pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-full bg-[#f0f0f0] px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-[#82b440]"></span>
            <span className="text-[11px] font-semibold tracking-wider text-[#52525b] uppercase">
              {project.version}
            </span>
          </div>
          <div className="text-[12px] text-[#71717a]">
            Tahun Pengerjaan: <span className="font-semibold text-[#18181a]">{project.year}</span>
          </div>
        </div>

        <h1 className="text-[30px] font-bold tracking-tight text-[#18181a] sm:text-[36px]">
          {project.title}
        </h1>
        <p className="max-w-3xl text-[15px] leading-relaxed text-[#52525b]">
          {project.subtitle}
        </p>

        <div className="flex flex-wrap gap-4 pt-2 text-[13px]">
          <div>
            <span className="text-[#71717a]">Klien: </span>
            <span className="font-medium text-[#18181a]">{project.client}</span>
          </div>
          <div>
            <span className="text-[#71717a]">Kategori: </span>
            <span className="font-medium text-[#18181a]">{project.category}</span>
          </div>
        </div>
      </div>

      {/* Visual Mockup & Hero Metric Bento */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="relative h-[360px] overflow-hidden rounded-2xl border border-[#eaeaea] bg-[#f0f0f0] lg:col-span-8">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
        </div>

        {/* Kartu Metrik */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-[#18181a] p-6 text-white lg:col-span-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold tracking-wider text-[#d2d88f] uppercase">
              Dampak Terverifikasi
            </span>
            <h3 className="text-[18px] font-semibold text-white">Metrik Produksi Nyata</h3>
          </div>

          <div className="flex flex-col gap-4">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="rounded-xl bg-[#242427] p-3.5">
                <div className="text-[11px] text-[#a8a8ad]">{m.label}</div>
                <div className="text-[22px] font-bold text-[#82b440]">{m.value}</div>
                <div className="text-[11px] text-[#71717a]">{m.desc}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#2e2e32] pt-3 text-[11px] text-[#a8a8ad]">
            Data audit operasional tervalidasi klien
          </div>
        </div>
      </div>

      {/* Studi Kasus & Arsitektur */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          {/* Ringkasan */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[20px] font-semibold text-[#18181a]">Ringkasan Eksekutif</h2>
            <p className="text-[14px] leading-relaxed text-[#52525b]">{project.summary}</p>
          </div>

          {/* Tantangan */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#eaeaea] bg-white p-6 shadow-sm">
            <h3 className="text-[18px] font-semibold text-[#18181a]">Tantangan Awal</h3>
            <p className="text-[14px] leading-relaxed text-[#52525b]">{project.challenge}</p>
          </div>

          {/* Solusi Rekayasa */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#eaeaea] bg-white p-6 shadow-sm">
            <h3 className="text-[18px] font-semibold text-[#18181a]">Solusi Rekayasa & Arsitektur</h3>
            <p className="text-[14px] leading-relaxed text-[#52525b]">{project.solution}</p>
          </div>

          {/* Hasil & Dampak */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#eaeaea] bg-[#f9f9f9] p-6">
            <h3 className="text-[18px] font-semibold text-[#18181a]">Dampak & Efisiensi Operasional</h3>
            <ul className="flex flex-col gap-2">
              {project.impact.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[14px] text-[#52525b]">
                  <span className="material-symbols-outlined mt-0.5 text-[16px] text-[#82b440]">
                    check_circle
                  </span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar Teknologi & CTA */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          <div className="flex flex-col gap-4 rounded-2xl border border-[#eaeaea] bg-white p-6 shadow-sm">
            <h3 className="text-[16px] font-semibold text-[#18181a]">Stack Teknologi</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-lg bg-[#f0f0f0] px-3 py-1.5 text-[12px] font-medium text-[#18181a]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-[#eaeaea] bg-[#f0f0f0] p-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-[16px] font-semibold text-[#18181a]">
                Membutuhkan Solusi Serupa?
              </h3>
              <p className="text-[13px] text-[#52525b]">
                Diskusikan arsitektur dan kebutuhan sistem instansi Anda langsung bersama Lead Engineer.
              </p>
            </div>
            <Link
              href="/layanan"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#18181a] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#242427]"
            >
              <span>Konsultasi Proyek</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
