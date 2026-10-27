# DESIGN.md — Sistem Desain & Panduan UI/UX (OpenByte Labs Aesthetic)

Dokumen ini mendefinisikan aturan desain, token visual, arsitektur tata letak, dan spesifikasi komponen yang diekstrak dari antarmuka dashboard **OpenByte Labs**. Sistem desain ini menggabungkan estetika **High-Contrast Minimalist Bento** dengan pendekatan **Dual-Surface (Light Canvas & Dark Analytics Container)** untuk menciptakan antarmuka enterprise yang bersih, modern, dan mudah dipindai (*scannable*).

---

## 1. Filosofi & Karakteristik Utama

1. **Kontras Permukaan Strategis (*Strategic Surface Contrast*):** Menggunakan kanvas utama berwarna putih bersih (`#FFFFFF`) untuk menjaga keterbacaan tabel dan navigasi, namun menempatkan visualisasi data utama di dalam kontainer gelap pekat (`#18181A`) agar grafik dan angka KPI menonjol secara dramatis.
2. **Hierarki Bento Modular (*Modular Bento Hierarchy*):** Informasi dikelompokkan ke dalam kartu-kartu dengan sudut membulat (*rounded corners*) yang tegas, memanfaatkan latar abu-abu lembut (`#F0F0F0`) untuk mengelompokkan metrik mikro tanpa memerlukan garis batas (*border*) yang berat.
3. **Aksen Organik Modern (*Soft Chartreuse Accent*):** Mengimbangi skema monokromatik hitam-putih-abu dengan satu warna aksen khas yaitu hijau limau lembut (`#D2D88F`) yang digunakan secara terukur pada kartu fitur/promosi dan segmen grafik.
4. **Kepadatan Data yang Bernapas (*Breathable Data Density*):** Meskipun menampilkan banyak metrik logistik dan tabel pesanan, antarmuka tetap terasa lega berkat penggunaan *whitespace* yang konsisten, indikator status minimalis (titik warna), dan tipografi neo-grotesque yang presisi.

---

## 2. Sistem Warna (Color Palette & Tokens)

### 2.1 Palet Utama (Core Brand Palette)
Warna-warna fondasi yang diekstrak langsung dari spesifikasi branding:

| Nama Token | Kode Hex | Peran & Penggunaan Utama |
| :--- | :--- | :--- |
| **Brand Lime (Accent)** | `#D2D88F` | Latar kartu fitur/CTA sekunder (*"Vehicle on the road"*), segmen grafik utama, aksen sorotan. |
| **Obsidian Dark (Primary)** | `#18181A` | Kontainer analitik utama, tombol/tab aktif, tombol CTA di atas latar terang/aksen, teks utama. |
| **Pure White (Canvas)** | `#FFFFFF` | Latar belakang utama aplikasi, permukaan kartu sidebar, tombol utama di atas kontainer gelap, teks pada permukaan gelap. |
| **Soft Gray (Surface)** | `#F0F0F0` | Kartu metrik mikro, tab navigasi/filter tidak aktif, badge angka, tombol ikon sekunder. |

### 2.2 Palet Semantik & UI Lanjutan (Extended UI Tokens)
Warna pendukung yang digunakan pada elemen tabel, grafik, dan permukaan gelap:

* **Permukaan Gelap Sekunder (Dark Elevated Surface):**
  * `#242427` — Latar tombol ikon dan input pencarian di dalam kontainer `#18181A`.
  * `#333338` — Batang grafik (*bar chart*) tidak aktif di dalam kontainer gelap.
* **Tipografi (Text Colors):**
  * `#18181A` — Teks primer pada latar terang.
  * `#71717A` — Teks sekunder/label pada latar terang (contoh: sub-label *"Top driver"*, *"Needing service"*).
  * `#9CA3AF` — Header kolom tabel (`Order ID`, `Route`, `Status`) dan simbol mata uang `$`.
  * `#FFFFFF` — Teks primer dan angka KPI pada kontainer gelap.
* **Garis Batas & Pemisah (Borders & Dividers):**
  * `#EAEAEA` — *Border* luar kartu putih dan garis pemisah antar baris tabel (`1px solid`).
* **Status & Indikator Data (Semantic & Chart Colors):**
  * **Success / Delivered / Rating:** `#82B440` (Hijau daun lembut untuk badge `★ 9.7` dan titik status *Delivered*).
  * **Warning / In Transit:** `#F97316` (Oranye hangat untuk titik status *In transit*).
  * **Neutral / Picked Up:** `#9CA3AF` (Abu-abu netral untuk titik status *Picked up*).
  * **Palet Grafik (Sales Overview Gauge):**
    * Finland: `#7EC876` (Soft Green)
    * Sweden: `#D2D88F` (Brand Lime)
    * Iceland: `#E4E4E7` (Light Silver)
    * Estonia: `#7A9A95` (Muted Teal-Gray)
    * Other: `#C5B985` (Warm Sand)

