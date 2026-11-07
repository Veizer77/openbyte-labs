import type { ProjectContentBlock, ProjectLink } from "@/schemas/blocks";

export function isPortfolioConversionReady(input: {
  deleted: boolean;
  stepStatuses: readonly string[];
  finalHandoverApproved: boolean;
}): boolean {
  return (
    !input.deleted &&
    input.stepStatuses.length === 6 &&
    input.stepStatuses.every((status) => status === "done") &&
    input.finalHandoverApproved
  );
}

/** Data proyek klien yang boleh disalin ke portofolio, dan hanya dengan izin. */
export interface PortfolioSource {
  /** Nama klien. Hanya disalin bila `includeClientName` benar. */
  clientName: string | null;
  includeClientName: boolean;
  /** Kategori nyata dari proyek klien. */
  categoryIds: readonly string[];
  /**
   * Tahun nyata. Diturunkan dari tanggal selesai, lalu tanggal mulai. Tidak
   * pernah diisi angka tebakan.
   */
  year: number | null;
}

/**
 * Draf portofolio dari proyek klien.
 *
 * Aturan yang dijaga di sini:
 *
 * 1. Nama klien hanya disalin bila admin mencentang izin. Tanpa izin, draf
 *    tetap anonim walaupun proyek sumbernya punya nama klien.
 * 2. Hanya data yang benar-benar ada di proyek klien yang disalin. Tidak ada
 *    teknologi yang dikarang: `client_projects` tidak menyimpan teknologi, jadi
 *    daftar teknologi dibiarkan kosong untuk diisi admin.
 * 3. Konten (ringkasan, blok, gambar, tautan) tidak pernah disalin. Isi proyek
 *    klien bersifat privat dan tidak boleh bocor ke halaman publik.
 */
export function createAnonymousPortfolioDraft(
  slug: string,
  year: number,
  source?: PortfolioSource,
) {
  const canUseName = Boolean(source?.includeClientName && source.clientName);
  return {
    title: "Portofolio Baru",
    slug,
    clientName: canUseName ? source!.clientName : null,
    year: source?.year ?? year,
    featuredImageId: null,
    gallery: [] as { mediaId: string; alt: string }[],
    summary: "",
    contentBlocks: [] as ProjectContentBlock[],
    links: [] as ProjectLink[],
    isFeatured: false,
    status: "draft" as const,
    publishedAt: null,
    metaTitle: null,
    metaDescription: null,
    ogImageId: null,
    sortOrder: 0,
  };
}

/** Tahun nyata proyek, diambil dari tanggal yang tersedia. */
export function portfolioYearFrom(
  startDate: string | null,
  targetCompletionDate: string | null,
  fallback: number,
): number {
  for (const value of [targetCompletionDate, startDate]) {
    if (!value) continue;
    const year = Number(value.slice(0, 4));
    if (Number.isInteger(year) && year >= 2000 && year <= 2100) return year;
  }
  return fallback;
}
