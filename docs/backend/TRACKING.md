# Portal klien tersambung database

## Menggunakan portal

1. Masuk sebagai owner dan selesaikan MFA di `/admin/login`.
2. Buka **Operasional Klien → Proyek Klien & Tracking** (`/admin/proyek-klien`).
3. Buat proyek, isi klien/WhatsApp, biaya, kuota, tanggal, serta bagian yang boleh dilihat klien. Enam tahap dibuat dari template database bila tersedia, atau judul tahap bawaan PRD. Paket yang dipilih menyalin kuota, biaya revisi tambahan, dan kebijakan revisinya saat pembuatan.
4. Simpan PIN yang ditampilkan sekali. Database hanya menyimpan hash scrypt. Tombol WhatsApp mengirim tautan dan kode tanpa memasukkan PIN ke URL; bagikan PIN lewat pesan terpisah.
5. Tekan **Aktifkan Portal**. Navbar publik kemudian menuju `/tracking` pada development maupun produksi. Tidak ada perubahan flag atau data pada database aktif yang dijalankan otomatis oleh implementasi ini.
6. Klien memasukkan kode dan PIN di `/tracking`, lalu masuk ke `/tracking/proyek`. Halaman ini membaca data asli, bukan layar `/preview`.

`SITE_URL` dan `BETTER_AUTH_URL` harus sesuai origin aplikasi. Jangan menggunakan HTML dari port 5500 sebagai endpoint login; prototype tetap menjadi referensi visual, sedangkan form fungsional berada di aplikasi Next.js.

## Pengelolaan proyek

- **Proyek:** data klien, paket/kategori, biaya, tanggal, tautan, catatan internal, dan toggle visibilitas. Proyek yang diarsipkan tidak dapat diakses klien.
- **Tahap & Milestone:** enam tahap dan checklist per proyek. Satu milestone per baris; awali `[x]` untuk selesai. `currentStep` dihitung server dari tahap belum selesai yang paling awal.
- **Pembayaran:** tambah/ubah/hapus catatan, bukti privat, dan visibilitas riwayat. Total terbayar, saldo, dan status dihitung ulang dalam transaksi yang sama, bukan diterima dari klien. Pembayaran invoice tetap masuk ke ledger `payments` proyek.
- **Invoice:** owner dapat membuat invoice bertahap, menetapkan nomor, nilai, jatuh tempo, catatan, dan status draft/terbit/batal. Jumlah invoice aktif tidak boleh melampaui nilai proyek. Pembayaran hanya dapat dialokasikan ke invoice terbit, tidak boleh melampaui sisa invoice atau nilai proyek, dan tetap menghasilkan satu catatan pada ledger pembayaran proyek.
- **Template tahap:** editor mengelola enam template global dan milestone default. Template dipakai ketika proyek baru dibuat; perubahan tidak menimpa checklist proyek yang sudah berjalan.
- **Berkas privat:** daftar hanya menampilkan metadata berkas terverifikasi yang masih terhubung ke dokumen, bukti pembayaran, revisi, atau diskusi proyek. Unduhan melewati otorisasi proyek dan signed URL singkat.
- **Portofolio:** proyek hanya dapat dikonversi setelah keenam tahap selesai dan persetujuan serah terima akhir ada. Sistem membuat shell anonim berstatus draft; judul, slug, kontak klien, gambar, ringkasan, dan konten klien tidak disalin. Owner/editor konten harus menambahkan materi yang disetujui sebelum publikasi.
- **Revisi:** buka/tutup review, terima/tolak pengajuan, tetapkan harga, mulai pengerjaan, dan selesaikan. Kuota berkurang hanya saat pengajuan diterima. Bug tidak mengurangi kuota. Revisi tambahan membutuhkan harga dan persetujuan klien sebelum diterima; harga ditambahkan ke total tepat sekali.
- **Diskusi:** komentar umum atau utas revisi, dengan lampiran. Catatan internal admin tidak dikirim ke klien, termasuk akses berkasnya.
- **Dokumen & Timeline:** tautan HTTPS, berkas privat, dan pembaruan yang dapat ditampilkan/disembunyikan.
- **Persetujuan:** klien mengisi nama dan memasukkan ulang PIN. Bukti berisi waktu, hash IP, dan user agent. Aplikasi tidak menyediakan aksi mengubah/menghapus bukti. Serah terima akhir membutuhkan tahap 1–5 selesai, pembayaran lunas, dan tidak ada revisi terbuka.
- Daftar admin dibatasi 200 proyek terbaru; setiap bagian detail dibatasi 1.000 catatan. UI ini belum memberi paginasi lanjutan pada daftar proyek dan detail portal.

## Keamanan

- Cookie tracking terpisah dari cookie admin, `httpOnly`, `sameSite=lax`, `secure` di produksi. Payload ditandatangani HMAC-SHA256 dengan kunci turunan khusus tracking dari `BETTER_AUTH_SECRET`. Payload hanya berisi id proyek, versi PIN, waktu sesi, dan nonce; tidak berisi PIN atau data klien.
- Setiap baca/mutasi mengecek flag aktif, kedaluwarsa, versi PIN database, serta status arsip/hapus. Regenerasi PIN langsung mencabut sesi lama.
- Login memakai penghitung PostgreSQL dengan kunci per kode, kode+IP, dan IP global. Kunci dikunci dalam urutan tetap pada transaksi. Pesan salah selalu sama; kode yang tidak ditemukan tetap menjalankan scrypt.
- Komentar/revisi dibatasi 20 mutasi per proyek+IP per 15 menit; persetujuan memiliki budget PIN tambahan 5 percobaan. Budget dicatat sebelum transaksi mutasi agar kegagalan tidak mengembalikan jatah percobaan.
- Server Actions memeriksa sesi/MFA/role owner atau sesi proyek pada setiap panggilan. Id proyek dari payload klien tidak dipakai untuk menentukan hak akses.
- Semua halaman tracking dinamis, `noindex`, dan `private, no-store`. Teks klien dirender sebagai teks, bukan HTML. DTO klien tidak memuat hash PIN, catatan internal, kontak privat, atau identitas bukti audit sensitif.
- `TRUSTED_IP_HEADER` hanya aman jika proxy hosting menimpa header tersebut; ikuti `TRANSPORT.md`. Fallback loopback hanya digunakan ketika header tidak tersedia dalam development.

