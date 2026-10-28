# Product Requirement Document (PRD)
# OpenByte Labs — Website Agensi, Dashboard Admin Custom, & Portal Klien

* **Versi:** 1.5.0 (keputusan arsitektur 28 Oktober 2026: tanpa CMS siap pakai; Next.js full-stack + Drizzle ORM + dashboard admin custom)
* **Status:** Spesifikasi siap menjadi acuan implementasi; **Fase 0 perlu dijalankan ulang untuk stack baru**. Rilis 1 (company site, portofolio, kalkulator, paket, booking) lebih dahulu; Rilis 2 (portal klien) menyusul. Hosting produksi dan domain diputuskan sebelum Rilis 1.
* **Pemilik Produk:** Muhammad Izzat Farahidi (Founder OpenByte Labs; Software Engineer & System Specialist)
* **Bahasa Antarmuka:** Indonesia untuk situs publik, portal klien, dan dashboard admin custom.
* **Target Stack:** TypeScript, Next.js App Router, React, Tailwind CSS, **Drizzle ORM + Drizzle Kit**, PostgreSQL (Neon), **Better Auth** untuk autentikasi admin, Cloudflare R2 (S3-compatible), Zod, React Hook Form, Sharp, Lexical (editor jika diperlukan), Vitest, Playwright, pnpm. Pengembangan di Vercel Hobby; produksi diputuskan sebelum Rilis 1 (7.7).
* **Acuan UI/UX:** Prototype full-page milik pemilik menjadi sumber kebenaran **untuk website publik dan seluruh dashboard admin**. PRD tidak menciptakan design system, warna, tipografi, spacing, atau layout baru.

> **Keputusan arsitektur — 28 Oktober 2026:** Payload CMS dan seluruh paket `@payloadcms/*` serta `payload-totp` **dihapus dari target implementasi**. Istilah “CMS” dalam PRD berarti **fitur pengelolaan konten yang dibangun di dashboard admin custom**, bukan produk CMS terpisah.
>
> **Baseline versi:** Next.js **16.4.3** dan Sharp **0.35.5** dicatat dari audit sebelumnya (27 Oktober 2026); **tidak lagi ditentukan oleh peer dependency Payload**. Versi persis Drizzle ORM/Kit, Better Auth, Lexical, dan dependency lainnya **belum diverifikasi pada stack baru**; pilih versi stabil, audit kompatibilitas dan keamanan di Fase 0, lalu kunci versi persis dalam `package.json`/`pnpm-lock.yaml`. Jangan menganggap verifikasi dan pengujian Payload lama berlaku untuk implementasi baru.
>
> **Perubahan terhadap v1.4.1:** arsitektur, skema database, autentikasi, akses data, modul admin, pipeline dan roadmap diperbarui. Fitur dan aturan bisnis Rilis 1/Rilis 2, angka harga awal, vektor uji algoritma, serta prototype tetap menjadi acuan. **Estimasi durasi lama dibatalkan** sampai pekerjaan custom admin dipetakan terhadap prototype.

---

## 0. Ringkasan

OpenByte Labs dibangun sebagai **satu aplikasi Next.js** untuk situs publik, **dashboard admin custom** pada `/admin`, portal klien (Rilis 2), Server Actions, dan endpoint internal. Data disimpan di **PostgreSQL (Neon)** dan diakses melalui **Drizzle ORM**. Tidak ada CMS atau backend terpisah. PRD adalah acuan produk/teknis; **prototype website publik dan admin** adalah acuan visual dan interaksi.

**Keputusan kunci:**
* **Stack:** TypeScript, Next.js, React, Tailwind CSS, Drizzle ORM/Kit, PostgreSQL (Neon), Better Auth, Cloudflare R2.
* **Dua antarmuka dari satu sistem:** website publik dan dashboard admin custom masing-masing mengikuti prototype, memakai server/service layer dan database yang sama.
* **Rilis bertahap:** website company lebih dulu (Rilis 1); portal proyek klien sesudahnya (Rilis 2).
* **Satu mesin, dua pemakai:** modul kalkulator dan booking TypeScript murni untuk browser dan server.
* **Server sebagai otoritas:** baca/tulis data lewat server; Server Actions atau Route Handlers memeriksa autentikasi, role, validasi Zod, rate limit dan hak akses. **Drizzle tidak otomatis memberi otorisasi**.
* **Tanpa queue atau email:** tidak ada scheduler; pemberitahuan melalui dashboard dan WhatsApp.
* **Hosting-agnostik:** Vercel Hobby untuk pengembangan; hosting komersial dipilih sebelum Rilis 1.
* **Konten dapat dikelola dari dashboard custom** tanpa deploy ulang; draft, versioning, publikasi, media, audit, dan akses peran perlu diimplementasikan, bukan fitur bawaan ORM.
* **Lampiran D–H** berisi konten awal, draf privasi, algoritma dan vektor uji, kit Fase 0, serta gerbang keputusan.

### Cakupan per Rilis
| Rilis | Isi | Entitas/Tabel logis |
|---|---|---|
| **Rilis 1** (Fase 0–5) | Beranda, layanan, portofolio, testimoni, FAQ, kalkulator, paket & inquiry, booking, SEO, **dashboard admin custom**, 2FA, audit, draft/preview, media | `site-settings`, `users`, `media`, `pages`, `services`, `testimonials`, `faqs`, `categories`, `technologies`, `projects`, `service-packages`, `service-addons`, `inquiries`, `calculator-groups`, `calculator-items`, `quote-requests`, `availability-rules`, `blocked-dates`, `consultation-bookings`, `audit-logs`, `rate-limits` ditambah tabel auth, relasi, versi, dan blok yang diperlukan |
| **Rilis 2** (Fase 6) | Portal klien: tracking, pembayaran, progres, timeline, dokumen, revisi, komentar, persetujuan, lampiran privat, konversi proyek jadi portofolio | `step-templates`, `client-projects`, `payments`, `project-updates`, `project-documents`, `revision-requests`, `project-comments`, `project-approvals`, `private-files` ditambah tabel relasi bila diperlukan |

Selama Rilis 1, rute `/tracking*` memberikan 404 dan tidak ditautkan (`tracking.trackingEnabled` mati). Tabel fitur Rilis 2 baru ditambahkan melalui migrasi Fase 6; perubahan terhadap tabel yang sudah berjalan harus aman dan teruji. Definisi entitas logis di Bagian 3 dipertahankan.

---

## 1. Ikhtisar Produk & Brand Positioning

### 1.0 Identitas Brand
Nama brand tunggal untuk seluruh produk, situs, dokumen, dan materi pemasaran adalah **OpenByte Labs** (penulisan resmi: `OpenByte Labs`,
dua kata, "O", "B", dan "L" kapital). Nilai awalnya disimpan pada tabel tunggal `site_settings` (`brandName` pada lapisan aplikasi), dapat diubah dari dashboard admin tanpa deploy.

* **Dipakai untuk:** nama aplikasi, `<title>` dan meta SEO, logo & favicon, header/footer, template WhatsApp, dan halaman legal. Bentuk visual mengikuti prototype dan aset brand dari pemilik.
* **Bentuk pendek:** `OpenByte` hanya untuk ruang sempit (badge, breadcrumb, alt teks logo).
* **Dilarang dipakai sebagai nama brand:** "Web Agensi", "MoveIQ", "Muhammad Izzat Agency", atau varian ejaan lain.
* **Pemilik produk tetap** Muhammad Izzat Farahidi dan boleh disebut sebagai founder/penanggung jawab pada halaman Tentang, bukan sebagai nama brand.

### 1.1 Visi Produk
Platform digital terpadu untuk personal software house / digital agency **OpenByte Labs** milik **Muhammad Izzat**, dengan empat fungsi:

1. **Katalog Portofolio Terkurasi**: sistem skala instansi, kesehatan, utilitas, UMKM, mobile Flutter, dan undangan digital; seluruhnya dikelola dari dashboard admin custom.
2. **Mesin Konversi (Lead Generation)**: kalkulator estimasi, paket harga, pemesanan, booking konsultasi, dan integrasi WhatsApp.
3. **Portal Proyek Klien (Rilis 2)**: klien melacak progres, pembayaran, dan dokumen, serta **berkomentar, mengajukan revisi, dan menyetujui hasil** tanpa membuat akun.
4. **Dashboard Admin Terpusat**: satu panel custom untuk seluruh konten dan operasional sesuai prototype.

### 1.2 Prinsip Produk dan Arsitektur
1. **Tidak ada konten tersembunyi di kode.** Teks, angka, harga, gambar, urutan section, template pesan, dan aturan bisnis (kuota revisi, jam booking) wajib dapat diubah dari admin.
2. **Satu sumber kebenaran per data.** Status progres, pembayaran, dan kuota revisi diturunkan dari satu sumber, bukan disimpan ganda.
3. **Server adalah otoritas.** Hasil kalkulator, validasi booking, dan persetujuan klien dihitung/divalidasi di server. Karena logika kalkulator dan slot adalah **satu modul TypeScript yang sama** untuk browser dan server, pratinjau dan hasil resmi tidak bisa menyimpang.
4. **Sederhana untuk satu operator.** Satu aplikasi Next.js (situs publik, portal klien, dashboard admin custom, dan endpoint), satu database, satu deployment.
5. **Hosting-agnostik.** Tidak ada fitur yang hanya ada di satu platform hosting (7.7), agar pindah dari Vercel Hobby ke hosting produksi tidak mengubah kode aplikasi.
6. **Permukaan API sekecil mungkin.** Tidak membuat REST/GraphQL generik untuk tabel internal; Server Actions dan Route Handlers hanya dibuka jika dibutuhkan. Setiap operasi mewajibkan pemeriksaan izin di server (6.2).

### 1.3 Target Pasar
1. **Instansi Pemerintah Desa / Komunitas Publik** (Satu Data, Posyandu, utilitas air swadaya).
2. **UMKM** (profil digital, katalog, website klinik/jasa dengan reservasi).
3. **Pasangan Pernikahan & Event Organizer** (undangan digital interaktif).
4. **Institusi Pendidikan & Sekolah** (profil, administrasi, ujian, absensi).

### 1.4 Di Luar Cakupan (Fase Berikutnya)
* Pembuatan link Google Meet otomatis via Google Calendar API (OAuth).
* Payment gateway online dan invoice PDF otomatis.
* Akun login klien (tracking tetap berbasis kode + PIN).
* Multi-bahasa, blog/artikel, OTP via WhatsApp/email.
* Notifikasi email (ke admin maupun klien); notifikasi memakai panel admin dan WhatsApp.
* Pekerjaan latar (job queue, penjadwalan tayang otomatis, pembersihan terjadwal). Bila nanti dibutuhkan, itu pemicu untuk memilih hosting dengan proses persisten (7.7).
* API terpisah untuk klien lain (mis. aplikasi Flutter). Bila dibutuhkan, endpoint dapat dibuka dari aplikasi yang sama atau dipisah ke layanan NestJS pada fase berikutnya.

---

## 2. Arsitektur & Spesifikasi Teknologi

```
                       PENGUNJUNG / KLIEN / ADMIN
                                   |
                                 HTTPS
                                   |
+-------------------------------------------------------------------------+
|                    NEXT.JS — SATU DEPLOYMENT                            |
|  Situs publik (prototype)   |  /admin: dashboard custom (prototype)     |
|  Portal tracking (Rilis 2)  |  Server Actions / Route Handlers          |
|  React Server Components    |  Zod, AuthN/AuthZ, rate limit, services   |
+-------------------------------------------------------------------------+
                                   |
                      Drizzle ORM / SQL berparameter
                                   |
                            NEON POSTGRESQL
                                   |
                       (relasi + audit + sesi)

  NEXT.JS SERVER -----------------> CLOUDFLARE R2 (S3)
  Upload langsung signed URL; file publik/privat sesuai otorisasi

  GITHUB ACTIONS: CI, migrasi, backup pg_dump -> R2 (bucket terpisah)
```

### 2.1 Komponen
| Komponen | Pilihan | Catatan |
|---|---|---|
| Bahasa & runtime | TypeScript strict, Node.js | Frontend dan server memakai satu bahasa; versi Node diuji di Fase 0 |
| Framework | Next.js App Router | RSC untuk halaman, Client Components untuk interaksi; Server Actions/Route Handlers untuk mutasi |
| Dashboard admin | **Custom React UI** di `/admin` | Tidak memakai CMS siap pakai; mengikuti prototype admin, tiga kelompok navigasi Konten Website/Operasional Klien/Sistem |
| Frontend & UI | React, Tailwind CSS, Lucide React; komponen aksesibel jika diperlukan | Prototype publik dan admin adalah acuan visual; gaya global masing-masing area diisolasi |
| Form & validasi | React Hook Form + Zod | Skema yang sesuai dipakai di browser & server, seluruh input divalidasi ulang di server |
| Database | PostgreSQL di Neon | Pooled untuk runtime, direct untuk migrasi; region Singapura sesuai rencana awal |
| ORM & migrasi | **Drizzle ORM + Drizzle Kit** | Definisi tabel, relasi, query berparameter, dan migrasi SQL; tidak otomatis menyediakan CMS/auth/RBAC |
| Auth admin | **Better Auth + 2FA TOTP** | Login, sesi, 2FA wajib `owner`/`editor`; skema auth khusus, role dan kebijakan izin tetap dikelola aplikasi; verifikasi alur tanpa email pada Fase 0 |
| Media/storage | Cloudflare R2 via S3-compatible SDK + signed URL | Bucket publik untuk media, bucket privat pada Rilis 2; upload dan unduhan wajib memenuhi kebijakan akses |
| Pengolahan gambar | `sharp` | Versi WebP `thumb`, `card`, `hero`, `og` dibuat dalam alur finalisasi upload di server; hasilnya disimpan R2, diuji batas memori/waktu serverless |
| Rich text | Editor Lexical mandiri (`lexical`, `@lexical/react`) bila dibutuhkan prototype | Simpan JSON terstruktur; editor, serializer, validasi node/URL, dan preview dibuat sendiri; HTML mentah disanitasi |
| Role & izin | Middleware kebijakan di service/server layer | `owner`, `editor`; pemeriksaan per tabel, operasi, dan field sensitif; default deny |
| Audit & versi konten | `audit-logs`, tabel versi konten (custom) | Dalam transaksi tulis; restore draft/versi dan preview dibuat sendiri |
| Anti-spam | Cloudflare Turnstile + honeypot | Diverifikasi setiap form publik di server |
| Rate limit | `rate-limits` di PostgreSQL | Transaksi atomik untuk percobaan login/admin/tracking, form, revisi, komentar; tanpa Redis |
| Sesi tracking (Rilis 2) | Cookie bertanda tangan (`jose`) | Terpisah dari sesi admin, memuat id proyek, `pinVersion`, kedaluwarsa |
| Hash PIN (Rilis 2) | `@node-rs/argon2` atau `bcryptjs` | Pilih setelah uji runtime hosting; PIN tidak pernah disimpan mentah |
| Monitoring | `@sentry/nextjs` + uptime monitor | Kesalahan client/server dan endpoint `/health` |
| Email | Tidak dipakai | Balasan admin lewat dashboard/WhatsApp; reset sandi owner lewat CLI diaudit |
| Integrasi | `wa.me`, Google Calendar link generator | Tidak membuat meeting/Google Meet otomatis |
| Pengujian | Vitest + Playwright | Unit, integrasi database, E2E dua prototype, keamanan & race booking |
| Package manager | pnpm | Versi persis dikunci pada Fase 0 |

### 2.2 Konvensi Skema PostgreSQL dan Drizzle
Definisi Bagian 3 adalah **kontrak logis fitur**, bukan deklarasi otomatis tabel. Skema fisik dan indeks ditulis eksplisit di `src/db/schema/*` dengan Drizzle serta migrasi SQL dari **Drizzle Kit**. Jangan menerjemahkan istilah `array`, `blocks`, atau `join` sebagai fitur otomatis ORM.

* **Identitas & penamaan:** primary key untuk entitas domain menggunakan `integer generated ... identity` atau UUID yang dipilih konsisten per tabel pada Fase 0; tabel/kolom fisik `snake_case` (`service_packages`, `featured_image_id`), DTO/aplikasi `camelCase`, nama entitas logis PRD tetap menggunakan `kebab-case` untuk keterbacaan.
* **Relasi:** foreign key eksplisit untuk hubungan satu-ke-banyak; tabel penghubung untuk relasi banyak-ke-banyak seperti `project_categories`/`project_technologies`, dengan `sort_order` apabila urutan diperlukan. Hubungan `join` pada UI adalah query tabel anak, bukan field database ajaib.
* **Blok beranda dan konten:** `pages.layout` dan `projects.contentBlocks` dapat berupa JSONB berstruktur ketat yang divalidasi Zod (blok, tipe, versi, urutan, visibilitas); relasi media dari blok diverifikasi di service. Array berulang yang perlu query, urutan dan constraint (misalnya milestones/steps, media, harga) dapat memakai tabel anak. **Keputusan representasi tiap entitas dicatat di migrasi Fase 1.**
* **Draft, versi, soft delete:** field `status` (`draft`/`published`), `published_at`, `deleted_at`, `sort_order` dibuat sendiri pada entitas relevan; tabel `content_versions` merekam snapshot perubahan draft/publish untuk preview/restore. Publik hanya dapat mengakses versi published yang belum dihapus, dan waktu publikasi telah tercapai. Validasi wajib publikasi di service (draft boleh parsial).
* **Select/status:** enum PostgreSQL atau text + constraint sesuai kebutuhan; status stabil mengikuti Lampiran B, perubahan enum diuji migrasinya.
* **Uang:** integer Rupiah (non-negatif), format `id-ID`; **waktu:** timestamp UTC (`timestamptz`), tampilan WIB, jam jadwal `HH:mm` dan tanggal terblokir `YYYY-MM-DD` disimpan/validasi eksplisit.
* **Integritas:** `UNIQUE`, `CHECK`, foreign key, indeks, dan kendala eksklusi booking. Jangan mengandalkan validasi UI untuk konflik paralel. Penolakan hapus kategori yang masih terpakai melalui referential integrity `RESTRICT` **dan** pesan service yang ramah.
* **Transaksi:** proses multi-tabel (booking, perubahan pembayaran/progres/revisi, versi konten, audit, terbit draft, jadikan portofolio) wajib memakai `db.transaction`. Gunakan locking/constraint yang sesuai ketika nilai turunan disimpan agar race condition tidak membuat inkonsistensi.
* **Migrasi:** `drizzle-kit generate` untuk menghasilkan file SQL, **tinjau sebelum commit**, `drizzle-kit migrate` via koneksi direct Neon. SQL kustom untuk exclusion constraint booking, indeks parsial, dan kebijakan spesifik disimpan sebagai migrasi berversi; **jangan gunakan `push` pada produksi**. Uji migrasi dari nol dan restore.
* **Query:** proyeksi kolom eksplisit, `limit`, indeks, hindari N+1, sanitasi DTO publik. Query manual selalu berparameter; Drizzle tidak memeriksa izin pengguna dengan sendirinya.
* **Skema auth:** Better Auth mengelola entitas identitas/sesi/akun/verifikasi. Pemetaan ke profil `users` yang membawa role ditentukan di Fase 0, harus unik dan ber-FK; jangan menyimpan password dua kali atau menduplikasi data identitas.

