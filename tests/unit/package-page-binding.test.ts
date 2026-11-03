import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Regresi untuk bug "simpan paket di admin, halaman publik tidak berubah".
 *
 * Halaman /paket berasal dari porting prototype, jadi sangat mudah kembali ke
 * keadaan hardcode tanpa ketahuan: tidak ada error, halaman tetap tampil, hanya
 * isinya berhenti mengikuti database. Tes ini menjaga dua hal yang paling
 * merusak bila itu terjadi:
 *
 * 1. Tautan CTA harus memakai slug dari database, bukan slug statis. Slug statis
 *    pernah menunjuk "mobile-flutter" padahal data menyimpan "mobile-application",
 *    sehingga tombol pesan berakhir 404.
 * 2. Harga dan estimasi tidak boleh kembali menjadi literal mati.
 */

const source = readFileSync(
  join(process.cwd(), "src/components/screens/site/paket-layanan-harga.tsx"),
  "utf8",
);

describe("halaman /paket terikat ke data paket", () => {
  it("tidak menyisakan tautan CTA dengan slug statis", () => {
    expect(source).not.toMatch(/href=\{"\/pesan\?paket=/);
    expect(source).not.toContain("paket=mobile-flutter");
  });

  it("membangun tautan CTA dari slug hasil kueri", () => {
    expect(source).toContain("encodeURIComponent(starter?.slug");
    expect(source).toContain("encodeURIComponent(mobile?.slug");
    expect(source).toContain("encodeURIComponent(informasi?.slug");
  });

  it("membaca harga, estimasi, dan revisi dari katalog", () => {
    expect(source).toContain("catalog?.packages");
    expect(source).toMatch(/angkaRupiah\(starter\?\.effectivePrice\)/);
    expect(source).toMatch(/angkaRupiah\(mobile\?\.effectivePrice\)/);
    expect(source).toMatch(/angkaRupiah\(informasi\?\.effectivePrice\)/);
    expect(source).toMatch(/starter\.estimatedDays/);
    expect(source).toMatch(/mobile\.estimatedDays/);
    expect(source).toMatch(/informasi\.estimatedDays/);
    expect(source).toMatch(/starter\?\.includedRevisions/);
    expect(source).toMatch(/starter\?\.features\[0\]/);
  });
});
