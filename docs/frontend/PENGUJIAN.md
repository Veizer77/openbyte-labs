# Hasil pengujian frontend

Lingkungan checkpoint frontend awal: Windows, Node.js 26.8.2, pnpm 12.3.4, Chrome desktop. Tanggal: 28 Oktober 2026. Hasil browser/smoke di bawah adalah bukti historis untuk state saat itu, bukan verifikasi penuh integrasi database 31 Oktober.

## Pembaruan 10 November 2026 (verifikasi ulang)

Angka di bawah bagian ini adalah **snapshot lama** (237/54, 36/3, 107 E2E) dan tidak lagi mewakili codebase. Hasil yang dijalankan ulang pada worktree utama:

| Pemeriksaan | Hasil |
|---|---|
| `pnpm typecheck` | Lulus, 0 error |
| `pnpm lint` | 0 error / 8 warning (`no-unused-vars`) |
| `pnpm test` | **439 lulus / 85 berkas** |
| `pnpm test:integration` | Tidak dijalankan ulang (butuh database uji terisolasi) |
| `pnpm build` | Tidak dapat diselesaikan pada sesi ini karena guard penghapusan massal lingkungan saat Next membersihkan `.next/trace-build`; bukan error kompilasi. Build terakhir yang terdokumentasi lulus pada 7 November 2026 |

Perbaikan yang membuat suite kembali hijau: harness `tests/unit/load-local-env.test.ts` kini memakai namespace import + fallback `default` (Node 22 + tsx menyajikan `.ts` dari `eval` ESM sebagai CJS), `vitest.config.ts` membatasi `maxWorkers: 4`, dan dua tes berat diberi timeout eksplisit. Sebelumnya 4 tes gagal karena named import, lalu 2 tes gagal karena timeout 5 detik akibat 85 worker paralel.

Status produksi terbaru: Rilis 1 live, portal tracking aktif sejak 10 November 2026. `scripts/smoke-production.mjs` mendeteksi status portal otomatis dari `/tracking`, sehingga `pnpm test:production` tidak lagi memerlukan `SMOKE_TRACKING_ENABLED` untuk target produksi (tetap set `SMOKE_INDEXING_ENABLED=true`).

## Pembaruan 31 Oktober 2026

| Pemeriksaan | Hasil terakhir |
|---|---|
| `pnpm typecheck` | Lulus |
| `pnpm test` | 237 lulus di 54 berkas; termasuk tes regresi rotasi sesi enrollment dan penolakan assurance yang tidak sah |
| `pnpm lint` | Lulus tanpa error atau warning pada verifikasi akhir 31 Oktober |
| `pnpm test:integration` | Tidak diulang pada checkpoint ini; bukti tersimpan sebelumnya 7/7 pada database test terisolasi `openbyte_r1_test` |
| `pnpm build` | Lulus pada Next.js 16.4.3, 31 Oktober; route publik/admin dinamis dan login/robots/sitemap statis |
| Form publik saat ini | Inquiry, booking, dan quote mengirim Server Actions; quote dihitung ulang di server, booking memakai availability action |
| `/health` saat ini | `SELECT 1`; 200 bila DB tersambung, 503 jika belum siap |

Full E2E browser belum dijalankan ulang setelah integrasi database/admin. Smoke test produksi lokal lama mengasumsikan `/health` selalu `503 not_connected`, sehingga hasil lama tidak berlaku untuk implementasi health yang sekarang. `pnpm test:production` saat ini membutuhkan runtime database valid dan harus mengharapkan health 200.

## Pemeriksaan kode

| Perintah | Hasil |
| --- | --- |
| `pnpm typecheck` | Lulus |
| `pnpm lint` | Lulus tanpa warning |
| `pnpm test` | 36 tes unit lulus, 3 berkas |
| `pnpm check:portability` | Lulus, tanpa import CMS lama, `@vercel/*`, iframe, atau injeksi HTML |
| `pnpm audit --audit-level=high` | Tidak ada kerentanan yang diketahui pada dependency tree yang diperiksa |
| `pnpm build` | Lulus, konten publik SSG; booking/pemesanan dinamis |
| `pnpm test:production` | 20 pemeriksaan HTTP pada hasil `pnpm build` + `pnpm start` lulus |

Versi Zod, Vitest, dan PostCSS diperbarui setelah audit awal menemukan advisory. Versi yang diuji dan dikunci: Zod 4.6.7, Vitest 5.0.5, PostCSS 8.5.32. Tidak ditambahkan override transitive yang tidak dibutuhkan.

## Tes browser

`pnpm test:e2e`: **107 tes lulus** dalam satu full run.

- 33 layar, masing-masing smoke desktop dan mobile: 66 tes. Tidak ada `pageerror` pada pemeriksaan tersebut.
- 7 rute utama pada lebar 360, 768, 1024, dan 1440: 28 tes. Pemeriksaan overflow dokumen lulus. Ini bukan audit semua kemungkinan clipping internal atau seluruh WCAG.
- 9 tes alur interaktif.
- 4 perbandingan referensi visual pada desktop 1440px.

Setelah pemisahan rute dinamis `/pesan`, tiga tes regresi terkait navigasi, form inquiry, dan detail/tautan proyek dijalankan ulang dan lulus.

### Alur yang dijalankan pada checkpoint frontend-only (28 Oktober)

