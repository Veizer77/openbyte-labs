# CMS admin: integrasi dan batas operasional

## Modul

Route `/admin` mengarahkan ke Dashboard. Sidebar mengelompokkan konten website dan operasional klien. Data untuk dashboard, Settings, halaman, FAQ, testimoni, paket/add-on, pengguna, dan audit log dibaca atau diubah melalui Server Actions dan lapisan database yang ada.

- Editor mengelola konten sesuai policy server; akses tidak ditentukan oleh menu.
- Operasi proyek klien, booking, inquiry/quote, template tahap, invoice, berkas privat, pengguna, dan audit log owner-only.
- Dashboard editor hanya menampilkan metrik konten. Data operasional hanya dikembalikan kepada owner.
- Page Builder menyimpan blok tervalidasi, draft, status publish, Trash, dan snapshot versi. Publish/restore dan media tetap divalidasi server.
- Settings menyimpan per bagian. Policy server tetap membatasi field WhatsApp, booking, dan tracking.
- FAQ mempertahankan format RichText saat diedit; testimoni dan paket hanya aktif setelah validasi schema/domain.
- Halaman publik hanya membaca halaman berstatus `published` yang tidak berada di Trash. Preview draft memakai route admin dinamis dan izin `pages.read`; preview tidak membuka endpoint publik.
- Proyeksi katalog publik menghilangkan UUID/relasi internal dari testimoni dan add-on. Media hanya diresolusikan untuk aset finalized dan tidak dihapus, lalu browser menerima URL publik dan alt text, bukan object key atau ID media.
- Settings publik memakai whitelist field. URL logo, hero, favicon, dan Open Graph berasal dari media yang lolos resolusi; kebijakan privasi dengan marker/placeholder yang belum selesai tidak ditampilkan sebagai kebijakan final.
- Renderer Page Builder mencakup hero, grid layanan, portofolio, kalkulator, harga/add-on, testimoni, FAQ, tentang, CTA, dan RichText. Navigasi settings dibatasi ke target publik; `/admin`, `/api`, `/preview`, dan tracking yang belum aktif tidak ditautkan.
- Audit log read-only dan sanitasi diff dilakukan di service sebelum respons dikirim.

## Invoice dan ledger pembayaran

`project_invoices` menyimpan tagihan manual per proyek. Satu nomor invoice global harus cocok dengan pola `INV-YYYY-...`. Total seluruh invoice aktif tidak boleh melewati nilai proyek. Invoice yang sudah memiliki pembayaran tidak dapat dibatalkan atau diturunkan nilainya di bawah pembayaran yang teralokasi.

Pembayaran invoice tidak diduplikasi ke saldo invoice. Aksi admin memasukkan satu baris ke tabel `payments` proyek yang sudah dipakai portal, dengan `invoice_id` sebagai alokasi. Total terbayar, saldo, dan status proyek dihitung ulang oleh tracking store. Nilai pembayaran dibatasi oleh sisa invoice dan sisa nilai proyek di dalam transaksi.

Perubahan schema dibuat dengan `pnpm db:generate` menjadi `src/db/migrations/0016_dark_surge.sql`. Migrasi ini belum diterapkan. Sebelum penerapan, owner/operator harus meninjau SQL, memverifikasi target, dan menyetujui migrasi secara terpisah.

## Portal, berkas, dan portofolio

- Template tahap memuat tepat enam tahap dan milestone awal. Menyimpan template tidak mengubah proyek lama.
- Daftar berkas privat hanya menyertakan objek terverifikasi yang memiliki relasi proyek. Akses unduh tetap memeriksa sesi admin dan relasi file/proyek. Kesiapan UI hanya memeriksa keberadaan konfigurasi bucket; itu tidak membuktikan bucket Cloudflare benar-benar privat.
- Implementasi `privateStorage()` menggunakan `R2_BUCKET_STAGING`, yang wajib berbeda dari `R2_BUCKET_PUBLIC`. Alias `R2_BUCKET_PRIVATE` tidak digunakan. Owner harus memverifikasi policy akses publik dan CORS di Cloudflare; konfigurasi R2 produksi belum diuji.
- Konversi portofolio memerlukan keenam tahap berstatus selesai dan persetujuan `final_handover`. Hasilnya shell generik berstatus draft tanpa nama/kontak klien atau konten proyek. Materi dan izin publikasi harus ditambahkan secara manual sebelum publish.
- Portal masih harus diaktifkan owner melalui Settings setelah semua gate operasional terpenuhi. Implementasi ini tidak mengubah flag portal.

## Verifikasi dan keterbatasan

Pada 1 November 2026:

- `pnpm typecheck` — lulus.
- `pnpm test` — 307 unit test pada 66 berkas lulus.
- `pnpm lint` — lulus.
- `pnpm build` — lulus pada Next.js 16.4.3; route halaman publik dan preview admin terdeteksi dinamis.
- Integrasi PostgreSQL, browser smoke, dan transfer R2 nyata — tidak dijalankan ulang untuk perubahan ini.
- `pnpm db:generate` berjalan offline; tidak ada migrasi, seed, mutasi database, atau deployment.

Untuk dev server, bila `pnpm dev` kedua berhenti dengan `ELIFECYCLE`, periksa apakah server Next yang lain sudah memegang port 3000 atau lock `.next/dev`. Reproduksi lokal pada 1 November menemukan proses Next yang sudah aktif dan halaman `/admin/login` menjawab HTTP 200; proses yang sudah ada tidak dihentikan. Jangan membunuh proses itu tanpa memastikan bahwa proses tersebut memang milik sesi yang akan dihentikan.
