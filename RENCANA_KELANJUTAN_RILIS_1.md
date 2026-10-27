# Rencana Kelanjutan OpenByte Labs: Penutupan Fase 0 sampai Rilis 1

- Tanggal penyusunan: 27 Oktober 2026.
- Status dokumen: rencana eksekusi, belum merupakan laporan pekerjaan selesai.
- Acuan utama: `PRD_v1_4.md`, versi isi saat penyusunan 1.4.0, serta `AGENTS.md`.
- Sasaran: menuntaskan aplikasi Rilis 1 yang terintegrasi, aman, dapat dioperasikan, dan terverifikasi di produksi.
- Batas: dokumen ini tidak mengizinkan pembangunan Rilis 2, perubahan harga, pembelian layanan, atau deployment produksi tanpa persetujuan pemilik.
- Pelaksana: agent implementasi bersama pemilik untuk keputusan produk, akses layanan, dan persetujuan rilis.

> PRD tetap sumber kebenaran. Dokumen ini mengurutkan pekerjaan berdasarkan audit, bukan menggantikan spesifikasi. Jika ditemukan perbedaan kode, PRD, atau rencana ini, agent harus melaporkannya dan meminta keputusan sebelum mengubah perilaku yang diperselisihkan.

## 1. Cara menggunakan dokumen ini

1. Baca `AGENTS.md`, dokumen ini, lalu bagian PRD yang dirujuk oleh paket kerja aktif.
2. Verifikasi ulang keadaan kode. Temuan 27 Oktober 2026 bukan jaminan keadaan repositori pada sesi berikutnya.
3. Pilih **satu fase untuk satu sesi**. Pemilik menyetujui fase aktif dan paket kerja yang dikerjakan.
4. Kerjakan paket secara berurutan berdasarkan dependensi. Jangan menyelesaikan seluruh roadmap dalam satu sesi.
5. Sebelum menulis implementasi `src/lib/*`, tulis uji terlebih dahulu menggunakan vektor Lampiran G yang relevan.
6. Tulis perubahan kecil, uji, lalu catat bukti dan pekerjaan tersisa. Jangan menghapus uji untuk membuat hasil hijau.
7. Hentikan sesi setelah paket yang disepakati selesai atau terblokir. Jangan otomatis memulai fase berikutnya.

### 1.1 Arti status dan prioritas

| Status | Makna |
|---|---|
| `BELUM_MULAI` | Belum ada bukti implementasi dan pengujian untuk paket ini. |
| `DALAM_PENGERJAAN` | Ada pekerjaan aktif; belum memenuhi seluruh kriteria selesai. |
| `TERBLOKIR` | Membutuhkan keputusan, akses, perbaikan dependensi, atau lingkungan yang belum tersedia. |
| `SIAP_DIVERIFIKASI` | Implementasi tersedia; pengujian atau bukti lingkungan target belum lengkap. |
| `SELESAI_TERVERIFIKASI` | Seluruh kriteria paket lulus dengan bukti yang dapat diperiksa. |

- **P0:** keselamatan database, rahasia, dan validitas lingkungan pengujian. Kerjakan sebelum operasi berisiko atau penambahan fitur.
- **P1:** prasyarat fungsi utama, akses admin, integrasi CMS, dan keamanan alur publik. Memblokir penyelesaian fase terkait.
- **P2:** kelengkapan produk, performa, aksesibilitas, dan operasi rilis. Tetap wajib sebelum Rilis 1 sesuai PRD.

P0/P1/P2 bukan estimasi waktu. Tidak ada persentase kemajuan atau tanggal peluncuran yang dapat dijamin dari audit kode saja.

### 1.2 Batas satu fase dan dependensi lintas fase

- Batas fase berdasarkan tujuan pekerjaan, bukan semata-mata direktori. Dukungan route preview untuk admin boleh menjadi bagian paket preview Fase 2.
- Jika verifikasi Fase 0 menemukan cacat migrasi Fase 1, jangan memperbaiki dua fase diam-diam dalam satu sesi. Catat blocker dan minta pemilik menjadwalkan sesi koreksi Fase 1, lalu kembali memverifikasi Fase 0.
- Utilitas bersama yang diperlukan lebih awal, seperti pembuat tautan WhatsApp untuk admin, dapat dibuat dalam paket kebutuhan admin dengan uji yang sama. Fase 4 wajib menggunakan kembali utilitas tersebut, bukan membuat versi kedua.
- Fase sebelumnya yang terblokir tidak boleh ditandai selesai hanya karena agent dapat mengerjakan kode fase berikutnya.
- Pemilik dapat mengizinkan pengerjaan paket independen saat integrasi eksternal terblokir. Pengecualian harus tercatat; gerbang rilis tidak boleh dilonggarkan.
- **Pengecualian tercatat (keputusan pemilik, 27 Oktober 2026):** paket F4-02 (keamanan penulisan publik) dikerjakan pada sesi ini meski item F0-04/F0-05 yang butuh kredensial pemilik (R2, Sentry, branch Neon uji) masih `TERBLOKIR`. F4-02 tidak bergantung pada kredensial tersebut; gerbang F0 tidak dilonggarkan dan item terblokir tetap menunggu pemilik.

## 2. Baseline audit dan keterbatasan bukti

### 2.1 Implementasi yang sudah ditemukan

| Area | Baseline | Lokasi bukti |
|---|---|---|
| Stack | Next.js 16.3.3, Payload dan paket `@payloadcms/*` yang terdaftar pada 3.92.0, React 19.2.6. | `package.json` |
| Skema Rilis 1 | 20 koleksi aplikasi dan global `site-settings` terdaftar. Pengecekan konfigurasi tersanitasi juga menghitung koleksi internal Payload/plugin. | `src/payload.config.ts` |
| Migrasi | Tiga migrasi tersedia; migrasi Fase 1 memuat `consultation_bookings_no_overlap`. Keberadaan SQL bukan bukti sudah diterapkan. | `src/migrations/` |
| Data awal | Seeder kategori, layanan, proyek draft, teknologi, FAQ, paket, item kalkulator, jadwal, dan sebagian Settings tersedia. | `scripts/seed.mjs` |
| Admin | CRUD, grup menu, role, konfigurasi 2FA, draft, trash, dan pengurutan tersedia sebagian. | `src/collections/`, `src/globals/`, `src/payload.config.ts` |
| Frontend | Halaman publik sudah ada, tetapi sumber utamanya masih data presentasi statis. | `src/lib/public-content.ts`, `src/app/(frontend)/` |
| Fitur bisnis | Kalkulator, pemesanan, dan konsultasi masih menampilkan pratinjau atau kontrol nonaktif. | Halaman `kalkulator`, `pesan`, dan `konsultasi` |
| Otomasi | Konfigurasi CI dan backup tersedia. Tidak ada bukti run layanan jarak jauh yang diverifikasi dalam audit ini. | `.github/workflows/ci.yml`, `.github/workflows/backup.yml` |
| E2E sebelumnya | Artefak terakhir berstatus gagal; detail mencatat Chromium tidak tersedia dan pada admin juga kegagalan koneksi PostgreSQL. | `test-results/.last-run.json`, berkas `error-context.md` di `test-results/` |

### 2.2 Pemeriksaan lokal yang sudah lulus pada audit awal

- `pnpm lint`.
- `pnpm exec tsc --noEmit --incremental false`.
- `pnpm check:portability`.
- `pnpm check:access`.
- `pnpm exec vitest run --config ./vitest.config.mts --exclude tests/int/api.int.spec.ts --no-cache`: 26 tes lulus pada 6 berkas.

**Jangan menulis bahwa seluruh `pnpm test` atau E2E sudah lulus.** Tes database dikecualikan pada audit tersebut. Build produksi, migrasi, seeder, restore, dan integrasi cloud juga tidak dijalankan dalam audit itu.

### 2.3 Batas audit

- Pemeriksaan berupa inspeksi sumber, PRD, artefak lama, dan pemeriksaan lokal tertentu. Bukan pentest lengkap, audit hukum, atau pengesahan produksi.
- Graph codebase memiliki direktori yang tidak diindeks, termasuk migrasi, scripts, komponen publik, dan sebagian tes. Temuan material harus dikonfirmasi dari sumber langsung.
- Tidak adanya bukti deploy atau konfigurasi cloud dalam audit **tidak berarti** layanan tersebut pasti belum dibuat.
- Pada lingkungan audit, folder kerja dilaporkan bukan repositori Git. Verifikasi ulang sebelum memakai `git diff`, membuat branch, atau mengandalkan GitHub Actions. Jangan menginisialisasi repo, menentukan remote, atau melakukan push tanpa persetujuan pemilik.

## 3. Keputusan dan perbedaan yang harus diselesaikan

| ID | Masalah | Tindakan agent | Batas penyelesaian |
|---|---|---|---|
| D-01 | Seeder item Sistem Informasi Database memakai `priceMax` 3.500.000, sedangkan PRD 8.4 menetapkan 4.000.000 dan vektor G.1 memakai angka tersebut. | Usulkan menyelaraskan data awal ke PRD. Minta persetujuan sebelum mengubah angka. Jangan menimpa harga yang sudah disunting pemilik di database. | Sebelum F1-03 dinyatakan selesai dan sebelum fixture kalkulator dipakai sebagai bukti paritas. |
| D-02 | AC 9.2 dan gerbang Fase 4 meminta G.1-G.6, tetapi G.4, sebagian G.5, dan G.6 adalah portal Rilis 2. | Minta keputusan tertulis tentang cakupan fixture Rilis 1 dan penyesuaian redaksi PRD. Jangan membangun tracking untuk mengejar checkbox, dan jangan menganggap fixture tersebut boleh dilewati tanpa keputusan. | Sebelum gerbang Fase 4. |
| D-03 | PRD 3.1 menyebut editor tidak boleh mengubah tab WhatsApp/Tracking; PRD 5.4 dan 9.4 juga melarang membukanya. Kode saat audit baru membatasi update. | Terapkan target akses paling jelas pada 9.4: read dan write tab tersebut tertutup untuk editor. Jika perilaku bisnis yang diminta pemilik berbeda, revisi PRD dahulu. | Sebelum gerbang Fase 2. |
| D-04 | Penempatan Site Settings di grup Sistem pada kode berpotensi bertentangan dengan akses editor dan pemetaan menu pada PRD 5.2. | Usulkan penempatan/visibilitas yang membuat Settings umum dapat dikelola editor tanpa membuka modul Sistem. Verifikasi melalui UI dan REST, bukan label menu saja. | Sebelum F2-01 selesai. |
| D-05 | `forceSetup: true` dikonfigurasi pada plugin TOTP, sedangkan kewajiban produk disebut khusus owner. | Buktikan perilaku plugin untuk owner dan editor pada versi terkunci. Jika tidak dapat memenuhi PRD, hentikan dan ajukan fallback sesuai 12.3; jangan menonaktifkan 2FA. | Fase 0 dan verifikasi ulang Fase 2. |
| D-06 | Verifikasi URL unduh bertanda tangan disebut di 12.3, tetapi koleksi dan storage privat adalah Rilis 2. | Verifikasi kemampuan adaptor secara terisolasi pada objek uji hanya bila akses disetujui. Jangan membuat koleksi/portal privat. Jika butuh infrastruktur tambahan, minta keputusan tentang pembatasan verifikasi Fase 0. | Sebelum penutupan 12.3. |
| D-07 | Hosting produksi, domain, konten `[ISI]`, dan teks privasi memerlukan keputusan pemilik. | Kumpulkan kebutuhan dan bukti teknis; jangan membeli, menetapkan isi, atau mempublikasikan atas asumsi. | Sebelum Fase 5 dan Rilis 1. |
| D-08 | Retensi data belum disepakati final walaupun Lampiran I memiliki usulan bawaan. | Jangan mengaktifkan penghapusan, anonimisasi, atau jadwal retensi. Minta keputusan sebelum operasi yang menghapus data. | Sebelum data klien nyata dikelola dalam jumlah besar. |

