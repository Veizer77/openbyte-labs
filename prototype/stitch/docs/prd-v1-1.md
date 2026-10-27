# Product Requirement Document (PRD)
# OpenByte Labs — Web Agensi Jasa Pembuatan Website, Aplikasi Mobile, & Portfolio CMS

* **Versi:** 1.1.2 (kit infrastruktur Fase 0; sebelumnya 1.1.1: keputusan pemilik)
* **Status:** Siap implementasi; domain wajib dimiliki sebelum Fase 6 (launch)
* **Pemilik Produk:** Muhammad Izzat Farahidi (Personal Brand: Software Engineer & System Specialist)
* **Bahasa Antarmuka:** Indonesia saja
* **Target Stack:** PHP 8.3+, Laravel 13, Filament (rilis stabil terbaru yang kompatibel dengan Laravel 13), Tailwind CSS, Alpine.js, PostgreSQL (Neon), deploy di Render (Docker), storage S3-compatible (Cloudflare R2)

> **Catatan versi paket.** Versi Laravel dan Filament dikunci saat inisialisasi proyek. Cek dukungan Laravel 13 pada `composer.json` Filament sebelum `composer require`, dan jangan memakai Laravel 11 (dukungan keamanan resmi sudah berakhir 12 Maret 2026).

---

## 0. Ringkasan Perubahan dari v1.0

| # | Area | v1.0 | v1.1 |
|---|---|---|---|
| 1 | Prinsip | Hanya proyek, paket, kalkulator yang editable | **Seluruh konten website editable dari CMS** (Site Settings, Page Builder, Layanan, Testimoni, FAQ, template WA) |
| 2 | Stack & hosting | Laravel 11, Filament v3, MySQL/PostgreSQL, hosting tidak dibahas | Laravel 13, Filament terbaru, **PostgreSQL di Neon**, **Docker di Render**, **R2** untuk upload |
| 3 | Skema proyek showcase | Kaku (problem/solution/impact), 1 kategori, tanpa draft | Draft/publish, content blocks, multi-kategori, tabel teknologi, link fleksibel, SEO per proyek, soft delete |
| 4 | Kalkulator | Satu harga per item, hasil tidak disimpan | Rentang harga, aturan dependensi/eksklusi, tipe harga per unit, hasil disimpan (`quote_requests`) |
| 5 | Pemesanan paket | CTA ada, form tidak ada | Form & tabel `inquiries` |
| 6 | Booking | Slot ENUM hardcoded | Slot dari CMS (`availability_rules`, `blocked_dates`), anti double-booking, WA sebagai kanal utama |
| 7 | Tracking klien | Kode 4 karakter + 4 digit WA, hanya baca | Kode 8 karakter + PIN 6 digit, lockout, **komentar, pengajuan revisi, persetujuan**, kuota revisi per paket |
| 8 | Sumber kebenaran progres | `current_step` dan milestone ganda | `project_steps` sebagai sumber tunggal; `paid_amount` diturunkan dari `payments` |
| 9 | Keamanan | Klaim Eloquent mencegah XSS | Sanitasi rich text, 2FA admin, Turnstile/honeypot, CSP, kebijakan upload, UU PDP |
| 10 | Dokumen | Tanpa acceptance criteria & deployment | Ditambah deployment, operasional, acceptance criteria, seeder awal, risiko |

### Perubahan v1.1.1 (keputusan pemilik atas pertanyaan terbuka)
* Harga awal paket, add-on, dan kalkulator ditetapkan (bagian 8.4); kuota revisi naik seiring harga paket (2 / 3 / 4).
* Kebijakan revisi bawaan ditulis (Lampiran C); ditambah jenis permintaan `bug` yang tidak menghitung kuota.
* Kontak awal di Settings diisi (bagian 8.5).
* **Notifikasi email tidak dipakai**; notifikasi lewat panel Filament dan WhatsApp saja.
* Aksi **"Jadikan Proyek Portofolio"** masuk cakupan, dengan usulan otomatis saat proyek selesai (bagian 5.6).
* Rencana domain ditambahkan (bagian 7.6); domain wajib dimiliki sebelum launch.
* Kebijakan retensi data ditunda (bagian 6.3).

### Perubahan v1.1.2 (kit Fase 0)
* Scheduler dan queue worker berjalan **di dalam container web** (opsional, flag `RUN_SCHEDULER`/`RUN_QUEUE`); tidak ada Render Cron Job terpisah.
* Queue awal `sync` (tanpa worker) karena worker database membuat Neon tidak pernah tidur dan menghabiskan jatah gratis.
* Health check Render memakai `/up`; `/health` (cek database) untuk uptime monitor.
* Backup **harian** lewat GitHub Actions (`pg_dump` terenkripsi ke bucket R2 terpisah), karena jendela restore Neon paket gratis hanya 6 jam.

---

## 1. Ikhtisar Produk & Brand Positioning

### 1.1 Visi Produk
Platform digital terpadu untuk personal software house / digital agency milik **Muhammad Izzat**, dengan empat fungsi:

1. **Katalog Portofolio Terkurasi**: sistem skala instansi, kesehatan, utilitas, UMKM, mobile Flutter, dan undangan digital; seluruhnya dikelola dari CMS.
2. **Mesin Konversi (Lead Generation)**: kalkulator estimasi, paket harga, pemesanan, booking konsultasi, dan integrasi WhatsApp.
3. **Portal Proyek Klien**: klien melacak progres, pembayaran, dan dokumen, serta **berkomentar, mengajukan revisi, dan menyetujui hasil** tanpa membuat akun.
4. **Pusat Kontrol CMS Terpusat**: satu panel admin untuk seluruh konten dan operasional.

### 1.2 Prinsip Desain Utama
1. **Tidak ada konten tersembunyi di kode.** Teks, angka, harga, gambar, urutan section, template pesan, dan aturan bisnis (kuota revisi, jam booking) wajib dapat diubah dari admin.
2. **Satu sumber kebenaran per data.** Status progres, pembayaran, dan kuota revisi diturunkan dari satu tabel, bukan disimpan ganda.
3. **Server adalah otoritas.** Hasil kalkulator, validasi booking, dan persetujuan klien dihitung/divalidasi di server.
4. **Sederhana untuk satu operator.** Satu aplikasi, satu panel admin, satu deployment.

### 1.3 Target Pasar
1. **Instansi Pemerintah Desa / Komunitas Publik** (Satu Data, Posyandu, utilitas air swadaya).
2. **UMKM** (profil digital, katalog, website klinik/jasa dengan reservasi).
3. **Pasangan Pernikahan & Event Organizer** (undangan digital interaktif).
4. **Institusi Pendidikan & Sekolah** (profil, administrasi, ujian, absensi).

### 1.4 Di Luar Cakupan v1.1 (Fase Berikutnya)
* Pembuatan link Google Meet otomatis via Google Calendar API (OAuth).
* Payment gateway online dan invoice PDF otomatis.
* Akun login klien (tracking tetap berbasis kode + PIN).
* Multi-bahasa, blog/artikel, OTP via WhatsApp/email.
* Notifikasi email (ke admin maupun klien); notifikasi memakai panel Filament dan WhatsApp.

---

## 2. Arsitektur & Spesifikasi Teknologi

```
                        PENGUNJUNG / KLIEN / ADMIN
                                   |
                              HTTPS (Render TLS)
                                   |
+--------------------------------------------------------------------------+
|  RENDER - Web Service (Docker: nginx + PHP-FPM, Laravel 13)              |
|   * Public frontend: Blade + Tailwind + Alpine.js                        |
|   * Filament panel /admin (Konten Website + Operasional Klien)           |
|   * Layanan: Kalkulator, Booking, Tracking, Revisi, WA Link Builder      |
+--------------------------------------------------------------------------+
        |                          |                         |
        v                          v                         v
+----------------+     +----------------------+    +-----------------------+
| NEON           |     | CLOUDFLARE R2        |    | GITHUB ACTIONS        |
| PostgreSQL     |     | (S3-compatible)      |    | CI + backup harian    |
| pooled (app) / |     | gambar proyek,       |    | pg_dump -> R2         |
| direct (migrasi)|    | lampiran, bukti bayar|    | (bucket terpisah)     |
+----------------+     +----------------------+    +-----------------------+
```

