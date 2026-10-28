# Inventaris prototype publik (F0-02)

- **Tanggal:** 28 Oktober 2026
- **Status artefak:** DITERIMA sebagai inventaris F0-02 oleh koordinator; lihat [keputusan review](review-koordinator.md). Bukan bukti implementasi UI.
- **Baseline:** `refactor/prd-v1-5-reset`, HEAD `fd1a98703857dbdc137788cc4aaa63140501fd8c`; working tree reset masih belum di-commit.
- **Sumber:** seluruh 13 HTML di `prototype/stitch/site/`, `prototype/STRUKTUR.md`, PRD 1.5. Prototype tidak diubah.
- **Batas:** analisis referensi visual dan kebutuhan, bukan implementasi, pixel-match, validasi konten final, atau persetujuan perubahan rute.

## Temuan lintas layar

Pemeriksaan statis pada 13 file menemukan root kanvas `1440px` dengan `overflow-hidden` pada seluruh file, tanpa breakpoint Tailwind responsif. Hitungan elemen semantik pada seluruh 13 file: 0 anchor, button, form, input, select, textarea, heading `h1`-`h6`, label, atribut ARIA, `role`, dan `tabindex`. Koreksi: seluruh 13 file memasang handler klik JavaScript untuk item navigasi dan logo; handler menetapkan `window.location.href` ke file HTML prototype. Tidak adanya elemen semantik tidak berarti handler tidak ada. Dua file yang dibaca langsung juga memakai `lang="en"` walau isi utamanya Indonesia.

Handler yang terdeteksi hanya untuk navigasi menu dan logo. Pemeriksaan sumber tidak menemukan handler aksi untuk form, filter, slot kalender, tab, accordion, CTA kartu, modal, atau toggle; kontrol tersebut masih visual-only. Ini berbeda dari navigasi yang sudah dipasangi handler, tetapi bukan bukti bahwa navigasi semantik, aksesibel, atau benar terhadap route produk. Implementasi perlu kontrol semantik dan perilaku nyata. State loading, empty, error, validasi/sukses, fokus keyboard, kontras WCAG AA, alt gambar, dan reflow mobile tetap acceptance implementasi. Uji target PRD: 360, 768, 1024, dan 1440+ px.

Teks, angka, kontak, foto, klien, kebijakan, klaim SLA/sertifikasi, harga, testimoni dan tanggal yang terlihat adalah isi contoh visual sampai pemilik memverifikasi dan menyetujuinya. Jangan menyalin klaim/PII/data seolah-olah nyata. Konten `[ISI]` tetap tidak boleh dipublikasikan. Navigasi tracking pada gambar prototype tidak boleh muncul di Rilis 1.

## Navigasi yang terpasang pada prototype

Pada seluruh 13 HTML publik, script memasang click handler untuk elemen menu yang cocok dengan `data-pencil-name`, lalu mengarahkan ke file prototype berikut. Logo juga mengarah ke `beranda.html`. Ini adalah tujuan file statis prototype, bukan jaminan route aplikasi sudah diputuskan atau tersedia.

| Label | Tujuan handler | Pemetaan route PRD / keputusan |
|---|---|---|
| Beranda | `beranda.html` | `/` |
| Proyek Portofolio | `daftar-portofolio.html` | PRD `/proyek`; prototype sebelumnya memakai `/portofolio`, gunakan PRD setelah redirect/alias disepakati. |
| Paket Layanan | `paket-layanan-harga.html` | `/paket` |
| Estimasi Biaya | `kalkulator-estimasi-biaya.html` | Prototype `/kalkulator`; route belum tercantum pada peta route PRD dan perlu keputusan. |
| Konsultasi | `booking-konsultasi.html` | PRD `/konsultasi`; prototype sebelumnya memakai `/booking`. |
| Tracking Klien | `portal-pelacakan-proyek-klien.html` | Rilis 2; `/tracking*` tetap 404 dan tidak ditautkan pada Rilis 1. |
| Logo | `beranda.html` | `/` |