Dokumen ini tidak mencatat keputusan-keputusan tersebut sebagai sudah disetujui. Agent harus mengisi hasilnya dari jawaban pemilik saat eksekusi.

## 4. Urutan prioritas dan dependensi

```text
Fase 0: lingkungan aman, schema push mati, pengujian dan integrasi fondasi terbukti
  -> Fase 1: skema, akses, migrasi, seeder, kendala booking terbukti
  -> Fase 2: admin operasional, editor, 2FA, dashboard, WhatsApp, preview
  -> Fase 3: frontend membaca CMS, page builder, cache, SEO, media, legal/error
  -> Fase 4: kalkulator, inquiry, booking, anti-spam, pengujian balapan
  -> Fase 5: konten final, QA produksi, domain, restore, persetujuan Rilis 1
```

### 4.1 Ringkasan paket kerja

| Paket | Prioritas | Tujuan | Dependensi |
|---|---|---|---|
| F0-01 | P0 | Konfirmasi workspace dan isolasi lingkungan. | Persetujuan Fase 0. |
| F0-02 | P0 | Menutup schema push dan memverifikasi konfigurasi aman. | F0-01. |
| F0-03 | P1 | Memulihkan baseline test, CI, dan browser E2E. | F0-01, F0-02. |
| F0-04 | P1 | Verifikasi paket terkunci, 2FA, storage, dan cache. | F0-02, F0-03; akses layanan. |
| F0-05 | P1 | Membuktikan preview, Docker, Sentry, backup/restore, ukuran build. | F0-03, F0-04; akses layanan. |
| F1-01 | P1 | Matriks koleksi, field, hook, dan akses lengkap. | Baseline fondasi aman. |
| F1-02 | P0 | Migrasi aman dan kendala database diuji nyata. | F0-02, F1-01. |
| F1-03 | P1 | Seeder lengkap, idempotent, dan tidak menimpa konten pemilik. | F1-02, keputusan D-01. |
| F1-04 | P1 | Uji REST dan batas kerahasiaan sesuai PRD. | F1-01, F1-02. |
| F2-01 | P1 | Owner/editor dapat bekerja sesuai haknya. | F1-04, keputusan D-03 sampai D-05. |
| F2-02 | P1 | Dashboard dan panel Perlu Tindakan Rilis 1. | F2-01. |
| F2-03 | P1 | Aksi admin WhatsApp dan konfirmasi booking. | F2-01, F2-02. |
| F2-04 | P1 | Draft, preview, CRUD lengkap, dan lokalisasi admin. | F2-01; renderer preview minimal. |
| F3-01 | P1 | Pembacaan server dan DTO publik yang aman. | Fase 1, F2-04 untuk kontrak preview. |
| F3-02 | P1 | Beranda berbasis blocks dan Settings. | F3-01. |
| F3-03 | P1 | Portofolio, detail, paket, legal, dan navigasi berbasis CMS. | F3-01, F3-02. |
| F3-04 | P1 | Cache, publikasi berbasis waktu, dan preview tidak bocor. | F3-01 sampai F3-03. |
| F3-05 | P2 | SEO, error states, keamanan rendering, dan performa awal. | F3-02 sampai F3-04. |
| F4-01 | P1 | Fixture dan mesin murni kalkulator, booking, WA, format. | Fase 1, keputusan D-01 dan D-02. |
| F4-02 | P0 | Kontrak keamanan Server Action dan rate limit atomik. | F0-04, F1-04; kebijakan limit disetujui. |
| F4-03 | P1 | Kalkulator dan penyimpanan quote resmi. | F3-01, F4-01, F4-02. |
| F4-04 | P1 | Pemesanan paket dan inquiry nyata. | F3-03, F4-01, F4-02. |
| F4-05 | P1 | Booking nyata dan penanganan bentrok. | F1-02, F4-01, F4-02. |
| F4-06 | P1 | Paritas, keamanan input, dan E2E balapan. | F4-03 sampai F4-05. |
| F5-01 | P1 | Hosting, domain, environment, dan pipeline produksi. | Keputusan pemilik; Fase 0 sampai 4. |
| F5-02 | P1 | Konten final, gambar, legal, dan izin publikasi. | Pemilik; integrasi Fase 3. |
| F5-03 | P1 | QA keamanan dan akses produksi. | F5-01, F5-02. |
| F5-04 | P2 | QA responsif, aksesibilitas, performa, dan beban ringan. | F5-01 sampai F5-03. |
| F5-05 | P1 | Restore, rollback aplikasi, monitoring, dan runbook. | F5-01; backup yang dapat dibaca. |
| F5-06 | P1 | Persetujuan dan pengumuman Rilis 1. | Seluruh gerbang sebelumnya. |

## 5. Fase 0: fondasi aman dan verifikasi nyata

**Rujukan:** PRD 2.1-2.4, 6.2, 6.7, 7.1-7.7, 10.1, 12.3, Lampiran H.

### F0-01: konfirmasi workspace dan isolasi lingkungan

- [ ] Verifikasi lokasi proyek, instruksi agent terdekat, perubahan yang sudah ada, status Git, versi Node/pnpm, dan lockfile. Jangan menghapus pekerjaan pemilik.
- [ ] Pastikan fase aktif disetujui. Konfirmasi target lokal, database uji disposable, branch Neon pengembangan, akun/project hosting, dan bucket R2 uji. Jangan menebak ID atau membuat resource berbayar.
- [ ] Siapkan database uji khusus; tes integrasi, seeder, E2E admin, dan uji balapan tidak boleh memakai produksi atau database pengembangan yang berisi data pemilik.
- [ ] Tambahkan guard pengujian agar perintah yang menulis database menolak target produksi. Gunakan identitas database/lingkungan yang eksplisit, bukan hanya asumsi nama file `.env`.
- [ ] Inventarisasi kebutuhan environment dengan status ada/tidak ada tanpa mencetak nilainya. Variabel baru harus divalidasi di `src/lib/env.ts` dan dicatat di `.env.example`.
- [ ] Baca dokumentasi Next.js lokal `node_modules/next/dist/docs/` yang relevan sebelum perubahan API Next.js. Periksa tipe/dokumentasi Payload versi terkunci sebelum memakai opsi baru.

**Selesai bila:** ada pemetaan lingkungan yang aman, target tes terbukti bukan produksi, versi cocok, dan operasi mutasi tidak dapat berjalan ke target yang salah secara tidak sengaja.

### F0-02: hentikan schema push dan rapikan konfigurasi keamanan fondasi

**Berkas utama:** `src/payload.config.ts`, `src/lib/env.ts`, `.env.example`, `tests/int/`, `scripts/` bila perlu guard.

- [ ] Tambahkan regresi konfigurasi untuk `push: false`, pemilihan koneksi direct saat migrasi, dan koneksi runtime yang terpisah.
- [ ] Matikan schema push secara eksplisit pada adaptor PostgreSQL. Verifikasi opsi dari paket 3.92.0 terpasang.
- [ ] Buktikan menjalankan aplikasi development tidak mengubah skema atau membuang kendala SQL kustom. Jalankan verifikasi pada database uji.
- [ ] Periksa `csrf`, `cors`, cookie, batas percobaan login, dan perilaku recovery tanpa email. Batasi origin berdasarkan environment, bukan wildcard.
- [ ] Pertahankan GraphQL nonaktif dan akses operasional tertutup. Jangan membuka REST tulis anonim untuk mempermudah form.
- [ ] Validasi konfigurasi storage produksi agar tidak diam-diam memakai filesystem sementara ketika R2 tidak siap.

**Selesai bila:** jalur perubahan skema hanya melalui migrasi, pengujian regresi lulus, dan startup development tidak memodifikasi objek SQL di luar migrasi.

### F0-03: pulihkan baseline pengujian dan CI

**Berkas utama:** `.github/workflows/ci.yml`, `playwright.config.ts`, `vitest.config.mts`, `tests/helpers/`, `tests/e2e/`, `tests/int/`.

- [ ] Jalankan ulang lint, typecheck, portabilitas, dan pengecekan akses; jangan menggunakan hasil audit lama sebagai hasil sesi baru.
- [ ] Pasang browser Chromium Playwright sesuai versi terkunci. Di Linux CI sertakan dependency sistem yang dibutuhkan. Instalasi ini harus dilakukan sebelum menyimpulkan tes UI gagal karena kode.
- [ ] Perbaiki helper test agar owner/editor dibuat pada database uji khusus dan dibersihkan berdasarkan identitas fixture yang terisolasi. Jangan menghapus akun pemilik atau memakai kata sandi contoh di lingkungan nyata.
- [ ] Perbarui login E2E agar mengikuti setup/verifikasi TOTP nyata dengan secret fixture khusus tes. Jangan menonaktifkan TOTP di produksi agar tes lulus.
- [ ] Periksa selector tes admin yang masih mengharapkan label Inggris dan asumsi URL create/edit. Selaraskan dengan perilaku versi terkunci dan bahasa Indonesia tanpa mengurangi cakupan tes.
- [ ] Untuk sementara, tes pratinjau Fase 4 tetap menguji keadaan nonaktif. Penggantiannya dilakukan saat fitur tersebut benar-benar diaktifkan di Fase 4.
- [ ] CI harus memeriksa lint, typecheck, generate types tanpa diff, akses, portabilitas, migrasi database kosong, build, tes unit/integrasi, E2E inti, dan audit dependency. Tambahkan langkah yang belum ada, bukan menganggap konfigurasi sekarang sudah mencakup semuanya.
- [ ] Pastikan GitHub repo/remote dan akses Actions benar-benar tersedia. Bila belum, minta pemilik menyetujui penyiapannya; hasil lokal bukan pengganti CI hijau.

**Selesai bila:** seluruh suite baseline yang berlaku dapat berjalan pada database disposable; CI mempunyai run hijau dengan identitas run/commit dan artefak yang disanitasi.

### F0-04: tutup daftar verifikasi PRD 12.3

