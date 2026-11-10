# OpenByte Labs

Satu aplikasi Next.js untuk situs publik, dashboard admin custom, dan portal klien. Acuan produk: [`PRD_v1_6_2.md`](PRD_v1_6_2.md) (berkas bernama v1.6.2, isinya menyatakan spesifikasi versi 1.5.2).

## Status saat ini

**Rilis 1 live di produksi sejak 3–4 November 2026; portal klien (Rilis 2) diaktifkan 10 November 2026.** Produksi berjalan di `https://openbyte-labs.vercel.app` dan di-deploy otomatis dari branch `main` (GitHub → Vercel). Rilis 1 ditutup pada tag `release-1` dengan seluruh gate G1–G7 lulus; Rilis 2 telah menyelesaikan Wave A, B, dan C dengan gate R2-G1…R2-G6 lulus. Bukti: [`docs/RELEASE-1-2026-11-03.md`](docs/RELEASE-1-2026-11-03.md) dan [`docs/RELEASE-2-2026-11-07.md`](docs/RELEASE-2-2026-11-07.md).

| Area | Yang sudah bekerja | Batas saat ini |
|---|---|---|
| Database produksi | Neon branch `main` / `openbyte_labs`, **21 migrasi** terterap, runtime memakai endpoint pooler | Migrasi/seed/backup memakai koneksi direct dengan konfirmasi target; jangan arahkan tes tulis ke produksi |
| Katalog publik | Beranda, `/proyek`, detail proyek, `/paket`, `/layanan/*` membaca database; indexing aktif | `/blog` sengaja `noindex` karena modul editorial belum ada; persetujuan copy/klaim dan izin konten masih perlu dituntaskan |
| Form publik | Booking, inquiry, quote lewat Server Actions, Turnstile, dan rate limit; tiga submission asli pemilik terverifikasi | Tidak ada submission publik dalam jendela monitoring 24 jam — kestabilan terbukti, bukan beban |
| Admin | **22 rute aktif** memakai actions/domain database; 9 di antaranya khusus owner dengan MFA | `/admin/*` selalu `noindex`; tidak ada endpoint CRUD generik |
| Media | Upload staging privat, finalisasi, varian WebP di R2; bucket backup terenkripsi terpisah | Bucket privat dokumen klien perlu diverifikasi terpisah; host `r2.dev` bermasalah pada sebagian jaringan ISP |
| Portal klien | `/tracking` aktif, login kode/PIN, progres, pembayaran, dokumen, revisi, diskusi, dan persetujuan memakai database | Belum terdokumentasi proyek klien nyata maupun uji alur penuh dari perangkat klien |
| Operasional | Sentry + source map, uptime monitor 15 menit/6 jam, backup harian terenkripsi, restore drill lulus | Secret `BACKUP_DATABASE_URL` di GitHub perlu diperbarui setelah rotasi password role DB; rotasi `BETTER_AUTH_SECRET` masih ditunda |

Tidak ada transaksi, booking, inquiry, quote, akun, atau testimoni palsu yang ditambahkan. Data katalog yang tampil di development bukan bukti persetujuan konten produksi. Jangan menjalankan ulang seed atau importer secara manual tanpa meninjau target dan diff.

Status rinci, gap PRD, dan bukti terbaru: [`docs/RELEASE-1-2026-11-03.md`](docs/RELEASE-1-2026-11-03.md), [`docs/RELEASE-2-2026-11-07.md`](docs/RELEASE-2-2026-11-07.md), [`docs/AUDIT_PRD_v1_6_2.md`](docs/AUDIT_PRD_v1_6_2.md), dan [`docs/backend/FONDASI.md`](docs/backend/FONDASI.md). Audit 31 Oktober 2026 dan `docs/AUDIT_BACKEND_2026-10-30.md` adalah **snapshot lama**, bukan status terkini.

## Prasyarat lokal

- Node.js `>=22`, pnpm `12.3.4`.
- `.env.local` lokal yang tidak di-commit; mulai dari `.env.example`. Isi `DATABASE_URI` dengan pooled URL lingkungan dev, `BETTER_AUTH_SECRET` dan `IP_HASH_SALT` masing-masing minimal 32 karakter, serta `SITE_URL` sesuai origin lokal. Pengembangan dapat memakai `http://localhost:3001`.
- Untuk upload media, tambahkan konfigurasi R2 dev; tanpa konfigurasi tersebut, upload R2 tidak siap.

Jangan tempelkan nilai rahasia ke chat, issue, screenshot, atau commit. Next dan skrip operator membaca `.env*` memakai urutan prioritas `@next/env`; konfigurasi dev yang sudah ada di `.env` tidak perlu disalin ke `.env.local`.

## Menjalankan

```powershell
pnpm install --frozen-lockfile
pnpm dev --port 3001
```

- Website: http://localhost:3001
- Login admin: http://localhost:3001/admin/login

Indexing publik dikunci oleh `PUBLIC_INDEXING_ENABLED`: saat `true` (produksi) `/robots.txt` mengizinkan perayapan dengan `Disallow` untuk `/admin`, `/tracking`, `/api`, `/pesan`, `/konsultasi`, dan sitemap berisi URL nyata; saat `false` seluruh situs `disallow`. `/blog` selalu `noindex`. `/health` menjalankan `SELECT 1` dan mengembalikan 503 bila database tidak siap.

