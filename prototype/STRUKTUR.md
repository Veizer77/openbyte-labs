# 🗺️ Peta Struktur & Direktori Prototype — OpenByte Labs

Dokumen ini memetakan seluruh struktur berkas dan folder di dalam direktori `prototype/`. Direktori ini berisi ekspor desain referensi UI/UX interaktif berbasis **Google Stitch** (High-Contrast Minimalist Bento) yang menjadi acuan visual frontend publik dan panel admin CMS untuk OpenByte Labs.

> [!IMPORTANT]
> **Sumber Kebenaran Spesifikasi & Bisnis:**
> Acuan utama fungsionalitas, skema basis data, dan aturan bisnis proyek adalah [PRD_v1_4.md](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/PRD_v1_4.md) dan aturan kerja di [AGENTS.md](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/AGENTS.md).
> Berkas [prd-v1-1.md](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/docs/prd-v1-1.md) di dalam folder `prototype/stitch/docs/` merupakan arsip spesifikasi awal (Laravel/Filament) dan **bukan** acuan utama implementasi Next.js + Payload CMS saat ini.

---

## 1. Ikhtisar Struktur Direktori

```text
prototype/
├── README.md                      # Dokumentasi peta struktur & navigasi agent
├── STRUKTUR.md                    # Salinan / alias dokumen navigasi struktur (berkas ini)
│
├── assets/                        # Bundel aset statis level atas
│   ├── font-0.css                 # Definisi font-face Inter lokal (Subset 1)
│   ├── font-1.css                 # Definisi font-face Inter lokal (Subset 2)
│   ├── font-2.css                 # Definisi font-face Material Symbols Outlined lokal
│   ├── tailwind.css               # Build CSS Tailwind mandiri untuk rendering offline
│   ├── fonts/                     # 9 berkas font .woff2 (Inter & Material Symbols)
│   └── img/                       # 12 gambar ilustrasi, logo, dan mockup umum
│
├── brand/                         # Aset identitas merek (Logo Vektor)
│   ├── openbyte-labs-official-brand-logo.svg       # Logo horizontal resmi (Wordmark + Lambang)
│   └── openbyte-labs-square-icon-1-1-logo-only.svg # Ikon kotak rasio 1:1 (Lambang saja)
│
└── stitch/                        # Direktori utama ekspor desain Stitch (33 Screen UI)
    ├── index.html                 # Portal navigasi katalog desain lokal (Buka di browser)
    │
    ├── _build/                    # Konfigurasi kompilasi desain Stitch
    │   ├── input.css              # Entry point CSS Tailwind
    │   └── tailwind.config.js     # Konfigurasi Tailwind & definisi seluruh design tokens
    │
    ├── assets/                    # Aset lengkap untuk halaman Stitch (self-contained)
    │   ├── font-0.css / font-1.css / font-2.css
    │   ├── tailwind.css
    │   ├── fonts/                 # 9 berkas font .woff2
    │   └── img/                   # 22 berkas gambar (mockup portofolio, logo, avatar)
    │
    ├── brand/                     # Salinan logo SVG untuk rendering lokal Stitch
    │   ├── openbyte-labs-official-brand-logo.svg
    │   └── openbyte-labs-square-icon-1-1-logo-only.svg
    │
    ├── docs/                      # Dokumentasi desain bawaan Stitch
    │   ├── design.md              # Spesifikasi Design System (Bento, Dual-Surface, Token Hex)
    │   └── prd-v1-1.md            # Arsip PRD historis v1.1.2 (referensi alur awal)
    │
    ├── system/                    # Layar dokumentasi arsitektur & panduan sistem desain
    │   ├── design-system-guidelines.html  # Pedoman visual Bento & kontras kontainer
    │   ├── overview-architecture.html     # Ikhtisar arsitektur sistem & katalog produk
    │   ├── route-map-architecture.html    # Peta rute URL 32 layar dan matriks RBAC
    │   └── tokens-color-swatches.html     # Swatch palet warna, tipografi, dan token UI
    │
    ├── site/                      # 13 Layar Prototype Frontend Publik
    │   ├── 404.html                       # Halaman 404 (Not Found) & fallback token tidak valid
    │   ├── beranda.html                   # Beranda utama (Hero, Bento Layanan, Portofolio, FAQ)
    │   ├── blog.html                      # Halaman daftar artikel blog & wawasan rekayasa
    │   ├── booking-konsultasi.html        # Alur pemilihan jadwal & booking konsultasi
    │   ├── daftar-portofolio.html         # Galeri studi kasus portofolio dengan filter kategori
    │   ├── detail-layanan.html            # Halaman detail layanan tunggal (/layanan/[slug])
    │   ├── detail-proyek-sinduksadati.html # Studi kasus detail proyek portofolio
    │   ├── kalkulator-estimasi-biaya.html # Kalkulator biaya modular interaktif & form quote
    │   ├── ketentuan-layanan.html         # Syarat & ketentuan layanan, SLA, dan privasi
    │   ├── otentikasi-tracking-klien.html # Gerbang login tracking klien (Token + PIN)
    │   ├── paket-layanan-harga.html       # Daftar paket harga, komparasi fitur, dan add-on
    │   ├── portal-pelacakan-proyek-klien.html # Portal live tracker klien (Milestone, BAST, revisi)
    │   └── tentang-kami.html              # Profil engineer Muhammad Izzat & budaya rekayasa
    │
    └── cms/                       # 16 Layar Prototype Panel Admin CMS
        ├── login-admin.html               # Form login admin CMS & autentikasi 2FA OTP
        ├── dashboard-cms-admin.html       # Dashboard utama KPI, analitik, dan aktivitas proyek
        ├── proyek-klien-tracking.html     # Pipeline delivery proyek klien & setup tracking
        ├── proyek-showcase.html           # Manajemen portofolio showcase & studi kasus
        ├── booking-konsultasi.html        # Kalender & log booking konsultasi klien
        ├── site-settings.html             # Pengaturan situs global, SEO, kontak WhatsApp
        ├── layanan-bento.html             # Manajemen kartu bento layanan & penawaran
        ├── inquiry-pemesanan.html         # Manajemen prospek/lead inquiry masuk dari web & WA
        ├── quote-kalkulator.html          # Manajemen pengajuan estimasi biaya dari kalkulator
        ├── paket-layanan-addon.html       # Konfigurasi master paket harga dan katalog add-on
        ├── kategori-teknologi.html        # Taksonomi kategori proyek dan database tech stack
        ├── template-tahap.html            # Template tahapan standar/milestone delivery proyek
        ├── testimoni-faq.html             # Manajemen ulasan testimoni klien & daftar accordion FAQ
        ├── invoice-penagihan.html         # Manajemen invoice termin, bukti bayar QRIS, & BAST
        ├── manajemen-staf.html            # Manajemen staf internal dan hak akses peran (RBAC)
        └── log-aktivitas-2fa.html         # Audit trail keamanan, aktivitas admin, & log 2FA
```

