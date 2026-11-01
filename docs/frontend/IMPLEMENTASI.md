# Porting frontend prototype

Tanggal: 28 Oktober 2026. Acuan produk: `PRD_v1_6_2.md`. Acuan visual: `prototype/stitch/site`, `prototype/stitch/cms`, dan aset asli pemilik.

> **Catatan status 31 Oktober 2026:** dokumen ini merekam tahap porting frontend awal, bukan gambaran seluruh aplikasi hari ini. Katalog/operasi yang sudah tersambung ke database dan gap yang tersisa dicatat di `README.md`, `docs/AUDIT_PRD_v1_6_2.md`, dan `docs/backend/FONDASI.md`.

## Hasil implementasi

Seluruh 33 layar referensi mempunyai file React TSX tersendiri:

| Kelompok | Jumlah | Output |
| --- | ---: | --- |
| Website publik | 13 | `src/components/screens/site/` |
| Dashboard admin custom | 16 | `src/components/screens/cms/` |
| Dokumentasi visual | 4 | `src/components/screens/system/` |

Inventaris per layar dan rutenya tersedia di `src/fixtures/screens.json`. Katalog development pada `/preview` menautkan seluruh layar tersebut. Prototype tidak diubah; `git diff --name-only -- prototype` kosong saat pemeriksaan.

Tambahan yang diperlukan PRD, tetapi tidak memiliki layar referensi tersendiri:

- `/pesan?paket=...`: form inquiry dengan paket terpilih.
- `/kebijakan-privasi`: draf jujur untuk tahap frontend.
- Lima layar detail proyek ilustratif telah dianonimkan; konten dan metadata tetap draft/noindex sampai ditinjau dan disetujui pemilik.
- `/admin/halaman`: penyusunan/visibilitas blok dan status preview.
- `/admin/media`: pemilihan gambar lokal, alt, penolakan SVG/ukuran berlebih, penghapusan preview.
- `/admin/kalkulator`: pengeditan nilai item pada state lokal.
- Error global, error halaman, komponen loading, dan empty state tabel.

Tambahan ini mengikuti permukaan, radius, tipografi, dan warna prototype. Tidak ada klaim bahwa tambahan tanpa referensi tersebut merupakan salinan pixel-identik.

## Pilihan implementasi

- **Ukuran desktop** dipertahankan dari ekspor 1440px, termasuk kelas Tailwind arbitrer, ukuran font, gap, padding, warna, dan aset.
- **Responsif** mengalirkan kontainer fixed/absolute menjadi susunan yang dapat dibaca. Tabel lebar memakai scroll internal, menu admin memakai dialog pada viewport kecil. Prototype hanya menyediakan ekspor desktop, sehingga responsif adalah adaptasi, bukan perbandingan terhadap file mobile yang tidak tersedia.
- **React Server Components** untuk markup layar; Client Components hanya untuk state/kontrol. HTML tidak diinjeksi, dan folder prototype bukan dependency runtime.
- **Font** memakai file Inter asli melalui `next/font/local`. Material Symbols asli dipertahankan agar bentuk ikon tidak berubah. Tidak ada penggantian ikon ke library lain yang mengubah tampilannya.
- **Gambar** memakai aset lokal dan `next/image` dengan `unoptimized`, belum pipeline R2/Sharp.
- **Halaman konten** diprerender melalui `generateStaticParams`; konsultasi dinamis agar tanggal WIB tidak membeku pada waktu build.
- **Kontrol yang memerlukan backend** membuka penjelasan/simulasi yang jelas. Tidak ada pesan seolah data sudah tersimpan di server.

## Penyesuaian yang disengaja terhadap prototype

