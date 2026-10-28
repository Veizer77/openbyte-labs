# Inventaris prototype admin (F0-03)

- **Tanggal:** 28 Oktober 2026
- **Status artefak:** DITERIMA sebagai inventaris F0-03 oleh koordinator; lihat [keputusan review](review-koordinator.md). Bukan bukti implementasi UI atau pemaksaan izin.
- **Baseline:** `refactor/prd-v1-5-reset`, HEAD `fd1a98703857dbdc137788cc4aaa63140501fd8c`; working tree reset belum di-commit.
- **Sumber:** seluruh 16 HTML di `prototype/stitch/cms/`, `prototype/STRUKTUR.md`, PRD 1.5 bagian 5, 6.2, 6.5. Prototype hanya dibaca.

## Temuan lintas layar

Semua 16 file adalah ekspor kanvas statis: root fixed `1440px` dan `overflow-hidden`; pemeriksaan tag menemukan 0 anchor, button, form, input, select, textarea, heading, label, atribut ARIA, `role`, `tabindex`, dan breakpoint responsive class. Koreksi: seluruh 16 HTML memasang handler klik JavaScript untuk navigasi menu dan logo, dengan `window.location.href` menuju file HTML prototype. Ketiadaan elemen semantik bukan bukti bahwa handler tidak ada. Pemeriksaan sumber hanya menemukan handler navigasi; tidak ditemukan handler untuk submit, filter, tabs, dropdown, modal, atau aksi CRUD yang digambar.

PRD aktif hanya menetapkan role domain `owner` dan `editor`. Istilah visual `Superadmin`, `Project Manager`, `Client`, keterangan engine Laravel/Filament/Payload, serta data metrik/booking/invoice pada mockup bukan kontrak stack/role dan tidak boleh disalin. PII, harga, finance, URL, account, 2FA status dan contoh audit pada layar merupakan data contoh sampai diverifikasi pemilik.

## Navigasi yang terpasang pada prototype

Setiap HTML admin memasang handler untuk item menu yang cocok dengan `data-pencil-name="a"`; label dipetakan ke nama file prototype di bawah. Klik logo mengarah ke `dashboard-cms-admin.html`. Ini membuktikan wiring navigasi pada ekspor, bukan kesesuaian route aplikasi, otorisasi, atau operasi layar. Reviewer melaporkan reproduksi simulasi DOM `Site Settings` → `site-settings.html`; tidak ada browser run dalam audit ini.

| Label pada prototype | Tujuan handler (file statis) | Catatan scope / route produk |
|---|---|---|
| Dashboard | `dashboard-cms-admin.html` | Rilis 1; path admin final belum dibekukan. |
| Site Settings | `site-settings.html` | Rilis 1; field allowlist perlu keputusan F0-06. |
| Layanan Bento | `layanan-bento.html` | Rilis 1; path final belum dibekukan. |
| Proyek Showcase | `proyek-showcase.html` | Rilis 1; path final belum dibekukan. |
| Kategori; Teknologi | `kategori-teknologi.html` | Rilis 1; dua label menuju satu file. |
| Testimoni & FAQ; Testimoni | `testimoni-faq.html` | Rilis 1; dua label menuju satu file. |
| Paket Layanan & Add-on; Paket Layanan | `paket-layanan-addon.html` | Rilis 1; dua label menuju satu file. |
| Kalkulator Builder; Quote Kalkulator | `quote-kalkulator.html` | Rilis 1; dua label menuju satu file, builder tidak memiliki layar khusus. |
| Proyek Klien & Tracking; Proyek Klien | `proyek-klien-tracking.html` | Rilis 2/Fase 6; tidak ditautkan/diaktifkan pada Rilis 1. |
| Booking Konsultasi | `booking-konsultasi.html` | Rilis 1; path final belum dibekukan. |
| Inquiry & Pemesanan; Inquiry | `inquiry-pemesanan.html` | Rilis 1; dua label menuju satu file. |
| Template Tahap | `template-tahap.html` | Rilis 2/Fase 6; tidak ditautkan/diaktifkan pada Rilis 1. |
| Log Aktivitas & 2FA; Log Aktivitas | `log-aktivitas-2fa.html` | Rilis 1; dua label menuju satu file. |
| Invoice & Penagihan; Invoice | `invoice-penagihan.html` | Scope dipisah pada crosswalk; tidak membuka fitur Rilis 1. |
| Manajemen Staf; Staf & Role | `manajemen-staf.html` | Rilis 1; dua label menuju satu file. |
| Logo | `dashboard-cms-admin.html` | Kembali ke dashboard prototype; bukan keputusan landing route admin. |

