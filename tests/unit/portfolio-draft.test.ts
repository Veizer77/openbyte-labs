import { describe, expect, it } from "vitest";
import {
  createAnonymousPortfolioDraft,
  isPortfolioConversionReady,
  portfolioYearFrom,
} from "@/lib/tracking/portfolio";

/**
 * Draf portofolio berasal dari proyek klien yang isinya privat. Yang berbahaya
 * bukan tampilan draf, melainkan kebocoran yang tidak terlihat: nama klien
 * terbawa ke halaman publik karena "toh sudah ada di database".
 *
 * Nama klien adalah data yang bisa merusak hubungan komersial bila terbit tanpa
 * izin. Karena itu izin harus eksplisit, dan tanpa izin nilainya harus benar-benar
 * kosong — bukan sekadar disembunyikan di UI.
 */

const slug = "portfolio-uji";

describe("draf portofolio tanpa izin", () => {
  it("tidak menyalin nama klien bila izin tidak diberikan", () => {
    const draft = createAnonymousPortfolioDraft(slug, 2026, {
      clientName: "PT Rahasia Klien",
      includeClientName: false,
      categoryIds: [],
      year: 2026,
    });
    expect(draft.clientName).toBeNull();
    expect(JSON.stringify(draft)).not.toContain("PT Rahasia Klien");
  });

  it("tetap anonim saat sumber tidak diberikan sama sekali", () => {
    expect(createAnonymousPortfolioDraft(slug, 2026).clientName).toBeNull();
  });

  it("tidak menyalin nama klien bila nilainya kosong walau izin diberikan", () => {
    const draft = createAnonymousPortfolioDraft(slug, 2026, {
      clientName: null,
      includeClientName: true,
      categoryIds: [],
      year: 2026,
    });
    expect(draft.clientName).toBeNull();
  });
});

describe("draf portofolio dengan izin", () => {
  it("menyalin nama klien hanya saat izin diberikan", () => {
    const draft = createAnonymousPortfolioDraft(slug, 2026, {
      clientName: "CV Contoh",
      includeClientName: true,
      categoryIds: [],
      year: 2026,
    });
    expect(draft.clientName).toBe("CV Contoh");
  });
});

describe("draf portofolio tetap tidak membocorkan konten privat", () => {
  it("selalu mulai dari konten kosong dan berstatus draft", () => {
    const draft = createAnonymousPortfolioDraft(slug, 2026, {
      clientName: "CV Contoh",
      includeClientName: true,
      categoryIds: ["11111111-1111-4111-8111-111111111111"],
      year: 2026,
    });
    expect(draft.summary).toBe("");
    expect(draft.contentBlocks).toEqual([]);
    expect(draft.gallery).toEqual([]);
    expect(draft.links).toEqual([]);
    expect(draft.status).toBe("draft");
    expect(draft.publishedAt).toBeNull();
  });

  it("tidak mengarang daftar teknologi", () => {
    const draft = createAnonymousPortfolioDraft(slug, 2026);
    expect(draft).not.toHaveProperty("technologies");
  });
});

describe("tahun portofolio diambil dari data nyata", () => {
  it("memakai tahun tanggal selesai bila ada", () => {
    expect(portfolioYearFrom("2025-03-01", "2026-01-15", 2030)).toBe(2026);
  });

  it("jatuh ke tanggal mulai bila tanggal selesai kosong", () => {
    expect(portfolioYearFrom("2025-03-01", null, 2030)).toBe(2025);
  });

  it("memakai fallback bila kedua tanggal kosong, bukan tahun tebakan", () => {
    expect(portfolioYearFrom(null, null, 2030)).toBe(2030);
  });

  it("menolak tahun yang tidak masuk akal dari data rusak", () => {
    expect(portfolioYearFrom("0001-01-01", null, 2030)).toBe(2030);
  });
});

describe("syarat konversi portofolio", () => {
  const done = ["done", "done", "done", "done", "done", "done"];
  it("butuh enam tahap selesai dan serah terima disetujui", () => {
    expect(
      isPortfolioConversionReady({
        deleted: false,
        stepStatuses: done,
        finalHandoverApproved: true,
      }),
    ).toBe(true);
  });

  it("menolak proyek yang dihapus", () => {
    expect(
      isPortfolioConversionReady({
        deleted: true,
        stepStatuses: done,
        finalHandoverApproved: true,
      }),
    ).toBe(false);
  });

  it("menolak bila ada tahap yang belum selesai", () => {
    expect(
      isPortfolioConversionReady({
        deleted: false,
        stepStatuses: ["done", "done", "in_progress", "done", "done", "done"],
        finalHandoverApproved: true,
      }),
    ).toBe(false);
  });

  it("menolak bila serah terima belum disetujui klien", () => {
    expect(
      isPortfolioConversionReady({
        deleted: false,
        stepStatuses: done,
        finalHandoverApproved: false,
      }),
    ).toBe(false);
  });
});
