export interface ShowcaseProject {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  categories: string[];
  technologies: string[];
}

// Anonymized visual fixtures only; never use as production or client records.
export const projects: ShowcaseProject[] = [
  {
    slug: "proyek-contoh-1",
    title: "Proyek Contoh 1",
    tagline: "Sistem informasi dengan peta dan alur layanan digital.",
    summary:
      "Contoh sistem informasi untuk mengelola data dan alur layanan organisasi.",
    categories: ["Instansi / Pemdes"],
    technologies: ["Next.js", "PostgreSQL", "Peta Digital", "Alur Dokumen"],
  },
  {
    slug: "proyek-contoh-2",
    title: "Proyek Contoh 2",
    tagline: "Aplikasi pencatatan layanan dan ringkasan data.",
    summary:
      "Contoh aplikasi layanan dengan pencatatan kegiatan, pelaporan, dan ringkasan data.",
    categories: ["Instansi / Pemdes"],
    technologies: ["React", "PostgreSQL", "Pengujian Otomatis"],
  },
  {
    slug: "proyek-contoh-3",
    title: "Proyek Contoh 3",
    tagline: "Aplikasi web dan mobile untuk operasional layanan.",
    summary:
      "Contoh aplikasi operasional lintas perangkat; rincian belum disetujui untuk publikasi.",
    categories: ["Instansi / Pemdes", "Aplikasi Mobile"],
    technologies: ["Next.js", "Flutter", "PostgreSQL"],
  },
  {
    slug: "proyek-contoh-4",
    title: "Proyek Contoh 4",
    tagline: "Katalog digital dan alur pemesanan.",
    summary:
      "Contoh direktori usaha dengan katalog produk dan alur pemesanan digital.",
    categories: ["Bisnis & UMKM"],
    technologies: ["React", "PostgreSQL", "Object Storage"],
  },
  {
    slug: "proyek-contoh-5",
    title: "Proyek Contoh 5",
    tagline: "Website layanan dengan alur pemesanan digital.",
    summary:
      "Contoh website layanan dengan alur pemesanan digital; rincian belum disetujui untuk publikasi.",
    categories: ["Bisnis & UMKM"],
    technologies: ["HTML", "CSS", "Form Integration"],
  },
  {
    slug: "proyek-contoh-6",
    title: "Proyek Contoh 6",
    tagline: "Microsite acara dengan RSVP digital.",
    summary:
      "Contoh microsite acara dengan informasi dan RSVP digital.",
    categories: ["Undangan Digital & Event"],
    technologies: ["HTML5 Canvas", "Web Audio API", "Google Sheets RSVP"],
  },
];
