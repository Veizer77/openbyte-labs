import { faqInputSchema, type FaqInput } from "@/schemas/faqs";

const defaults = [
  [
    "Berapa biaya membuat website atau aplikasi?",
    "Biaya bergantung pada kebutuhan, fitur, integrasi, dan ruang lingkup. Kalkulator dan katalog hanya memberi gambaran awal; rincian biaya final dicantumkan dalam penawaran tertulis.",
  ],
  [
    "Berapa lama pengerjaannya?",
    "Jadwal dibahas setelah kebutuhan, materi, dependensi, dan ruang lingkup proyek ditinjau. Perkiraan waktu final dicantumkan dalam penawaran tertulis.",
  ],
  [
    "Apakah domain dan hosting sudah termasuk?",
    "Kebutuhan domain, hosting, biaya pihak ketiga, serta pekerjaan konfigurasi dijelaskan dalam penawaran untuk setiap proyek.",
  ],
  [
    "Berapa kali saya boleh meminta revisi?",
    "Jumlah putaran revisi, batas perubahan, dan biaya tambahan ditentukan dalam ruang lingkup serta penawaran proyek.",
  ],
  [
    "Bagaimana alur pengerjaannya?",
    "Tahapan kerja, bahan yang dibutuhkan, proses review, dan hasil serah terima dibahas dan dicantumkan dalam penawaran proyek.",
  ],
  [
    "Bisakah saya konsultasi dulu?",
    "Anda dapat mengajukan konsultasi melalui formulir. Pilihan waktu dan metode mengikuti opsi yang tersedia dan dikonfirmasi sebelum sesi.",
  ],
  [
    "Bagaimana pembayarannya?",
    "Metode, jadwal, dan tahapan pembayaran ditentukan dalam penawaran atau perjanjian tertulis untuk setiap proyek.",
  ],
  [
    "Apakah tersedia perawatan setelah selesai?",
    "Dukungan setelah serah terima hanya berlaku bila ruang lingkup, periode, dan biayanya disepakati secara tertulis.",
  ],
  [
    "Apakah data yang saya kirim aman?",
    "Formulir meminta data kontak dan ringkasan kebutuhan untuk menindaklanjuti permintaan Anda. Kebijakan Privasi masih berupa draf dan perlu ditinjau sebelum penggunaan produksi; jangan kirim data sensitif melalui formulir.",
  ],
  [
    "Bagaimana saya memantau progres proyek?",
    "Cara komunikasi dan pelaporan progres ditentukan bersama untuk setiap proyek. Portal tracking publik belum tersedia.",
  ],
] as const;

export function defaultFaqs(): FaqInput[] {
  return defaults.map(([question, answer], index) =>
    faqInputSchema.parse({
      question,
      answer: {
        version: 1,
        blocks: [
          { type: "paragraph", children: [{ type: "text", text: answer }] },
        ],
      },
      isActive: index < 9,
      requiresTracking: index === 9,
      sortOrder: index + 1,
    }),
  );
}