### 2.3 Struktur Repositori & Modul
```
/
  src/
    app/
      (public)/                 situs publik & tracking Rilis 2
      admin/                    dashboard, settings, CRUD, operasional
      api/                      auth, upload/finalize, health, endpoint terbatas
    db/
      index.ts                  koneksi Drizzle
      schema/                   tabel domain, relasi, autentikasi
      migrations/               migrasi Drizzle Kit + SQL khusus
    auth/                       konfigurasi Better Auth & pemeriksaan sesi/2FA
    access/                     policy owner/editor, per-entitas, per-operasi/field
    actions/                    Server Actions publik dan admin
    services/                   use-case domain, transaksi, audit, revalidasi
    schemas/                    validasi Zod, DTO, blok Page Builder
    lib/
      calculator/               TS murni, browser dan server
      booking/                  TS murni
      whatsapp/                 builder template, nomor, placeholder
      tracking/                 sesi tracking, PIN, rate limit
      security/                 Turnstile, IP hash, sanitasi, upload
      format/                   Rupiah dan waktu WIB
    components/
      public/                   komponen prototype publik
      admin/                    komponen prototype dashboard
      blocks/                   renderer blok sesuai prototype
    seed/                       script idempotent memakai Drizzle
  tests/                        Vitest & Playwright
  drizzle.config.ts
```
Aturan dependensi: `lib/calculator` dan `lib/booking` adalah fungsi TS murni tanpa akses database, Next.js, atau autentikasi. Komponen tidak mengakses database langsung dari browser; semua mutasi melalui service yang diotorisasi.

### 2.4 Pola Akses Data
1. **Halaman publik:** RSC -> `services` -> Drizzle SELECT dengan filter `status='published'`, `deleted_at IS NULL`, aktif dan jadwal publikasi. Objek database tidak dikirim mentah ke Client Component; hanya DTO yang dibutuhkan.
2. **Penulisan form publik:** Server Action -> Zod -> Turnstile/honeypot -> rate limit -> service/Drizzle transaction -> audit/revalidate bila relevan. Harga dan slot dihitung ulang dari database.
3. **Dashboard admin:** setiap halaman/Server Action/Route Handler memanggil `requireAdminSession()` termasuk verifikasi **2FA sudah selesai** lalu `authorize(role, resource, action, fields)`. Menyembunyikan menu **bukan** otorisasi. Operasi berbahaya dicek ulang dalam transaction/service.
4. **Portal klien:** tidak menggunakan sesi admin; cookie tracking hanya untuk satu proyek dan setiap query membatasi `client_project_id` serta `is_visible_to_client`.
5. **API:** tidak ada REST/GraphQL CRUD generik anonim; Route Handler hanya untuk kebutuhan khusus (auth, signed upload/download, health, callback bila perlu). Origin/CSRF, content-type, rate limit, dan autentikasi divalidasi sesuai jenis endpoint.

---

## 3. Model Data — Entitas Logis dan Tabel Drizzle

Tabel di bagian ini tetap memakai nama dan tipe **logis** dari PRD lama agar spesifikasi fungsional tidak berubah. Semua entitas domain perlu `id`, `createdAt`, `updatedAt`; pemetaan ke kolom fisik `snake_case` dibuat eksplisit melalui Drizzle. Istilah `Koleksi` berarti **entitas/tabel atau kelompok tabel custom** (bukan koleksi sistem CMS). `Global` berarti konfigurasi singleton. Jenis `text`, `textarea`, `number`, `date`, `checkbox`, `select`, `array`, `group`, `relationship`, `upload`, `blocks`, `richText`, `join` adalah **kontrak input/relasi UI**, bukan tipe kolom otomatis. Relasi, JSONB, tabel anak, dan field wajib diimplementasikan sesuai 2.2.

**Draft**: status draft/published + `content_versions` dan preview; **Trash**: `deletedAt`/restore. Invariant harus ditegakkan di service/server dan constraint database, termasuk pembatasan publikasi untuk konten yang belum valid. Entitas Rilis 2 baru dibuat pada Fase 6.

Ringkasan izin (detail 5.4):
| Entitas | Pengunjung anonim | `editor` | `owner` |
|---|---|---|---|
| Konten situs (`pages`, `services`, `testimonials`, `faqs`, `categories`, `technologies`, `projects`, `service-packages`, `service-addons`, `media`) | Hanya output publik yang published/aktif via RSC; **tidak ada endpoint CRUD langsung** | CRUD konten sesuai izin | CRUD semua |
| Kalkulator dan jadwal | Hanya hasil konfigurasi yang aman untuk publik melalui RSC/aksi kalkulator; tidak bisa mutasi | Kelola kalkulator | Kelola kalkulator dan jadwal |
| Inquiry, quote, booking, proyek klien, transaksi, audit, autentikasi, berkas privat, rate limit | Hanya aksi publik tertentu yang tervalidasi; tidak bisa membaca tabel | Tidak | Hak operasional sesuai modul, audit tetap tidak bisa diubah |

**Tabel tambahan yang harus dibangun:** autentikasi/sesi Better Auth, pivot relasi many-to-many, `content_versions`, blok anak bila dipilih, relasi upload, dan tabel pendukung integritas. `users` pada PRD merujuk profil/otorisasi admin, terhubung ke identitas Better Auth tanpa duplikasi password (2.2, 3.8).

### 3.1 Konfigurasi & Konten Situs

#### Entitas singleton `site-settings`
Satu entitas/tabel singleton `site_settings`; tab adalah pengelompokan **form dashboard admin custom**, bukan fitur database. Menyimpan setting memicu invalidasi cache bertag `settings` melalui service.

| Tab | Field (tipe) | Keterangan |
|---|---|---|
| `general` | `brandName` (text, default `OpenByte Labs`), `logo` (upload), `favicon` (upload), `whatsappNumber` (text), `contactEmail` (email), `address` (text), `socialLinks` (array: `label`, `url`) | Nomor WA disimpan apa adanya, dinormalisasi saat dipakai |
| `hero` | `headline`, `subheadline`, `primaryCtaLabel`, `secondaryCtaLabel`, `heroImage` (upload), `trustMetrics` (array: `value`, `label`) | |
| `navigation` | `menuItems` (array: `label`, `target`, `isActive`; urutan array = urutan tampil), `footerText` (textarea) | |
| `seo` | `defaultTitle`, `defaultDescription`, `defaultOgImage` (upload), `analyticsId` (text) | Hanya **ID** analitik (mis. ID pengukuran), **bukan skrip mentah**, agar kompatibel dengan CSP |
| `whatsapp` | `tplCalculator`, `tplPackageOrder`, `tplBookingConfirm`, `tplTrackingLink`, `tplRevisionNotice` (textarea) | Placeholder divalidasi saat simpan (5.5) |
| `calculator` | `disclaimer` (textarea), `minimumPrice` (number), `showRange` (checkbox) | |
| `booking` | `slotDurationMinutes`, `bufferMinutes`, `minDaysAhead` (default 1), `maxDaysAhead` (default 30), `availableModes` (select hasMany) | |
| `tracking` | `trackingEnabled` (checkbox, default mati; sakelar Rilis 2), `revisionPolicy` (richText), `revisionWindowDays` (default 14), `bugWarrantyDays` (default 30), `maxLoginAttempts` (default 5), `lockMinutes` (default 15), `sessionMinutes` (default 120) | |
| `legal` | `privacyPolicy` (richText), `consentText` (textarea) | |

Akses: baca oleh server (cache bertag); tulis `owner` penuh, `editor` **tidak** boleh mengubah tab `whatsapp` dan `tracking` (akses tingkat field). Seeder mengisi semua field dengan nilai awal (8.5).

#### Entitas `pages` (Draft, Trash)
Halaman yang dibangun dengan field **`blocks`** (landing page, tentang, legal).
| Field | Tipe | Keterangan |
|---|---|---|
| `slug` | text, unik, indeks | `home`, `tentang`, `kebijakan-privasi` |
| `title` | text | |
| `layout` | blocks | daftar blok berurutan (lihat 4.2) |
| `meta` | group: `title`, `description`, `ogImage` (upload) | |

#### Entitas `services` (Layanan)
| Field | Tipe | Keterangan |
|---|---|---|
| `title` | text | |
| `description` | textarea | |
| `highlights` | array (`text`) | daftar poin singkat |
| `icon` | text | nama ikon Lucide, divalidasi terhadap daftar yang diizinkan |
| `isActive` | checkbox, default true | |
| urutan | `sortOrder` (integer) + fitur drag-and-drop di dashboard admin custom | |

#### Entitas `testimonials`
`authorName`, `authorRole` (text), `quote` (textarea), `photo` (upload), `project` (relationship ke `projects`, opsional), `isActive`, urutan.

#### Entitas `faqs`
`question` (text), `answer` (richText), `isActive`, urutan.

### 3.2 Portofolio

#### Entitas `categories`
| Field | Tipe | Keterangan |
|---|---|---|
| `name` | text | |
| `slug` | text, unik | |
| `icon` | text | |
| `showInFilter` | checkbox, default true | tampil sebagai tab filter |
| `isActive` | checkbox, default true | |
| urutan | `sortOrder` (integer) | |

Tab filter di publik dibuat otomatis dari kategori `isActive` dan `showInFilter`, ditambah tab tetap "Semua Proyek". Tidak ada nama tab yang ditulis di kode. Service admin dan FK `RESTRICT` menolak penghapusan kategori yang masih dipakai paket atau proyek.

#### Entitas `technologies`
`name` (text, unik), `slug`, `icon` (text), `color` (text, validasi hex `#RRGGBB`).

#### Entitas `projects` (Showcase; Draft, Trash)
| Field | Tipe | Keterangan |
|---|---|---|
| `title` | text | |
| `slug` | text, unik, indeks | dibuat otomatis oleh service saat input judul, bisa diedit |
| `tagline` | text | |
| `clientName` | text | |
| `year` | number (integer) | |
| `publishedAt` | date | proyek tampil di publik bila `status = published` **dan** `publishedAt <= sekarang` (pengganti penjadwalan; tanpa scheduler) |
| `featuredImage` | upload (`media`), `required` | wajib terisi **hanya saat publish** (validasi service); draft boleh kosong |
| `gallery` | array (`image` upload, `alt` text) | gambar tambahan |
| `summary` | textarea | ringkasan untuk kartu |
| `contentBlocks` | blocks | blok konten detail (di bawah) |
| `links` | array (`label`, `type`, `url`) | `type`: `demo`, `github`, `playstore`, `appstore`, `video`, `lainnya`; `url` hanya skema `https` |
| `isFeatured` | checkbox | |
| `categories` | relationship hasMany ke `categories` | satu proyek boleh banyak kategori |
| `technologies` | relationship hasMany ke `technologies` | urutan dipertahankan |
| `meta` | group: `title`, `description`, `ogImage` | `ogImage` kosong memakai `featuredImage` |
| urutan | `sortOrder` (integer) | drag-and-drop |

Jenis blok `contentBlocks`: `richText`, `image`, `gallery`, `video` (URL dibatasi ke penyedia yang diizinkan, mis. YouTube/Vimeo, dirender sebagai embed ber-*privacy mode* dan didaftarkan di CSP `frame-src`), `stats` (angka dampak), `quote`, `bullets`, dan preset `problemSolutionImpact`. Proyek lama diisi seeder memakai preset Masalah/Solusi/Dampak.

### 3.3 Paket & Penawaran

#### Entitas `service-packages` (Trash)
| Field | Tipe | Keterangan |
|---|---|---|
| `category` | relationship ke `categories` | penghapusan kategori ditolak service dan FK selama masih dipakai |
| `name` | text | |
| `slug` | text, unik | |
| `targetMarket` | text | |
| `price` | number (integer Rupiah) | |
| `discountPrice` | number (integer) | |
| `discountEndsAt` | date | diskon otomatis berhenti setelah tanggal ini (dihitung saat render, bukan job) |
| `billingType` | select | `one_time`, `subscription_yearly`, `custom` |
| `estimatedDays` | number (integer) | hari kerja |
| `features` | array (`text`) | daftar fitur |
| `includedRevisions` | number, default 2 | **kuota revisi gratis** |
| `extraRevisionPrice` | number | harga per revisi tambahan; kosong = ditentukan manual |
| `revisionPolicy` | richText | jika kosong memakai kebijakan global |
| `ctaLabel` | text | |
| `isPopular`, `isActive` | checkbox | |
| urutan | `sortOrder` (integer) | |

#### Entitas `service-addons`
`name`, `description`, `price` (integer), `billingType` (`one_time` / `monthly` / `yearly`), `isActive`, urutan. Contoh: maintenance bulanan, hosting, domain.

#### Entitas `inquiries` (Pemesanan Paket / Permintaan Penawaran)
| Field | Tipe | Keterangan |
|---|---|---|
| `reference` | text, unik, read-only | contoh `INQ-2610-8F3K`; dibuat oleh service pembuatan inquiry |
| `servicePackage` | relationship | |
| `quoteRequest` | relationship ke `quote-requests` | |
| `name` | text | |
| `whatsapp` | text | dinormalisasi ke `628...` |
| `email` | email | opsional |
| `organizationOrBusiness` | text | |
| `message` | textarea | |
| `source` | select | `package`, `calculator`, `contact` |
| `status` | select, default `new` | `new`, `contacted`, `converted`, `dropped` |
| `adminNotes` | textarea | |
| `consentAt` | date | persetujuan pengolahan data |

### 3.4 Kalkulator

#### Entitas `calculator-groups`
`title`, `description`, `selectionType` (select `single` / `multiple`), `isRequired`, `isActive`, urutan.

#### Entitas `calculator-items`
| Field | Tipe | Keterangan |
|---|---|---|
| `group` | relationship ke `calculator-groups`, indeks | |
| `label` | text | |
| `description` | text | |
| `pricingType` | select, default `flat` | `flat` atau `per_unit` |
| `unitLabel` | text | mis. "halaman", "modul" (untuk `per_unit`) |
| `maxUnits` | number | batas jumlah unit |
| `priceMin` | number (integer), default 0 | |
| `priceMax` | number (integer) | kosong = sama dengan `priceMin` |
| `daysMin` | number, default 0 | tambahan hari kerja |
| `daysMax` | number | kosong = sama dengan `daysMin` |
| `isDefault`, `isActive` | checkbox | |
| `rules` | array (`relatedItem` relationship, `ruleType` select `requires` / `excludes`) | **aturan antar item** (ditulis sebagai tabel relasi ber-FK pada Drizzle) |
| urutan | `sortOrder` (integer) | |

Contoh aturan: "Pemetaan GIS" `requires` "Sistem Informasi Database"; "Landing Page" `excludes` "Multi-User RBAC". Validasi validasi service: tidak ada aturan ke diri sendiri, tidak ada siklus `requires`, dan pasangan `excludes` tidak kontradiktif dengan `requires`.

#### Entitas `quote-requests`
Menyimpan hasil kalkulasi saat pengunjung menekan CTA WhatsApp.
| Field | Tipe | Keterangan |
|---|---|---|
| `reference` | text, unik | |
| `selection` | json | snapshot item terpilih + jumlah unit + label |
| `priceMin`, `priceMax` | number (integer) | dihitung server |
| `daysMin`, `daysMax` | number | |
| `contactName`, `contactWhatsapp` | text | opsional |
| `ipHash` | text | hash IP + salt, bukan IP mentah |
| `status` | select, default `new` | `new`, `contacted`, `converted`, `dropped` |

### 3.5 Booking Konsultasi

#### Entitas `availability-rules` (jadwal mingguan berulang)
`weekday` (number 0-6), `startTime` (text `HH:mm`, WIB), `endTime` (text `HH:mm`, WIB), `isActive`. Validasi: format jam, `endTime` setelah `startTime`, rentang pada hari yang sama tidak tumpang tindih. Slot dihasilkan dari rentang ini memakai durasi dan jeda di `site-settings`.

#### Entitas `blocked-dates`
`date` (text `YYYY-MM-DD`, WIB), `startTime` (text `HH:mm`, opsional), `endTime` (text `HH:mm`, opsional), `reason` (text). Jam kosong = seluruh hari diblokir.

#### Entitas `consultation-bookings`
| Field | Tipe | Keterangan |
|---|---|---|
| `reference` | text, unik | |
| `name` | text | |
| `whatsapp` | text | |
| `email` | email | opsional |
| `organizationOrBusiness` | text | |
| `serviceInterest` | text | |
| `slotStart`, `slotEnd` | date (timestamp UTC) | instan awal/akhir sesi; ditampilkan WIB |
| `consultationMode` | select, default `google_meet` | `google_meet`, `whatsapp_call`, `offline` |
| `projectBrief` | textarea | |
| `status` | select, default `pending` | `pending`, `confirmed`, `completed`, `cancelled` |
| `meetingUrl` | text | ditempel admin saat konfirmasi (validasi `https`) |
| `adminNotes` | textarea | |
| `consentAt` | date | |

**Anti double-booking (berlapis):**
1. Validasi aplikasi (modul `lib/booking`): slot berada pada jadwal aktif, tidak terkena `blocked-dates`, dalam rentang `minDaysAhead`-`maxDaysAhead`, dan tidak tumpang tindih dengan booking aktif.
2. **Kendala eksklusi PostgreSQL** pada `tstzrange(slot_start, slot_end)` dengan kondisi `status IN ('pending','confirmed')`, dibuat lewat migrasi SQL kustom. Ini penjaga terakhir terhadap balapan dan juga mencegah tumpang tindih bila durasi slot diubah di Settings. Alternatif yang lebih sederhana bila kendala eksklusi bermasalah di Neon: indeks unik parsial pada `slot_start` dengan kondisi yang sama.
3. Server Action menangkap pelanggaran kendala (`23P01` untuk kendala eksklusi; `23505` bila memakai alternatif indeks unik) dan menjawab "Slot baru saja terisi, pilih jam lain". DDL acuan dan hasil uji pada PostgreSQL 16.2 (termasuk balapan 12 koneksi serentak: satu berhasil, sebelas ditolak) ada di Lampiran F.7.

### 3.6 Proyek Klien, Progres, Pembayaran (Rilis 2)

#### Entitas `step-templates` (editable di dashboard admin)
`stepNumber` (number 1-6), `title`, `description`, `defaultMilestones` (array `text`). Dipakai service pembuatan proyek (satu transaksi) untuk mengisi `steps` pada proyek klien baru. Isi awal: enam tahap pada 4.7.

#### Entitas `client-projects` (Trash)
| Field | Tipe | Keterangan |
|---|---|---|
| `trackingCode` | text, unik, indeks | format `PRJ-XXXXXXXX` (8 karakter dari alfabet tanpa karakter ambigu; lihat Lampiran F.5), dibuat server |
| `accessPinHash` | text | PIN 6 digit acak, di-hash; **akses baca field dimatikan** (tidak pernah keluar lewat API); PIN asli ditampilkan ke admin sekali saat dibuat/diganti |
| `pinVersion` | number, default 1 | naik setiap PIN diganti; sesi tracking lama otomatis tidak sah |
| `clientName`, `clientWhatsapp`, `clientEmail` | text | |
| `projectTitle` | text | |
| `category`, `servicePackage` | relationship | |
| `project` | relationship ke `projects` | tautan ke portofolio, opsional |
| `totalCost` | number (integer) | bertambah bila revisi berbayar/change request disetujui |
| `revisionsIncluded` | number | **snapshot** dari paket saat proyek dibuat; bisa diubah admin |
| `extraRevisionPrice` | number | snapshot |
| `revisionPolicySnapshot` | richText | snapshot kebijakan |
| `isReviewOpen` | checkbox, default false | klien boleh menyetujui/mengajukan revisi hanya bila true |
| `reviewOpenedAt` | date | |
| `stagingUrl`, `productionUrl`, `githubUrl` | text | validasi `https` |
| `clientVisibility` | group of checkbox | `staging`, `production`, `github`, `payments`, `documents`, `timeline` |
| `startDate`, `targetCompletionDate` | date | |
| `internalNotes` | textarea | tidak pernah tampil ke klien |
| `archivedAt` | date | |
| `steps` | array | `stepNumber` (1-6), `title`, `description`, `status` (select `pending` / `in_progress` / `done`), `startedAt`, `completedAt`, dan array bersarang `milestones` (`title`, `description`, `isCompleted`, `completedAt`) |
| `payments`, `updates`, `documents`, `revisionRequests`, `comments`, `approvals` | **relasi UI** | tab/daftar record anak di dashboard proyek melalui query FK; data disimpan di tabel masing-masing |

