import { pageInputSchema, type PageInput } from "@/schemas/pages";

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

/**
 * Starter pages for the Page Builder. They are seeded as drafts on purpose: the
 * public site keeps rendering its designed screens until an owner reviews and
 * publishes each page from /admin/pages.
 */
export function defaultPages(): PageInput[] {
  return [
    {
      slug: "home",
      title: "Beranda",
      sortOrder: 1,
      metaTitle: "OpenByte Labs: Website, Aplikasi Mobile & Sistem Informasi",
      metaDescription:
        "Software house personal untuk website bisnis, aplikasi mobile Flutter, sistem informasi, dan undangan digital.",
      ogImageId: null,
      layout: [
        {
          id: "home-hero",
          isVisible: true,
          type: "hero",
          headline:
            "Bangun sistem, aplikasi, dan website yang benar-benar dipakai.",
          subheadline:
            "OpenByte Labs membuat sistem informasi, aplikasi mobile Flutter, website bisnis, dan undangan digital untuk instansi, UMKM, dan komunitas.",
          primaryCtaLabel: "Hitung Estimasi Biaya",
          secondaryCtaLabel: "Tanya kebutuhan",
          heroImageId: null,
          trustMetrics: [],
        },
        {
          id: "home-services",
          isVisible: true,
          type: "servicesGrid",
          title: "Layanan",
          description:
            "Setiap layanan disusun dari kebutuhan proyek, bukan dari paket fitur yang dipaksakan.",
        },
        {
          id: "home-projects",
          isVisible: true,
          type: "portfolioShowcase",
          title: "Proyek Pilihan",
          limit: 6,
          featuredOnly: true,
        },
        {
          id: "home-calculator",
          isVisible: true,
          type: "calculator",
          title: "Rencanakan kebutuhan sebelum penawaran.",
          disclaimer:
            "Estimasi awal, harga final ditetapkan setelah konsultasi kebutuhan.",
        },
        {
          id: "home-pricing",
          isVisible: true,
          type: "pricing",
          title: "Paket Layanan",
          showAddons: true,
        },
        {
          id: "home-faq",
          isVisible: true,
          type: "faq",
          title: "Pertanyaan Umum",
          limit: 10,
        },
        {
          id: "home-cta",
          isVisible: true,
          type: "ctaBanner",
          title: "Bahas kebutuhan proyek Anda",
          text: "Ajukan konsultasi. Ruang lingkup, jadwal, dan biaya dikonfirmasi tertulis sebelum pekerjaan dimulai.",
          primaryCtaLabel: "Ajukan konsultasi",
          secondaryCtaLabel: "Lihat paket",
        },
      ],
    },
    {
      slug: "tentang",
      title: "Tentang Kami",
      sortOrder: 2,
      metaTitle: "Tentang OpenByte Labs",
      metaDescription:
        "Profil studio, prinsip rekayasa, dan cara kerja OpenByte Labs dalam mengerjakan proyek perangkat lunak.",
      ogImageId: null,
      layout: [
        {
          id: "tentang-hero",
          isVisible: true,
          type: "hero",
          headline:
            "Rekayasa perangkat lunak presisi tinggi untuk sektor strategis",
          subheadline:
            "OpenByte Labs adalah software engineering studio yang berfokus pada sistem informasi instansi, aplikasi mobile Flutter, dan arsitektur data berperforma tinggi.",
          primaryCtaLabel: "Diskusikan kebutuhan",
          secondaryCtaLabel: "Lihat paket",
          heroImageId: null,
          trustMetrics: [],
        },
        {
          id: "tentang-about",
          isVisible: true,
          type: "about",
          title: "Cara kami bekerja",
          imageId: null,
          body: {
            version: 1,
            blocks: [
              paragraph(
                "Setiap proyek dimulai dari pemetaan kebutuhan, bukan dari daftar fitur. Ruang lingkup, teknologi, jadwal, dan hasil kerja disepakati tertulis sebelum pekerjaan dimulai.",
              ),
              heading("Prinsip kerja"),
              paragraph(
                "Otorisasi diperiksa di sisi server, input divalidasi, dan perubahan data dicatat pada log audit. Kontrol keamanan ditentukan menurut risiko proyek.",
              ),
              paragraph(
                "Kode sumber dan dokumentasi diserahkan setelah kewajiban proyek selesai, tanpa ketergantungan lisensi tersembunyi.",
              ),
            ],
          },
        },
        {
          id: "tentang-cta",
          isVisible: true,
          type: "ctaBanner",
          title: "Bahas kebutuhan sistem Anda",
          text: "Ketersediaan, penawaran, jadwal, dan ruang lingkup dikonfirmasi sebelum pekerjaan dimulai.",
          primaryCtaLabel: "Jadwalkan konsultasi",
          secondaryCtaLabel: "Lihat paket",
        },
      ],
    },
    {
      slug: "ketentuan-layanan",
      title: "Ketentuan Layanan",
      sortOrder: 3,
      metaTitle: "Ketentuan Layanan | OpenByte Labs",
      metaDescription:
        "Prinsip kerja, transparansi ruang lingkup, dan ketentuan serah terima pada setiap kesepakatan implementasi perangkat lunak.",
      ogImageId: null,
      layout: [
        {
          id: "ketentuan-body",
          isVisible: true,
          type: "richText",
          body: {
            version: 1,
            blocks: [
              heading("1. Ruang lingkup kerja & estimasi"),
              paragraph(
                "Seluruh estimasi biaya yang dihasilkan melalui kalkulator daring merupakan simulasi awal. Ruang lingkup resmi, rincian fungsionalitas, jadwal milestone, dan toleransi revisi dicantumkan secara definitif dalam proposal teknis dan SPK tertulis.",
              ),
              heading("2. Penyerahan kode sumber & lisensi"),
              paragraph(
                "Setelah pelunasan komitmen proyek dan penandatanganan Berita Acara Serah Terima (BAST), klien memegang hak kepemilikan penuh atas kode sumber kustom yang dibangun, bebas dari biaya lisensi vendor tersembunyi.",
              ),
              heading("3. Dukungan purnajual"),
              paragraph(
                "Cakupan dukungan, garansi, masa berlaku, dan pengecualian hanya ditetapkan bila disepakati tertulis dalam dokumen proyek.",
              ),
            ],
          },
        },
      ],
    },
    {
      slug: "kebijakan-privasi",
      title: "Kebijakan Privasi",
      sortOrder: 4,
      metaTitle: "Kebijakan Privasi | OpenByte Labs",
      metaDescription:
        "Data yang dikirim melalui formulir, tujuan penggunaannya, dan hak pemilik data.",
      ogImageId: null,
      layout: [
        {
          id: "privasi-body",
          isVisible: true,
          type: "richText",
          body: {
            version: 1,
            blocks: [
              heading("1. Data yang dikirim melalui formulir"),
              paragraph(
                "Formulir konsultasi, kalkulator, dan penawaran meminta data minimum yang diperlukan untuk berkomunikasi: nama lengkap, nomor kontak WhatsApp, jenis layanan, dan ringkasan kebutuhan sistem.",
              ),
              heading("2. Tujuan penggunaan & keamanan data"),
              paragraph(
                "Informasi yang terkumpul digunakan untuk menyusun penawaran tertulis, menjadwalkan sesi konsultasi, dan mengonfirmasi progres pengerjaan.",
              ),
              heading("3. Hak pemilik data"),
              paragraph(
                "Anda berhak mengajukan permohonan peninjauan, pembaruan, atau penghapusan informasi kontak yang telah disampaikan melalui saluran komunikasi resmi kami.",
              ),
            ],
          },
        },
      ],
    },
  ].map((page) => pageInputSchema.parse(page));
}
