# Audit Implementasi terhadap PRD v1.6.2

**Pembaruan audit:** 31 Oktober 2026  
**Acuan:** [`PRD_v1_6_2.md`](../PRD_v1_6_2.md), dokumen PRD bernama v1.6.2 tetapi isinya menyatakan spesifikasi versi 1.5.2.  
**Status:** audit kerja Rilis 1; bukan persetujuan rilis produksi.

> Audit 29 Oktober di bawah nama file ini sudah kedaluwarsa. Kode, database dev, media, transport, dan sejumlah layar telah berubah. Angka/temuan lama seperti “tidak ada jalur DB”, “admin belum ada”, “media belum ada”, dan skor 0–52% tidak berlaku lagi.

## 1. Ringkasan

Fondasi Neon/Drizzle, Server Actions, auth/TOTP, katalog publik DB, form publik, beberapa layar CRUD admin, dan pipeline media R2 sudah berjalan. Data dev juga sudah memuat katalog yang ditinjau. **Rilis 1 belum selesai dan belum layak disebut siap produksi.**

Target yang diverifikasi adalah lingkungan Neon dev non-produksi; identitas target disimpan pada konfigurasi operator lokal dan tidak dicatat di dokumen ini. Kondisi data pada pemeriksaan terakhir: 6 proyek terbit (3 unggulan), 4 layanan aktif, 9 FAQ aktif, 6 media final/24 varian WebP; foundation paket/add-on/kalkulator/jadwal tetap dipertahankan. Dua testimoni dan empat kandidat FAQ homepage ditahan. Tidak ada transaksi, booking, inquiry, quote, akun, atau testimoni palsu yang dibuat.

## 2. Matriks Acceptance Criteria

### 9.1 Dashboard admin custom & konten

| Kriteria PRD | Status | Bukti / gap |
|---|---|---|
| Site Settings (hero, trust metrics, menu, footer) berubah tanpa deploy | ❌ | DTO dan service tersedia; halaman Settings masih prototype dan belum menyimpan lewat action. |
| Blok beranda ditambah, disembunyikan, diurutkan dari admin | ❌ | Page Builder masih state lokal; tidak tersimpan ke tabel `pages`. |
| Draft tersembunyi, gambar wajib saat publish, jadwal publish ditaati | ⚠️ | Proyek mempunyai status/publish/version dan filter publik. Draft Mode belum ada; uji keseluruhan lifecycle/future publish belum menjadi gate akhir. |
| Proyek multi-kategori muncul pada filter/tab publik | ⚠️ | Relasi kategori dan admin project ada; katalog publik belum memenuhi acceptance UI filter/tab. |
| Drag-and-drop urutan proyek mengubah urutan publik | ❌ | Penyimpanan `sortOrder` tersedia; reorder drag-and-drop dan pembuktian publik belum selesai. |
| Gambar WebP tersimpan di R2 dan tahan redeploy | ⚠️ | Pipeline staging privat/finalisasi/Sharp dan enam aset dev sudah diverifikasi (24 varian); redeploy produksi belum dilakukan/diuji. |
| Seluruh dashboard mengikuti prototype dan seluruh data aktual DB-backed | ❌ | Route admin kini dibatasi ke modul yang terhubung: proyek, layanan, kategori/teknologi, media, kalkulator, booking/jadwal, inquiry, dan quote. Settings, halaman, paket/add-on, FAQ/testimoni, staf, audit UI, billing, dan portal belum dibuka sebagai modul admin aktif. |
| Template WhatsApp dapat diubah dari Settings | ❌ | Service/validator tersedia; UI Settings belum tersambung. |
| Draft Mode preview hanya untuk admin | ❌ | Belum diimplementasikan. Version history proyek bukan Next Draft Mode. |
| Tidak ada `[ISI]` dan klaim publik terbukti | ⚠️ | Halaman privacy/terms kini menyatakan status draf dan copy tentang/layanan menghindari SLA/garansi yang belum disepakati. Persetujuan legal, izin konten, dan review klaim tetap diperlukan. Kandidat testimonial/FAQ tetap ditahan. |
| Visual desktop/mobile sesuai prototype; state, keyboard, fokus, WCAG AA | ⚠️ | Porting visual dan responsivitas tersedia; pengujian browser dan geometri terbatas bukan audit semua piksel. Audit keyboard/screen reader/kontras formal belum selesai. |

### 9.2 Kalkulator, paket, booking