Handler menu/logo ada di seluruh halaman: `beranda.html`, `daftar-portofolio.html`, `detail-proyek-sinduksadati.html`, `paket-layanan-harga.html`, `kalkulator-estimasi-biaya.html`, `booking-konsultasi.html`, `tentang-kami.html`, `detail-layanan.html`, `ketentuan-layanan.html`, `404.html`, `blog.html`, `otentikasi-tracking-klien.html`, dan `portal-pelacakan-proyek-klien.html`. Reviewer melaporkan reproduksi simulasi DOM untuk `Proyek Portofolio` menuju `daftar-portofolio.html`; tidak ada browser run dalam audit ini.

## Inventaris layar dan acceptance criteria

| Berkas layar | Pemetaan rute / rilis | Bagian dan maksud interaksi pada prototype | Acceptance criteria implementasi menurut PRD |
|---|---|---|---|
| `beranda.html` | `/`, Rilis 1, Fase 3 | Hero, CTA kalkulator/WhatsApp, layanan, portofolio unggulan, metrik, testimoni, FAQ, tentang, banner CTA. | Data dari halaman/settings dan relasi published; CTA menuju rute/aksi yang ada; metrik/testimoni/klaim harus nyata dan disetujui; state kosong/loading/error untuk blok data; halaman aman tanpa draft; tidak ada link tracking di Rilis 1. |
| `daftar-portofolio.html` | Prototype `/portofolio`; PRD `/proyek`, Rilis 1 | Galeri proyek, filter kategori/teknologi, kartu proyek. | Query hanya proyek published dengan `publishedAt <= sekarang`; filter kategori dapat dioperasikan keyboard dan tidak memuat ulang seluruh halaman; ada empty/error/loading; kartu mengarah ke slug aktif; DTO tidak memuat field internal. |
| `detail-proyek-sinduksadati.html` | Prototype `/portofolio/[slug]`; PRD `/proyek/[slug]`, Rilis 1 | Breadcrumb, studi kasus, metrik, stack, galeri, tautan dan proyek terkait. | Slug tidak ada/tidak published menghasilkan 404; blok tervalidasi, URL aman, alt media wajib; link eksternal berfungsi; metadata/OG sesuai konten yang disetujui; metrik dampak tidak dipakai tanpa bukti. |
| `paket-layanan-harga.html` | Prototype `/layanan`; PRD `/paket`, Rilis 1 | Paket bertingkat, perbandingan/deliverable, add-on, CTA order. | Jumlah paket mengikuti data aktif, bukan dipaksa tiga; uang integer Rupiah; diskon dihitung dari waktu server; CTA menuju form order yang benar; tidak mengunci harga contoh pada markup. |
| `kalkulator-estimasi-biaya.html` | Prototype `/kalkulator`; modul PRD 4.4 ada, tetapi rute tidak tercantum di tabel PRD 4.1 | Pilih platform/fitur/add-on, jumlah halaman, ringkasan biaya/durasi, kirim rincian. | Bekukan fixture Lampiran F.1 dahulu; mesin murni TS yang sama dipakai browser/server; enforce `requires`/`excludes`, required dan batas unit; server baca tarif terbaru, hitung ulang dan mengabaikan harga browser; Zod, Turnstile, rate limit, quote tersimpan dan WhatsApp ter-encode. Rute perlu keputusan/konfirmasi sebelum implementasi. |
| `booking-konsultasi.html` | Prototype `/booking`; PRD `/konsultasi`, Rilis 1/Fase 4 | Kalender, bulan/tanggal, slot, mode konsultasi, data kontak dan konfirmasi. | Slot berasal dari availability, blocked dates dan booking aktif; rentang tanggal, durasi/jeda serta zona `Asia/Jakarta` diberlakukan server; submission `pending`, anti-spam, idempotensi dan constraint race diuji; form sukses menampilkan referensi, Google Calendar dan WhatsApp. Jangan percaya slot browser. |
| `tentang-kami.html` | Prototype `/tentang-kami`; rute tidak ditetapkan pada tabel PRD 4.1 | Profil, prinsip, metodologi dan tim. | Putuskan dengan pemilik apakah halaman statis atau halaman konten/slug; isi identitas, pengalaman, sertifikasi dan foto harus disetujui; semua `[ISI]` ditahan; tidak menambahkan klaim atau route/nav tanpa keputusan. |
| `detail-layanan.html` | Prototype `/layanan/[slug]`; rute tidak ditetapkan pada tabel PRD 4.1 | Detail layanan, deliverable, modul, CTA simulasi/konsultasi. | `services` ada di domain, tetapi rute detail tidak ada di peta rute PRD; minta keputusan route dan scope. CTA hanya ke kalkulator/konsultasi yang benar-benar tersedia. |
| `ketentuan-layanan.html` | Prototype `/ketentuan-layanan`; PRD menetapkan `/kebijakan-privasi` | Konten legal, klausul, SLA dan navigasi legal. | Jangan menyamakan syarat layanan dengan kebijakan privasi. Pisahkan route/konten sesuai keputusan pemilik; kebijakan, hosting, retensi, garansi dan SLA `[ISI]` tidak dipublikasikan sebelum disetujui. |
| `404.html` | Next `not-found`/state error; bukan route produk | Pesan halaman tidak ditemukan dan fallback token tidak valid; link kontak. | Beri status 404 dan navigasi keluar yang nyata. Fallback tracking tetap 404, tanpa membocorkan apakah token ada atau membuka route Rilis 2. |
| `blog.html` | Tidak ada route/entity blog Rilis 1; PRD mengecualikan blog | Featured post, kartu artikel dan kategori. | Jangan menambah `/blog`, CMS artikel, atau menu untuk layar ini tanpa keputusan perubahan scope. |
| `otentikasi-tracking-klien.html` | `/tracking`; Rilis 2/Fase 6, wajib 404 pada Rilis 1 | Kode proyek + PIN, lockout dan tombol verifikasi. | Selama Rilis 1, seluruh `/tracking*` 404 dan tidak ditautkan. Tidak ada halaman/login tracking aktif. Jika dibuka pada Fase 6, PIN tidak di URL/log, rate limit mengikuti PRD, pesan gagal generik. |
| `portal-pelacakan-proyek-klien.html` | Prototype `/tracking/[token]`; PRD menulis `/tracking/proyek`, Rilis 2 | Progres, revisi, approval, keuangan, dokumen, sesi klien. | Rilis 1 404. Rilis 2 membutuhkan keputusan route, sesi terbatas per proyek, DTO visibility, autentikasi ulang tindakan sensitif dan pemisahan data privat; jangan bawa data contoh ke produk. |