Nilai turunan (field **read-only**, tidak ada akses tulis dari admin maupun API; dihitung atau disinkronkan lewat service transaksional): `paidAmount` = jumlah `payments`, `balance` = `totalCost` - `paidAmount`, `paymentStatus` (`unpaid`, `down_payment`, `paid_off`), `currentStep` = langkah pertama yang belum `done`, `revisionsUsed` = jumlah `revision-requests` yang dihitung kuota. Service mutasi `payments`, `revision-requests`, dan `client-projects` menghitung ulang nilai ini **di transaksi database yang sama**. Pengujian concurrency wajib membuktikan `currentStep` selaras `steps` dan `paidAmount` sama dengan jumlah pembayaran (locking/recompute sesuai strategi 2.2).

`steps` dan `milestones` disimpan pada tabel anak dengan FK dan `sort_order` untuk mendukung pembaruan transaksional serta constraint; sumber kebenaran progres tetap satu. DTO dashboard dapat menyajikannya sebagai array.

#### Entitas `payments`
`clientProject` (relationship, indeks), `paidAt` (date), `amount` (integer), `method` (select: transfer, tunai, QRIS), `note` (text), `proof` (upload ke `private-files`), `isVisibleToClient` (checkbox, default true).

#### Entitas `project-updates` (timeline)
`clientProject`, `title`, `body` (richText), `isVisibleToClient` (default true), `createdBy` (relationship ke `users`).

#### Entitas `project-documents`
`clientProject`, `title`, `type` (select `url` / `file`), `url` (text, `https`), `file` (upload ke `private-files`), `isVisibleToClient` (default true), urutan.

### 3.7 Revisi, Komentar, Persetujuan (Rilis 2)

#### Entitas `revision-requests`
| Field | Tipe | Keterangan |
|---|---|---|
| `clientProject` | relationship, indeks | |
| `roundNumber` | number, read-only | urutan permintaan dalam proyek; dihitung service dalam transaksi; unik bersama `clientProject` (migrasi SQL kustom) |
| `type` | select | `revision` (perbaikan), `change_request` (fitur/scope baru, berbiaya), atau `bug` (fitur tidak berjalan sesuai kesepakatan; tidak menghitung kuota) |
| `title` | text | |
| `description` | textarea | teks biasa (di-escape saat tampil) |
| `attachments` | array (upload ke `private-files`), maks. 5 | tipe & ukuran dibatasi |
| `status` | select, default `submitted` | `submitted`, `accepted`, `in_progress`, `done`, `rejected`, `needs_payment` |
| `countsTowardQuota` | checkbox, default false | menjadi true saat diterima sebagai revisi gratis |
| `isExtra` | checkbox, default false | revisi di atas kuota yang diterima dengan biaya |
| `quotedPrice` | number (integer) | harga yang ditetapkan admin (extra/change request) |
| `clientAcceptedQuoteAt` | date | klien setuju biaya |
| `adminResponse` | textarea | |
| `submittedAt`, `resolvedAt` | date | |

#### Entitas `project-comments`
`clientProject`, `revisionRequest` (relationship opsional), `authorType` (select `client` / `admin`), `authorName`, `body` (textarea, teks biasa), `attachments` (array upload ke `private-files`), `isInternal` (checkbox; **hanya admin**, tidak tampil ke klien).

#### Entitas `project-approvals`
Bukti persetujuan; **tidak dapat diubah atau dihapus** setelah dibuat (akses `update` dan `delete` tertutup untuk semua peran).
`clientProject`, `type` (select `step_review` / `final_handover`), `approvedByName`, `note`, `ipHash`, `userAgent`, `approvedAt`.

### 3.8 Pengguna, Berkas Privat, Audit, Rate Limit

* **`users`** (profil/role admin): `name`, `email`, `roles` (`owner` atau `editor`, sesuai kebijakan akses); relasi unik ke user identitas yang dikelola Better Auth. **Password/hash, sesi, faktor TOTP, recovery codes** disimpan hanya di tabel/struktur autentikasi yang didukung Better Auth, tidak diduplikasi pada tabel domain. Akun dibuat hanya oleh `owner`. Login admin memerlukan TOTP untuk kedua role; batas 5 kegagalan per 15 menit diberlakukan melalui kebijakan aplikasi dan plugin auth yang diuji.
* **`media`** (metadata objek bucket R2 publik): path/key, MIME, ukuran, dimensi, `alt` wajib, turunan WebP (`thumb`, `card`, `hero`, `og`), owner, status finalisasi. SVG user tidak diizinkan; file disimpan di R2, bukan disk deployment. Signed upload dan finalisasi server memvalidasi tipe/ukuran asli sebelum media boleh dipublikasikan.
* **`private-files`** (Rilis 2): metadata objek pada bucket privat R2; nama/key acak UUID; tidak ada akses anonim; download memakai signed URL singkat setelah pemeriksaan admin atau sesi proyek terkait. Header `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff`.
* **`content_versions`** (Rilis 1): record versi draft/publish untuk `pages` dan `projects` (serta konten lain yang memerlukan versioning), memuat id entitas, versi, snapshot JSONB tervalidasi, actor, timestamp, tipe perubahan; hanya admin berizin yang dapat preview/restore. Restore membuat revisi baru (tidak menghapus sejarah).
* **`audit-logs`**: `actor` (FK profil admin opsional), `actorType` (`admin`/`client`/`system`), `action`, `collection` (nama entitas logis), `docId`, `summary`, `diff` (tanpa rahasia), `ipHash`, waktu. Insert-only lewat service; baca hanya `owner`; operasi update/delete ditolak di aplikasi dan, bila layak, dibatasi lewat role database.
* **`rate-limits`**: `key` unik, `count`, `windowStartedAt`, `lockedUntil`. Update atomik/transaksi untuk mencegah bypass secara paralel; baris kedaluwarsa dibersihkan saat dibaca.

### 3.9 Ringkasan Relasi
```
categories >-< projects >-< technologies
categories 1-* service-packages 1-* client-projects *-1 projects (opsional)
quote-requests 1-* inquiries     service-packages 1-* inquiries
calculator-groups 1-* calculator-items (rules: item >-< item)
client-projects 1-* project-steps 1-* project-milestones (tabel anak; DTO array)
client-projects 1-* payments | project-updates | project-documents
client-projects 1-* revision-requests | project-comments | project-approvals
payments, project-documents, revision-requests, project-comments *-* private-files
```

---

## 4. Spesifikasi Modul Publik (Frontend Next.js)

**Acuan antarmuka publik:** Gunakan prototype website publik full-page yang sudah dibuat pemilik (folder `prototype/` bila tersedia di repositori) sebagai referensi utama visual dan UX: susunan, ukuran, warna, tipografi, ikon, komponen, dan perilaku responsif. Jangan menetapkan aturan styling alternatif yang bertentangan dengan prototype. Bagian 4 hanya mengatur fungsi, data, rute, validasi, dan perilaku yang harus bekerja. Jika prototype belum memperlihatkan state tertentu (loading, error, empty, validasi form, responsivitas), implementasikan state yang konsisten dengan prototype dan persyaratan aksesibilitas 6.5; bila ada konflik fungsi/keamanan dengan prototype, pertahankan persyaratan fungsi/keamanan PRD dan konfirmasi penyesuaian UI dengan pemilik. Panel admin **wajib** dibangun mengikuti prototype dashboard milik pemilik; komponen yang belum tergambar mengikuti kebutuhan fungsi dan aksesibilitas PRD.

### 4.1 Peta Halaman, Rute, dan Strategi Render
| Rute | Halaman | Sumber data | Render |
|---|---|---|---|
| `/` | Beranda | `pages` (slug `home`) + `site-settings` | Statis + revalidasi bertag |
| `/proyek` | Daftar showcase | `projects`, `categories` | Statis + revalidasi bertag |
| `/proyek/[slug]` | Detail proyek | `projects` | Statis (`generateStaticParams`) + revalidasi bertag |
| `/paket` | Paket harga | `service-packages`, `service-addons` | Statis + revalidasi bertag |
| `/pesan?paket={slug}` | Form pemesanan | `inquiries` | Dinamis (form ditangani Server Action) |
| `/konsultasi` | Booking konsultasi | `availability-rules`, `blocked-dates`, `consultation-bookings` | Dinamis (slot terisi harus terbaru) |
| `/tracking` | Login tracking (Rilis 2; 404 sampai diaktifkan) | | Dinamis, `no-store` |
| `/tracking/proyek` | Dasbor klien (Rilis 2; sesi terverifikasi) | `client-projects` & turunannya | Dinamis, `no-store` |
| `/kebijakan-privasi` | Legal | `pages` + `site-settings.legal` | Statis + revalidasi bertag |
| `/health` | Pemeriksaan database untuk uptime monitor | | Dinamis |
| `/sitemap.xml`, `/robots.txt` | SEO | Metadata API Next.js (`sitemap`, `robots`) | Dinamis/revalidasi |
| `not-found`, `error`, `global-error` | Halaman error berbahasa Indonesia (404/500/419-setara) | | |

**Revalidasi:** service mutasi konten admin setelah commit memanggil `revalidateTag(tag, 'max')` (atau mekanisme cache sesuai versi Next.js yang tervalidasi) dengan tag per entitas (`settings`, `pages`, `projects`, `packages`, `calculator`, ...), sehingga perubahan dari admin tampil di publik **tanpa deploy ulang**. Nama API revalidasi disesuaikan dengan versi Next.js yang dikunci (penamaan dan argumen `revalidateTag` berbeda antar versi mayor). **Draft preview** memakai *Draft Mode* Next.js + token pratinjau singkat yang terikat sesi admin/izin (4.2).

**Gambar:** hasil pipeline `sharp` pada finalisasi upload disimpan sebagai varian WebP di R2. Layani lewat `next/image`; bila kuota optimasi gambar platform terbatas (misal di Hobby), pakai `unoptimized` atau *loader* kustom yang menunjuk langsung ke ukuran turunan di R2. Cek batas platform saat Fase 0. `priority` hanya untuk gambar di atas lipatan; sisanya lazy.

### 4.2 Beranda (Page Builder)
Beranda disusun dari blok yang urutan, isi, dan visibilitasnya diatur di admin. Susunan visual dan tampilan mengikuti prototype full-page pemilik; konten awal tercantum di Lampiran D. Jenis blok berikut adalah tipe data/fitur CMS (setiap blok punya `isVisible`), **bukan ketentuan tata letak visual**:
`hero`, `servicesGrid` (dari `services`), `portfolioShowcase` (jumlah item, hanya unggulan/semua), `calculator`, `pricing` (dari paket aktif), `testimonials`, `faq`, `about`, `ctaBanner`, `richText`.

Bawaan seeder (semua dapat diubah/dihapus/diurutkan ulang):
* **Hero**: tagline utama, subtitle personal, trust metrics, dua CTA (kalkulator dan WhatsApp). Seluruh teks dari `site-settings`.
* **Layanan unggulan**: empat item awal dari seeder: Sistem Informasi & Satu Data; Aplikasi Mobile Lintas Platform; Website Bisnis & UMKM; Undangan Digital Interaktif. Penyajian visual mengikuti prototype.

**Pemetaan blok -> komponen:** setiap tipe blok punya satu komponen React server (`components/blocks/<Nama>.tsx`) dan satu skema Zod/renderer blok (`schemas/blocks/<Nama>.ts`). Blok yang tidak dikenali dilewati dan dicatat ke Sentry (bukan menjatuhkan halaman).

### 4.3 Showcase Portofolio
* Tab filter dari `categories` aktif, difilter di sisi klien (Client Component kecil, tanpa muat ulang halaman). Proyek dengan banyak kategori muncul di semua tab terkait. Data awal dikirim dari server sebagai DTO ringkas (judul, slug, tagline, gambar kartu, id kategori, ikon teknologi).
* Hanya proyek published dengan `publishedAt <= sekarang` yang tampil.
* Kartu: gambar (WebP, lazy), judul, tagline, badge kategori, ikon teknologi.
* Halaman detail: render `contentBlocks`, galeri, daftar teknologi, tombol dari `links`, proyek terkait (kategori sama), meta SEO dan OG per proyek (Metadata API).

### 4.4 Kalkulator Estimasi Biaya
* Data grup/item/aturan dibaca server (cache bertag `calculator`, dibersihkan otomatis saat admin menyimpan) dan dikirim ke Client Component sebagai DTO.
* **Perilaku:** grup `single` memakai radio, `multiple` memakai checkbox; grup `isRequired` harus terisi; item `per_unit` menampilkan input jumlah dengan batas `maxUnits`; item yang melanggar aturan `excludes` dinonaktifkan; item yang `requires` item lain otomatis menandai/mewajibkan item tersebut.
* **Perhitungan:** total minimum = jumlah `priceMin` (dikali unit bila `per_unit`); total maksimum = jumlah `priceMax` (atau `priceMin` bila kosong). Hasil tidak boleh kurang dari `minimumPrice` di Settings. Bila min = max, tampil satu angka; bila berbeda, tampil rentang (sesuai `showRange`). Durasi dihitung sama dari `daysMin`/`daysMax`.
* **Satu mesin, dua pemakai:** perhitungan dan penegakan aturan berada di `lib/calculator` (TypeScript murni, tanpa dependensi React/Next.js/Drizzle). Browser memakainya untuk pratinjau; Server Action memakai **modul yang sama** untuk perhitungan resmi. Uji paritas Vitest memastikan keduanya identik untuk seluruh kombinasi uji. Aturan rinci dan vektor uji: Lampiran F.1.
* **Otoritas server:** saat pengunjung menekan "Kirim Rincian Estimasi ke WhatsApp", Server Action memvalidasi masukan (zod), memeriksa Turnstile dan rate limit, **membaca konfigurasi terbaru langsung dari database** (bukan dari cache), menghitung ulang, menyimpan `quote-requests`, lalu mengembalikan URL `wa.me` terisi dari template Settings. Nilai harga kiriman browser diabaikan.
* Disclaimer ("estimasi awal, bukan penawaran final") diambil dari Settings.

### 4.5 Paket Harga & Pemesanan
* Kartu paket dibuat dari semua `service-packages` aktif (jumlah bebas, tidak terkunci tiga), menampilkan harga, harga diskon (jika `discountEndsAt` belum lewat; dihitung saat render, dan halaman direvalidasi pada waktu berakhirnya diskon bila perlu), durasi, fitur, **kuota revisi** ("termasuk 3x revisi"), dan lencana "Populer".
* Bagian add-on dari `service-addons` aktif.
* CTA kartu menuju `/pesan?paket={slug}`. Form: nama, WhatsApp (validasi `08...`/`628...`), email (opsional), instansi/bisnis, pesan, checkbox persetujuan data, Turnstile. Server Action menyimpan ke `inquiries`, lalu halaman sukses menawarkan tombol WhatsApp.

### 4.6 Booking Konsultasi
* **Slot** dihasilkan oleh `lib/booking` dari `availability-rules` dikurangi `blocked-dates` dan booking aktif, memakai durasi/jeda Settings (aturan rinci dan vektor uji: Lampiran F.2). Hanya tanggal pada rentang minimal-maksimal hari yang bisa dipilih. Semua jam ditampilkan dengan label **WIB** (`Asia/Jakarta`) apa pun zona waktu perangkat pengunjung.
* **Form:** nama, WhatsApp, email (opsional), instansi/bisnis, kategori layanan, tanggal, slot, mode (Google Meet / Telepon WhatsApp / Tatap muka), ringkasan kebutuhan, persetujuan data, Turnstile.
* **Setelah kirim:** disimpan `pending` (melewati lapisan anti double-booking di 3.5); halaman sukses menampilkan nomor referensi, tombol "Tambahkan ke Google Calendar" (link generator), dan tombol WhatsApp. Admin diberi tanda di panel (5.1) dan tombol balasan WhatsApp (tanpa email).
* **Konfirmasi oleh admin:** admin menempel `meetingUrl`, mengubah status ke `confirmed`, lalu menekan aksi "Kirim konfirmasi via WhatsApp" (template `tplBookingConfirm`).

### 4.7 Portal Pelacakan Proyek Klien (Rilis 2)

**Autentikasi (tanpa akun):**
1. Klien membuka `/tracking`, memasukkan **Kode Tracking** (`PRJ-XXXXXXXX`) dan **PIN 6 digit** (diberikan admin lewat WhatsApp). Form dikirim lewat Server Action (kode tidak ditaruh di URL).
2. Server memverifikasi (perbandingan hash waktu-konstan), lalu menerbitkan **cookie sesi bertanda tangan** (`httpOnly`, `secure`, `sameSite=lax`) berisi id proyek, `pinVersion`, dan waktu kedaluwarsa (default 120 menit dari Settings). Setiap permintaan memeriksa tanda tangan, kedaluwarsa, dan bahwa `pinVersion` masih sama dengan database; **mengganti PIN langsung mencabut seluruh sesi lama**.
3. Pembatasan lewat `rate-limits` (algoritma dan vektor: Lampiran F.6): maks. 5 percobaan gagal per kode dalam 15 menit, setelah itu kode terkunci 15 menit; pembatas tambahan per IP + kode dan per IP global. Pesan gagal selalu generik ("Kode atau PIN tidak sesuai"), dan waktu respons sengaja dibuat seragam (verifikasi hash dijalankan walau kode tidak ditemukan, untuk mencegah pembedaan kode valid/tidak lewat waktu).
4. Semua halaman tracking: `noindex`, `Cache-Control: no-store`, dirender dinamis; Server Action memakai pemeriksaan Origin bawaan Next.js dan cookie `sameSite`.

**Tampilan dasbor:**
* Header: judul proyek, nama klien, tanggal mulai, target selesai, tombol keluar (menghapus cookie).
* **Stepper 1-6** dari `steps` (status `pending`/`in_progress`/`done`) dengan checklist `milestones` per tahap dan persentase progres tahap.
* Enam tahap bawaan (dari `step-templates`, bisa diubah di dashboard admin):
  1. Pengumpulan Kebutuhan & Penandatanganan Kontrak / DP
  2. Perancangan Arsitektur & Desain Mockup UI/UX
  3. Tahap Coding & Integrasi Database
  4. Pengujian Fungsional (Testing & Bug Fixing)
  5. Review Klien & Penyesuaian (Revisi)
  6. Deployment Server Live & Serah Terima Proyek
