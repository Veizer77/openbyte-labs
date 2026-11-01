# Audit Backend & Integrasi — Status Rilis 1

**Pembaruan:** 31 Oktober 2026  
**Acuan:** `PRD_v1_6_2.md` (isi PRD versi 1.5.2)  
**Lingkup:** backend, integrasi database, media, dan layar aplikasi yang sudah memakai data nyata. Ini bukan persetujuan rilis produksi.

> Persentase 52–62% pada checkpoint 30 Oktober sudah kedaluwarsa: pada saat itu transport/UI belum selengkap kondisi sekarang. Persentase tunggal juga menyamarkan perbedaan antara kode tersedia, UI benar-benar terhubung, data dev terverifikasi, dan operasi produksi. Audit ini memakai status dan gerbang yang eksplisit.

## Ringkasan

Backend Rilis 1 bukan lagi pustaka tanpa transport: server actions, route auth, form publik, katalog database, operasi admin terpilih, dan pipeline R2 dev sudah ada. Namun, **Rilis 1 belum selesai dan belum siap produksi**.

| Area | Status terkini |
|---|---|
| Neon dev dan migrasi | 16 migrasi diterapkan; schema dan seed terverifikasi pada target non-produksi |
| Katalog dev | 6 proyek terbit (3 unggulan), 4 layanan aktif, 9 FAQ aktif; data foundation lain dijaga |
| R2 dev | 6 media final, 24 varian WebP; tidak ada objek `pending` di staging/bucket publik pada pemeriksaan terakhir |
| Server Actions | Login/TOTP/enrollment, operasi admin terpilih, booking/inquiry/quote publik tersedia |
| UI DB terintegrasi | Proyek, layanan, kategori/teknologi, media, kalkulator, booking/jadwal, inquiry, quote; form publik booking/inquiry/quote |
| Bootstrap owner | Skrip membutuhkan target direct eksplisit, konfirmasi `CREATE-OWNER`, dan terminal interaktif; status/kredensial akun tidak dicatat di repo |
| Rilis 1 produksi | **Belum siap**; ada gap UI/konten, Turnstile, backup/restore, monitoring, validasi security headers, a11y/performa, hosting/domain, dan gerbang lain PRD |
| Rilis 2 | Portal klien belum operasional; `/tracking*` tetap 404 |

Identitas target dev disimpan pada konfigurasi operator lokal, bukan dokumentasi repo. Jangan arahkan tes tulis ke database bersama atau produksi. Tidak ada data transaksi, booking, inquiry, quote, akun tambahan, atau testimoni palsu yang dibuat.

## Yang sudah dibuktikan

- **Database:** migrasi `0000`–`0015`, exclusion constraint booking, dan seed foundation diterapkan. Loader publik membaca Settings, kategori, paket, FAQ, layanan, dan proyek dari PostgreSQL melalui server.
- **Impor konten dev:** enam project (tiga unggulan), empat service, enam media final, dan taksonomi terkait berhasil diverifikasi. Dry-run berikutnya mereuse data yang ada tanpa duplikasi. Sepuluh FAQ foundation tetap dipertahankan (sembilan aktif; FAQ tracking tetap nonaktif); empat kandidat FAQ homepage dan dua testimonial ditahan.
- **Katalog publik:** beranda memakai Settings dan section dinamis untuk layanan/proyek/FAQ; `/proyek`, detail proyek, dan `/paket` menggunakan data database. Detail proyek tidak fallback ke fixture. Halaman/copy lain belum seluruhnya CMS-backed.
- **Form publik:** booking membaca ketersediaan server dan membuat booking melalui action; inquiry dan quote memakai server action. Quote menghitung ulang dari konfigurasi database. Tidak ada simulasi yang dilaporkan sebagai transaksi tersimpan.
- **Admin:** proyek mendukung penyimpanan/publish/trash/versi; service dan kategori/teknologi memiliki UI CRUD; media memakai signed PUT ke staging privat dan finalisasi server; kalkulator, booking/jadwal, inquiry, dan quote memakai actions/database.
- **Auth:** route password, TOTP, recovery, enrollment, bukti MFA per sesi, lockout, dan RBAC ada. CLI owner meminta password tanpa echo, mengaudit bootstrap, memilih koneksi direct (bukan `TEST_DATABASE_URL`), dan memerlukan target operator yang cocok.
- **Health:** `/health` mencoba `SELECT 1`, merespons 200 ketika DB tersambung dan 503 bila tidak siap.
- **Keamanan proses:** route tracking tetap tertutup; halaman publik memakai `noindex`; robots melarang indexing dan sitemap kosong.

## Gap yang masih menghalangi penyelesaian

### Gate operator dan auth

1. Verifikasi status owner hanya melalui alur operator yang disetujui. Jangan mengulang bootstrap atau reset akun tanpa pemeriksaan read-only. Instruksi ada di `docs/backend/OWNER_BOOTSTRAP.md`; jangan kirim password, connection string, secret TOTP, atau recovery code melalui chat.
2. Uji login password → enrollment TOTP → sesi admin, logout/login → TOTP, recovery code, dan penolakan akses tanpa MFA hanya pada target non-produksi yang disetujui. Alur in-memory/unit bukan pengganti pengujian HTTP ini.

### UI, konten, dan perilaku