Pemetaan handler ditemukan pada seluruh 16 file: `login-admin.html`, `dashboard-cms-admin.html`, `site-settings.html`, `proyek-showcase.html`, `layanan-bento.html`, `kategori-teknologi.html`, `paket-layanan-addon.html`, `testimoni-faq.html`, `inquiry-pemesanan.html`, `quote-kalkulator.html`, `booking-konsultasi.html`, `manajemen-staf.html`, `log-aktivitas-2fa.html`, `proyek-klien-tracking.html`, `template-tahap.html`, dan `invoice-penagihan.html`.

## Peta role dan kebijakan

| Role/aktor | Aturan PRD yang harus ditegakkan server-side |
|---|---|
| Anonim | Tidak dapat membaca `/admin` atau menjalankan admin action; diarahkan/ditolak ke login sesuai flow. |
| `password_only` (sesi akun belum enroll TOTP) | Sesi dapat ada, tetapi hanya boleh melanjutkan enrollment terbatas; tidak mendapat akses admin/data/action sampai TOTP aktif dan terverifikasi. |
| `pending_2fa` (challenge, unauthenticated) | Bukan sesi admin dan tidak mempunyai akses admin, data, action, Server Action atau API. Better Auth v1.7.14 menghapus sesi awal untuk challenge akun yang sudah mengaktifkan TOTP; lihat `laporan/F0-04.md`. |
| `editor` dengan 2FA selesai | Hanya konten website sesuai field allowlist. Tidak dapat membaca/mengubah operasional klien, grup Sistem, atau field Settings WhatsApp/Tracking. Hard delete ditolak. |
| `owner` dengan 2FA selesai | Seluruh modul Rilis 1, manajemen akun dan operasi administratif; audit tetap append-only. |
| Semua role pada `/tracking*` | 404 untuk seluruh request selama Rilis 1. |

Menyembunyikan menu tidak cukup. Setiap route/action/service memeriksa sesi, penyelesaian TOTP, role, resource, operasi, field dan ID resource; direct URL, request buatan, IDOR, field ekstra dan operasi lintas-role harus diuji.

## Inventaris layar