### 2.1 Komponen
| Komponen | Pilihan | Catatan |
|---|---|---|
| Framework | Laravel 13, PHP 8.3+ | Laravel tidak punya cabang LTS; rencanakan upgrade tahunan |
| Admin | Filament (rilis terbaru kompatibel) | Satu panel `/admin`, menu dua grup, role & permission |
| Frontend | Blade, Tailwind CSS, Alpine.js, Lucide Icons | Tanpa SPA; Vite untuk aset |
| Database | PostgreSQL di Neon | Region Singapura; koneksi *pooled* untuk aplikasi, *direct* untuk migrasi |
| Storage | S3-compatible (Cloudflare R2) | **Wajib**, karena filesystem Render ephemeral. Produksi memerlukan domain sendiri (lihat 7.6) |
| Media | Spatie Media Library | Konversi otomatis ke WebP (thumb, card, hero, og) |
| Rich text sanitizer | HTMLPurifier (mis. `mews/purifier`) | Semua HTML dari editor disanitasi saat simpan dan/atau render |
| Role & permission | Spatie Permission + Filament Shield | Role `owner`, `editor` |
| Audit | Spatie Activitylog | Mencatat perubahan data sensitif |
| Anti-spam | Cloudflare Turnstile + honeypot | Form publik |
| Error monitoring | Sentry atau Flare | Plus uptime monitor eksternal |
| Email | Tidak dipakai | Notifikasi admin lewat panel Filament + WhatsApp; `MAIL_MAILER=log`; reset sandi admin lewat shell Render (`php artisan`) |
| Integrasi eksternal | WhatsApp Click-to-Chat (`wa.me`), Google Calendar *link generator* | Link generator hanya membuat tautan "tambah ke kalender", bukan membuat Meet |

### 2.2 Konvensi Basis Data (PostgreSQL)
* Primary key: `bigint` identity (`id()` Laravel). Tidak memakai `UNSIGNED`.
* Tahun: `smallint` (tidak ada tipe `YEAR`). JSON: `jsonb`.
* ENUM: kolom `string` + **PHP backed enum** + validasi di model (bukan tipe ENUM database) agar nilai mudah ditambah.
* Waktu sistem disimpan UTC; tampilan memakai `Asia/Jakarta` (WIB). Kolom `date`/`time` pada booking diartikan sebagai waktu WIB.
* Uang: `numeric(14,2)`, mata uang Rupiah, format `Rp 1.500.000`.
* Soft delete (`deleted_at`) pada tabel konten dan proyek klien.
* Foreign key eksplisit dengan aksi hapus yang disebut per tabel.

---

## 3. Skema Basis Data

### 3.1 Konfigurasi & Konten Situs

#### `settings`
Key-value untuk Site Settings (satu halaman Filament bertab).
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `group` | varchar(50) | `general`, `hero`, `seo`, `whatsapp`, `calculator`, `booking`, `tracking`, `legal`, `navigation`, `footer` |
| `key` | varchar(100) UNIQUE | contoh: `hero.headline` |
| `value` | jsonb NULL | nilai (teks, angka, daftar, path gambar) |
| `updated_at` | timestamp | |

Kunci minimum yang wajib ada (dibuat oleh seeder, diedit di admin):
| Grup | Kunci |
|---|---|
| general | nama brand, logo, favicon, nomor WhatsApp utama, email, alamat/kota, link sosmed (repeater) |
| hero | headline, subheadline, label CTA utama & sekunder, gambar hero |
| hero | trust metrics (repeater: angka, label) |
| navigation | menu utama (repeater: label, tujuan, urutan, aktif), teks footer |
| seo | judul & deskripsi default, OG image default, kode analitik |
| whatsapp | template pesan: `calculator`, `package_order`, `booking_confirm`, `tracking_link`, `revision_notice` |
| calculator | teks disclaimer, harga minimum, tampilkan rentang (ya/tidak) |
| booking | durasi slot (menit), jeda antar sesi, minimal hari sebelum (default 1), maksimal hari ke depan (default 30), mode yang tersedia |
| tracking | kebijakan revisi (rich text), masa revisi (hari, default 14), masa garansi bug (hari, default 30), batas percobaan login, masa sesi (menit) |
| legal | teks kebijakan privasi, teks persetujuan data pada form |

#### `pages`
Halaman yang dibangun dengan Filament **Builder** (landing page, tentang, legal).
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `slug` | varchar(120) UNIQUE | `home`, `tentang`, `kebijakan-privasi` |
| `title` | varchar(200) | |
| `blocks` | jsonb | daftar blok berurutan (lihat 4.1) |
| `meta_title`, `meta_description` | varchar | |
| `og_image` | varchar(255) NULL | |
| `is_published` | boolean DEFAULT true | |
| `created_at`, `updated_at`, `deleted_at` | timestamp | |

#### `services` (Bento Grid Layanan)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `title` | varchar(150) | |
| `description` | text | |
| `highlights` | jsonb NULL | daftar poin singkat |
| `icon` | varchar(50) NULL | nama ikon Lucide |
| `size` | varchar(20) DEFAULT `normal` | `normal`, `wide`, `tall` (ukuran kartu bento) |
| `is_active` | boolean DEFAULT true | |
| `sort_order` | int DEFAULT 0 | |

#### `testimonials`
`id`, `author_name`, `author_role` (varchar NULL), `quote` (text), `photo` (varchar NULL), `project_id` (FK `projects` NULL, SET NULL), `is_active`, `sort_order`, timestamps.

#### `faqs`
`id`, `question` (varchar 255), `answer` (text, tersanitasi), `is_active`, `sort_order`, timestamps.

### 3.2 Portofolio

#### `categories`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `name` | varchar(100) | |
| `slug` | varchar(120) UNIQUE | |
| `icon` | varchar(50) NULL | |
| `show_in_filter` | boolean DEFAULT true | tampil sebagai tab filter |
| `is_active` | boolean DEFAULT true | |
| `sort_order` | int DEFAULT 0 | |
| `created_at`, `updated_at` | timestamp | |

Tab filter di publik dibuat otomatis dari kategori `is_active` dan `show_in_filter`, ditambah tab tetap "Semua Proyek". Tidak ada nama tab yang ditulis di kode.

#### `technologies`
`id`, `name` (varchar 80 UNIQUE), `slug`, `icon` (varchar NULL), `color` (varchar(7) NULL), timestamps.

#### `projects` (Showcase)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `title` | varchar(200) | |
| `slug` | varchar(220) UNIQUE | auto dari judul, bisa diedit |
| `tagline` | varchar(255) NULL | |
| `client_name` | varchar(150) NULL | |
| `year` | smallint NULL | |
| `status` | varchar(20) DEFAULT `draft` | `draft`, `published` |
| `published_at` | timestamp NULL | |
| `featured_image` | varchar(255) NULL | wajib terisi **hanya saat publish** (validasi), bukan di database |
| `gallery` | jsonb NULL | daftar gambar tambahan |
| `summary` | text NULL | ringkasan untuk kartu |
| `content_blocks` | jsonb NULL | blok konten detail (lihat di bawah) |
| `links` | jsonb NULL | repeater: `{label, type, url}` dengan type `demo`, `github`, `playstore`, `appstore`, `video`, `lainnya` |
| `is_featured` | boolean DEFAULT false | |
| `sort_order` | int DEFAULT 0 | drag-and-drop reorder |
| `meta_title`, `meta_description` | varchar NULL | |
| `og_image` | varchar(255) NULL | jika kosong memakai `featured_image` |
| `created_at`, `updated_at`, `deleted_at` | timestamp | |

Jenis `content_blocks`: teks (rich text), gambar, galeri, video (URL), statistik/angka dampak, kutipan, daftar poin, dan blok "Masalah / Solusi / Dampak" (preset). Proyek lama diisi seeder memakai preset Masalah/Solusi/Dampak.

Pivot:
* `category_project` (`category_id` FK CASCADE, `project_id` FK CASCADE, PK gabungan). Satu proyek boleh banyak kategori.
* `project_technology` (`project_id` FK CASCADE, `technology_id` FK CASCADE, `sort_order`).

### 3.3 Paket & Penawaran