- [ ] TOTP: owner baru wajib setup, owner terdaftar wajib kode, refresh/logout tidak melewati 2FA, percobaan berlebih terkunci, dan reset oleh owner memiliki alur yang dapat dipulihkan tanpa email.
- [ ] Editor: uji efek `forceSetup`, akses login, dan wrapper plugin tanpa menyamakan editor dengan owner. Catat keputusan D-05 bila plugin memaksakan perilaku berbeda.
- [ ] Uji `orderable`, trash/restore, Duplicate, field join, dan publish/unpublish massal di versi terkunci. Fallback hanya diterapkan setelah disetujui dan tercatat di PRD.
- [ ] Uji cakupan terjemahan Indonesia dan daftar label yang perlu ditimpa. Jangan mengubah bahasa publik menjadi Inggris.
- [ ] R2 nyata: upload langsung dari browser admin, batas tipe/ukuran, URL publik, ukuran turunan WebP, dan persistensi setelah redeploy. Pastikan upload bukan sekadar tersimpan lokal.
- [ ] Verifikasi kemampuan signed download terisolasi sesuai keputusan D-06. Jangan membangun koleksi berkas privat Rilis 2.
- [ ] Cache: buktikan signature API dan invalidasi tag pada Next.js terkunci serta runtime hosting pengembangan. Bedakan perilaku development dari build produksi.
- [ ] Neon: jalankan migrasi yang relevan dan G.7 pada branch/database uji yang disetujui, bukan branch produksi.
- [ ] Periksa batas optimasi gambar dan tentukan penggunaan ukuran turunan/loader berdasarkan bukti, tanpa menurunkan mutu gambar untuk menyembunyikan masalah.
- [ ] Identifikasi bagian contoh template yang masih dipakai sebelum mengusulkan penghapusan. Jangan menghapus direktori `prototype/`.

**Selesai bila:** setiap item 12.3 mempunyai hasil lulus atau keputusan fallback eksplisit beserta versi paket, lingkungan, langkah reproduksi, dan keterbatasan.

### F0-05: buktikan kesiapan operasional fondasi

- [ ] Jalankan aplikasi lokal dan preview pengembangan yang menunjuk Neon `dev`; staging/preview harus noindex.
- [ ] Uji `/health` sesuai PRD 4.1 dan 6.7: memeriksa koneksi database, respons tidak di-cache, tidak membocorkan konfigurasi, dan mengembalikan status tidak sehat ketika database gagal.
- [ ] Verifikasi Sentry menerima galat uji server/klien tanpa data pribadi atau rahasia. Hapus pemicu galat uji publik setelah verifikasi.
- [ ] Periksa Docker build context dan ignore rules agar `.env`, backup, kredensial, dan artefak lokal tidak ikut terkirim ke image. Jangan memakai rahasia permanen sebagai build argument yang tertinggal di layer.
- [ ] Jalankan build dan container dari Dockerfile pada environment uji; beranda dan `/admin` harus dapat diakses dengan konfigurasi runtime yang benar.
- [ ] Catat ukuran hasil build/fungsi, peak memory, memory idle, startup, dan cold start. Bedakan ukuran build, penggunaan runtime, dan batas layanan. Jangan mengubah batas memori build menjadi klaim kebutuhan runtime.
- [ ] Jalankan backup manual melalui workflow dengan versi mayor `pg_dump` cocok PostgreSQL, enkripsi aktif, bucket cadangan terpisah, dan verifikasi file hasilnya.
- [ ] Pulihkan backup terenkripsi ke database kosong terisolasi. Periksa tabel, sampel data uji, migrasi, indeks, dan kendala eksklusi booking. Ukur waktu dan catat hasil.
- [ ] Dokumentasikan konfigurasi lifecycle backup dan perlindungan objek media sesuai kemampuan R2 yang benar-benar tersedia; jangan mengklaim fitur vendor tanpa verifikasi.
- [ ] Perbarui catatan verifikasi PRD ke 1.4.1 hanya setelah gerbang Fase 0 terpenuhi, bukan karena file konfigurasi sudah ada. Perbarui status README berdasarkan bukti.

**Gerbang Fase 0:** seluruh butir PRD 10.1 untuk Fase 0 lulus atau perubahan kriteria disetujui pemilik dalam PRD. Kekurangan akses cloud menghasilkan status `TERBLOKIR`, bukan `SELESAI_TERVERIFIKASI`.

## 6. Fase 1: integritas koleksi, migrasi, akses, dan data awal

**Rujukan:** PRD 2.2-2.4, 3.1-3.5, 3.8 untuk komponen Rilis 1, 5.4, 8, 9.1, 9.4, G.5 bagian referensi, G.7.

### F1-01: matriks kelengkapan skema dan hook

- [ ] Inventarisasi 20 koleksi aplikasi: `users`, `media`, `pages`, `services`, `testimonials`, `faqs`, `categories`, `technologies`, `projects`, `service-packages`, `service-addons`, `inquiries`, `calculator-groups`, `calculator-items`, `quote-requests`, `availability-rules`, `blocked-dates`, `consultation-bookings`, `audit-logs`, dan `rate-limits`; sertakan global `site-settings`.
- [ ] Cocokkan field, required, default, enum, relasi, indeks, orderable, draft, trash, label, dan akses dengan bagian 3. Jangan menganggap koleksi lengkap hanya karena slug sudah terdaftar.
- [ ] Uji draft proyek tanpa gambar dapat disimpan; publish tanpa gambar ditolak; `publishedAt` masa depan tidak tampil. Hindari constraint database yang membuat draft legal gagal disimpan.
- [ ] Uji integer Rupiah, batas jumlah unit, konsistensi rentang min/max, hari, jam WIB, tanggal blokir, dan slot awal/akhir.
- [ ] Uji kategori terpakai tidak dapat dihapus; aturan kalkulator menolak diri sendiri, siklus requires, dan konflik dengan excludes.
- [ ] Uji reference INQ/QTE/BKG dibuat server, memakai YYMM WIB dan CSPRNG, menangani bentrok maksimal sesuai G.5, serta tidak dapat dimanipulasi lewat form publik.
- [ ] Periksa audit create/update/delete yang diwajibkan PRD, actor, transaksi, dan redaksi log. Jangan memasukkan payload pelanggan, password, secret TOTP, IP mentah, atau token ke audit/log.
- [ ] Periksa hook revalidasi untuk create/update/delete, status publikasi, dan perubahan relasi; impor atau seeding terkontrol tidak boleh mengakibatkan error karena tidak ada konteks request Next.js.

**Selesai bila:** matriks PRD-ke-field-ke-uji tidak memiliki kekurangan Rilis 1 yang belum ditangani; setiap kekurangan menjadi tiket eksplisit dengan keputusan, bukan diabaikan.

### F1-02: migrasi aman dan eksklusi booking

- [ ] Jalankan rangkaian migrasi dari database benar-benar kosong pada Postgres uji dan Neon uji yang disetujui; periksa urutan dan hasil schema.
- [ ] Verifikasi histori migrasi yang sudah diterapkan. Jangan menyunting ulang migrasi yang telah dipakai di lingkungan bersama; gunakan migrasi tambahan bila koreksi dibutuhkan.
- [ ] Tinjau SQL maju untuk operasi destruktif, penambahan NOT NULL langsung, default, backfill, dan kompatibilitas kode lama selama deployment.
- [ ] Pertahankan nama dan fungsi `consultation_bookings_no_overlap`; jangan menggantinya dengan pengecekan aplikasi saja atau indeks unik awal slot tanpa keputusan fallback PRD.
- [ ] Jalankan tujuh skenario G.7: slot baru, duplikat, tumpang tindih, bersebelahan, cancelled, pesan ulang setelah batal, dan 12 koneksi serentak dengan tepat satu baris berhasil.
- [ ] Tambahkan pengujian keberadaan constraint/index setelah migrasi dan setelah startup development dengan schema push mati.
- [ ] Uji rollback aplikasi terhadap skema yang sudah ditambah. Jangan menguji `migrate:down` pada database pemilik; rollback database destruktif bukan strategi default.

**Selesai bila:** migrasi bersih lulus di CI dan Neon uji, G.7 lulus, serta bukti menunjukkan constraint tidak hilang setelah aplikasi dijalankan.

### F1-03: seeder idempotent dan sesuai PRD

**Berkas utama:** `scripts/seed.mjs`, `src/seed/` bila pemindahan struktur disetujui dan memang diperlukan, `tests/fixtures/`, tes integrasi seeder.

- [ ] Selesaikan keputusan D-01. Tambahkan tes kecocokan angka awal terhadap PRD dan fixture; jangan mengubah expected test agar mengikuti angka seeder yang keliru.
- [ ] Lengkapi `pages` untuk home, Tentang bila dipakai, dan legal sesuai struktur blocks yang disepakati. Dokumen dengan `[ISI]` tetap draft.
- [ ] Lengkapi Settings, disclaimer kalkulator, teks persetujuan, template pemesanan paket, dan konten Lampiran E/F yang memang berlaku. Jangan mengisi kekosongan dengan klaim atau data pribadi rekaan.
- [ ] Pastikan enam proyek tanpa gambar tetap draft; kategori HIPPAM mencakup Instansi/Pemdes dan Aplikasi Mobile; tidak ada testimoni fiktif yang dibuat.
- [ ] Jalankan seed dua kali di database uji. Bandingkan jumlah dokumen konten, relasi, aturan kalkulator, dan jadwal. Bedakan pertambahan audit log yang memang mencatat eksekusi dari duplikasi konten.
- [ ] Edit data fixture menyerupai suntingan pemilik, jalankan seed lagi, dan buktikan perubahan tersebut tetap ada. Jangan mengisi ulang field yang sengaja dikosongkan pemilik tanpa kebijakan yang disetujui.
- [ ] Periksa format reference, slug, dan field relasi tidak menghasilkan duplikasi ketika urutan eksekusi berubah atau seed dilanjutkan setelah kegagalan parsial.
- [ ] Seeder tidak membuat akun dengan password tetap, tidak berjalan otomatis saat deploy, dan tidak menyentuh produksi tanpa persetujuan eksplisit.

**Selesai bila:** data awal cukup untuk pengembangan terintegrasi, dua eksekusi tidak menggandakan konten, edit pemilik tidak tertimpa, dan angka sesuai keputusan PRD.

### F1-04: akses diuji melalui batas aplikasi nyata

- [ ] Pertahankan tes fungsi akses yang sudah ada, lalu tambahkan tes REST untuk anonim, editor, owner sebelum 2FA, dan owner setelah 2FA sesuai dukungan plugin.
- [ ] Uji read/create/update/delete untuk seluruh koleksi Rilis 1; audit/rate-limit mengikuti pembatasan khususnya. Tes role terautentikasi yang tidak dikenal juga harus ditolak.
- [ ] Anonim hanya dapat membaca konten published/aktif; tidak dapat membaca operasi klien, audit, rate limit, Settings privat, versi draft, atau mengirim penulisan REST.
- [ ] Uji kebocoran melalui relasi/populate, depth, versi dokumen, respons error, dan endpoint admin kustom, bukan hanya endpoint list.
- [ ] Uji field role tidak dapat dipakai editor untuk menaikkan dirinya menjadi owner. Akses profil sendiri untuk kebutuhan auth tidak boleh membuka daftar atau data akun lain.
- [ ] Uji secret TOTP, hash password, token, dan informasi sensitif lain yang memang ada pada Rilis 1 tidak ikut terkirim. Field portal Rilis 2 yang belum ada ditandai tidak berlaku, bukan dibuat untuk pengujian.
- [ ] Buktikan GraphQL nonaktif dan tidak ada rute alternatif yang melewati pembatasan.