| Kriteria PRD | Status | Bukti / gap |
|---|---|---|
| Perubahan harga admin mengubah kalkulator publik | ⚠️ | Semua label harga kalkulator kini membaca konfigurasi DB; saat konfigurasi gagal kalkulator tidak menampilkan harga fixture. Acceptance perubahan konfigurasi tetap perlu diverifikasi pada lingkungan terkonfigurasi. |
| `requires`/`excludes`, grup wajib, harga minimum | ✅ | Logika kalkulator dan editor config DB tersedia; vektor algoritma diuji. |
| Manipulasi harga browser tidak mengubah quote | ✅ | Service quote menghitung ulang dari DB dan mengabaikan harga browser; action publik tersedia. |
| Paritas browser/server dan semua vektor F.1–F.6 | ⚠️ | Modul kalkulasi bersama dan unit test tersedia; tes paritas lengkap seluruh kombinasi lewat server belum dibuktikan pada rilis ini. |
| Dua booking tidak menempati slot tumpang tindih | ✅* | Exclusion constraint PostgreSQL dan uji integrasi concurrency terdokumentasi; `*` tes service/HTTP end-to-end terbaru tetap perlu menjadi release gate. |
| Batas tanggal, tanggal terblokir, WIB | ✅ | Availability server/action dan fungsi slot WIB tersedia; tambahkan verifikasi HTTP lintas timezone sebagai gate akhir. |
| Nomor WhatsApp invalid ditolak; `08…` → `628…` | ✅ | Normalisasi/validasi dan unit test tersedia. |

Paket/add-on foundation dipertahankan, tetapi UI admin paket belum tersambung; acceptance lengkap modul paket karena itu belum lulus.

### 9.3 Tracking, revisi, persetujuan (Rilis 2)

**Ditunda sesuai roadmap; 0% operasional.** Route `/tracking*` tetap 404 dan menu/fitur tracking tidak diaktifkan ulang. Kehadiran sebagian tabel portal pada migrasi tidak berarti portal klien sudah berfungsi.

### 9.4 Keamanan & operasional

| Kriteria PRD | Status | Bukti / gap |
|---|---|---|
| Owner/editor login memerlukan MFA; editor dibatasi | ⚠️ | Auth/TOTP, bukti MFA per sesi, lockout dan RBAC tersedia. Login/enrollment TOTP melalui HTTP pada lingkungan Neon yang disetujui belum menjadi gerbang terverifikasi; UI manajemen staf belum terintegrasi. |
| Matriks akses, IDOR, tidak ada CRUD generik, field privat | ⚠️ | Policy default-deny dan tests unit/integrasi tersedia; cakupan IDOR/CSRF lintas HTTP dan seluruh action belum menjadi gate lulus. |
| Rich text/link berbahaya tidak dieksekusi | ⚠️ | FAQ dirender sebagai node React dan schema rich text terbatas; audit seluruh renderer/link dan acceptance HTML mentah belum lengkap. |
| Header keamanan + CSP; admin/tracking noindex | ⚠️ | `noindex`, robots deny, header keamanan, CSP nonce via `src/proxy.ts`, dan HSTS production sudah dikonfigurasi. Browser/deployment validation belum dilakukan. |
| Tracking disabled menghasilkan 404 dan tidak muncul di navigasi/sitemap/WA | ✅ | `/tracking*` tetap 404; indexing dimatikan dan tracking tidak diaktifkan. |
| Migrasi manual terkontrol; `/health` memeriksa DB | ⚠️ | Migrasi memakai koneksi direct + konfirmasi target dan tidak otomatis pada CI/deploy. `/health` sekarang melakukan `SELECT 1`; uji uptime produksi belum ada. |
| Backup dan restore berhasil diuji | ❌ | Belum dikerjakan. |
| Berjalan pada hosting produksi terpilih | ❌ | Hosting/domain belum diputuskan; tidak ada deployment. |
| LCP beranda ≤ 1,8 detik | ❌ | Lighthouse/PageSpeed mobile 4G belum diukur. |

## 3. Verifikasi Terbaru dan Batas Bukti

Pemeriksaan lokal terakhir dijalankan setelah perubahan readiness dan copy pada 31 Oktober 2026. Pemeriksaan ini tidak menguji layanan eksternal, target database, atau deployment produksi.

| Pemeriksaan | Hasil |
|---|---|
| `pnpm typecheck` | Lulus setelah perubahan readiness pada 31 Oktober 2026 |
| `pnpm test` | 237 tes lulus di 54 berkas setelah perubahan readiness pada 31 Oktober 2026 |
| `pnpm lint` | Lulus tanpa error atau warning setelah perubahan readiness pada 31 Oktober 2026 |
| `pnpm audit --prod` | Tidak ada advisory dikenal setelah override terarah `esbuild` ke `0.25.12`; loader `@esbuild-kit` masih deprecated. Dijalankan 31 Oktober 2026. |
| `pnpm test:integration` | Checkpoint sebelumnya: 7 tes lulus pada database test terisolasi; tidak dijalankan ulang pada audit ini. |
| `pnpm build` | Lulus setelah perubahan readiness pada Next.js 16.4.3, 31 Oktober 2026; route publik/admin dinamis dan login/robots/sitemap statis. |
| DB/R2 dev | Konten dan media target dev diverifikasi; tidak membuktikan kesiapan produksi. |
| Tidak diklaim | E2E auth Neon dengan owner, layanan Turnstile produksi, backup/restore, aksesibilitas penuh, Lighthouse 4G, deployment, DNS. |