## Konflik rute dan layar yang belum ada

| Topik | Acuan prototype | Acuan PRD aktif | Tindakan audit |
|---|---|---|---|
| Portfolio | `/portofolio`, `/portofolio/[slug]` | `/proyek`, `/proyek/[slug]` | Gunakan PRD untuk implementasi; jangan membuat redirect/alias tanpa persetujuan. |
| Harga dan layanan | `/layanan`, `/layanan/[slug]` | `/paket`; detail layanan tidak tercantum di peta route | Minta keputusan untuk detail layanan; halaman harga dipetakan ke `/paket`. |
| Booking | `/booking` | `/konsultasi` | Gunakan route PRD; validasi navigasi dan canonical. |
| Legal | `/ketentuan-layanan` | `/kebijakan-privasi` | Keduanya berbeda tujuan; butuh konten/keputusan pemilik. |
| Kalkulator | `/kalkulator` | Modul kalkulator terdefinisi, route tidak ada di tabel 4.1 | Tentukan route sebelum membuat link. |
| Tracking | `/tracking/[token]` | `/tracking/proyek`, seluruhnya 404 pada Rilis 1 | Tidak ada implementasi/link saat ini; route perlu diselaraskan hanya pada Fase 6. |
| Pemesanan | CTA pada layar harga | PRD `/pesan?paket={slug}` | Tidak ada layar form pemesanan mandiri di folder publik; perlu merancang form/data/empty/error sesuai PRD sebelum implementasi. |
| Privasi | Tidak ada layar bernama kebijakan privasi | PRD `/kebijakan-privasi` | Jangan menganggap halaman ketentuan sebagai kebijakan privasi. |
| Blog/detail layanan/tentang | Layar tersedia di prototype | Tidak ada di daftar route Rilis 1 | Minta keputusan scope/route; jangan menambah route diam-diam. |