**Gerbang Fase 1:** seluruh koleksi/global Rilis 1 lengkap, matriks akses lulus, migrasi kosong lulus di CI, seeder idempotent, dan G.7 lulus di Neon uji sesuai PRD 10.1.

## 7. Fase 2: panel admin benar-benar operasional

**Rujukan:** PRD 5.1-5.5, 5.7 bagian Rilis 1, 6.2, 6.6, 9.1, 9.4, 10.1.

### F2-01: hak owner/editor dan pengelompokan menu

**Berkas utama:** `src/access/roles.ts`, `src/collections/Users.ts`, `src/globals/SiteSettings.ts`, konfigurasi koleksi/admin dan tesnya.

- [x] Tambahkan tes gagal yang membuktikan editor seharusnya dapat masuk panel konten, tetapi tidak dapat mengelola pengguna atau data operasional.
- [x] Perbaiki `access.admin` tanpa membuka CRUD akun. Login panel dan izin mengelola users adalah dua hak berbeda.
- [x] Uji owner sebelum/sesudah TOTP pada akses sensitif; jangan hanya percaya bahwa semua wrapper plugin selalu aktif.
- [x] Terapkan read/write field untuk WhatsApp/Tracking sesuai D-03, termasuk API langsung. Menyembunyikan tab secara visual saja tidak cukup.
- [x] Selaraskan grup menu Site Settings dan visibilitasnya dengan D-04. Editor tidak boleh menerima statistik operasional melalui dashboard atau komponen server.
- [x] Lengkapi validasi password kuat dan recovery owner via CLI tanpa email sesuai PRD. Secret dan password harus masuk interaktif atau mekanisme aman, bukan argumen yang tersimpan di shell history.
- [x] Verifikasi ulang reset TOTP, sesi, logout, dan lockout. Kebutuhan fallback plugin tetap membutuhkan keputusan pemilik.

**Selesai bila:** owner dan editor dapat menyelesaikan tugasnya melalui browser; editor tetap gagal membaca data terlarang lewat UI maupun REST.

### F2-02: dashboard dan panel Perlu Tindakan

- [x] Implementasikan komponen admin melalui API ekstensi yang diverifikasi pada Payload terkunci; jangan mengasumsikan nama opsi dari versi lain.
- [x] Untuk owner, tampilkan jumlah proyek ditampilkan, booking baru bulan berjalan WIB, inquiry/quote yang belum dihubungi, serta lima booking dan inquiry/quote terbaru sesuai PRD 5.1.
- [x] Panel Perlu Tindakan berasal dari query booking `pending` dan inquiry/quote `new`; jangan menambah tabel notifikasi atau job latar.
- [x] Setiap item menuju dokumen admin yang benar dan menyediakan aksi yang memang sudah tersedia. Jangan menambahkan tombol proyek klien, revisi, pembayaran, atau tracking.
- [x] Query memakai batas, filter, sort, depth, dan select eksplisit. Pastikan batas bulan dihitung WIB tetapi kueri memakai instan UTC.
- [x] Sediakan keadaan kosong, loading bila relevan, error yang aman, dan pembatasan akses server. Editor hanya menerima dashboard konten yang diizinkan.

**Selesai bila:** data uji baru muncul dengan jumlah/status yang benar, perubahan status menghapus item dari antrean tindakan, dan editor tidak menerima data operasional.

### F2-03: WhatsApp admin dan konfirmasi booking

- [x] Tulis fixture G.3 dahulu, lalu lengkapi normalisasi nomor dan builder template bersama di `src/lib/whatsapp/` tanpa impor Payload/Next.js.
- [x] Pertahankan validasi placeholder; encode pesan dengan aman dan bentuk URL hanya ke `https://wa.me/`. Jangan mengubah teks pemilik diam-diam.
- [x] Tambahkan aksi Hubungi untuk inquiry/quote dan konfirmasi booking menggunakan template dari Settings. Nomor dan dokumen diambil ulang server sesuai hak owner, bukan dipercaya dari input tombol.
- [x] Validasi `meetingUrl` HTTPS dan perubahan status sebelum menyusun pesan konfirmasi. Jangan membuat Google Meet otomatis.
- [x] Bedakan menyimpan status `confirmed` dari membuka WhatsApp. Membuka tautan bukan bukti pesan telah terkirim; UI dan audit tidak boleh mengklaim pengiriman otomatis.
- [x] Jika nomor/template belum lengkap, tampilkan masalah yang dapat diperbaiki, bukan URL rusak atau nomor rekaan.
- [x] Tidak ada template tracking yang dirender sebagai tautan aktif selama Rilis 1. Template cadangan yang sudah tersimpan tidak berarti portal boleh ditautkan.

**Selesai bila:** aksi membuka percakapan dan pesan yang sesuai dokumen, status booking tersimpan benar, akses editor/anonim ditolak, dan tidak ada email terkirim.

### F2-04: CRUD lengkap, draft/preview, dan lokalisasi

- [x] Verifikasi semua menu konten Rilis 1: Settings, Pages, Services, Projects, Categories, Technologies, Testimonials, FAQs, Packages, Add-ons, Calculator Groups/Items, dan Media.
- [x] Verifikasi reorder, show/hide blocks, relasi multikategori, join item per grup, validasi aturan, draft, publish, trash/restore, dan aksi massal yang tersedia.
- [x] Implementasikan entry/exit Draft Mode yang memeriksa autentikasi serta hak konten, memvalidasi slug/tujuan redirect, dan tidak bisa diaktifkan anonim melalui URL saja.
- [x] Sediakan renderer preview minimum yang memakai dokumen draft dan tidak di-cache sebagai publik. Fase 3 mengintegrasikan tampilan penuh tanpa melemahkan isolasi preview.
- [x] Pratinjau diberi penanda jelas dan noindex; sesi preview tidak boleh mengubah respons/cache pengunjung lain.
- [x] Uji label Indonesia dan fallback yang disetujui. Perbarui selector E2E berdasarkan UI sebenarnya, bukan mempertahankan asumsi template lama.

**Gerbang Fase 2:** owner mengelola konten Rilis 1 tanpa menyentuh kode, editor terbatas sesuai PRD, dashboard dan panel tindakan menampilkan fixture, draft/preview berjalan, serta bahasa admin sesuai keputusan 6.6.

## 8. Fase 3: frontend yang sepenuhnya dikendalikan CMS

**Rujukan:** PRD 1.2, 2.3-2.4, 4.1-4.3, 4.5 bagian tampilan paket, 6.1, 6.4-6.6, 9.1, Lampiran D/E/F.

### F3-01: pembacaan server, filter, dan DTO

- [ ] Pisahkan aturan bisnis murni dari adapter Payload/Next.js. Pembaca Local API, autentikasi preview, dan komposisi cache harus berada **di luar `src/lib/*`**.
- [ ] Gunakan helper server dekat route yang relevan atau folder server khusus yang kecil bila diperlukan. Jelaskan penambahan struktur; jangan membangun lapisan framework baru.
- [ ] Buat pembacaan Settings publik terpilih, page published, proyek published dan sudah waktunya, kategori aktif/filterable, layanan aktif, FAQ/testimoni aktif, paket/add-on aktif, serta DTO konfigurasi kalkulator.
- [ ] Tetapkan `where`, `depth`, `select`, sort, dan batas query eksplisit. Jika data melebihi satu halaman Payload, gunakan pagination atau limit terukur yang tidak memotong konten diam-diam.
- [ ] Jangan meneruskan dokumen mentah ke Client Component. Buang adminNotes, data kontak pengunjung, konfigurasi auth/tracking, dan field internal.
- [ ] Pembacaan server untuk Settings boleh memakai hak internal hanya setelah output diproyeksikan; jangan membuka global penuh ke REST anonim agar frontend mudah dibangun.
- [ ] Tambahkan tes DTO, filter publikasi, multikategori, urutan, dan ketiadaan field sensitif.

**Selesai bila:** lapisan baca mengembalikan data minimal yang sesuai hak publik dan tidak mengimpor Payload ke modul murni/browser.

### F3-02: beranda page builder dan Settings

- [ ] Ganti ketergantungan data presentasi statis pada beranda dengan `pages` slug `home` dan `site-settings`.
- [ ] Implementasikan pemetaan blok `hero`, `servicesGrid`, `portfolioShowcase`, `calculator`, `pricing`, `testimonials`, `faq`, `about`, `ctaBanner`, dan `richText` sesuai schema yang diverifikasi.
- [ ] Urutan mengikuti array CMS dan `isVisible` dihormati. Blok tidak dikenal dilewati dan dicatat secara aman ke Sentry, bukan menjatuhkan halaman.
- [ ] Hero, CTA, trust metrics, menu, dan footer mengambil data CMS. Jangan mengganti data kosong dengan angka/testimoni rekaan.
- [ ] Hindari duplikasi sumber hero antara block dan Settings; gunakan pemetaan sesuai PRD dan dokumentasikan field otoritatif.
- [ ] Saat fungsi kalkulator/form belum selesai, blok terkait tetap diberi keadaan nonaktif yang jujur. Jangan memasang CTA yang menjanjikan transaksi aktif sebelum Fase 4.
- [ ] Render rich text melalui node React yang diizinkan. Tautan dari CMS harus divalidasi; jangan merender string CMS sebagai HTML mentah.

**Selesai bila:** pemilik dapat menambah, menghapus, menyembunyikan, mengurutkan blok, dan mengubah hero/menu/footer tanpa perubahan kode.

### F3-03: halaman publik, navigasi, dan media

- [ ] Galeri proyek: filter dari kategori CMS, satu proyek boleh muncul di beberapa kategori, urutan mengikuti admin, serta draft/future/trashed tidak tampil.
- [ ] Detail proyek: gallery, blocks, teknologi, tautan, proyek terkait, dan metadata dari CMS. Slug tidak sah atau draft bagi anonim menghasilkan 404.
- [ ] Paket/add-on: jumlah kartu bebas, harga/diskon/durasi/fitur/revisi/populer/CTA mengikuti data aktif. Jangan mengunci tiga kartu atau paket tengah sebagai pilihan utama tanpa data CMS.
- [ ] Halaman `/pesan` membaca paket aktif melalui slug dan menangani paket tidak ada/nonaktif. Form tetap nonaktif sampai F4-04 selesai.
- [ ] Header/footer mengikuti menu aktif CMS dan validasi target. Dilarang menautkan halaman tidak ada atau `/tracking*`. Tentang dirender hanya bila memang diterbitkan dan tersedia dalam struktur yang disepakati.
- [ ] Halaman privasi mengambil konten legal yang disepakati dari Pages/Settings. Tetapkan sumber otoritatif sesuai PRD dan keputusan pemilik; jangan menerbitkan draf atau `[ISI]`.
- [ ] Gambar memakai ukuran turunan media, alt yang benar, `sizes`, dan lazy loading. Host R2 masuk allowlist Next.js terbatas berdasarkan URL environment; jangan izinkan semua remote host.
- [ ] Periksa pemakaian `src/lib/public-content.ts` pada seluruh route/komponen. Hapus ketergantungan runtime pada data duplikat hanya setelah penggantinya teruji; simpan fixture yang masih dibutuhkan tes tanpa menimpanya sebagai konten produksi.