| Berkas | Scope / akses yang diusulkan dari PRD | Elemen, aksi yang digambar dan acceptance criteria |
|---|---|---|
| `login-admin.html` | Rilis 1, pintu auth admin; belum ada route UI login final yang dibekukan | Email, kata sandi, TOTP, remember/passkey terlihat sebagai visual. Implementasi harus memakai Better Auth email/password + TOTP, signup tertutup, tanpa email keluar. Sesi `password_only` hanya untuk enrollment terbatas; `pending_2fa` adalah challenge unauthenticated. Akses admin hanya setelah sesi dengan TOTP terverifikasi. Jangan mengaktifkan trust-device tanpa keputusan dan bukti jalur langsung tertutup; lockout diuji melalui request langsung. |
| `dashboard-cms-admin.html` | Rilis 1; bagian operasional hanya `owner` | KPI, proyek, booking, inquiry/quote, tindakan cepat, telemetri dan tautan. Angka/tautan harus berasal dari query berizin, bukan mock. Data operasional disembunyikan dan ditolak untuk `editor`; sediakan dashboard editor yang aman atau arahkan ke konten tanpa membocorkan agregat. Loading/empty/error serta pagination/filter diuji. |
| `site-settings.html` | Rilis 1; `owner` semua. `editor` hanya field konten yang diizinkan | Tabs umum/brand, hero, SEO, kontak, WhatsApp, kalkulator, booking, tracking, legal, preview dan simpan. `editor` tidak boleh membaca/menulis WhatsApp atau Tracking; field operational/system lain perlu allowlist eksplisit. Mutasi audit dan invalidasi setelah commit; nilai `[ISI]`/klaim belum disetujui tidak dapat publish. |
| `proyek-showcase.html` | Rilis 1, konten; `editor`/`owner` sesuai policy | Daftar, filter, reorder, metadata/slug, kategori/teknologi, media, blok, tautan, draft/publish, preview, duplicate/trash. URL dan blok tervalidasi, media finalisasi/alt wajib; duplicate regenerasi slug; destructive action konfirmasi; version/audit dalam transaksi; hanya konten published tampil publik. |
| `layanan-bento.html` | Rilis 1, konten; `editor`/`owner` | CRUD dan urut layanan/bento. Validasi konten dan urutan, audit/invalidation, empty/loading/error, tidak menerbitkan klaim/harga tanpa data pemilik. Rute detail layanan masih perlu keputusan F0-02. |
| `kategori-teknologi.html` | Rilis 1, konten; `editor`/`owner` | Kategori, teknologi/stack, filter dan relasi proyek. Relasi FK, slug/unik dan reorder tervalidasi; hapus kategori terpakai ditolak oleh constraint/service; aksi dan field diuji langsung. |
| `paket-layanan-addon.html` | Rilis 1, konten; `editor`/`owner` | Paket, add-on, tier/filter, harga, diskon, fitur, toggle aktif/populer dan urutan. Nilai uang integer Rupiah dari keputusan pemilik; diskon dihitung server; perubahan memvalidasi aturan dan invalidasi cache pasca-commit; konfirmasi hapus. |
| `testimoni-faq.html` | Rilis 1, konten; `editor`/`owner` | Queue/approve review, list testimoni dan FAQ editor/filter/urutan. Testimoni hanya dari klien nyata dengan persetujuan; jangan publish contoh/nama/foto mock. FAQ harus spesifik, teks dan URL divalidasi, audit/version dan state error/empty tersedia. |
| `inquiry-pemesanan.html` | Rilis 1, operasional klien; `owner` saja | Pipeline prospek, status, catatan, pencarian, kontak/WhatsApp dan tindak lanjut. Editor ditolak pada halaman, query, DTO dan action. PII diminimalkan, tidak masuk log; tautan WhatsApp dibangun dari template/nomor tepercaya. |
| `quote-kalkulator.html` | Rilis 1, operasional; `owner` saja | List/filter/detail quote serta aksi WhatsApp. Hanya hasil kalkulasi server dari konfigurasi DB otoritatif; harga dari browser tidak dipercaya. DTO minimal, akses editor ditolak, empty/error/pagination diuji. |
| `booking-konsultasi.html` | Rilis 1, operasional/jadwal; `owner` saja | Reservasi, filter status, konfirmasi `meetingUrl`, WhatsApp, aturan mingguan dan tanggal blokir. Mutasi server memakai slot terbaru, transaksi/constraint race, validasi origin dan audit; editor ditolak; konfirmasi punya state gagal/retry yang tidak menggandakan aksi. |
| `manajemen-staf.html` | Rilis 1, Sistem; `owner` saja | Akun staf, role, status 2FA, create/disable/reset. Owner-only dan verifikasi ulang tindakan sensitif; role disimpan pada profil domain tepercaya, bukan input browser; tidak ada email/undangan email; audit dan pencabutan sesi diuji. |
| `log-aktivitas-2fa.html` | Rilis 1, Sistem; `owner` baca saja | Log auth/perubahan dan informasi 2FA. Editor ditolak; insert-only, tidak ada API update/delete; response tanpa password/TOTP/recovery code/cookie/IP mentah; pagination dan empty/error diuji. |
| `proyek-klien-tracking.html` | Rilis 2/Fase 6, tidak diaktifkan | Kode/PIN tracking, milestone, revisi, pembayaran, dokumen, tautan staging/production. `/tracking*` dan fitur terkait tidak hadir di route/nav Rilis 1. Bila Fase 6 diminta, tidak simpan/tampilkan PIN mentah selain alur sekali tampil, batasi DTO per proyek, hash/rate-limit dan verifikasi izin. |
| `template-tahap.html` | Rilis 2/Fase 6 | Template milestone/tahap dan clone proyek. Tidak ditautkan atau ditambahkan schema/route Rilis 1; saat diaktifkan, clone transaksional dan audit. |
| `invoice-penagihan.html` | Prototype Rilis 2/Fase 6, belum disetujui | Memuat penerbitan invoice, PDF, pembayaran/termin, QRIS/transfer, BAST dan dokumen. Pencatatan pembayaran/dokumen dapat dipertimbangkan sebagai kandidat Rilis 2 setelah keputusan scope; payment gateway online dan invoice PDF otomatis eksplisit di luar cakupan PRD §1.4. Tidak membuat route/menu/schema/action sebelum keputusan; keberadaan layar bukan persetujuan fitur. |

