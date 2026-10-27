# Product Requirement Document (PRD)
# OpenByte Labs — Web Agensi Jasa Pembuatan Website, Aplikasi Mobile, & Portfolio CMS

* **Versi:** 1.4.0 (siap build: sistem desain, konten awal, spesifikasi uji berverifikasi, dan verifikasi paket)
* **Status:** Siap dibangun mulai Fase 0. **Rilis 1** (situs company, portofolio, kalkulator, paket, booking) lebih dulu; **Rilis 2** (portal klien) menyusul. Keputusan yang belum final memiliki nilai bawaan (Lampiran I); hosting produksi dan domain wajib diputuskan sebelum Rilis 1
* **Pemilik Produk:** Muhammad Izzat Farahidi (Founder OpenByte Labs; Software Engineer & System Specialist)
* **Bahasa Antarmuka:** Indonesia saja (situs publik, portal klien, dan panel admin bila tersedia; lihat 12.3)
* **Target Stack:** TypeScript, Next.js (App Router), Payload CMS 3 (berjalan di dalam aplikasi Next.js yang sama), Tailwind CSS, PostgreSQL (Neon), storage S3-compatible (Cloudflare R2), hosting pengembangan di Vercel Hobby, hosting produksi diputuskan sebelum Rilis 1 (7.7)

> **Versi paket yang dikunci (diverifikasi pada 26 Oktober 2026 dari registri npm dan definisi tipe paket).**
> * **Payload CMS 3.92.0** (versi stabil terbaru; Payload 4 masih beta dan **tidak dipakai**). Seluruh paket `@payloadcms/*` memakai versi yang sama persis dengan `payload`.
> * **Next.js** dalam rentang peer `@payloadcms/next@3.92.0`: `>=16.3.3 <17` (versi 15.x tertentu juga didukung, tidak dipakai). Jangan menaikkan Next.js sendiri di luar rentang peer Payload yang dikunci; gunakan versi yang ditarik template `create-payload-app` pada hari Fase 0 dimulai.
> * **Catatan keputusan pemilik (27 Oktober 2026, hasil audit keamanan F0-03):** Next.js dinaikkan **16.3.3 → 16.4.3** (tetap di dalam rentang peer di atas) karena 5 advisory `next` critical/high yang terekspos (aplikasi memakai `next/image`): 3× RCE — `GHSA-vcvr-r3jv-pc5j` (RCE next/og ImageResponse), `GHSA-2464-fhr4-w9xw` (RCE image optimizer via SVG), `GHSA-673q-mjm6-r5xr` (RCE `use cache`); SSRF `GHSA-cjq9-62q9-8jv4`; DoS Server Actions `GHSA-p3m5-59mp-jv5r`. `sharp` 0.35.4 → **0.35.5** (high, CVE librsvg); override transitive di `pnpm-workspace.yaml`: `dompurify` **3.4.17** (1 critical + 1 high) dan `happy-dom` **21.0.4** (high). Payload dan seluruh `@payloadcms/*` tetap **3.92.0**.
> * **Node.js** sesuai `engines` Payload: `^22.23.4` atau `>=24.22.1`.
> * **2FA:** `payload-totp@3.0.6` (peer `payload ^3.88.0`).
> * Versi di atas adalah titik awal; **kunci versi persis** di `package.json` dan catat perubahan apa pun pada hari Fase 0. Nama opsi Payload/Next.js yang tidak tercantum di 12.3 sebagai "terverifikasi" tetap berstatus rujukan desain sampai diuji di Fase 0.

---

## 0. Ringkasan

OpenByte Labs dibangun sebagai **satu aplikasi Next.js** yang memuat situs publik, panel admin (Payload CMS), dan seluruh endpoint, dengan satu database PostgreSQL. Dokumen ini adalah satu-satunya acuan produk dan teknis.

**Keputusan kunci:**
* **Stack:** TypeScript, Next.js, Payload CMS 3, Tailwind CSS, PostgreSQL (Neon), Cloudflare R2.
* **Rilis bertahap:** situs company yang dapat diindeks Google dirilis lebih dulu (Rilis 1); portal klien menyusul setelah ada klien (Rilis 2).
* **Satu mesin, dua pemakai:** logika kalkulator dan slot booking adalah satu modul TypeScript murni yang dipakai browser dan server.
* **Server sebagai otoritas:** semua penulisan dari publik lewat Server Action yang tervalidasi; REST Payload tertutup secara bawaan.
* **Tanpa pekerjaan latar dan tanpa email:** tidak ada scheduler/queue; notifikasi lewat panel admin dan WhatsApp.
* **Hosting-agnostik:** Vercel Hobby hanya untuk pengembangan; hosting produksi diputuskan sebelum Rilis 1 (7.7).
* **Seluruh konten dapat diedit dari CMS** tanpa deploy ulang.
* **Siap build:** Lampiran D-I memuat sistem desain, konten awal, draf kebijakan privasi, spesifikasi algoritma dengan vektor uji, kit Fase 0, dan gerbang keputusan beserta nilai bawaan.

### Cakupan per Rilis
| Rilis | Isi | Koleksi/Global |
|---|---|---|
| **Rilis 1** (Fase 0-5) | Beranda (Page Builder), layanan, portofolio, testimoni, FAQ, kalkulator, paket & pemesanan, booking konsultasi, SEO, panel admin untuk konten + inquiry/quote/booking, 2FA, audit | `site-settings`, `users`, `media`, `pages`, `services`, `testimonials`, `faqs`, `categories`, `technologies`, `projects`, `service-packages`, `service-addons`, `inquiries`, `calculator-groups`, `calculator-items`, `quote-requests`, `availability-rules`, `blocked-dates`, `consultation-bookings`, `audit-logs`, `rate-limits` |
| **Rilis 2** (Fase 6) | Portal klien: tracking, stepper, pembayaran, timeline, dokumen, revisi, komentar, persetujuan, unggah lampiran privat, aksi "Jadikan Proyek Klien/Portofolio" | `step-templates`, `client-projects`, `payments`, `project-updates`, `project-documents`, `revision-requests`, `project-comments`, `project-approvals`, `private-files` |

Aturan peralihan: selama Rilis 1, rute `/tracking*` mengembalikan 404 dan tidak ada tautan menuju ke sana (sakelar `tracking.trackingEnabled`, default mati). Koleksi Rilis 2 ditambahkan lewat migrasi tambahan di Fase 6 dan **hanya menambah**, tidak mengubah koleksi Rilis 1. Desainnya tetap ditulis lengkap di bagian 3 agar kompatibel sejak awal.

---

## 1. Ikhtisar Produk & Brand Positioning

### 1.0 Identitas Brand
Nama brand tunggal untuk seluruh produk, situs, dokumen, dan materi pemasaran adalah **OpenByte Labs** (penulisan resmi: `OpenByte Labs`,
dua kata, "O", "B", dan "L" kapital). Nilai awalnya disimpan di Global `site-settings` field `brandName` sehingga tetap dapat diubah dari CMS tanpa deploy.

* **Dipakai untuk:** nama aplikasi, `<title>` dan meta SEO, logo & favicon, header/footer, template WhatsApp, halaman legal, dan nama sistem desain
  (**OpenByte Labs Design System**).
* **Bentuk pendek:** `OpenByte` hanya untuk ruang sempit (badge, breadcrumb, alt teks logo).
* **Dilarang dipakai sebagai nama brand:** "Web Agensi", "MoveIQ", "Muhammad Izzat Agency", atau varian ejaan lain.
* **Pemilik produk tetap** Muhammad Izzat Farahidi dan boleh disebut sebagai founder/penanggung jawab pada halaman Tentang, bukan sebagai nama brand.

### 1.1 Visi Produk
Platform digital terpadu untuk personal software house / digital agency **OpenByte Labs** milik **Muhammad Izzat**, dengan empat fungsi:

1. **Katalog Portofolio Terkurasi**: sistem skala instansi, kesehatan, utilitas, UMKM, mobile Flutter, dan undangan digital; seluruhnya dikelola dari CMS.
2. **Mesin Konversi (Lead Generation)**: kalkulator estimasi, paket harga, pemesanan, booking konsultasi, dan integrasi WhatsApp.
3. **Portal Proyek Klien (Rilis 2)**: klien melacak progres, pembayaran, dan dokumen, serta **berkomentar, mengajukan revisi, dan menyetujui hasil** tanpa membuat akun.
4. **Pusat Kontrol CMS Terpusat**: satu panel admin untuk seluruh konten dan operasional.

### 1.2 Prinsip Desain Utama
1. **Tidak ada konten tersembunyi di kode.** Teks, angka, harga, gambar, urutan section, template pesan, dan aturan bisnis (kuota revisi, jam booking) wajib dapat diubah dari admin.
2. **Satu sumber kebenaran per data.** Status progres, pembayaran, dan kuota revisi diturunkan dari satu sumber, bukan disimpan ganda.
3. **Server adalah otoritas.** Hasil kalkulator, validasi booking, dan persetujuan klien dihitung/divalidasi di server. Karena logika kalkulator dan slot adalah **satu modul TypeScript yang sama** untuk browser dan server, pratinjau dan hasil resmi tidak bisa menyimpang.
4. **Sederhana untuk satu operator.** Satu aplikasi Next.js (situs publik, portal klien, panel admin Payload, dan endpoint), satu database, satu deployment.
5. **Hosting-agnostik.** Tidak ada fitur yang hanya ada di satu platform hosting (7.7), agar pindah dari Vercel Hobby ke hosting produksi tidak mengubah kode aplikasi.
6. **Permukaan API sekecil mungkin.** Payload otomatis membuat REST API untuk setiap koleksi; setiap koleksi diberi akses eksplisit (tertutup secara bawaan), dan penulisan dari publik hanya lewat Server Action yang tervalidasi (6.2).

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
                              HTTPS (TLS platform)
                                   |
+--------------------------------------------------------------------------+
|  APLIKASI NEXT.JS (satu deployment, hosting-agnostik)                    |
|   * (frontend)  Situs publik: React Server Components + Tailwind CSS     |
|   * (payload)   Panel admin Payload /admin + REST API (tertutup)         |
|   * Server Actions & route handler: Kalkulator, Booking, Tracking,       |
|     Revisi, WA Link Builder, Turnstile, rate limit                       |
|   * Local API Payload: akses data langsung dari server, tanpa HTTP       |
+--------------------------------------------------------------------------+
        |                          |                         |
        v                          v                         v
+----------------+     +----------------------+    +-----------------------+
| NEON           |     | CLOUDFLARE R2        |    | GITHUB ACTIONS        |
| PostgreSQL     |     | (S3-compatible)      |    | CI + backup harian    |
| pooled (app) / |     | bucket publik: gambar|    | pg_dump -> R2         |
| direct (migrasi)|    | bucket privat:       |    | (bucket terpisah)     |
+----------------+     | lampiran, bukti bayar|    +-----------------------+
                       +----------------------+