1. Menu Tracking Klien sekarang mengikuti `trackingEnabled` dari database dan menuju `/tracking`, bukan portal contoh. Owner mengaktifkannya di `/admin/proyek-klien`; saat nonaktif, menu dan akses portal ditutup. Layar prototype tetap tersedia lewat katalog development. Implementasi backend dan pengujian: `docs/backend/TRACKING.md`.
2. Label stack lama seperti Filament/Laravel/Docker dan brand MoveIQ yang ditemukan pada template diganti pada label terkait implementasi. Bentuk kontainernya dipertahankan.
3. Grup navigasi admin memakai Konten Website, Operasional Klien, dan Sistem sesuai PRD. Menu tambahan PRD memakai shell yang sama.
4. Form login tidak menyediakan passkey palsu atau sesi dummy. Kredensial tidak dikirim, dan dashboard preview tersedia terpisah hanya saat development.
5. Kalkulator memakai harga/durasi PRD; durasi item yang berbeda dari prototype ditampilkan dari fixture typed yang sama dengan mesin perhitungan.
6. Booking menampilkan delapan slot 60 menit, bukan empat rentang dua jam. Layout kolom dibuat mengikuti tinggi konten agar form dan mode konsultasi tidak tertutup footer.
7. Indikator preview menerangkan bahwa metrik/testimoni/status pada template adalah data contoh yang belum terverifikasi, bukan klaim produksi.

## Berkas utama

| Area | Berkas/direktori |
| --- | --- |
| Fondasi | `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json` |
| Rute | `src/app/(public)/`, `src/app/admin/`, `src/app/preview/` |
| Tampilan referensi | `src/components/screens/` |
| Header dan widget publik | `src/components/public/` |
| Shell/editor admin | `src/components/admin/` |
| State/kontrol preview | `src/components/preview/` |
| Data sementara | `src/fixtures/` |
| Algoritma/validasi | `src/lib/calculator`, `src/lib/booking`, `src/lib/whatsapp`, `src/schemas/contact.ts` |
| Pengujian | `tests/unit/`, `tests/e2e/`, `playwright.config.ts`, `vitest.config.ts` |
| Alat migrasi satu kali | `scripts/import-prototype.mjs` |

Penghapusan file bootstrap lama sudah ada di working tree sebelum pengerjaan dan tidak dibatalkan. Berkas fondasi frontend yang diperlukan dibuat kembali; modul backend yang sudah dihapus tidak dipulihkan atau dianggap masih berfungsi.

## Batas modul yang selesai

**Selesai sebagai tahap frontend (checkpoint 28 Oktober):** porting markup seluruh layar, navigasi, interaksi lokal yang dicantumkan di pengujian saat itu, fixture typed, kalkulator browser, slot WIB, validasi form, state preview, dan build aplikasi.

**Status sesudah integrasi 31 Oktober:** Drizzle/Neon, Better Auth/TOTP/RBAC, Server Actions, katalog publik dan form berbasis DB, CRUD admin terpilih, versi proyek, serta media R2/Sharp sudah ditambahkan dan sebagian diuji. Status akun/MFA harus diverifikasi pemilik pada target yang disetujui; dokumen ini tidak menyimpan status atau kredensial akun. Integrasi ini belum menutup Fase 1–5: beberapa layar admin masih belum terhubung, konten/Settings belum seluruhnya DB-backed, dan operasi produksi belum diverifikasi. Lihat matriks penerimaan di `docs/AUDIT_PRD_v1_6_2.md`.

## Risiko dan pemeriksaan lanjutan

- Pengujian browser saat ini memakai Chrome; Firefox, WebKit, perangkat fisik, screen reader, dan audit WCAG AA lengkap belum diverifikasi.
- Angka, testimoni, nama klien, klaim performa/keamanan, dan narasi studi kasus pada prototype harus ditinjau sebelum publikasi. Preview tidak membuktikan klaim tersebut.
- Kebijakan privasi masih draf. Domain, retensi, hosting produksi, dan seluruh izin publikasi tetap menjadi gerbang rilis.
- Sebagian aksi administratif merupakan dialog simulasi, bukan implementasi seluruh CRUD atau aturan server. State lokal sengaja tidak dianggap data tersimpan.
- Penilaian geometri pada sampel desktop bukan bukti bahwa seluruh piksel pada seluruh layar/tema/state identik. Screenshot lengkap tersedia untuk review pemilik.
- `prototype:import` dapat menimpa hasil layar. Jangan jalankan ulang setelah suntingan manual tanpa memeriksa diff.
- Tidak ada database, secret, deployment, atau layanan cloud yang diubah oleh tahap frontend ini.
