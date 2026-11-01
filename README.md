# OpenByte Labs

Satu aplikasi Next.js untuk situs publik dan dashboard admin custom. Acuan produk: [`PRD_v1_6_2.md`](PRD_v1_6_2.md) (dokumen ini menetapkan PRD versi 1.5.2).

## Status saat ini

**Lingkungan pengembangan sudah tersambung ke Neon dev dan R2, tetapi Rilis 1 belum siap produksi.** Jangan menganggap halaman yang masih diberi label preview sebagai data tersimpan.

| Area | Yang sudah bekerja | Batas saat ini |
|---|---|---|
| Database dev | Database non-produksi sudah dimigrasi dan di-seed | Identitas target disimpan pada konfigurasi operator lokal; jangan arahkan tes tulis ke database bersama atau produksi |
| Katalog publik | Beranda memuat Settings, layanan, proyek, dan FAQ; `/proyek`, detail proyek, dan `/paket` membaca data database | Copy katalog yang sudah tersimpan belum disahkan untuk produksi; FAQ/paket lama di database tidak diubah pada pekerjaan ini; `noindex` tetap aktif |
| Konten dev | 6 proyek (3 unggulan), 4 layanan, 9 FAQ aktif, dan 6 aset media final | Tidak ada testimoni yang dibuat; dua kandidat testimoni dan empat kandidat FAQ tetap ditahan |
| Form publik | Ketersediaan dan pengajuan booking, inquiry, serta quote memakai Server Actions dan validasi server | Hanya data sungguhan dari pengunjung boleh dibuat; verifikasi Turnstile eksternal belum disahkan untuk produksi |
| Admin | UI DB untuk proyek, layanan, kategori/teknologi, media, kalkulator, booking/jadwal, inquiry, dan quote | Route yang belum terhubung ditutup; bootstrap owner dan login produksi perlu target serta verifikasi pemilik |
| Media | Upload staging privat, validasi server, finalisasi, dan varian WebP; enam aset dev sudah final | Konfigurasi R2 produksi dan kesiapan operasional belum menjadi gerbang rilis |
| Portal klien | `/admin/proyek-klien`, login kode/PIN, sesi proyek, progres, pembayaran, dokumen, revisi, komentar, dan persetujuan memakai database | Owner mengaktifkan portal melalui panel admin; unggah privat memerlukan bucket R2 terpisah dan CORS yang benar. Lihat `docs/backend/TRACKING.md` |

Tidak ada transaksi, booking, inquiry, quote, akun, atau testimoni palsu yang ditambahkan. Konten katalog yang tampil di development bukan bukti persetujuan untuk produksi. Copy default FAQ/paket pada source sudah dirapikan; record yang sudah tersimpan di database dev tidak ditulis ulang dan masih perlu ditinjau. Jangan menjalankan ulang seed atau importer secara manual tanpa meninjau target dan diff.

Status rinci, gap PRD, dan bukti terbaru: [`docs/AUDIT_PRD_v1_6_2.md`](docs/AUDIT_PRD_v1_6_2.md), [`docs/AUDIT_BACKEND_2026-10-30.md`](docs/AUDIT_BACKEND_2026-10-30.md), dan [`docs/backend/FONDASI.md`](docs/backend/FONDASI.md).

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
- Katalog 33 layar referensi: http://localhost:3001/preview (development saja)

Semua halaman publik tetap `noindex`; `/robots.txt` melarang indexing dan sitemap kosong sampai konten/domain disetujui untuk rilis. `/health` memeriksa koneksi database dan mengembalikan 503 bila tidak siap.

## Membuat owner dev

Bootstrap owner memerlukan target database direct yang disetujui, konfirmasi `CREATE-OWNER`, dan terminal interaktif. Prosedur lengkap ada di [`docs/backend/OWNER_BOOTSTRAP.md`](docs/backend/OWNER_BOOTSTRAP.md). **Jangan simpan atau kirim password, secret TOTP, atau recovery code di repository/chat.**

## Cakupan admin

UI yang telah memakai actions/domain database:

- `/admin/showcase` — proyek, draft/publish, trash/restore, versi, relasi media/kategori/teknologi.
- `/admin/layanan`, `/admin/kategori` — layanan, kategori, dan teknologi.
- `/admin/media` — upload dan finalisasi aset R2.
- `/admin/kalkulator` — konfigurasi kalkulator.
- `/admin/booking` — booking, jadwal, dan tanggal terblokir.
- `/admin/inquiry`, `/admin/quotes` — daftar dan tindak lanjut.
- `/admin/proyek-klien` — proyek klien, kode/PIN, aktivasi portal, tahapan, pembayaran, dokumen, revisi, diskusi, dan bukti persetujuan; khusus owner yang sudah MFA.

Route untuk Settings umum, Page Builder, paket/add-on, FAQ/testimoni, dashboard ringkasan, staf, audit-log UI, dan invoice belum dibuka sebagai modul admin aktif. Aksi server yang tersedia bukan bukti bahwa setiap layar sudah memakai alur database.

## Batas rilis

- `/tracking` dan `/tracking/proyek` tersedia hanya setelah owner mengaktifkan portal. Navbar menautkan `/tracking`, tidak lagi menuju demo. Saat nonaktif, akses tracking ditutup. Katalog `/preview` tetap hanya referensi development.
- Kebijakan privasi dan ketentuan layanan saat ini ditandai sebagai draf dan masih memerlukan persetujuan pemilik/legal.
- Belum selesai: persetujuan copy/klaim dan izin konten, verifikasi login/TOTP serta Turnstile pada lingkungan yang disetujui, kredensial dan verifikasi R2/hosting, backup + restore, monitoring, validasi CSP/HSTS di browser, audit aksesibilitas/performa, dan gerbang rilis PRD lainnya. Header keamanan dan workflow CI/secret scan sudah dikonfigurasi, belum menjadi bukti validasi produksi.
- Domain, hosting komersial, deployment, migrasi produksi, dan DNS **tidak termasuk pekerjaan ini**. Jangan deploy sebelum keputusan/izin terpisah.
- Working tree memuat pekerjaan yang belum di-commit. Jangan reset/revert atau menganggap seluruhnya sebagai file sementara.

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

`pnpm test:integration` menulis dan membersihkan data pada database test terisolasi. Sebelum menjalankannya, ikuti [`docs/backend/SETUP_DATABASE_TEST.md`](docs/backend/SETUP_DATABASE_TEST.md); jangan gunakan database dev atau produksi sebagai target tes tulis. `pnpm test:production` adalah smoke test lokal terhadap hasil build, bukan deployment.

## Struktur utama

```text
src/app/                  App Router, halaman publik/admin, API, health
src/actions/              Server Actions publik dan admin
src/auth/                 Better Auth, TOTP, sesi, bootstrap owner
src/db/                   Drizzle, schema, migrasi, stores
src/services/             Use case domain, audit, cache
src/components/public/    Komponen publik dan katalog database
src/components/admin/     UI admin DB untuk modul yang sudah diintegrasikan
src/components/screens/   Layar prototype yang dipertahankan untuk preview
src/fixtures/             Data referensi/fixture untuk area yang belum dimigrasi
tests/                    Unit, integration, E2E, visual
docs/                     Audit, prosedur operator, dan catatan implementasi
```

`pnpm prototype:import` adalah alat migrasi AST satu kali, bukan bagian dari `dev`, `build`, atau `start`. Jangan jalankan ulang setelah suntingan manual tanpa meninjau diff.
