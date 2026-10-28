# AGENTS.md: OpenByte Labs

## Acuan dan fase

- Satu-satunya PRD aktif adalah `PRD_v1_5.md`. Rencana aktif: `RENCANA_IMPLEMENTASI_PRD_1_5.md`.
- Stack target: Next.js App Router, React, TypeScript strict, Tailwind, Drizzle ORM/Kit, Neon PostgreSQL, Better Auth dengan TOTP, R2, Zod, Vitest, Playwright.
- Tidak memakai CMS siap pakai, REST/GraphQL CRUD generik, NestJS, email, queue, atau cron aplikasi. Tidak memakai paket `@vercel/*`.
- Status saat reset: Fase 0 baru dimulai. Hasil tes dan status selesai implementasi sebelum reset tidak berlaku untuk stack ini.
- Kerjakan satu fase per sesi. Fase 6/portal klien hanya setelah diminta; `/tracking*` tetap 404 pada Rilis 1.

## Desain dan konten

- Prototype full-page di `prototype/stitch/site/` dan `prototype/stitch/cms/` adalah acuan UI website serta admin custom. Kata CMS pada prototype adalah fungsi pengelolaan konten, bukan pilihan dependency.
- Jangan menciptakan design system, font, warna, layout, atau logo baru yang bertentangan dengan prototype. Jangan mengubah HTML/aset referensi tanpa persetujuan.
- Bahasa UI Indonesia, waktu UTC di database dan WIB saat ditampilkan, uang integer Rupiah.
- Tidak ada testimoni/angka/klaim rekaan. Konten `[ISI]` tidak boleh dipublikasikan.

## Server, data, dan keamanan

- Ikuti struktur PRD 2.3: `src/app/(public)`, `src/app/admin`, `src/app/api`, `src/db`, `src/auth`, `src/access`, `src/actions`, `src/services`, `src/schemas`, `src/lib`, `src/components`, `src/seed`.
- Browser tidak mengakses database. Mutasi melalui service berizin; Drizzle tidak menyediakan otorisasi otomatis.
- Default deny. Setiap aksi/route/admin service memeriksa sesi, penyelesaian TOTP, role, resource, operasi, dan field. Editor tidak boleh mengakses data operasional/Sistem/Settings WhatsApp atau Tracking.
- `lib/calculator` dan `lib/booking` murni TS tanpa Next.js/DB/auth. Tulis fixture Lampiran F terlebih dahulu sebelum implementasi.
- Mutasi publik: Zod, Turnstile/honeypot, rate limit atomik, baca otoritatif DB, transaksi/service. Jangan percaya harga/status/slot dari browser.
- Migrasi Drizzle berversi via koneksi direct, ditinjau sebelum dijalankan. Jangan melakukan push produksi atau membuang constraint booking.
- Reset kode tidak mengizinkan reset database. Jangan migrasi schema baru pada database berisi data sebelumnya tanpa rencana porting dan persetujuan pemilik.
- Audit append-only, versi konten, dan perubahan domain terkait berada dalam transaksi. Nilai turunan tidak ditulis manual.
- Jangan menulis rahasia, password, token, TOTP/recovery code, atau PII ke log/repo/error. IP hanya hash bersalt; header proxy tidak dipercaya tanpa konfigurasi hosting.
- Jangan merender teks pengguna sebagai HTML. Validasi node rich text, URL, MIME/byte upload; SVG user ditolak.
- `.env` dan `.env.local` milik pemilik: jangan ditimpa. Variabel baru ditambahkan di `.env.example` dan validator environment.

## Perintah dan verifikasi

- `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm check:portability`, `pnpm check:access`.
- Saat ini `check:access` hanya menguji batas reset yang tertutup, bukan matriks RBAC Better Auth yang belum dibangun. Jangan mengklaim N-02/N-06 lulus dari tes tersebut.
- Perintah migrasi/seed/owner baru ditambahkan setelah schema dan service terkait tersedia. Jangan menggantinya dengan script yang mengklaim sukses tanpa melakukan pekerjaan.
- Sebelum selesai: lint, typecheck, test, portability, dan pemeriksaan yang relevan; laporkan gagal/dilewati/tidak dijalankan. Build/E2E diperlukan untuk perubahan route/runtime.
- Versi dependency dikunci persis. Baca API versi terpasang sebelum dipakai; upgrade selanjutnya memerlukan persetujuan. Jangan mempertahankan override dependency tanpa bukti kebutuhan.
- Tanyakan pemilik untuk hosting/domain/biaya, isi `[ISI]`, harga, kebijakan, penghapusan data, atau perubahan cakupan. Jika PRD dan kemampuan paket berbeda, berhenti dan ajukan keputusan.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