## Crosswalk implementasi per layar (usulan)

Nama action/service, schema, DTO, dan ID test di bawah merupakan **usulan pemetaan**, bukan API atau test yang sudah ada. Bekukan nama, route, state, dan ID bersama pada F0-06. Navigasi menu di atas sudah memiliki handler prototype, tetapi belum menggantikan route semantik atau pemeriksaan izin server. Aksi selain navigasi di bawah adalah kebutuhan implementasi yang diturunkan dari kontrol visual dan PRD, bukan handler yang telah ditemukan pada HTML.

| ID / layar | Kontrol → aksi | Service/action → schema/DTO (usulan) | Izin | State | Acceptance / test ID (usulan) |
|---|---|---|---|---|---|
| ADM-01 `login-admin.html` | Form email/password, enrollment/verification TOTP, remember/passkey yang digambar | Better Auth sign-in/verify → `SignInSchema`, `TOTPVerifySchema`, status enrollment/session/challenge | Publik hanya untuk auth; `password_only` hanya enrollment terbatas; `pending_2fa` unauthenticated; admin hanya sesi penuh TOTP | idle, validating, enrollment-required, password-only restricted, pending 2FA, error, authenticated | signup tertutup; tidak kirim email; kedua keadaan belum TOTP tidak membuka admin; trust-device ditolak; `N09-ADM-01` |
| ADM-02 `dashboard-cms-admin.html` | Menu, filter, pagination, quick actions dan KPI | `getAdminDashboard` → `DashboardQuerySchema`, `OwnerDashboardDTO` dan DTO konten editor | Owner untuk data operasional; editor hanya dashboard konten tanpa agregat sensitif | loading, empty, error, success, pagination | Editor tidak menerima data inquiry/booking/quote; `N09-ADM-02` |
| ADM-03 `site-settings.html` | Tabs, edit field, preview, save | `updateSiteSettings` → `SettingsUpdateSchema`, `SettingsDTO` allowlist | Owner semua; editor hanya field konten yang diizinkan, tidak WhatsApp/Tracking/System | loading, dirty, validation, saving, error, success | Field ekstra/terlarang ditolak, audit dalam transaksi; `N09-ADM-03` |
| ADM-04 `proyek-showcase.html` | Search/filter/reorder, edit blocks/media, draft/publish/preview/duplicate/trash | `ProjectContentService` → `ProjectWriteSchema`, `ProjectAdminDTO`, versi/preview DTO | Editor/owner sesuai policy; hard delete owner-only | loading, empty, error, draft, validation, confirm, success | URL/media/alt/blocks valid; publish menolak `[ISI]`; audit/version; `N09-ADM-04` |
| ADM-05 `layanan-bento.html` | CRUD, reorder dan toggle layanan | `ServiceContentService` → `ServiceWriteSchema`, `ServiceAdminDTO` | Editor/owner; operasi/field sesuai allowlist | loading, empty, error, validation, success | Hanya klaim/harga approved; audit/cache sesudah commit; `N09-ADM-05` |
| ADM-06 `kategori-teknologi.html` | CRUD kategori/teknologi, filter, reorder, relasi proyek | `TaxonomyService` → `CategoryWriteSchema`, `TechnologyWriteSchema`, DTO relasi | Editor/owner; hapus mengikuti constraint dan policy | loading, empty, error, confirm, conflict, success | Slug/unique/FK valid; hapus kategori terpakai ditolak; `N09-ADM-06` |
| ADM-07 `paket-layanan-addon.html` | CRUD paket/add-on, harga/diskon, aktif/populer, urut | `PackageService` → `PackageWriteSchema`, `PackageAdminDTO` | Editor/owner sesuai field; harga hanya keputusan pemilik | loading, empty, error, validation, confirm, success | Uang integer Rupiah; diskon dihitung server; audit/cache pasca-commit; `N09-ADM-07` |
| ADM-08 `testimoni-faq.html` | Review/approve testimonial, CRUD FAQ, filter/reorder | `TestimonialService` + `FAQService` → `TestimonialWriteSchema`, `FAQWriteSchema`, DTO publik/admin terpisah | Editor/owner; publish testimonial hanya dengan persetujuan nyata | loading, empty, error, validation, confirm, success | Contoh mock tak terbit; FAQ relevan; URL aman; `N09-ADM-08` |
| ADM-09 `inquiry-pemesanan.html` | Search/filter, status, catatan, tindak lanjut WhatsApp | `InquiryService` → `InquiryUpdateSchema`, `OwnerInquiryDTO` | Owner saja; editor ditolak pada route, query, DTO dan action | loading, empty, error, validation, confirm, success | PII diminimalkan dan tidak masuk log; `N09-ADM-09` |
| ADM-10 `quote-kalkulator.html` | Search/filter/detail quote, tindak lanjut WhatsApp | `QuoteService` → action schema perubahan status, `OwnerQuoteDTO` | Owner saja; quote editor ditolak | loading, empty, error, success | Harga/hasil dari kalkulasi server; DTO minimal; `N09-ADM-10` |
| ADM-11 `booking-konsultasi.html` | Filter, konfirmasi, set meeting URL, atur slot/tanggal blokir | `BookingService` → `BookingActionSchema`, `AvailabilityWriteSchema`, `OwnerBookingDTO` | Owner saja | loading, empty, error, validation, conflict, retry, success | Slot terbaru, anti-race, idempotensi, audit; `N09-ADM-11` |
| ADM-12 `manajemen-staf.html` | Buat/nonaktifkan/reset akun, ubah role/status 2FA | `StaffAdminService` → `StaffCreateSchema`, `RoleChangeSchema`, `StaffDTO` | Owner saja; verifikasi ulang aksi sensitif | loading, empty, error, confirm, success | Role dari server; tanpa email; sesi dicabut dan audit aman; `N09-ADM-12` |
| ADM-13 `log-aktivitas-2fa.html` | Filter/pagination, baca log | `listAuditLogs` → `AuditQuerySchema`, `AuditLogDTO` allowlist | Owner baca saja; insert-only | loading, empty, error, success | Tidak ada update/delete; tidak ada secret/IP mentah; `N09-ADM-13` |
| ADM-14 `proyek-klien-tracking.html` | Kode/PIN, milestone, revisi, pembayaran, dokumen | Tidak ada route/service/schema Rilis 1; bila Fase 6 diminta, usulan service/DTO baru | 404 untuk semua aktor pada Rilis 1 | 404 pada Rilis 1 | Tidak ditautkan/diaktifkan sebelum Fase 6; `N09-ADM-14` |
| ADM-15 `template-tahap.html` | Kelola template tahap, clone ke proyek | Tidak ada route/service/schema Rilis 1; usulan Fase 6 | Tidak tersedia pada Rilis 1 | 404/tidak tersedia | Tidak ada schema atau mutasi Fase 1 tanpa keputusan; clone kelak transaksional; `N09-ADM-15` |
| ADM-16 `invoice-penagihan.html` | Terbitkan invoice/PDF, catat termin/pembayaran, BAST/dokumen yang digambar | Tidak ada route/service/schema Rilis 1. Pencatatan pembayaran/dokumen hanya kandidat Rilis 2 setelah persetujuan; invoice PDF otomatis dan payment gateway tidak masuk scope | Tidak tersedia pada Rilis 1; calon operasi Rilis 2 perlu izin/domain khusus | Tidak tersedia; pada scope masa depan perlu empty/error/confirm/success | Pisahkan pencatatan dari pembuatan invoice/PDF; tidak membuat artefak finansial dari mock; `N09-ADM-16` |

