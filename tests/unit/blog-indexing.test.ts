import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * /blog belum punya modul editorial: isinya selalu keadaan kosong
 * ("Belum ada artikel yang diterbitkan"). Halaman seperti itu tidak boleh
 * masuk sitemap maupun diizinkan terindeks, meski indexing publik menyala.
 *
 * Tes ini menjaga agar pengecualian tersebut tidak hilang saat refactor.
 */

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");

describe("pengecualian indexing /blog", () => {
  it("sitemap tidak memuat /blog", () => {
    const src = read("src/app/sitemap.ts");
    const setMatch = src.match(/const paths = new Set\(\[([\s\S]*?)\]\)/);
    expect(setMatch).not.toBeNull();
    const literal = setMatch![1];
    expect(literal).not.toContain('"/blog"');
  });

  it("sitemap masih memuat rute publik inti", () => {
    const src = read("src/app/sitemap.ts");
    const literal = src.match(/const paths = new Set\(\[([\s\S]*?)\]\)/)![1];
    for (const route of ["/", "/proyek", "/paket", "/kalkulator", "/tentang-kami", "/kebijakan-privasi", "/ketentuan-layanan"]) {
      expect(literal).toContain(`"${route}"`);
    }
  });

  it("metadata /blog memaksa noindex walau indexing menyala", () => {
    const src = read("src/app/(public)/[[...path]]/page.tsx");
    // harus ada pengecualian eksplisit untuk path blog
    expect(src).toMatch(/indexingAllowed\s*=\s*publicIndexingEnabled\(\)\s*&&\s*path\s*!==\s*"blog"/);
    // robots memakai nilai yang sudah dibatasi, bukan publicIndexingEnabled() langsung
    expect(src).toMatch(/robots:\s*\{\s*index:\s*indexingAllowed,\s*follow:\s*indexingAllowed\s*\}/);
  });

  it("halaman /blog tetap menampilkan keadaan kosong yang jujur", () => {
    const src = read("src/components/public/PublicBlog.tsx");
    expect(src).toContain("Belum ada artikel yang diterbitkan");
  });
});