* Ringkasan pembayaran (jika `clientVisibility.payments`): total biaya, terbayar, sisa, status, dan riwayat pembayaran yang ditandai tampil.
* Timeline `project-updates`, dokumen/tautan `project-documents`, serta link staging/production/GitHub **sesuai toggle visibilitas**. Berkas privat diunduh lewat URL bertanda tangan berumur pendek (3.8).
* **Panel revisi** dan **komentar** (lihat 4.8).

### 4.8 Revisi, Komentar, dan Persetujuan (Rilis 2)

**Kuota:** "Revisi terpakai X dari Y" (`revisionsUsed` dari `revisionsIncluded`). Nilai `revisionsIncluded` disalin dari paket saat proyek dibuat dan dapat diubah admin per proyek.

**Komentar:** klien dan admin saling membalas pada utas umum atau pada satu permintaan revisi. Catatan `isInternal` hanya tampil untuk admin (query sisi klien selalu menyaring `isInternal = false`). Teks klien disimpan apa adanya dan **dirender sebagai teks** (React meng-escape secara bawaan; tidak ada `dangerouslySetInnerHTML` untuk teks klien). Lampiran dibatasi tipe (gambar, PDF, ZIP kecil) dan ukuran (5 MB/file, maks. 5 file).

**Unggah lampiran klien:** Server Action memeriksa sesi, jumlah, nama, tipe, dan ukuran yang dideklarasikan, lalu menerbitkan **URL unggah bertanda tangan** ke bucket privat dengan nama acak (unggahan langsung ke R2, melewati batas ukuran body platform). Karena R2 mungkin tidak mendukung batas ukuran pada URL bertanda tangan (cek dokumentasi R2 terbaru), server **memverifikasi ukuran dan tipe sebenarnya** (HEAD/baca awal berkas) saat pengajuan dikirim dan menghapus berkas yang melanggar. Berkas tidak pernah dieksekusi atau dilayani inline.

**Pengajuan revisi** (hanya bila `isReviewOpen = true`): klien mengisi judul, deskripsi, lampiran, dan memilih jenis (`revision`, `change_request`, atau `bug`).

**Mesin status revisi** (fungsi murni `nextRevisionState()` di `lib/tracking`, dipanggil service mutasi dan aksi admin; aturan lengkap dan vektor uji di Lampiran F.4; transisi tidak sah ditolak):
| Dari | Peristiwa | Ke | Aturan |
|---|---|---|---|
| (baru) | SUBMIT | `submitted` | jenis `bug`, atau jenis `revision` dengan kuota tersisa |
| (baru) | SUBMIT | `needs_payment` | jenis `change_request`, atau jenis `revision` saat kuota sudah habis; `quotedPrice` kosong sampai admin mengisinya |
| `submitted` | ACCEPT | `accepted` | `revision` dengan kuota tersisa: `countsTowardQuota = true`; `bug`: tidak menghitung kuota |
| `submitted` | ACCEPT | `needs_payment` | `revision` yang kuotanya sudah habis saat diterima (mis. dua pengajuan bersamaan) |
| `needs_payment` | SET_QUOTE | `needs_payment` | admin mengisi `quotedPrice` |
| `needs_payment` | CLIENT_ACCEPT_QUOTE | `needs_payment` | hanya bila `quotedPrice` terisi; mengisi `clientAcceptedQuoteAt` |
| `needs_payment` | ACCEPT | `accepted` | hanya bila `quotedPrice` terisi dan klien sudah setuju; `isExtra = true`, `totalCost` bertambah sebesar `quotedPrice` (sekali) |
| `submitted`/`needs_payment` | REJECT | `rejected` | wajib `adminResponse`; tidak menghitung kuota |
| `accepted` | START | `in_progress` | |
| `in_progress` | DONE | `done` | `resolvedAt` terisi |

Kuota hanya berkurang saat revisi **diterima**, bukan saat diajukan. Jenis `bug` tidak pernah menghitung kuota. Klien melihat status dan, untuk `needs_payment`, biaya yang diusulkan beserta tombol "Setujui biaya" (mengisi `clientAcceptedQuoteAt`) atau "Tolak".

**Persetujuan:**
* Admin menekan "Buka Review" (tahap 5 -> `in_progress`, `isReviewOpen = true`). Klien melihat tombol **Setujui Hasil** dan **Ajukan Revisi**.
* "Setujui Hasil" mengharuskan klien mengisi nama dan memasukkan ulang PIN; sistem mencatat `project-approvals` (nama, waktu, IP ter-hash, user agent). Catatan ini tidak dapat diubah atau dihapus.
* Serah terima akhir (`final_handover`) hanya dapat disetujui setelah tahap 4 selesai dan sisa pembayaran sesuai aturan admin.
* Setiap pengajuan atau komentar baru dari klien muncul di panel "Perlu Tindakan" admin (5.1) beserta tombol balasan WhatsApp; tanpa email.

---

## 5. Spesifikasi Dashboard Admin Custom

**Satu panel `/admin` dibangun dengan Next.js + React + Tailwind CSS, mengikuti prototype dashboard full-page milik pemilik.** Panel ini adalah CMS custom secara fungsional, bukan paket CMS eksternal. Login memakai Better Auth, **TOTP wajib untuk semua `owner` dan `editor`**; seluruh halaman dan mutasi memeriksa sesi, penyelesaian 2FA, dan role di server. Navigasi dalam prototype dipetakan ke tiga grup **Konten Website**, **Operasional Klien**, dan **Sistem**, tanpa mengubah hierarki visual prototype. Semua menu/halaman harus mendukung loading, empty, error, konfirmasi aksi destruktif, keyboard, dan mobile/responsivitas seperti prototype.

### 5.1 Dashboard
Dashboard **custom sepenuhnya**, bukan menyisipkan widget ke dashboard CMS bawaan:
* Stat cards: proyek terbit, booking baru bulan ini, inquiry/quote baru; Rilis 2 menambah proyek klien aktif, nilai proyek aktif, dan revisi menunggu.
* Tabel: 5 booking terbaru dan inquiry/quote terbaru; Rilis 2 menambah 5 proyek aktif dan revisi `submitted`/`needs_payment`.
* Panel **Perlu Tindakan** dari query terotorisasi (tanpa tabel notifikasi): booking `pending`, inquiry/quote `new`; Rilis 2 menambah revisi/komentar baru dan proyek selesai yang belum menjadi portofolio.
* Statistik, badge, filter, modal, dan transisi mengikuti prototype. Angka dan tautan harus berasal dari query server teruji, bukan data hardcode.

### 5.2 Grup "Konten Website"
| Menu | Fungsi |
|---|---|
| **Site Settings** | Form tab Umum, Hero, Navigasi & Footer, SEO, WhatsApp, Kalkulator, Booking, Tracking, Legal pada tabel `site_settings`; role/field permission |
| **Halaman** | CRUD `pages`, editor blok data yang memang dibutuhkan prototype, reorder, `isVisible`, draft/publish, preview dengan Draft Mode, version history/restore |
| **Layanan** | CRUD `services`, reorder |
| **Proyek (Showcase)** | Judul, slug otomatis/unik, kategori & teknologi (multi), tahun, klien, tagline, media dan galeri R2, blok konten, link, SEO, draft/publish, `publishedAt`, unggulan, reorder, duplicate dengan regenerasi slug, trash/restore, opsi aksi massal yang diimplementasikan sendiri |
| **Kategori, Teknologi** | CRUD, filter, ikon/warna, relasi FK, reorder |
| **Testimoni, FAQ** | CRUD, aktif/nonaktif, urut; editor rich text sesuai kebutuhan |
| **Paket, Add-on** | Harga, diskon, durasi, fitur, kuota revisi, kebijakan, toggle populer/aktif |
| **Kalkulator** | Grup -> item -> rules `requires`/`excludes`, harga & durasi, validasi siklus/kontradiksi, drag reorder, invalidasi cache |
| **Media** | Library gambar R2; alt wajib, signed upload, finalisasi/varian WebP, error/retry |

**Catatan desain:** bentuk halaman/editor diturunkan dari prototype, bukan otomatis dari skema database. Jika prototype tidak memperlihatkan UI pengeditan blok umum, implementasikan editor **terbatas pada blok yang sudah dipakai**, bukan Page Builder generik tak terbatas.

### 5.3 Grup "Operasional Klien"
Rilis 1: Quote Kalkulator, Inquiry/Pemesanan, Booking Konsultasi. Rilis 2: proyek klien, pembayaran, timeline, dokumen, revisi, komentar, persetujuan, template tahap.

| Menu | Fungsi |
|---|---|
| **Quote Kalkulator** | Daftar/sort/filter status, detail perhitungan resmi, tombol WhatsApp |
| **Inquiry / Pemesanan** | Daftar, filter, catatan, WhatsApp, konversi jadi proyek klien di Rilis 2 |
| **Booking Konsultasi** | Filter, konfirmasi dengan `meetingUrl`, WhatsApp, jadwal mingguan dan blocked dates |
| **Proyek Klien** | CRUD proyek, kode+PIN (tampil sekali), regenerasi PIN + `pinVersion`, tahapan/milestones, pembayaran/dokumen/revisi/komentar/persetujuan melalui tab/relasi, visibility toggles, review, WA tracking, jadikan portofolio |
| **Pembayaran, Timeline, Dokumen, Revisi, Komentar, Persetujuan** | Query lintas proyek, filter, aksi tersetujui di service; diutamakan mengelola dari detail proyek |
| **Template Tahap** | Edit enam tahap dan checklist bawaan |

### 5.4 Grup "Sistem", Role & Kebijakan Izin
| Menu | Fungsi |
|---|---|
| **Pengguna** | Akun admin, role, aktivasi/ulang 2FA dan recovery (hanya `owner`); operasi sensitif dicatat |
| **Log Aktivitas** | `audit-logs`, baca saja oleh `owner` |
| **Berkas Privat** (Rilis 2) | `private-files`, hanya `owner`, signed download |

| Role | Akses |
|---|---|
| `owner` | Semua modul dan operasi administratif, termasuk pengelolaan akun; log audit tetap append-only |
| `editor` | Hanya Konten Website; tidak boleh akses data klien, grup Sistem, atau tab Settings `whatsapp`/`tracking` |

Fungsi kebijakan tersentral di `src/access`, **deny by default**. Pengujian Vitest wajib menguji matriks role × entitas × operasi × field; E2E membuktikan pemaksaan di URL/Server Action/Route Handler dan bukan hanya menyembunyikan menu.

### 5.5 Template WhatsApp (editable)
Placeholder: `{nama}`, `{referensi}`, `{platform}`, `{rincian}`, `{estimasi_harga}`, `{estimasi_durasi}`, `{tanggal}`, `{jam}`, `{meeting_url}`, `{kode_tracking}`, `{link_tracking}`, `{nama_proyek}`, `{judul_revisi}`, `{sisa_kuota}`. Placeholder asing ditolak oleh **skema Zod/service penyimpanan Settings** memakai `lib/whatsapp` yang juga menghasilkan URL `wa.me`. Seluruh pesan di-URL-encode, nomor dinormalisasi `08...` -> `628...` (Lampiran F.3).

### 5.6 Aksi "Jadikan Proyek Portofolio" (Rilis 2)
1. Proyek klien dengan tahap 6 `done` yang belum terkait `projects` muncul di dashboard Perlu Tindakan.
2. Aksi owner memanggil Server Action/service yang **dalam satu transaksi** membuat `projects` draft dan menghubungkan `client-projects.project`; judul, kategori, tahun, link produksi boleh disalin.
3. Admin mengonfirmasi izin klien; `clientName` hanya disalin jika izin dicentang.
4. Data sensitif (WA, email, biaya, PIN, pembayaran, catatan internal) tidak ikut disalin.
5. Admin menyelesaikan gambar, konten, SEO, teknologi, lalu mempublikasikan secara manual.

### 5.7 Pekerjaan Custom yang Wajib diimplementasikan
Tidak ada fitur CRUD, editor, bulk action, drag-and-drop, draft, trash, preview, versi, atau audit yang otomatis muncul hanya karena memakai Drizzle. Semuanya harus dikembangkan sesuai ruang lingkup prototype dan acceptance criteria:
* Layout dashboard, sidebar, tabel, filter, form, detail, settings, media library, state, responsivitas.
* CRUD dan kebijakan setiap entitas (Zod, FK, constraint, transaksi, audit, invalidasi cache).
* Draft/publish, preview token, versi konten, trash/restore, reorder, duplicate dengan slug aman, bulk action bila diperlukan.
* Login owner/editor, 2FA wajib, recover/reset TOTP, lockout, manajemen pengguna.
* Aksi WhatsApp, Booking Konfirmasi, Generate/Ganti PIN, Buka/Tutup Review, proses Revisi, Jadikan Proyek Klien/Portofolio.
* Uji akses/IDOR/XSS/CSRF/concurrency/E2E untuk jalur admin.

**Penyederhanaan yang disetujui:** jangan membuat CMS generik atau layout/editor yang tidak dipakai di prototype. Jika ada modul bisnis yang belum tergambar, ikuti kebutuhan fungsional PRD tanpa menciptakan design system baru; dokumentasikan UI pendukungnya sebelum implementasi.

---

## 6. Persyaratan Non-Fungsional

### 6.1 Performa
* LCP maksimal **1,8 detik** pada 4G untuk beranda dan detail proyek (target uji, bukan jaminan). Halaman konten bisa di-cache Next.js dan di-revalidate setelah mutasi admin.
* `settings`, halaman, proyek, harga dan kalkulator memakai cache/tag yang didukung Next.js terpilih; invalidasi dilakukan service admin setelah commit dan diuji E2E.
* Gambar WebP diproses `sharp` saat finalisasi media R2, `next/image` dengan `sizes` responsif; lazy kecuali di atas lipatan; font via `next/font`.
* JS browser hanya untuk interaksi; modul dashboard custom tidak ter-bundle pada rute publik. Pisahkan import server-only dan komponennya.
* Query Drizzle mengambil kolom seperlunya, indeks, join/prefetch efisien, hindari N+1; review dan pagination untuk tabel admin.
* Neon pooled untuk serverless; rute dinamis dapat cold start, cache konten publik mengurangi akses DB. Uji batas memori untuk `sharp` dan unggahan R2.
* Produksi memakai hosting tanpa spin-down yang merusak pengalaman (7.7).

### 6.2 Keamanan
* **Permukaan API minimal:** tidak ada CRUD REST/GraphQL otomatis. Server Action & Route Handler admin dan publik harus memiliki kebijakan akses eksplisit dan pembatasan input/output. Tabel/DB hanya dapat diakses server.
* **Admin auth & 2FA:** Better Auth untuk login/sesi, 2FA TOTP wajib bagi **`owner` dan `editor`**; setiap aksi memeriksa fase 2FA selesai. Pengguna dibatasi owner, recovery TOTP dan reset owner memakai alur yang diaudit. Akun dikunci setelah **5 upaya login gagal dalam 15 menit**; uji juga upaya TOTP salah. Cookie `secure` di produksi, `httpOnly`, `sameSite`, masa sesi terbatas.
* **CSRF & Origin:** gunakan perlindungan origin/cookie bawaan Next.js/Better Auth yang benar-benar terverifikasi untuk Server Actions dan Route Handlers; untuk endpoint mutasi, tolak request lintas-origin dan uji CSRF; jangan mengandalkan `sameSite` saja.
* **XSS:** React meng-escape teks; render editor Lexical hanya untuk node valid yang diizinkan dan URL aman (`https`, `http`, `mailto`, `tel`); HTML mentah disanitasi. Komentar/revisi user selalu sebagai teks biasa.
* **SQL injection:** Drizzle dan raw SQL berparameter; input pengguna **tidak** dirangkai ke SQL. DDL manual hanya dalam migrasi.
* **Rate limit atomik:** tabel `rate-limits` untuk login admin/tracking, form dan komentar/revisi. **Form publik maksimal 5 kirim/15 menit/IP**; IP dibaca hanya dari proxy/header terpercaya sesuai hosting. Login tracking dibatasi sesuai 4.7.
* **Field-level security:** `accessPinHash`, rahasia auth, token, data internal, dan atribut yang tidak terlihat klien tidak dipilih dalam DTO publik. Periksa IDOR per operasi dan per id proyek. Audit append-only.
* **Upload:** whitelist MIME + ekstensi, verifikasi byte/file aktual, batas ukuran, tanpa SVG user, signed URL pendek, finalisasi wajib, bucket privat dan signed download; `nosniff`, `attachment` untuk unduhan privat.
* **Header/CSP:** CSP sesuai kebutuhan prototype dan editor (tanpa pengecualian berlebihan), X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS, `frame-src` terbatas untuk video; proteksi `/admin` dan `/tracking` dengan `noindex`.
* **Anti-spam:** Turnstile dan honeypot diverifikasi server.
* **Secrets:** env platform/GitHub secrets; hanya variabel yang sengaja publik memakai `NEXT_PUBLIC_`; validasi `env.ts` pada startup.
* **Supply chain:** `pnpm audit` di CI, versi dikunci setelah Fase 0, pembaruan dievaluasi; backup/restore pada 7.5.

### 6.3 Privasi & Kepatuhan (UU PDP)
* Halaman Kebijakan Privasi editable (draf awal: Lampiran E); checkbox persetujuan pada form booking, inquiry, dan kalkulator (`consentAt` tersimpan).
* IP disimpan sebagai hash bersalt (`IP_HASH_SALT`), bukan mentah.
* **Retensi data: diputuskan belakangan.** Untuk sementara tidak ada penghapusan atau anonimisasi otomatis. Kolom `archivedAt` disiapkan, dan skrip retensi (`pnpm retention:run`, dijalankan manual) disiapkan tetapi **dinonaktifkan** sampai kebijakan final ditetapkan (usulan awal: 24 bulan, dapat diubah di Settings). Tanpa penjadwal, penghapusan memang tidak berjalan otomatis.
* Klien dapat meminta penghapusan data lewat kontak yang tertera di kebijakan privasi.

### 6.4 SEO & OpenGraph
* Metadata API Next.js: judul/deskripsi dinamis dan `canonical` per halaman dan proyek; OG image dari field `meta.ogImage` atau `featuredImage` (atau pembangkit gambar OG bawaan Next.js); `sitemap.xml` dan `robots.txt` dinamis.
* JSON-LD Schema.org `ProfessionalService`, `Person`, dan `CreativeWork` pada detail proyek.
* Halaman `/tracking*` dan `/admin*` ber-`noindex` (metadata dan header `X-Robots-Tag`).
* Domain staging/preview selalu `noindex`.

### 6.5 Responsivitas & Aksesibilitas
* *Mobile-first*: 360px, 768px, 1024px, 1440px+.
* Tampilan hasil implementasi prototype memenuhi WCAG AA (uji kontras pada warna yang benar-benar dipakai), teks alternatif gambar (`alt` wajib pada `media`), navigasi keyboard, label form jelas, fokus terlihat, dan target sentuh yang memadai. Persyaratan aksesibilitas tetap berlaku untuk visual dalam prototype.

### 6.6 Lokalisasi
* Locale `id`, zona waktu tampilan `Asia/Jakarta`, tanggal "19 Oktober 2026", Rupiah tanpa desimal pada tampilan, semua pesan validasi (zod) dan error dalam bahasa Indonesia.
* Panel admin **custom berbahasa Indonesia** sesuai prototype; label, validasi, dialog, tabel, state kosong/error, dan informasi 2FA diterjemahkan oleh aplikasi. Tidak bergantung pada paket terjemahan CMS.