#### `service_packages`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `category_id` | bigint FK NULL | `categories(id)` ON DELETE **RESTRICT** |
| `name` | varchar(150) | |
| `slug` | varchar(170) UNIQUE | |
| `target_market` | varchar(150) NULL | |
| `price` | numeric(14,2) | |
| `discount_price` | numeric(14,2) NULL | |
| `discount_ends_at` | timestamp NULL | diskon otomatis berhenti setelah tanggal ini |
| `billing_type` | varchar(30) DEFAULT `one_time` | `one_time`, `subscription_yearly`, `custom` |
| `estimated_days` | int | hari kerja |
| `features` | jsonb | daftar fitur (repeater) |
| `included_revisions` | smallint DEFAULT 2 | **kuota revisi gratis** |
| `extra_revision_price` | numeric(14,2) NULL | harga per revisi tambahan; kosong = ditentukan manual |
| `revision_policy` | text NULL | jika kosong memakai kebijakan global |
| `cta_label` | varchar(80) NULL | |
| `is_popular`, `is_active` | boolean | |
| `sort_order` | int DEFAULT 0 | |
| `created_at`, `updated_at`, `deleted_at` | timestamp | |

#### `service_addons`
`id`, `name`, `description` (varchar NULL), `price` (numeric), `billing_type` (`one_time`/`monthly`/`yearly`), `is_active`, `sort_order`, timestamps. Contoh: maintenance bulanan, hosting, domain.

#### `inquiries` (Pemesanan Paket / Permintaan Penawaran)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `reference` | varchar(20) UNIQUE | contoh `INQ-2610-8F3K` |
| `service_package_id` | bigint FK NULL | SET NULL |
| `quote_request_id` | bigint FK NULL | SET NULL |
| `name` | varchar(150) | |
| `whatsapp` | varchar(20) | dinormalisasi ke `628...` |
| `email` | varchar(150) NULL | |
| `organization_or_business` | varchar(150) NULL | |
| `message` | text NULL | |
| `source` | varchar(20) | `package`, `calculator`, `contact` |
| `status` | varchar(20) DEFAULT `new` | `new`, `contacted`, `converted`, `dropped` |
| `admin_notes` | text NULL | |
| `consent_at` | timestamp | persetujuan pengolahan data |
| `created_at`, `updated_at` | timestamp | |

### 3.4 Kalkulator

#### `calculator_groups`
`id`, `title`, `description` (varchar NULL), `selection_type` (`single`/`multiple`), `is_required` (boolean), `is_active`, `sort_order`, timestamps.

#### `calculator_items`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `calculator_group_id` | bigint FK | CASCADE |
| `label` | varchar(150) | |
| `description` | varchar(255) NULL | |
| `pricing_type` | varchar(20) DEFAULT `flat` | `flat` atau `per_unit` |
| `unit_label` | varchar(40) NULL | mis. "halaman", "modul" (untuk `per_unit`) |
| `max_units` | smallint NULL | batas jumlah unit |
| `price_min` | numeric(14,2) DEFAULT 0 | |
| `price_max` | numeric(14,2) NULL | kosong = sama dengan `price_min` |
| `days_min` | smallint DEFAULT 0 | tambahan hari kerja |
| `days_max` | smallint NULL | kosong = sama dengan `days_min` |
| `is_default` | boolean DEFAULT false | |
| `is_active` | boolean DEFAULT true | |
| `sort_order` | int DEFAULT 0 | |

#### `calculator_item_rules`
Aturan antar item.
`id`, `calculator_item_id` (FK CASCADE), `related_item_id` (FK CASCADE), `rule_type` (`requires` / `excludes`).
Contoh: "Pemetaan GIS" `requires` "Sistem Informasi Database"; "Landing Page" `excludes` "Multi-User RBAC".

#### `quote_requests`
Menyimpan hasil kalkulasi saat pengunjung menekan CTA WhatsApp.
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `reference` | varchar(20) UNIQUE | |
| `selection` | jsonb | snapshot item terpilih + jumlah unit + label |
| `price_min`, `price_max` | numeric(14,2) | dihitung server |
| `days_min`, `days_max` | smallint | |
| `contact_name`, `contact_whatsapp` | varchar NULL | opsional |
| `ip_hash` | varchar(64) NULL | hash IP + salt, bukan IP mentah |
| `status` | varchar(20) DEFAULT `new` | `new`, `contacted`, `converted`, `dropped` |
| `created_at` | timestamp | |

### 3.5 Booking Konsultasi

#### `availability_rules` (jadwal mingguan berulang)
`id`, `weekday` (smallint 0-6), `start_time` (time), `end_time` (time), `is_active`, timestamps. Slot dihasilkan dari rentang ini memakai durasi dan jeda di Settings.

#### `blocked_dates`
`id`, `date` (date), `start_time` (time NULL), `end_time` (time NULL), `reason` (varchar NULL), timestamps. Waktu kosong = seluruh hari diblokir.

#### `consultation_bookings`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `reference` | varchar(20) UNIQUE | |
| `name` | varchar(150) | |
| `whatsapp` | varchar(20) | |
| `email` | varchar(150) NULL | |
| `organization_or_business` | varchar(150) NULL | |
| `service_interest` | varchar(100) | |
| `booking_date` | date | WIB |
| `start_time`, `end_time` | time | WIB |
| `consultation_mode` | varchar(30) DEFAULT `google_meet` | `google_meet`, `whatsapp_call`, `offline` |
| `project_brief` | text NULL | |
| `status` | varchar(20) DEFAULT `pending` | `pending`, `confirmed`, `completed`, `cancelled` |
| `meeting_url` | varchar(255) NULL | ditempel admin saat konfirmasi |
| `admin_notes` | text NULL | |
| `consent_at` | timestamp | |
| `created_at`, `updated_at` | timestamp | |

**Anti double-booking:** *partial unique index* pada `(booking_date, start_time)` dengan kondisi `status IN ('pending','confirmed')`. Validasi aplikasi memeriksa jadwal aktif, `blocked_dates`, dan aturan minimal/maksimal hari.

### 3.6 Proyek Klien, Progres, Pembayaran

#### `client_projects`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `tracking_code` | varchar(20) UNIQUE | format `PRJ-XXXXXXXX` (8 karakter dari alfabet tanpa karakter ambigu) |
| `access_pin_hash` | varchar(255) | PIN 6 digit acak, di-hash; ditampilkan ke admin sekali saat dibuat/diganti |
| `client_name` | varchar(150) | |
| `client_whatsapp` | varchar(20) | |
| `client_email` | varchar(150) NULL | |
| `project_title` | varchar(200) | |
| `category_id` | bigint FK NULL | SET NULL |
| `service_package_id` | bigint FK NULL | SET NULL |
| `project_id` | bigint FK NULL | ke `projects` (portofolio), SET NULL |
| `total_cost` | numeric(14,2) | bertambah bila ada revisi berbayar/change request disetujui |
| `revisions_included` | smallint | **snapshot** dari paket saat proyek dibuat; bisa diubah admin |
| `extra_revision_price` | numeric(14,2) NULL | snapshot |
| `revision_policy_snapshot` | text NULL | snapshot kebijakan |
| `is_review_open` | boolean DEFAULT false | klien boleh menyetujui/mengajukan revisi hanya bila true |
| `review_opened_at` | timestamp NULL | |
| `staging_url`, `production_url`, `github_url` | varchar(255) NULL | |
| `client_visibility` | jsonb | toggle per elemen: `staging`, `production`, `github`, `payments`, `documents`, `timeline` |
| `start_date`, `target_completion_date` | date NULL | |
| `internal_notes` | text NULL | tidak pernah tampil ke klien |
| `archived_at` | timestamp NULL | |
| `created_at`, `updated_at`, `deleted_at` | timestamp | |

Nilai turunan (tidak diinput manual): `paid_amount` = jumlah `payments`, `balance` = `total_cost` - `paid_amount`, `payment_status` (`unpaid`, `down_payment`, `paid_off`), `current_step` = langkah pertama yang belum `done`, `revisions_used` = jumlah `revision_requests` yang dihitung kuota. Boleh di-*cache* ke kolom oleh *observer* untuk performa, tetapi tidak boleh diedit manual.

#### `step_templates` (editable di CMS)
`id`, `step_number` (smallint 1-6), `title`, `description` (text NULL), `default_milestones` (jsonb, daftar judul checklist), timestamps. Dipakai untuk membuat `project_steps` otomatis saat proyek klien dibuat. Isi awal: enam tahap pada 4.6.

#### `project_steps`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `client_project_id` | bigint FK | CASCADE |
| `step_number` | smallint | 1-6 |
| `title`, `description` | varchar / text | disalin dari template, bisa diubah per proyek |
| `status` | varchar(20) DEFAULT `pending` | `pending`, `in_progress`, `done` |
| `started_at`, `completed_at` | timestamp NULL | |