```

### 2.1 Komponen
| Komponen | Pilihan | Catatan |
|---|---|---|
| Bahasa & runtime | TypeScript (mode `strict`), Node.js LTS | Satu bahasa untuk frontend, admin, dan server |
| Framework | Next.js App Router | Server Components secara bawaan; Client Components hanya untuk interaksi (filter, kalkulator, form) |
| CMS & admin | Payload CMS 3 | Terpasang di dalam aplikasi Next.js, rute admin di `/admin`; menu tiga grup (Konten Website, Operasional Klien, Sistem) |
| Frontend | React, Tailwind CSS, Lucide React | Tanpa SPA terpisah; komponen primitif aksesibel (mis. Radix/shadcn/ui) hanya bila dibutuhkan |
| Form & validasi | React Hook Form + zod | **Skema zod yang sama** dipakai di browser dan di Server Action; server selalu memvalidasi ulang |
| Database | PostgreSQL di Neon | Region Singapura; koneksi *pooled* untuk aplikasi (pool kecil karena serverless), *direct* untuk migrasi |
| Adaptor DB | `@payloadcms/db-postgres` | Adaptor netral-hosting (bukan adaptor khusus vendor). Skema fisik dihasilkan Payload |
| Storage | S3-compatible (Cloudflare R2) lewat adaptor storage S3 Payload | **Wajib**: filesystem platform serverless bersifat sementara. Bucket publik (gambar situs) untuk Rilis 1; bucket privat (lampiran klien, bukti bayar) ditambahkan pada Rilis 2. Produksi memerlukan domain sendiri (7.6) |
| Media | Koleksi upload Payload + `sharp` | Ukuran turunan (thumb, card, hero, og) otomatis dalam WebP; unggahan dari admin langsung ke R2 (*client uploads*) agar tidak terbentur batas ukuran body request platform |
| Rich text | Payload Lexical | Disimpan sebagai JSON; dirender lewat komponen React. Bila ada keluaran HTML mentah, wajib disanitasi (`sanitize-html` atau DOMPurify) |
| Peran & izin | Access control Payload | Field `roles` pada `users`: `owner`, `editor`; akses diberikan per koleksi, per operasi, dan per field |
| Audit | Koleksi `audit-logs` + riwayat versi Payload | Hook `afterChange`/`afterDelete` mencatat perubahan data sensitif; dokumen ber-draft juga punya riwayat versi |
| 2FA admin | Plugin komunitas `payload-totp` 3.0.6 (peer `payload ^3.88.0`, kompatibel dengan versi terkunci) | 2FA **bukan fitur inti** Payload; uji *force setup* dan reset oleh `owner` di Fase 0; fallback: TOTP kustom (`otplib`) lewat hook dan halaman login sendiri |
| Anti-spam | Cloudflare Turnstile + honeypot | Diverifikasi di server pada setiap Server Action form publik |
| Rate limit | Tabel `rate-limits` di PostgreSQL | Tanpa Redis; dipakai login tracking, komentar/revisi, form publik (4.7, 6.2) |
| Sesi tracking (Rilis 2) | Cookie bertanda tangan (`jose`, HS256) | `httpOnly`, `secure`, `sameSite`; membawa id proyek, versi PIN, dan kedaluwarsa |
| Hash PIN (Rilis 2) | argon2id (`@node-rs/argon2`) atau `bcryptjs` | Dipilih yang berjalan stabil di runtime hosting terpilih |
| Error monitoring | Sentry (`@sentry/nextjs`) | Plus uptime monitor eksternal |
| Email | Tidak dipakai | Notifikasi admin lewat panel + WhatsApp; Payload tanpa adaptor email; reset sandi owner lewat skrip CLI (6.2) |
| Integrasi eksternal | WhatsApp Click-to-Chat (`wa.me`), Google Calendar *link generator* | Link generator hanya membuat tautan "tambah ke kalender", bukan membuat Meet |
| Uji | Vitest (unit), Playwright (e2e) | Modul kalkulator, slot booking, rate limit, dan alur tracking wajib punya uji |
| Package manager | pnpm | Lockfile di repositori |

### 2.2 Konvensi Basis Data (PostgreSQL via Payload)
Skema fisik **dihasilkan oleh Payload** dari konfigurasi koleksi; dokumen ini mendefinisikan koleksi dan field logis (bagian 3), bukan DDL tulisan tangan.

* **Primary key:** integer serial bawaan Payload (`idType: 'number'`).
* **Nama:** slug koleksi `kebab-case` (mis. `service-packages`) dan nama field `camelCase` (mis. `featuredImage`); Payload memetakannya ke tabel/kolom `snake_case`.
* **Field `array`, `blocks`, relasi `hasMany`, dan `join`** disimpan Payload di **tabel anak/relasional**, bukan satu kolom jsonb. Tinjau SQL migrasi yang dihasilkan sebelum dijalankan. Field bertipe `json` memang jsonb (dipakai hanya untuk snapshot, mis. `quote-requests.selection`).
* **Select = ENUM Postgres:** field `select` dipetakan ke tipe ENUM database; menambah nilai berarti migrasi. Ini diterima untuk status yang stabil (Lampiran B). Untuk nilai yang diperkirakan sering bertambah gunakan `text` + validasi.
* **Tahun:** field `number` bilangan bulat dengan batas (mis. 2000-2100).
* **Uang:** **bilangan bulat Rupiah** (tanpa sen), field `number` dengan validasi integer >= 0; tampilan `Rp 1.500.000` lewat `Intl.NumberFormat('id-ID')`. Rupiah tidak memakai desimal pada tampilan, dan bilangan bulat menghindari galat desimal floating point di JavaScript.
* **Waktu:** semua timestamp disimpan UTC. Tampilan memakai `Asia/Jakarta` (WIB). Jam yang bersifat "jam dinding WIB" (jadwal mingguan, tanggal terblokir) disimpan sebagai teks `HH:mm` / `YYYY-MM-DD` karena Payload tidak punya tipe `date`/`time` murni; booking memakai `slotStart`/`slotEnd` (instan UTC) agar bebas ambiguitas zona waktu.
* **Soft delete:** memakai fitur *trash* bawaan Payload bila tersedia di versi terkunci; bila tidak, field `deletedAt` + filter akses. Berlaku untuk koleksi konten dan proyek klien.
* **Aksi hapus relasi:** Payload membuat foreign key dengan perilaku lepas-relasi (set null). Larangan hapus (mis. kategori yang masih dipakai paket) diterapkan dengan hook `beforeDelete`, bukan RESTRICT di database.
* **Migrasi:** sejak awal memakai **migrasi Payload** (`migrate:create`, `migrate`), bukan mode *push* otomatis, supaya objek khusus di luar konfigurasi Payload (kendala eksklusi booking, indeks tambahan) tidak terhapus. Migrasi berjalan lewat koneksi **direct** Neon.
* **Indeks tambahan** (di luar default Payload) ditulis dalam migrasi SQL kustom: kendala eksklusi booking (3.5), unik `(clientProject, roundNumber)` pada `revision-requests`, unik `key` pada `rate-limits`, dan indeks pada kolom yang sering difilter (`status`, `slug`, `publishedAt`, `trackingCode`).
* **Kedalaman query:** setiap pemanggilan Local API menyebut `depth` dan `select` secara eksplisit untuk menghindari N+1 dan muatan berlebih.

### 2.3 Struktur Repositori & Modul
```
/
  src/
    app/
      (frontend)/            situs publik + portal tracking (RSC, Server Actions)
      (payload)/             rute admin & API Payload (dibuat template Payload)
    collections/             definisi koleksi Payload (satu file per koleksi)
    globals/                 site-settings
    blocks/                  definisi blok Page Builder & blok konten proyek
    access/                  fungsi akses (isOwner, isEditor, isAdmin, publishedOnly)
    hooks/                   hook (reference, derived values, audit, revalidate)
    lib/
      calculator/            engine harga + aturan (TS murni, dipakai browser & server)
      booking/               generator slot + validasi (TS murni)
      whatsapp/              normalisasi nomor + builder template + validasi placeholder
      tracking/              sesi, PIN, rate limit
      security/              sanitasi, hash IP, verifikasi Turnstile, util IP klien
      format/                Rupiah, tanggal WIB
    components/              komponen UI publik + komponen admin kustom
    migrations/              migrasi Payload (termasuk SQL kustom)
    seed/                    skrip seeder (Local API, idempotent)
  tests/                     unit (Vitest) + e2e (Playwright)
  payload.config.ts