**Selesai bila:** daftar/detail/paket/legal dan navigasi bersumber CMS, perubahan status/harga/urutan berpengaruh, dan tidak ada fallback yang menampilkan kembali konten statis lama.

### F3-04: cache, publikasi berbasis waktu, dan isolasi preview

- [ ] Tetapkan tag per entitas dan relasinya; hook invalidasi harus cocok dengan tag yang benar-benar dipakai pembacaan.
- [ ] Uji create/update/delete/publish/unpublish/reorder dari admin terlihat publik maksimal 60 detik tanpa deploy ulang, memakai build produksi dan runtime hosting target pengembangan.
- [ ] Periksa perubahan kategori, teknologi, media, FAQ, paket, dan Settings yang memengaruhi beberapa halaman sekaligus.
- [ ] Proyek `publishedAt` masa depan harus mulai dapat tampil pada waktunya tanpa scheduler. Pilih TTL/revalidasi berbatas waktu yang kompatibel dengan versi terkunci, bukan cache tanpa kedaluwarsa yang hanya menunggu edit admin.
- [ ] Diskon tidak boleh bertahan setelah `discountEndsAt` hanya karena halaman statis belum diinvalidasi. Uji batas waktunya tanpa membuat cron.
- [ ] Pisahkan cache preview dari publik dan jangan cache request bersesi sebagai data anonim. Uji memakai dua browser/context yang berbeda.
- [ ] Slot booking dan konfigurasi otoritatif saat submit form tidak menggunakan cache tampilan sebagai sumber validasi final.

**Selesai bila:** batas kesegaran PRD terpenuhi dan perubahan berbasis waktu tidak membutuhkan job latar atau akses admin berikutnya.

### F3-05: SEO, error states, dan kualitas awal

- [ ] Metadata judul/deskripsi/canonical/OG mengikuti Settings dan dokumen; fallback OG proyek memakai featuredImage sesuai PRD.
- [ ] Sitemap hanya berisi route yang benar-benar ada dan konten published yang waktunya sudah tiba. Tracking dan dokumen draft tidak masuk.
- [ ] JSON-LD sesuai PRD: ProfessionalService, Person, dan CreativeWork dengan data nyata. Serialisasi aman terhadap penutupan tag script; jangan menyisipkan rich text mentah ke JSON-LD.
- [ ] Terapkan noindex pada admin, tracking, staging/preview, dan halaman yang belum layak indeks. Jangan menganggap `robots.txt` disallow menggantikan metadata/header noindex.
- [ ] Lengkapi 404, error, global-error, keadaan konten kosong, loading yang relevan, serta kegagalan database tanpa membocorkan detail internal.
- [ ] Ikuti token/font/komponen Lampiran D dan aset pemilik yang sudah ada. `prototype/` tetap referensi baca-saja; jangan redesign menyeluruh atau membuat logo/testimoni/aset orang tanpa persetujuan.
- [ ] Uji keyboard, fokus, kontras, alt, dan breakpoint 360/768/1024/1440 piksel. Rekam interaksi nyata, bukan hanya screenshot.
- [ ] Ukur LCP mobile pada data seeder dengan metode 4G yang dicatat; target PRD maksimal 1,8 detik. Admin bundle tidak boleh ikut dimuat pada route publik.

**Gerbang Fase 3:** halaman Rilis 1 sesuai Lampiran D, SEO dasar valid, LCP memenuhi target, dan perubahan CMS tampil maksimal 60 detik. Alur transaksi yang belum aktif tetap dinyatakan belum selesai sampai gerbang Fase 4.

## 9. Fase 4: kalkulator, inquiry, dan booking fungsional

**Rujukan:** PRD 2.4, 3.3-3.5, 4.4-4.6, 5.5, 6.2-6.3, 9.2, G.1-G.3, G.5 bagian reference, G.7; cakupan G.4-G.6 mengikuti keputusan D-02.

### F4-01: fixture dan mesin TypeScript murni

- [ ] Buat fixture C1-C10, S1-S8, seluruh vektor nomor WA G.3, dan referensi Rilis 1 G.5. Expected harus berasal dari PRD/keputusan resmi, bukan dihitung dengan fungsi yang sedang diuji.
- [ ] Tambahkan test gagal terlebih dahulu, kemudian implementasi di `src/lib/calculator/`, `src/lib/booking/`, `src/lib/whatsapp/`, dan `src/lib/format/` sesuai kebutuhan.
- [ ] Kalkulator mengikuti urutan validasi G.1: item tak dikenal/nonaktif, grup single/wajib, unit, requires, excludes. Tambahkan edge case duplikasi item, bilangan nonfinite, dan batas integer agar input tidak memanipulasi total.
- [ ] Hitung harga item per-unit dengan jumlah unit; hari **tidak** dikali unit sesuai G.1. Terapkan fallback max, harga minimum, dan tampilan angka/rentang.
- [ ] Booking memakai waktu `now` yang diinjeksi agar fixture deterministik, batas tanggal WIB inklusif, interval setengah terbuka, jeda, blokir, dan status aktif.
- [ ] Gunakan kembali normalisasi/builder WA dari F2-03. Tambahkan tes encoding Unicode, placeholder tidak dikenal, nomor tidak valid, dan tidak ada tautan tracking pada alur Rilis 1.
- [ ] Format Rupiah integer dan tanggal/jam selalu `Asia/Jakarta`; jangan bergantung timezone perangkat atau proses server.
- [ ] Pastikan tidak ada impor app/Payload/React pada engine murni. Adapter request, environment, database, dan cache tetap di sisi server aplikasi.

**Selesai bila:** fixture relevan dan edge case lulus, engine deterministik, dan implementasi yang sama dapat digunakan browser/server tanpa percabangan rumus.

### F4-02: kontrak keamanan semua penulisan publik

- [x] Definisikan schema zod bersama untuk inquiry, quote, dan booking: tipe, panjang, optional, consent, serta pesan validasi Indonesia. Server selalu memvalidasi ulang.
- [ ] Terapkan urutan PRD: validasi -> Turnstile/honeypot -> rate limit -> pembacaan otoritatif/perhitungan -> Local API tertutup. Jangan melonggarkan REST koleksi.
- [x] Verifikasi token Turnstile di server, penolakan token tidak sah/kedaluwarsa/digunakan ulang sesuai kontrak layanan, dan kesesuaian hostname/action bila digunakan.
- [x] Kunci uji resmi Turnstile hanya untuk lokal/CI; tidak ada bypass permanen berdasarkan parameter browser. Produksi harus gagal aman bila verifikasi tidak tersedia.
- [x] Konfirmasikan limit/jendela form dan login admin yang belum numerik di PRD kepada pemilik, kemudian simpan sebagai konfigurasi tervalidasi. Jangan mengarang kebijakan yang langsung diberlakukan pada pengguna.
- [ ] Rate limit menggunakan PostgreSQL dengan increment/check atomik atau transaksi yang teruji terhadap request serentak; bukan pola read-lalu-write yang mudah dilampaui.
- [ ] Bentuk IP klien dari header proxy yang disetujui untuk hosting target. Jangan mempercayai sembarang `x-forwarded-for` yang dapat dipasok klien.
- [x] Simpan IP hanya sebagai hash bersalt. Jangan mencetak token Turnstile, body formulir, nomor WA pelanggan, atau query berisi data pribadi pada log/Sentry.
- [x] Pemeriksaan Origin/CSRF dan cookie sesuai Next.js/Payload terkunci tetap aktif. Semua endpoint kustom juga memeriksa identitas dan hak secara mandiri.
- [ ] `status`, `reference`, `consentAt`, harga, durasi, dan informasi turunan yang otoritatif ditetapkan server. Respons sukses minimal, respons error tidak membuka data/internal SQL.
- [ ] Sediakan feedback pending/sukses/error, pencegahan submit ganda pada UI, dan perilaku retry terdefinisi. Jangan mengklaim exactly-once bila belum ada mekanisme dan uji yang membuktikannya.

**Selesai bila:** permintaan sah tersimpan, semua jalur penolakan diuji, rate limit tahan race, dan anonim tetap tidak dapat menulis lewat REST.

### F4-03: kalkulator dan quote resmi

- [ ] Ambil grup/item/aturan aktif dan disclaimer Settings melalui DTO Fase 3; render single/multiple/per-unit sesuai konfigurasi.
- [ ] UI otomatis memenuhi requires yang sah, menonaktifkan excludes yang bentrok, membatasi unit, dan menjelaskan konflik. Validasi server tetap menolak manipulasi.
- [ ] Perhitungan pratinjau memakai engine F4-01. Tidak ada rumus kedua di komponen.
- [ ] Saat submit, server memuat konfigurasi terkini langsung dari database, memvalidasi pilihan, menghitung ulang, dan mengabaikan harga/durasi/status yang dikirim browser.
- [ ] Simpan quote beserta snapshot pilihan/label/unit, total resmi, reference, kontak bila ada, consent sesuai kontrak yang disepakati, dan hash IP.
- [ ] Jika kebutuhan penyimpanan consent mengharuskan field skema tambahan, usulkan dan migrasikan secara additive; jangan menyimpan consent hanya di state browser.
- [ ] Setelah commit berhasil, kembalikan reference dan URL WA dari template CMS. Jika popup diblokir, sediakan tautan yang dapat diklik; jangan membuat quote kedua hanya untuk membuka ulang WA.
- [ ] Jangan mengklaim quote otomatis menjadi inquiry atau proyek klien jika relasi/perilaku tersebut belum diminta PRD.

**Selesai bila:** quote resmi tidak dapat dimanipulasi harga browser, perubahan harga CMS dipakai server saat submit, dan WhatsApp memuat rincian dari hasil tersimpan.

### F4-04: pemesanan paket dan inquiry

- [ ] Aktifkan formulir `/pesan?paket={slug}` dengan field sesuai PRD 4.5, consent, Turnstile, honeypot, dan feedback aksesibel.
- [ ] Server mencari ulang paket aktif, slug/ID dan data terkait; menolak paket nonaktif/tidak ada. Jangan mempercayai nama/harga paket dari hidden input.
- [ ] Normalisasikan nomor WA dan simpan inquiry berstatus `new`, source `package`, relasi paket, reference INQ, dan consentAt server.
- [ ] Perilaku add-on harus mengikuti kontrak skema/PRD. Jika pilihan add-on perlu disimpan tetapi belum dimodelkan, minta keputusan dan gunakan migrasi additive; jangan membuang pilihan diam-diam.
- [ ] Halaman sukses menampilkan reference serta tombol WA; data pribadi tidak boleh ditaruh pada URL publik yang mudah tersimpan di log/analytics.
- [ ] Buktikan inquiry muncul pada dashboard Perlu Tindakan dan dapat ditindaklanjuti owner tanpa membuka akses editor.