### 2.3 Implementasi CSS Variables
```css
:root {
  /* Core Brand Colors */
  --color-brand-lime: #D2D88F;
  --color-obsidian: #18181A;
  --color-white: #FFFFFF;
  --color-soft-gray: #F0F0F0;

  /* Surface & Elevation */
  --bg-canvas: #FFFFFF;
  --bg-card-light: #FFFFFF;
  --bg-card-subtle: #F0F0F0;
  --bg-card-dark: #18181A;
  --bg-dark-elevated: #262629;

  /* Text Hierarchy */
  --text-primary: #18181A;
  --text-secondary: #6E6E73;
  --text-muted: #9CA3AF;
  --text-on-dark: #FFFFFF;
  --text-on-dark-muted: #8E8E93;

  /* Borders */
  --border-subtle: #EDEDED;
  --border-dark-subtle: #2E2E32;

  /* Semantic Status */
  --status-success: #82B440;
  --status-warning: #F57C00;
  --status-neutral: #9E9E9E;
}
```

---

## 3. Tipografi (Typography System)

### 3.1 Font Family
* **Typeface Utama:** `SF Pro Display` (untuk judul, KPI besar, dan UI utama) & `SF Pro Text` (untuk teks tabel dan label kecil).
* **Font Stack CSS:**
  ```css
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  ```
* **Atribut Angka:** Wajib menggunakan `font-variant-numeric: tabular-nums;` pada seluruh angka metrik, persentase, tanggal, dan nomor ID pesanan agar sejajar secara vertikal.

### 3.2 Skala & Hierarki Tipografi

| Elemen UI | Ukuran (`px`/`rem`) | Ketebalan (`font-weight`) | Line Height | Letter Spacing | Catatan Visual |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **KPI Utama (`$716,084`)** | `40px` (`2.5rem`) | `400` (Regular) | `1.1` | `-0.03em` | Simbol `$` menggunakan warna abu-abu `#71717A`, angka berwarna `#FFFFFF`. |
| **Judul Bagian Utama** | `18px - 20px` (`1.2rem`) | `500` (Medium) | `1.3` | `-0.015em` | Digunakan pada *"Fleet performance overview"*, *"Fulfillment Performance"*, *"Orders"*. |
| **Judul Kartu Promosi** | `18px` (`1.125rem`) | `600` (SemiBold) | `1.25` | `-0.01em` | Digunakan pada *"Vehicle on the road"* di atas latar `#D2D88F`. |
| **Nilai Metrik Mikro (`78%`)** | `16px` (`1rem`) | `600` (SemiBold) | `1.2` | `-0.01em` | Warna `#18181A`, ditempatkan di bagian bawah kartu `#F0F0F0`. |
| **Teks Utama Tabel & Navigasi** | `13px - 14px` (`0.85rem`) | `500` (Medium) | `1.4` | `0em` | Digunakan pada nama pengemudi, ID pesanan, tombol, dan tab filter. |
| **Label Mikro & Header Tabel** | `11px - 12px` (`0.75rem`) | `400` (Regular) | `1.3` | `+0.01em` | Digunakan pada *"Utilization"*, *"Order ID"*, *"Est. delivery"*, dan bulan grafik. |

---

## 4. Tata Letak & Sistem Grid (Layout & Spatial System)

### 4.1 Struktur Kanvas Global
* **Latar Belakang Aplikasi:** `#FFFFFF` murni tanpa *sidebar* gelap konvensional.
* **Padding Luar (Viewport Padding):** `20px` hingga `24px` di sekeliling tepi layar.
* **Top Navigation Bar:**
  * Tinggi: `64px`
  * Distribusi 3-Zona (`display: flex; justify-content: space-between; align-items: center;`):
    1. **Kiri:** Logo ikon persegi membulat hitam (`28px x 28px`) + Teks brand **OpenByte Labs** (`16px`, SemiBold).
    2. **Tengah:** Segmented Icon Navigation (`gap: 8px`). Item aktif menampilkan ikon + teks di dalam kapsul `#18181A`; 4 item tidak aktif hanya menampilkan ikon di dalam kotak `#F0F0F0` (`40px x 40px`).
    3. **Kanan:** Tombol ikon lonceng notifikasi (`#F0F0F0`) + Profil Pengguna (Foto avatar membulat `40px`, nama **Kent Torres** tebal, dan sub-teks jabatan **Admin**).

### 4.2 Grid Konten Utama (2-Column Asymmetric Split)
Area di bawah navigasi dibagi menjadi 2 kolom asimetris dengan jarak antar kolom (`gap`) sebesar `20px`:

1. **Kolom Kiri (Sidebar Panel — Lebar `~24%` atau `260px - 280px`):**
   * Tersusun secara vertikal (`display: flex; flex-direction: column; gap: 16px;`).
   * **Kartu Atas:** *Fleet performance overview* (Kartu putih dengan border `#EAEAEA`).
   * **Kartu Bawah:** *Vehicle on the road* (Kartu promosi berwarna `#D2D88F`).
2. **Kolom Kanan (Main Workspace — Lebar `~76%` atau `1fr`):**
   * Tersusun secara vertikal (`gap: 24px`).
   * **Baris Atas:** Kontainer Analitik Gelap (`#18181A`) yang di dalamnya terbagi lagi menjadi Baris Aksi Atas (Search + Export + Add Shipment) dan Grid 2-Kolom Analitik (*Fulfillment Performance* di kiri, *Sales Overview* di kanan).
   * **Baris Bawah:** Bagian Tabel *Orders* (Header + Filter Tabs + Data Table).

### 4.3 Aturan Sudut Membulat (Border Radius Tokens)
Konsistensi kelengkungan sudut sangat penting untuk meniru estetika gambar referensi:
* `--radius-xl: 20px;` — Kontainer analitik gelap utama (`#18181A`), kartu *Fleet performance*, dan kartu *Vehicle on the road*.
* `--radius-md: 12px;` — Kartu metrik mikro (`#F0F0F0`), tombol navigasi tengah, dan tombol CTA utama.
* `--radius-sm: 8px;` — Tombol ikon kecil di dalam kartu gelap, badge angka (`264`), dan badge rating (`★ 9.7`).
* `--radius-pill: 9999px;` — Tombol aksi tabel (`See more`), tombol menu (`...`), dan *tooltip* nilai grafik (`87%`).

---

## 5. Spesifikasi Komponen UI (Component Blueprint)

### 5.1 Kartu Metrik Mikro (Fleet Performance Grid)
* **Wadah Induk:** Latar `#FFFFFF`, border `1px solid #EAEAEA`, radius `20px`, padding `18px`.
* **Grid 2x2:** `display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;`
* **Item Kartu Mikro:**
  * Latar: `#F0F0F0`, radius `12px`, padding `12px`.
  * Susunan: Label kecil di atas (`11px`, `#6E6E73`), jarak vertikal `10px`, nilai metrik di bawah (`16px`, SemiBold `#18181A`).
* **Daftar Insiden & Kendaraan (Action Rows):**
  * Dipisahkan oleh garis horizontal tipis (`1px solid #F0F0F0`).
  * Kiri: Ikon garis (*outline icon*) di dalam kotak `#F0F0F0` (`36px x 36px`, radius `10px`).
  * Tengah: Judul (`13px` Medium `#18181A`) + Sub-label (`11px` Regular `#8E8E93`).
  * Kanan: Ikon panah chevron kanan (`>`) berukuran `14px`.

### 5.2 Kartu Promosi / Visual Callout (`Vehicle on the road`)
* **Latar:** `#D2D88F`, radius `20px`, padding `18px`, `overflow: hidden`, posisi `relative`.
* **Ilustrasi/Gambar:** Gambar truk 3D realistis ditempatkan rata kiri (*bleeding edge* di sisi kiri kartu) menempati sekitar `55%` tinggi atas kartu.
* **Konten Teks:** Rata kiri di bawah gambar, judul `#18181A` (`18px` SemiBold), deskripsi `#18181A` dengan opasitas `75%` (`12px`, maksimal 2 baris).
* **Tombol CTA:** Lebar penuh (`width: 100%`), tinggi `42px`, latar `#18181A`, teks `#FFFFFF` (`13px` Medium), dilengkapi ikon target/kompas di sebelah kanan teks.

### 5.3 Kontainer Analitik Gelap (Hero Dark Card)
* **Wadah:** Latar `#18181A`, radius `22px`, padding `20px 24px`, warna teks default `#FFFFFF`.
* **Header Bar Kontainer Gelap:**
  * **Search Input:** Latar transparan atau `#222225`, ikon kaca pembesar putih redup, placeholder *"Search order..."* (`13px`, `#71717A`).
  * **Tombol Export:** Ghost button (tanpa latar), ikon *upload/share* + teks *"Export"* (`13px`, `#FFFFFF`).
  * **Tombol Add New Shipment:** Latar `#FFFFFF`, teks `#18181A` (`13px` Medium), ikon `+` di kiri, padding `10px 16px`, radius `12px`.