#### `project_milestones`
`id`, `project_step_id` (FK CASCADE), `title` (varchar 150), `description` (text NULL), `is_completed` (boolean), `completed_at` (timestamp NULL), `sort_order`, timestamps.

#### `payments`
`id`, `client_project_id` (FK CASCADE), `paid_at` (date), `amount` (numeric), `method` (varchar NULL: transfer, tunai, QRIS), `note` (varchar NULL), `proof_path` (varchar NULL), `is_visible_to_client` (boolean DEFAULT true), timestamps.

#### `project_updates` (timeline)
`id`, `client_project_id` (FK CASCADE), `title`, `body` (text, tersanitasi), `is_visible_to_client` (boolean DEFAULT true), `created_by` (FK users NULL), timestamps.

#### `project_documents`
`id`, `client_project_id` (FK CASCADE), `title`, `type` (`url`/`file`), `url` (varchar NULL), `file_path` (varchar NULL), `is_visible_to_client` (boolean DEFAULT true), `sort_order`, timestamps.

### 3.7 Revisi, Komentar, Persetujuan

#### `revision_requests`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | bigint PK | |
| `client_project_id` | bigint FK | CASCADE |
| `round_number` | smallint | urutan permintaan dalam proyek |
| `type` | varchar(20) | `revision` (perbaikan), `change_request` (fitur/scope baru, berbiaya), atau `bug` (fitur tidak berjalan sesuai kesepakatan; tidak menghitung kuota) |
| `title` | varchar(200) | |
| `description` | text | teks biasa (di-escape saat tampil) |
| `attachments` | jsonb NULL | maksimal 5 file, tipe & ukuran dibatasi |
| `status` | varchar(20) DEFAULT `submitted` | `submitted`, `accepted`, `in_progress`, `done`, `rejected`, `needs_payment` |
| `counts_toward_quota` | boolean DEFAULT false | menjadi true saat diterima sebagai revisi gratis |
| `is_extra` | boolean DEFAULT false | revisi di atas kuota yang diterima dengan biaya |
| `quoted_price` | numeric(14,2) NULL | harga yang ditetapkan admin (extra/change request) |
| `client_accepted_quote_at` | timestamp NULL | klien setuju biaya |
| `admin_response` | text NULL | |
| `submitted_at`, `resolved_at` | timestamp | |
| `created_at`, `updated_at` | timestamp | |

#### `project_comments`
`id`, `client_project_id` (FK CASCADE), `revision_request_id` (FK NULL, CASCADE), `author_type` (`client`/`admin`), `author_name` (varchar), `body` (text, teks biasa), `attachments` (jsonb NULL), `is_internal` (boolean DEFAULT false; **hanya admin**, tidak tampil ke klien), `created_at`.

#### `project_approvals`
Bukti persetujuan.
`id`, `client_project_id` (FK CASCADE), `type` (`step_review` / `final_handover`), `approved_by_name` (varchar), `note` (text NULL), `ip_hash` (varchar 64), `user_agent` (varchar 255), `approved_at` (timestamp).

### 3.8 Pengguna & Audit
* `users` (admin) dengan 2FA (TOTP), tabel role & permission (Spatie), `activity_log` (Spatie).

### 3.9 Ringkasan Relasi
```
categories >-< projects >-< technologies
categories 1-* service_packages 1-* client_projects *-1 projects (opsional)
quote_requests 1-* inquiries     service_packages 1-* inquiries
calculator_groups 1-* calculator_items 1-* calculator_item_rules
client_projects 1-* project_steps 1-* project_milestones
client_projects 1-* payments | project_updates | project_documents
client_projects 1-* revision_requests | project_comments | project_approvals
```

---

## 4. Spesifikasi Modul Publik (Frontend)

### 4.1 Peta Halaman & Rute
| Rute | Halaman | Sumber konten |
|---|---|---|
| `/` | Beranda | `pages` (slug `home`) + `settings` |
| `/proyek` | Daftar showcase | `projects`, `categories` |
| `/proyek/{slug}` | Detail proyek | `projects` |
| `/paket` | Paket harga | `service_packages`, `service_addons` |
| `/pesan?paket={slug}` | Form pemesanan | `inquiries` |
| `/konsultasi` | Booking konsultasi | `availability_rules`, `blocked_dates` |
| `/tracking` | Login tracking | |
| `/tracking/proyek` | Dasbor klien (sesi terverifikasi) | `client_projects` & turunannya |
| `/kebijakan-privasi` | Legal | `pages` |
| `/sitemap.xml`, `/robots.txt` | SEO | dinamis |
| 404 / 500 / 419 | Halaman error berbahasa Indonesia | |

### 4.2 Beranda (Page Builder)
Beranda disusun dari blok yang urutan, isi, dan visibilitasnya diatur di admin. Jenis blok:
`hero`, `services_grid` (dari `services`), `portfolio_showcase` (jumlah item, hanya unggulan/semua), `calculator`, `pricing` (dari paket aktif), `testimonials`, `faq`, `about`, `cta_banner`, `rich_text`.

Bawaan seeder (semua dapat diubah/dihapus/diurutkan ulang):
* **Hero**: tagline utama, subtitle personal, trust metrics, dua CTA (kalkulator dan WhatsApp). Seluruh teks dari Settings.
* **Layanan unggulan (bento)**: empat kartu awal dari seeder: Sistem Informasi & Satu Data; Aplikasi Mobile Lintas Platform; Website Bisnis & UMKM; Undangan Digital Interaktif.

### 4.3 Showcase Portofolio
* Tab filter dari `categories` aktif, difilter di sisi klien (Alpine.js) tanpa muat ulang. Proyek dengan banyak kategori muncul di semua tab terkait.
* Hanya proyek `status = published` dan `published_at <= now()` yang tampil.
* Kartu: gambar (WebP, `loading="lazy"`), judul, tagline, badge kategori, ikon teknologi.
* Halaman detail: render `content_blocks`, galeri, daftar teknologi, tombol dari `links`, proyek terkait (kategori sama), meta SEO dan OG per proyek.

### 4.4 Kalkulator Estimasi Biaya
* Data grup/item/aturan diambil dari endpoint ter-*cache* (cache dibersihkan otomatis saat admin menyimpan).
* **Perilaku:** grup `single` memakai radio, `multiple` memakai checkbox; grup `is_required` harus terisi; item `per_unit` menampilkan input jumlah dengan batas `max_units`; item yang melanggar aturan `excludes` dinonaktifkan; item yang `requires` item lain otomatis menandai/mewajibkan item tersebut.
* **Perhitungan:** total minimum = jumlah `price_min` (dikali unit bila `per_unit`); total maksimum = jumlah `price_max` (atau `price_min` bila kosong). Hasil tidak boleh kurang dari harga minimum di Settings. Bila min = max, tampil satu angka; bila berbeda, tampil rentang. Durasi dihitung sama dari `days_min`/`days_max`.
* **Otoritas server:** pratinjau dihitung di browser (Alpine.js), tetapi saat pengunjung menekan "Kirim Rincian Estimasi ke WhatsApp", server menghitung ulang, menyimpan `quote_requests`, lalu mengembalikan URL `wa.me` yang sudah terisi dari template Settings.
* Disclaimer ("estimasi awal, bukan penawaran final") diambil dari Settings.

### 4.5 Paket Harga & Pemesanan
* Kartu paket dibuat dari semua `service_packages` aktif (jumlah bebas, tidak terkunci tiga), menampilkan harga, harga diskon (jika `discount_ends_at` belum lewat), durasi, fitur, **kuota revisi** ("termasuk 3x revisi"), dan lencana "Populer".
* Bagian add-on dari `service_addons` aktif.
* CTA kartu menuju `/pesan?paket={slug}`. Form: nama, WhatsApp (validasi `08...`/`628...`), email (opsional), instansi/bisnis, pesan, checkbox persetujuan data, Turnstile. Disimpan ke `inquiries`, lalu halaman sukses menawarkan tombol WhatsApp.

