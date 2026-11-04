import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Source map Sentry hanya berguna kalau `withSentryConfig` benar-benar dipasang,
 * dan hanya aman kalau pemasangannya bergantung pada token build.
 *
 * Dua kegagalan yang dijaga di sini:
 *
 * 1. Konfigurasi hilang lagi. Token `SENTRY_AUTH_TOKEN` di Vercel tidak melakukan
 *    apa pun tanpa pembungkus ini, jadi stack trace kembali ter-minify tanpa ada
 *    error yang terlihat.
 * 2. Pembungkus dipasang tanpa syarat. Job `quality` di CI menjalankan
 *    `pnpm build` tanpa token; bila `withSentryConfig` selalu aktif, build CI
 *    akan mencoba menghubungi Sentry dan berisiko gagal.
 */

const source = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
const envExample = readFileSync(join(process.cwd(), ".env.example"), "utf8");

describe("pemasangan source map Sentry", () => {
  it("membungkus konfigurasi Next dengan withSentryConfig", () => {
    expect(source).toContain("@sentry/nextjs/config");
    expect(source).toMatch(/withSentryConfig\(/);
  });

  it("hanya mengaktifkan pembungkus bila token, org, dan project tersedia", () => {
    expect(source).toMatch(/process\.env\.SENTRY_ORG/);
    expect(source).toMatch(/process\.env\.SENTRY_PROJECT/);
    expect(source).toMatch(/process\.env\.SENTRY_AUTH_TOKEN/);
    // Gerbang gabungan: ketiganya harus truthy sebelum withSentryConfig dipanggil.
    expect(source).toMatch(
      /sentryAuthToken\s*&&\s*sentryOrg\s*&&\s*sentryProject\s*\?/,
    );
  });

  it("tidak menulis token ke dalam konfigurasi yang bisa dibaca klien", () => {
    // org/project adalah slug, bukan secret; token hanya dibaca dari environment
    // oleh build plugin dan tidak boleh dioper sebagai literal.
    expect(source).not.toMatch(/authToken\s*:/);
  });

  it("menghapus source map dari output build setelah upload", () => {
    expect(source).toMatch(/deleteSourcemapsAfterUpload:\s*true/);
  });

  it("mendokumentasikan variabel build Sentry di .env.example", () => {
    for (const key of ["SENTRY_ORG=", "SENTRY_PROJECT=", "SENTRY_AUTH_TOKEN="]) {
      expect(envExample).toContain(key);
    }
  });
});