### 6.7 Observabilitas
* Sentry (`@sentry/nextjs`) untuk error server dan klien, log aplikasi ke stdout (retensi log platform terbatas, jadi Sentry adalah catatan utama), *uptime monitor* eksternal pada beranda (statis, tidak menyentuh database) dan `/health` (memeriksa database).
* Interval pemantauan `/health` diset secukupnya (mis. >= 5 menit) dan pemakaian compute Neon dipantau, karena pemeriksaan yang terlalu sering membuat Neon tidak pernah *suspend* dan menghabiskan jatah gratis.

---

## 7. Deployment & Operasional

### 7.1 Layanan
| Layanan | Platform | Catatan |
|---|---|---|
| Aplikasi Next.js (publik + admin custom + endpoint) | **Pengembangan/staging: Vercel Hobby; produksi: diputuskan sebelum Rilis 1** | Satu deployment; variabel per lingkungan; migrasi Drizzle dijalankan sebelum rilis aktif |
| Scheduler/worker | **Tidak dipakai** | Jam publikasi dicek saat render; backup di GitHub Actions; tidak ada queue |
| Database | Neon PostgreSQL | Region Singapura, branch `main` (produksi), `dev` (staging) |
| Backup | GitHub Actions | `pg_dump` terenkripsi setiap hari ke R2 terpisah, uji restore |
| Storage | Cloudflare R2 | Bucket publik Rilis 1; bucket privat Rilis 2 |
| Domain/SSL | Belum ada, wajib sebelum Rilis 1 | TLS otomatis platform |

### 7.2 Variabel Lingkungan Utama
`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (URL origin auth per lingkungan; samakan dengan `SITE_URL`), `SITE_URL`, `DATABASE_URI` (pooled untuk runtime), `DATABASE_URI_DIRECT` (untuk Drizzle Kit/backup), `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_PUBLIC`, `R2_BUCKET_PRIVATE` (Rilis 2), `R2_PUBLIC_BASE_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `SENTRY_DSN`, `IP_HASH_SALT`, `TRACKING_SESSION_SECRET` (Rilis 2), `WA_DEFAULT_NUMBER`, `TRUSTED_IP_HEADER`. Validasi oleh Zod `env.ts`. Pengaturan auth dan cookie disesuaikan dengan domain staging/produksi yang sah.

### 7.3 Pipeline
1. PR CI: `pnpm lint`, `pnpm typecheck`, `pnpm check:portability`, uji schema/validasi dan akses, migrasi Drizzle dari database kosong, Vitest, Playwright (admin/website), `pnpm audit`.
2. Generate migrasi dengan `drizzle-kit generate` saat mengubah `src/db/schema/*`; **review file SQL dan commit**. CI memeriksa schema drift dengan cara yang diuji pada Fase 0.
3. Deploy dari `main`: instal lockfile, `pnpm build` (Next.js), jalankan `pnpm db:migrate` via `DATABASE_URI_DIRECT` sebagai **langkah terpisah sebelum rilis aktif**; jangan migrasi database produksi dari preview/staging.
4. Perubahan skema produksi memakai migrasi expand/contract agar kompatibel dengan versi aplikasi saat rolling deploy. Untuk SQL kustom (mis. booking exclusion constraint), pastikan migrasi idempoten menurut mekanisme migrator dan dapat di-restore.
5. Seed (`pnpm seed`) manual hanya untuk lingkungan baru, idempotent.

### 7.4 Lingkungan
`local` (Docker Compose untuk Postgres lokal atau branch Neon pribadi; `next dev`), `staging` (Vercel Hobby + Neon branch `dev`, data dummy, `noindex`), `production`.

### 7.5 Cadangan & Pemulihan
* Fitur *restore/branch* Neon dibatasi jendela retensi paket (6 jam di paket gratis), jadi **cadangan utama adalah `pg_dump` harian** lewat GitHub Actions, dienkripsi, dan diunggah ke bucket R2 terpisah dengan aturan lifecycle (mis. hapus setelah 30 hari).
* Aktifkan *versioning* atau salinan berkala pada bucket R2 konten.
* Uji pemulihan (termasuk memastikan kendala eksklusi booking ikut terpulihkan) minimal sekali sebelum peluncuran, lalu tiap kuartal. Targetnya: RPO <= 24 jam, RTO <= 4 jam.

### 7.6 Rencana Domain
Status: **belum punya domain**. Ini tidak menghalangi pengembangan, tetapi domain wajib ada sebelum Rilis 1.

| Tahap | Alamat yang dipakai |
|---|---|
| Fase 0-4 (pengembangan, staging) | Domain bawaan platform (mis. `https://<nama-proyek>.vercel.app`); bucket R2 lewat `r2.dev` (khusus uji; ada batas laju dan tidak untuk produksi) |
| Sebelum Rilis 1 (Fase 5) | Domain sendiri untuk situs, dan subdomain (mis. `assets.<domain>`) untuk bucket R2 |

Langkah pemasangan setelah domain dibeli:
1. Tambahkan domain ke Cloudflare (DNS), lalu arahkan domain utama ke platform hosting produksi sebagai *custom domain* (TLS otomatis).
2. Hubungkan bucket publik R2 ke subdomain, lalu matikan akses `r2.dev`.
3. Perbarui `SITE_URL`, `R2_PUBLIC_BASE_URL`, hostname Turnstile, `images.remotePatterns` Next.js, canonical/sitemap/OG, dan tautan pada template WhatsApp.
4. Kirim link tracking ke klien **hanya setelah** domain produksi aktif, agar tautan yang sudah dibagikan tidak berubah.
5. Karena situs dan admin satu origin, tidak ada konfigurasi CORS lintas-domain yang diperlukan.
6. Opsional kemudian: alamat email berdomain sendiri sebagai alias penerus ke Gmail.

Pilihan ekstensi: `.com`/`.id` (lebih dipercaya, lebih mahal) atau `.my.id`/`.web.id` (jauh lebih murah). Cek harga di registrar saat membeli.

### 7.7 Kebijakan Hosting & Portabilitas

**Keputusan saat ini:** selama pengembangan dan pengujian (Fase 0-4) aplikasi di-host di **Vercel Hobby**. Paket Hobby dibatasi untuk penggunaan pribadi non-komersial; **situs yang sudah live dan dipakai bisnis OpenByte Labs tidak boleh tetap di Hobby**. Hosting produksi diputuskan sebelum Rilis 1.

**Opsi hosting produksi** (harga indikatif per Oktober 2026; verifikasi ulang saat memutuskan):
| Opsi | Kelebihan | Catatan |
|---|---|---|
| Vercel Pro | Next.js dan revalidasi bertag berjalan paling mulus; preview deploy | Berbayar per pengguna per bulan ditambah pemakaian |
| Render (instance berbayar terkecil) | Proses selalu hidup (tanpa serverless), biaya tetap rendah | Memori instance kecil mungkin tidak cukup untuk Next.js + pemrosesan gambar; **uji di Fase 0**; cache revalidasi berada di satu instance |
| VPS/Docker (mis. Coolify) | Murah, proses persisten penuh | Operasi server menjadi tanggung jawab sendiri |
| Render free | Gratis | **Tidak untuk produksi**: tidur setelah 15 menit idle dan butuh sekitar satu menit untuk bangun; hanya untuk uji |

**Aturan portabilitas (wajib dipatuhi sejak Fase 0):**
* Tidak memakai Vercel Blob, KV, Edge Config, Cron, atau paket `@vercel/*`; storage selalu R2, database selalu Neon dengan Drizzle dan driver Postgres netral-hosting.
* Tidak ada pekerjaan latar atau cron; bila kelak dibutuhkan, itu pemicu pindah ke hosting dengan proses persisten.
* Konfigurasi platform (header IP klien, URL, variabel) dibaca dari environment, bukan di-hardcode.
* Build dan migrasi dapat dijalankan dari CI dengan perintah biasa (`pnpm build`, `pnpm db:migrate`).
* `Dockerfile` cadangan disiapkan dan diuji sekali sehingga aplikasi dapat berjalan di host Node/Docker mana pun.
* Keputusan hosting produksi dicatat di 12.1 setelah diputuskan.

---

## 8. Data Awal (Seeder)

Seeder (`pnpm seed`, skrip TypeScript dengan Drizzle) mengisi data awal; **setelah itu semuanya dikelola dari admin** (diedit, diganti, atau dihapus). Seeder **idempotent**: memakai *upsert* berdasarkan `slug`/`reference`/kunci alami, sehingga aman dijalankan ulang tanpa menimpa suntingan pemilik dan tidak menggandakan data. Seeder tidak pernah dijalankan otomatis pada produksi; hanya manual pada lingkungan baru.

### 8.1 Kategori Awal
Instansi / Pemdes; Aplikasi Mobile (Flutter); Bisnis & UMKM; Undangan Digital & Event.

### 8.2 Proyek Awal
| Proyek | Kategori | Stack | Sorotan |
|---|---|---|---|
| SINDUKSADATI (Satu Data RW 06 Mojorejo) | Instansi / Pemdes | Next.js 14, PostGIS 3, InsForge (Postgres), Leaflet GIS, QR Surat | Peta batas wilayah RT/RW, Citizen 360, otomasi permohonan surat warga |
| SIPANDU / Posyandu (Flamboyan RW 06) | Instansi / Pemdes | React 18 SPA, Vite, InsForge SDK, Vitest | Alur 5-Meja Kemenkes, kalkulator Z-Score WHO 2006, deteksi dini stunting (2T) |
| HIPPAM Web & Mobile | Instansi / Pemdes + Aplikasi Mobile | Next.js 16, Flutter 3.x (Dart), Supabase PostgreSQL, RLS | Pembacaan meter air swadaya, kompresi foto meteran, tarif berjenjang |
| UMKM-KU | Bisnis & UMKM | React Router v7, Neon Serverless Postgres, AWS S3 | Direktori UMKM warga, verifikasi NIK SINDUKSADATI, checkout via WhatsApp |
| Terapis Jogoroto (Pijat Akupresur STPT) | Bisnis & UMKM | HTML5 Semantic, Modern CSS, WhatsApp Direct Booking | Landing page luxury warm gold, badge rating 5.0, alur terapi 5 langkah |
| Prewed (Undangan Digital Fajar & Fifi) | Undangan Digital & Event | HTML5 Canvas Petal Animation, Web Audio API, Sheet RSVP Sync | Amplop 3D wax-seal, musik saxophone, RSVP terhubung spreadsheet |

Status awal `published`. Gambar utama diunggah pemilik setelah seeder berjalan. Karena `featuredImage` wajib saat publish, seeder membuat proyek sebagai **draft** bila belum ada gambar, dan pemilik mem-publish setelah mengunggah gambar.

### 8.3 Data Awal Lain
* **Paket, add-on, kalkulator**: lihat 8.4 (harga awal setara freelancer junior; semua dapat diubah di dashboard admin).
* **Kontak & kebijakan**: lihat 8.5 dan Lampiran C.
* **Konten teks**: seluruh teks awal (hero, layanan, Tentang, FAQ, meta, ringkasan proyek) dari Lampiran D. Konten yang masih memuat `[ISI]` dibuat sebagai draft dan tidak boleh dipublikasikan.
* **Jadwal booking**: Senin-Jumat dengan rentang 09:00-11:00, 13:00-15:00, 16:00-18:00, 19:30-21:30 WIB; durasi slot 60 menit, jeda 0, `minDaysAhead` 1, `maxDaysAhead` 30 (Lampiran F.2).
* **Template Tahap** (Rilis 2): enam tahap pada 4.7 beserta checklist standar.
* **Template WhatsApp**: teks bawaan untuk kalkulator, pemesanan, konfirmasi booking, link tracking, dan notifikasi revisi (Lampiran A).
* **Layanan unggulan**: empat item konten pada 4.2; tata letak sesuai prototype.
* **Pengguna awal**: satu akun `owner`, dibuat lewat skrip `pnpm owner:create` (kata sandi diminta interaktif, tidak ditulis di seeder atau repositori), lalu 2FA diaktifkan pada login pertama.

### 8.4 Harga Awal (Rupiah bulat; kisaran umum freelancer junior, semua editable)

**Paket Layanan**
| Paket | Kategori | Harga | Durasi | Revisi termasuk | Biaya revisi tambahan |
|---|---|---|---|---|---|
| Starter UMKM & Bisnis | Bisnis & UMKM | 1.000.000 | 7 hari kerja | 2x | 100.000 |
| Sistem Informasi / Instansi | Instansi / Pemdes | 3.500.000 | 21 hari kerja | 3x | 250.000 |
| Mobile Application (Flutter) | Aplikasi Mobile | 4.500.000 | 30 hari kerja | 4x | 300.000 |

Fitur awal: **Starter** (landing/profil hingga 5 halaman, responsif, tombol WhatsApp, SEO dasar, setup domain & hosting); **Sistem Informasi** (database terintegrasi, multi-role, dashboard, ekspor laporan); **Mobile** (Android native-feel, penyimpanan offline, kamera, integrasi API). Biaya domain dan hosting pihak ketiga ditanggung klien.

**Add-on**
| Add-on | Harga | Penagihan |
|---|---|---|
| Maintenance bulanan (bug fix, update minor, backup) | 150.000 | per bulan |
| Maintenance tahunan | 1.500.000 | per tahun |
| Pelatihan admin (1 sesi, hingga 2 jam, online) | 250.000 | sekali bayar |
| Setup domain & hosting (di luar paket Starter) | 200.000 | sekali bayar |

**Kalkulator** (harga min - maks; hari tambahan min - maks)
| Grup | Item | Harga | Hari | Catatan |
|---|---|---|---|---|
| Platform (single, wajib) | Web Saja (default) | 0 | 0 | |
| | Mobile Android Saja (Flutter) | 1.500.000 - 2.500.000 | 10 - 14 | |
| | Web + Android (Flutter) | 2.500.000 - 4.000.000 | 14 - 21 | |
| Jenis Solusi (single, wajib) | Landing Page Profil | 600.000 - 1.200.000 | 3 - 5 | `excludes` kedua opsi Android |
| | Katalog & Toko Online (checkout WhatsApp) | 1.500.000 - 2.500.000 | 7 - 10 | |
| | Sistem Informasi Database | 2.500.000 - 4.000.000 | 14 - 21 | |
| | Undangan Digital | 400.000 - 1.000.000 | 2 - 4 | `excludes` kedua opsi Android |
| Modul Tambahan (multiple, opsional) | Multi-User RBAC | 500.000 - 1.000.000 | 2 - 3 | `requires` Sistem Informasi |
| | Pemetaan Wilayah (GIS & Geolocation) | 1.000.000 - 2.000.000 | 4 - 6 | `requires` Sistem Informasi |
| | Cetak Laporan (PDF & Excel) | 400.000 - 800.000 | 2 - 3 | `requires` Sistem Informasi |
| | Notifikasi / Gateway WhatsApp Otomatis | 500.000 - 1.000.000 | 2 - 3 | biaya gateway pihak ketiga terpisah |
| | Integrasi Pembayaran (QRIS / Payment Gateway) | 700.000 - 1.500.000 | 3 - 5 | |
| | Halaman Tambahan (`per_unit`, maks. 20) | 75.000 - 150.000 per halaman | 0 | |

Harga minimum kalkulator (Settings): **Rp 500.000**. Setelah 3-5 proyek pertama, harga ditinjau ulang berdasarkan jam kerja nyata.

### 8.5 Nilai Awal Settings
| Field (`site-settings`) | Nilai |
|---|---|
| `general.brandName` | `OpenByte Labs` |
| `general.whatsappNumber` | `0895386011371` (disimpan apa adanya, dinormalisasi ke `62895386011371` untuk tautan `wa.me`) |
| `general.contactEmail` | `izzatfarahidi@gmail.com` (hanya ditampilkan sebagai kontak; sistem tidak mengirim email) |
| `tracking.revisionPolicy` | teks pada Lampiran C |
| `tracking.revisionWindowDays` / `tracking.bugWarrantyDays` | 14 hari / 30 hari (usulan, dapat diubah) |

---

## 9. Acceptance Criteria

### 9.1 Dashboard Admin Custom & Konten
- [ ] Mengubah headline hero, trust metrics, menu, dan footer di Site Settings langsung tampil di beranda tanpa deploy ulang (revalidasi bertag).
- [ ] Menambah, menyembunyikan, dan mengurutkan ulang blok beranda dari admin berfungsi.
- [ ] Proyek `draft` tidak tampil di publik; proyek tanpa gambar utama tidak bisa di-publish; proyek dengan `publishedAt` di masa depan belum tampil.
- [ ] Proyek dengan dua kategori tampil di kedua tab filter; tab filter mengikuti kategori di admin.
- [ ] Mengganti urutan proyek lewat drag-and-drop mengubah urutan di publik.
- [ ] Gambar yang diunggah tersedia dalam WebP dan **tetap ada setelah redeploy** (tersimpan di R2); unggahan dari admin tidak terbentur batas ukuran body platform.
- [ ] Seluruh dashboard admin Rilis 1 mengikuti prototype dashboard (layout, sidebar, tabel, form, filter, modal, state loading/empty/error serta responsivitas) dan seluruh data aktual tersambung ke database.
- [ ] Teks WA dapat diubah di Settings; placeholder tidak dikenal ditolak.
- [ ] Pratinjau draft (Draft Mode) menampilkan perubahan yang belum dipublikasikan hanya untuk admin yang login.
- [ ] Tidak ada konten terbit yang masih memuat `[ISI]`; semua klaim di halaman publik dapat dibuktikan (tanpa testimoni atau angka karangan).
- [ ] Halaman publik desktop dan mobile diimplementasikan sesuai prototype full-page pemilik; tanpa memakai aturan visual lama yang tidak ada di prototype. State loading/error/empty/validasi berfungsi, navigasi keyboard dan fokus terlihat, serta warna aktual lulus pemeriksaan kontras WCAG AA.

### 9.2 Kalkulator, Paket, Booking
- [ ] Mengubah harga item di admin mengubah hasil kalkulator publik (setelah revalidasi `calculator`).
- [ ] Item `excludes`/`requires` bekerja; grup wajib divalidasi; hasil tidak di bawah harga minimum.
- [ ] Manipulasi nilai harga di browser tidak mempengaruhi `quote-requests` (dihitung ulang server dari database).
- [ ] **Uji paritas:** modul kalkulator menghasilkan angka identik di browser dan server untuk seluruh kombinasi uji, dan seluruh vektor Lampiran F (F.1-F.6) lulus sebagai fixture Vitest.
- [ ] Dua pengunjung tidak bisa memesan slot yang sama maupun slot yang tumpang tindih (uji balapan e2e lolos berkat kendala eksklusi); pesan "slot baru saja terisi" tampil.
- [ ] Tanggal di luar rentang minimal/maksimal dan tanggal terblokir tidak bisa dipilih; jam tampil dalam WIB walau zona waktu perangkat berbeda.
- [ ] Nomor WhatsApp tidak valid ditolak; `08...` dinormalisasi ke `628...`.

