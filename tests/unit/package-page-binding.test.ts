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

  it("mengikat seluruh slot fitur tanpa menyisakan spesifikasi karangan", () => {
    // Setiap slot fitur yang tampil harus berasal dari katalog. Bila salah satu
    // kembali menjadi literal, halaman akan menampilkan spesifikasi yang tidak
    // pernah disetujui pemilik dan tidak bisa diperbaiki lewat admin panel.
    for (const pkg of ["starter", "mobile", "informasi"]) {
      for (let i = 0; i < 5; i++) {
        expect(source).toMatch(
          new RegExp(`\\{${pkg}\\?\\.features\\[${i}\\]`),
        );
      }
    }
    // Teks fitur lama dari prototype tidak boleh hidup lagi di dalam JSX.
    const stale = [
      "Build APK produksi tersign & panduan publish Google Play Store",
      "Audit trail log aktivitas user & mitigasi data rollback",
      "Setup domain, DNS management, & SSL Cloudflare",
      "Desain responsif mobile-first & ultra-fast Core Web Vitals",
      "Integrasi tombol interaktif WhatsApp Direct order router",
      "SEO on-page dasar (Schema JSON-LD, OpenGraph, Sitemap)",
    ];
    for (const text of stale) expect(source).not.toContain(text);
  });

  it("menyembunyikan baris fitur yang tidak diisi agar tidak ada centang kosong", () => {
    // Layout memakai tinggi tetap; menampilkan penanda kosong menyisakan ikon
    // centang tanpa isi. Baris tanpa fitur harus tidak dirender sama sekali.
    expect(source).toMatch(/\{mobile\?\.features\[4\] \? \(/);
    expect(source).toMatch(/\{informasi\?\.features\[4\] \? \(/);
    expect(source).toContain(") : null}");
  });
});