## Berkas privat R2

- `R2_BUCKET_STAGING` menunjuk bucket privat dan harus berbeda dari `R2_BUCKET_PUBLIC`. Implementasi saat ini tidak menerima alias `R2_BUCKET_PRIVATE`. Bucket tidak boleh memiliki akses publik/custom domain publik.
- Implementasi tidak bisa membuktikan kebijakan publik bucket dari API S3. Operator wajib memeriksa akses publik bucket di Cloudflare sebelum mengunggah dokumen klien.
- Izinkan CORS `PUT` dari origin aplikasi yang tepat dengan header `Content-Type`. Tidak perlu membuka `*`. CSP mengizinkan koneksi hanya ke account/bucket R2 yang dikonfigurasi.
- Maksimal 5 lampiran, masing-masing 5 MB. Format: JPEG, PNG, WebP, PDF, ZIP. Nama tidak boleh mengandung path/control character. Server memeriksa ukuran, MIME, dan signature isi, lalu menulis ulang byte terverifikasi ke key berbeda sebelum menandainya final. URL unggah lama tidak dapat menimpa key final.
- Semua akses download memeriksa relasi proyek serta visibilitas komentar/dokumen/pembayaran. URL download berlaku 60 detik, memaksa attachment/octet-stream, dan tidak memakai base URL bucket publik.
- URL unggah berlaku 5 menit. Upload yang ditinggalkan perlu dibersihkan operator dengan mencocokkan metadata yang belum terverifikasi dan prefix `tracking/<id-proyek>/pending/`. Jangan menganggap prefix lifecycle mendukung wildcard; tidak ada lifecycle atau bucket yang dibuat otomatis.
- Bila konfigurasi privat belum aman, portal tanpa lampiran tetap berfungsi dan unggah/unduh ditolak dengan pesan jelas. Integrasi S3 diuji dengan mock; transfer ke bucket R2 nyata masih memerlukan konfigurasi dan pengujian operator.

## Pengujian

```powershell
pnpm typecheck
pnpm test
pnpm build
pnpm test:tracking
```

`pnpm test:tracking` memuat env melalui `@next/env`, lalu memvalidasi `TEST_DATABASE_URL`, `TEST_DATABASE_TARGET`, dan `TEST_DATABASE_WRITE_CONFIRM=I_CONFIRM_ISOLATED_TEST_DATABASE`. Target wajib berakhiran `_test`/`-test` dan berbeda dari semua koneksi aplikasi. Tidak ada fallback ke database dev/produksi dan tidak ada migrasi otomatis.

Smoke browser menjalankan server development tersendiri di `127.0.0.1:3102` dengan output `.next/tracking-browser`, membuat owner/sesi MFA fixture dan proyek bertanda unik, lalu menguji pembuatan proyek melalui UI admin, aktivasi portal, login klien, revisi, diskusi/internal notes, logout, dan pencabutan sesi setelah PIN diganti. Fixture owner adalah mekanisme pengujian, bukan bypass di aplikasi. Kredensial tidak dicetak. Data fixture dihapus dan Settings awal dikembalikan setelah pengujian. Jalankan hanya pada target test terisolasi, tanpa suite lain yang mengubah Settings secara bersamaan.

`tests/integration/tracking.integration.test.ts` menguji store PostgreSQL di target terisolasi; seluruh fixture dan perubahan Settings di-rollback. Unit test mencakup sesi, PIN, vektor rate-limit F.6, mesin status revisi F.4, role/MFA, payload whitelist, serta CSP.

## Status verifikasi

- Verifikasi portal terdahulu: pemeriksaan baca-saja menemukan tabel portal yang digunakan pada target aplikasi/test, dan smoke browser memakai database test terisolasi. Aktivasi untuk penggunaan nyata tetap dilakukan owner dari panel admin.
- Pada 1 November 2026, perubahan CMS lokal lulus `pnpm typecheck`, `pnpm test` (298 unit test/63 berkas), `pnpm lint`, dan `pnpm build`. Tes integrasi database dan smoke browser tidak dijalankan ulang untuk perubahan CMS/invoice/template/konversi ini.
- `pnpm db:generate` membuat migrasi `0016_dark_surge.sql` secara offline untuk tabel invoice dan relasi ledger. Migrasi tersebut belum ditinjau/diterapkan ke database aplikasi atau test pada pekerjaan ini.
- Transfer ke R2 asli belum diuji. Portal tidak diaktifkan oleh pekerjaan ini; bucket privat tetap perlu diverifikasi owner.
- Untuk smoke runtime produksi setelah portal diaktifkan, set `SMOKE_TRACKING_ENABLED=true` sebelum `pnpm test:production`; default skrip tetap mengharapkan portal nonaktif.
- Deployment, domain, validasi bucket R2 aktual, dan persetujuan rilis produksi tidak dilakukan oleh pekerjaan ini.