**Selesai bila:** satu pemesanan valid menghasilkan inquiry yang benar dan dapat dioperasikan admin; input tidak sah atau paket nonaktif tidak menghasilkan dokumen.

### F4-05: booking konsultasi dan anti-bentrok berlapis

- [ ] Bangun kalender pada rentang min/max Settings, jadwal mingguan, blocked-dates, booking pending/confirmed, dan mode yang tersedia. Endpoint ketersediaan hanya mengeluarkan slot, bukan identitas pemesan lain.
- [ ] Ketersediaan selalu cukup mutakhir dan bukan cache jangka panjang; tampilkan loading, kosong, error, WIB, dan kontrol keyboard yang jelas.
- [ ] Browser mengirim pilihan slot, tetapi server membaca ulang jadwal/booking/Settings dan membentuk slotStart/slotEnd UTC yang sah melalui engine bersama.
- [ ] Tolak slot di luar rentang, akhir pekan tanpa aturan, blokir, mode nonaktif, durasi yang dimanipulasi, dan tumpang tindih. Constraint database tetap penjaga terakhir.
- [ ] Buat booking `pending` dengan reference BKG dan consentAt. Semua penulisan terkait yang harus konsisten memakai transaksi yang diverifikasi pada Payload terkunci.
- [ ] Tangkap `23P01`/`23505` pada jalur yang tepat dan tampilkan pesan PRD: “Slot baru saja terisi, pilih jam lain”. Jangan memetakan semua kegagalan database menjadi bentrok slot.
- [ ] Sukses menampilkan reference, waktu WIB, tombol WhatsApp, dan link Tambahkan ke Google Calendar. Link kalender bukan pembuatan Meet dan harus memakai instan yang benar.
- [ ] Buktikan booking muncul pada panel admin, dapat dikonfirmasi, dan pembatalan membebaskan slot tanpa menghapus histori secara sembarang.

**Selesai bila:** alur pengunjung sampai konfirmasi admin bekerja, tidak membocorkan booking orang lain, dan tidak ada dua booking aktif yang bertumpang tindih.

### F4-06: pembuktian integrasi dan balapan

- [ ] Jalankan C1-C10 pada engine browser dan server dan bandingkan output, bukan hanya dua pemanggilan fungsi pada runtime Node yang sama. Tambahkan variasi konfigurasi yang disepakati.
- [ ] Jalankan S1-S8 dengan clock tetap serta E2E timezone perangkat berbeda; hasil pengguna tetap WIB.
- [ ] Kirim harga palsu, status palsu, item nonaktif/tidak dikenal, unit invalid, paket nonaktif, consent kosong, honeypot terisi, Turnstile invalid, dan permintaan lintas-origin. Verifikasi tidak ada data tidak sah tersimpan.
- [ ] Uji rate limit serentak dan waktu pemulihannya tanpa menonaktifkan pengamanan untuk pengujian produksi.
- [ ] Dua browser/context memesan slot sama secara serentak: satu sukses, satu mendapat pesan bentrok, dan tepat satu booking aktif tersimpan.
- [ ] Uji slot tumpang tindih yang awalnya berbeda, slot bersebelahan, batal/pesan ulang, dan perubahan durasi Settings.
- [ ] Pertahankan uji database 12 koneksi G.7 di samping uji dua browser; keduanya menguji lapisan berbeda.
- [ ] Ganti tes yang dahulu mengharapkan tombol preview disabled dengan tes perilaku fungsional yang setara atau lebih kuat. Jangan sekadar menghapus tes preview tanpa pengganti.
- [ ] Ulangi tes akses REST dan cek noindex/404 tracking setelah seluruh route publik baru terpasang.

**Gerbang Fase 4:** seluruh AC 9.2 lulus sesuai keputusan D-02, Turnstile/rate limit aktif, paritas nyata terbukti, dan balapan database serta browser lulus.

## 10. Fase 5: QA produksi dan persetujuan Rilis 1

**Rujukan:** PRD 6, 7, 9.1, 9.2, 9.4 bagian Rilis 1, 10.1, 12.1-12.2, Lampiran I.

### F5-01: keputusan hosting, domain, dan pipeline produksi

- [ ] Sajikan hasil pengukuran Fase 0 dan biaya/batas layanan yang diverifikasi saat keputusan dibuat. Pemilik memilih hosting dan anggaran; jangan menetapkan produksi komersial di Vercel Hobby atau Render free.
- [ ] Pemilik memilih/membeli domain dan menyetujui konfigurasi DNS. Ketersediaan domain di Lampiran I harus diperiksa ulang, bukan dianggap pasti tersedia.
- [ ] Pisahkan branch/database Neon produksi dari staging dan semua tes. Pisahkan environment, key Turnstile, origin, bucket, dan akun akses sesuai kebutuhan.
- [ ] Pasang domain utama dan subdomain aset R2, TLS, hostname Turnstile, URL situs, allowlist gambar, canonical, sitemap, serta template WA. Matikan `r2.dev` produksi setelah custom domain terverifikasi.
- [ ] Migrasi additive memakai koneksi direct sebagai langkah sebelum rilis aktif. Preview tidak pernah memigrasi produksi; seed produksi tidak dijalankan otomatis.
- [ ] Batasi hak kredensial runtime, migrasi, dan backup sesuai layanan; jangan meminta atau menampilkan secret di chat/laporan.
- [ ] Verifikasi build dan konfigurasi runtime di target produksi sebelum promosi. Rollback kode harus kompatibel dengan skema yang telah dimigrasi.

**Selesai bila:** target produksi disetujui, domain/TLS/aset bekerja, environment terpisah, dan jalur migrasi/deploy terbukti tanpa menyentuh database yang salah.

### F5-02: konten final dan izin publikasi

- [ ] Pemilik melengkapi dan menyetujui gambar enam proyek, alt, ringkasan, detail, link, kategori, teknologi, serta izin penyebutan klien.
- [ ] Verifikasi harga, diskon, fitur, durasi, kuota revisi, biaya tambahan, jadwal konsultasi, mode, dan nomor kontak. Agent tidak boleh mengubahnya atas asumsi pasar.
- [ ] Finalisasi Kebijakan Privasi, teks persetujuan, penanggung jawab, kontak, penggunaan data, serta prosedur permintaan penghapusan. Jangan mengklaim kepatuhan hukum tersertifikasi.
- [ ] Periksa seluruh konten published, blocks, Settings, menu, SEO, dan template publik agar tidak memuat `[ISI]`, CTA rusak, klaim tanpa bukti, atau testimoni fiktif.
- [ ] Publish hanya dokumen yang sudah disetujui; jangan bulk publish seluruh hasil seed untuk mempercepat peluncuran.
- [ ] Pastikan tracking mati dan tidak tertaut di navigasi, sitemap, tombol admin Rilis 1, serta pesan WA yang dipakai pengguna.

**Selesai bila:** semua konten produksi disetujui pemilik dan pemeriksaan publik tidak menemukan placeholder terbit atau identitas/angka yang tidak sah.

### F5-03: QA keamanan produksi

- [ ] Ulangi matriks akses anonim/editor/owner dan pembatasan 2FA pada lingkungan target dengan akun uji yang disetujui.
- [ ] Uji XSS pada rich text, text input, link CMS, embed, dan JSON-LD; protokol/host berbahaya ditolak. SVG unggahan pengguna tidak diizinkan.
- [ ] Uji Origin/CSRF/CORS, cookie, auth expiry/logout, brute-force protection, Turnstile, honeypot, rate limit, dan header IP pada proxy produksi.
- [ ] Terapkan dan verifikasi CSP serta header keamanan sesuai route. Jangan memakai nonce per-request yang tanpa sengaja menghapus strategi statis PRD; bila ada tradeoff, ajukan keputusan dengan hasil uji versi terkunci.
- [ ] Pastikan kebijakan admin cukup untuk Payload tetapi tidak melonggarkan seluruh situs. Turnstile, gambar R2, font, dan embed yang disetujui tetap berfungsi.
- [ ] Periksa audit dependency; jangan menaikkan paket terkunci tanpa persetujuan. Masalah keamanan tinggi yang belum teratasi memerlukan keputusan pemilik sebelum rilis, bukan disembunyikan lewat suppression.
- [ ] Periksa log, artefak CI, sourcemap, respons error, dan client bundle untuk rahasia/data pribadi. Berkas `.env` tidak boleh tersaji atau masuk image/repo.
- [ ] Tes produksi yang menulis data atau mengirim beban memerlukan target, batas, dan persetujuan eksplisit. Gunakan label fixture dan bersihkan hanya data uji yang dibuat agent.

**Selesai bila:** tidak ada pelanggaran AC keamanan Rilis 1 yang belum diselesaikan; temuan serta batas pengujian dilaporkan secara jujur.

### F5-04: QA responsif, aksesibilitas, performa, dan beban ringan

- [ ] Periksa beranda, galeri/detail, paket, form inquiry, kalkulator, konsultasi, legal, error, serta panel admin yang dipakai owner/editor.
- [ ] Uji 360/768/1024/1440 piksel, perangkat sentuh dan keyboard: menu, filter, input unit, kalender, modal, form, sukses, kosong, loading, dan error.
- [ ] Verifikasi fokus terlihat, label dan pesan error terhubung, urutan tab, kontras AA, target sentuh, alt gambar, tidak ada overflow horizontal, dan tidak ada kontrol mati.
- [ ] Ukur Lighthouse/PageSpeed mobile 4G pada konten produksi, terutama beranda dan detail proyek. Catat tanggal, URL, alat, profil throttling, kondisi cache, dan hasil; target LCP PRD <= 1,8 detik.
- [ ] Periksa query berulang/N+1, jumlah koneksi pool, cold start, ukuran JS klien, pemisahan bundle admin, ukuran gambar, dan font self-hosted.
- [ ] Jalankan beban ringan pada target yang disetujui dengan batas request, concurrency, durasi, dan stop condition. Pantau error, latency, koneksi, memori, dan biaya; jangan menjalankan stress test tanpa izin.
- [ ] Uji revalidasi maksimal 60 detik dan diskon/publikasi berbasis waktu lagi di hosting produksi terpilih.

**Selesai bila:** seluruh interaksi utama dicoba, target performa terpenuhi, dan tidak ada masalah aksesibilitas/responsif yang memblokir penggunaan.

### F5-05: pemulihan, rollback, monitoring, dan runbook