| Kontrol/alur | Bukti perilaku |
| --- | --- |
| Navigasi Proyek Portofolio | Klik dari beranda menuju `/proyek` |
| Tracking Rilis 1 | `/tracking` dan `/tracking/proyek` 404; navbar development menyediakan Tracking Klien menuju portal contoh, sedangkan navbar produksi tetap menyembunyikannya |
| Detail proyek | Enam slug mengembalikan 200; tautan internal beranda menuju rute valid |
| Kalkulator landing | Radio mengubah hasil menjadi Rp 600.000–1.200.000 |
| Aturan excludes | Android nonaktif saat Landing Page dipilih |
| Unit tambahan | Tombol tambah mengubah estimasi menjadi Rp 675.000–1.350.000 |
| Aturan requires | Memilih RBAC otomatis memilih Sistem Informasi |
| Form inquiry kosong | Validasi nama/WhatsApp/pesan/persetujuan tampil |
| Form inquiry valid | Pada checkpoint tersebut berupa simulasi lokal. Sekarang form memakai `submitInquiryAction`; tes HTTP/DB nyata tetap perlu diperbarui. |
| Booking | Pada checkpoint tersebut slot UI lokal; sekarang kalender membaca availability action dan pengajuan memakai `submitBookingAction`. Tes E2E DB nyata belum dijalankan ulang. |
| Admin showcase | Navigasi sidebar, dialog tambah, tutup dengan Escape, dan hasil pencarian kosong bekerja |
| FAQ | Pertanyaan dibuka dan ditutup; jawaban tersembunyi kembali |
| Filter portofolio | Bisnis & UMKM menampilkan 2 kartu; Semua Proyek mengembalikan 6 kartu |
| Menu admin mobile | Dialog buka/tutup dengan Escape; navigasi ke Media; menu menutup setelah navigasi |
| Media lokal | SVG ditolak; JPEG dapat dipreview; alt dapat diedit; gambar dapat dihapus dari preview |

Pengujian 28 Oktober tidak mengklaim telah mengklik seluruh tombol pada seluruh layar. Jangan memakai bagian ini sebagai bukti bahwa aksi backend saat ini simulasi; gunakan catatan pembaruan 31 Oktober di atas.

## Smoke runtime produksi lokal — checkpoint 28 Oktober (historis)

`pnpm start --port 3002` dijalankan terhadap build produksi, lalu `pnpm test:production` memeriksa 20 respons HTTP:

- Halaman publik, detail proyek, booking, form pemesanan, privasi, dan layar login: 200.
- Paket tidak dikenal dan slug proyek tidak dikenal: 404.
- Dashboard/admin settings dan katalog preview: 404, bukan bypass autentikasi.
- `/tracking` dan `/tracking/proyek`: 404.
- Alias `/portofolio` dan `/booking`: redirect ke rute kanonis yang menghasilkan 200.
- `/health`: pada checkpoint tersebut 503 `database: not_connected`; perilaku ini sudah berubah dan kini route mengecek koneksi DB.
- Header `X-Robots-Tag: noindex` diperiksa pada setiap respons akhir.

Seluruh pemeriksaan lulus setelah perbaikan rute dinamis dan redirect alias. Server produksi lokal hanya dipakai untuk smoke test; preview development tetap di port 3001.

## Perbandingan visual

HTML prototype dikompilasi memakai kelasnya sendiri untuk membangun referensi independen. CSS bundle lama pada prototype tidak memuat semua kelas hasil ekspor fixed-pixel, sehingga tidak dipakai sebagai satu-satunya referensi. Folder prototype tidak ditulis ulang.

Pada elemen teks yang cocok dan unik, di luar header/sidebar yang sengaja disesuaikan, pemeriksaan posisi dan ukuran dengan toleransi 1px menghasilkan:

| Layar | Sampel | Sama dalam toleransi 1px |
| --- | ---: | ---: |
| Beranda | 111 | 111 |
| Daftar portofolio | 113 | 113 |
| Dashboard admin | 104 | 104 |

Screenshot login juga dihasilkan untuk review, tetapi tidak diberi persentase identik karena form serta label auth disesuaikan dengan batas preview dan stack PRD.

**Angka di atas bukan persentase pixel-perfect seluruh halaman.** Screenshot dan pengukuran asli tersedia di `artifacts/visual/*-reference.png`, `*-react.png`, dan `*-geometry.json`. Laporan browser tersedia di `playwright-report/` untuk run terakhir.

## Temuan yang diperbaiki

- Elemen desktop fixed/absolute memotong konten mobile: ditambahkan reflow responsif dan scroll tabel internal.
- Pilihan mode booking tertutup footer setelah delapan slot PRD ditampilkan: kontainer booking menjadi grid dengan tinggi mengikuti konten.
- Respons 404 sempat terkirim sebagai 200 akibat boundary loading tingkat root: skeleton dipisahkan menjadi komponen, dan status HTTP diperiksa kembali.
- `/pesan` sempat menghasilkan `DYNAMIC_SERVER_USAGE` pada runtime produksi: form dipisahkan ke rute `force-dynamic` tersendiri.
- Alias URL lama ditangani sebagai redirect pada konfigurasi Next.js, bukan bergantung pada fallback halaman SSG.

## Belum diuji / belum diimplementasikan pada keseluruhan aplikasi

Login/TOTP HTTP dengan owner nyata di Neon, matriks RBAC/IDOR HTTP lengkap, uji concurrency melalui alur layanan end-to-end, Turnstile ke Cloudflare, seluruh browser selain Chrome, perangkat fisik, screen reader/kontras lengkap, Lighthouse 4G, backup/restore, dan deployment cloud. UI Settings/Page Builder/paket/FAQ/staf/audit belum sepenuhnya terintegrasi. Tidak ada klaim kelulusan seluruh acceptance criteria backend atau kesiapan Rilis 1 produksi.
