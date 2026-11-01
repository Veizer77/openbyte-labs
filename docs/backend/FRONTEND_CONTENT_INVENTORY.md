# Inventaris Konten Frontend — Rilis 1

Status: **inventaris source saja**. Manifest typed `src/seed/frontend-content/manifest.ts` (`openbyte-frontend-r1`, versi 1) berisi contoh anonim untuk ditinjau. Tidak ada inspeksi atau mutasi database maupun transfer R2 dalam pekerjaan ini; isi repository bukan bukti keadaan layanan dev/produksi.

Importer memiliki guard dan mode dry-run/apply, tetapi jangan jalankan. Database, migrasi, seed/import, portal/tracking, dan R2 produksi tetap menunggu persetujuan owner. Route katalog memakai `force-dynamic`.

## Ringkasan kandidat

| Koleksi              | Terinventaris | Status dev saat ini                         | Catatan yang tetap perlu dijaga                                                                 |
| -------------------- | ------------: | ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Projects             |             6 | draft; belum disetujui                      | Payload anonim; seluruhnya menunggu verifikasi fakta, aset, dan persetujuan owner.                 |
| Services             |             4 | kandidat source                             | Belum diimpor; tinjau copy/klaim dan persetujuan sebelum rilis publik.                            |
| Testimonials         |             2 | ditahan; tidak diimpor                     | Nama narasumber/izin/kutipan tidak lengkap; tidak membuat identitas atau testimoni.              |
| FAQ inline beranda   |             4 | kandidat tetap nonaktif                    | Terpisah dari FAQ foundation; tidak mengaktifkan FAQ tracking Rilis 2.                           |
| Gambar proyek        |             6 | referensi aset lokal                        | Tidak ada inspeksi bucket, upload, atau finalisasi R2 dalam pekerjaan ini.                         |
| Page copy            | 7 kelompok gap | belum diimpor sebagai halaman database     | Page Builder belum merepresentasikan seluruh copy aktif.                                        |

Importer dirancang untuk mempertahankan data foundation yang ada. Keadaan database saat ini tidak dibaca atau diverifikasi; tidak ada izin untuk menjalankan seed ulang atau mengubahnya.

## Matriks proyek

Semua entri memakai `sourceKey` stabil yang generik. Konten fixture dianonimkan, berstatus draft dan belum disetujui; tidak ada proyek yang diimpor atau dipublikasikan oleh perubahan ini.