---

## 2. Rincian Detail Tiap Folder & Kegunaannya

### 2.1 `prototype/brand/` & `prototype/stitch/brand/`
Folder ini menyimpan aset visual vektor identitas resmi OpenByte Labs:
* **[openbyte-labs-official-brand-logo.svg](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/brand/openbyte-labs-official-brand-logo.svg)**:
  Logo utama dengan orientasi horizontal yang memadukan iconmark dan wordmark OpenByte Labs. Digunakan pada navbar desktop dan header dokumen.
* **[openbyte-labs-square-icon-1-1-logo-only.svg](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/brand/openbyte-labs-square-icon-1-1-logo-only.svg)**:
  Iconmark rasio 1:1 tanpa teks. Digunakan untuk favicon, avatar profil, mobile app icon, dan indikator brand ringkas.

---

### 2.2 `prototype/assets/` & `prototype/stitch/assets/`
Menyediakan dependensi statis mandiri (*self-contained*) agar seluruh halaman mockup dapat dibuka dan dirender sempurna tanpa memerlukan koneksi internet:
* **`fonts/`**: Berisi 9 file `.woff2` font Inter (berbagai bobot: Regular, Medium, SemiBold, Bold) serta font icon Material Symbols.
* **`font-0.css`, `font-1.css`, `font-2.css`**: Lembar gaya CSS yang mendeklarasikan `@font-face` lokal menuju berkas `.woff2`.
* **`tailwind.css`**: Bundle CSS Tailwind hasil build yang memuat kelas utilitas untuk seluruh mockup.
* **`img/`**: Berisi aset gambar screenshot studi kasus (misalnya mockup aplikasi SINDUKSADATI), foto avatar testimoni, logo partner, dan elemen latar belakang kartu.

---

