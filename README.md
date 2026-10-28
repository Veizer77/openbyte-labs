# OpenByte Labs

**Acuan aktif: [PRD_v1_5.md](./PRD_v1_5.md).** Website dan dashboard admin custom mengikuti prototype pemilik. Stack target: Next.js, React, Tailwind, Drizzle/PostgreSQL, Better Auth, dan R2.

## Status

Pada 28 Oktober 2026 pemilik memilih **reset seluruh implementasi**, termasuk modul murni dan tes sebelumnya. Implementasi sebelum reset tidak diporting diam-diam. Fase 0 perlu diverifikasi ulang sesuai PRD 12.3; tidak ada fase yang dianggap selesai dari hasil lama.

Fondasi sekarang hanya menyediakan:

- `/`: HTTP 503 JSON yang menjelaskan re-baseline, bukan website siap pakai.
- `/admin*`: HTTP 503; belum ada login, dashboard, atau operasi admin.
- `/tracking*`: HTTP 404 selama Rilis 1.
- `/health` dan `/api/health`: SELECT 1 melalui koneksi Drizzle/PostgreSQL runtime, tanpa cache; 503 bila probe database gagal. Startup menolak environment tidak valid. Ini bukan bukti schema/auth sudah siap.
- Validator environment baru, dependency exact-pinned, pemeriksaan portabilitas, unit test, dan smoke test HTTP.

Better Auth sudah dicantumkan sebagai dependency untuk verifikasi Fase 0, **belum dihubungkan atau diekspos melalui endpoint auth**. Tidak ada migrasi, schema domain/auth, seed, upload, monitoring, atau CRUD produksi baru yang diklaim selesai.

## Menjalankan lokal

1. Gunakan Node `^22.23.4`, `^24.22.1`, atau `>=26.0.0`, pnpm `12.3.4` (rentang bersama tooling baru).
2. `pnpm install --frozen-lockfile`.
3. Untuk lingkungan baru, salin `.env.example` ke `.env`. **Jangan menimpa `.env` atau `.env.local` yang sudah ada.** Tambahkan `BETTER_AUTH_SECRET` baru minimal 32 karakter dan sesuaikan `BETTER_AUTH_URL` dengan origin `SITE_URL` pada konfigurasi lokal pemilik. Jangan tampilkan secret dalam laporan.
4. `pnpm dev`. Validasi environment dijalankan saat startup runtime. Build tidak memerlukan koneksi database atau menjalankan DDL.
5. Website/admin akan memberi 503 secara sengaja sampai fase implementasinya selesai. Tidak ada tampilan prototype yang dianggap sudah diimplementasikan.

Database yang sudah ada, objek R2, `.env*`, `.git`, `public/`, dan prototype/aset pemilik tidak dihapus oleh reset kode. Jangan menjalankan schema Drizzle baru pada database tersebut tanpa persetujuan dan strategi porting. Skrip migrasi, seed, dan recovery akan dibuat bersama schema/service baru; belum tersedia sekarang.

## Pemeriksaan

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm check:portability
pnpm check:access
pnpm build
pnpm test:e2e
```

`check:access` saat ini memverifikasi batas reset, bukan autentikasi/RBAC yang selesai. E2E saat ini menggunakan HTTP request tanpa browser dan database pada port tertutup untuk membuktikan error aman; bukan pengganti E2E UI/TOTP yang wajib ditambahkan nanti. Jalankan build sebelum E2E. Tidak ada tes yang melakukan mutasi database.

Hasil reset: 15 unit test dan 4 tes HTTP standalone lulus, beserta lint, typecheck, build, portabilitas, dan frozen-lockfile install. Audit tidak menemukan high/critical, tetapi masih melaporkan satu moderate pada `esbuild` transitif Drizzle Kit. Rincian dan pemeriksaan yang belum dijalankan ada di rencana aktif.

Untuk distribusi standalone, build dari lingkungan bersih. Hasil build lokal Next.js dapat menyertakan salinan `.env`; jangan membagikan atau mengunggahnya. Docker mengecualikan `.env*` dari build context, tetapi build/run Docker belum diuji.

## Pekerjaan berikutnya

Lihat [RENCANA_IMPLEMENTASI_PRD_1_5.md](./RENCANA_IMPLEMENTASI_PRD_1_5.md). Mulai dengan inventaris prototype serta N-01/N-02. Jangan menganggap login lama, database lama, atau laporan tes lama membuktikan implementasi baru.
