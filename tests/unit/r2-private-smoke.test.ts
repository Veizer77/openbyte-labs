import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Berkas privat portal klien hanya pernah diuji lewat mock. Mock membuktikan
 * logika aplikasi, tetapi tidak membuktikan bucket-nya benar-benar privat.
 *
 * Skrip `scripts/r2-private-smoke.ts` adalah satu-satunya bukti terhadap R2
 * sungguhan. Tes ini menjaga sifat-sifat yang membuatnya layak dipercaya:
 *
 * 1. Tidak pernah menulis ke bucket publik, dan menolak bila bucket uji sama
 *    dengan bucket publik.
 * 2. Selalu membersihkan objek uji, termasuk lewat prefiks run, supaya tidak
 *    meninggalkan sampah di penyimpanan produksi.
 * 3. Membuktikan objek tidak bisa diambil tanpa tanda tangan — inti dari
 *    "privat" — bukan sekadar mengunggah lalu menghapus.
 */

const source = readFileSync(
  join(process.cwd(), "scripts/r2-private-smoke.ts"),
  "utf8",
);

describe("smoke test bucket privat R2", () => {
  it("menolak berjalan bila bucket uji sama dengan bucket publik", () => {
    expect(source).toContain("R2_BUCKET_PUBLIC");
    expect(source).toMatch(/bucket === publicBucket/);
    expect(source).toContain("Uji dibatalkan");
  });

  it("memakai bucket staging, bukan bucket publik", () => {
    expect(source).toContain('required("R2_BUCKET_STAGING")');
  });

  it("membuktikan objek tidak terbaca tanpa tanda tangan", () => {
    expect(source).toMatch(/anonymous\.ok/);
    expect(source).toContain("Akses tanpa tanda tangan ditolak");
  });

  it("memeriksa magic bytes, bukan hanya ukuran", () => {
    expect(source).toContain("isPrivateFileContent");
    expect(source).toContain("Magic bytes PNG utuh");
  });

  it("memakai URL unduh berumur pendek", () => {
    expect(source).toMatch(/expiresIn: 60/);
  });

  it("membersihkan objek lewat prefiks run, bukan hanya kunci yang diketahui", () => {
    expect(source).toContain("ListObjectsV2Command");
    expect(source).toMatch(/Prefix: `tracking\/\$\{runId\}\/`/);
  });

  it("tidak mencetak pesan driver yang bisa memuat kredensial", () => {
    expect(source).toContain("Smoke test gagal.");
    expect(source).not.toMatch(/console\.error\(error\)/);
  });
});