- [ ] Ulangi backup/restore sebelum launch menggunakan salinan yang disetujui dan database kosong terisolasi. Jangan memulihkan di atas produksi untuk sekadar menguji.
- [ ] Periksa constraint booking, indeks, migrasi, data, referensi media, dan kemampuan admin setelah restore. Database dump bukan backup objek R2; verifikasi perlindungan media secara terpisah.
- [ ] Catat RPO/RTO hasil pengujian terhadap target PRD RPO <= 24 jam dan RTO <= 4 jam. Jangan menulis target tersebut sebagai hasil bila belum diukur.
- [ ] Siapkan runbook migrasi gagal, aplikasi gagal start, database tidak tersedia, R2 upload gagal, Turnstile gagal, dan pemulihan akses owner tanpa email.
- [ ] Siapkan rollback aplikasi ke artefak sebelumnya dan batas kapan restore database memerlukan keputusan pemilik. Hindari rollback skema destruktif otomatis.
- [ ] Aktifkan Sentry server/klien dengan sanitasi, monitor beranda, dan `/health` dengan interval wajar sesuai PRD; verifikasi alert sampai kepada operator yang ditetapkan.
- [ ] Jadwalkan backup melalui GitHub Actions yang sudah diizinkan PRD. Larangan cron/queue aplikasi tetap berlaku; jangan menambah Vercel Cron atau Payload jobs.

**Selesai bila:** operator dapat mengikuti runbook tanpa menebak perintah/target, restore teruji, dan monitoring benar-benar menerima kejadian uji.

### F5-06: persetujuan rilis

- [ ] Lengkapi matriks AC 9.1, 9.2, dan 9.4 bagian Rilis 1 dengan tautan bukti lingkungan produksi.
- [ ] Semua blocker keputusan D-01 sampai D-08 yang relevan telah diselesaikan, atau diberi pembatasan yang disetujui dalam PRD. Tidak ada pengecualian diam-diam.
- [ ] Minta persetujuan eksplisit pemilik untuk go-live. Tidak adanya respons bukan persetujuan.
- [ ] Setelah disetujui, lakukan promosi/deploy, smoke test, lalu ajukan sitemap ke Google Search Console pada properti domain yang benar.
- [ ] Perbarui README/status PRD dan catatan rilis berdasarkan hasil aktual. Pengumuman publik Rilis 1 dilakukan oleh pemilik atau dengan izin khusus.
- [ ] Verifikasi kembali `/tracking` dan turunan tetap 404 setelah deploy serta tidak ada tautan portal klien yang ikut dipublikasikan.

**Gerbang Fase 5:** AC produksi Rilis 1 terpenuhi, domain/hosting aktif, konten final, restore teruji, sitemap diajukan, dan peluncuran disetujui pemilik sesuai PRD 10.1.

## 11. Matriks pengujian minimum dan bukti

| Area | Unit/fixture | Integrasi/REST/database | E2E/lingkungan | Bukti wajib |
|---|---|---|---|---|
| Akses | Fungsi role dan field. | Semua koleksi, relasi, draft, global privat, GraphQL. | Owner/editor/anonim dan TOTP. | Matriks hasil per role/operasi, bukan hanya jumlah tes. |
| Migrasi | Regresi konfigurasi push/direct. | Database kosong, constraint/index, kompatibilitas schema. | Neon uji dan CI. | Run migrasi, identitas target aman, hasil constraint. |
| Seeder | Kontrak angka dan data awal. | Dua kali seed, relasi, suntingan pemilik dipertahankan. | Konten cukup untuk halaman/admin. | Jumlah konten sebelum/sesudah dan diff fixture non-sensitif. |
| CMS/cache | DTO/filter, mapping blocks. | Tag, relasi, publish/unpublish, TTL waktu. | Edit admin terlihat <= 60 detik. | Langkah dan waktu observasi pada build produksi. |
| Preview | Validasi tujuan dan pemilihan draft. | Auth, no-store/cache terpisah. | Dua context preview/publik. | Draft terlihat hanya pada context sah. |
| Kalkulator | C1-C10 dan edge case. | Config baru, tampering, quote tersimpan. | Paritas browser/server dan WA. | Output expected/actual dan reference fixture. |
| Booking | S1-S8 dan interval. | G.7, race 12 koneksi, pembatalan. | Dua browser berebut slot dan timezone berbeda. | Tepat satu booking aktif pada race slot sama. |
| Form/security | Zod, nomor, template, hash policy. | Turnstile, consent, atomic limit, Origin, DB gagal. | Validasi/error/sukses dan retry. | Data tidak sah tidak tersimpan; tidak ada PII di artefak. |
| Media | Validasi tipe/ukuran/alt. | R2 dan ukuran turunan. | Upload admin dan tampil setelah redeploy. | URL uji yang aman, MIME, persistensi. |
| Operasi | Kontrak health dan error aman. | DB unavailable, dump/restore, sanitasi. | Docker, Sentry, monitor, produksi. | Artefak uji, waktu pemulihan, penerimaan alert. |
| Kualitas UI | Mapping state dan format. | Rendering aman/metadata. | Keyboard, breakpoint, tema yang memang dikirim. | Catatan click-through, screenshot relevan, metrik alat. |

Tes yang membutuhkan fitur Rilis 2 harus ditandai tidak berlaku beserta keputusan D-02, bukan diberi hasil lulus palsu. Ini tidak membenarkan melewatkan pengujian Rilis 1 yang sebenarnya berlaku.

## 12. Aturan pelaksanaan dan pemeriksaan setiap sesi

### 12.1 Sebelum menulis kode

- Konfirmasikan fase aktif, ID paket, dependensi, dan batas lingkungan.
- Baca bagian PRD yang dirujuk dan instruksi skill yang berlaku. Untuk UI, gunakan Lampiran D sebagai arah; jangan memulai redesign baru tanpa permintaan.
- Periksa graph proyek dan coverage bila tersedia, lalu baca sumber untuk file/rentang yang tidak tercakup. Graph kosong bukan bukti fitur tidak ada.
- Periksa perubahan pemilik sebelum mengedit. Jangan mereset, menimpa `.env`, membersihkan folder luas, atau menghapus artefak yang belum diketahui asalnya.
- Tulis uji regresi/fixture lebih dahulu untuk logika murni atau bug yang dapat diuji.
- Jika ada keputusan terbuka yang mengubah harga, kebijakan, akses, skema destruktif, atau cakupan rilis, berhenti pada keputusan tersebut dan minta persetujuan.

### 12.2 Sebelum mengakhiri sesi implementasi