1. Integrasikan Settings, Page Builder/draft preview, FAQ/testimoni, paket/add-on, serta UI staf dan audit log sebelum membuka route-nya sebagai modul aktif.
2. Rekonsiliasi semua copy dan klaim proyek/layanan yang masih statis terhadap data yang disetujui pemilik. Privacy/terms tetap draf sampai disetujui. Jangan memulihkan konten trashed atau mengaktifkan kembali testimonial/FAQ kandidat.
3. Lengkapi acceptance PRD untuk ordering/filter, konten per halaman, cache/revalidasi, publishing/preview, dan aksesibilitas; jangan menganggap satu section DB-backed berarti seluruh halaman sudah CMS-backed.

### Operasi produksi

1. Verifikasi Turnstile ke Cloudflare dan konfigurasi produksi; enam aset R2 dev yang berhasil bukan bukti kesiapan kredensial R2 production.
2. Validasi CSP/HSTS yang telah dikonfigurasi di browser/deployment; siapkan Sentry/uptime, backup terenkripsi dan uji restore, jalankan CI/secret scan, audit akses/IDOR HTTP, browser tambahan, audit WCAG, dan Lighthouse/LCP sesuai PRD.
3. Putuskan hosting dan domain secara terpisah, lalu lakukan gerbang migrasi dan deployment produksi setelah mendapat persetujuan. Deployment dan DNS tidak dilakukan dalam pekerjaan ini.

## Verifikasi yang tercatat

Typecheck, lint, unit test, dan build berikut dijalankan setelah perubahan readiness dan copy pada 31 Oktober 2026. Tidak ada tes integrasi/database atau deployment dalam pemeriksaan ini.

| Pemeriksaan | Hasil / batas bukti |
|---|---|
| `pnpm typecheck` | Lulus setelah perubahan readiness pada 31 Oktober |
| `pnpm test` | 237 tes lulus di 54 berkas setelah perubahan readiness pada 31 Oktober |
| `pnpm lint` | Lulus tanpa error atau warning setelah perubahan readiness pada 31 Oktober |
| `pnpm audit --prod` | Tidak ada advisory dikenal setelah override terarah `esbuild` ke `0.25.12`; `@esbuild-kit` tetap deprecated (31 Oktober 2026) |
| `pnpm test:integration` | Checkpoint sebelumnya: 7 tes lulus pada database test terisolasi; tidak dijalankan ulang dalam audit ini |
| `pnpm build` | Lulus setelah perubahan readiness pada Next.js 16.4.3, 31 Oktober; route publik/admin dinamis dan halaman login/robots/sitemap statis |
| Database dev / R2 | Read/apply/verification pada target dev seperti di atas; bukan pengujian produksi |
| E2E, Turnstile, backup/restore, deployment | Tidak diklaim lulus pada audit ini |

Perbaikan CLI owner: skrip operator memakai `@next/env`, mengabaikan URL test, meminta target direct eksplisit, dan mewajibkan `CREATE-OWNER` serta terminal interaktif. Rincian akun/kredensial tidak dicatat di dokumentasi. Verifikasi login end-to-end tetap harus dilakukan pemilik pada target non-produksi yang disetujui.

## Catatan keselamatan dan kerja

- `pnpm test:integration` menulis dan membersihkan data. Gunakan hanya target test terisolasi sesuai `docs/backend/SETUP_DATABASE_TEST.md`.
- `pnpm owner:create` hanya berjalan pada target yang cocok dengan `OWNER_BOOTSTRAP_TARGET`; jangan menonaktifkan guard atau menggunakan target yang belum disetujui.
- `pnpm db:seed:foundation` tidak perlu dijalankan ulang untuk menyelesaikan bootstrap owner. Seeder bukan alat untuk memperbaiki konten secara manual.
- Working tree masih berisi perubahan tracked, untracked, dan deleted yang belum di-commit. Jangan reset/revert atau menghapus perubahan yang tidak dibuat pada tahap ini.
- Tidak ada deployment atau perubahan DNS.

## Addendum — CMS/invoice, 1 November 2026

Sejak snapshot audit 31 Oktober, layar admin untuk Dashboard, Settings, Page Builder, FAQ, testimoni, paket/add-on, pengguna, dan audit log telah dipulihkan dan dihubungkan ke Server Actions/database. UI invoice/termin, template tahap, daftar berkas privat, dan konversi proyek selesai menjadi shell portofolio anonim juga tersedia. Semua akses tetap diperiksa server-side.

Verifikasi lokal pada 1 November: typecheck, lint, 298 unit test/63 berkas, dan production build lulus. Tes integrasi/database, browser smoke, dan R2 nyata tidak dijalankan ulang. `pnpm db:generate` menghasilkan `0016_dark_surge.sql` untuk invoice serta `payments.invoice_id`; migrasi hanya digenerate offline dan **belum diterapkan**. Tidak ada perubahan database aplikasi, aktivasi portal, atau deployment.

Reproduksi `pnpm dev` menemukan proses Next yang sudah aktif pada port 3000; peluncuran instance kedua berhenti dengan `ELIFECYCLE` karena deteksi server/lock duplikat. Server yang sudah ada menjawab `/admin/login` dengan HTTP 200 dan sengaja tidak dihentikan. Percobaan awal dengan delimiter `--` juga meneruskan argumen sebagai direktori; itu bukan kegagalan aplikasi.

Gerbang tersisa: persetujuan owner untuk target migrasi, aktivasi portal, konfigurasi dan verifikasi bucket R2 privat, integrasi PostgreSQL/browser terbaru, review materi portofolio, serta seluruh gate produksi pada audit ini.
