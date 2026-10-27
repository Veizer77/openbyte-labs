import 'dotenv/config'

import { getPayload } from 'payload'

process.env.PAYLOAD_SEEDING = '1'
const { default: configPromise, databaseAdapterArgs } = await import('../src/payload.config.ts')
const config = await configPromise

// Tampilkan identitas target database (tanpa kredensial) agar operator
// tahu persis ke mana data awal ditulis.
function logDatabaseTarget(adapterArgs) {
  try {
    const uri = new URL(adapterArgs.pool.connectionString)
    console.log(`Target database: ${uri.hostname}/${uri.pathname.replace(/^\//, '')}`)
  } catch {
    console.log('Target database: (tidak dapat diuraikan)')
  }
}
logDatabaseTarget(databaseAdapterArgs())

const payload = await getPayload({ config })

async function createIfMissing(collection, field, value, data) {
  const match = await payload.find({
    collection,
    where: { [field]: { equals: value } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (match.docs[0]) return match.docs[0]
  return payload.create({ collection, data, depth: 0, overrideAccess: true })
}

function lexicalParagraph(text) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text, version: 1 }],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function fillMissing(current, seed) {
  const missing = {}
  for (const [key, seedValue] of Object.entries(seed)) {
    if (current?.[key] === undefined) {
      missing[key] = seedValue
    } else if (
      seedValue &&
      typeof seedValue === 'object' &&
      !Array.isArray(seedValue) &&
      current[key] &&
      typeof current[key] === 'object' &&
      !Array.isArray(current[key])
    ) {
      const nested = fillMissing(current[key], seedValue)
      if (Object.keys(nested).length) missing[key] = nested
    }
  }
  return missing
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

try {
  const categorySeed = [
    ['instansi-pemdes', 'Instansi / Pemdes'],
    ['aplikasi-mobile', 'Aplikasi Mobile (Flutter)'],
    ['bisnis-umkm', 'Bisnis & UMKM'],
    ['undangan-digital-event', 'Undangan Digital & Event'],
  ]
  const categories = new Map()
  for (const [slug, name] of categorySeed) {
    categories.set(
      slug,
      await createIfMissing('categories', 'slug', slug, {
        slug,
        name,
        isActive: true,
        showInFilter: true,
      }),
    )
  }

  const services = [
    [
      'Sistem Informasi & Satu Data',
      'Sistem terpadu untuk data wilayah dan layanan publik: dari peta GIS sampai otomasi permohonan surat.',
      'database',
      'wide',
      ['Peta wilayah RT/RW', 'Profil warga terpadu', 'Surat ber-QR'],
    ],
    [
      'Aplikasi Mobile Lintas Platform',
      'Aplikasi Android dengan Flutter, termasuk fitur kamera, penyimpanan offline, dan integrasi API.',
      'smartphone',
      'tall',
      ['Flutter', 'Kamera & offline', 'Integrasi API'],
    ],
    [
      'Website Bisnis & UMKM',
      'Landing page, profil usaha, dan katalog dengan pemesanan lewat WhatsApp.',
      'globe',
      'normal',
      ['Responsif', 'SEO dasar', 'Pesan via WhatsApp'],
    ],
    [
      'Undangan Digital Interaktif',
      'Undangan web dengan animasi, musik, dan RSVP yang terhubung ke spreadsheet.',
      'mail',
      'normal',
      ['Animasi', 'Musik latar', 'RSVP terhubung spreadsheet'],
    ],
  ]
  for (const [title, description, icon, size, highlights] of services) {
    await createIfMissing('services', 'title', title, {
      title,
      description,
      icon,
      size,
      isActive: true,
      highlights: highlights.map((text) => ({ text })),
    })
  }

  const technologySeed = [
    'Next.js 14', 'PostGIS 3', 'InsForge (Postgres)', 'Leaflet GIS', 'QR Surat',
    'React 18 SPA', 'Vite', 'InsForge SDK', 'Vitest', 'Next.js 16', 'Flutter 3.x (Dart)',
    'Supabase PostgreSQL', 'RLS', 'React Router v7', 'Neon Serverless Postgres', 'AWS S3',
    'HTML5 Semantic', 'Modern CSS', 'WhatsApp Direct Booking', 'HTML5 Canvas', 'Web Audio API',
    'Sheet RSVP Sync',
  ]
  const technologies = new Map()
  for (const name of technologySeed) {
    const slug = slugify(name)
    technologies.set(slug, await createIfMissing('technologies', 'name', name, { name, slug }))
  }

  const projectSeed = [
    {
      slug: 'sinduksadati', title: 'SINDUKSADATI (Satu Data RW 06 Mojorejo)',
      tagline: 'Satu data wilayah RW dengan peta GIS dan otomasi surat.',
      summary: 'Sistem satu data untuk RW 06 Mojorejo: peta batas wilayah RT/RW, profil warga terpadu (Citizen 360), dan otomasi permohonan surat dengan QR.',
      categorySlugs: ['instansi-pemdes'], techNames: ['Next.js 14', 'PostGIS 3', 'InsForge (Postgres)', 'Leaflet GIS', 'QR Surat'],
    },
    {
      slug: 'sipandu-posyandu', title: 'SIPANDU / Posyandu (Flamboyan RW 06)',
      tagline: 'Alur 5-Meja Posyandu dan deteksi dini stunting.',
      summary: 'Sistem informasi Posyandu Flamboyan RW 06 dengan alur 5-Meja Kemenkes, kalkulator Z-Score WHO 2006, dan deteksi dini stunting (2T).',
      categorySlugs: ['instansi-pemdes'], techNames: ['React 18 SPA', 'Vite', 'InsForge SDK', 'Vitest'],
    },
    {
      slug: 'hippam-web-mobile', title: 'HIPPAM Web & Mobile',
      tagline: 'Pencatatan meter air swadaya, web dan mobile.',
      summary: 'Aplikasi web dan mobile untuk pembacaan meter air swadaya, dengan kompresi foto meteran dan tarif berjenjang.',
      categorySlugs: ['instansi-pemdes', 'aplikasi-mobile'], techNames: ['Next.js 16', 'Flutter 3.x (Dart)', 'Supabase PostgreSQL', 'RLS'],
    },
    {
      slug: 'umkm-ku', title: 'UMKM-KU',
      tagline: 'Direktori UMKM warga dengan checkout WhatsApp.',
      summary: 'Direktori UMKM warga dengan verifikasi NIK melalui SINDUKSADATI dan pemesanan lewat WhatsApp.',
      categorySlugs: ['bisnis-umkm'], techNames: ['React Router v7', 'Neon Serverless Postgres', 'AWS S3'],
    },
    {
      slug: 'terapis-jogoroto', title: 'Terapis Jogoroto (Pijat Akupresur STPT)',
      tagline: 'Landing page pijat akupresur dengan booking WhatsApp.',
      summary: 'Landing page bernuansa emas hangat untuk pijat akupresur, dengan alur terapi lima langkah dan pemesanan langsung lewat WhatsApp.',
      categorySlugs: ['bisnis-umkm'], techNames: ['HTML5 Semantic', 'Modern CSS', 'WhatsApp Direct Booking'],
    },
    {
      slug: 'prewed-undangan-digital', title: 'Prewed (Undangan Digital)',
      tagline: 'Undangan digital dengan amplop 3D dan RSVP.',
      summary: 'Undangan digital dengan animasi kelopak, amplop 3D bersegel lilin, musik latar, dan RSVP yang tersinkron ke spreadsheet.',
      categorySlugs: ['undangan-digital-event'], techNames: ['HTML5 Canvas', 'Web Audio API', 'Sheet RSVP Sync'],
    },
  ]
  for (const project of projectSeed) {
    const { categorySlugs, techNames, ...data } = project
    await createIfMissing('projects', 'slug', project.slug, {
      ...data,
      categories: categorySlugs.map((slug) => categories.get(slug).id),
      technologies: techNames.map((name) => technologies.get(slugify(name)).id),
      isFeatured: false,
      _status: 'draft',
    })
  }

  const faqSeed = [
    ['Berapa biaya membuat website atau aplikasi?', 'Biaya bergantung pada jenis solusi dan fiturnya. Gunakan kalkulator di beranda untuk estimasi awal, atau lihat tiga paket kami. Harga final ditetapkan setelah konsultasi kebutuhan.'],
    ['Berapa lama pengerjaannya?', 'Perkiraan: 7 hari kerja (Starter), 21 hari kerja (Sistem Informasi), dan 30 hari kerja (Aplikasi Mobile), dihitung sejak kebutuhan dan materi lengkap.'],
    ['Apakah domain dan hosting sudah termasuk?', 'Biaya domain dan hosting pihak ketiga ditanggung klien. Paket Starter sudah termasuk pemasangan awal; untuk paket lain, layanan setup tersedia sebagai add-on.'],
    ['Berapa kali saya boleh meminta revisi?', 'Kuota revisi mengikuti paket: 2, 3, atau 4 kali. Revisi tambahan dikenakan biaya per revisi. Perbaikan bug tidak dihitung sebagai revisi. Rincian ada di kebijakan revisi.'],
    ['Bagaimana alur pengerjaannya?', 'Enam tahap: kebutuhan dan kontrak, desain, coding, pengujian, review dan revisi, lalu deployment dan serah terima.'],
    ['Bisakah saya konsultasi dulu?', 'Bisa. Pilih jadwal di halaman Konsultasi; sesi dapat lewat Google Meet, telepon WhatsApp, atau tatap muka.'],
    ['Bagaimana pembayarannya?', 'Pembayaran lewat transfer, tunai, atau QRIS. Skema uang muka dan pelunasan disepakati dalam kontrak untuk setiap proyek.'],
    ['Apakah tersedia perawatan setelah selesai?', 'Ya, sebagai add-on: maintenance bulanan atau tahunan (perbaikan bug, pembaruan kecil, dan backup).'],
    ['Apakah data yang saya kirim aman?', 'Data dipakai hanya untuk menanggapi permintaan Anda dan dikelola sesuai Kebijakan Privasi.'],
  ]
  for (const [question, answer] of faqSeed) {
    await createIfMissing('faqs', 'question', question, {
      question,
      answer: lexicalParagraph(answer),
      isActive: true,
    })
  }

  const packageSeed = [
    {
      slug: 'starter-umkm-bisnis',
      name: 'Starter UMKM & Bisnis',
      category: 'bisnis-umkm',
      price: 1_000_000,
      estimatedDays: 7,
      includedRevisions: 2,
      extraRevisionPrice: 100_000,
      features: [
        'Landing/profil hingga 5 halaman',
        'Responsif',
        'Tombol WhatsApp',
        'SEO dasar',
        'Setup domain & hosting',
      ],
    },
    {
      slug: 'sistem-informasi-instansi',
      name: 'Sistem Informasi / Instansi',
      category: 'instansi-pemdes',
      price: 3_500_000,
      estimatedDays: 21,
      includedRevisions: 3,
      extraRevisionPrice: 250_000,
      features: ['Database terintegrasi', 'Multi-role', 'Dashboard', 'Ekspor laporan'],
    },
    {
      slug: 'mobile-application-flutter',
      name: 'Mobile Application (Flutter)',
      category: 'aplikasi-mobile',
      price: 4_500_000,
      estimatedDays: 30,
      includedRevisions: 4,
      extraRevisionPrice: 300_000,
      features: ['Android native-feel', 'Penyimpanan offline', 'Kamera', 'Integrasi API'],
    },
  ]
  for (const item of packageSeed) {
    const { category, ...data } = item
    await createIfMissing('service-packages', 'slug', data.slug, {
      ...data,
      category: categories.get(category).id,
      billingType: 'one_time',
      isPopular: false,
      isActive: true,
      features: data.features.map((text) => ({ text })),
    })
  }

  const addons = [
    ['Maintenance bulanan (bug fix, update minor, backup)', 150_000, 'monthly'],
    ['Maintenance tahunan', 1_500_000, 'yearly'],
    ['Pelatihan admin (1 sesi, hingga 2 jam, online)', 250_000, 'one_time'],
    ['Setup domain & hosting (di luar paket Starter)', 200_000, 'one_time'],
  ]
  for (const [name, price, billingType] of addons) {
    await createIfMissing('service-addons', 'name', name, {
      name,
      description: '',
      price,
      billingType,
      isActive: true,
    })
  }

  const groupSeed = [
    ['platform', 'Platform', 'Pilih platform aplikasi.', 'single', true],
    ['jenis-solusi', 'Jenis Solusi', 'Pilih jenis solusi yang dibutuhkan.', 'single', true],
    [
      'modul-tambahan',
      'Modul Tambahan',
      'Pilih modul tambahan bila diperlukan.',
      'multiple',
      false,
    ],
  ]
  const groups = new Map()
  for (const [slug, title, description, selectionType, isRequired] of groupSeed) {
    groups.set(
      slug,
      await createIfMissing('calculator-groups', 'title', title, {
        title,
        description,
        selectionType,
        isRequired,
        isActive: true,
      }),
    )
  }

  const itemSeed = [
    {
      slug: 'web-saja',
      group: 'platform',
      label: 'Web Saja (default)',
      priceMin: 0,
      priceMax: 0,
      daysMin: 0,
      daysMax: 0,
      isDefault: true,
    },
    {
      slug: 'mobile-android',
      group: 'platform',
      label: 'Mobile Android Saja (Flutter)',
      priceMin: 1_500_000,
      priceMax: 2_500_000,
      daysMin: 10,
      daysMax: 14,
    },
    {
      slug: 'web-android',
      group: 'platform',
      label: 'Web + Android (Flutter)',
      priceMin: 2_500_000,
      priceMax: 4_000_000,
      daysMin: 14,
      daysMax: 21,
    },
    {
      slug: 'landing-page',
      group: 'jenis-solusi',
      label: 'Landing Page Profil',
      priceMin: 600_000,
      priceMax: 1_200_000,
      daysMin: 3,
      daysMax: 5,
      excludes: ['mobile-android', 'web-android'],
    },
    {
      slug: 'katalog-toko-online',
      group: 'jenis-solusi',
      label: 'Katalog & Toko Online (checkout WhatsApp)',
      priceMin: 1_500_000,
      priceMax: 2_500_000,
      daysMin: 7,
      daysMax: 10,
    },
    {
      slug: 'sistem-informasi-database',
      group: 'jenis-solusi',
      label: 'Sistem Informasi Database',
      priceMin: 2_500_000,
      priceMax: 3_500_000,
      daysMin: 14,
      daysMax: 21,
    },
    {
      slug: 'undangan-digital',
      group: 'jenis-solusi',
      label: 'Undangan Digital',
      priceMin: 400_000,
      priceMax: 1_000_000,
      daysMin: 2,
      daysMax: 4,
      excludes: ['mobile-android', 'web-android'],
    },
    {
      slug: 'multi-user-rbac',
      group: 'modul-tambahan',
      label: 'Multi-User RBAC',
      priceMin: 500_000,
      priceMax: 1_000_000,
      daysMin: 2,
      daysMax: 3,
      requires: 'sistem-informasi-database',
    },
    {
      slug: 'pemetaan-gis',
      group: 'modul-tambahan',
      label: 'Pemetaan Wilayah (GIS & Geolocation)',
      priceMin: 1_000_000,
      priceMax: 2_000_000,
      daysMin: 4,
      daysMax: 6,
      requires: 'sistem-informasi-database',
    },
    {
      slug: 'cetak-laporan',
      group: 'modul-tambahan',
      label: 'Cetak Laporan (PDF & Excel)',
      priceMin: 400_000,
      priceMax: 800_000,
      daysMin: 2,
      daysMax: 3,
      requires: 'sistem-informasi-database',
    },
    {
      slug: 'notifikasi-whatsapp',
      group: 'modul-tambahan',
      label: 'Notifikasi / Gateway WhatsApp Otomatis',
      priceMin: 500_000,
      priceMax: 1_000_000,
      daysMin: 2,
      daysMax: 3,
    },
    {
      slug: 'integrasi-pembayaran',
      group: 'modul-tambahan',
      label: 'Integrasi Pembayaran (QRIS / Payment Gateway)',
      priceMin: 700_000,
      priceMax: 1_500_000,
      daysMin: 3,
      daysMax: 5,
    },
    {
      slug: 'halaman-tambahan',
      group: 'modul-tambahan',
      label: 'Halaman Tambahan',
      pricingType: 'per_unit',
      unitLabel: 'halaman',
      maxUnits: 20,
      priceMin: 75_000,
      priceMax: 150_000,
      daysMin: 0,
      daysMax: 0,
    },
  ]
  const calculatorItems = new Map()
  for (const item of itemSeed) {
    const { slug: _slug, requires: _requires, excludes: _excludes, group, ...data } = item
    calculatorItems.set(
      item.slug,
      await createIfMissing('calculator-items', 'label', item.label, {
        ...data,
        group: groups.get(group).id,
        pricingType: data.pricingType ?? 'flat',
        daysMax: data.daysMax ?? data.daysMin,
        isDefault: Boolean(data.isDefault),
        isActive: true,
      }),
    )
  }
  for (const item of itemSeed.filter((entry) => entry.requires || entry.excludes?.length)) {
    const existing = calculatorItems.get(item.slug)
    if (!existing.rules?.length) {
      const rules = [
        ...(item.requires ? [{ key: item.requires, ruleType: 'requires' }] : []),
        ...(item.excludes ?? []).map((key) => ({ key, ruleType: 'excludes' })),
      ].map(({ key, ruleType }) => ({
        relatedItem: calculatorItems.get(key).id,
        ruleType,
      }))
      await payload.update({
        collection: 'calculator-items',
        id: existing.id,
        data: { rules },
        overrideAccess: true,
      })
    }
  }

  const weekdays = [1, 2, 3, 4, 5]
  for (const weekday of weekdays) {
    for (const [startTime, endTime] of [
      ['09:00', '11:00'],
      ['13:00', '15:00'],
      ['16:00', '18:00'],
      ['19:30', '21:30'],
    ]) {
      const match = await payload.find({
        collection: 'availability-rules',
        where: { and: [{ weekday: { equals: weekday } }, { startTime: { equals: startTime } }] },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (!match.docs[0]) {
        await payload.create({
          collection: 'availability-rules',
          data: { weekday, startTime, endTime, isActive: true },
          overrideAccess: true,
        })
      }
    }
  }

  const settingsSeed = {
    general: {
      brandName: 'OpenByte Labs',
      whatsappNumber: '0895386011371',
      contactEmail: 'izzatfarahidi@gmail.com',
    },
    hero: {
      headline: 'Bangun sistem, aplikasi, dan website yang benar-benar dipakai.',
      subheadline: 'OpenByte Labs membuat sistem informasi, aplikasi mobile Flutter, website bisnis, dan undangan digital untuk instansi, UMKM, dan komunitas.',
      primaryCtaLabel: 'Hitung Estimasi Biaya',
      secondaryCtaLabel: 'Chat via WhatsApp',
    },
    navigation: {
      menuItems: [
        { label: 'Beranda', target: '/', isActive: true },
        { label: 'Layanan', target: '/#layanan', isActive: true },
        { label: 'Portofolio', target: '/proyek', isActive: true },
        { label: 'Paket', target: '/paket', isActive: true },
        { label: 'Kalkulator', target: '/kalkulator', isActive: true },
        { label: 'Konsultasi', target: '/konsultasi', isActive: true },
      ],
      footerText: '© {tahun} OpenByte Labs. Semua hak dilindungi.',
    },
    seo: {
      defaultTitle: 'OpenByte Labs: Website, Aplikasi Mobile & Sistem Informasi',
      defaultDescription: 'Software house personal untuk website bisnis, aplikasi mobile Flutter, sistem informasi, dan undangan digital. Hitung estimasi biaya dan jadwalkan konsultasi.',
    },
    whatsapp: {
      tplCalculator: 'Halo OpenByte Labs, saya {nama} tertarik membuat aplikasi dengan rincian berikut:\n{rincian}\nEstimasi Kalkulator: {estimasi_harga} ({estimasi_durasi})\nReferensi: {referensi}\nMohon info ketersediaan jadwal pengerjaan. Terima kasih!',
      tplBookingConfirm: 'Halo {nama}, konsultasi Anda pada {tanggal} pukul {jam} WIB sudah dikonfirmasi.\nLink pertemuan: {meeting_url}\nReferensi: {referensi}',
      tplTrackingLink: 'Halo {nama}, proyek "{nama_proyek}" dapat dipantau di {link_tracking}\nKode Tracking: {kode_tracking}\nPIN akan saya kirim terpisah.',
      tplRevisionNotice: 'Halo {nama}, permintaan revisi "{judul_revisi}" sudah saya tinjau. Sisa kuota revisi: {sisa_kuota}.\nDetail lengkap ada di halaman tracking proyek Anda.',
    },
    calculator: { minimumPrice: 500_000, showRange: true },
    booking: {
      slotDurationMinutes: 60,
      bufferMinutes: 0,
      minDaysAhead: 1,
      maxDaysAhead: 30,
      availableModes: ['google_meet', 'whatsapp_call', 'offline'],
    },
    tracking: {
      trackingEnabled: false,
      revisionWindowDays: 14,
      bugWarrantyDays: 30,
      maxLoginAttempts: 5,
      lockMinutes: 15,
      sessionMinutes: 120,
    },
  }
  const currentSettings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  const settingsToFill = fillMissing(currentSettings, settingsSeed)
  if (Object.keys(settingsToFill).length) await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: settingsToFill,
  })

  payload.logger.info(
    'Initial content created where missing. Existing records were left unchanged.',
  )
} finally {
  await payload.destroy()
}