* **Grafik 1 — Fulfillment Performance (Vertical Spike Bar Chart):**
  * **Baris Bulan:** `Feb` s/d `Nov` tersebar merata. Bulan aktif (`May`) berwarna `#FFFFFF` Medium, bulan lainnya `#6E6E73`.
  * **Visualisasi Batang:** Deretan batang vertikal rapat (~60–70 batang tipis dengan lebar `2px` dan jarak `4px`) berwarna `#333338`.
  * **Titik Sorotan (Active Bar):** Satu batang vertikal berwarna putih murni (`#FFFFFF`) dengan tinggi penuh disertai badge kapsul putih di puncaknya yang memuat teks `87%` (`11px` Bold `#18181A`).
* **Grafik 2 — Sales Overview (Semi-Circle Multi-Segment Gauge):**
  * **Baris KPI:** Angka `$716,084` berdampingan dengan badge tren `32.2% ↗` (latar `#262629`, teks `#9CA3AF`, `11px`, radius `6px`).
  * **Busur Grafik (Arc Gauge):** Setengah lingkaran ($180^\circ$) dengan ketebalan garis (`stroke-width`) sekitar `10px`, ujung segmen siku/sedikit membulat dengan celah tipis (`2px`) antar segmen warna.
  * **Legenda Kanan:** Daftar vertikal di sisi kanan busur, masing-masing menampilkan kotak warna (`8px x 8px`, radius `2px`), nama negara (`12px` `#FFFFFF`), dan persentase di bawahnya (`11px` `#6E6E73`).

### 5.4 Komponen Tabel Pesanan (Orders Table)
* **Filter Bar:**
  * Kiri: Judul `Orders` (`20px` Medium) + badge jumlah `264` (latar `#F0F0F0`, teks `#18181A`, `12px`, padding `2px 8px`, radius `6px`).
  * Kanan: Deretan tab kapsul/kotak membulat (`radius: 10px`, padding `8px 14px`, `13px`). Tab tidak aktif berlatar `#F0F0F0` dengan angka jumlah berwarna sedikit redup; tab aktif (`Assigned 53`) berlatar `#18181A` dengan teks `#FFFFFF`.
* **Desain Baris Tabel:**
  * Tanpa garis vertikal. Setiap baris dipisahkan oleh `border-bottom: 1px solid #F0F0F0` dengan tinggi baris sekitar `60px`.
  * **Pola Kolom Route (Asal & Tujuan):**
    * Menampilkan 2 baris teks dalam satu sel (kota asal di atas, kota tujuan di bawah).
    * Di sebelah kiri tiap kota terdapat ikon bendera negara berbentuk lingkaran (`14px x 14px`).
    * Di sebelah kiri bendera terdapat ikon panah lengkung kecil (`↪`) yang menghubungkan titik asal ke tujuan.
  * **Pola Kolom Status:**
    * Menggunakan pendekatan minimalis tanpa latar kapsul: hanya titik bulat (`6px x 6px`) diikuti teks status (`13px` Medium `#18181A`).
  * **Pola Kolom Aksi:**
    * Tombol `See more` (latar `#FFFFFF`, border `1px solid #EAEAEA`, radius `9999px`, padding `6px 14px`, `12px` Medium) + tombol ikon titik tiga `...` (bulat/kapsul dengan border `#EAEAEA`).

---

## 6. Aturan Do's & Don'ts (Panduan Implementasi)

### DO (Lakukan)
* **Gunakan Kontras Permukaan untuk Fokus:** Tempatkan grafik analitik utama di dalam kartu `#18181A` agar langsung menjadi pusat perhatian (*focal point*) saat halaman dibuka.
* **Jaga Keterbacaan dengan `#F0F0F0`:** Gunakan warna abu-abu lembut `#F0F0F0` untuk memisahkan sub-elemen (seperti 4 kotak metrik di sidebar dan tab filter) alih-alih menggunakan bayangan (*drop shadow*) yang gelap.
* **Gunakan Ikon Garis (Outline Icons) yang Konsisten:** Seluruh ikon navigasi, aksi, dan daftar kendaraan menggunakan *stroke width* `1.5px` hingga `1.75px` dengan sudut membulat.

### DON'T (Hindari)
* **Jangan Menggunakan Drop Shadow Berat:** Desain ini mengandalkan kontras warna bidang (*flat surface contrast*) dan *border* tipis `1px solid #EAEAEA`, bukan efek *elevation shadow* yang tebal.
* **Jangan Menggunakan Warna `#D2D88F` untuk Teks Kecil:** Warna hijau limau `#D2D88F` memiliki luminansi tinggi; gunakan hanya sebagai latar kartu dengan teks `#18181A` di atasnya, atau sebagai warna grafik di atas latar gelap `#18181A`.
* **Jangan Membungkus Status Tabel dengan Badge Berwarna Penuh:** Tetap gunakan indikator titik (`dot indicator`) kecil agar tabel terlihat bersih dan tidak penuh warna yang mengganggu mata.