### 2.3 `prototype/stitch/_build/`
Folder ini memuat fondasi konfigurasi build CSS prototipe:
* **[tailwind.config.js](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/_build/tailwind.config.js)**:
  **Sangat penting bagi agen frontend.** Berkas ini memuat definisi token desain lengkap yang dipakai dalam desain Stitch:
  * **Warna Dasar & Kontainer:**
    * `surface-canvas`: `#FFFFFF` (Kanvas terang utama)
    * `surface-dark`: `#18181A` (Kontainer obsidian analitik / kartu sorotan)
    * `surface-dark-elevated`: `#242427` (Permukaan input / kartu di dalam kontainer gelap)
    * `surface-subtle`: `#F0F0F0` (Latar kartu bento mikro & tab non-aktif)
    * `border-light`: `#EAEAEA` / `border-dark`: `#2E2E32`
  * **Warna Aksen & Semantik:**
    * `secondary` / Brand Lime: `#D2D88F` (Aksen hijau limau khas OpenByte Labs)
    * `status-success`: `#82B440` (Hijau untuk rating bintang & status selesai/lunas)
    * `status-warning`: `#F97316` (Oranye untuk status proses / revisi)
    * `status-neutral`: `#9CA3AF` (Abu-abu untuk draft / pending)
  * **Skala Tipografi Inter:** `label-micro` (11px), `label-regular` (12px), `body-medium` (13px), `body-default` (14px), `metric-value` (16px), `headline-sm` (18px), `headline-md` (20px), `headline-lg` (28px), `display-kpi` (40px).

---

### 2.4 `prototype/stitch/docs/`
Folder dokumentasi kontekstual:
* **[design.md](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/docs/design.md)**:
  Panduan lengkap filosofi desain UI/UX OpenByte Labs:
  1. *Strategic Surface Contrast* (Kanvas putih bersih dikombinasikan dengan kontainer analitik hitam `#18181A`).
  2. *Modular Bento Hierarchy* (Pengelompokan informasi berbentuk kartu sudut membulat tegas).
  3. *Soft Chartreuse Accent* (Aksen `#D2D88F` terukur).
  4. *Breathable Data Density* (Kepadatan data proporsional dengan whitespace konsisten).
* **[prd-v1-1.md](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/docs/prd-v1-1.md)**:
  Dokumen historis PRD versi 1.1.2. Disimpan untuk melacak evolusi fitur dan struktur formulir awal.

---

### 2.5 `prototype/stitch/system/` (Design Guidelines & Architecture)
Empat halaman visual untuk memandu konsistensi UI/UX:
1. **[route-map-architecture.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/system/route-map-architecture.html)**:
   Peta interaktif 32 layar (Public Web vs CMS Admin) yang memperlihatkan struktur URL, penanggung jawab alur, dan matriks hak akses RBAC (Super Admin, Project Manager, Client, Public Guest).
2. **[tokens-color-swatches.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/system/tokens-color-swatches.html)**:
   Visualisasi palet swatch warna hex, rasio kontras warna, sampel tipografi, dan perbandingan varian container.
3. **[design-system-guidelines.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/system/design-system-guidelines.html)**:
   Pedoman implementasi komponen kartu bento, tombol CTA primer/sekunder, dan tata letak dual-surface.
4. **[overview-architecture.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/system/overview-architecture.html)**:
   Ikhtisar profil profesional personal brand Muhammad Izzat Farahidi dan ringkasan kapabilitas teknologi sistem.

---

### 2.6 `prototype/stitch/site/` (Frontend Publik — 13 Layar)
Halaman prototipe antarmuka publik yang akan diimplementasikan pada Next.js App Router `src/app/(frontend)`:

