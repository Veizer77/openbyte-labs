# AGENTS.md — OpenByte Labs

Aturan kerja untuk agen coding (Claude Code, Cursor, dll.) pada repositori ini. **Sumber kebenaran adalah `PRD_v1_4.md`.** Bila kode dan PRD berbeda, jangan memutuskan sendiri: hentikan dan tanyakan pemilik, atau usulkan perubahan PRD.

## 1. Proyek Singkat
Satu aplikasi Next.js (App Router, TypeScript strict) berisi situs publik, panel admin Payload CMS di `/admin`, dan Server Action/endpoint. Database PostgreSQL (Neon), storage Cloudflare R2, styling Tailwind CSS. Bahasa antarmuka: **Indonesia**. Zona waktu tampilan: **Asia/Jakarta (WIB)**.

## 2. Cakupan Rilis (jangan melompat)
* **Rilis 1 (Fase 0-5):** situs company, portofolio, kalkulator, paket, inquiry, booking.
* **Rilis 2 (Fase 6):** portal klien (tracking, revisi, persetujuan). **Jangan membangun atau menautkannya sebelum diminta.** `/tracking*` harus 404 selama `tracking.trackingEnabled` mati.
* Kerjakan **satu fase per sesi**; tanyakan fase aktif bila tidak jelas. Kriteria selesai tiap fase: PRD 10.1.

## 3. Versi Dikunci (PRD, catatan versi paket)
Payload **3.92.0** (bukan 4 beta), Next.js dalam rentang peer `@payloadcms/next`, Node sesuai `engines` Payload. Semua `@payloadcms/*` **versi sama persis** dengan `payload`. **Jangan menaikkan versi paket** tanpa persetujuan; jangan memakai API yang belum diverifikasi di PRD 12.3 tanpa membaca dokumentasi versi terkunci.

## 4. Perintah
`pnpm dev` · `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm test:e2e` · `pnpm generate:types` · `pnpm migrate:create` · `pnpm migrate` · `pnpm seed` · `pnpm check:access` · `pnpm check:portability`.
Sebelum menyatakan selesai: jalankan `lint`, `typecheck`, `test`, dan (bila menyentuh koleksi) `generate:types` + `check:access`. Laporkan hasil apa adanya, termasuk yang gagal.

## 5. Struktur (PRD 2.3)
`src/app/(frontend)` situs · `src/app/(payload)` admin/API Payload · `src/collections` · `src/globals` · `src/blocks` · `src/access` · `src/hooks` · `src/lib/{calculator,booking,whatsapp,tracking,security,format}` · `src/migrations` · `src/seed` · `tests/`.
`src/lib/*` adalah **TypeScript murni**: tidak boleh mengimpor dari `app/` atau Payload, agar dipakai browser dan server serta mudah diuji.

## 6. Aturan Keras
**Data dan skema**
* Uang = **bilangan bulat Rupiah**. Waktu disimpan UTC, ditampilkan WIB. `slotStart`/`slotEnd` untuk booking.
* Skema diubah lewat **migrasi Payload**, bukan mode *push*. Migrasi harus aman tanpa downtime (tambah dulu, hapus di rilis berikutnya) dan dijalankan lewat `DATABASE_URI_DIRECT`.
* Kendala eksklusi booking ada di migrasi SQL kustom (PRD G.7); jangan dihapus.
* Nilai turunan (`paidAmount`, `currentStep`, `revisionsUsed`) **tidak pernah diisi manual**; dihitung hook dalam transaksi.

**Keamanan**
* **Akses tertutup secara bawaan.** Setiap koleksi wajib punya fungsi akses eksplisit; `pnpm check:access` harus lulus. GraphQL dimatikan. REST anonim hanya membaca konten publik yang published/aktif.
* **Semua penulisan dari publik** lewat Server Action: validasi zod → Turnstile + honeypot → rate limit → Local API. Server memvalidasi ulang semuanya; jangan percaya nilai dari browser (harga, status, id).
* Teks dari pengguna dirender sebagai **teks**; tidak ada `dangerouslySetInnerHTML` untuk teks klien. HTML mentah wajib disanitasi; tautan hanya `https`/`http`/`mailto`/`tel`.
* Jangan menulis rahasia, kunci, kode/PIN, atau data pribadi ke log, repositori, atau pesan galat. PIN hanya disimpan sebagai hash; IP hanya sebagai hash bersalt.
* Pesan galat login tracking selalu generik.

**Portabilitas dan operasi**
* **Dilarang** `@vercel/*`, Vercel Blob/KV/Cron/Edge Config. Tidak ada pekerjaan latar/cron/queue (PRD 7.7). Konfigurasi platform dari environment.
* Tidak ada email. Notifikasi lewat panel admin dan tautan WhatsApp.
* Variabel lingkungan divalidasi di `env.ts`; variabel baru ditambahkan ke `.env.example`.

**Konten dan desain**
* Ikuti **Lampiran D** (token, tipografi, komponen). Nilai warna/font hanya sebagai token; jangan ditulis langsung di komponen.
* Teks UI berbahasa Indonesia. **Jangan mengarang** testimoni, angka, atau klaim. Konten yang butuh data pemilik memakai `[ISI]` dan tidak boleh terbit.

## 7. Cara Bekerja
1. Baca bagian PRD yang relevan sebelum menulis kode; sebut bagian yang dirujuk di deskripsi perubahan.
2. Untuk `src/lib/*`, **tulis uji lebih dulu** memakai vektor Lampiran G sebagai fixture; implementasi harus menghasilkan nilai identik.
3. Perubahan kecil dan terfokus; jangan merombak berkas di luar tugas. Jangan menghapus uji agar hijau.
4. Bila menemukan asumsi PRD yang ternyata salah (mis. opsi Payload tidak ada), **berhenti dan laporkan** dengan bukti, jangan menambal diam-diam.
5. Setelah selesai: ringkas apa yang diubah, apa yang diuji, dan apa yang belum teruji.

## 8. Hal yang Selalu Ditanyakan ke Pemilik
Keputusan hosting produksi, domain, isi `[ISI]`, harga, kebijakan privasi/revisi, penghapusan data, dan apa pun yang mengubah cakupan rilis.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
