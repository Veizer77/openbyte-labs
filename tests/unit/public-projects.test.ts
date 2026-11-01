import { describe, expect, it, vi } from "vitest";
import {
  getPublicProjectBySlug,
  listPublicProjects,
  type PublicProjectStore,
} from "@/services/public-projects";

const project = {
  slug: "sistem-informasi-desa",
  title: "Sistem Informasi Desa",
  tagline: "Layanan digital terpadu untuk desa.",
  summary: "Ringkasan proyek yang sudah dipublikasikan.",
  clientName: "Desa Contoh",
  year: 2026,
  imageUrl: "https://cdn.example.test/media/cover.webp",
  imageAlt: "Tampilan sistem informasi desa",
  links: [],
  categories: ["Instansi / Pemdes"],
  technologies: ["Next.js", "PostgreSQL"],
  isFeatured: true,
};

function setup(listed: unknown[] = [], detail: unknown | null = project) {
  const listPublished = vi.fn().mockResolvedValue(listed);
  const findPublishedBySlug = vi.fn().mockResolvedValue(detail);
  return {
    store: { listPublished, findPublishedBySlug } as PublicProjectStore,
    listPublished,
    findPublishedBySlug,
  };
}

describe("katalog proyek publik", () => {
  it("meminta daftar terbit dengan pagination dan memvalidasi proyeksi publik", async () => {
    const ctx = setup([project]);

    await expect(listPublicProjects(ctx.store)).resolves.toEqual([project]);
    expect(ctx.listPublished).toHaveBeenCalledWith({ limit: 100, offset: 0 });
    await expect(
      listPublicProjects(ctx.store, { limit: 10, offset: 20 }),
    ).resolves.toEqual([project]);
    expect(ctx.listPublished).toHaveBeenLastCalledWith({ limit: 10, offset: 20 });
  });

  it("meneruskan hanya slug valid dan mengembalikan null untuk proyek yang tidak terbit", async () => {
    const ctx = setup([], null);

    await expect(
      getPublicProjectBySlug(ctx.store, "belum-diterbitkan"),
    ).resolves.toBeNull();
    expect(ctx.findPublishedBySlug).toHaveBeenCalledWith("belum-diterbitkan");
    await expect(
      getPublicProjectBySlug(ctx.store, "Draft Dengan Spasi"),
    ).rejects.toThrow();
    expect(ctx.findPublishedBySlug).toHaveBeenCalledOnce();
  });

  it("menolak data daftar yang melanggar kontrak publik", async () => {
    const ctx = setup([{ ...project, imageUrl: "javascript:alert(1)" }]);

    await expect(listPublicProjects(ctx.store)).rejects.toThrow();
  });
});