### 9.3 Tracking, Revisi, Persetujuan (Rilis 2)
- [ ] Kode/PIN salah menghasilkan pesan generik; 5 kegagalan mengunci kode 15 menit.
- [ ] Sesi tracking hanya bisa mengakses satu proyek dan kedaluwarsa sesuai pengaturan.
- [ ] **Mengganti PIN di admin langsung mencabut sesi tracking yang masih aktif** (`pinVersion`).
- [ ] Toggle visibilitas (staging, GitHub, pembayaran, dokumen) menyembunyikan elemen dari klien.
- [ ] `currentStep` tidak bisa diedit manual (dari admin maupun API) dan selalu sesuai `steps`; `paidAmount` sama dengan jumlah `payments`, termasuk setelah pembayaran dihapus.
- [ ] Revisi dalam kuota berstatus `accepted` mengurangi sisa kuota; revisi `rejected` tidak.
- [ ] Saat kuota habis, pengajuan menjadi `needs_payment`, klien melihat biaya, dan `totalCost` hanya bertambah setelah admin menerima.
- [ ] Mengubah kuota di paket **tidak** mengubah `revisionsIncluded` proyek lama.
- [ ] Transisi status revisi yang tidak sah ditolak oleh mesin status.
- [ ] Klien tidak bisa mengajukan revisi/menyetujui bila `isReviewOpen = false`.
- [ ] Persetujuan mencatat nama, waktu, IP ter-hash, dan memerlukan PIN ulang; catatan persetujuan tidak dapat diubah/dihapus dari admin maupun API.
- [ ] Komentar `isInternal` tidak pernah muncul di sisi klien; skrip yang dikirim lewat komentar tidak dieksekusi.
- [ ] Lampiran yang melanggar tipe/ukuran ditolak atau dihapus; unduhan berkas privat hanya lewat URL bertanda tangan berumur pendek.
- [ ] Permintaan jenis `bug` tidak mengurangi kuota revisi.
- [ ] Proyek klien yang tahap 6-nya selesai muncul di panel "Perlu Tindakan" dengan tombol "Jadikan Proyek Portofolio".
- [ ] Aksi tersebut membuat proyek **draft** tanpa data sensitif klien; nama klien hanya terisi bila checkbox izin dicentang.
- [ ] Sistem tidak mengirim email apa pun; notifikasi tampil di panel dan tombol WhatsApp membuka `wa.me` dengan pesan terisi.

### 9.4 Keamanan & Operasional
- [ ] Login admin (`owner` dan `editor`) memerlukan 2FA sesuai keputusan D-05; role `editor` tidak bisa membuka data klien maupun tab Settings `whatsapp`/`tracking`.
- [ ] **Uji matriks akses:** tiap Server Action/Route Handler/service punya kebijakan eksplisit; anonim tidak dapat membaca/menulis entitas privat/operasional; tidak ada endpoint CRUD generik; `accessPinHash`, data auth, dan field internal tidak muncul di respons publik; uji IDOR lintas proyek dan bypass UI admin.
- [ ] Konten rich text dan tautan berskema berbahaya (`javascript:`) tidak dieksekusi; HTML mentah (bila ada) disanitasi.
- [ ] Header keamanan dan CSP aktif; `/tracking*` dan `/admin*` ber-`noindex`.
- [ ] Selama `trackingEnabled` mati, `/tracking*` mengembalikan 404 dan tidak muncul di navigasi, sitemap, maupun template WhatsApp.
- [ ] Deploy lewat push ke `main` menerapkan migrasi dengan koneksi direct sebelum rilis aktif; `/health` memeriksa koneksi database untuk uptime monitor.
- [ ] Pemulihan dari cadangan berhasil diuji sebelum Rilis 1 (termasuk kendala eksklusi booking).
- [ ] Aplikasi tidak mengimpor paket `@vercel/*` dan dapat dibangun serta dijalankan lewat `Dockerfile` cadangan (portabilitas hosting).
- [ ] LCP beranda <= 1,8 detik (uji Lighthouse/PageSpeed mobile, 4G).

---

## 10. Rencana Eksekusi (Roadmap)

```
[Fase 0: Re-baseline stack & audit prototype] -> [Fase 1: Skema Drizzle & Service]
  -> [Fase 2: Dashboard Admin Custom] -> [Fase 3: Website Publik]
  -> [Fase 4: Kalkulator, Paket, Booking] -> [Fase 5: QA & Rilis 1]
  -> [Fase 6: Portal Klien & Rilis 2]
```

| Fase | Rilis | Isi utama | Estimasi |
|---|---|---|---|
| 0 | 1 | Audit prototype **website + dashboard** dan semua state; scaffold Next.js tanpa CMS; pilih versi stabil Drizzle/Better Auth/Lexical; cek kompatibilitas, setup 2FA wajib, role, sesi tanpa email, Neon, signed upload R2 + finalisasi Sharp, CI, backup, Sentry, migrasi; tinjau ulang pekerjaan F0 lama | **Belum diestimasi ulang** |
| 1 | 1 | Definisi skema Drizzle Rilis 1 dan tabel auth/relasi/versi, Zod, service layer, access policy, transaksi, migrasi termasuk SQL booking, seed idempotent, test data & keamanan | **Belum diestimasi ulang** |
| 2 | 1 | **Bangun dashboard admin sesuai prototype**: auth & 2FA, sidebar/dashboard, settings, editor konten/proyek/paket/kalkulator, CRUD, media, preview/draft, versi, reorder, trash, audit, panel Perlu Tindakan, WA | **Belum diestimasi ulang** |
| 3 | 1 | Website publik mengikuti prototype, beranda, showcase, detail proyek, SEO/OG/JSON-LD, legal, cache/revalidasi | **Belum diestimasi ulang** |
| 4 | 1 | Kalkulator dan booking murni TS + uji, paket/inquiry, WA builder, Turnstile, rate limit, pencegahan double booking | **Belum diestimasi ulang** |
| 5 | 1 | Pilih hosting komersial dan domain, konten, QA kedua prototype + aksesibilitas, keamanan, uji beban, backup/restore, **Rilis 1** | **Belum diestimasi ulang** |
| 6 | 2 | Skema/fitur portal klien 3.6–3.8, PIN, tracking, pembayaran, revisi, approval, dokumen privat, admin custom Rilis 2; QA keamanan dan **Rilis 2** | **Belum diestimasi ulang** |

**Catatan estimasi:** angka v1.4.1 (28–41 hari kerja sampai Rilis 1, 39–55 sampai Rilis 2) berasal dari asumsi banyak modul admin disediakan Payload. Angka itu **tidak lagi berlaku** setelah keputusan dashboard custom. Setelah audit prototype Fase 0, buat estimasi baru berbasis jumlah layar, tabel, editor, interaksi, dan test case. **Jangan menyimpulkan menghapus CMS otomatis mempersingkat pengerjaan.**

**Alasan rilis bertahap:** website agensi bisa menerima inquiry sebelum portal klien selesai. Fase 6 dimulai sebelum klien pertama memerlukan review/approval.

### 10.1 Kriteria Selesai per Fase
| Fase | Selesai bila |
|---|---|
| 0 | App berjalan local/staging, skema Drizzle berhasil migrasi dari kosong; role `owner`/`editor` dapat login hanya setelah 2FA; sign upload R2 + finalisasi WebP teruji; setup CI, backup+restore, Sentry, Docker, hasil verifikasi 12.3 terdokumentasi; prototype publik+admin dipetakan ke daftar layar/interaksi |
| 1 | Semua entitas Rilis 1 beserta FK/indeks/constraint/versi ada; uji matriks akses, migrasi, seed dua kali, race booking F.7 lulus; kode server tidak memanggil package CMS lama |
| 2 | CRUD/settings/preview/versioning/media berjalan dari admin custom sesuai prototype desktop/mobile; `editor` tidak dapat akses operasi terlarang, termasuk lewat URL dan request langsung; owner dapat recovery 2FA, log audit terisi |
| 3 | Website publik sesuai prototype di desktop/mobile; SEO valid; konten admin terefleksi dalam <= 60 detik; pengukuran LCP/kontras terpenuhi |
| 4 | Seluruh AC 9.2 dan fixture Lampiran F lulus; Turnstile, WA, rate limit dan kendala booking teruji |
| 5 | AC 9.1, 9.2, 9.4 Rilis 1 lulus produksi; konten siap, domain+hosting aktif, restore diuji, sitemap diajukan, Rilis 1 dirilis |
| 6 | AC 9.3 lulus; IDOR/brute force/akses file privat/XSS/CSRF diuji; tracking diaktifkan; kebijakan revisi diperbarui, Rilis 2 dirilis |

---

## 11. Risiko & Asumsi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| UI dashboard custom dan editor konten dibuat dari nol | Lebih banyak form, state, validasi, dan pekerjaan QA daripada CMS generik | Audit prototype; batasi editor hanya kebutuhan nyata; estimasi ulang dan rilis bertahap |
| Drizzle hanya ORM (tidak menyediakan auth/CMS/RBAC) | Fitur kelola konten bisa terlewat | Persyaratan eksplisit 2.2, 3, 5; matriks akses & acceptance criteria wajib |
| Auth admin + 2FA Better Auth tidak sesuai flow tanpa email | Akses admin atau recovery gagal | Uji login, TOTP wajib, lockout, recovery dan reset owner pada Fase 0; implementasikan alur CLI terkontrol bila perlu |
| CRUD server atau route custom lupa cek izin | Kebocoran data admin/klien | Deny by default, pemeriksaan service dan E2E bypass UI/IDOR |
| Versi Next.js/Drizzle/Better Auth dan driver berubah | Kerusakan integrasi/migrasi | Kunci versi persis di Fase 0; audit release notes dan test sebelum upgrade |
| Migrasi Drizzle salah atau SQL kustom hilang | Kerusakan data/booking ganda | Review SQL dan uji migrate dari nol + restore + booking race; jangan `push` produksi |
| Konten blok/versi custom terlalu generik | Kompleksitas, pengerjaan lama | Pilih tipe blok & versi yang benar-benar diperlukan prototype; data berstruktur tervalidasi |
| Upload/finalisasi WebP sinkron ke R2 melebihi limit serverless | Upload gagal | Uji berkas besar saat Fase 0; limit MIME/ukuran; signed upload, proses sesuai kapasitas hosting |
| Vercel Hobby tidak untuk produksi komersial | Hosting bermasalah saat situs live | Pilih dan biaya hosting produksi sebelum Rilis 1 |
| Hosting & Neon cold start | Respons awal lambat | Cache halaman publik, pooled connection, pantau uptime tanpa ping terlalu sering |
| Cache Next.js beda antar hosting | Perubahan admin lambat terlihat | Uji invalidasi/revalidasi di hosting produksi |
| Rilis 2 memerlukan migrasi tabel tambahan | Migrasi berisiko | Skema Rilis 2 sudah didefinisikan logis; ekspansi aman tanpa downtime |
| Brute-force kode tracking/PIN | Akses tidak sah ke data klien | Hash PIN, signed session, lockout, rate limit, audit |
| Sengketa revisi dan persetujuan | Konflik klien | Snapshot kebijakan, kuota, approval append-only |
| Spam/PII | Beban admin & risiko UU PDP | Turnstile, rate limit, persetujuan, kebijakan privasi/retensi |
| Konten `[ISI]`, gambar, izin klien, domain belum siap | Rilis 1 tertunda | Lampiran D/H; konten paralel; beli domain sebelum live |
| Harga awal tidak cocok pasar | Permintaan/margin buruk | Harga editable melalui dashboard dan ditinjau setelah 3–5 proyek |

**Asumsi:** satu operator awal; pengembang memahami React/TypeScript; satu deployment Next.js, database Neon, storage R2. Tidak ada queue, email, atau layanan backend terpisah pada rilis ini.

---

## 12. Keputusan Pemilik & Item Tersisa

### 12.1 Keputusan
| # | Topik | Keputusan |
|---|---|---|
| 1 | Harga awal | Setara freelancer junior; nilai awal di 8.4, dapat diubah di dashboard admin kapan saja |
| 2 | Kuota revisi | Naik sesuai harga paket: 2 / 3 / 4 revisi; biaya tambahan Rp 100.000 / 250.000 / 300.000 |
| 3 | Kontak | WhatsApp 0895386011371; email izzatfarahidi@gmail.com |
| 4 | Domain | Belum punya; rencana pada 7.6 |
| 5 | Notifikasi admin | Panel admin + WhatsApp; tanpa email |
| 6 | Proyek selesai ke portofolio | Ya, diusulkan otomatis (5.6) |
| 7 | Retensi data | Ditunda; belum diaktifkan |
| 8 | **Stack (revisi 28 Oktober 2026)** | **Next.js + React + Tailwind CSS + Drizzle ORM/Kit + PostgreSQL Neon + Better Auth + Cloudflare R2**; website dan admin custom mengikuti prototype. **Tanpa Payload CMS dan tanpa NestJS** pada rilis ini |
| 9 | **Database & storage** | PostgreSQL di Neon; Cloudflare R2 (dua bucket) |
| 10 | **Hosting pengembangan** | Vercel Hobby sampai persiapan Rilis 1 |
| 11 | **Hosting produksi** | **Belum diputuskan**; wajib diputuskan sebelum Rilis 1 (7.7) |
| 12 | **Rilis bertahap** | Rilis 1: situs company, portofolio, kalkulator, paket, booking. Rilis 2: portal klien (tracking, revisi, persetujuan) |

### 12.2 Item Tersisa
Setiap item punya nilai bawaan di Lampiran H, sehingga pembangunan tidak tertahan.

1. Putuskan hosting produksi dan anggarannya sebelum Rilis 1 (7.7); hasil uji memori/build Fase 0 menjadi masukan.
2. Pilih dan beli domain sebelum Rilis 1 (7.6).
3. Tinjau ulang harga setelah 3-5 proyek pertama.
4. Tetapkan kebijakan retensi data sebelum ada data klien nyata dalam jumlah besar.
5. Konfirmasi teks kebijakan revisi (Lampiran C), terutama masa revisi 14 hari dan garansi bug 30 hari (usulan), sebelum Rilis 2.
6. Siapkan teks final Kebijakan Privasi sebelum Rilis 1.

### 12.3 Hasil Verifikasi dan Gerbang Teknis untuk Stack Baru (28 Oktober 2026)

**Status perubahan:** audit dan uji Fase 0 pada 26–27 Oktober 2026 sebelumnya berkaitan dengan integrasi CMS lama. Hasil tersebut **tidak boleh diasumsikan membuktikan** auth, query, migrasi, editor, upload, atau dashboard pada stack baru. Hasil uji PostgreSQL murni (contoh kendala eksklusi F.7) tetap relevan sebagai **hasil pengujian database**, tetapi wajib dijalankan ulang pada skema fisik Drizzle di Neon.

**Hal yang tetap menjadi baseline:**
* Target Next.js `16.4.3`, Sharp `0.35.5` hasil keputusan keamanan 27 Oktober 2026; lakukan audit baru sebelum install/build. Override transitive lama (`dompurify`, `happy-dom`) **hanya diterapkan jika masih ada dalam dependency tree dan terbukti memerlukan override**.
* Modul TS murni kalkulator, normalisasi WhatsApp, status revisi, rate limit dan vektor uji Lampiran F dapat dijadikan kontrak, bukan dianggap telah terintegrasi dengan service baru.
* Pemeriksaan `/health`, header `noindex` staging, dan workflow backup adalah pola arsitektur yang dipertahankan bila ada dalam repository; verifikasi ulang kompatibilitas saat porting.

**Wajib diverifikasi pada Fase 0 (semua berstatus BELUM untuk stack baru):**
| # | Pemeriksaan | Kriteria lulus |
|---|---|---|
| N-01 | Versi/kompatibilitas Node, Next.js, Drizzle ORM/Kit, driver PostgreSQL, Better Auth, React, Sharp, Lexical | Instalasi bersih, `pnpm-lock.yaml` terkunci, build + typecheck + audit lulus |
| N-02 | Better Auth: setup owner/editor, sesi 2FA wajib, lockout 5/15, recovery/CLI reset tanpa email | Uji unit/integrasi/E2E lulus; tidak ada jalur login yang melewati TOTP |
| N-03 | Skema Drizzle/Neon | Migrasi dari DB kosong, relasi/constraint, migrasi ulang aman, rollback/restore diuji |
| N-04 | Signed upload R2 dan Sharp | Upload langsung, finalisasi MIME/ukuran, varian WebP, penghapusan file invalid, URL publik/privat sesuai kebijakan |
| N-05 | Blok + versi konten + Draft Mode | Draft tak muncul publik, preview hanya bagi admin, publish tervalidasi, restore versi tercatat |
| N-06 | RBAC & access control | Matrix owner/editor/anonim melewati service/actions/routes, field privat tak terbaca, IDOR ditolak |
| N-07 | Cache/invalidation Next.js & hosting | Konten admin terlihat publik <= 60 detik tanpa deploy; staging/production tidak silang data |
| N-08 | Performa hosting & image processing | Build, cold start, memori, batas upload, dan ukuran fungsi layak; hasilnya dipakai memilih hosting |
| N-09 | Prototype website + dashboard | Inventaris halaman, modal, form, state dan interaksi; peta ke komponen/service & acceptance criteria |
| N-10 | CI, backup, restore & portability | Vitest, Playwright, migration, audit, Docker dan restore-verify berjalan, tanpa dependency CMS lama |

**Catatan transisi codebase jika Fase 0 lama sempat dikerjakan:** buat branch migrasi, audit dependency dan tabel yang sudah ada, lepas package/route/config CMS lama, definisikan skema baru via Drizzle, buat ulang tes terkait auth/admin/CRUD; jangan menganggap penghapusan dependency cukup atau mengubah database produksi tanpa rencana migrasi data. Tidak ada klaim bahwa migrasi kode telah dijalankan hanya karena PRD ini direvisi.

---

## Lampiran A: Template WhatsApp Bawaan

**Kalkulator** (`tplCalculator`)
```
Halo OpenByte Labs, saya {nama} tertarik membuat aplikasi dengan rincian berikut:
{rincian}
Estimasi Kalkulator: {estimasi_harga} ({estimasi_durasi})
Referensi: {referensi}
Mohon info ketersediaan jadwal pengerjaan. Terima kasih!
```

**Konfirmasi booking** (`tplBookingConfirm`)
```
Halo {nama}, konsultasi Anda pada {tanggal} pukul {jam} WIB sudah dikonfirmasi.
Link pertemuan: {meeting_url}
Referensi: {referensi}
```

**Link tracking** (`tplTrackingLink`)
```
Halo {nama}, proyek "{nama_proyek}" dapat dipantau di {link_tracking}
Kode Tracking: {kode_tracking}
PIN akan saya kirim terpisah.
```

**Notifikasi revisi** (`tplRevisionNotice`)
```
Halo {nama}, permintaan revisi "{judul_revisi}" sudah saya tinjau. Sisa kuota revisi: {sisa_kuota}.
Detail lengkap ada di halaman tracking proyek Anda.
```

(`tplPackageOrder` untuk pemesanan paket memakai pola yang sama dengan `{nama}`, `{platform}`/nama paket, dan `{referensi}`; teks finalnya dibuat pemilik di Settings.)

---

## Lampiran B: Definisi Status

| Entitas | Status | Arti |
|---|---|---|
| Proyek (showcase), Halaman | `draft` / `published` | Status dan versi konten custom; tampil jika `published` dan `publishedAt <= sekarang` |
| Inquiry, Quote | `new` / `contacted` / `converted` / `dropped` | Baru / sudah dihubungi / jadi proyek / batal |
| Booking | `pending` / `confirmed` / `completed` / `cancelled` | Menunggu / terkonfirmasi / selesai / dibatalkan |
| Tahap proyek | `pending` / `in_progress` / `done` | Belum / berjalan / selesai |
| Pembayaran (turunan) | `unpaid` / `down_payment` / `paid_off` | Belum bayar / DP / lunas |
| Revisi | `submitted` / `accepted` / `in_progress` / `done` / `rejected` / `needs_payment` | Lihat mesin status 4.8 |

