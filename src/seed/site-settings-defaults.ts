import {
  settingsDocumentSchema,
  type SettingsDocument,
} from "@/schemas/site-settings";

const text = (value: string) => ({ type: "text" as const, text: value });
const paragraph = (value: string) => ({
  type: "paragraph" as const,
  children: [text(value)],
});
const heading = (value: string) => ({
  type: "heading" as const,
  level: 2 as const,
  children: [text(value)],
});

/** PRD defaults; unresolved privacy-policy markers must be reviewed before publication. */
export function defaultSiteSettings(): SettingsDocument {
  return settingsDocumentSchema.parse({
    general: {
      brandName: "OpenByte Labs",
      logoId: null,
      faviconId: null,
      whatsappNumber: "",
      contactEmail: "",
      address: "",
      socialLinks: [],
    },
    hero: {
      headline:
        "Bangun sistem, aplikasi, dan website yang benar-benar dipakai.",
      subheadline:
        "OpenByte Labs membuat sistem informasi, aplikasi mobile Flutter, website bisnis, dan undangan digital untuk instansi, UMKM, dan komunitas.",
      primaryCtaLabel: "Hitung Estimasi Biaya",
      secondaryCtaLabel: "Tanya kebutuhan",
      heroImageId: null,
      trustMetrics: [],
    },
    navigation: {
      menuItems: [
        { label: "Beranda", target: "/", isActive: true },
        { label: "Proyek Portofolio", target: "/proyek", isActive: true },
        { label: "Paket Layanan", target: "/paket", isActive: true },
        { label: "Estimasi Biaya", target: "/kalkulator", isActive: true },
        { label: "Konsultasi", target: "/konsultasi", isActive: true },
        { label: "Tracking Klien", target: "/tracking", isActive: false },
      ],
      footerText: "",
    },
    seo: {
      defaultTitle:
        "OpenByte Labs: Website, Aplikasi Mobile & Sistem Informasi",
      defaultDescription:
        "Software house personal untuk website bisnis, aplikasi mobile Flutter, sistem informasi, dan undangan digital. Hitung estimasi biaya dan jadwalkan konsultasi.",
      defaultOgImageId: null,
      analyticsId: "",
    },
    whatsapp: {
      tplCalculator:
        "Halo OpenByte Labs, saya {nama} tertarik membuat aplikasi dengan rincian berikut:\n{rincian}\nEstimasi Kalkulator: {estimasi_harga} ({estimasi_durasi})\nReferensi: {referensi}\nMohon info ketersediaan jadwal pengerjaan. Terima kasih!",
      tplPackageOrder:
        "Halo OpenByte Labs, saya {nama} tertarik dengan {platform}. Referensi: {referensi}.",
      tplBookingConfirm:
        "Halo {nama}, konsultasi Anda pada {tanggal} pukul {jam} WIB sudah dikonfirmasi.\nLink pertemuan: {meeting_url}\nReferensi: {referensi}",
      tplTrackingLink:
        'Halo {nama}, proyek "{nama_proyek}" dapat dipantau di {link_tracking}\nKode Tracking: {kode_tracking}\nPIN akan saya kirim terpisah.',
      tplRevisionNotice:
        'Halo {nama}, permintaan revisi "{judul_revisi}" sudah saya tinjau. Sisa kuota revisi: {sisa_kuota}.\nDetail lengkap ada di halaman tracking proyek Anda.',
    },
    calculator: {
      disclaimer:
        "Estimasi awal, harga final ditetapkan setelah konsultasi kebutuhan.",
      minimumPrice: 500_000,
      showRange: true,
    },
    booking: {
      slotDurationMinutes: 60,
      bufferMinutes: 0,
      minDaysAhead: 1,
      maxDaysAhead: 30,
      availableModes: ["google_meet", "whatsapp_call", "offline"],
    },
    tracking: {
      trackingEnabled: false,
      revisionPolicy: {
        version: 1,
        blocks: [
          paragraph(
            "Draf kebijakan revisi. Definisi satu putaran, jumlah poin, dan cakupan perubahan harus ditetapkan tertulis per proyek.",
          ),
          paragraph(
            "Periode pengajuan revisi dan tahapan review belum ditetapkan; cantumkan hanya setelah disepakati tertulis.",
          ),
          paragraph(
            "Kuota revisi dan biaya tambahan, jika ada, harus ditinjau dan disepakati tertulis sebelum pekerjaan dimulai.",
          ),
          paragraph(
            "Perubahan di luar cakupan awal ditinjau dan hanya dikerjakan setelah perubahan serta biayanya disepakati tertulis.",
          ),
          paragraph(
            "Penanganan bug dan cakupan dukungan ditetapkan dalam dokumen proyek yang disetujui.",
          ),
          paragraph(
            "Rincian biaya dan kuota yang berlaku harus dicantumkan dalam dokumen proyek yang disetujui.",
          ),
        ],
      },
      revisionWindowDays: 0,
      bugWarrantyDays: 0,
      maxLoginAttempts: 5,
      lockMinutes: 15,
      sessionMinutes: 120,
    },
    legal: {
      privacyPolicy: {
        version: 1,
        blocks: [
          heading("Draf Kebijakan Privasi"),
          paragraph(
            "[ISI: tinjau dan setujui identitas pengendali data, tujuan pemrosesan, dasar hukum, pihak pemroses, lokasi pemrosesan, masa retensi, hak subjek data, dan saluran permintaan sebelum publikasi.]",
          ),
        ],
      },
      consentText:
        "Draf formulir. Kebijakan privasi dan persetujuan perlu ditinjau sebelum formulir digunakan.",
    },
  });
}