## 4. Urutan Penutupan Rilis 1

1. Verifikasi login/MFA hanya pada target non-produksi yang disetujui. Bootstrap/reset owner memerlukan target eksplisit dan persetujuan operator; ikuti [`backend/OWNER_BOOTSTRAP.md`](backend/OWNER_BOOTSTRAP.md) tanpa membagikan rahasia.
2. Sambungkan UI admin yang belum selesai ke actions/domain yang tersedia: Settings, paket/add-on, FAQ/testimoni, Page Builder/publish, staf, dan audit log. Jangan memperlakukan state lokal sebagai write database.
3. Selesaikan persetujuan copy, klaim, izin proyek, dan konten legal. Jangan membuat data demonstrasi yang menyerupai testimoni/transaksi pelanggan.
4. Verifikasi jalur publik gagal dengan aman saat DB/config tidak tersedia; kalkulator kini menolak menampilkan harga fixture sebagai fallback.
5. Jalankan rangkaian E2E pada runtime dev yang dikonfigurasi, cek RBAC/CSRF/IDOR HTTP, uji Turnstile, dan audit a11y/performa.
6. Validasi CSP/HSTS pada browser/deployment, siapkan monitoring, jalankan workflow CI/secret scan, dan lakukan backup terenkripsi serta restore drill. Catat hasil baru terpisah dari checkpoint lama.
7. Putuskan domain/hosting dan lakukan migrasi/deployment produksi hanya dengan persetujuan terpisah. **Tidak ada deploy atau perubahan DNS pada audit ini.**

## 5. Risiko dan Batas Kerja

- Variasi judul, kategori, teknologi, dan narasi masih ada pada sumber prototype. Canonical payload yang sudah dipilih untuk dev tidak menggantikan persetujuan konten rilis.
- Content importer/seed jangan dijalankan lagi tanpa memeriksa target database dan perubahan manifest. Importer tidak boleh menimpa edit atau memulihkan record trash.
- `pnpm test:integration` hanya untuk database test terisolasi; jangan arahkan ke database dev bersama atau produksi.
- Working tree mempunyai banyak perubahan belum di-commit. Jangan reset/revert atau membersihkan file yang belum dipahami.
- PRD sendiri mencatat spesifikasi versi 1.5.2 walau nama file `PRD_v1_6_2.md`; perbedaan penamaan ini perlu diperbaiki terpisah oleh pemilik spesifikasi.

## Addendum implementasi CMS — 1 November 2026

Snapshot matriks di atas bertanggal 31 Oktober. Status lokal setelah pekerjaan CMS:

- Site Settings, database-backed Dashboard, Page Builder CRUD/draft/publish/Trash/version, FAQ, testimoni, paket/add-on, staf, dan audit log kini memiliki UI yang memakai Server Actions. Ini menutup gap “UI prototype/state lokal” pada modul tersebut, tetapi belum membuktikan seluruh acceptance visual, ordering drag-and-drop, preview mode, konten per halaman, accessibility, atau pengujian browser.
- Operasional owner menambahkan invoice manual dengan pembayaran teralokasi ke ledger proyek yang sudah ada, editor template enam tahap untuk proyek baru, daftar metadata berkas privat, dan shell draft portofolio anonim setelah serah terima. Integrasi R2 nyata dan portal klien tetap menunggu konfigurasi/aktivasi owner.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` (298 unit test/63 berkas), dan `pnpm build` lulus pada 1 November. Integrasi PostgreSQL dan browser smoke tidak dijalankan ulang untuk perubahan ini.
- `pnpm db:generate` membuat `src/db/migrations/0016_dark_surge.sql` secara offline. Migrasi belum diterapkan ke database mana pun. Tidak ada perubahan data aplikasi, aktivasi portal, deployment, atau perubahan DNS.
- Percobaan menjalankan `pnpm dev` kedua mendeteksi proses Next yang sudah aktif pada port 3000; proses yang sudah ada menjawab HTTP 200 dan tidak dihentikan. Ini menjelaskan `ELIFECYCLE` reproduksi lokal sebagai konflik instance/lock, bukan error kompilasi aplikasi. Cek dan tutup hanya instance yang dipastikan milik operator sebelum mencoba ulang.
