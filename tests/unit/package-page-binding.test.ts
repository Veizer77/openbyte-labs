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
    expect(source).toMatch(/starter\?\.features/);
  });

  it("mengikat seluruh slot fitur tanpa menyisakan spesifikasi karangan", () => {
    // Setiap slot fitur yang tampil harus berasal dari katalog. Bila salah satu
    // kembali menjadi literal, halaman akan menampilkan spesifikasi yang tidak
    // pernah disetujui pemilik dan tidak bisa diperbaiki lewat admin panel.
    // Sejak perbaikan tata letak, seluruh fitur dirender lewat satu pemetaan
    // (`features.map`) sehingga tidak ada lagi slot 0..4 yang ditulis manual.
    for (const pkg of ["starter", "mobile", "informasi"]) {
      expect(source).toContain(`{(${pkg}?.features ?? []).filter(isiFitur).map(`);
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
    // Baris fitur kosong harus tersaring sebelum dirender. Tanpa filter ini,
    // paket yang hanya mengisi 4 dari 5 slot menampilkan ikon centang tanpa isi.
    expect(source).toMatch(/const isiFitur = \(/);
    expect(source).toContain("feature.trim() !== \"\"");
    expect(source).toContain("filter(isiFitur)");
  });

  it("memakai satu bentuk baris fitur yang seragam", () => {
    // Bug tata letak: baris fitur memakai dua bentuk berbeda (h-[26px]
    // items-center vs h-[36px] absolute) sehingga tinggi baris 26px vs 36px dan
    // ikon meleset +3px / -2px terhadap teks. Semua baris sekarang satu komponen.
    expect(source).toMatch(/function PackageFeatureRow\(/);
    // Tinggi tetap dan posisi absolut tidak boleh kembali ke baris fitur.
    expect(source).not.toMatch(/h-\[26px\] shrink-0 flex flex-row gap-\[10px\]/);
    expect(source).not.toMatch(/absolute left-\[26px\] top-0/);
    // Jarak antar baris diatur oleh gap pada daftar, bukan spacer manual.
    expect(source).toMatch(/<ul className="[^"]*gap-\[6px\]/);
    expect(source).toMatch(/flex flex-row gap-\[10px\] justify-start items-start/);
  });

  it("tidak mengarang angka saat paket tidak tersedia", () => {
    // Bila paket nonaktif, katalog kosong. Menampilkan estimasi atau kuota
    // revisi karangan membuat halaman tampak berisi padahal datanya tidak ada.
    // Atribut data-pencil-name sengaja diabaikan: itu metadata desain, bukan
    // teks yang dirender.
    const rendered = source.replace(/data-pencil-name=\{[^}]*\}/g, "");
    expect(rendered).not.toMatch(/"Estimasi 7 Hari"/);
    expect(rendered).not.toMatch(/"Estimasi 30 Hari"/);
    expect(rendered).not.toMatch(/"Estimasi 21 Hari"/);
    expect(rendered).not.toMatch(/"3x Sesi Penuh"/);
    expect(source).toMatch(/: "Estimasi —"/);
  });
});