| Berkas Prototype | Rute Target Next.js | Deskripsi & Komponen Kunci | Cakupan Rilis |
| :--- | :--- | :--- | :--- |
| **[beranda.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/beranda.html)** | `/` | Hero section, metrik kepercayaan, bento kartu layanan, showcase portofolio unggulan, testimoni, accordion FAQ, banner CTA. | Rilis 1 (Fase 3) |
| **[paket-layanan-harga.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/paket-layanan-harga.html)** | `/layanan` | Kartu paket (Starter, Pro, Enterprise), perbandingan tabel fitur, katalog add-on modular, CTA booking konsultasi. | Rilis 1 (Fase 3) |
| **[detail-layanan.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/detail-layanan.html)** | `/layanan/[slug]` | Halaman spesifik satu layanan: ruang lingkup deliverable, teknologi yang dipakai, tahapan kerja, estimasi waktu, formulir inquiry. | Rilis 1 (Fase 3) |
| **[daftar-portofolio.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/daftar-portofolio.html)** | `/portofolio` | Katalog studi kasus portofolio dengan filter kategori interaktif (Web, Mobile, Enterprise), tag teknologi, ringkasan dampak. | Rilis 1 (Fase 3) |
| **[detail-proyek-sinduksadati.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/detail-proyek-sinduksadati.html)** | `/portofolio/[slug]` | Studi kasus komprehensif proyek (Contoh: SINDUKSADATI): latar belakang masalah, arsitektur solusi, galeri screenshot, metrik dampak. | Rilis 1 (Fase 3) |
| **[kalkulator-estimasi-biaya.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/kalkulator-estimasi-biaya.html)** | `/kalkulator` | Kalkulator harga interaktif modular: pemilihan platform, modul fitur, add-on, kalkulasi biaya real-time, form submit quote request. | Rilis 1 (Fase 4) |
| **[booking-konsultasi.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/booking-konsultasi.html)** | `/booking` | Pemilihan tanggal & slot waktu konsultasi, validasi nomor WhatsApp, anti-double-booking, konfirmasi jadwal. | Rilis 1 (Fase 4) |
| **[tentang-kami.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/tentang-kami.html)** | `/tentang-kami` | Profil profesional Muhammad Izzat Farahidi, filosofi engineering, standar kualitas kode, sertifikasi/stack. | Rilis 1 (Fase 3) |
| **[blog.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/blog.html)** | `/blog` | Daftar artikel wawasan teknologi, tutorial rekayasa perangkat lunak, dan studi arsitektur sistem. | Rilis 1 (Fase 3) |
| **[ketentuan-layanan.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/ketentuan-layanan.html)** | `/ketentuan-layanan` | Dokumen hukum syarat & ketentuan, garansi bug, kebijakan revisi (14 hari), SLA, dan kebijakan privasi (UU PDP). | Rilis 1 (Fase 3) |
| **[404.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/404.html)** | `/not-found` & fallback 404 | Tampilan error 404 berestetika bento serta layar fallback jika token pelacakan proyek tidak ditemukan. | Rilis 1 (Fase 3) |
| **[otentikasi-tracking-klien.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/otentikasi-tracking-klien.html)** | `/tracking` | Gerbang autentikasi klien: form input Kode Proyek (8 karakter) dan PIN Keamanan (6 digit) dengan proteksi lockout. | **Rilis 2 (Fase 6)** *(Rute wajib 404 di Rilis 1)* |
| **[portal-pelacakan-proyek-klien.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/site/portal-pelacakan-proyek-klien.html)** | `/tracking/[token]` | Portal klien komprehensif: stepper progres milestone, status termin pembayaran, unduh deliverable, form pengajuan revisi, approval BAST. | **Rilis 2 (Fase 6)** *(Rute wajib 404 di Rilis 1)* |

---

### 2.7 `prototype/stitch/cms/` (Panel Admin CMS — 16 Layar)
Mockup antarmuka panel administrasi Payload CMS (`/admin`):