Rute teknis `/health`, `/sitemap.xml`, `/robots.txt`, serta `error`/`global-error` juga tidak memiliki prototype khusus; implementasinya mengikuti PRD dan bukan alasan untuk menambah halaman promosi.

## Crosswalk implementasi per layar (usulan)

Nama service/action, schema, DTO, dan ID test di bawah adalah **usulan inventaris**, bukan simbol yang sudah ada di kode atau test yang sudah dijalankan. Bekukan nama, route, dan ID bersama pada F0-06. Browser tidak mengakses DB; read memakai server/service dan DTO allowlist. Mutasi kalkulator/pemesanan/booking memakai schema Zod, Turnstile/honeypot dan rate limit atomik. Harga/slot dibaca otoritatif. Renderer menerima node blok yang diizinkan, URL/media/alt/status tervalidasi, dan tidak merender HTML mentah. Fixture bisnis Lampiran F harus disetujui sebelum engine dibangun.

| ID / layar | Kontrol → aksi yang dipetakan | Service/action → schema/DTO (usulan) | Izin | State yang harus diterima | Acceptance / test ID (usulan) |
|---|---|---|---|---|---|
| PUB-01 `beranda.html` | Menu/logo; CTA paket, kalkulator, konsultasi/WhatsApp; blok proyek, testimonial, FAQ | `getPublicHome` → `PublicHomeDTO`, blok publik tervalidasi; CTA hanya navigasi/aksi eksternal yang disetujui | Publik; baca published saja | loading, blok kosong, error, sukses; CTA tujuan valid | Hanya konten approved/published, tanpa klaim contoh; `N09-PUB-01` |
| PUB-02 `daftar-portofolio.html` | Menu/logo; filter kategori/teknologi; klik kartu proyek | `listPublishedProjects` → `ProjectListQuerySchema`, `PublicProjectListDTO` | Publik; proyek published | loading, empty, error, hasil/filter | Filter dapat dioperasikan dan kartu ke slug aktif; `N09-PUB-02` |
| PUB-03 `detail-proyek-sinduksadati.html` | Menu/logo; breadcrumb, galeri, link eksternal, proyek terkait | `getPublishedProjectBySlug` → `ProjectSlugSchema`, `PublicProjectDetailDTO` | Publik; slug published | loading, not-found, error, sukses | Slug draft/tidak ada 404; URL/alt valid; `N09-PUB-03` |
| PUB-04 `paket-layanan-harga.html` | Menu/logo; pilihan paket/add-on; CTA pemesanan | `listActivePackages` → `PublicPackageListDTO`; CTA `/pesan?paket=...` menuju form PRD | Publik; paket/add-on aktif | loading, empty, error, hasil | Harga integer Rupiah, tidak menyalin harga contoh, CTA ke tujuan valid; `N09-PUB-04` |
| PUB-05 `kalkulator-estimasi-biaya.html` | Menu/logo; pilihan platform/fitur/add-on/unit; hitung dan kirim rincian | `calculateEstimate` (fungsi murni) + `createQuote` (service/action usulan) → `CalculatorInputSchema`, `EstimateDTO`, `QuoteReceiptDTO` | Publik dengan validasi server, Turnstile/honeypot, rate limit; tarif DB otoritatif | loading, empty, validasi, error, hasil, sukses | Fixture Lampiran F dibekukan; server hitung ulang dan abaikan harga browser; route perlu keputusan; `N09-PUB-05` |
| PUB-06 `booking-konsultasi.html` | Menu/logo; kalender/slot/mode; kirim form | `getAvailability` + `createBooking` → `BookingRequestSchema`, `AvailabilityDTO`, `BookingReceiptDTO` | Publik dengan anti-spam; slot/konflik divalidasi server | loading, slot kosong, error, validasi, sukses | Zona/rentang/durasi otoritatif, pending/idempotensi/race; `N09-PUB-06` |
| PUB-07 `tentang-kami.html` | Menu/logo; tautan/CTA | Jika disetujui: `getPublishedPage` → `PublicPageDTO`; bila statis, tidak perlu service | Publik, hanya isi yang disetujui | loading/error bila dinamis; state statis bila diputuskan | Route dan isi/identitas disetujui; `[ISI]` ditahan; `N09-PUB-07` |
| PUB-08 `detail-layanan.html` | Menu/logo; CTA kalkulator/konsultasi | Jika route disetujui: `getPublishedServiceBySlug` → `ServiceSlugSchema`, `PublicServiceDTO` | Publik; layanan published | loading, not-found, error, sukses | Route belum di peta PRD; CTA tidak ghost; `N09-PUB-08` |
| PUB-09 `ketentuan-layanan.html` | Menu/logo; navigasi legal | `getApprovedLegalPage` atau konten statis approved → `PublicLegalPageDTO` (usulan) | Publik; konten legal disetujui pemilik | state statis atau loading/error bila dinamis | Ketentuan layanan tidak dianggap kebijakan privasi; route/konten diputuskan; `N09-PUB-09` |
| PUB-10 `404.html` | Logo/tautan keluar ke beranda atau kontak nyata | Next `notFound`; tidak ada data service | Publik | not-found; tidak membocorkan resource | HTTP 404 dan fallback valid; tracking tetap 404 pada Rilis 1; `N09-PUB-10` |
| PUB-11 `blog.html` | Menu/logo prototype mengarah ke file; kartu artikel digambar | Tidak ada service/schema/DTO Rilis 1 | Tidak ada route Rilis 1 | Tidak diimplementasikan; bila route tak ada, 404 | Blog dikecualikan PRD; jangan jadikan menu produk; `N09-PUB-11` |
| PUB-12 `otentikasi-tracking-klien.html` | Menu/logo prototype; kode/PIN dan verifikasi digambar | Tidak ada auth/action Rilis 1; calon Fase 6 perlu kontrak baru | Semua aktor mendapat 404 pada Rilis 1 | 404; tidak ada state login aktif | `/tracking*` tetap 404 dan tidak tertaut; `N09-PUB-12` |
| PUB-13 `portal-pelacakan-proyek-klien.html` | Menu/logo prototype; milestone, komentar, approval, dokumen digambar | Tidak ada service/DTO Rilis 1; calon Fase 6 perlu kontrak/DTO per proyek | Semua aktor mendapat 404 pada Rilis 1 | 404 | Jangan menampilkan atau menyimpan data contoh; `N09-PUB-13` |

## Handoff

F0-02 menyerahkan konflik route dan kebutuhan form pemesanan, legal, about, kalkulator, serta detail layanan kepada koordinator untuk dibekukan sebelum implementasi. Penerimaan N-09 Fase 0 didasarkan pada lengkapnya inventaris layar/interaksi/pemetaan/acceptance sesuai PRD §12.3, bukan implementasi UI atau pengujian browser Fase 2/3. Acceptance implementasi, termasuk responsive, keyboard dan perilaku kontrol, diuji pada fase terkait. Koordinator menerima task audit F0-02 dan memperbarui status pada rencana; keputusan route/kontrak tetap diteruskan ke F0-06.