```
Aturan dependensi: `lib/*` tidak boleh mengimpor dari `app/` atau Payload (agar bisa diuji murni dan dipakai di browser); `collections/*` boleh memanggil `lib/*`.

### 2.4 Pola Akses Data
1. **Halaman publik** (Server Components) membaca lewat **Local API** Payload dengan filter `where` eksplisit (hanya dokumen published/aktif) serta `depth` dan `select` yang disebut jelas. Objek dokumen mentah tidak pernah diserahkan ke Client Component; yang dikirim hanya DTO terpilih.
2. **Penulisan dari publik** (inquiry, quote, booking, login tracking, komentar, revisi, persetujuan) **hanya** lewat Server Action: validasi zod -> Turnstile/honeypot -> rate limit -> Local API dengan `overrideAccess: true` pada koleksi yang aksesnya tertutup untuk anonim.
3. **Portal tracking** tidak pernah memakai REST Payload. Sesi bertanda tangan menentukan **satu** `clientProject`; setiap query selalu memfilter `clientProject = sesi.id` dan `isVisibleToClient = true` untuk data yang punya flag itu.
4. **Panel admin** memakai REST/UI Payload dengan sesi admin dan access control per peran.

---

## 3. Model Data (Global & Koleksi Payload)

Konvensi tabel: **Field | Tipe Payload | Keterangan**. Semua koleksi memiliki `id`, `createdAt`, `updatedAt` otomatis. "Draft" berarti koleksi memakai fitur *versions + drafts* Payload (status `draft`/`published`; validasi `required` hanya ditegakkan saat publish). "Trash" berarti memakai soft delete (2.2). Kolom **Akses** menyebut siapa yang boleh membaca/menulis melalui REST/admin; penulisan publik selalu lewat Server Action (2.4).

Koleksi pada 3.6 dan 3.7 serta `private-files` baru dibuat pada **Rilis 2** (Fase 6) lewat migrasi tambahan; desainnya ditulis di sini agar kompatibel sejak awal.

Ringkasan akses (lihat 5.4 untuk peran):
| Kelompok koleksi | Baca anonim (REST) | Tulis anonim (REST) | Admin |
|---|---|---|---|
| Konten publik (`pages`, `services`, `testimonials`, `faqs`, `categories`, `technologies`, `projects`, `service-packages`, `service-addons`, `media`) | Hanya dokumen published/aktif | Tidak | `owner` & `editor` |
| Kalkulator & jadwal (`calculator-*`, `availability-rules`, `blocked-dates`) | Tidak (dibaca server) | Tidak | `owner` & `editor` untuk kalkulator; `owner` untuk jadwal |
| Operasional & klien (semua sisanya), `private-files`, `audit-logs`, `rate-limits` | Tidak | Tidak | Hanya `owner` |

### 3.1 Konfigurasi & Konten Situs

#### Global `site-settings`
Satu Global bertab. Setiap tab adalah satu `tabs` field; perubahan memicu `revalidateTag('settings')`.

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

#### Koleksi `pages` (Draft, Trash)
Halaman yang dibangun dengan field **`blocks`** (landing page, tentang, legal).
| Field | Tipe | Keterangan |
|---|---|---|
| `slug` | text, unik, indeks | `home`, `tentang`, `kebijakan-privasi` |
| `title` | text | |
| `layout` | blocks | daftar blok berurutan (lihat 4.2) |
| `meta` | group: `title`, `description`, `ogImage` (upload) | |

#### Koleksi `services` (Bento Grid Layanan)
| Field | Tipe | Keterangan |
|---|---|---|
| `title` | text | |
| `description` | textarea | |
| `highlights` | array (`text`) | daftar poin singkat |
| `icon` | text | nama ikon Lucide, divalidasi terhadap daftar yang diizinkan |
| `size` | select | `normal`, `wide`, `tall` (ukuran kartu bento) |
| `isActive` | checkbox, default true | |
| urutan | `orderable` bawaan Payload bila tersedia di versi terkunci; bila tidak, `sortOrder` (number) + komponen reorder | |

#### Koleksi `testimonials`
`authorName`, `authorRole` (text), `quote` (textarea), `photo` (upload), `project` (relationship ke `projects`, opsional), `isActive`, urutan.

#### Koleksi `faqs`
`question` (text), `answer` (richText), `isActive`, urutan.

### 3.2 Portofolio

#### Koleksi `categories`
| Field | Tipe | Keterangan |
|---|---|---|
| `name` | text | |
| `slug` | text, unik | |
| `icon` | text | |
| `showInFilter` | checkbox, default true | tampil sebagai tab filter |
| `isActive` | checkbox, default true | |
| urutan | `orderable` / `sortOrder` | |

Tab filter di publik dibuat otomatis dari kategori `isActive` dan `showInFilter`, ditambah tab tetap "Semua Proyek". Tidak ada nama tab yang ditulis di kode. Hook `beforeDelete` menolak penghapusan kategori yang masih dipakai paket atau proyek.

#### Koleksi `technologies`
`name` (text, unik), `slug`, `icon` (text), `color` (text, validasi hex `#RRGGBB`).

#### Koleksi `projects` (Showcase; Draft, Trash)
| Field | Tipe | Keterangan |
|---|---|---|
| `title` | text | |
| `slug` | text, unik, indeks | dibuat otomatis dari judul (hook), bisa diedit |
| `tagline` | text | |
| `clientName` | text | |
| `year` | number (integer) | |
| `publishedAt` | date | proyek tampil di publik bila `_status = published` **dan** `publishedAt <= sekarang` (pengganti penjadwalan; tanpa scheduler) |
| `featuredImage` | upload (`media`), `required` | wajib terisi **hanya saat publish** (perilaku draft Payload), bukan di database |
| `gallery` | array (`image` upload, `alt` text) | gambar tambahan |
| `summary` | textarea | ringkasan untuk kartu |
| `contentBlocks` | blocks | blok konten detail (di bawah) |
| `links` | array (`label`, `type`, `url`) | `type`: `demo`, `github`, `playstore`, `appstore`, `video`, `lainnya`; `url` hanya skema `https` |
| `isFeatured` | checkbox | |
| `categories` | relationship hasMany ke `categories` | satu proyek boleh banyak kategori |
| `technologies` | relationship hasMany ke `technologies` | urutan dipertahankan |
| `meta` | group: `title`, `description`, `ogImage` | `ogImage` kosong memakai `featuredImage` |
| urutan | `orderable` / `sortOrder` | drag-and-drop |

Jenis blok `contentBlocks`: `richText`, `image`, `gallery`, `video` (URL dibatasi ke penyedia yang diizinkan, mis. YouTube/Vimeo, dirender sebagai embed ber-*privacy mode* dan didaftarkan di CSP `frame-src`), `stats` (angka dampak), `quote`, `bullets`, dan preset `problemSolutionImpact`. Proyek lama diisi seeder memakai preset Masalah/Solusi/Dampak.

### 3.3 Paket & Penawaran

#### Koleksi `service-packages` (Trash)
| Field | Tipe | Keterangan |
|---|---|---|
| `category` | relationship ke `categories` | penghapusan kategori ditolak hook selama masih dipakai |
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
| urutan | `orderable` / `sortOrder` | |

#### Koleksi `service-addons`
`name`, `description`, `price` (integer), `billingType` (`one_time` / `monthly` / `yearly`), `isActive`, urutan. Contoh: maintenance bulanan, hosting, domain.

#### Koleksi `inquiries` (Pemesanan Paket / Permintaan Penawaran)
| Field | Tipe | Keterangan |
|---|---|---|
| `reference` | text, unik, read-only | contoh `INQ-2610-8F3K`; dibuat hook `beforeValidate` |
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

#### Koleksi `calculator-groups`
`title`, `description`, `selectionType` (select `single` / `multiple`), `isRequired`, `isActive`, urutan.

#### Koleksi `calculator-items`
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
| `rules` | array (`relatedItem` relationship, `ruleType` select `requires` / `excludes`) | **aturan antar item** (disimpan Payload sebagai tabel anak) |
| urutan | `orderable` / `sortOrder` | |

Contoh aturan: "Pemetaan GIS" `requires` "Sistem Informasi Database"; "Landing Page" `excludes` "Multi-User RBAC". Validasi `beforeValidate`: tidak ada aturan ke diri sendiri, tidak ada siklus `requires`, dan pasangan `excludes` tidak kontradiktif dengan `requires`.

#### Koleksi `quote-requests`
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

#### Koleksi `availability-rules` (jadwal mingguan berulang)
`weekday` (number 0-6), `startTime` (text `HH:mm`, WIB), `endTime` (text `HH:mm`, WIB), `isActive`. Validasi: format jam, `endTime` setelah `startTime`, rentang pada hari yang sama tidak tumpang tindih. Slot dihasilkan dari rentang ini memakai durasi dan jeda di `site-settings`.

#### Koleksi `blocked-dates`
`date` (text `YYYY-MM-DD`, WIB), `startTime` (text `HH:mm`, opsional), `endTime` (text `HH:mm`, opsional), `reason` (text). Jam kosong = seluruh hari diblokir.

#### Koleksi `consultation-bookings`
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
3. Server Action menangkap pelanggaran kendala (`23P01` untuk kendala eksklusi; `23505` bila memakai alternatif indeks unik) dan menjawab "Slot baru saja terisi, pilih jam lain". DDL acuan dan hasil uji pada PostgreSQL 16.2 (termasuk balapan 12 koneksi serentak: satu berhasil, sebelas ditolak) ada di Lampiran G.7.

### 3.6 Proyek Klien, Progres, Pembayaran (Rilis 2)

#### Koleksi `step-templates` (editable di CMS)
`stepNumber` (number 1-6), `title`, `description`, `defaultMilestones` (array `text`). Dipakai hook `beforeChange` (saat `create`) untuk mengisi `steps` pada proyek klien baru. Isi awal: enam tahap pada 4.7.

#### Koleksi `client-projects` (Trash)
| Field | Tipe | Keterangan |
|---|---|---|
| `trackingCode` | text, unik, indeks | format `PRJ-XXXXXXXX` (8 karakter dari alfabet tanpa karakter ambigu; lihat Lampiran G.5), dibuat server |
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
| `payments`, `updates`, `documents`, `revisionRequests`, `comments`, `approvals` | **join** | tampilan read-only koleksi anak di dalam halaman proyek (padanan *relation manager*); data tetap disimpan di koleksi masing-masing |

Nilai turunan (field **read-only**, tidak ada akses tulis dari admin maupun API; dihitung ulang oleh hook): `paidAmount` = jumlah `payments`, `balance` = `totalCost` - `paidAmount`, `paymentStatus` (`unpaid`, `down_payment`, `paid_off`), `currentStep` = langkah pertama yang belum `done`, `revisionsUsed` = jumlah `revision-requests` yang dihitung kuota. Hook `afterChange`/`afterDelete` pada `payments` dan `revision-requests`, serta `beforeChange` pada `client-projects` (untuk `steps`), menghitung ulang nilai ini **dalam transaksi yang sama** (`req`), sehingga `currentStep` selalu sesuai `steps` dan `paidAmount` selalu sama dengan jumlah `payments`.

`steps` disimpan sebagai array di dalam proyek karena selalu diedit bersama proyeknya; sumber kebenaran progres tetap satu.

#### Koleksi `payments`
`clientProject` (relationship, indeks), `paidAt` (date), `amount` (integer), `method` (select: transfer, tunai, QRIS), `note` (text), `proof` (upload ke `private-files`), `isVisibleToClient` (checkbox, default true).

#### Koleksi `project-updates` (timeline)
`clientProject`, `title`, `body` (richText), `isVisibleToClient` (default true), `createdBy` (relationship ke `users`).

#### Koleksi `project-documents`
`clientProject`, `title`, `type` (select `url` / `file`), `url` (text, `https`), `file` (upload ke `private-files`), `isVisibleToClient` (default true), urutan.

### 3.7 Revisi, Komentar, Persetujuan (Rilis 2)

#### Koleksi `revision-requests`
| Field | Tipe | Keterangan |
|---|---|---|
| `clientProject` | relationship, indeks | |
| `roundNumber` | number, read-only | urutan permintaan dalam proyek; dihitung hook dalam transaksi; unik bersama `clientProject` (migrasi SQL kustom) |
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

#### Koleksi `project-comments`
`clientProject`, `revisionRequest` (relationship opsional), `authorType` (select `client` / `admin`), `authorName`, `body` (textarea, teks biasa), `attachments` (array upload ke `private-files`), `isInternal` (checkbox; **hanya admin**, tidak tampil ke klien).

#### Koleksi `project-approvals`
Bukti persetujuan; **tidak dapat diubah atau dihapus** setelah dibuat (akses `update` dan `delete` tertutup untuk semua peran).
`clientProject`, `type` (select `step_review` / `final_handover`), `approvedByName`, `note`, `ipHash`, `userAgent`, `approvedAt`.

### 3.8 Pengguna, Berkas Privat, Audit, Rate Limit

* **`users`** (koleksi auth Payload): `name`, `email`, `password`, `roles` (select hasMany `owner` / `editor`), field TOTP dari plugin 2FA. `auth.maxLoginAttempts` dan `auth.lockTime` aktif (kunci akun setelah percobaan gagal), cookie `secure` + `httpOnly` + `sameSite`, `tokenExpiration` dibatasi. Pembuatan pengguna hanya oleh `owner`.
* **`media`** (upload, bucket publik R2): whitelist MIME gambar, **tanpa SVG dari pengguna**, `alt` wajib, `imageSizes` WebP: `thumb`, `card`, `hero`, `og`. Dapat dibaca anonim.
* **`private-files`** (upload, bucket privat R2; **Rilis 2**): lampiran klien, bukti bayar, dokumen. Nama file diganti acak (UUID) oleh hook `beforeValidate`; tidak ada akses baca anonim; unduhan hanya lewat **URL bertanda tangan berumur pendek** yang dibuat server setelah otorisasi (admin, atau sesi tracking untuk berkas milik proyeknya yang `isVisibleToClient`). Respons unduhan memakai `Content-Disposition: attachment` dan `X-Content-Type-Options: nosniff`.
* **`audit-logs`**: `actor` (relationship `users`, opsional), `actorType` (`admin` / `client` / `system`), `action`, `collection`, `docId`, `summary` (text), `diff` (json, tanpa data sensitif), `ipHash`. Hanya baca bagi `owner`; tidak ada update/delete. Mencatat perubahan harga, pembayaran, status, kuota revisi, penerbitan PIN, dan persetujuan.
* **`rate-limits`** (internal, tersembunyi dari menu admin): `key` (text, unik; hash kode + IP atau IP + jenis aksi), `count`, `windowStartedAt`, `lockedUntil`. Baris kedaluwarsa dibersihkan secara oportunistik saat diakses (tanpa job terjadwal).

### 3.9 Ringkasan Relasi
```
categories >-< projects >-< technologies
categories 1-* service-packages 1-* client-projects *-1 projects (opsional)
quote-requests 1-* inquiries     service-packages 1-* inquiries
calculator-groups 1-* calculator-items (rules: item >-< item)
client-projects (steps > milestones tertanam)
client-projects 1-* payments | project-updates | project-documents
client-projects 1-* revision-requests | project-comments | project-approvals
payments, project-documents, revision-requests, project-comments *-* private-files
```

---

## 4. Spesifikasi Modul Publik (Frontend Next.js)

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

**Revalidasi:** hook `afterChange`/`afterDelete` pada koleksi dan global memanggil `revalidateTag` dengan tag per entitas (`settings`, `pages`, `projects`, `packages`, `calculator`, ...), sehingga perubahan dari admin tampil di publik **tanpa deploy ulang**. Nama API revalidasi disesuaikan dengan versi Next.js yang dikunci (penamaan dan argumen `revalidateTag` berbeda antar versi mayor). **Draft preview** memakai *Draft Mode* Next.js + URL pratinjau Payload (4.2).

**Gambar:** hasil `imageSizes` Payload sudah WebP. Layani lewat `next/image`; bila kuota optimasi gambar platform terbatas (misal di Hobby), pakai `unoptimized` atau *loader* kustom yang menunjuk langsung ke ukuran turunan di R2. Cek batas platform saat Fase 0. `priority` hanya untuk gambar di atas lipatan; sisanya lazy.

### 4.2 Beranda (Page Builder)
Beranda disusun dari blok yang urutan, isi, dan visibilitasnya diatur di admin. Tampilan mengikuti Lampiran D; teks awal ada di Lampiran E. Jenis blok (tiap blok punya field `isVisible`):
`hero`, `servicesGrid` (dari `services`), `portfolioShowcase` (jumlah item, hanya unggulan/semua), `calculator`, `pricing` (dari paket aktif), `testimonials`, `faq`, `about`, `ctaBanner`, `richText`.

Bawaan seeder (semua dapat diubah/dihapus/diurutkan ulang):
* **Hero**: tagline utama, subtitle personal, trust metrics, dua CTA (kalkulator dan WhatsApp). Seluruh teks dari `site-settings`.
* **Layanan unggulan (bento)**: empat kartu awal dari seeder: Sistem Informasi & Satu Data; Aplikasi Mobile Lintas Platform; Website Bisnis & UMKM; Undangan Digital Interaktif.

**Pemetaan blok -> komponen:** setiap tipe blok punya satu komponen React server (`components/blocks/<Nama>.tsx`) dan satu definisi blok Payload (`blocks/<Nama>.ts`). Blok yang tidak dikenali dilewati dan dicatat ke Sentry (bukan menjatuhkan halaman).

### 4.3 Showcase Portofolio
* Tab filter dari `categories` aktif, difilter di sisi klien (Client Component kecil, tanpa muat ulang halaman). Proyek dengan banyak kategori muncul di semua tab terkait. Data awal dikirim dari server sebagai DTO ringkas (judul, slug, tagline, gambar kartu, id kategori, ikon teknologi).
* Hanya proyek published dengan `publishedAt <= sekarang` yang tampil.
* Kartu: gambar (WebP, lazy), judul, tagline, badge kategori, ikon teknologi.
* Halaman detail: render `contentBlocks`, galeri, daftar teknologi, tombol dari `links`, proyek terkait (kategori sama), meta SEO dan OG per proyek (Metadata API).

### 4.4 Kalkulator Estimasi Biaya
* Data grup/item/aturan dibaca server (cache bertag `calculator`, dibersihkan otomatis saat admin menyimpan) dan dikirim ke Client Component sebagai DTO.
* **Perilaku:** grup `single` memakai radio, `multiple` memakai checkbox; grup `isRequired` harus terisi; item `per_unit` menampilkan input jumlah dengan batas `maxUnits`; item yang melanggar aturan `excludes` dinonaktifkan; item yang `requires` item lain otomatis menandai/mewajibkan item tersebut.
* **Perhitungan:** total minimum = jumlah `priceMin` (dikali unit bila `per_unit`); total maksimum = jumlah `priceMax` (atau `priceMin` bila kosong). Hasil tidak boleh kurang dari `minimumPrice` di Settings. Bila min = max, tampil satu angka; bila berbeda, tampil rentang (sesuai `showRange`). Durasi dihitung sama dari `daysMin`/`daysMax`.
* **Satu mesin, dua pemakai:** perhitungan dan penegakan aturan berada di `lib/calculator` (TypeScript murni, tanpa dependensi React/Payload). Browser memakainya untuk pratinjau; Server Action memakai **modul yang sama** untuk perhitungan resmi. Uji paritas Vitest memastikan keduanya identik untuk seluruh kombinasi uji. Aturan rinci dan vektor uji: Lampiran G.1.
* **Otoritas server:** saat pengunjung menekan "Kirim Rincian Estimasi ke WhatsApp", Server Action memvalidasi masukan (zod), memeriksa Turnstile dan rate limit, **membaca konfigurasi terbaru langsung dari database** (bukan dari cache), menghitung ulang, menyimpan `quote-requests`, lalu mengembalikan URL `wa.me` terisi dari template Settings. Nilai harga kiriman browser diabaikan.
* Disclaimer ("estimasi awal, bukan penawaran final") diambil dari Settings.

### 4.5 Paket Harga & Pemesanan
* Kartu paket dibuat dari semua `service-packages` aktif (jumlah bebas, tidak terkunci tiga), menampilkan harga, harga diskon (jika `discountEndsAt` belum lewat; dihitung saat render, dan halaman direvalidasi pada waktu berakhirnya diskon bila perlu), durasi, fitur, **kuota revisi** ("termasuk 3x revisi"), dan lencana "Populer".
* Bagian add-on dari `service-addons` aktif.
* CTA kartu menuju `/pesan?paket={slug}`. Form: nama, WhatsApp (validasi `08...`/`628...`), email (opsional), instansi/bisnis, pesan, checkbox persetujuan data, Turnstile. Server Action menyimpan ke `inquiries`, lalu halaman sukses menawarkan tombol WhatsApp.

### 4.6 Booking Konsultasi
* **Slot** dihasilkan oleh `lib/booking` dari `availability-rules` dikurangi `blocked-dates` dan booking aktif, memakai durasi/jeda Settings (aturan rinci dan vektor uji: Lampiran G.2). Hanya tanggal pada rentang minimal-maksimal hari yang bisa dipilih. Semua jam ditampilkan dengan label **WIB** (`Asia/Jakarta`) apa pun zona waktu perangkat pengunjung.
* **Form:** nama, WhatsApp, email (opsional), instansi/bisnis, kategori layanan, tanggal, slot, mode (Google Meet / Telepon WhatsApp / Tatap muka), ringkasan kebutuhan, persetujuan data, Turnstile.
* **Setelah kirim:** disimpan `pending` (melewati lapisan anti double-booking di 3.5); halaman sukses menampilkan nomor referensi, tombol "Tambahkan ke Google Calendar" (link generator), dan tombol WhatsApp. Admin diberi tanda di panel (5.1) dan tombol balasan WhatsApp (tanpa email).
* **Konfirmasi oleh admin:** admin menempel `meetingUrl`, mengubah status ke `confirmed`, lalu menekan aksi "Kirim konfirmasi via WhatsApp" (template `tplBookingConfirm`).

### 4.7 Portal Pelacakan Proyek Klien (Rilis 2)

**Autentikasi (tanpa akun):**
1. Klien membuka `/tracking`, memasukkan **Kode Tracking** (`PRJ-XXXXXXXX`) dan **PIN 6 digit** (diberikan admin lewat WhatsApp). Form dikirim lewat Server Action (kode tidak ditaruh di URL).
2. Server memverifikasi (perbandingan hash waktu-konstan), lalu menerbitkan **cookie sesi bertanda tangan** (`httpOnly`, `secure`, `sameSite=lax`) berisi id proyek, `pinVersion`, dan waktu kedaluwarsa (default 120 menit dari Settings). Setiap permintaan memeriksa tanda tangan, kedaluwarsa, dan bahwa `pinVersion` masih sama dengan database; **mengganti PIN langsung mencabut seluruh sesi lama**.
3. Pembatasan lewat `rate-limits` (algoritma dan vektor: Lampiran G.6): maks. 5 percobaan gagal per kode dalam 15 menit, setelah itu kode terkunci 15 menit; pembatas tambahan per IP + kode dan per IP global. Pesan gagal selalu generik ("Kode atau PIN tidak sesuai"), dan waktu respons sengaja dibuat seragam (verifikasi hash dijalankan walau kode tidak ditemukan, untuk mencegah pembedaan kode valid/tidak lewat waktu).
4. Semua halaman tracking: `noindex`, `Cache-Control: no-store`, dirender dinamis; Server Action memakai pemeriksaan Origin bawaan Next.js dan cookie `sameSite`.

**Tampilan dasbor:**
* Header: judul proyek, nama klien, tanggal mulai, target selesai, tombol keluar (menghapus cookie).
* **Stepper 1-6** dari `steps` (status `pending`/`in_progress`/`done`) dengan checklist `milestones` per tahap dan persentase progres tahap.
* Enam tahap bawaan (dari `step-templates`, bisa diubah di CMS):
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

**Mesin status revisi** (fungsi murni `nextRevisionState()` di `lib/tracking`, dipanggil hook koleksi dan aksi admin; aturan lengkap dan vektor uji di Lampiran G.4; transisi tidak sah ditolak):
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

## 5. Spesifikasi CMS Admin (Payload)

Satu panel di `/admin` (bagian dari aplikasi Next.js yang sama). Login dengan 2FA wajib untuk **semua user admin** (`owner` dan `editor`) — plugin dengan opsi *force setup*; keputusan D-05 pemilik 27 Oktober 2026 (lihat verifikasi Fase 0). Menu dibagi tiga grup lewat `admin.group`: **Konten Website**, **Operasional Klien**, dan **Sistem**.

### 5.1 Dashboard
Komponen admin kustom (Server Component, `beforeDashboard`):
* Stat cards: proyek ditampilkan, booking baru bulan ini, inquiry & quote baru (belum dihubungi); mulai Rilis 2 ditambah proyek klien aktif, total nilai proyek aktif, dan **permintaan revisi menunggu**.
* Tabel: 5 booking terbaru dan inquiry/quote terbaru; mulai Rilis 2 juga 5 proyek klien aktif dan revisi `submitted`/`needs_payment`.
* **Panel "Perlu Tindakan"** (seluruhnya hasil query, tanpa tabel notifikasi tersendiri): booking `pending` dan inquiry/quote `new`; mulai Rilis 2 juga revisi dan komentar klien baru sejak kunjungan terakhir, serta proyek klien yang tahap 6-nya `done` tetapi belum punya `project` portofolio (usulan "Jadikan Proyek Portofolio", 5.6). Masing-masing punya tombol aksi/WhatsApp.

### 5.2 Grup "Konten Website"
| Menu | Fungsi |
|---|---|
| **Site Settings** (Global) | Halaman bertab (Umum, Hero, Navigasi & Footer, SEO, WhatsApp, Kalkulator, Booking, Tracking, Legal) |
| **Halaman** | CRUD `pages` dengan field blocks; atur urutan blok (drag-and-drop pada array), sembunyikan blok (`isVisible`), pratinjau draft (Draft Mode), riwayat versi |
| **Layanan (Bento)** | CRUD `services`, reorder |
| **Proyek (Showcase)** | Form: judul, slug otomatis, kategori (multi), teknologi (multi, bisa tambah baru dari field relasi), tahun, klien, tagline, gambar utama (WebP otomatis), galeri, ringkasan, **blocks konten**, array link, SEO; draft/publish dengan `publishedAt`; toggle unggulan; **reorder**, **Duplicate** (bawaan Payload), **Preview draft**, arsip/restore (trash), aksi massal publish/unpublish (bawaan list view bila tersedia di versi terkunci) |
| **Kategori** | CRUD, toggle `showInFilter`, reorder |
| **Teknologi** | CRUD (nama, ikon, warna) |
| **Testimoni, FAQ** | CRUD, reorder, aktif/nonaktif |
| **Paket Layanan** | Harga, diskon + tanggal berakhir, durasi, array fitur, **kuota revisi**, **harga revisi tambahan**, kebijakan revisi, toggle populer/aktif |
| **Add-on** | CRUD |
| **Kalkulator** | Grup -> item (daftar item terfilter per grup lewat field `join` pada grup) -> aturan (array `rules`: requires/excludes), harga min/max, durasi, tipe per unit, aktif; setiap simpan memicu revalidasi `calculator` |
| **Media** | Pustaka gambar (bucket publik), alt wajib |

### 5.3 Grup "Operasional Klien"
Rilis 1 hanya memuat menu Quote Kalkulator, Inquiry / Pemesanan, dan Booking Konsultasi. Menu Proyek Klien dan turunannya, Template Tahap, serta aksi "Jadikan Proyek Klien" ditambahkan pada Rilis 2.

| Menu | Fungsi |
|---|---|
| **Quote Kalkulator** | Daftar hasil kalkulasi, ubah status, aksi "Hubungi via WhatsApp" |
| **Inquiry / Pemesanan** | Daftar, filter status, catatan admin, aksi WhatsApp, "Jadikan Proyek Klien" (mengisi data otomatis) |
| **Booking Konsultasi** | Filter status; aksi **Konfirmasi** (isi `meetingUrl`, kirim template WA); jadwal mingguan (`availability-rules`) dan `blocked-dates` dikelola di sini |
| **Proyek Klien** | Form data proyek; tombol **Generate Kode & PIN** (PIN tampil sekali, bisa diganti kapan saja; mengganti PIN menaikkan `pinVersion`); bagian `join`: Pembayaran, Timeline, Dokumen, Revisi, Komentar, Persetujuan; array **Tahap & Milestone**; grup visibilitas; aksi "Buka/Tutup Review", **"Jadikan Proyek Portofolio"** (5.6), "Kirim Link Tracking via WhatsApp" (kode + tautan; **PIN dikirim terpisah** oleh admin) |
| **Pembayaran, Timeline, Dokumen, Revisi, Komentar, Persetujuan** | Daftar lintas proyek dengan filter; pembuatan terutama dari halaman proyek |
| **Template Tahap** | Edit judul, deskripsi, dan checklist bawaan enam tahap |

### 5.4 Grup "Sistem", Peran & Izin
| Menu | Fungsi |
|---|---|
| **Pengguna** | Kelola akun, role `owner` dan `editor`, atur ulang 2FA (hanya `owner`) |
| **Log Aktivitas** | `audit-logs`, hanya baca |
| **Berkas Privat** (Rilis 2) | Daftar `private-files` (hanya `owner`) |

| Role | Akses |
|---|---|
| `owner` | Semua modul, termasuk pengguna dan log |
| `editor` | Hanya grup "Konten Website" (tanpa tab Settings `whatsapp`/`tracking`, tanpa data klien, tanpa Sistem) |

Fungsi akses dipusatkan di `src/access/*` dan diuji Vitest (matriks peran x koleksi x operasi). **Bawaan tertutup**: koleksi baru tanpa fungsi akses eksplisit dianggap kesalahan oleh uji matriks.

### 5.5 Template WhatsApp (editable)
Placeholder yang didukung: `{nama}`, `{referensi}`, `{platform}`, `{rincian}`, `{estimasi_harga}`, `{estimasi_durasi}`, `{tanggal}`, `{jam}`, `{meeting_url}`, `{kode_tracking}`, `{link_tracking}`, `{nama_proyek}`, `{judul_revisi}`, `{sisa_kuota}`. Placeholder yang tidak dikenal ditolak saat simpan (fungsi `validate` pada field template, memakai modul `lib/whatsapp` yang sama dengan pembuat tautan). Pesan di-URL-encode otomatis; nomor dinormalisasi `08...` -> `628...` (aturan dan vektor: Lampiran G.3).

### 5.6 Aksi "Jadikan Proyek Portofolio" (Rilis 2)
1. **Usulan otomatis:** proyek klien yang tahap 6-nya `done` dan belum tertaut ke `projects` muncul di panel "Perlu Tindakan" dengan tombol aksi (query, bukan notifikasi tersimpan).
2. **Aksi** (juga tersedia manual di halaman Proyek Klien yang tahap 6-nya `done`): tombol komponen admin kustom memanggil endpoint kustom yang hanya dapat dipanggil `owner`; membuat `projects` berstatus **draft** dan mengisi otomatis judul, kategori, tahun (dari tanggal selesai), URL produksi sebagai link `demo`, serta mengisi `client-projects.project`.
3. **Izin klien:** modal aksi memuat checkbox "Saya sudah mendapat izin klien untuk menampilkan proyek ini". Nama klien hanya disalin bila dicentang; bila tidak, proyek tampil tanpa nama klien.
4. **Data sensitif tidak pernah disalin:** WhatsApp, email, biaya, pembayaran, catatan internal, kode/PIN tracking.
5. Admin diarahkan ke form Proyek untuk melengkapi gambar, ringkasan, konten, dan teknologi, lalu meng-**publish** secara manual.

### 5.7 Aksi Kustom Admin (daftar pekerjaan di luar fitur bawaan Payload)
Fitur berikut **tidak tersedia siap pakai** di Payload dan dibangun sebagai komponen admin kustom (UI field/tombol di dokumen) yang memanggil endpoint kustom berakses `owner` (penyebab utama Fase 2 dan 6 lebih panjang dari sekadar konfigurasi). Dashboard, panel "Perlu Tindakan", dan aksi WhatsApp dibangun di Fase 2 (Rilis 1); aksi terkait proyek klien dan revisi di Fase 6 (Rilis 2):
* Generate/ganti Kode & PIN (tampil sekali, menaikkan `pinVersion`).
* Buka/Tutup Review; Kirim konfirmasi/link tracking via WhatsApp (pembuat `wa.me`).
* Jadikan Proyek Portofolio; Jadikan Proyek Klien (dari inquiry).
* Dashboard dan panel "Perlu Tindakan".
* Tombol terima/tolak revisi dan isi harga yang menjalankan mesin status (4.8).
* Reset 2FA oleh `owner` (bergantung pada plugin).

---

## 6. Persyaratan Non-Fungsional

### 6.1 Performa
* LCP maksimal **1,8 detik** pada 4G untuk beranda dan halaman proyek. Halaman publik dilayani statis dengan revalidasi bertag sehingga tidak menyentuh database pada setiap kunjungan.
* Pengaturan, halaman, dan data kalkulator memakai cache bertag Next.js; invalidasi lewat hook `afterChange` Payload saat disimpan.
* Gambar: WebP dari `imageSizes` Payload, `srcset`/`sizes` responsif, lazy kecuali gambar di atas lipatan; font lewat `next/font` (di-*self-host*).
* **Anggaran bundel:** JavaScript klien hanya untuk filter showcase, kalkulator, booking, dan form; blok statis tetap Server Component. Panel admin Payload tidak boleh ikut termuat di rute publik (route group `(payload)` terpisah).
* Query: `depth` dan `select` eksplisit, indeks pada kolom filter (2.2), tanpa N+1.
* **Serverless:** koneksi database *pooled* dengan ukuran pool kecil per instance; rute dinamis (`/konsultasi`, `/tracking*`) menerima *cold start* dan query pertama setelah Neon *suspend*; halaman statis tidak terpengaruh.
* Produksi memakai hosting tanpa *spin-down* yang merusak pengalaman (lihat 7.7).

### 6.2 Keamanan
* **Permukaan API Payload:** REST bawaan hanya melayani baca anonim untuk konten publik yang published/aktif; koleksi klien/operasional tertutup (3, ringkasan akses); **GraphQL dinonaktifkan** (`graphQL.disable`); tidak ada operasi tulis anonim. Seluruh penulisan publik lewat Server Action (2.4).
* **CSRF/CORS:** `csrf` dan `cors` Payload dibatasi ke origin situs; Server Action memakai pemeriksaan Origin Next.js; cookie `sameSite`.
* **XSS:** React meng-escape keluaran secara bawaan. Konten rich text (Lexical JSON) dirender lewat komponen yang hanya mengenali node yang diizinkan; **URL tautan divalidasi (hanya `https`, `http`, `mailto`, `tel`)**. HTML mentah (bila ada, mis. dari impor) wajib disanitasi sebelum `dangerouslySetInnerHTML`. Teks klien (komentar, revisi) tidak pernah dirender sebagai HTML.
* **SQL Injection:** semua query lewat Local API/Drizzle berparameter; SQL mentah hanya di migrasi dan tidak memakai input pengguna.
* **Rate limiting** (tabel `rate-limits`): login tracking (5/15 menit per kode, plus per IP), komentar & revisi (mis. 10/menit per sesi), semua form publik, login admin (selain `maxLoginAttempts` Payload). IP klien diambil dari header proxy yang **dipercaya sesuai platform** (satu fungsi `getClientIp()` yang dikonfigurasi per hosting; header tidak dipercaya buta).
* **Admin:** 2FA TOTP untuk `owner`, kata sandi kuat (validasi panjang/kompleksitas; hash bawaan Payload), kunci akun setelah percobaan gagal, cookie `secure`/`httpOnly`/`sameSite`, masa token terbatas. **Reset sandi `owner` lewat skrip CLI** (`pnpm owner:reset`, memakai Local API dengan environment produksi), karena Payload tidak memakai email.
* **Upload:** whitelist MIME + ekstensi, **tanpa SVG dari pengguna**, nama file acak untuk bucket privat, batas ukuran, bucket R2 privat untuk lampiran klien (akses via URL bertanda tangan berumur pendek), `nosniff` dan `attachment` pada unduhan.
* **Header & CSP:** `Content-Security-Policy` (berbasis nonce di middleware/proxy Next.js bila memungkinkan; rute `/admin` mungkin memerlukan kebijakan lebih longgar untuk Payload, dipisah per rute), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS (di aplikasi atau platform). `frame-src` dibatasi untuk embed video yang diizinkan.
* **Anti-spam:** Turnstile (diverifikasi di server) + honeypot pada form publik.
* **Rahasia:** semua kunci di environment variable platform dan GitHub Secrets; tidak ada kredensial di repositori; variabel berawalan `NEXT_PUBLIC_` dianggap publik dan hanya dipakai untuk nilai yang memang publik (mis. *site key* Turnstile).
* **Dependensi:** audit dependensi di CI (`pnpm audit`), versi dikunci, pembaruan terjadwal.
* **Cadangan:** lihat 7.5.

### 6.3 Privasi & Kepatuhan (UU PDP)
* Halaman Kebijakan Privasi editable (draf awal: Lampiran F); checkbox persetujuan pada form booking, inquiry, dan kalkulator (`consentAt` tersimpan).
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
* Kontras WCAG AA (palet bawaan sudah diverifikasi, Lampiran D.2), teks alternatif gambar (field `alt` wajib pada `media`), navigasi keyboard, label form jelas, fokus terlihat.

### 6.6 Lokalisasi
* Locale `id`, zona waktu tampilan `Asia/Jakarta`, tanggal "19 Oktober 2026", Rupiah tanpa desimal pada tampilan, semua pesan validasi (zod) dan error dalam bahasa Indonesia.
* Panel admin: bahasa Indonesia bila terjemahan Payload tersedia di versi terkunci (menimpa label lewat `i18n.translations` bila perlu); bila tidak, antarmuka admin boleh berbahasa Inggris dengan label field/koleksi tetap berbahasa Indonesia (12.3).

### 6.7 Observabilitas
* Sentry (`@sentry/nextjs`) untuk error server dan klien, log aplikasi ke stdout (retensi log platform terbatas, jadi Sentry adalah catatan utama), *uptime monitor* eksternal pada beranda (statis, tidak menyentuh database) dan `/health` (memeriksa database).
* Interval pemantauan `/health` diset secukupnya (mis. >= 5 menit) dan pemakaian compute Neon dipantau, karena pemeriksaan yang terlalu sering membuat Neon tidak pernah *suspend* dan menghabiskan jatah gratis.

---

## 7. Deployment & Operasional

### 7.1 Layanan
| Layanan | Platform | Catatan |
|---|---|---|
| Aplikasi Next.js (situs + admin + endpoint) | **Pengembangan/staging: Vercel Hobby.** Produksi: diputuskan sebelum Rilis 1 (7.7) | Satu deployment; variabel lingkungan per lingkungan; migrasi dijalankan sebagai langkah terpisah sebelum rilis |
| Scheduler / queue worker | **Tidak dipakai** | Tidak ada proses persisten; job queue Payload **tidak diaktifkan**; jadwal tayang memakai `publishedAt`; backup lewat GitHub Actions |
| Database | Neon PostgreSQL | Region Singapura; branch `main` (produksi) dan `dev` (staging/preview) |
| Backup | GitHub Actions | `pg_dump` harian, terenkripsi, ke bucket R2 terpisah (aturan lifecycle 30 hari); versi `pg_dump` sama dengan versi mayor PostgreSQL Neon |
| Storage | Cloudflare R2 | bucket publik (gambar situs); bucket privat (lampiran, bukti bayar) ditambahkan pada Rilis 2 |
| Domain & SSL | Belum ada; sementara domain bawaan platform, wajib dibeli sebelum Rilis 1 (7.6) | TLS otomatis platform |

### 7.2 Variabel Lingkungan Utama
`PAYLOAD_SECRET`, `SITE_URL` (dan `NEXT_PUBLIC_SITE_URL` bila dibutuhkan klien), `DATABASE_URI` (URL *pooled* untuk runtime), `DATABASE_URI_DIRECT` (untuk migrasi; konfigurasi memilihnya saat perintah migrasi dijalankan), `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_PUBLIC`, `R2_BUCKET_PRIVATE` (Rilis 2), `R2_PUBLIC_BASE_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `SENTRY_DSN` (+ token sourcemap di CI), `IP_HASH_SALT`, `TRACKING_SESSION_SECRET` (Rilis 2), `WA_DEFAULT_NUMBER` (cadangan bila Settings kosong), `TRUSTED_IP_HEADER` (nama header IP klien sesuai platform). Seluruhnya divalidasi saat start oleh skema zod (`env.ts`); aplikasi gagal start bila ada yang kurang (variabel bertanda Rilis 2 opsional sampai Rilis 2).

### 7.3 Pipeline
1. GitHub Actions pada setiap PR: ESLint, `tsc --noEmit`, `payload generate:types` (tanpa diff), Vitest (unit) dan Playwright (e2e inti) terhadap Postgres (service container), `pnpm audit`.
2. Merge ke `main` -> deploy otomatis oleh platform hosting.
3. Build: `pnpm install --frozen-lockfile`, `next build` (menjalankan `generate:importmap` Payload sesuai template).
4. **Migrasi:** `payload migrate` memakai koneksi **direct** Neon, dijalankan sebagai langkah terpisah **sebelum** rilis aktif (di Vercel: bagian dari build command atau job CI; di Render: pre-deploy command). Preview/staging menunjuk ke branch Neon `dev`, produksi ke `main`; preview tidak pernah memigrasi `main`.
5. Migrasi harus aman untuk rilis tanpa downtime (tambah kolom nullable dulu, hapus kolom di rilis berikutnya), karena versi kode lama masih berjalan sesaat selama migrasi baru sudah diterapkan.
6. Setelah migrasi, `pnpm seed` hanya dijalankan manual pada lingkungan baru (idempotent, 8).

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
| Render (instance berbayar terkecil) | Proses selalu hidup (tanpa serverless), biaya tetap rendah | Memori instance kecil mungkin tidak cukup untuk Next.js + Payload; **uji di Fase 0**; cache revalidasi berada di satu instance |
| VPS/Docker (mis. Coolify) | Murah, proses persisten penuh | Operasi server menjadi tanggung jawab sendiri |
| Render free | Gratis | **Tidak untuk produksi**: tidur setelah 15 menit idle dan butuh sekitar satu menit untuk bangun; hanya untuk uji |

**Aturan portabilitas (wajib dipatuhi sejak Fase 0):**
* Tidak memakai Vercel Blob, KV, Edge Config, Cron, atau paket `@vercel/*`; storage selalu R2, database selalu Neon via `@payloadcms/db-postgres`.
* Tidak ada pekerjaan latar atau cron; bila kelak dibutuhkan, itu pemicu pindah ke hosting dengan proses persisten.
* Konfigurasi platform (header IP klien, URL, variabel) dibaca dari environment, bukan di-hardcode.
* Build dan migrasi dapat dijalankan dari CI dengan perintah biasa (`pnpm build`, `pnpm payload migrate`).
* `Dockerfile` cadangan disiapkan dan diuji sekali sehingga aplikasi dapat berjalan di host Node/Docker mana pun.
* Keputusan hosting produksi dicatat di 12.1 setelah diputuskan.

---

## 8. Data Awal (Seeder)

Seeder (`pnpm seed`, skrip Local API Payload) mengisi data awal; **setelah itu semuanya dikelola dari admin** (diedit, diganti, atau dihapus). Seeder **idempotent**: memakai *upsert* berdasarkan `slug`/`reference`/kunci alami, sehingga aman dijalankan ulang tanpa menimpa suntingan pemilik dan tidak menggandakan data. Seeder tidak pernah dijalankan otomatis pada produksi; hanya manual pada lingkungan baru.

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
* **Paket, add-on, kalkulator**: lihat 8.4 (harga awal setara freelancer junior; semua dapat diubah di CMS).
* **Kontak & kebijakan**: lihat 8.5 dan Lampiran C.
* **Konten teks**: seluruh teks awal (hero, layanan, Tentang, FAQ, meta, ringkasan proyek) dari Lampiran E. Konten yang masih memuat `[ISI]` dibuat sebagai draft dan tidak boleh dipublikasikan.
* **Jadwal booking**: Senin-Jumat dengan rentang 09:00-11:00, 13:00-15:00, 16:00-18:00, 19:30-21:30 WIB; durasi slot 60 menit, jeda 0, `minDaysAhead` 1, `maxDaysAhead` 30 (Lampiran G.2).
* **Template Tahap** (Rilis 2): enam tahap pada 4.7 beserta checklist standar.
* **Template WhatsApp**: teks bawaan untuk kalkulator, pemesanan, konfirmasi booking, link tracking, dan notifikasi revisi (Lampiran A).
* **Bento**: empat layanan unggulan pada 4.2.
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

### 9.1 CMS & Konten
- [ ] Mengubah headline hero, trust metrics, menu, dan footer di Site Settings langsung tampil di beranda tanpa deploy ulang (revalidasi bertag).
- [ ] Menambah, menyembunyikan, dan mengurutkan ulang blok beranda dari admin berfungsi.
- [ ] Proyek `draft` tidak tampil di publik; proyek tanpa gambar utama tidak bisa di-publish; proyek dengan `publishedAt` di masa depan belum tampil.
- [ ] Proyek dengan dua kategori tampil di kedua tab filter; tab filter mengikuti kategori di admin.
- [ ] Mengganti urutan proyek lewat drag-and-drop mengubah urutan di publik.
- [ ] Gambar yang diunggah tersedia dalam WebP dan **tetap ada setelah redeploy** (tersimpan di R2); unggahan dari admin tidak terbentur batas ukuran body platform.
- [ ] Teks WA dapat diubah di Settings; placeholder tidak dikenal ditolak.
- [ ] Pratinjau draft (Draft Mode) menampilkan perubahan yang belum dipublikasikan hanya untuk admin yang login.
- [ ] Tidak ada konten terbit yang masih memuat `[ISI]`; semua klaim di halaman publik dapat dibuktikan (tanpa testimoni atau angka karangan).
- [ ] Tampilan mengikuti Lampiran D (token, tipografi, komponen); kontras sesuai D.2.

### 9.2 Kalkulator, Paket, Booking
- [ ] Mengubah harga item di admin mengubah hasil kalkulator publik (setelah revalidasi `calculator`).
- [ ] Item `excludes`/`requires` bekerja; grup wajib divalidasi; hasil tidak di bawah harga minimum.
- [ ] Manipulasi nilai harga di browser tidak mempengaruhi `quote-requests` (dihitung ulang server dari database).
- [ ] **Uji paritas:** modul kalkulator menghasilkan angka identik di browser dan server untuk seluruh kombinasi uji, dan seluruh vektor Lampiran G (G.1-G.6) lulus sebagai fixture Vitest.
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
- [ ] **Uji matriks akses:** setiap koleksi punya fungsi akses eksplisit; anonim tidak bisa membaca/menulis koleksi klien, operasional, `private-files`, `audit-logs`, atau `rate-limits` lewat REST; GraphQL mati; `accessPinHash` tidak pernah muncul di respons API mana pun.
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
[Fase 0: Fondasi & Verifikasi] -> [Fase 1: Koleksi & Data] -> [Fase 2: Admin Payload]
        -> [Fase 3: Frontend Publik] -> [Fase 4: Kalkulator, Paket, Booking]
        -> [Fase 5: Konten, QA, Hosting Produksi]  ==> RILIS 1
        -> [Fase 6: Portal Klien (Tracking, Revisi, Persetujuan)]  ==> RILIS 2
```

| Fase | Rilis | Isi utama | Perkiraan usaha* |
|---|---|---|---|
| 0 | 1 | Repo pnpm, scaffold Next.js + Payload (template resmi), Tailwind, Neon (branch main/dev, URL pooled/direct), R2 (bucket publik, `r2.dev` sementara), Vercel Hobby, CI (lint, tsc, Vitest, Playwright), backup harian, Sentry, `env.ts`. **Verifikasi paket (12.3):** plugin 2FA, i18n `id`, `orderable`, trash, bulk publish, adaptor S3, kompatibilitas versi, `Dockerfile` cadangan, uji memori/ukuran build | 2-4 hari |
| 1 | 1 | Koleksi dan global Rilis 1 (bagian 3 kecuali 3.6-3.7), access control + uji matriks, hook (reference, audit, revalidasi), migrasi (termasuk SQL kustom: kendala eksklusi booking, indeks), seeder (bagian 8) | 3-5 hari |
| 2 | 1 | Konfigurasi admin: grup menu, Site Settings, Pages (blocks), Services, Projects, Categories, Technologies, Packages, Calculator (join/rules), Testimoni/FAQ, role & 2FA, draft/preview; komponen admin kustom Rilis 1 (5.7): dashboard + "Perlu Tindakan", aksi WhatsApp | 7-10 hari |
| 3 | 1 | Layout Tailwind, komponen blok, beranda, showcase + detail proyek, SEO/OG/JSON-LD, halaman legal & error, revalidasi bertag | 6-8 hari |
| 4 | 1 | Modul `lib/calculator` + `lib/booking` (TS murni + uji), UI kalkulator, `quote-requests`, paket & inquiry, booking + availability, WA builder, Turnstile, rate limit | 6-8 hari |
| 5 | 1 | **Putuskan dan siapkan hosting produksi (7.7)**, beli & pasang domain, input konten (6 proyek, gambar), QA responsif & aksesibilitas, uji keamanan, uji beban ringan, backup & restore, **Rilis 1** | 4-6 hari |
| 6 | 2 | Koleksi 3.6-3.7 + `private-files` (migrasi tambahan), bucket R2 privat, tracking (PIN, sesi cookie, `pinVersion`, lockout), stepper, pembayaran, timeline, dokumen, revisi (mesin status), komentar, persetujuan, unggah lampiran privat; komponen admin kustom Rilis 2 (Generate PIN, Buka/Tutup Review, Jadikan Proyek Klien/Portofolio, terima/tolak revisi); QA & uji keamanan portal; aktifkan `trackingEnabled`; **Rilis 2** | 11-14 hari |

\*Perkiraan kasar untuk satu pengembang, belum diuji. **Rilis 1 setelah Fase 5: 28-41 hari kerja; total sampai Rilis 2: 39-55 hari kerja.** Akan berubah mengikuti ketersediaan waktu, kompleksitas desain, dan hasil verifikasi Fase 0. Bila verifikasi Fase 0 menemukan fitur yang tidak tersedia (mis. 2FA, trash, orderable), tambahkan 1-3 hari per fitur untuk implementasi kustom.

**Mengapa bertahap:** situs company dapat segera diindeks Google dan mulai menghasilkan inquiry, sementara portal klien (bagian terberat dan baru dibutuhkan setelah ada klien berjalan) tidak menunda peluncuran. Fase 6 dimulai ketika proyek klien pertama mendekati tahap Review atau bila pemilik memutuskan lebih awal.

### 10.1 Kriteria Selesai per Fase
Sebuah fase dianggap selesai hanya bila **semua** butir berikut terpenuhi.

| Fase | Selesai bila |
|---|---|
| 0 | Aplikasi kosong berjalan lokal (`pnpm dev`) dan di Vercel Hobby (preview) terhubung ke Neon `dev`; migrasi pertama berjalan lewat koneksi direct; `owner` bisa login dengan 2FA wajib; unggahan gambar ke R2 (client upload) berhasil dan tampil; CI hijau; workflow backup berhasil dijalankan manual dan berkas terenkripsi **berhasil dipulihkan** ke database kosong; Sentry menerima galat uji; `Dockerfile` cadangan terbukti jalan; seluruh item 12.3 berstatus terverifikasi atau memiliki keputusan fallback tercatat; hasil uji memori/build tercatat; dokumen ini diperbarui menjadi 1.4.1 |
| 1 | Seluruh koleksi dan global Rilis 1 ada; uji matriks akses lulus; migrasi dari database kosong lulus di CI; seeder idempotent (dijalankan dua kali, jumlah data tetap); kendala eksklusi booking lulus uji G.7 di Neon |
| 2 | `owner` dapat mengelola semua konten Rilis 1 dari admin tanpa menyentuh kode; `editor` terbatas sesuai 5.4; dashboard dan panel "Perlu Tindakan" menampilkan data uji; draft dan pratinjau berfungsi; label admin berbahasa Indonesia (atau keputusan fallback 6.6) |
| 3 | Seluruh halaman Rilis 1 tampil sesuai Lampiran D; LCP mobile <= 1,8 detik pada data seeder; SEO dasar valid (title, meta, canonical, sitemap, JSON-LD); perubahan dari admin tampil di publik <= 60 detik tanpa deploy ulang |
| 4 | Seluruh AC 9.2 lulus, termasuk uji paritas, uji balapan e2e, dan fixture Lampiran G; Turnstile dan rate limit aktif |
| 5 | AC 9.1, 9.2, dan 9.4 (bagian Rilis 1) lulus **di lingkungan produksi**; tidak ada `[ISI]` tersisa pada konten terbit; hosting produksi dan domain aktif; pemulihan cadangan diuji; sitemap diajukan ke Google Search Console; Rilis 1 diumumkan |
| 6 | AC 9.3 lulus; uji keamanan mandiri portal tidak menembus: brute force kode/PIN, akses data proyek lain (IDOR), unduh berkas privat tanpa sesi, XSS lewat komentar, aksi tanpa pemeriksaan Origin; `trackingEnabled` dinyalakan; kebijakan revisi dan privasi diperbarui; Rilis 2 diumumkan |

---

## 11. Risiko & Asumsi

| Risiko / Asumsi | Dampak | Mitigasi |
|---|---|---|
| Next.js dan Payload berganti versi dengan cepat; Payload 4 masih beta | Upgrade memakan waktu; contoh kode usang; beta tidak stabil | Pakai Payload 3.x stabil yang dikunci (bukan beta), jangan menaikkan Next.js di luar rentang peer, jadwalkan upgrade berkala, uji otomatis, baca catatan rilis sebelum upgrade |
| Admin kustom di luar fitur bawaan Payload (dashboard, aksi kustom, notifikasi) | Fase 2 dan 6 lebih panjang | Daftar pekerjaan kustom eksplisit (5.7); notifikasi dari query, bukan tabel baru |
| 2FA admin bukan fitur inti Payload; bergantung plugin komunitas | Plugin tertinggal dari versi Payload atau berhenti dirawat | Verifikasi Fase 0; fallback TOTP kustom (`otplib`); `owner` tunggal dengan kode pemulihan |
| REST API otomatis Payload membuka koleksi yang lupa dikunci | Kebocoran data klien | Akses tertutup secara bawaan, uji matriks akses wajib lulus di CI, GraphQL mati, field sensitif tanpa akses baca |
| Vercel Hobby tidak boleh dipakai produksi komersial | Proyek berisiko dijeda bila dipakai live di Hobby | Hobby hanya untuk pengembangan/staging; hosting produksi diputuskan dan dibiayai sebelum Rilis 1 (7.7) |
| Budget hosting terbatas | Penundaan Rilis 1 atau kompromi kualitas | Aturan portabilitas (7.7); bandingkan opsi di Fase 5; Render free/Hobby tidak dipakai untuk produksi |
| Serverless: *cold start* dan Neon *suspend* | Query pertama lebih lambat pada rute dinamis | Halaman publik statis; koneksi pooled dengan pool kecil; pemeriksaan uptime tidak terlalu sering (6.7) |
| Batas body request dan ukuran fungsi pada platform serverless | Unggahan gagal; build/fungsi terlalu besar | *Client uploads* ke R2; URL unggah bertanda tangan; pantau ukuran build di Fase 0 |
| Payload menyimpan blocks/array/relasi di banyak tabel | Migrasi besar dan sulit dibaca | Tinjau SQL migrasi sebelum dijalankan; migrasi aman tanpa downtime; uji restore |
| Objek SQL kustom (kendala eksklusi) tidak dikenal Payload | Terhapus bila memakai mode *push* | Selalu pakai migrasi, matikan *push*; tes migrasi dari nol di CI |
| Revalidasi cache bergantung runtime hosting | Konten usang bila hosting berganti | Uji perilaku revalidasi di hosting terpilih sebelum Rilis 1 (Fase 5) |
| Skema Rilis 2 perlu berubah setelah Rilis 1 berjalan | Migrasi rumit pada data produksi | Koleksi Rilis 2 didesain lengkap di bagian 3 sejak awal dan hanya ditambahkan, tidak mengubah koleksi Rilis 1 |
| Penyalahgunaan tracking (brute force), Rilis 2 | Kebocoran data klien | Kode 8 karakter + PIN 6 digit + lockout + rate limit + log + pencabutan sesi saat PIN diganti |
| Sengketa soal definisi revisi | Konflik dengan klien | Kebijakan revisi tertulis, snapshot per proyek, bukti persetujuan tak dapat diubah |
| Konten, gambar proyek, dan teks `[ISI]` belum siap saat Fase 5 | Rilis 1 tertunda | Lampiran E dan I; siapkan konten paralel sejak Fase 3; konten `[ISI]` tidak boleh terbit |
| Spam pada form publik | Data kotor, beban admin | Turnstile + honeypot + rate limit |
| Data pribadi klien (WA, email, nama) | Risiko hukum UU PDP | Persetujuan, retensi, hash IP, kebijakan privasi |
| Belum punya domain | `r2.dev` tidak untuk produksi; tautan tracking tidak profesional | Beli domain sebelum Rilis 1 (7.6); link tracking baru dikirim ke klien setelah domain aktif |
| Harga awal terlalu rendah/tinggi | Margin buruk atau sepi peminat | Ubah harga langsung di CMS; tinjau setelah 3-5 proyek |

**Asumsi:** pemilik adalah satu-satunya admin awal; Cloudflare R2 dipakai untuk storage (dapat diganti penyedia S3-compatible lain); harga awal mengikuti 8.4 dan ditinjau ulang setelah beberapa proyek pertama; pengembang tunggal memahami TypeScript dan React; tidak ada kebutuhan pekerjaan latar sampai fase berikutnya.

---

## 12. Keputusan Pemilik & Item Tersisa

### 12.1 Keputusan
| # | Topik | Keputusan |
|---|---|---|
| 1 | Harga awal | Setara freelancer junior; nilai awal di 8.4, dapat diubah di CMS kapan saja |
| 2 | Kuota revisi | Naik sesuai harga paket: 2 / 3 / 4 revisi; biaya tambahan Rp 100.000 / 250.000 / 300.000 |
| 3 | Kontak | WhatsApp 0895386011371; email izzatfarahidi@gmail.com |
| 4 | Domain | Belum punya; rencana pada 7.6 |
| 5 | Notifikasi admin | Panel admin + WhatsApp; tanpa email |
| 6 | Proyek selesai ke portofolio | Ya, diusulkan otomatis (5.6) |
| 7 | Retensi data | Ditunda; belum diaktifkan |
| 8 | **Stack** | **Next.js + Payload CMS + Tailwind CSS**; NestJS tidak dipakai pada rilis ini (opsi fase berikutnya bila API terpisah dibutuhkan) |
| 9 | **Database & storage** | PostgreSQL di Neon; Cloudflare R2 (dua bucket) |
| 10 | **Hosting pengembangan** | Vercel Hobby sampai persiapan Rilis 1 |
| 11 | **Hosting produksi** | **Belum diputuskan**; wajib diputuskan sebelum Rilis 1 (7.7) |
| 12 | **Rilis bertahap** | Rilis 1: situs company, portofolio, kalkulator, paket, booking. Rilis 2: portal klien (tracking, revisi, persetujuan) |

### 12.2 Item Tersisa
Setiap item punya nilai bawaan di Lampiran I, sehingga pembangunan tidak tertahan.

1. Putuskan hosting produksi dan anggarannya sebelum Rilis 1 (7.7); hasil uji memori/build Fase 0 menjadi masukan.
2. Pilih dan beli domain sebelum Rilis 1 (7.6).
3. Tinjau ulang harga setelah 3-5 proyek pertama.
4. Tetapkan kebijakan retensi data sebelum ada data klien nyata dalam jumlah besar.
5. Konfirmasi teks kebijakan revisi (Lampiran C), terutama masa revisi 14 hari dan garansi bug 30 hari (usulan), sebelum Rilis 2.
6. Siapkan teks final Kebijakan Privasi sebelum Rilis 1.

### 12.3 Hasil Verifikasi (26 Oktober 2026) dan Sisa Verifikasi Fase 0

**Sudah terverifikasi** (registri npm, definisi tipe `payload@3.92.0`, dokumentasi resmi, dan uji langsung):
| # | Item | Hasil |
|---|---|---|
| 1 | Versi | `payload` 3.92.0 adalah rilis stabil terbaru; Payload 4 masih beta (`4.0.0-beta.4`), tidak dipakai |
| 2 | Kompatibilitas | `@payloadcms/next@3.92.0` mensyaratkan `next >=16.3.3 <17` dan Node `^22.23.4 \|\| >=24.22.1` |
| 3 | 2FA | `payload-totp@3.0.6` ada, peer `payload ^3.88.0`, diperbarui 4 Oktober 2026 |
| 4 | Bahasa admin | Terjemahan Indonesia (`id`) ada di `@payloadcms/translations@3.92.0` |
| 5 | Opsi konfigurasi | Ada di definisi tipe 3.92.0: `orderable`, `trash`, `disableDuplicate`, field `join`, drafts (`validate`, `schedulePublish`), `graphQL.disable`, `csrf`, `cors`, auth `maxLoginAttempts`/`lockTime`/`tokenExpiration`/`forgotPassword`, `admin.group`/`admin.hidden` |
| 6 | Storage R2 | `@payloadcms/storage-s3` mendukung R2 lewat API S3 (region `auto`, endpoint akun, `forcePathStyle`) dengan opsi `clientUploads` dan `signedDownloads` (dokumentasi Payload) |
| 7 | REST dan GraphQL | Untuk mematikan REST sepenuhnya, dokumentasi menyarankan menghapus direktori rute API, tetapi panel admin memakainya; karena itu **REST tetap aktif dan dikunci lewat access control**, sedangkan GraphQL dimatikan lewat `graphQL.disable` |
| 8 | Kendala booking | Kendala eksklusi lulus 7 skenario pada PostgreSQL 16.2, termasuk balapan 12 koneksi (G.7) |
| 9 | Algoritma | Vektor G.1-G.6 dihitung dengan implementasi acuan |

**Sisa verifikasi, dikerjakan di Fase 0 (hasilnya dicatat di dokumen ini):**
1. Perilaku `payload-totp`: pengaturan 2FA wajib untuk `owner`, reset oleh `owner`, alur login. Bila tidak sesuai: TOTP kustom (tambah 1-3 hari).
2. Aksi massal publish/unpublish di tampilan daftar (belum diverifikasi; bila tidak ada, publish satu per satu).
3. Adaptor S3 terhadap **R2 nyata**: unggahan klien langsung dan unduhan bertanda tangan untuk bucket privat, akses publik bucket gambar (domain atau `r2.dev`), dan ada tidaknya pembatasan ukuran pada URL unggah.
4. Migrasi Payload dengan SQL kustom pada **Neon**, dijalankan dari database kosong; nama tabel/kolom/enum aktual dipakai pada DDL G.7.
5. Perilaku `revalidateTag`/cache pada versi Next.js terkunci (nama dan argumen API) dan di hosting pengembangan.
6. Ukuran build/fungsi, memori runtime, dan *cold start* pada Vercel Hobby, dengan pembanding instance kecil Render, sebagai masukan keputusan hosting produksi (Lampiran I #1).
7. Batas optimasi gambar platform dan perlu tidaknya `unoptimized`/loader kustom.
8. Cakupan terjemahan admin `id`; label yang belum diterjemahkan ditimpa lewat `i18n.translations`.
9. Bagian template Payload yang aman dibuang (fitur contoh, plugin yang tidak dipakai).

**Hasil verifikasi Fase 0 — 27 Oktober 2026** (sesi agent F0-04/F0-05; item yang masih menunggu kredensial pemilik belum dicantumkan):

| Butir 12.3 | Hasil verifikasi |
|---|---|
| 1 (TOTP) | `payload-totp@3.0.6` sesuai kebutuhan D-05: strategi sesi TOTP menandai `user._strategy === 'totp'`; login sandi memakai strategi `local-jwt`. Fungsi akses di `src/access/roles.ts` kini menuntut `_strategy === 'totp'` untuk **semua** user admin (owner dan editor) — keputusan D-05 pemilik 27 Oktober 2026; sesi sandi tanpa 2FA ditolak, termasuk pada koleksi konten yang membypass wrapper plugin. Dikunci oleh 17 tes unit (`tests/int/roles-totp.int.spec.ts`) dan 2 suite E2E (`admin-totp.e2e.spec.ts`: setup wajib, verifikasi, reset oleh owner, lockout 5 kode salah; `admin-collections.e2e.spec.ts` menyertakan penolakan tulis tanpa 2FA). E2E belum dijalankan lokal (guard database disposable); tervalidasi di CI. |
| 2 (Aksi massal) | Ada di Payload 3.92: publish/unpublish massal = `PATCH /api/{slug}?where=...` dengan `{_status}`; hapus massal = `PATCH` `{deletedAt}` (soft) / `DELETE` (permanen); pulih dari trash = `PATCH ?trash=true` `{deletedAt: null}`; urutan = `POST /api/reorder` (kunci fractional `_order`, koleksi `orderable: true` otomatis `defaultSort: '_order'`). Kontrak dipetakan dari dist Payload dan dikunci E2E `admin-collections.e2e.spec.ts` (urutan + assert UI list, trash/pulih, publish/unpublish massal, join orderable `calculator-groups → items` dengan kunci `_calculator-items_items_order` dalam scope grup). E2E belum dijalankan lokal; tervalidasi di CI. Temuan: aksi **Duplicate** menyalin nilai field apa adanya (hanya kunci `_order` dibuang oleh `beforeDuplicate`) — pada koleksi dengan field unik (mis. `categories.name`, `projects.slug`) duplikasi akan gagal validasi unik; tombol Duplicate jangan diandalkan sampai ada hook penanda unik (fallback disetujui pemilik bila dibutuhkan). |
| 5 (Cache) | Pada `next@16.4.3` (dokumen terkunci `dist/docs`): `revalidateTag(tag, profile)` — form satu-argumen **deprecated**; rekomendasi `revalidateTag(tag, 'max')` untuk stale-while-revalidate, `updateTag(tag)` khusus Server Actions (read-your-own-writes). `src/hooks/revalidate-content.ts` sudah memakai form dua-argumen `revalidateTag(tag, 'max')` dengan try/catch untuk konteks di luar request. Halaman frontend statis belum memasang tag cache (`cacheTag`/`next.tags` belum dipakai di `src/app`) — invalidasi ujung-ke-ujung menjadi bagian Fase 1. |
| 8 (Terjemahan id) | `@payloadcms/translations@3.92.0` menyertakan bahasa `id` lengkap (±588 kunci). `payload-totp@3.0.6` **tidak** menyertakan `id` (37 bahasa tanpa Indonesia) → seluruh 12 kunci namespace `totpPlugin:*` ditimpa berbahasa Indonesia di `payload.config.ts` (`i18n.translations.id.totpPlugin`), termasuk judul setup "Pengaturan Autentikasi Dua Faktor" yang dikunci oleh E2E D-05. |
| 9 (Template sisa) | Tiga direktori sisa template dibuang: `src/app/my-route`, `src/app/(payload)/api/graphql`, `src/app/(payload)/api/graphql-playground` (semuanya kosong/tidak ter-track). `prototype/` dipertahankan sebagai aset desain. |

Catatan pelengkap Fase 0 (sesi ini): endpoint kesehatan `/health` (200 + `no-store` + `{"status":"ok","database":"up"}`, 503 saat database mati) terpasang dan teruji unit; `X-Robots-Tag: noindex, nofollow` otomatis untuk semua deploy non-produksi (lokal/preview) lewat `next.config.ts`; workflow backup harian (PRD H.6) dengan job `restore-verify` menunggu secrets/vars Actions yang diisi pemilik.

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
| Proyek (showcase), Halaman | `draft` / `published` | Disimpan / tampil di publik (status draft Payload; proyek juga mensyaratkan `publishedAt <= sekarang`) |
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

## Lampiran D: Sistem Desain (OpenByte Labs Design System v0.1)

Lampiran ini adalah acuan visual bawaan untuk Fase 3. Pemilik boleh mengganti token (warna, font) tanpa mengubah struktur komponen; semua nilai ditaruh sebagai token di satu tempat (`@theme` Tailwind) dan tidak ditulis langsung di komponen.

### D.1 Arah Desain
**Rapi, teknis, tepercaya.** Latar terang dengan blok gelap ("ink") untuk hero, banner CTA, dan footer; satu warna aksen (teal); tipografi Plus Jakarta Sans dengan JetBrains Mono untuk elemen teknis. Visual utama adalah **screenshot proyek nyata**, bukan ilustrasi stok.

Dilarang: foto stok generik, gradien ungu-biru, efek kaca (*glassmorphism*) berlebihan, ikon berwarna-warni campur, animasi yang berjalan sendiri (autoplay/parallax/carousel otomatis).

### D.2 Token Warna
Rasio kontras di bawah **dihitung dengan rumus WCAG 2.x** (luminans relatif); seluruhnya lulus (AA: teks >= 4,5:1, komponen UI >= 3:1).

| Token | Hex | Pemakaian |
|---|---|---|
| `ink-950` | `#0B1020` | Latar gelap (hero, CTA, footer); teks utama pada latar terang |
| `ink-900` | `#121A33` | Permukaan di atas latar gelap |
| `ink-700` | `#2A3558` | Garis pada latar gelap |
| `text-muted` | `#4A5578` | Teks sekunder pada latar terang |
| `paper` | `#FFFFFF` | Latar utama |
| `mist` | `#F4F6FB` | Latar section selang-seling |
| `line` | `#E2E7F2` | Garis dekoratif (bukan penanda komponen interaktif) |
| `field-border` | `#8A94B3` | Garis input/komponen interaktif (jangan lebih terang) |
| `brand-400` | `#2DD4BF` | Aksen di atas latar gelap; cincin fokus pada latar gelap |
| `brand-600` | `#0D9488` | Cincin fokus pada latar terang |
| `brand-700` | `#0F766E` | Tombol utama, tautan, aksen pada latar terang |
| `brand-800` | `#115E59` | Hover/aktif tombol utama |
| `amber-400` | `#FBBF24` | Lencana "Populer" |
| `danger` | `#B42318` | Galat |
| `success` | `#067647` | Sukses |
| `on-dark` | `#E6EAF5` | Teks utama pada latar gelap |
| `on-dark-muted` | `#A9B3D1` | Teks sekunder pada latar gelap |

| Pasangan | Rasio | Syarat | Hasil |
|---|---|---|---|
| `ink-950` di atas `paper` | 18,93:1 | 4,5 | Lulus |
| `ink-950` di atas `mist` | 17,51:1 | 4,5 | Lulus |
| `text-muted` di atas `paper` | 7,34:1 | 4,5 | Lulus |
| `text-muted` di atas `mist` | 6,79:1 | 4,5 | Lulus |
| `brand-700` di atas `paper` (tautan) | 5,47:1 | 4,5 | Lulus |
| Putih di atas `brand-700` (tombol) | 5,47:1 | 4,5 | Lulus |
| Putih di atas `brand-800` (hover) | 7,58:1 | 4,5 | Lulus |
| `on-dark` di atas `ink-950` | 15,73:1 | 4,5 | Lulus |
| `on-dark-muted` di atas `ink-950` | 9,07:1 | 4,5 | Lulus |
| `brand-400` di atas `ink-950` | 10,17:1 | 4,5 | Lulus |
| `ink-950` di atas `amber-400` | 11,34:1 | 4,5 | Lulus |
| `danger` di atas `paper` | 6,57:1 | 4,5 | Lulus |
| `success` di atas `paper` | 5,69:1 | 4,5 | Lulus |
| `field-border` di atas `paper` | 3,01:1 | 3,0 (UI) | Lulus (batas minimum) |
| `brand-600` di atas `paper` (fokus) | 3,74:1 | 3,0 (UI) | Lulus |
| `brand-400` di atas `ink-950` (fokus) | 10,17:1 | 3,0 (UI) | Lulus |

Aturan: warna bukan satu-satunya penanda status (galat selalu disertai ikon dan teks); teks `brand-400` hanya di atas latar gelap; `brand-700` hanya di atas latar terang.

Pemasangan token (Tailwind v4, di CSS global):
```css
@theme {
  --color-ink-950: #0B1020;  --color-ink-900: #121A33;  --color-ink-700: #2A3558;
  --color-muted: #4A5578;    --color-paper: #FFFFFF;    --color-mist: #F4F6FB;
  --color-line: #E2E7F2;     --color-field: #8A94B3;
  --color-brand-400: #2DD4BF; --color-brand-600: #0D9488;
  --color-brand-700: #0F766E; --color-brand-800: #115E59;
  --color-amber-400: #FBBF24; --color-danger: #B42318;  --color-success: #067647;
  --color-on-dark: #E6EAF5;  --color-on-dark-muted: #A9B3D1;
  --font-sans: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;
}
```
(Sintaks `@theme` mengikuti Tailwind v4; bila versi terkunci berbeda, sesuaikan ke konfigurasi tema versi itu tanpa mengubah nilainya.)

### D.3 Tipografi
* **Plus Jakarta Sans** (variabel, bobot 400-800) untuk semua teks, dimuat lewat `next/font/google` (di-self-host oleh Next.js, tanpa permintaan ke Google saat runtime). **JetBrains Mono** (bobot 500) untuk elemen teknis: kode tracking, nomor referensi, tag teknologi, angka teknis.
* Skala (mobile / desktop): display 40/56 px (line-height 1,1); H1 32/44; H2 28/36; H3 22/26; H4 18/20; isi 16 (1,6); kecil 14 (1,5); keterangan 12 (1,4). Bobot: judul 700, label 600, isi 400. Panjang baris isi maksimal 70 karakter.
* Fallback font harus berupa stack sistem agar tidak terjadi lompatan tata letak (`font-display: swap` + `adjustFontFallback` bawaan `next/font`).

### D.4 Tata Letak & Ruang
* Kontainer maksimal 1200 px; padding sisi 16 / 24 / 32 px (mobile / tablet / desktop); grid 12 kolom; skala spasi kelipatan 4 px.
* Padding vertikal section: 64 px (mobile), 96 px (desktop).
* Radius: 12 px (kartu kecil, input, tombol), 16 px (kartu besar), 999 px (pil/lencana).
* Bayangan kartu: `0 1px 2px rgba(11,16,32,.06), 0 8px 24px rgba(11,16,32,.06)`; tanpa bayangan pada latar gelap (pakai garis `ink-700`).
* Breakpoint: 360 (acuan mobile), 768, 1024, 1440.

### D.5 Komponen
| Komponen | Spesifikasi |
|---|---|
| Tombol | Varian: utama (latar `brand-700`, teks putih), sekunder (garis `ink-950`), ghost, dan "WhatsApp" (utama + ikon). Tinggi minimum **44 px** (target sentuh). Status: hover, fokus (cincin 2 px + jarak 2 px), nonaktif, memuat (spinner + teks tetap) |
| Input & select | Tinggi 48 px, label **selalu di atas** (bukan placeholder), garis `field-border`, pesan galat di bawah dengan ikon + teks, `aria-describedby` terhubung |
| Kartu proyek | Gambar 16:10, judul, tagline satu baris, lencana kategori, ikon teknologi; seluruh kartu dapat diklik (satu tautan) |
| Kartu paket | Nama, harga (coret + harga diskon bila ada), durasi, daftar fitur, kuota revisi, CTA; `isPopular` memakai garis `brand-700` 2 px + lencana `amber-400` |
| Kartu layanan (bento) | Ikon Lucide (stroke 1,75), judul, deskripsi, poin ringkas; ukuran `normal`/`wide`/`tall` |
| Lencana | Kategori: netral (`mist` + `ink-950`); "Populer": `amber-400` + `ink-950` |
| Tab filter | Bentuk pil; di mobile menggulir horizontal; tab aktif `ink-950` teks putih; dapat dioperasikan keyboard (panah) |
| Accordion FAQ | Tombol sebagai judul (`aria-expanded`, `aria-controls`); beberapa panel boleh terbuka bersamaan |
| Navbar | Menempel di atas, tinggi 64 px, tombol "Konsultasi" selalu terlihat; mobile: panel geser dengan perangkap fokus dan tombol tutup; tautan loncat "Lewati ke konten" |
| Footer | Latar `ink-950`: wordmark, navigasi, kontak (WA/email), tautan Kebijakan Privasi, teks hak cipta dari Settings |
| Toast | Sukses/galat, `role="status"` (sukses) atau `role="alert"` (galat), hilang otomatis hanya untuk sukses |
| Stepper (Rilis 2) | Enam langkah; status dengan ikon + teks, bukan warna saja |

### D.6 Tata Letak Blok Beranda
| Blok | Latar | Tata letak |
|---|---|---|
| Hero | `ink-950` | >= 1024 px: dua kolom. Kiri: eyebrow mono "OpenByte Labs", judul display, subjudul, dua CTA, tiga metrik. Kanan: tumpukan 2-3 kartu proyek unggulan (gambar utama); bila belum ada gambar, pola grid titik sebagai pengganti. Mobile: satu kolom, visual di bawah teks |
| Layanan (bento) | `mist` | Grid 2 kolom desktop / 1 kolom mobile; empat kartu |
| Portofolio | `paper` | Tiga proyek unggulan + tombol "Lihat semua proyek" |
| Kalkulator | `mist` | Kartu lebar; pilihan di kiri, ringkasan harga menempel di kanan (desktop); ringkasan menempel di bawah (mobile) |
| Paket | `paper` | Tiga kartu sejajar; yang populer sedikit menonjol |
| Testimoni | `mist` | **Disembunyikan otomatis bila tidak ada data** (tidak ada testimoni karangan) |
| FAQ | `mist` | Dua kolom (judul kiri, accordion kanan) di desktop |
| Banner CTA | `ink-950` | Satu kalimat + dua tombol |

### D.7 Gerak
Durasi 150-250 ms, *ease-out*, hanya `transform` dan `opacity`; hover kartu naik 2 px; seluruh transisi non-esensial dimatikan di bawah `prefers-reduced-motion: reduce`. Tidak ada animasi yang berjalan otomatis.

### D.8 Gambar, Ikon, Logo
* Screenshot proyek rasio **16:10** (mis. 1600x1000), ditampilkan dalam bingkai browser/perangkat sederhana; `alt` menjelaskan isi, bukan "screenshot".
* Ikon Lucide, stroke 1,75, satu warna per konteks.
* **OG image** 1200x630: latar `ink-950`, wordmark, judul halaman.
* **Logo:** wordmark teks "OpenByte Labs" (Plus Jakarta Sans 700) dengan glif kecil `{ }` berwarna `brand-400`; **favicon:** huruf "O" putih pada kotak `brand-700` radius 8. Logo final dapat diganti pemilik dari CMS; desain tidak bergantung padanya.

### D.9 Aksesibilitas Visual
Kontras sesuai D.2; cincin fokus 2 px `brand-600` (latar terang) atau `brand-400` (latar gelap) dengan jarak 2 px, tidak pernah dihapus; target sentuh >= 44 px; struktur heading berurutan (satu H1 per halaman); tautan ikon-saja memiliki label aksesibel.

---

## Lampiran E: Konten Awal (Bahasa Indonesia; usulan untuk seeder)

Seluruh teks ini diisi seeder sebagai nilai awal dan **dapat diubah dari CMS**. Aturan:
1. Hanya klaim yang benar dan dapat dibuktikan; **tidak ada testimoni, angka klien, atau penghargaan karangan**.
2. Penanda **`[ISI]`** adalah data yang hanya diketahui pemilik. **Konten yang masih memuat `[ISI]` tidak boleh dipublikasikan** (kriteria di 9.1).
3. Angka pada metrik diperbarui bila fakta berubah.

### E.1 Meta Bawaan (`site-settings` tab `seo`)
* `defaultTitle`: `OpenByte Labs: Website, Aplikasi Mobile & Sistem Informasi` (maks. 60 karakter)
* `defaultDescription`: `Software house personal untuk website bisnis, aplikasi mobile Flutter, sistem informasi, dan undangan digital. Hitung estimasi biaya dan jadwalkan konsultasi.` (maks. 160 karakter)

### E.2 Hero
* `headline`: `Bangun sistem, aplikasi, dan website yang benar-benar dipakai.`
* `subheadline`: `OpenByte Labs membuat sistem informasi, aplikasi mobile Flutter, website bisnis, dan undangan digital untuk instansi, UMKM, dan komunitas.`
* `primaryCtaLabel`: `Hitung Estimasi Biaya` (menuju blok kalkulator)
* `secondaryCtaLabel`: `Chat via WhatsApp`
* `trustMetrics` (faktual, dari data yang ada): `6` / `Proyek di portofolio`; `4` / `Kategori solusi`; `3` / `Paket dengan harga jelas`

### E.3 Layanan Unggulan (bento)
| Judul | Deskripsi | Poin | Ukuran |
|---|---|---|---|
| Sistem Informasi & Satu Data | Sistem terpadu untuk data wilayah dan layanan publik: dari peta GIS sampai otomasi permohonan surat. | Peta wilayah RT/RW; Profil warga terpadu; Surat ber-QR | `wide` |
| Aplikasi Mobile Lintas Platform | Aplikasi Android dengan Flutter, termasuk fitur kamera, penyimpanan offline, dan integrasi API. | Flutter; Kamera & offline; Integrasi API | `tall` |
| Website Bisnis & UMKM | Landing page, profil usaha, dan katalog dengan pemesanan lewat WhatsApp. | Responsif; SEO dasar; Pesan via WhatsApp | `normal` |
| Undangan Digital Interaktif | Undangan web dengan animasi, musik, dan RSVP yang terhubung ke spreadsheet. | Animasi; Musik latar; RSVP | `normal` |

### E.4 Halaman Tentang (`pages` slug `tentang`)
* **Judul:** `Tentang OpenByte Labs`
* **Teks:** `OpenByte Labs adalah software house personal yang dijalankan oleh Muhammad Izzat Farahidi, Software Engineer & System Specialist. Kami mengerjakan sistem informasi, aplikasi mobile, dan website, mulai dari kebutuhan nyata di lapangan: data warga dan wilayah, layanan kesehatan Posyandu, pencatatan air swadaya, hingga usaha kecil. [ISI: satu paragraf tentang latar belakang dan pengalaman pemilik, mis. lama berkarya dan keahlian yang ingin ditonjolkan]. Setiap proyek dikerjakan dengan alur yang jelas, harga transparan, dan komunikasi lewat WhatsApp.`
* **Prinsip kerja (daftar):** `Harga jelas sejak awal.` / `Progres dapat dipantau.` (ditampilkan mulai Rilis 2) / `Kode dan data dikelola dengan aman.`

### E.5 FAQ
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

### E.6 Navigasi, Banner CTA, Footer
* **Menu:** Beranda, Layanan, Portofolio, Paket, Kalkulator, Konsultasi; menu "Lacak Proyek" **hanya ditambahkan pada Rilis 2**.
* **Banner CTA:** judul `Punya kebutuhan sistem atau aplikasi?`; teks `Ceritakan kebutuhan Anda, kami bantu rancang solusi dan estimasinya.`; tombol `Jadwalkan Konsultasi` dan `Chat via WhatsApp`.
* **Footer:** `© {tahun} OpenByte Labs. Semua hak dilindungi.`

### E.7 Proyek Awal (ringkasan dan tagline)
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

## Lampiran F: Draf Kebijakan Privasi dan Teks Persetujuan

> **Penting:** ini draf kerja berdasarkan fitur yang dirancang di PRD ini, bukan nasihat hukum. Sebelum Rilis 1, tinjau dengan ahli hukum atau konsultan privasi bila memungkinkan, lalu lengkapi semua `[ISI]`. Bagian yang menyangkut Rilis 2 diaktifkan hanya saat portal klien dirilis.

### F.1 Teks Persetujuan (`legal.consentText`, di samping checkbox form)
`Saya menyetujui OpenByte Labs memproses data yang saya kirim untuk menanggapi permintaan ini, sesuai Kebijakan Privasi.`

### F.2 Draf Kebijakan Privasi (`legal.privacyPolicy`)

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

### F.3 Catatan Implementasi
* Halaman `/kebijakan-privasi` merender `legal.privacyPolicy`; placeholder `{whatsappNumber}` dan `{contactEmail}` diisi dari `site-settings` saat render.
* Setiap form publik wajib memuat checkbox persetujuan bertuliskan F.1 dan menyimpan `consentAt`; form tidak dapat dikirim tanpa centang (validasi di server).
* Bila analitik diaktifkan (`seo.analyticsId`), perbarui F.2 butir 8 dan pertimbangkan pemberitahuan cookie sebelum diaktifkan.

---

## Lampiran G: Spesifikasi Algoritma dan Vektor Uji

Vektor uji di lampiran ini **dihitung dengan implementasi acuan yang dijalankan** (bukan ditebak) pada 26 Oktober 2026, dan kendala basis data di G.7 diuji pada PostgreSQL 16.2. Implementasi TypeScript di `lib/*` wajib menghasilkan nilai yang **identik**; vektor ini dijadikan fixture Vitest (`tests/fixtures/*.json`). Bila aturan bisnis diubah, ubah aturan dan vektornya bersamaan.

### G.1 Kalkulator (`lib/calculator`)

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

### G.2 Slot Booking (`lib/booking`)

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

### G.3 Normalisasi Nomor WhatsApp (`lib/whatsapp`)
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

### G.4 Mesin Status Revisi (`lib/tracking`: `nextRevisionState`)
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

### G.5 Nilai Turunan, Kode, PIN, Nomor Referensi
* `paymentStatus`: `unpaid` bila `paidAmount <= 0`; `paid_off` bila `totalCost > 0` dan `paidAmount >= totalCost`; selain itu `down_payment`.
* `currentStep`: `stepNumber` terkecil yang status-nya bukan `done`; bila semuanya `done`, nilainya 6.
* **Vektor:** total 3.500.000 dibayar 0 = `unpaid`; dibayar 1.000.000 = `down_payment`; dibayar 3.500.000 = `paid_off`; dibayar 3.600.000 = `paid_off`; total 0 dibayar 0 = `unpaid`. Langkah `[done, done, in_progress, pending, pending, pending]` = 3; `[done, pending, done, done, done, done]` = 2; semuanya `done` = 6.
* **Kode tracking** `PRJ-` + 8 karakter dari alfabet 32 karakter `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (tanpa `I`, `O`, `0`, `1`), dibangkitkan dengan CSPRNG (32 membagi 256 sehingga tanpa bias modulo); ulangi bila bentrok (maks. 5 kali). **PIN** 6 digit dari CSPRNG (`crypto.randomInt(0, 1_000_000)`, diberi nol di depan). Di basis data hanya hash PIN.
* **Nomor referensi** `PREFIKS-YYMM-XXXX` (YYMM menurut WIB, `XXXX` dari alfabet yang sama): `INQ` (inquiry), `QTE` (quote), `BKG` (booking). Ulangi bila bentrok (maks. 5 kali).

### G.6 Rate Limit Login Tracking (`lib/tracking`)
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

### G.7 Kendala Eksklusi Booking (diuji pada PostgreSQL 16.2)
DDL acuan (nama tabel, kolom, dan tipe enum **harus disesuaikan dengan migrasi yang dihasilkan Payload**; ini sengaja ditulis sebagai SQL kustom di migrasi):
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

## Lampiran H: Kit Fase 0 (Berkas, Skrip, dan Workflow)

Kit ini mengurangi tebakan saat memulai. Semua nilai yang bergantung pada versi paket diverifikasi pada Fase 0 (12.3).

### H.1 Memulai Proyek
1. Gunakan **versi yang dikunci pada 12.3**. Buat proyek dari template resmi Payload yang memakai PostgreSQL (`pnpm create payload-app`), pilih adaptor Postgres; **jangan menaikkan versi Next.js sendiri** di luar rentang peer `@payloadcms/next` untuk versi Payload yang dikunci.
2. Hapus bagian template yang tidak dipakai (mis. fitur contoh, plugin yang tidak dibutuhkan), lalu terapkan struktur 2.3.
3. Pasang: `@payloadcms/db-postgres`, `@payloadcms/storage-s3`, `@payloadcms/richtext-lexical`, `payload-totp`, `sharp`, `zod`, `react-hook-form`, `jose`, `@node-rs/argon2` (atau `bcryptjs`), `@sentry/nextjs`, `tailwindcss`, `lucide-react`; dev: `vitest`, `@playwright/test`, `eslint`. Seluruh paket `@payloadcms/*` memakai **versi yang sama persis** dengan `payload`.

### H.2 Skrip `package.json`
| Skrip | Fungsi |
|---|---|
| `dev`, `build`, `start` | Next.js |
| `lint`, `typecheck` | ESLint; `tsc --noEmit` |
| `test`, `test:e2e` | Vitest; Playwright |
| `generate:types`, `generate:importmap` | Perintah CLI Payload |
| `migrate:create`, `migrate` | Migrasi Payload (`migrate` memakai `DATABASE_URI_DIRECT`) |
| `seed` | Seeder idempotent (bagian 8) |
| `owner:create`, `owner:reset` | Membuat/mereset akun `owner` (kata sandi diminta interaktif) |
| `check:portability` | Gagal bila ada `@vercel/*` pada `src/` atau `package.json` (7.7) |
| `check:access` | Uji matriks akses seluruh koleksi (5.4) |
| `retention:run` | Skrip retensi manual, **dinonaktifkan** (6.3) |

### H.3 `.env.example`
```bash
# --- Inti ---
PAYLOAD_SECRET=ganti-dengan-string-acak-panjang
SITE_URL=http://localhost:3000
# --- Database (Neon: pooled untuk runtime, direct untuk migrasi) ---
DATABASE_URI=postgres://postgres:postgres@localhost:5432/openbyte
DATABASE_URI_DIRECT=postgres://postgres:postgres@localhost:5432/openbyte
# --- R2 (S3-compatible) ---
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_PUBLIC=
R2_PUBLIC_BASE_URL=
R2_BUCKET_PRIVATE=          # Rilis 2
# --- Anti-spam (gunakan kunci uji resmi Cloudflare Turnstile di lokal/CI) ---
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
# --- Keamanan ---
IP_HASH_SALT=
TRUSTED_IP_HEADER=x-forwarded-for
TRACKING_SESSION_SECRET=    # Rilis 2
# --- Lain-lain ---
SENTRY_DSN=
WA_DEFAULT_NUMBER=
```

### H.4 `docker-compose.yml` (PostgreSQL lokal)
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

### H.5 Workflow CI (`.github/workflows/ci.yml`)
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
      PAYLOAD_SECRET: ci-only-secret
      SITE_URL: http://localhost:3000
      IP_HASH_SALT: ci-only-salt
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }   # harus memenuhi syarat Node pada 12.3
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm typecheck && pnpm check:portability
      - run: pnpm generate:types && git diff --exit-code
      - run: pnpm migrate
      - run: pnpm test && pnpm check:access
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e
      - run: pnpm audit --prod --audit-level=high
```
Gunakan versi terbaru yang tersedia untuk setiap `uses:`; setelah job stabil, kunci ke commit SHA.

### H.6 Workflow Backup Harian (`.github/workflows/backup.yml`)
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

### H.7 `Dockerfile` Cadangan
Tujuannya membuktikan portabilitas (7.7), bukan dipakai rutin. Gunakan `Dockerfile` bawaan template Payload bila ada; bila tidak, buat build multi-tahap berbasis `output: 'standalone'` Next.js. Kriteria lulus: `docker build` berhasil dan `docker run` dengan variabel lingkungan menampilkan beranda dan `/admin`.

---

## Lampiran I: Gerbang Keputusan dan Nilai Bawaan

Setiap keputusan punya **nilai bawaan** agar pembangunan tidak tertahan. Pemilik dapat mengubahnya kapan saja sebelum batas waktu.

| # | Keputusan | Batas waktu | Nilai bawaan bila belum diputuskan |
|---|---|---|---|
| 1 | Hosting produksi | Sebelum Rilis 1 (idealnya sebelum Fase 5 dimulai) | Ikuti hasil uji memori Fase 0: muat pada instance 512 MB maka Render berbayar terkecil; tidak muat maka Vercel Pro. **Bila belum ada anggaran, tunda Rilis 1**; jangan memakai Vercel Hobby atau Render free untuk situs yang sudah live |
| 2 | Domain | Sebelum Rilis 1 (idealnya sebelum Fase 5 dimulai) | Cek ketersediaan `openbytelabs.com`, `openbytelabs.id`, `openbytelabs.my.id`; beli yang pertama tersedia dalam urutan itu |
| 3 | Sistem desain | Sebelum Fase 3 | Lampiran D apa adanya; token warna/font dapat diganti tanpa mengubah komponen |
| 4 | Logo | Sebelum Rilis 1 | Wordmark teks (D.8) |
| 5 | Konten awal | Sebelum Rilis 1 | Lampiran E; seluruh `[ISI]` wajib diisi pemilik |
| 6 | Gambar proyek | Sebelum Rilis 1 | Screenshot 16:10 dari enam proyek, diambil pemilik; izin klien untuk nama klien |
| 7 | Kebijakan privasi | Sebelum Rilis 1 | Lampiran F dengan `[ISI]` terisi; sangat disarankan ditinjau ahli hukum |
| 8 | Retensi data | Sebelum ada data klien nyata dalam jumlah besar | 24 bulan sejak interaksi terakhir; dijalankan manual |
| 9 | Kebijakan revisi | Sebelum Rilis 2 | Lampiran C apa adanya (14 hari, garansi bug 30 hari) |
| 10 | Skema uang muka/pelunasan | Sebelum Rilis 2 | Disepakati dalam kontrak per proyek; sistem hanya mencatat pembayaran dan tidak memaksa persentase |
| 11 | Harga awal | Sebelum Rilis 1 | 8.4; ditinjau ulang setelah 3-5 proyek |
