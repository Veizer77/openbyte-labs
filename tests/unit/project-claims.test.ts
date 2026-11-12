import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Halaman studi kasus pernah menampilkan angka yang tidak berasal dari data:
 * "100% Valid", "< 1 Detik", dan "99.9%" uptime. Ketiganya angka karangan —
 * tidak ada pengukuran yang menyokongnya, dan 99.9% uptime bertentangan dengan
 * paket Hobby yang dipakai. Klaim seperti itu berisiko secara komersial dan
 * mencemarkan kredibilitas angka lain di situs.
 *
 * Penggantinya hanya memakai field yang benar-benar ada di data proyek
 * (`year`, `categories`, `technologies`), sehingga halaman tidak bisa
 * menampilkan metrik yang tidak pernah diukur.
 */

const source = readFileSync(
  join(process.cwd(), "src/components/public/ProjectDetail.tsx"),
  "utf8",
);

describe("studi kasus proyek tidak mengarang metrik", () => {
  it("tidak lagi menampilkan angka dampak fiktif", () => {
    expect(source).not.toContain("100% Valid");
    expect(source).not.toContain("< 1 Detik");
    expect(source).not.toContain("99.9%");
    expect(source).not.toContain("HASIL &amp; METRIK DAMPAK");
    expect(source).not.toContain("Kemitraan Terverifikasi");
    expect(source).not.toContain("30 Hari Bug-Free SLA");
    expect(source).not.toContain("Verified Release");
  });

  it("menampilkan ringkasan berbasis data proyek", () => {
    expect(source).toContain("RINGKASAN PROYEK");
    expect(source).toContain("project.year");
    expect(source).toContain("project.categories");
    expect(source).toContain("project.technologies");
  });
});