---

## Lampiran C: Kebijakan Revisi Bawaan (editable di Settings, dapat ditimpa per paket)

1. **Satu (1) revisi** adalah satu putaran permintaan perubahan berisi maksimal 10 poin pada fitur atau tampilan yang sudah disepakati.
2. Revisi hanya dapat diajukan saat tahap **Review Klien** dibuka dan dalam **14 hari** sejak versi staging diserahkan.
3. Kuota revisi mengikuti paket. Revisi di atas kuota dikenakan biaya per revisi sesuai paket dan harus disetujui klien sebelum dikerjakan.
4. Perubahan di luar kesepakatan awal (fitur baru, modul baru, perubahan alur besar) dihitung sebagai **Change Request** dan ditawarkan dengan biaya terpisah.
5. Perbaikan **bug** (fitur tidak berjalan sesuai kesepakatan) tidak dihitung sebagai revisi dan tidak mengurangi kuota; garansi bug berlaku **30 hari** setelah serah terima.
6. Kuota dan biaya yang berlaku adalah yang tercatat pada proyek saat dibuat (*snapshot*), meskipun harga paket kemudian berubah.

---

## Lampiran D: Konten Awal (Bahasa Indonesia; usulan untuk seeder)

Seluruh teks ini diisi seeder sebagai nilai awal dan **dapat diubah dari dashboard admin**. Aturan:
1. Hanya klaim yang benar dan dapat dibuktikan; **tidak ada testimoni, angka klien, atau penghargaan karangan**.
2. Penanda **`[ISI]`** adalah data yang hanya diketahui pemilik. **Konten yang masih memuat `[ISI]` tidak boleh dipublikasikan** (kriteria di 9.1).
3. Angka pada metrik diperbarui bila fakta berubah.

### D.1 Meta Bawaan (`site-settings` tab `seo`)
* `defaultTitle`: `OpenByte Labs: Website, Aplikasi Mobile & Sistem Informasi` (maks. 60 karakter)
* `defaultDescription`: `Software house personal untuk website bisnis, aplikasi mobile Flutter, sistem informasi, dan undangan digital. Hitung estimasi biaya dan jadwalkan konsultasi.` (maks. 160 karakter)

### D.2 Hero
* `headline`: `Bangun sistem, aplikasi, dan website yang benar-benar dipakai.`
* `subheadline`: `OpenByte Labs membuat sistem informasi, aplikasi mobile Flutter, website bisnis, dan undangan digital untuk instansi, UMKM, dan komunitas.`
* `primaryCtaLabel`: `Hitung Estimasi Biaya` (menuju blok kalkulator)
* `secondaryCtaLabel`: `Chat via WhatsApp`
* `trustMetrics` (faktual, dari data yang ada): `6` / `Proyek di portofolio`; `4` / `Kategori solusi`; `3` / `Paket dengan harga jelas`

### D.3 Layanan Unggulan
| Judul | Deskripsi | Poin |
|---|---|---|
| Sistem Informasi & Satu Data | Sistem terpadu untuk data wilayah dan layanan publik: dari peta GIS sampai otomasi permohonan surat. | Peta wilayah RT/RW; Profil warga terpadu; Surat ber-QR |
| Aplikasi Mobile Lintas Platform | Aplikasi Android dengan Flutter, termasuk fitur kamera, penyimpanan offline, dan integrasi API. | Flutter; Kamera & offline; Integrasi API |
| Website Bisnis & UMKM | Landing page, profil usaha, dan katalog dengan pemesanan lewat WhatsApp. | Responsif; SEO dasar; Pesan via WhatsApp |
| Undangan Digital Interaktif | Undangan web dengan animasi, musik, dan RSVP yang terhubung ke spreadsheet. | Animasi; Musik latar; RSVP |

### D.4 Halaman Tentang (`pages` slug `tentang`)
* **Judul:** `Tentang OpenByte Labs`
* **Teks:** `OpenByte Labs adalah software house personal yang dijalankan oleh Muhammad Izzat Farahidi, Software Engineer & System Specialist. Kami mengerjakan sistem informasi, aplikasi mobile, dan website, mulai dari kebutuhan nyata di lapangan: data warga dan wilayah, layanan kesehatan Posyandu, pencatatan air swadaya, hingga usaha kecil. [ISI: satu paragraf tentang latar belakang dan pengalaman pemilik, mis. lama berkarya dan keahlian yang ingin ditonjolkan]. Setiap proyek dikerjakan dengan alur yang jelas, harga transparan, dan komunikasi lewat WhatsApp.`
* **Prinsip kerja (daftar):** `Harga jelas sejak awal.` / `Progres dapat dipantau.` (ditampilkan mulai Rilis 2) / `Kode dan data dikelola dengan aman.`

### D.5 FAQ
| # | Pertanyaan | Jawaban | Aktif |
|---|---|---|---|
| 1 | Berapa biaya membuat website atau aplikasi? | Biaya bergantung pada jenis solusi dan fiturnya. Gunakan kalkulator di beranda untuk estimasi awal, atau lihat tiga paket kami. Harga final ditetapkan setelah konsultasi kebutuhan. | Rilis 1 |
| 2 | Berapa lama pengerjaannya? | Perkiraan: 7 hari kerja (Starter), 21 hari kerja (Sistem Informasi), dan 30 hari kerja (Aplikasi Mobile), dihitung sejak kebutuhan dan materi lengkap. | Rilis 1 |
| 3 | Apakah domain dan hosting sudah termasuk? | Biaya domain dan hosting pihak ketiga ditanggung klien. Paket Starter sudah termasuk pemasangan awal; untuk paket lain, layanan setup tersedia sebagai add-on. | Rilis 1 |
| 4 | Berapa kali saya boleh meminta revisi? | Kuota revisi mengikuti paket: 2, 3, atau 4 kali. Revisi tambahan dikenakan biaya per revisi. Perbaikan bug tidak dihitung sebagai revisi. Rincian ada di kebijakan revisi. | Rilis 1 |
| 5 | Bagaimana alur pengerjaannya? | Enam tahap: kebutuhan dan kontrak, desain, coding, pengujian, review dan revisi, lalu deployment dan serah terima. | Rilis 1 |
| 6 | Bisakah saya konsultasi dulu? | Bisa. Pilih jadwal di halaman Konsultasi; sesi dapat lewat Google Meet, telepon WhatsApp, atau tatap muka. | Rilis 1 |
| 7 | Bagaimana pembayarannya? | Pembayaran lewat transfer, tunai, atau QRIS. Skema uang muka dan pelunasan disepakati dalam kontrak untuk setiap proyek. | Rilis 1 |
| 8 | Apakah tersedia perawatan setelah selesai? | Ya, sebagai add-on: maintenance bulanan atau tahunan (perbaikan bug, pembaruan kecil, dan backup). | Rilis 1 |
| 9 | Apakah data yang saya kirim aman? | Data dipakai hanya untuk menanggapi permintaan Anda dan dikelola sesuai Kebijakan Privasi. | Rilis 1 |
| 10 | Bagaimana saya memantau progres proyek? | Setelah proyek berjalan, Anda menerima kode tracking dan PIN untuk membuka halaman progres, pembayaran, dan dokumen. | **Rilis 2** (nonaktif sampai `trackingEnabled` dinyalakan) |

### D.6 Navigasi, Banner CTA, Footer
* **Menu:** Beranda, Layanan, Portofolio, Paket, Kalkulator, Konsultasi; menu "Lacak Proyek" **hanya ditambahkan pada Rilis 2**.
* **Banner CTA:** judul `Punya kebutuhan sistem atau aplikasi?`; teks `Ceritakan kebutuhan Anda, kami bantu rancang solusi dan estimasinya.`; tombol `Jadwalkan Konsultasi` dan `Chat via WhatsApp`.
* **Footer:** `© {tahun} OpenByte Labs. Semua hak dilindungi.`

### D.7 Proyek Awal (ringkasan dan tagline)
Ringkasan hanya memuat fakta pada 8.2. Bagian **Masalah** dan **Dampak** pada preset `problemSolutionImpact` diisi pemilik dengan data nyata (`[ISI]`); jangan menuliskan angka yang tidak terverifikasi.

| Proyek | Tagline | Ringkasan |
|---|---|---|
| SINDUKSADATI | Satu data wilayah RW dengan peta GIS dan otomasi surat. | Sistem satu data untuk RW 06 Mojorejo: peta batas wilayah RT/RW, profil warga terpadu (Citizen 360), dan otomasi permohonan surat dengan QR. |
| SIPANDU | Alur 5-Meja Posyandu dan deteksi dini stunting. | Sistem informasi Posyandu Flamboyan RW 06 dengan alur 5-Meja Kemenkes, kalkulator Z-Score WHO 2006, dan deteksi dini stunting (2T). |
| HIPPAM Web & Mobile | Pencatatan meter air swadaya, web dan mobile. | Aplikasi web dan mobile untuk pembacaan meter air swadaya, dengan kompresi foto meteran dan tarif berjenjang. |
| UMKM-KU | Direktori UMKM warga dengan checkout WhatsApp. | Direktori UMKM warga dengan verifikasi NIK melalui SINDUKSADATI dan pemesanan lewat WhatsApp. |
| Terapis Jogoroto | Landing page pijat akupresur dengan booking WhatsApp. | Landing page bernuansa emas hangat untuk pijat akupresur, dengan alur terapi lima langkah dan pemesanan langsung lewat WhatsApp. |
| Prewed (Undangan Fajar & Fifi) | Undangan digital dengan amplop 3D dan RSVP. | Undangan digital dengan animasi kelopak, amplop 3D bersegel lilin, musik latar, dan RSVP yang tersinkron ke spreadsheet. |

Nama klien (mis. mempelai pada proyek undangan) hanya ditampilkan bila izin klien sudah ada (aturan 5.6).

---

## Lampiran E: Draf Kebijakan Privasi dan Teks Persetujuan

> **Penting:** ini draf kerja berdasarkan fitur yang dirancang di PRD ini, bukan nasihat hukum. Sebelum Rilis 1, tinjau dengan ahli hukum atau konsultan privasi bila memungkinkan, lalu lengkapi semua `[ISI]`. Bagian yang menyangkut Rilis 2 diaktifkan hanya saat portal klien dirilis.

### E.1 Teks Persetujuan (`legal.consentText`, di samping checkbox form)
`Saya menyetujui OpenByte Labs memproses data yang saya kirim untuk menanggapi permintaan ini, sesuai Kebijakan Privasi.`

### E.2 Draf Kebijakan Privasi (`legal.privacyPolicy`)

**Kebijakan Privasi OpenByte Labs**
Berlaku sejak: `[ISI: tanggal rilis]`. Kebijakan ini disusun dengan memperhatikan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi.

**1. Pengendali data**
OpenByte Labs, dikelola oleh Muhammad Izzat Farahidi. Kontak: WhatsApp `{whatsappNumber}`, email `{contactEmail}`.

**2. Data yang kami kumpulkan**
* *Formulir pemesanan dan kontak:* nama, nomor WhatsApp, email (opsional), instansi atau bisnis, dan isi pesan.
* *Kalkulator estimasi:* pilihan fitur dan hasil estimasi; nama dan nomor WhatsApp bila Anda mengisinya.
* *Booking konsultasi:* data kontak, jadwal yang dipilih, dan ringkasan kebutuhan.
* *Data teknis:* alamat IP kami simpan **hanya dalam bentuk hash** (bukan IP asli) untuk mencegah penyalahgunaan dan spam.
* *(Rilis 2) Proyek klien:* data proyek yang kami kelola untuk Anda, termasuk status pengerjaan, catatan pembayaran, dokumen, komentar, permintaan revisi, dan lampiran yang Anda unggah, serta catatan persetujuan (nama, waktu, hash IP, informasi peramban).

**3. Tujuan dan dasar pemrosesan**
Kami memproses data untuk menanggapi permintaan Anda, menjadwalkan konsultasi, menyiapkan penawaran, mengerjakan proyek (Rilis 2), serta menjaga keamanan situs. Dasarnya adalah persetujuan Anda (checkbox pada formulir) dan pelaksanaan layanan yang Anda minta.

**4. Pihak yang membantu kami memproses data**
Kami memakai penyedia berikut untuk menjalankan situs: penyedia hosting `[ISI: nama hosting produksi]`, Neon (basis data), Cloudflare (verifikasi anti-spam Turnstile dan penyimpanan berkas R2), dan Sentry (pemantauan galat). Bila Anda memilih menghubungi kami lewat tautan WhatsApp, percakapan tunduk pada kebijakan WhatsApp. Sebagian penyedia dapat memproses data di luar Indonesia; kami memilih penyedia yang menerapkan pengamanan yang layak.

**5. Penyimpanan**
Data disimpan selama diperlukan untuk tujuan di atas. Kebijakan retensi: `[ISI: usulan 24 bulan sejak interaksi terakhir atau sejak proyek selesai]`. Setelah itu data dihapus atau dianonimkan.

**6. Hak Anda**
Anda berhak meminta akses, perbaikan, penghapusan, atau penghentian pemrosesan data Anda, dan menarik persetujuan kapan saja. Kirim permintaan ke kontak di atas; kami menanggapi dalam `[ISI: batas waktu respons]`.

**7. Keamanan**
Kami menggunakan koneksi HTTPS, akses admin terbatas dengan autentikasi dua faktor, pemisahan penyimpanan berkas privat, dan cadangan terenkripsi. Tidak ada sistem yang sepenuhnya bebas risiko; bila terjadi insiden yang berdampak pada data Anda, kami akan memberi tahu sesuai ketentuan yang berlaku.

**8. Cookie dan penyimpanan teknis**
Situs ini tidak memakai cookie iklan atau pelacak. Penyimpanan teknis yang mungkin dipakai: sesi admin (hanya untuk pengelola), sesi halaman pelacakan proyek (Rilis 2), dan mekanisme teknis verifikasi anti-spam. Bila kelak kami mengaktifkan analitik pengunjung, kebijakan ini diperbarui terlebih dahulu.

**9. Anak-anak**
Layanan kami tidak ditujukan bagi anak-anak.

**10. Perubahan kebijakan**
Perubahan akan dipublikasikan di halaman ini dengan tanggal berlaku yang baru.

### E.3 Catatan Implementasi
* Halaman `/kebijakan-privasi` merender `legal.privacyPolicy`; placeholder `{whatsappNumber}` dan `{contactEmail}` diisi dari `site-settings` saat render.
* Setiap form publik wajib memuat checkbox persetujuan bertuliskan E.1 dan menyimpan `consentAt`; form tidak dapat dikirim tanpa centang (validasi di server).
* Bila analitik diaktifkan (`seo.analyticsId`), perbarui E.2 butir 8 dan pertimbangkan pemberitahuan cookie sebelum diaktifkan.

---

## Lampiran F: Spesifikasi Algoritma dan Vektor Uji

Vektor uji di lampiran ini **dihitung dengan implementasi acuan yang dijalankan** (bukan ditebak) pada 26 Oktober 2026, dan kendala basis data di F.7 diuji pada PostgreSQL 16.2. Implementasi TypeScript di `lib/*` wajib menghasilkan nilai yang **identik**; vektor ini dijadikan fixture Vitest (`tests/fixtures/*.json`). Bila aturan bisnis diubah, ubah aturan dan vektornya bersamaan.

### F.1 Kalkulator (`lib/calculator`)

**Masukan:** daftar `{itemId, units?}`; konfigurasi grup/item/aturan; `minimumPrice` (default 500.000). **Item tak aktif tidak dapat dipilih.**

**Validasi, berurutan; galat pertama yang ditemukan dikembalikan:**
1. `item_tidak_dikenal`: id tidak ada/tak aktif.
2. `grup_single_lebih_dari_satu` dan `grup_wajib_kosong`: grup `single` maksimal satu item; grup `isRequired` minimal satu item.
3. `jumlah_unit_tidak_valid`: item `per_unit` wajib bilangan bulat 1..`maxUnits`.
4. `requires_belum_dipilih`: setiap item terpilih yang `requires` item lain mensyaratkan item itu ikut dipilih. (UI otomatis menandainya; server menolak bila tidak ada.)
5. `excludes_bentrok`: bila item A `excludes` B (dan sebaliknya, aturan dua arah), keduanya tak boleh sama-sama terpilih.

**Perhitungan:** untuk tiap item, `k = units` bila `per_unit`, selain itu 1. `priceMin = Σ priceMin·k`; `priceMax = Σ (priceMax ?? priceMin)·k`; `daysMin = Σ daysMin`; `daysMax = Σ (daysMax ?? daysMin)` (**hari tidak dikali unit**). Lalu `priceMin = max(priceMin, minimumPrice)` dan `priceMax = max(priceMax, minimumPrice)`. Bila `priceMin = priceMax`, tampil satu angka.

**Vektor** (data dari 8.4; `web`=Web Saja, `android`, `webandr`=Web+Android, `landing`, `katalog`, `sidb`=Sistem Informasi, `undangan`, `rbac`, `gis`, `laporan`, `pay`, `halaman`=Halaman Tambahan):
| # | Pilihan | Hasil |
|---|---|---|
| C1 | web + landing | 600.000 - 1.200.000; 3 - 5 hari |
| C2 | web + sidb + rbac + laporan | 3.400.000 - 5.800.000; 18 - 27 hari |
| C3 | web + undangan (di bawah minimum) | 500.000 - 1.000.000; 2 - 4 hari |
| C4 | web + landing + halaman x5 | 975.000 - 1.950.000; 3 - 5 hari |
| C5 | android + landing | galat `excludes_bentrok` |
| C6 | web + landing + rbac | galat `requires_belum_dipilih` |
| C7 | landing saja (tanpa platform) | galat `grup_wajib_kosong` |
| C8 | web + landing + halaman x21 | galat `jumlah_unit_tidak_valid` |
| C9 | web + landing + katalog | galat `grup_single_lebih_dari_satu` |
| C10 | webandr + sidb + gis + pay | 6.700.000 - 11.500.000; 35 - 53 hari |

**Paritas:** modul yang sama dijalankan di browser dan server; uji memastikan setiap vektor di atas menghasilkan keluaran identik di kedua lingkungan.

### F.2 Slot Booking (`lib/booking`)

**Konvensi:** `weekday` 0 = Minggu, 1 = Senin, ..., 6 = Sabtu. Semua jam WIB (UTC+7, tanpa DST). Default seeder: `slotDurationMinutes = 60`, `bufferMinutes = 0`, `minDaysAhead = 1`, `maxDaysAhead = 30`.

**Algoritma untuk satu tanggal WIB `D`:**
1. Kosong bila `D < hariIni + minDaysAhead` atau `D > hariIni + maxDaysAhead` (hari dihitung dalam WIB).
2. Untuk tiap `availability-rules` aktif dengan `weekday` sama: `kursor = startTime`; selama `kursor + durasi <= endTime`, slot = `[kursor, kursor + durasi)`, lalu `kursor += durasi + jeda`.
3. Buang slot yang beririsan dengan `blocked-dates` (jam kosong = seluruh hari) atau dengan booking aktif (`pending`/`confirmed`). Irisan memakai interval setengah terbuka: slot yang **bersebelahan** tidak dianggap beririsan.
4. Urutkan menurut jam mulai.

