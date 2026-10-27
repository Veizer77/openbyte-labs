# OpenByte Labs

Satu aplikasi Next.js App Router dan Payload CMS untuk situs publik serta panel admin. Dokumen acuan produk dan teknis adalah [`PRD_v1_4.md`](./PRD_v1_4.md); aturan kerja ada di [`AGENTS.md`](./AGENTS.md).

## Status pengerjaan

Repositori ini sedang menyiapkan **Fase 0: Fondasi & Verifikasi**. Berkas di `prototype/` adalah referensi desain baca-saja, bukan halaman produksi. Implementasi publik dan admin akan dilakukan pada fase PRD masing-masing. Portal `/tracking*` tetap bagian Rilis 2 dan tidak dibangun pada Rilis 1.

## Persiapan lokal

1. Gunakan Node.js `^22.23.4` atau `>=24.22.1` dan pnpm.
2. Salin `.env.example` menjadi `.env`, lalu isi `PAYLOAD_SECRET` dengan nilai acak minimal 32 karakter.
3. Jalankan `docker compose up -d db` untuk PostgreSQL lokal.
4. Jalankan `pnpm install`, `pnpm migrate`, kemudian `pnpm dev`.
5. Buka `http://localhost:3000/admin` untuk membuat akun admin lokal.

Migrasi memakai `DATABASE_URI_DIRECT`; aplikasi memakai `DATABASE_URI`. Keduanya boleh menunjuk ke database lokal yang sama.

## Perintah

- `pnpm dev` menjalankan Next.js.
- `pnpm lint` menjalankan ESLint.
- `pnpm typecheck` memeriksa TypeScript.
- `pnpm test` menjalankan tes unit/integrasi.
- `pnpm test:e2e` menjalankan Playwright.
- `pnpm generate:types` menghasilkan tipe Payload.
- `pnpm migrate:create` dan `pnpm migrate` mengelola migrasi Payload.

Jangan memasukkan `.env`, kredensial, atau data klien ke repositori. Pengembangan lokal belum berarti integrasi Neon, R2, Turnstile, maupun Sentry sudah diverifikasi.