### 4.6 Booking Konsultasi
* **Slot** dihasilkan dari `availability_rules` dikurangi `blocked_dates` dan booking aktif, memakai durasi/jeda Settings. Hanya tanggal pada rentang minimal-maksimal hari yang bisa dipilih. Semua jam ditampilkan dengan label **WIB**.
* **Form:** nama, WhatsApp, email (opsional), instansi/bisnis, kategori layanan, tanggal, slot, mode (Google Meet / Telepon WhatsApp / Tatap muka), ringkasan kebutuhan, persetujuan data, Turnstile.
* **Setelah kirim:** disimpan `pending`; halaman sukses menampilkan nomor referensi, tombol "Tambahkan ke Google Calendar" (link generator), dan tombol WhatsApp. Admin diberi notifikasi di panel Filament dan tombol balasan WhatsApp (tanpa email).
* **Konfirmasi oleh admin:** admin menempel `meeting_url`, mengubah status ke `confirmed`, lalu menekan aksi "Kirim konfirmasi via WhatsApp" (template `booking_confirm`).

### 4.7 Portal Pelacakan Proyek Klien

**Autentikasi (tanpa akun):**
1. Klien membuka `/tracking`, memasukkan **Kode Tracking** (`PRJ-XXXXXXXX`) dan **PIN 6 digit** (diberikan admin lewat WhatsApp).
2. Server memverifikasi, lalu membuat sesi terikat satu proyek (masa berlaku sesuai Settings, default 120 menit). Kode tidak ditaruh di URL.
3. Pembatasan: maks. 5 percobaan gagal per kode dalam 15 menit, setelah itu kode terkunci 15 menit; pembatas per IP + kode dan per IP global. Pesan gagal selalu generik ("Kode atau PIN tidak sesuai").
4. Semua halaman tracking: `noindex`, `Cache-Control: no-store`, CSRF aktif.

**Tampilan dasbor:**
* Header: judul proyek, nama klien, tanggal mulai, target selesai, tombol keluar.
* **Stepper 1-6** dari `project_steps` (status `pending`/`in_progress`/`done`) dengan checklist `project_milestones` per tahap dan persentase progres tahap.
* Enam tahap bawaan (dari `step_templates`, bisa diubah di CMS):
  1. Pengumpulan Kebutuhan & Penandatanganan Kontrak / DP
  2. Perancangan Arsitektur & Desain Mockup UI/UX
  3. Tahap Coding & Integrasi Database
  4. Pengujian Fungsional (Testing & Bug Fixing)
  5. Review Klien & Penyesuaian (Revisi)
  6. Deployment Server Live & Serah Terima Proyek
* Ringkasan pembayaran (jika `client_visibility.payments`): total biaya, terbayar, sisa, status, dan riwayat pembayaran yang ditandai tampil.
* Timeline `project_updates`, dokumen/tautan `project_documents`, serta link staging/production/GitHub **sesuai toggle visibilitas**.
* **Panel revisi** dan **komentar** (lihat 4.8).

### 4.8 Revisi, Komentar, dan Persetujuan

**Kuota:** "Revisi terpakai X dari Y" (`revisions_used` dari `revisions_included`). Nilai `revisions_included` disalin dari paket saat proyek dibuat dan dapat diubah admin per proyek.

**Komentar:** klien dan admin saling membalas pada utas umum atau pada satu permintaan revisi. Catatan `is_internal` hanya tampil untuk admin. Teks klien disimpan apa adanya dan **di-escape** saat tampil; lampiran dibatasi tipe (gambar, PDF, ZIP kecil) dan ukuran (mis. 5 MB/file, maks. 5 file), disimpan di R2 dengan nama acak, tanpa eksekusi.

**Pengajuan revisi** (hanya bila `is_review_open = true`): klien mengisi judul, deskripsi, lampiran, dan memilih jenis (`revision`, `change_request`, atau `bug`).

**Mesin status revisi:**
| Dari | Ke | Dipicu oleh | Aturan |
|---|---|---|---|
| (baru) | `submitted` | klien | jenis `revision` dan kuota masih ada: menunggu admin; jenis `change_request`: lanjut ke `needs_payment` setelah admin mengisi harga |
| `submitted` | `accepted` | admin | jenis `revision` dalam kuota: `counts_toward_quota = true` |
| `submitted` | `needs_payment` | admin/otomatis | kuota habis atau `change_request`; admin mengisi `quoted_price` |
| `needs_payment` | `accepted` | admin setelah klien menyetujui biaya | `is_extra = true`; `total_cost` bertambah sebesar `quoted_price` |
| `submitted`/`needs_payment` | `rejected` | admin | tidak menghitung kuota; wajib isi `admin_response` |
| `accepted` | `in_progress` -> `done` | admin | `resolved_at` terisi saat `done` |

Kuota hanya berkurang saat revisi **diterima**, bukan saat diajukan. Jenis `bug` tidak pernah menghitung kuota. Klien melihat status dan, untuk `needs_payment`, biaya yang diusulkan beserta tombol "Setujui biaya" (mengisi `client_accepted_quote_at`) atau "Tolak".

**Persetujuan:**
* Admin menekan "Buka Review" (tahap 5 -> `in_progress`, `is_review_open = true`). Klien melihat tombol **Setujui Hasil** dan **Ajukan Revisi**.
* "Setujui Hasil" mengharuskan klien mengisi nama dan memasukkan ulang PIN; sistem mencatat `project_approvals` (nama, waktu, IP ter-hash, user agent).
* Serah terima akhir (`final_handover`) hanya dapat disetujui setelah tahap 4 selesai dan sisa pembayaran sesuai aturan admin.
* Setiap pengajuan atau komentar baru dari klien memicu notifikasi ke admin (notifikasi di panel Filament dan tombol balasan WhatsApp; tanpa email).

---

## 5. Spesifikasi CMS Admin (Filament)

Satu panel di `/admin`, login dengan 2FA wajib untuk role `owner`. Navigasi dibagi dua grup.

### 5.1 Dashboard
* Stat cards: proyek ditampilkan, proyek klien aktif, booking baru bulan ini, inquiry & quote baru (belum dihubungi), total nilai proyek aktif, **permintaan revisi menunggu**.
* Tabel: 5 proyek klien aktif, 5 booking terbaru, revisi `submitted`/`needs_payment`.

### 5.2 Grup "Konten Website"
| Menu | Fungsi |
|---|---|
| **Site Settings** | Halaman bertab (Umum, Hero, Navigasi & Footer, SEO, WhatsApp, Kalkulator, Booking, Tracking, Legal) mengedit tabel `settings` |
| **Halaman** | CRUD `pages` dengan Builder; atur urutan blok, sembunyikan blok, pratinjau |
| **Layanan (Bento)** | CRUD `services`, reorder drag-and-drop |
| **Proyek (Showcase)** | Form: judul, slug otomatis, kategori (multi), teknologi (multi, bisa tambah baru), tahun, klien, tagline, gambar utama (konversi WebP), galeri, ringkasan, **Builder konten**, repeater link, SEO; status draft/publish dengan jadwal tayang; toggle unggulan; **reorder**, **Duplicate**, **Preview draft**, arsip/restore (soft delete), aksi massal publish/unpublish |
| **Kategori** | CRUD, toggle `show_in_filter`, reorder |
| **Teknologi** | CRUD (nama, ikon, warna) |
| **Testimoni, FAQ** | CRUD, reorder, aktif/nonaktif |
| **Paket Layanan** | Harga, diskon + tanggal berakhir, durasi, repeater fitur, **kuota revisi**, **harga revisi tambahan**, kebijakan revisi, toggle populer/aktif |
| **Add-on** | CRUD |
| **Kalkulator** | Grup -> item (relation manager) -> aturan (requires/excludes), harga min/max, durasi, tipe per unit, aktif; perubahan langsung memperbarui frontend (cache dibersihkan otomatis) |

### 5.3 Grup "Operasional Klien"
| Menu | Fungsi |
|---|---|
| **Quote Kalkulator** | Daftar hasil kalkulasi, ubah status, aksi "Hubungi via WhatsApp" |
| **Inquiry / Pemesanan** | Daftar, filter status, catatan admin, aksi WhatsApp, "Jadikan Proyek Klien" (mengisi data otomatis) |
| **Booking Konsultasi** | Filter status; aksi **Konfirmasi** (isi `meeting_url`, kirim template WA); jadwal mingguan (`availability_rules`) dan `blocked_dates` dikelola di sini |
| **Proyek Klien** | Form data proyek; tombol **Generate Kode & PIN** (PIN tampil sekali, bisa diganti kapan saja); relation manager: Tahap & Milestone, Pembayaran, Timeline, Dokumen, Revisi, Komentar, Persetujuan; panel visibilitas; aksi "Buka/Tutup Review", **"Jadikan Proyek Portofolio"** (lihat 5.6), "Kirim Link Tracking via WhatsApp" (kode + tautan; **PIN dikirim terpisah** oleh admin) |
| **Template Tahap** | Edit judul, deskripsi, dan checklist bawaan enam tahap |
| **Pengguna & Role** | Kelola akun, role `owner` dan `editor`, reset 2FA |
| **Log Aktivitas** | Riwayat perubahan data sensitif (harga, pembayaran, status) |