**Vektor** (aturan seeder Senin-Jumat: 09:00-11:00, 13:00-15:00, 16:00-18:00, 19:30-21:30; "sekarang" = Senin 26 Okt 2026 10:00 WIB):
| # | Kasus | Hasil |
|---|---|---|
| S1 | Senin 2 Nov 2026, durasi 60, jeda 0 | 8 slot: 09:00, 10:00, 13:00, 14:00, 16:00, 17:00, 19:30, 20:30 (masing-masing 60 menit) |
| S2 | S1 + blokir 13:00-14:00 + booking 09:00-10:00 | 6 slot: 10:00, 14:00, 16:00, 17:00, 19:30, 20:30 |
| S3 | Sabtu 7 Nov 2026 | kosong (tidak ada aturan) |
| S4 | Hari ini (26 Okt), `minDaysAhead = 1` | kosong |
| S5 | 26 Nov 2026 (hari ke-31) | kosong |
| S6 | Senin 2 Nov, durasi 45 + jeda 15 | 8 slot: 09:00-09:45, 10:00-10:45, 13:00-13:45, 14:00-14:45, 16:00-16:45, 17:00-17:45, 19:30-20:15, 20:30-21:15 |
| S7 | Senin 2 Nov + blokir seluruh hari | kosong |
| S8 | 25 Nov 2026 (hari ke-30) vs 26 Nov | 8 slot vs kosong (batas atas inklusif) |

### F.3 Normalisasi Nomor WhatsApp (`lib/whatsapp`)
1. Pangkas spasi. Tolak bila ada karakter selain `+`, angka, spasi, `-`, `(`, `)`.
2. Buang semua non-angka. Awalan `0` diganti `62`; awalan `8` diberi awalan `62`.
3. Valid bila cocok `^628\d{8,11}$`; selain itu `null` (tolak).

| Masukan | Hasil |
|---|---|
| `0895386011371` | `62895386011371` |
| `+62 895-3860-11371` | `62895386011371` |
| `62812345678` | `62812345678` |
| `895386011371` | `62895386011371` |
| `(0812) 3456-7890` | `6281234567890` |
| `081234` | ditolak (terlalu pendek) |
| `0212345678` | ditolak (telepon rumah) |
| `08123abc4567890` | ditolak (huruf) |
| `+1 415 555 0100` | ditolak (bukan nomor Indonesia) |
| (kosong) | ditolak |

### F.4 Mesin Status Revisi (`lib/tracking`: `nextRevisionState`)
Fungsi murni: `(revisi, peristiwa, revisionsUsed, revisionsIncluded) -> status baru + efek` atau galat `transisi_tidak_sah`. Efek `totalCostDelta` terjadi **sekali** pada transisi ke `accepted` dengan `isExtra`.

| Dari | Peristiwa | Hasil |
|---|---|---|
| (baru) | SUBMIT | `submitted` bila jenis `bug`, atau `revision` dengan kuota tersisa (`used < included`); `needs_payment` bila `change_request`, atau `revision` dengan kuota habis |
| `submitted` | ACCEPT | `revision`, kuota tersisa: `accepted` + `countsTowardQuota = true`; `revision`, kuota habis saat diterima: `needs_payment`; `bug`: `accepted`, tidak menghitung kuota |
| `submitted` | REJECT | `rejected` (wajib `adminResponse`) |
| `needs_payment` | SET_QUOTE | tetap `needs_payment`; `quotedPrice` terisi |
| `needs_payment` | CLIENT_ACCEPT_QUOTE | tetap `needs_payment`; hanya bila `quotedPrice` terisi; `clientAcceptedQuoteAt` terisi |
| `needs_payment` | ACCEPT | `accepted`, `isExtra = true`, `countsTowardQuota = false`, `totalCostDelta = quotedPrice`; hanya bila `quotedPrice` terisi **dan** klien sudah setuju |
| `needs_payment` | REJECT | `rejected` |
| `accepted` | START | `in_progress` |
| `in_progress` | DONE | `done` |
| lainnya | | galat `transisi_tidak_sah` |

**Vektor:**
| # | Kasus | Hasil |
|---|---|---|
| R1 | revision, kuota 3 terpakai 1, SUBMIT | `submitted` |
| R2 | revision, kuota 3 terpakai 3, SUBMIT | `needs_payment` |
| R3 | change_request, SUBMIT | `needs_payment` |
| R4 | bug, kuota habis, SUBMIT | `submitted` |
| R5 | submitted revision, kuota sisa, ACCEPT | `accepted`, menghitung kuota |
| R6 | submitted revision, kuota habis, ACCEPT | `needs_payment` |
| R7 | submitted bug, ACCEPT | `accepted`, tidak menghitung kuota |
| R8 | needs_payment tanpa harga, ACCEPT | galat |
| R9 | needs_payment, harga 250.000, klien setuju, ACCEPT | `accepted`, `isExtra`, `totalCostDelta = 250.000` |
| R10 | needs_payment, harga ada, klien belum setuju, ACCEPT | galat |
| R11 | rejected, START | galat |
| R12 | accepted, DONE (melompat) | galat |
| R13 | accepted, START | `in_progress` |
| R14 | in_progress, DONE | `done` |

### F.5 Nilai Turunan, Kode, PIN, Nomor Referensi
* `paymentStatus`: `unpaid` bila `paidAmount <= 0`; `paid_off` bila `totalCost > 0` dan `paidAmount >= totalCost`; selain itu `down_payment`.
* `currentStep`: `stepNumber` terkecil yang status-nya bukan `done`; bila semuanya `done`, nilainya 6.
* **Vektor:** total 3.500.000 dibayar 0 = `unpaid`; dibayar 1.000.000 = `down_payment`; dibayar 3.500.000 = `paid_off`; dibayar 3.600.000 = `paid_off`; total 0 dibayar 0 = `unpaid`. Langkah `[done, done, in_progress, pending, pending, pending]` = 3; `[done, pending, done, done, done, done]` = 2; semuanya `done` = 6.
* **Kode tracking** `PRJ-` + 8 karakter dari alfabet 32 karakter `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (tanpa `I`, `O`, `0`, `1`), dibangkitkan dengan CSPRNG (32 membagi 256 sehingga tanpa bias modulo); ulangi bila bentrok (maks. 5 kali). **PIN** 6 digit dari CSPRNG (`crypto.randomInt(0, 1_000_000)`, diberi nol di depan). Di basis data hanya hash PIN.
* **Nomor referensi** `PREFIKS-YYMM-XXXX` (YYMM menurut WIB, `XXXX` dari alfabet yang sama): `INQ` (inquiry), `QTE` (quote), `BKG` (booking). Ulangi bila bentrok (maks. 5 kali).

### F.6 Rate Limit Login Tracking (`lib/tracking`)
Parameter dari Settings: `maxLoginAttempts = 5`, jendela 15 menit, `lockMinutes = 15`. Per kunci (hash kode + IP):
1. Bila `lockedUntil > sekarang`: tolak (`TERKUNCI`), **meski PIN benar**.
2. Bila login berhasil: hitungan dan jendela direset.
3. Bila gagal: bila jendela kosong atau sudah lewat 15 menit sejak awal jendela, mulai jendela baru dengan hitungan 0; tambah hitungan; bila hitungan >= batas, set `lockedUntil = sekarang + lockMinutes`.

| # | Kasus (menit) | Hasil |
|---|---|---|
| L1 | gagal di 0,1,2,3,4 lalu PIN benar di 5 | GAGAL(1), GAGAL(2), GAGAL(3), GAGAL(4), GAGAL -> TERKUNCI, **TERKUNCI** |
| L2 | gagal di 0-4 lalu PIN benar di 20 | ..., GAGAL -> TERKUNCI, **MASUK** |
| L3 | gagal di 0,1,2,3 lalu gagal di 20 | ..., GAGAL(4), **GAGAL(1)** (jendela direset) |
| L4 | gagal di 0,1,2,3, sukses di 4, gagal di 5 | ..., MASUK, **GAGAL(1)** |

### F.7 Kendala Eksklusi Booking (diuji pada PostgreSQL 16.2)
DDL acuan (**nama tabel/kolom dan tipe status harus mengikuti skema serta migrasi Drizzle**; SQL kustom disimpan sebagai migrasi berversi dan dijalankan setelah tabel/kolom tersedia):
```sql
ALTER TABLE consultation_bookings
  ADD CONSTRAINT consultation_bookings_no_overlap
  EXCLUDE USING gist (tstzrange(slot_start, slot_end) WITH &&)
  WHERE (status IN ('pending', 'confirmed'));
```
Hasil uji (kolom `timestamp(3) with time zone`, status bertipe enum):
| # | Skenario | Hasil |
|---|---|---|
| 1 | slot 09:00-10:00 | berhasil |
| 2 | slot yang sama persis | ditolak, SQLSTATE `23P01` |
| 3 | tumpang tindih 09:30-10:30 | ditolak, `23P01` |
| 4 | bersebelahan 10:00-11:00 | berhasil (interval setengah terbuka) |
| 5 | rentang yang sama berstatus `cancelled` | berhasil (kondisi `WHERE` mengecualikannya) |
| 6 | setelah booking dibatalkan, slot yang sama dipesan ulang | berhasil |
| 7 | **balapan 12 koneksi serentak** ke slot yang sama | **1 berhasil, 11 ditolak** dengan `23P01`; tepat satu baris tersimpan |

Server Action memetakan `23P01` (dan `23505`) ke pesan "Slot baru saja terisi, pilih jam lain". Uji ini diulang di Neon pada Fase 0 dan di Playwright (dua sesi serentak).

---

## Lampiran G: Kit Fase 0 (Berkas, Skrip, dan Workflow)

Kit ini mengurangi tebakan saat memulai. Semua nilai yang bergantung pada versi paket diverifikasi pada Fase 0 (12.3).

### G.1 Memulai Proyek
1. Buat repo **Next.js App Router + TypeScript + Tailwind CSS** (tanpa template CMS). Simpan folder prototype sebagai sumber referensi implementasi, bukan dependency runtime.
2. Pasang dependency yang telah diverifikasi Fase 0: `drizzle-orm`, `drizzle-kit` (dev), driver PostgreSQL yang sesuai (`postgres` atau `pg`), `better-auth`, `zod`, `react-hook-form`, `sharp`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `jose`, `@node-rs/argon2` (atau `bcryptjs`), `@sentry/nextjs`, `lucide-react`; `lexical` dan `@lexical/react` bila editor rich text memang dibutuhkan prototype; dev `vitest`, `@playwright/test`, `eslint` dan tooling TS.
3. Implementasikan `src/db/schema`, konfigurasi Better Auth dan 2FA, middleware/policy akses, env validator, upload R2, service layer, dan struktur 2.3. Kunci versi persis di lockfile setelah uji kompatibilitas.
4. Jika terdapat kode Fase 0 lama, **inventarisasi sebelum menghapus file atau tabel**; buat porting plan untuk data dan tes. Jangan menjalankan `drizzle-kit push` pada database produksi.

### G.2 Skrip `package.json`
| Skrip | Fungsi |
|---|---|
| `dev`, `build`, `start` | Next.js |
| `lint`, `typecheck` | ESLint, `tsc --noEmit` |
| `test`, `test:e2e` | Vitest, Playwright |
| `db:generate` | `drizzle-kit generate` (buat dan review file migrasi) |
| `db:migrate` | `drizzle-kit migrate` memakai `DATABASE_URI_DIRECT` (konfigurasi khusus migrator) |
| `db:check` | Uji konsistensi schema/migrasi dari database kosong, bukan `push` produksi |
| `seed` | Seeder idempotent via Drizzle (bagian 8) |
| `owner:create`, `owner:reset` | Bootstrap/recovery owner secara aman tanpa email; audit dan minta kata sandi dari input aman |
| `check:portability` | Tolak import paket `@vercel/*` dan package CMS lama |
| `check:access` | Uji matriks RBAC dan endpoint/action (5.4) |
| `retention:run` | Skrip retensi manual, nonaktif sampai kebijakan final (6.3) |

### G.3 `.env.example`
```bash
# --- Inti ---
SITE_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=ganti-dengan-string-acak-panjang
# --- Database (pooled runtime, direct migrasi) ---
DATABASE_URI=postgres://postgres:postgres@localhost:5432/openbyte
DATABASE_URI_DIRECT=postgres://postgres:postgres@localhost:5432/openbyte
# --- Cloudflare R2 ---
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_PUBLIC=
R2_PUBLIC_BASE_URL=
R2_BUCKET_PRIVATE=           # Rilis 2
# --- Anti-spam ---
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
# --- Security ---
IP_HASH_SALT=
TRUSTED_IP_HEADER=x-forwarded-for
TRACKING_SESSION_SECRET=     # Rilis 2
# --- Lain-lain ---
SENTRY_DSN=
WA_DEFAULT_NUMBER=
```
Catatan: variabel untuk `BETTER_AUTH_URL`/cookie/origin harus diselaraskan dengan konfigurasi rilis Better Auth yang dipilih setelah uji N-01/N-02, terutama staging dan domain produksi.

### G.4 `docker-compose.yml` (PostgreSQL lokal)
```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: openbyte
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
volumes:
  pgdata:
```
Sesuaikan versi mayor `postgres` dengan versi yang dipakai Neon pada proyek Anda.

### G.5 Workflow CI (`.github/workflows/ci.yml`)
```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  verify:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_USER: postgres, POSTGRES_PASSWORD: postgres, POSTGRES_DB: openbyte_test }
        ports: ["5432:5432"]
        options: >-
          --health-cmd "pg_isready -U postgres" --health-interval 5s
          --health-timeout 5s --health-retries 10
    env:
      DATABASE_URI: postgres://postgres:postgres@localhost:5432/openbyte_test
      DATABASE_URI_DIRECT: postgres://postgres:postgres@localhost:5432/openbyte_test
      BETTER_AUTH_SECRET: ci-only-secret
      BETTER_AUTH_URL: http://localhost:3000
      SITE_URL: http://localhost:3000
      IP_HASH_SALT: ci-only-salt
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }   # gunakan versi Node yang lolos N-01
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm typecheck && pnpm check:portability
      - run: pnpm db:migrate
      - run: pnpm db:check
      - run: pnpm test && pnpm check:access
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e
      - run: pnpm audit --prod --audit-level=high
```
Gunakan versi terbaru yang tersedia untuk setiap `uses:`; setelah job stabil, kunci ke commit SHA.

### G.6 Workflow Backup Harian (`.github/workflows/backup.yml`)
```yaml
name: Backup harian
on:
  schedule: [{ cron: "17 19 * * *" }]   # 02:17 WIB (cron GitHub memakai UTC)
  workflow_dispatch:
jobs:
  dump:
    runs-on: ubuntu-latest
    steps:
      - name: pg_dump (versi mayor sama dengan Neon)
        env:
          DATABASE_URI_DIRECT: ${{ secrets.DATABASE_URI_DIRECT }}
          PG_MAJOR: ${{ vars.PG_MAJOR }}
        run: docker run --rm "postgres:${PG_MAJOR}" pg_dump --format=custom --no-owner "$DATABASE_URI_DIRECT" > backup.dump
      - name: Enkripsi
        env: { BACKUP_PASSPHRASE: "${{ secrets.BACKUP_PASSPHRASE }}" }
        run: |
          gpg --batch --yes --pinentry-mode loopback --passphrase "$BACKUP_PASSPHRASE" \
              --symmetric --cipher-algo AES256 -o "backup-$(date -u +%F).dump.gpg" backup.dump
          rm backup.dump
      - name: Unggah ke bucket R2 terpisah
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.BACKUP_R2_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.BACKUP_R2_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: auto
        run: aws s3 cp backup-*.dump.gpg "s3://${{ vars.BACKUP_R2_BUCKET }}/" --endpoint-url "https://${{ secrets.R2_ACCOUNT_ID }}.r2.cloudflarestorage.com"
```
Catatan: GitHub dapat menonaktifkan workflow terjadwal pada repositori publik yang tidak aktif lama, jadi periksa tab Actions sekali sebulan; simpan `BACKUP_PASSPHRASE` di tempat terpisah dari repositori (jika hilang, cadangan tidak bisa dibuka). Uji **pemulihan**: unduh, dekripsi, `pg_restore` ke database kosong, lalu jalankan aplikasi terhadapnya.

### G.7 `Dockerfile` Cadangan
Tujuannya membuktikan portabilitas (7.7), bukan dipakai rutin. Buat build Docker multi-tahap berbasis `output: 'standalone'` Next.js, dan pasang dependensi sistem yang dibutuhkan Sharp bila memang diperlukan. Kriteria lulus: `docker build` berhasil dan `docker run` dengan variabel lingkungan menampilkan beranda dan `/admin`.

---

## Lampiran H: Gerbang Keputusan dan Nilai Bawaan

Setiap keputusan punya **nilai bawaan** agar pembangunan tidak tertahan. Pemilik dapat mengubahnya kapan saja sebelum batas waktu.

| # | Keputusan | Batas waktu | Nilai bawaan bila belum diputuskan |
|---|---|---|---|
| 1 | Hosting produksi | Sebelum Rilis 1 (idealnya sebelum Fase 5 dimulai) | Ikuti hasil uji memori Fase 0: muat pada instance 512 MB maka Render berbayar terkecil; tidak muat maka Vercel Pro. **Bila belum ada anggaran, tunda Rilis 1**; jangan memakai Vercel Hobby atau Render free untuk situs yang sudah live |
| 2 | Domain | Sebelum Rilis 1 (idealnya sebelum Fase 5 dimulai) | Cek ketersediaan `openbytelabs.com`, `openbytelabs.id`, `openbytelabs.my.id`; beli yang pertama tersedia dalam urutan itu |
| 3 | Acuan UI/UX prototype | Sebelum Fase 3 | Prototype full-page milik pemilik menjadi acuan final. Pastikan file/link prototype dan perilaku mobile/interaksi tersedia bagi pengembang; state yang belum tergambar mengikuti kebutuhan fungsi serta aksesibilitas PRD |
| 4 | Logo | Sebelum Rilis 1 | Gunakan logo/aset pada prototype atau `site-settings`; bila belum tersedia, gunakan teks brand sementara tanpa menetapkan gaya desain baru |
| 5 | Konten awal | Sebelum Rilis 1 | Lampiran D; seluruh `[ISI]` wajib diisi pemilik |
| 6 | Gambar proyek | Sebelum Rilis 1 | Screenshot enam proyek diambil pemilik; rasio/crop mengikuti prototype dan kebutuhan media; izin klien untuk nama klien |
| 7 | Kebijakan privasi | Sebelum Rilis 1 | Lampiran E dengan `[ISI]` terisi; sangat disarankan ditinjau ahli hukum |
| 8 | Retensi data | Sebelum ada data klien nyata dalam jumlah besar | 24 bulan sejak interaksi terakhir; dijalankan manual |
| 9 | Kebijakan revisi | Sebelum Rilis 2 | Lampiran C apa adanya (14 hari, garansi bug 30 hari) |
| 10 | Skema uang muka/pelunasan | Sebelum Rilis 2 | Disepakati dalam kontrak per proyek; sistem hanya mencatat pembayaran dan tidak memaksa persentase |
| 11 | Harga awal | Sebelum Rilis 1 | 8.4; ditinjau ulang setelah 3-5 proyek |