Jalankan pada lingkungan yang sudah dipastikan aman:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm check:portability
```

Jika menyentuh koleksi/global/blocks atau kontrak generated types:

```sh
pnpm generate:types
pnpm check:access
```

Jika menyentuh komponen admin/import map, routing, atau rendering aplikasi, jalankan perintah relevan:

```sh
pnpm generate:importmap
pnpm build
pnpm test:e2e
```

- Perintah di atas bukan izin menghubungkan tes ke database produksi. Bila target tidak aman atau akses tidak ada, hentikan dan laporkan perintah sebagai tidak dijalankan.
- `generate:types` menghasilkan perubahan terkelola; periksa diff-nya dan jalankan typecheck kembali. Jangan mengedit `src/payload-types.ts` secara manual.
- `pnpm migrate:create`, `pnpm migrate`, `pnpm seed`, dan skrip owner adalah operasi mutasi. Jalankan hanya untuk paket yang membutuhkannya, setelah review target, persetujuan yang relevan, dan pemeriksaan SQL.
- Bila repo Git belum tersedia, jangan mengklaim generate types tanpa diff lewat Git sudah terbukti. Selesaikan kebutuhan version control dengan pemilik.
- Tes gagal harus dilaporkan apa adanya, termasuk apakah kegagalan berasal dari implementasi, browser tidak terpasang, database tidak terjangkau, atau layanan eksternal belum tersedia.
- Tes yang dilewati karena blocker membuat gerbang terkait tetap belum selesai. Jangan mengganti fixture dengan mock untuk mengklaim integrasi nyata telah lulus.

### 12.3 Kondisi wajib berhenti

1. Target database/akun cloud/domain tidak jelas atau terindikasi produksi tanpa izin operasi tersebut.
2. API versi terkunci tidak mendukung asumsi PRD; fallback belum disetujui.
3. Dibutuhkan perubahan harga, kebijakan privasi/revisi/retensi, klaim, identitas, atau aset pemilik.
4. Diperlukan upgrade paket, penambahan biaya, pembelian domain, atau penggantian hosting.
5. Migrasi berisiko kehilangan data, menghapus constraint booking, atau merusak kompatibilitas rilis lama.
6. Penuntasan paket mengharuskan pembangunan tracking, pembayaran, revisi, berkas privat, atau modul lain Rilis 2.
7. Ditemukan rahasia pada kode/log/artefak. Jangan menyalin nilainya ke laporan; laporkan jenis/lokasi dan minta pemilik melakukan rotasi dengan aman.
8. Kebutuhan cakupan fixture G.4-G.6 belum disepakati ketika agent akan menutup Fase 4.

## 13. Format laporan dan serah-terima agent

Gunakan format berikut dalam laporan akhir tiap sesi. Laporan dapat ditulis pada percakapan; jika disimpan ke berkas, simpan hanya bukti yang telah disanitasi dan di lokasi yang disepakati pemilik.

| Field | Isi yang wajib disampaikan |
|---|---|
| Fase dan paket | Fase tunggal yang dikerjakan dan ID paket. |
| Status | Salah satu status di bagian 1.1. |
| Acuan | Nomor bagian PRD, keputusan pemilik, dan versi paket terkait. |
| Perubahan | Daftar berkas dan alasan perubahan, termasuk migrasi dan generated files. |
| Pengujian | Perintah, waktu eksekusi, exit status, jumlah tes, serta lingkungan. |
| Bukti perilaku | Hasil REST/database/UI yang mendukung kriteria selesai, tidak hanya “tes hijau”. |
| Yang belum diuji | Daftar eksplisit beserta alasan dan dampak pada gerbang fase. |
| Risiko/blocker | Keputusan atau akses yang masih diperlukan; tanpa secret/data pelanggan. |
| Data uji | Data fixture/resource yang dibuat dan apakah sudah dibersihkan dengan aman. |
| Langkah berikutnya | Paket berikut yang direkomendasikan; bukan otomatis mulai mengerjakannya. |

### 13.1 Daftar progres awal

Semua kotak berikut sengaja belum dicentang. Baseline audit tidak berarti paket di dokumen ini sudah memenuhi kriteria eksekusi lengkapnya.

- [x] F0-01: workspace dan isolasi lingkungan.
- [x] F0-02: schema push mati dan konfigurasi aman.
- [x] F0-03: baseline test/CI/E2E pulih.
- [ ] F0-04: daftar PRD 12.3 terverifikasi.
- [ ] F0-05: fondasi operasional teruji.
- [x] Gerbang Fase 0 disetujui berdasarkan bukti.
- [x] F1-01: skema dan hook lengkap.
- [x] F1-02: migrasi dan constraint teruji.
- [x] F1-03: seeder idempotent dan data benar.
- [x] F1-04: akses REST dan kerahasiaan teruji.
- [x] Gerbang Fase 1 disetujui berdasarkan bukti.
- [x] F2-01: owner/editor dan hak admin benar.
- [x] F2-02: dashboard dan Perlu Tindakan bekerja.
- [x] F2-03: aksi WhatsApp dan konfirmasi bekerja.
- [x] F2-04: preview dan CRUD terverifikasi.
- [ ] Gerbang Fase 2 disetujui berdasarkan bukti.
- [x] F3-01: pembacaan server dan DTO aman. — SELESAI_TERVERIFIKASI (lihat 13.2).
- [x] F3-02: beranda page builder terintegrasi. — SELESAI_TERVERIFIKASI: blok CMS dengan urutan dan `isVisible`, hero/menu/footer dari CMS, blok asing dilewati dan dilaporkan ke Sentry.
- [x] F3-03: halaman publik dan media terintegrasi. — SELESAI_TERVERIFIKASI: multi-kategori, detail, paket, legal, navigasi, dan media dengan ukuran turunan; jalur R2 tetap milik F0-04.
- [x] F3-04: cache dan publikasi waktu benar. — SELESAI_TERVERIFIKASI: perubahan tampil 5-6 dtk, publikasi terjadwal muncul 120 dtk tanpa job latar, ISR 60 dtk, preview terisolasi.
- [ ] F3-05: SEO/error/performa awal lulus. — SIAP_DIVERIFIKASI: metadata, JSON-LD, sitemap, robots, noindex, 404/500 selesai; LCP 4G belum diukur dan `Person` JSON-LD menunggu data pemilik.
- [ ] Gerbang Fase 3 disetujui berdasarkan bukti.
- [x] F4-01: mesin murni dan fixture lulus.
- [ ] F4-02: keamanan penulisan publik lulus.
- [ ] F4-03: kalkulator dan quote aktif.
- [ ] F4-04: inquiry paket aktif.
- [ ] F4-05: booking aktif.
- [ ] F4-06: paritas dan E2E balapan lulus.
- [ ] Gerbang Fase 4 disetujui berdasarkan bukti dan keputusan D-02.
- [ ] F5-01: hosting/domain/pipeline produksi siap.
- [ ] F5-02: konten final disetujui.
- [ ] F5-03: QA keamanan produksi lulus.
- [ ] F5-04: QA aksesibilitas/performa lulus.
- [ ] F5-05: restore/rollback/monitoring teruji.
- [ ] F5-06: persetujuan dan peluncuran Rilis 1.

### 13.2 Catatan verifikasi Fase 3 (sesi 27 Oktober 2026)

Lingkungan: Windows, Node 22, Next.js 16.4.3, Payload 3.92.0, database Neon cabang pengembangan (bukan produksi), data awal `pnpm seed`. Struktur baru: `src/lib/content/` (DTO, tautan, harga, blok — TypeScript murni), `src/server/content/` (query Local API, cache, mapper DTO, pelaporan blok asing), `src/components/blocks/` (satu komponen per blok), `src/components/pages/` (tampilan bersama rute publik dan pratinjau).

| Perintah | Hasil |
|---|---|
| `pnpm lint` | lulus |
| `pnpm typecheck` | lulus |
| `pnpm test` | 199 lulus, 9 dilewati (suite database menolak target non-disposable) |
| `pnpm build` | lulus; `/`, `/proyek`, `/paket`, `/kalkulator`, `/kebijakan-privasi`, `/konsultasi`, `/sitemap.xml` statis `Revalidate 1m`; `/proyek/[slug]` SSG dengan `revalidate = 60` eksplisit; `/pesan` dan `/preview/[collection]/[slug]` dinamis |
| `pnpm check:access` | lulus (25 koleksi, 1 global) |
| `pnpm check:portability` | lulus |
| `pnpm generate:types` | tanpa diff (tidak ada drift skema) |

Bukti perilaku (runtime produksi lokal `next start`, data seed + fixture sementara yang sudah dibersihkan):

- `/` memuat hero, trust metrics, layanan, portofolio, kalkulator (nonaktif), paket, FAQ, dan CTA dari CMS; JSON-LD `ProfessionalService` dari Settings; 0 tautan `/tracking`; 0 penanda `[ISI]`.
- `/paket` menampilkan 3 paket aktif dengan harga CMS (Rp 1.000.000 / 3.500.000 / 4.500.000), kuota revisi, dan add-on.
- `/pesan?paket=starter-umkm-bisnis` 200 dengan data CMS; `/pesan?paket=tidak-ada` 404.
- `/proyek` kosong secara jujur karena 6 proyek seed masih draft; `/proyek/sipandu` (draft) 404.
- `/kebijakan-privasi` menampilkan pemberitahuan draf (halaman masih `[ISI]`) dengan `noindex`.
- `/sitemap.xml` hanya memuat 5 route inti (tanpa draft, tanpa `/tracking`); `/robots.txt` men-disallow `/admin`, `/api`, `/preview`, `/tracking`.
- Media: unggahan menghasilkan empat ukuran turunan (`thumb`, `card`, `hero`, `og`) dan URL media dipakai kartu proyek.
- Proyek multi-kategori (2 kategori) tampil di `/proyek` setelah **6 detik** dengan kedua chip kategori, dan pada blok portofolio beranda setelah **5 detik**.
- Menyembunyikan blok `faq` dan mengganti headline hero mengubah halaman publik; data dikembalikan setelah uji.
- Proyek dengan `publishedAt` +90 detik: 404 sebelum waktunya, lalu mulai tampil setelah **120 detik** tanpa job latar atau aksi admin.
- Perubahan `site-settings.seo.defaultDescription` tampil di `<meta name="description">` publik setelah **36 detik**.
- `/preview/pages/home` tanpa cookie Draft Mode 404; `/api/draft?collection=pages&slug=home` tanpa sesi 401.

Belum diuji atau masih terbatas:

- Pratinjau dengan sesi admin 2FA nyata dan uji dua context (pratinjau vs publik) belum dijalankan; isolasi dibuktikan pada batasnya (404/401) dan rute publik tidak pernah membaca `draftMode()`.
- Invalidasi tag lewat penyimpanan di panel admin belum diuji; batas 60 detik tetap terjamin oleh `revalidate = 60` pada rute dan `unstable_cache`.
- Media diuji pada penyimpanan lokal karena R2 belum berkonfigurasi. Unggahan R2 dan persistensi setelah redeploy tetap milik F0-04.
- LCP 4G belum diukur: data seed belum punya gambar hero/proyek sehingga pengukuran belum representatif. `Person` JSON-LD menunggu data pemilik.
- `node .next/standalone/server.js` gagal di Windows karena resolusi `sharp` (`@emnapi/runtime`); verifikasi memakai `next start`. Ini isu packaging standalone untuk F0-05/Docker, bukan kode Fase 3.
- Gerbang Fase 2 belum disetujui (belum ada bukti tingkat browser untuk owner/editor, dashboard, aksi WhatsApp). Gerbang Fase 3 belum disetujui karena LCP belum terukur.

### 13.3 Catatan progres F4-02 (27 Oktober 2026)

Keputusan pemilik yang dicatat di PRD 6.2: form publik maksimal 5 kirim per 15 menit per IP; login admin terkunci setelah 5 upaya gagal selama 15 menit. Pengecualian pengerjaan lintas fase saat F0-04/F0-05 terblokir kredensial dicatat di 1.2.

Fondasi yang tersedia: schema Zod tertutup untuk inquiry/quote/booking; guard bersama menolak Origin asing, memvalidasi schema, memeriksa honeypot dan Siteverify Turnstile, baru menjalankan limit; adapter server mengambil header proxy yang dikonfigurasi dan mewajibkan jumlah hop untuk `x-forwarded-for`; IP dan key bucket memakai HMAC salt; PostgreSQL memakai satu `INSERT ... ON CONFLICT ... RETURNING` atomik. Tidak ada aksi publik yang menulis ke Local API yang ditambahkan pada paket ini; F4-03/F4-04/F4-05 harus memakai `guardPublicRequest()` dan hanya menulis setelah lolos.

| Perintah | Hasil sesi |
|---|---|
| `pnpm lint` | lulus |
| `pnpm typecheck` | lulus |
| `pnpm test` | 226 lulus, 11 dilewati. Rate-limit database dan 7 skenario live G.7 dilewati karena `.env` menunjuk database pengembangan non-disposable. |
| `pnpm check:access` | lulus (25 koleksi, 1 global) |
| `pnpm check:portability` | lulus |
| Tes unit keamanan baru | 26 lulus; termasuk schema, urutan guard, Origin, token Turnstile, parsing IP/hop, dan hash bersalt. |

CI `40545754609` membuktikan semua 237 tes lulus, termasuk tujuh skenario live G.7 dan dua tes PostgreSQL rate limit; lint, typecheck, pemeriksaan akses/portabilitas, pembuatan types, migrasi, dan build juga lulus. E2E belum terverifikasi: Playwright memanggil `next dev` lalu timeout 60 detik menunggu server. Konfigurasi kini memakai hasil build (`pnpm start`) di CI, menonaktifkan pemakaian server yang sudah berjalan, dan memberi startup 120 detik; perlu run CI berikutnya untuk memverifikasi E2E anonim REST. Percobaan lokal `pnpm test:e2e -- --list` ternyata menjalankan suite: akses REST anonim lulus, operasi setup database ditolak guard karena `.env` menunjuk database pengembangan non-disposable, dan dua tes UI yang memerlukan data gagal menunggu fixture. Hasil ini bukan kelulusan E2E penuh; jangan jalankan ulang lokal terhadap database tersebut.

Live Siteverify Turnstile belum dipanggil; pengujian lokal memakai fetch injeksi. Nilai produksi `TURNSTILE_SECRET_KEY`, `IP_HASH_SALT`, `TRUSTED_IP_HEADER`, dan `TRUSTED_IP_PROXY_HOPS` harus dikonfigurasi pemilik sesuai hosting, tidak dikarang di sesi ini. Aksi tulis nyata serta feedback/pencegahan submit ganda masih bagian integrasi paket F4-03/F4-04/F4-05.

## 14. Instruksi siap salin untuk sesi agent pertama

> Kerjakan hanya Fase 0 pada proyek OpenByte Labs. Baca `AGENTS.md`, `PRD_v1_4.md`, dan `RENCANA_KELANJUTAN_RILIS_1.md`. Mulai dengan paket F0-01 dan F0-02: verifikasi workspace/perubahan yang ada, versi terkunci, database uji terisolasi, serta penutupan schema push dengan tes regresi. Jangan menjalankan migrasi, seeder, atau E2E yang menulis data sebelum memastikan target aman. Jangan mengubah harga, mengaktifkan tracking, menaikkan paket, membuat resource berbayar, atau deploy produksi. Jika ditemukan konflik PRD atau operasi lintas fase, laporkan dan minta keputusan sebelum melanjutkan bagian tersebut. Jalankan pemeriksaan yang diwajibkan sejauh lingkungan aman dan tersedia. Akhiri dengan daftar perubahan, bukti pengujian, blocker, dan status gerbang; jangan otomatis masuk Fase 1.

**Sasaran sesi pertama:** menghasilkan fondasi pengujian dan konfigurasi database yang aman untuk kelanjutan pekerjaan, bukan menambah halaman baru.