### 5.4 Role & Izin
| Role | Akses |
|---|---|
| `owner` | Semua modul, termasuk pengguna dan log |
| `editor` | Hanya grup "Konten Website" (tanpa Site Settings bagian WhatsApp/Tracking dan tanpa data klien) |

### 5.5 Template WhatsApp (editable)
Placeholder yang didukung: `{nama}`, `{referensi}`, `{platform}`, `{rincian}`, `{estimasi_harga}`, `{estimasi_durasi}`, `{tanggal}`, `{jam}`, `{meeting_url}`, `{kode_tracking}`, `{link_tracking}`, `{nama_proyek}`, `{judul_revisi}`, `{sisa_kuota}`. Placeholder yang tidak dikenal ditolak saat simpan. Pesan di-URL-encode otomatis.

### 5.6 Aksi "Jadikan Proyek Portofolio"
1. **Usulan otomatis:** saat tahap 6 sebuah proyek klien menjadi `done`, admin menerima notifikasi di panel: "Proyek {judul} selesai. Jadikan proyek portofolio?" dengan tombol aksi.
2. **Aksi** (juga tersedia manual di halaman Proyek Klien yang tahap 6-nya `done`): membuat `projects` berstatus **draft** dan mengisi otomatis judul, kategori, tahun (dari tanggal selesai), URL produksi sebagai link `demo`, serta mengisi `client_projects.project_id`.
3. **Izin klien:** modal aksi memuat checkbox "Saya sudah mendapat izin klien untuk menampilkan proyek ini". Nama klien hanya disalin bila dicentang; bila tidak, proyek tampil tanpa nama klien.
4. **Data sensitif tidak pernah disalin:** WhatsApp, email, biaya, pembayaran, catatan internal, kode/PIN tracking.
5. Admin diarahkan ke form Proyek untuk melengkapi gambar, ringkasan, konten, dan teknologi, lalu meng-**publish** secara manual.

---

## 6. Persyaratan Non-Fungsional

### 6.1 Performa
* LCP maksimal **1,8 detik** pada 4G untuk beranda dan halaman proyek.
* Pengaturan, halaman, dan data kalkulator di-*cache* (`Cache::rememberForever` + invalidasi lewat observer saat disimpan).
* Gambar: konversi WebP/AVIF, ukuran responsif (`srcset`), `loading="lazy"` kecuali gambar di atas lipatan.
* *Eager loading* pada semua daftar untuk menghindari N+1; OPcache aktif; `config:cache`, `route:cache`, `view:cache`, `event:cache` saat build.
* Instance Render berbayar (tanpa spin-down) untuk produksi.

### 6.2 Keamanan
* CSRF pada semua form; validasi server untuk semua input.
* **XSS:** output Blade di-escape (`{{ }}`); HTML dari editor (rich text, FAQ, kebijakan) wajib lewat HTMLPurifier sebelum dirender dengan `{!! !!}`. Teks klien (komentar, revisi) tidak pernah dirender sebagai HTML.
* **SQL Injection:** query lewat Eloquent/Query Builder berparameter; tanpa SQL mentah yang memakai input pengguna.
* **Rate limiting:** login tracking (5/15 menit per kode, plus per IP), komentar & revisi (mis. 10/menit per sesi), form publik, login admin.
* **Admin:** 2FA TOTP untuk `owner`, kata sandi kuat (bcrypt/argon2id), sesi HTTPS (`secure`, `httponly`, `samesite=lax`).
* **Upload:** whitelist MIME + ekstensi, **tanpa SVG dari pengguna**, nama file acak, batas ukuran, bucket R2 privat untuk lampiran klien (akses via URL bertanda tangan berumur pendek).
* **Header:** CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS.
* **Anti-spam:** Turnstile + honeypot pada form publik.
* **Rahasia:** semua kunci di environment variable Render; tidak ada kredensial di repositori.
* **Cadangan:** lihat 7.5.

### 6.3 Privasi & Kepatuhan (UU PDP)
* Halaman Kebijakan Privasi editable; checkbox persetujuan pada form booking, inquiry, dan kalkulator (`consent_at` tersimpan).
* IP disimpan sebagai hash bersalt, bukan mentah.
* **Retensi data: diputuskan belakangan.** Untuk sementara tidak ada penghapusan atau anonimisasi otomatis. Kolom `archived_at` dan *scheduled command* retensi disiapkan tetapi **dinonaktifkan** sampai kebijakan final ditetapkan (usulan awal: 24 bulan, dapat diubah di Settings).
* Klien dapat meminta penghapusan data lewat kontak yang tertera di kebijakan privasi.

### 6.4 SEO & OpenGraph
* Meta tag dinamis dan canonical per halaman dan proyek; OG image otomatis; `sitemap.xml` dan `robots.txt` dinamis.
* Schema.org `ProfessionalService`, `Person`, dan `CreativeWork` pada detail proyek.
* Halaman `/tracking*` dan `/admin*` ber-`noindex`.

### 6.5 Responsivitas & Aksesibilitas
* *Mobile-first*: 360px, 768px, 1024px, 1440px+.
* Kontras WCAG AA, teks alternatif gambar (field `alt` pada media), navigasi keyboard, label form jelas.

### 6.6 Lokalisasi
* Locale `id`, zona waktu tampilan `Asia/Jakarta`, tanggal "19 Oktober 2026", Rupiah tanpa desimal pada tampilan, semua pesan validasi dan error dalam bahasa Indonesia.

### 6.7 Observabilitas
* Sentry/Flare untuk error, log aplikasi ke stderr (dibaca di dasbor Render), *uptime monitor* eksternal pada beranda dan `/health`.

---

## 7. Deployment & Operasional

### 7.1 Layanan
| Layanan | Platform | Catatan |
|---|---|---|
| Web service | Render, `runtime: docker` | nginx + PHP-FPM + supervisor dalam satu container; instance berbayar; `healthCheckPath: /up`; `preDeployCommand` menjalankan migrasi; region Singapura |
| Scheduler | Di dalam container web (opsional) | `schedule:work` via supervisor, hanya bila ada tugas terjadwal (flag `RUN_SCHEDULER`); tanpa Render Cron Job terpisah |
| Queue worker | Di dalam container web (opsional) | Awalnya `QUEUE_CONNECTION=sync` (tanpa worker). Worker database membuat Neon tidak pernah tidur dan menghabiskan jatah gratis, jadi aktifkan (`RUN_QUEUE`) hanya bila perlu |
| Database | Neon PostgreSQL | region Singapura; branch `main` (produksi) dan `dev` (staging) |
| Backup | GitHub Actions | `pg_dump` harian, terenkripsi, ke bucket R2 terpisah (aturan lifecycle 30 hari) |
| Storage | Cloudflare R2 | bucket publik (gambar situs) dan bucket privat (lampiran, bukti bayar) |
| Domain & SSL | Belum ada; sementara `*.onrender.com`, wajib dibeli sebelum launch (lihat 7.6) | TLS otomatis Render |

### 7.2 Variabel Lingkungan Utama
`APP_KEY`, `APP_ENV`, `APP_URL`, `DB_*` (URL *pooled* untuk runtime; `DB_URL_DIRECT` untuk migrasi), `FILESYSTEM_DISK=r2`, `AWS_*`/`R2_*`, `TURNSTILE_*`, `MAIL_MAILER=log` (email tidak dipakai), `SENTRY_LARAVEL_DSN`, `QUEUE_CONNECTION=sync`, `RUN_SCHEDULER`/`RUN_QUEUE` (default `false`), `IP_HASH_SALT`, `WA_DEFAULT_NUMBER` (cadangan bila Settings kosong).

