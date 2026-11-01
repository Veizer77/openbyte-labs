import "server-only";
import { randomUUID } from "node:crypto";

export function defaultPackageRows() {
  const categories = [
    {
      id: randomUUID(),
      name: "Instansi / Pemdes",
      slug: "instansi-pemdes",
      icon: "",
      sortOrder: 1,
    },
    {
      id: randomUUID(),
      name: "Aplikasi Mobile",
      slug: "aplikasi-mobile",
      icon: "",
      sortOrder: 2,
    },
    {
      id: randomUUID(),
      name: "Bisnis & UMKM",
      slug: "bisnis-umkm",
      icon: "",
      sortOrder: 3,
    },
    {
      id: randomUUID(),
      name: "Undangan Digital & Event",
      slug: "undangan-digital-event",
      icon: "",
      sortOrder: 4,
    },
  ];
  const category = (slug: string) =>
    categories.find((entry) => entry.slug === slug)!.id;
  const packages = [
    {
      categoryId: category("bisnis-umkm"),
      name: "Starter UMKM & Bisnis",
      slug: "starter-umkm",
      price: 1_000_000,
      billingType: "one_time" as const,
      estimatedDays: 7,
      includedRevisions: 2,
      extraRevisionPrice: 100_000,
      features: [
        "Landing/profil hingga 5 halaman",
        "Responsif",
        "Tombol WhatsApp",
        "SEO dasar",
        "Kebutuhan domain dan hosting dibahas dalam penawaran",
      ],
      isActive: false,
      sortOrder: 1,
    },
    {
      categoryId: category("instansi-pemdes"),
      name: "Sistem Informasi / Instansi",
      slug: "sistem-informasi",
      price: 3_500_000,
      billingType: "one_time" as const,
      estimatedDays: 21,
      includedRevisions: 3,
      extraRevisionPrice: 250_000,
      features: [
        "Database terintegrasi",
        "Multi-role",
        "Dashboard",
        "Ekspor laporan",
      ],
      isActive: false,
      sortOrder: 2,
    },
    {
      categoryId: category("aplikasi-mobile"),
      name: "Mobile Application (Flutter)",
      slug: "mobile-application",
      price: 4_500_000,
      billingType: "one_time" as const,
      estimatedDays: 30,
      includedRevisions: 4,
      extraRevisionPrice: 300_000,
      features: [
        "Android native-feel",
        "Fitur offline sesuai kebutuhan dan ruang lingkup",
        "Fitur perangkat sesuai kebutuhan",
        "Integrasi API sesuai kesepakatan proyek",
      ],
      isActive: false,
      sortOrder: 3,
    },
  ];
  const addons = [
    {
      name: "Maintenance bulanan",
      description: "Ruang lingkup pemeliharaan ditentukan dalam kesepakatan tertulis.",
      price: 150_000,
      billingType: "monthly" as const,
      isActive: false,
      sortOrder: 1,
    },
    {
      name: "Maintenance tahunan",
      description: "Ruang lingkup pemeliharaan ditentukan dalam kesepakatan tertulis.",
      price: 1_500_000,
      billingType: "yearly" as const,
      isActive: false,
      sortOrder: 2,
    },
    {
      name: "Pelatihan admin",
      description: "Format, durasi, dan materi pelatihan dicantumkan dalam penawaran.",
      price: 250_000,
      billingType: "one_time" as const,
      isActive: false,
      sortOrder: 3,
    },
    {
      name: "Setup domain & hosting",
      description: "Kebutuhan dan biaya konfigurasi dikonfirmasi dalam penawaran.",
      price: 200_000,
      billingType: "one_time" as const,
      isActive: false,
      sortOrder: 4,
    },
  ];
  return { categories, packages, addons };
}