| Source key                 | Fixture                                       | Layar publik/listing                                                                                                                                                                              | Konflik yang menahan apply                                                                                                                                             |
| -------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project:example-1` | Proyek Contoh 1 | Contoh sistem informasi | Draft anonim; rincian, klaim dampak, dan aset belum disetujui. |
| `project:example-2` | Proyek Contoh 2 | Contoh aplikasi layanan | Draft anonim; rincian, klaim dampak, dan aset belum disetujui. |
| `project:example-3` | Proyek Contoh 3 | Contoh aplikasi operasional | Draft anonim; rincian, klaim dampak, dan aset belum disetujui. |
| `project:example-4` | Proyek Contoh 4 | Contoh katalog digital | Draft anonim; rincian, klaim dampak, dan aset belum disetujui. |
| `project:example-5` | Proyek Contoh 5 | Contoh website layanan | Draft anonim; rincian, klaim dampak, dan aset belum disetujui. |
| `project:example-6` | Proyek Contoh 6 | Contoh microsite acara | Draft anonim; rincian, klaim dampak, dan aset belum disetujui. |

Nama klien, kontak, identitas proyek, tahun, tautan, dan klaim hasil dihapus atau digeneralisasi. Source variants yang tersisa hanya untuk peninjauan konten dan tidak menjadi dasar publikasi otomatis.

## Field dan schema

| Konten/field sumber                                                                 | Tujuan schema yang tersedia                  | Status pemetaan                                                                                                                                                                                               |
| ----------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project title, slug, tagline, summary, client, year, blocks, links, featured, order | `projects` / `projectInputSchema`            | Sebagian ada. Variasi tampilan per konteks belum didukung; client/year/link hanya diisi jika disetujui.                                                                                                       |
| Kategori dan teknologi project                                                      | `project_categories`, `project_technologies` | Nama fixture dan kartu tidak selalu sama. Resolver slug/UUID perlu review; importer tidak memakai ID fixture.                                                                                                 |
| Featured image, gallery, alt, variants                                              | `media` + R2; project image refs             | Referensi aset lokal belum ditinjau atau ditransfer. Showcase beranda yang memakai sumber berbeda tidak otomatis dianggap sebagai aset project.                                                        |
| Service title, description, highlights, icon, active/order                          | `services` / `serviceInputSchema`            | Struktur cukup untuk kartu ringkas. `icon` memakai allowlist Lucide sedangkan tampilan memakai Material Symbols; jangan substitusi otomatis. Klaim membuat layanan nonaktif sampai review.                    |
| Testimonial quote, role, author name, photo, project, active/order                  | `testimonials` / `testimonialInputSchema`    | Sumber hanya memberi role dan organisasi; `authorName` wajib, tetapi tidak tersedia. Jangan isi nama buatan atau simpan sebagai testimonial siap publikasi.                                                   |
| FAQ inline question/answer/tracking/order                                           | `faqs` / `faqInputSchema`                    | Keempat pasangan disimpan sebagai kandidat inactive di manifest. Jangan ganti 10 FAQ foundation; FAQ tracking harus tetap nonaktif.                                                                           |
| Beranda, tentang, detail layanan, legal                                             | `pages` / PageBlock atau `site_settings`     | Gap editor/schema: struktur prinsip, metodologi, tim, detail modul/SLA, CTA dan copy section belum punya representasi yang cocok dan dipakai layar aktif. Perlu desain data/editor minimal sebelum integrasi. |
| Hero/brand/SEO/booking/privacy                                                      | `site_settings`                              | Foundation settings dipertahankan. Nilai screen inline berbeda; halaman privacy/terms sekarang menyatakan status draf dan tetap perlu persetujuan. Jangan menimpa satu sumber dengan yang lain.               |
| FAQ homepage                                                                        | `faqs`                                       | Empat FAQ di beranda berbeda dari 10 FAQ foundation. FAQ tracking Rilis 2 tidak boleh diaktifkan.                                                                                                             |
| Paket/add-on/kalkulator/jadwal                                                      | Tabel foundation terkait                     | Record yang sudah tersimpan dipertahankan dan tidak ditulis ulang. Default source paket/FAQ dirapikan agar tidak menjanjikan jadwal, metode pembayaran, pemeliharaan, atau garansi yang belum disepakati; record DB tetap perlu ditinjau dan disetujui sebelum produksi. Screen paket statis bukan sumber aktif katalog dan tidak dijadikan acuan harga/claim. |

FAQ beranda yang dicatat sebagai kandidat inactive (bukan pengganti FAQ foundation):

| Source key                      | Pertanyaan                                                                      | Catatan review                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `faq:homepage-code-ownership`   | Bagaimana jaminan keamanan dan kepemilikan kode sumber (source code)?           | Jawaban mengarahkan hak dan scope ke kontrak; perlu legal review.               |
| `faq:homepage-hosting`          | Apakah sistem dapat beroperasi jika instansi tidak memiliki server lokal fisik? | Tidak menentukan provider/biaya.                                                |
| `faq:homepage-warranty`         | Berapa lama masa garansi bug dan pendampingan operasional paska rilis?          | Kandidat tetap inactive; copy publik aktif tidak menjanjikan durasi garansi tertentu. |
| `faq:homepage-project-progress` | Bagaimana mekanisme pelaporan progres pengerjaan proyek?                        | Menyebut tracking Rilis 2, sehingga `requiresTracking=true` dan tetap nonaktif. |

Screen CMS prototype bukan sumber data bisnis yang aman untuk import. Contoh nama, proyek, angka SLA, dan copy paket di screen preview tidak dimasukkan ke manifest dan tidak boleh dipersistenkan sebagai fakta.

Copy hero pada beberapa screen sumber berbeda dari default `site_settings.hero`. Implementasi memuat Settings dan section layanan/proyek/FAQ tertentu dari DB, namun copy/section lain di halaman publik masih statis. Rute tentang, detail layanan, privasi, dan ketentuan kini memakai copy ringkas yang tidak menjanjikan SLA/garansi yang belum disepakati. Jangan menganggap semua halaman sudah menjadi konten CMS.

## Gambar dan status media

Screenshot proyek dan layar demo yang memuat identitas, data operasional, atau detail klien telah dikeluarkan dari aset serta referensi pada branch kerja. Manifest saat ini tidak menyertakan aset proyek; seluruh contoh proyek tetap draft dan tanpa gambar utama sampai aset aman serta payload kanonis disetujui pemilik. Logo brand dipertahankan.

Dry-run dan apply belum dijalankan. Tidak ada pemeriksaan database, checksum aset dari layanan, transfer, finalisasi, atau verifikasi bucket R2. Importer menahan upload media proyek kecuali proyek berstatus `published` dan payload kanonis disetujui.

## Data yang dikecualikan

Tidak dimasukkan: booking pelanggan, inquiry, quote request, invoice/pembayaran, transaksi, akun/sesi/credential/2FA, histori audit, dashboard analytics, dan data operasional portal klien/tracking. `src/fixtures/booking.ts` hanya merupakan konfigurasi jadwal; aturan availability foundation tetap dijaga tanpa menggandakan reservasi.

## Batas setelah import dan pekerjaan lanjutan

1. Bootstrap owner memerlukan target direct yang disetujui, konfirmasi eksplisit, dan terminal interaktif. Lihat `docs/backend/OWNER_BOOTSTRAP.md`; jangan membagikan kredensial di chat.
2. Pastikan semua klaim/izin dan copy legal sebelum rilis. Testimoni dan FAQ kandidat tetap ditahan; konten `site_settings`/foundation tidak dimutasi oleh perubahan source.
3. UI Settings, Page Builder, FAQ/testimoni, paket/add-on, dan manajemen admin terhubung melalui actions server; integrasi nyata tetap perlu diuji pada target database terisolasi yang disetujui.
4. Sebagian copy halaman publik masih statis; rekonsiliasi data/settings dengan editor tanpa menghidupkan fixture atau konten trashed.
5. Route `/proyek/[slug]` saat ini membaca proyek published dari DB dan menghasilkan 404 bila tidak ada; tidak memakai fallback data proyek fixture.
6. Deployment, domain, konfigurasi produksi, backup/restore, persetujuan legal, dan kesiapan rilis tetap belum dituntaskan. Security headers/CI tersedia di repo tetapi belum membuktikan kesiapan produksi.

## Verifikasi operasi

`pnpm typecheck`, `pnpm lint`, `pnpm test`, dan `pnpm build` memeriksa source lokal. Integrasi PostgreSQL, browser/E2E, R2 nyata, migrasi, seed/import, dan deployment tidak dijalankan. Jangan menjalankan importer atau migrasi tanpa target terisolasi dan persetujuan owner.