### 7.3 Pipeline
1. GitHub Actions pada setiap PR: `pint`, analisis statis (Larastan), uji otomatis (Pest/PHPUnit) terhadap Postgres.
2. Merge ke `main` -> Render *auto-deploy*.
3. Build: `composer install --no-dev --optimize-autoloader`, `npm ci && npm run build`, cache config/route/view.
4. *Pre-deploy command*: `php artisan migrate --force` memakai koneksi **direct** Neon.
5. Migrasi harus aman untuk rilis tanpa downtime (tambah kolom nullable dulu, hapus kolom di rilis berikutnya).

### 7.4 Lingkungan
`local` (Docker/Sail + Postgres lokal), `staging` (Render + Neon branch `dev`, data dummy, di-*noindex*), `production`.

### 7.5 Cadangan & Pemulihan
* Fitur *restore/branch* Neon dibatasi jendela retensi paket (6 jam di paket gratis), jadi **cadangan utama adalah `pg_dump` harian** lewat GitHub Actions, dienkripsi, dan diunggah ke bucket R2 terpisah dengan aturan lifecycle (mis. hapus setelah 30 hari).
* Aktifkan *versioning* atau salinan berkala pada bucket R2 konten.
* Uji pemulihan minimal sekali sebelum peluncuran, lalu tiap kuartal. Targetnya: RPO <= 24 jam, RTO <= 4 jam.

### 7.6 Rencana Domain
Status: **belum punya domain**. Ini tidak menghalangi pengembangan, tetapi domain wajib ada sebelum launch.

| Tahap | Alamat yang dipakai |
|---|---|
| Fase 0-5 (pengembangan, staging) | Render `https://<nama-service>.onrender.com`; bucket R2 lewat `r2.dev` (khusus uji; ada batas laju dan tidak untuk produksi) |
| Sebelum Fase 6 (launch) | Domain sendiri untuk situs, dan subdomain (mis. `assets.<domain>`) untuk bucket R2 |

Langkah pemasangan setelah domain dibeli:
1. Tambahkan domain ke Cloudflare (DNS), lalu arahkan domain utama ke Render sebagai *custom domain* (TLS otomatis).
2. Hubungkan bucket publik R2 ke subdomain, lalu matikan akses `r2.dev`.
3. Perbarui `APP_URL`, URL storage, hostname Turnstile, canonical/sitemap/OG, dan tautan pada template WhatsApp.
4. Kirim link tracking ke klien **hanya setelah** domain produksi aktif, agar tautan yang sudah dibagikan tidak berubah.
5. Opsional kemudian: alamat email berdomain sendiri sebagai alias penerus ke Gmail.

Pilihan ekstensi: `.com`/`.id` (lebih dipercaya, lebih mahal) atau `.my.id`/`.web.id` (jauh lebih murah). Cek harga di registrar saat membeli.

---

## 8. Data Awal (Seeder)

Seeder mengisi data awal; **setelah itu semuanya dikelola dari admin** (diedit, diganti, atau dihapus).

### 8.1 Kategori Awal
Instansi / Pemdes; Aplikasi Mobile (Flutter); Bisnis & UMKM; Undangan Digital & Event.

### 8.2 Proyek Awal (dari v1.0)
| Proyek | Kategori | Stack | Sorotan |
|---|---|---|---|
| SINDUKSADATI (Satu Data RW 06 Mojorejo) | Instansi / Pemdes | Next.js 14, PostGIS 3, InsForge (Postgres), Leaflet GIS, QR Surat | Peta batas wilayah RT/RW, Citizen 360, otomasi permohonan surat warga |
| SIPANDU / Posyandu (Flamboyan RW 06) | Instansi / Pemdes | React 18 SPA, Vite, InsForge SDK, Vitest | Alur 5-Meja Kemenkes, kalkulator Z-Score WHO 2006, deteksi dini stunting (2T) |
| HIPPAM Web & Mobile | Instansi / Pemdes + Aplikasi Mobile | Next.js 16, Flutter 3.x (Dart), Supabase PostgreSQL, RLS | Pembacaan meter air swadaya, kompresi foto meteran, tarif berjenjang |
| UMKM-KU | Bisnis & UMKM | React Router v7, Neon Serverless Postgres, AWS S3 | Direktori UMKM warga, verifikasi NIK SINDUKSADATI, checkout via WhatsApp |
| Terapis Jogoroto (Pijat Akupresur STPT) | Bisnis & UMKM | HTML5 Semantic, Modern CSS, WhatsApp Direct Booking | Landing page luxury warm gold, badge rating 5.0, alur terapi 5 langkah |
| Prewed (Undangan Digital Fajar & Fifi) | Undangan Digital & Event | HTML5 Canvas Petal Animation, Web Audio API, Sheet RSVP Sync | Amplop 3D wax-seal, musik saxophone, RSVP terhubung spreadsheet |

Status awal `published`. Gambar utama diunggah pemilik setelah seeder berjalan.

### 8.3 Data Awal Lain
* **Paket, add-on, kalkulator**: lihat 8.4 (harga awal setara freelancer junior; semua dapat diubah di CMS).
* **Kontak & kebijakan**: lihat 8.5 dan Lampiran C.
* **Jadwal booking**: Senin-Jumat dengan rentang 09:00-11:00, 13:00-15:00, 16:00-18:00, 19:30-21:30 (dari slot v1.0).
* **Template Tahap**: enam tahap pada 4.7 beserta checklist standar.
* **Template WhatsApp**: teks bawaan untuk kalkulator, pemesanan, konfirmasi booking, link tracking, dan notifikasi revisi.
* **Bento**: empat layanan unggulan pada 4.2.

### 8.4 Harga Awal (Rupiah; kisaran umum freelancer junior, semua editable)

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
| Kunci | Nilai |
|---|---|
| Nomor WhatsApp utama | `0895386011371` (disimpan apa adanya, dinormalisasi ke `62895386011371` untuk tautan `wa.me`) |
| Email kontak | `izzatfarahidi@gmail.com` (hanya ditampilkan sebagai kontak; sistem tidak mengirim email) |
| Kebijakan revisi | teks pada Lampiran C |
| Masa revisi / masa garansi bug | 14 hari / 30 hari (usulan, dapat diubah) |

---

## 9. Acceptance Criteria

### 9.1 CMS & Konten
- [ ] Mengubah headline hero, trust metrics, menu, dan footer di Site Settings langsung tampil di beranda tanpa deploy.
- [ ] Menambah, menyembunyikan, dan mengurutkan ulang blok beranda dari admin berfungsi.
- [ ] Proyek `draft` tidak tampil di publik; proyek tanpa gambar utama tidak bisa di-publish.
- [ ] Proyek dengan dua kategori tampil di kedua tab filter; tab filter mengikuti kategori di admin.
- [ ] Mengganti urutan proyek lewat drag-and-drop mengubah urutan di publik.
- [ ] Gambar yang diunggah tersedia dalam WebP dan **tetap ada setelah redeploy** (tersimpan di R2).
- [ ] Teks WA dapat diubah di Settings; placeholder tidak dikenal ditolak.

### 9.2 Kalkulator, Paket, Booking
- [ ] Mengubah harga item di admin mengubah hasil kalkulator publik (setelah cache dibersihkan otomatis).
- [ ] Item `excludes`/`requires` bekerja; grup wajib divalidasi; hasil tidak di bawah harga minimum.
- [ ] Manipulasi nilai harga di browser tidak mempengaruhi `quote_requests` (dihitung ulang server).
- [ ] Dua pengunjung tidak bisa memesan slot yang sama (uji balapan lolos berkat indeks unik parsial).
- [ ] Tanggal di luar rentang minimal/maksimal dan tanggal terblokir tidak bisa dipilih.
- [ ] Nomor WhatsApp tidak valid ditolak; `08...` dinormalisasi ke `628...`.