| Berkas Prototype | Koleksi / Global Payload Terkait | Deskripsi Fitur CMS | Cakupan Rilis |
| :--- | :--- | :--- | :--- |
| **[login-admin.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/login-admin.html)** | `users` (Auth) | Form login staf internal dengan input email, kata sandi, dan prompt kode 2FA OTP. | Rilis 1 (Fase 1) |
| **[dashboard-cms-admin.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/dashboard-cms-admin.html)** | Custom Admin Component | Dashboard statistik analitik: grafik pendapatan termin, jumlah lead aktif, antrean booking, shortcut aksi cepat. | Rilis 1 (Fase 2) |
| **[site-settings.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/site-settings.html)** | `site-settings` (Global) | Form pengaturan metadata SEO global, kontak WhatsApp, profil sosial media, switch status operasional website. | Rilis 1 (Fase 2) |
| **[layanan-bento.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/layanan-bento.html)** | `services` | Manajemen item layanan: judul bento, ringkasan fitur, ikon teknologi, badge sorotan, urutan tampilan beranda. | Rilis 1 (Fase 2) |
| **[proyek-showcase.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/proyek-showcase.html)** | `projects` | CRUD portofolio publik: judul proyek, ringkasan tantangan/solusi/dampak, galeri media, draft/publish, kustom SEO. | Rilis 1 (Fase 2) |
| **[booking-konsultasi.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/booking-konsultasi.html)** | `consultation-bookings`, `availability-rules` | Kalender manajemen jadwal booking: lihat pesanan sesi konsultasi, verifikasi status, blokir tanggal libur (`blocked-dates`). | Rilis 1 (Fase 4) |
| **[inquiry-pemesanan.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/inquiry-pemesanan.html)** | `inquiries` | Tabel pesan prospek/lead yang masuk dari form paket layanan dan tombol WhatsApp: status tindak lanjut, catatan internal. | Rilis 1 (Fase 4) |
| **[quote-kalkulator.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/quote-kalkulator.html)** | `quote-requests` | Arsip data pengajuan kalkulator estimasi dari calon klien: rincian modul yang dipilih, rincian biaya estimasi, kontak prospek. | Rilis 1 (Fase 4) |
| **[paket-layanan-addon.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/paket-layanan-addon.html)** | `service-packages`, `service-addons` | Konfigurasi paket harga (Starter, Pro, Enterprise), daftar fitur inklusif, kuota revisi bawaan, dan katalog opsi add-on. | Rilis 1 (Fase 4) |
| **[kategori-teknologi.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/kategori-teknologi.html)** | `categories`, `technologies` | Master taksonomi kategori (Web App, Mobile, Enterprise) dan katalog badge teknologi (Next.js, Flutter, PostgreSQL, dll). | Rilis 1 (Fase 2) |
| **[testimoni-faq.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/testimoni-faq.html)** | `testimonials`, `faqs` | Pengelolaan ulasan klien nyata (foto, nama, jabatan, bintang rating) dan daftar pertanyaan/jawaban FAQ beranda. | Rilis 1 (Fase 2) |
| **[manajemen-staf.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/manajemen-staf.html)** | `users` | Manajemen akun staf internal, pengaturan hak akses peran (Super Admin vs Project Manager), dan status aktivasi 2FA. | Rilis 1 (Fase 1) |
| **[log-aktivitas-2fa.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/log-aktivitas-2fa.html)** | `audit-logs` | Tabel catatan audit trail keamanan: riwayat login admin, perubahan skema harga, export data, dan log kegagalan 2FA. | Rilis 1 (Fase 1) |
| **[proyek-klien-tracking.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/proyek-klien-tracking.html)** | `client-projects`, `project-updates` | Manajemen alur pengerjaan proyek klien nyata: pembuatan token 8 digit + PIN hash, update milestone aktif, kuota revisi. | **Rilis 2 (Fase 6)** |
| **[template-tahap.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/template-tahap.html)** | `step-templates` | Template tahapan delivery proyek (misal: Tahap 1 Discovery & Wireframe, Tahap 2 UI Development, Tahap 3 QA & UAT). | **Rilis 2 (Fase 6)** |
| **[invoice-penagihan.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/cms/invoice-penagihan.html)** | `payments`, `project-documents` | Manajemen termin pembayaran per proyek (DP 30%, Termin 40%, Pelunasan 30%), unggah bukti QRIS/Transfer, penerbitan BAST. | **Rilis 2 (Fase 6)** |

---

## 3. Panduan untuk AI Coding Agent

Bagi agen yang bertugas membangun komponen atau halaman:

1. **Pratinjau Visual Terpadu:**
   Buka berkas [prototype/stitch/index.html](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/index.html) di browser. Halaman ini berfungsi sebagai dasbor indeks yang menautkan ke seluruh 33 layar mockup HTML.
2. **Ekstraksi Kode HTML / Tailwind:**
   * Jangan mengonversi layout HTML secara membabi-buta menjadi monolitik; pecah elemen berulang menjadi komponen React di `src/components/` (misalnya: `BentoCard`, `PricingCard`, `ProjectCard`, `ConsultationModal`, `AccordionFAQ`).
   * Gunakan token warna semantik di [tailwind.config.js](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/_build/tailwind.config.js) dan [design.md](file:///C:/FLUTTER PROJEK/gabut/OpenByteLabs/prototype/stitch/docs/design.md).
3. **Patuhi Batasan Rilis (AGENTS.md Bagian 2):**
   * **Rilis 1 (Fase 0 s.d. 5):** Hanya bangun komponen yang dibutuhkan oleh situs publik dan admin Rilis 1.
   * **Rilis 2 (Fase 6):** Jangan membuat komponen `/tracking*` sebelum diperintahkan secara eksplisit.
4. **Isolasi Prototipe:**
   * Seluruh berkas di dalam `prototype/` bersifat **hanya baca sebagai referensi desain**. Jangan mengubah, memindahkan, atau menghapus berkas di dalam direktori `prototype/` kecuali jika ada instruksi khusus pembaruan aset desain.