## Cakupan PRD tanpa layar khusus

- **Halaman/page builder:** menu terlihat di navigasi, tetapi tidak ada file layar editor halaman. PRD meminta editor blok terbatas untuk konten yang benar-benar dipakai. Butuh spesifikasi UI/acceptance dari pemilik sebelum membuat UI baru.
- **Kalkulator builder:** menu disebut di beberapa mockup, tetapi tidak ada layar builder khusus. PRD memerlukan grup/item/rules `requires`/`excludes`, validasi siklus/kontradiksi, harga/durasi, urutan dan invalidasi cache. Buat rancangan pelengkap yang disetujui sebelum implementasi.
- **Media library:** alur media tersisip di proyek; tidak ada layar library lengkap. PRD memerlukan upload signed, finalisasi Sharp, alt, progress, error/retry dan izin. Minta keputusan rancangan untuk layar/status yang belum tergambar.
- **Admin routes:** prototype memperlihatkan satu `/admin` dengan grup navigasi, tetapi path tiap menu tidak dibekukan PRD. Jangan menetapkan path permanen tanpa kontrak koordinator.
- **Rilis 2:** tracking proyek dan template tahap dikeluarkan dari navigasi/action Rilis 1. Pencatatan pembayaran/dokumen pada layar invoice hanya kandidat Rilis 2 yang perlu keputusan; payment gateway online dan invoice PDF otomatis dikecualikan PRD §1.4. Tidak satu pun fitur tersebut menjadi data editor.