## Membuat owner dev

Bootstrap owner memerlukan target database direct yang disetujui, konfirmasi `CREATE-OWNER`, dan terminal interaktif. Prosedur lengkap ada di [`docs/backend/OWNER_BOOTSTRAP.md`](docs/backend/OWNER_BOOTSTRAP.md). **Jangan simpan atau kirim password, secret TOTP, atau recovery code di repository/chat.**

## Cakupan admin

Seluruh rute pada `liveRoutes` (`src/app/admin/[[...path]]/page.tsx`) memakai Server Actions dan domain database:

- **Konten:** `/admin/showcase` (proyek, draft/publish, trash/restore, versi), `/admin/layanan`, `/admin/kategori`, `/admin/teknologi`, `/admin/media`.
- **CMS:** `/admin/dashboard`, `/admin/settings`, `/admin/pages` (Page Builder), `/admin/faqs`, `/admin/testimonials`, `/admin/packages`, `/admin/addons`, `/admin/kalkulator`.
- **Operasional:** `/admin/booking`, `/admin/inquiry`, `/admin/quotes`, `/admin/proyek-klien`, `/admin/template-tahap`, `/admin/invoice`, `/admin/berkas`.
- **Sistem (owner):** `/admin/users`, `/admin/audit-logs`, serta `proyek-klien`, `booking`, `inquiry`, `quotes`, `template-tahap`, `invoice`, `berkas`.

Rute di luar daftar itu mengembalikan 404. Menyembunyikan menu bukan mekanisme otorisasi; setiap action memanggil `requireAdmin()` dan `authorize()`.

## Batas rilis

- Portal `/tracking` **sudah aktif** di produksi (`tracking.trackingEnabled = true`, 10 November 2026). Saat nonaktif, gerbang pada fase `generateMetadata` mengembalikan 404 nyata dan tautan navbar disembunyikan.
- Deploy kode **hanya** lewat push ke `main`. `npx vercel --prod` tidak dipakai; `npx vercel redeploy` hanya untuk menerapkan perubahan environment variable.
- Teks final kebijakan privasi/ketentuan layanan, persetujuan klaim, dan izin konten masih memerlukan keputusan pemilik/legal.
- Rotasi password role database produksi sudah dilakukan 10 November 2026. **Rotasi `BETTER_AUTH_SECRET` masih ditunda** atas keputusan pemilik; secret itu juga menjadi dasar kunci sesi tracking.
- Yang belum terbukti: pembaruan `BACKUP_DATABASE_URL` pada GitHub environment `backup`, proyek klien nyata + uji alur portal dari perangkat klien, LCP ≤ 1,8 detik, audit aksesibilitas/performa formal, cache tag, modul editorial/blog, dan paginasi lanjut UI portal.
- Custom domain ditolak pemilik; produksi memakai domain Vercel. Perlu dicatat bahwa PRD awalnya mewajibkan domain dan hosting komersial sebelum Rilis 1.
- **Working tree memuat pekerjaan pemilik yang belum di-commit** (perubahan UI, `SplashScreen`, dan berkas terkait). Jangan reset/revert, jangan anggap sebagai file sementara, dan jangan menyertakannya ke commit tanpa izin. Karena deploy hanya dari `main`, perubahan tersebut belum ada di produksi.

## Pengujian

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm test:integration
pnpm test:tracking
pnpm test:e2e
pnpm check:portability
pnpm build
```

`pnpm test:integration` menulis dan membersihkan data pada database test terisolasi. Ikuti [`docs/backend/SETUP_DATABASE_TEST.md`](docs/backend/SETUP_DATABASE_TEST.md); jangan gunakan database dev atau produksi sebagai target tes tulis. Job `integration` pada `.github/workflows/ci.yml` tersedia lewat `workflow_dispatch` dengan layanan `postgres:17`; job itu tidak memblokir CI wajib dan masih perlu diverifikasi pada runner GitHub.

`pnpm test:production` adalah smoke HTTP terhadap target `SMOKE_BASE_URL` (bukan deployment). Status portal kini **dideteksi otomatis** dari `/tracking`; `SMOKE_TRACKING_ENABLED` opsional dan hanya untuk mengunci ekspektasi. `SMOKE_INDEXING_ENABLED=true` diperlukan saat menarget produksi yang sudah mengizinkan indexing.

## Struktur utama

```text
src/app/                  App Router, halaman publik/admin, API, health
src/actions/              Server Actions publik dan admin
src/auth/                 Better Auth, TOTP, sesi, bootstrap owner
src/db/                   Drizzle, schema, migrasi, stores
src/services/             Use case domain, audit, cache
src/components/public/    Komponen publik dan katalog database
src/components/admin/     UI admin DB untuk modul yang sudah diintegrasikan
src/components/screens/   Layar prototype yang dipertahankan untuk komponen tampilan
src/fixtures/             Data referensi/fixture (hanya dipakai seed, bukan runtime)
tests/                    Unit, integration, E2E, visual
docs/                     Audit, prosedur operator, dan catatan implementasi
```

`pnpm prototype:import` adalah alat migrasi AST satu kali, bukan bagian dari `dev`, `build`, atau `start`. Jangan jalankan ulang setelah suntingan manual tanpa meninjau diff.