### 9.3 Tracking, Revisi, Persetujuan
- [ ] Kode/PIN salah menghasilkan pesan generik; 5 kegagalan mengunci kode 15 menit.
- [ ] Sesi tracking hanya bisa mengakses satu proyek dan kedaluwarsa sesuai pengaturan.
- [ ] Toggle visibilitas (staging, GitHub, pembayaran, dokumen) menyembunyikan elemen dari klien.
- [ ] `current_step` tidak bisa diedit manual dan selalu sesuai `project_steps`; `paid_amount` sama dengan jumlah `payments`.
- [ ] Revisi dalam kuota berstatus `accepted` mengurangi sisa kuota; revisi `rejected` tidak.
- [ ] Saat kuota habis, pengajuan menjadi `needs_payment`, klien melihat biaya, dan `total_cost` hanya bertambah setelah admin menerima.
- [ ] Mengubah kuota di paket **tidak** mengubah `revisions_included` proyek lama.
- [ ] Klien tidak bisa mengajukan revisi/menyetujui bila `is_review_open = false`.
- [ ] Persetujuan mencatat nama, waktu, IP ter-hash, dan memerlukan PIN ulang.
- [ ] Komentar `is_internal` tidak pernah muncul di sisi klien; skrip yang dikirim lewat komentar tidak dieksekusi.
- [ ] Permintaan jenis `bug` tidak mengurangi kuota revisi.
- [ ] Saat tahap 6 selesai, admin menerima notifikasi panel dengan tombol "Jadikan Proyek Portofolio".
- [ ] Aksi tersebut membuat proyek **draft** tanpa data sensitif klien; nama klien hanya terisi bila checkbox izin dicentang.
- [ ] Sistem tidak mengirim email apa pun; notifikasi tampil di panel dan tombol WhatsApp membuka `wa.me` dengan pesan terisi.

### 9.4 Keamanan & Operasional
- [ ] Login admin `owner` memerlukan 2FA; role `editor` tidak bisa membuka data klien.
- [ ] Rich text berisi `<script>` disanitasi.
- [ ] Header keamanan aktif; `/tracking*` dan `/admin*` ber-`noindex`.
- [ ] Deploy lewat push ke `main` menjalankan migrasi otomatis; `/up` dipakai Render, `/health` memeriksa koneksi database untuk uptime monitor.
- [ ] Pemulihan dari cadangan berhasil diuji sebelum launch.
- [ ] LCP beranda <= 1,8 detik (uji Lighthouse/PageSpeed mobile, 4G).

---

## 10. Rencana Eksekusi (Roadmap)

```
[Fase 0: Infrastruktur] -> [Fase 1: Skema & Model] -> [Fase 2: Admin CMS]
        -> [Fase 3: Frontend Publik] -> [Fase 4: Kalkulator, Paket, Booking]
        -> [Fase 5: Tracking, Revisi, Persetujuan] -> [Fase 6: Konten, QA, Hardening, Launch]
```

| Fase | Isi utama | Perkiraan usaha* |
|---|---|---|
| 0 | Repo, Docker, Laravel 13 + Filament, Neon (branch main/dev), R2, Render (web), CI, backup harian, Sentry (sementara memakai `*.onrender.com` dan `r2.dev`) | 2-3 hari |
| 1 | Seluruh migrasi (bagian 3), model, relasi, PHP enums, factory, seeder (bagian 8) | 3-4 hari |
| 2 | Filament: Site Settings, Pages (Builder), Services, Projects, Categories, Technologies, Packages, Calculator, Testimoni/FAQ, role & 2FA, dashboard dasar | 7-10 hari |
| 3 | Layout Blade/Tailwind, blok beranda, showcase + detail proyek, SEO/OG, halaman legal & error | 6-8 hari |
| 4 | Kalkulator (Alpine + server), quote_requests, paket & inquiry, booking + availability, WA builder, Turnstile | 6-8 hari |
| 5 | Tracking (PIN, lockout, sesi), stepper, pembayaran, timeline, dokumen, revisi, komentar, persetujuan, notifikasi panel, aksi "Jadikan Proyek Portofolio" | 8-10 hari |
| 6 | Beli & pasang domain, input konten (6 proyek, gambar), QA responsif & aksesibilitas, uji keamanan, uji beban ringan, backup & restore, launch | 5-7 hari |

\*Perkiraan kasar untuk satu pengembang; akan berubah mengikuti ketersediaan waktu dan kompleksitas desain.

---

## 11. Risiko & Asumsi

| Risiko / Asumsi | Dampak | Mitigasi |
|---|---|---|
| Filament dan Laravel berganti versi mayor secara berkala | Upgrade memakan waktu | Kunci versi, jadwalkan upgrade tahunan, tulis uji otomatis |
| Neon bisa *suspend* saat idle | Query pertama lebih lambat | Koneksi pooled, instance Render tidak tidur, pertimbangkan *autosuspend* lebih panjang |
| Filesystem Render ephemeral | File upload hilang | Seluruh upload ke R2 (wajib, ada di acceptance criteria) |
| Penyalahgunaan tracking (brute force) | Kebocoran data klien | Kode 8 karakter + PIN 6 digit + lockout + rate limit + log |
| Sengketa soal definisi revisi | Konflik dengan klien | Kebijakan revisi tertulis, snapshot per proyek, bukti persetujuan |
| Spam pada form publik | Data kotor, beban admin | Turnstile + honeypot + rate limit |
| Data pribadi klien (WA, email, nama) | Risiko hukum UU PDP | Persetujuan, retensi, hash IP, kebijakan privasi |
| Biaya hosting berbayar | Biaya bulanan tetap | Mulai dari instance terkecil yang tidak tidur, pantau penggunaan |
| Belum punya domain | `r2.dev` tidak untuk produksi; tautan tracking tidak profesional | Beli domain sebelum Fase 6; kirim link tracking hanya setelah domain aktif (7.6) |
| Harga awal terlalu rendah/tinggi | Margin buruk atau sepi peminat | Ubah harga langsung di CMS; tinjau setelah 3-5 proyek |

**Asumsi:** pemilik adalah satu-satunya admin awal; Cloudflare R2 dipakai untuk storage (dapat diganti penyedia S3-compatible lain); harga awal mengikuti 8.4 dan ditinjau ulang setelah beberapa proyek pertama.

---

## 12. Keputusan Pemilik & Item Tersisa

### 12.1 Keputusan (final untuk v1.1.1)
| # | Topik | Keputusan |
|---|---|---|
| 1 | Harga awal | Setara freelancer junior; nilai awal di 8.4, dapat diubah di CMS kapan saja |
| 2 | Kuota revisi | Naik sesuai harga paket: 2 / 3 / 4 revisi; biaya tambahan Rp 100.000 / 250.000 / 300.000 |
| 3 | Kontak | WhatsApp 0895386011371; email izzatfarahidi@gmail.com |
| 4 | Domain | Belum punya; rencana pada 7.6 |
| 5 | Notifikasi admin | Panel Filament + WhatsApp; tanpa email |
| 6 | Proyek selesai ke portofolio | Ya, diusulkan otomatis (5.6) |
| 7 | Retensi data | Ditunda; belum diaktifkan |

### 12.2 Item Tersisa
1. Pilih dan beli domain sebelum Fase 6 (7.6).
2. Tinjau ulang harga setelah 3-5 proyek pertama.
3. Tetapkan kebijakan retensi data sebelum ada data klien nyata dalam jumlah besar.
4. Konfirmasi teks kebijakan revisi (Lampiran C), terutama masa revisi 14 hari dan garansi bug 30 hari (usulan).
5. Siapkan teks final Kebijakan Privasi.

---

## Lampiran A: Template WhatsApp Bawaan

**Kalkulator** (`whatsapp.calculator`)
```
Halo OpenByte Labs, saya {nama} tertarik membuat aplikasi dengan rincian berikut:
{rincian}
Estimasi Kalkulator: {estimasi_harga} ({estimasi_durasi})
Referensi: {referensi}
Mohon info ketersediaan jadwal pengerjaan. Terima kasih!
```

**Konfirmasi booking** (`whatsapp.booking_confirm`)
```
Halo {nama}, konsultasi Anda pada {tanggal} pukul {jam} WIB sudah dikonfirmasi.
Link pertemuan: {meeting_url}
Referensi: {referensi}
```

**Link tracking** (`whatsapp.tracking_link`)
```
Halo {nama}, proyek "{nama_proyek}" dapat dipantau di {link_tracking}
Kode Tracking: {kode_tracking}
PIN akan saya kirim terpisah.
```

**Notifikasi revisi** (`whatsapp.revision_notice`)
```
Halo {nama}, permintaan revisi "{judul_revisi}" sudah saya tinjau. Sisa kuota revisi: {sisa_kuota}.
Detail lengkap ada di halaman tracking proyek Anda.
```

---

## Lampiran B: Definisi Status

| Entitas | Status | Arti |
|---|---|---|
| Proyek (showcase) | `draft` / `published` | Disimpan / tampil di publik |
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