## Tes penerimaan lintas layar

1. Pada fase implementasi, buka setiap route sebagai anonim, `password_only` (sesi akun belum enroll), `pending_2fa` (challenge unauthenticated), editor dan owner; ulangi direct URL, Server Action/Route Handler, field tambahan, ID resource salah dan sesi dicabut.
2. Pastikan editor tidak dapat membaca/mengubah operasional, System, WhatsApp, Tracking maupun field terlindungi, termasuk melalui response DTO.
3. Uji empty/loading/error/sukses, validasi dan konfirmasi destructive; seluruh kontrol keyboard-operable dengan fokus terlihat.
4. Uji 360/768/1024/1440+ px, overflow, kontras WCAG AA dan ukuran target sentuh. Tampilkan data nyata yang disetujui, bukan angka fixture.
5. Uji tidak ada email, akses tracking, mutasi audit, klaim, placeholder `[ISI]` atau secret dalam response/log.

## Handoff

Sebelum implementasi Fase 2/4: bekukan menu/path, field allowlist Settings, kebijakan dashboard editor, dan rancangan layar Halaman/Kalkulator/Media. Penerimaan N-09 Fase 0 mencakup inventaris layar, interaksi/handler, crosswalk komponen/service/schema/DTO/izin/state dan acceptance criteria sesuai PRD §12.3; tidak menunggu implementasi UI. Pengujian akses langsung, state, mobile, keyboard dan data nyata adalah acceptance fase implementasi. Koordinator menerima task audit F0-03 dan memperbarui status pada rencana; keputusan izin/path/kontrak tetap diteruskan ke F0-06.
