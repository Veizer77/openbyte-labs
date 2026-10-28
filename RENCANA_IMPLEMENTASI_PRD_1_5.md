# Rencana aktif: PRD 1.5

Tanggal: 28 Oktober 2026. Acuan tunggal: `PRD_v1_5.md` dan `AGENTS.md`.

## Mulai dari sini: penugasan beberapa agent

**Prioritas sekarang: menutup gerbang Fase 0, bukan membangun semua halaman atau melompat ke Fase 1.** Dokumen ini membagi Fase 0 menjadi 25 task (`F0-00` sampai `F0-24`). Checklist adalah pekerjaan yang belum selesai, bukan bukti implementasi.

Pembagian peran di bawah adalah usulan awal, bukan daftar proses agent yang sedang berjalan. Artefak F0-01 sampai F0-10, F0-13 dan F0-14 sudah diserahkan oleh penulis; status penerimaan resminya mengikuti tabel, [keputusan koordinator](docs/fase-0/review-koordinator.md), dan [review tiga usulan](docs/fase-0/review-usulan-3-agent.md), bukan status usulan pada laporan penulis. Satu orang/agent boleh memegang beberapa peran secara bergantian, tetapi satu task hanya memiliki satu penanggung jawab pada satu waktu.

### Penugasan pertama yang disarankan

| Peran | Task pertama | Boleh mulai sekarang | Hasil yang diserahkan |
|---|---|---|---|
| Koordinator/integrator | F0-00 | Ya, meninjau baseline; commit/worktree menunggu persetujuan | Baseline, daftar pemilik task/file, urutan integrasi. |
| Agent A: tooling | F0-01 | Audit saja | Kompatibilitas versi, dependency, opsi penanganan advisory. |
| Agent B: prototype publik | F0-02 | Ya, baca prototype tanpa mengubahnya | Inventaris layar/interaksi publik dan acceptance criteria. |
| Agent C: prototype admin | F0-03 | Ya, baca prototype tanpa mengubahnya | Inventaris layar/interaksi admin, role dan field terbatas. |
| Agent D: auth | F0-04 | Audit API saja | Bukti kemampuan Better Auth terkunci dan kontrak auth yang diusulkan. |
| Agent E: infrastruktur (opsional) | F0-05 | Audit konfigurasi nonrahasia saja | Daftar resource/izin yang diperlukan, rancangan isolasi tes. |

Jika hanya tersedia 4 agent, koordinator merangkap tooling dan pemeriksaan infrastruktur. Tidak perlu menambah agent hanya untuk memenuhi tabel. Audit awal dapat membaca working tree sekarang; setiap laporan wajib menyebut baseline yang belum di-commit dan tidak boleh mengklaim reproduksibilitas berbasis SHA.

### Aturan kerja paralel dan baseline

1. **Hasil reset masih belum di-commit pada saat rencana ini dibagi.** Worktree yang dibuat dari HEAD lama tidak membawa perubahan reset yang belum di-commit, termasuk PRD/rencana yang masih untracked. F0-00 harus menyiapkan baseline reset bersama terlebih dahulu. Minta izin sebelum commit; jangan menjalankan `git add .` tanpa meninjau file, jangan menyertakan `.env`, memori tool pribadi, atau rahasia. Dokumen ini tidak memberi izin commit/push/deploy.
2. Untuk penulisan kode, gunakan branch/worktree terpisah dari baseline yang sama dan sudah disetujui. Catat SHA baseline, nama branch, task, penanggung jawab, dan port server tes yang tidak bertabrakan. Jangan menghapus worktree atau perubahan agent lain.
3. Jika semua agent terpaksa berada di satu working tree, hanya audit baca-saja yang boleh serentak. Penulisan kode, install dependency, build, migrasi, dan E2E diserialkan oleh koordinator. Pembagian folder saja tidak mengisolasi `.next`, `node_modules`, environment proses, atau database.
4. Satu task, satu pemilik penulisan. Daftar path pada task adalah batas yang direncanakan, **bukan klaim file sudah ada atau kewajiban menciptakan semua file**. Subpath persis ditetapkan pada F0-06. File di luar batas tidak diubah tanpa pengalihan kepemilikan oleh koordinator.
5. **File bersama hanya ditulis koordinator**, berdasarkan usulan patch agent: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `src/lib/env.ts`, `.env.example`, `next.config.ts`, `tsconfig.json`, konfigurasi lint/Vitest/Playwright, `instrumentation.ts`, barrel ekspor bersama, `README.md`, `AGENTS.md`, dan rencana ini. Jangan menjalankan resolusi dependency paralel pada checkout yang sama. Upgrade versi terkunci tetap memerlukan persetujuan pemilik.
6. **Schema dan migrasi memiliki satu penulis DB**: `src/db/**`, `drizzle.config.*`, folder migrasi yang dipilih, dan script migrasi. Agent auth/media/konten menyerahkan kebutuhan schema ke penulis DB, tidak membuat migrasi bersaing. Setiap penambahan schema harus diintegrasikan dan diuji sebelum task pemakainya berjalan.
7. Setiap task menulis laporan sendiri di `docs/fase-0/laporan/F0-XX.md`; hanya koordinator memperbarui status pada rencana utama. Folder laporan/kontrak di dokumen ini adalah lokasi keluaran yang akan dibuat saat task dikerjakan, bukan dokumen yang sudah tersedia.
8. Prototype/aset, PRD, `.env`/`.env.local`, data Neon/R2, dan histori Git bukan wilayah tulis agent. Gunakan data sintetis serta DB/bucket/prefix tes terisolasi yang disetujui. Jangan membuat resource berbiaya atau menghapus data tanpa izin. Dilarang `drizzle-kit push` produksi.
9. Agent boleh mengusulkan kontrak sebelum task prasyarat selesai, tetapi tidak boleh mengintegrasikan implementasi berdasarkan kontrak yang belum disepakati. Jangan membuat mock yang kemudian diklaim sebagai bukti Neon/R2/auth nyata.
10. Perubahan ke route auth/admin/preview hanya dibuka setelah guard sesi, TOTP, dan policy terkait siap. Perubahan sengaja terhadap batas 503 pada fondasi harus disertai tes pengganti yang lebih kuat, bukan menghapus tes gagal. `/tracking*` tetap 404 dan tidak ditautkan pada Rilis 1.

### Status dan kriteria selesai bersama

- `BELUM`: belum dikerjakan. `AUDIT`: boleh ditelaah baca-saja, implementasi belum diizinkan. `BERJALAN`: sudah diklaim penanggung jawab. `TERBLOKIR`: prasyarat/keputusan/bukti penerimaan belum tersedia, walaupun draft kode dapat sudah ada. `REVIEW`: artefak sudah diserahkan tetapi belum diterima, dan bukan izin bagi konsumen untuk menganggap prasyarat selesai. `SELESAI`: hasil sudah direview dan diterima dalam cakupan task; task kode memerlukan integrasi dan tes baseline gabungan, sedangkan task audit/dokumentasi memerlukan validasi artefak dan penerimaan review, bukan pengujian fitur yang belum dibangun.
- Status terkini setiap task tercantum pada tabel di bawah; checklist bertanda bukan dengan sendirinya bukti implementasi atau integrasi. Kolom **Mulai setelah** adalah dependensi; angka mengacu pada ID `F0-XX`. `Audit sekarang` tidak mengizinkan perubahan aplikasi atau resource.
- Koordinator menerima F0-01 sampai F0-05 sebagai **task audit/dokumentasi selesai**, berdasarkan review dan revisi yang telah diperiksa. Ini bukan klaim review teknis oleh pemilik, kelulusan gerbang N-01 sampai N-10, bukti layanan cloud, atau pengesahan implementasi F0-06 sampai F0-10. Audit F0-01 adalah bukti historis pada paket yang dilaporkan; dependency S3 yang kini ada pada manifest harus diaudit ulang dalam F0-07.
- F0-06 sampai F0-10 tetap `TERBLOKIR`: kontrak konsolidasi `1.0.2-draft` belum dibekukan, baseline F0-00 belum siap, dan bukti penerimaan task kode belum lengkap. Tiga usulan sudah direview, bukan otomatis diterima utuh. F0-13/F0-14 berstatus `REVIEW`; bukti R2 yang dilaporkan memakai bucket produksi tidak memenuhi isolasi tes dan tidak membuka konsumen. Tidak ada kode, migrasi, atau hasil tes penulis yang dihapus. Detail pada [review koordinator](docs/fase-0/review-koordinator.md) dan [review tiga usulan](docs/fase-0/review-usulan-3-agent.md).
- Agent harus mencatat tes sebelum/perubahan sesudah bila relevan, hasil nyata beserta versi runtime, pemeriksaan yang dilewati/gagal, dan batas cakupan. Tidak ada status selesai hanya dari membaca kode atau install paket.
- Untuk perubahan kode: lint, typecheck, unit/integrasi terkait, portabilitas, dan pemeriksaan akses yang relevan. Perubahan route/runtime juga memerlukan build dan E2E. Untuk perubahan dokumentasi saja: review silang PRD, path, ID/dependensi, dan diff; tidak mengklaim pengujian aplikasi baru.
- Task yang memerlukan cloud/biaya/target DB tetapi belum mendapat izin tetap `TERBLOKIR`; tidak diganti skrip yang selalu sukses. Koordinator tidak boleh meluluskan N-01 sampai N-10 dari bukti parsial.

### Daftar task Fase 0

| ID | Task | Pemilik peran | Mulai setelah | Gerbang PRD | Status |
|---|---|---|---|---|---|
| F0-00 | Baseline reset dan pembagian wilayah tulis | Koordinator | Izin checkpoint lokal diterima; hanya handoff dari baseline sama | Semua | SELESAI |
| F0-01 | Audit runtime, dependency dan keamanan | Tooling | Audit sekarang | N-01 | SELESAI |
| F0-02 | Inventaris prototype publik | Prototype publik | Sekarang | N-09 | SELESAI |
| F0-03 | Inventaris prototype admin | Prototype admin | Sekarang | N-09 | SELESAI |
| F0-04 | Verifikasi API Better Auth tanpa email | Auth | Audit sekarang | N-01, N-02 | SELESAI |
| F0-05 | Rencana resource dan isolasi pengujian | Infrastruktur | Audit sekarang | N-03, N-04, N-08, N-10 | SELESAI |
| F0-06 | Sepakati kontrak auth/DB/policy/media/konten | Koordinator | 01, 02, 03, 04, 05 | N-01, N-02, N-03, N-05, N-06, N-09 | TERBLOKIR |
| F0-07 | Tooling terverifikasi dan dependency yang disetujui | Tooling + koordinator | 00, 06 | N-01 | TERBLOKIR |
| F0-08 | Schema fondasi dan migrator Drizzle aman | DB | 07; target tes disetujui | N-03 | TERBLOKIR |
| F0-09 | Policy default-deny dan matriks field/DTO | Akses | 07 | N-06 | TERBLOKIR |
| F0-10 | Auth, sesi, TOTP wajib dan lockout | Auth | 08, 09 | N-02, N-06 | TERBLOKIR |
| F0-11 | Bootstrap dan recovery owner lewat CLI | Auth | 10 | N-02 | BELUM |
| F0-12 | Tes request langsung auth dan otorisasi | QA keamanan | 10, 11 | N-02, N-06 | BELUM |
| F0-13 | Pipeline validasi gambar dan Sharp | Media | 07 | N-04 | REVIEW |
| F0-14 | Signed upload dan finalisasi R2 berizin | Media | 08, 09, 10, 13; schema media & target tes siap | N-04, N-06 | REVIEW |
| F0-15 | Blok, versi, publish dan audit transaksional | Konten | 08, 09, 10, 14; schema konten siap | N-05, N-06 | BELUM |
| F0-16 | Preview/Draft Mode yang terikat sesi | Konten | 15 | N-05, N-06 | BELUM |
| F0-17 | Cache dan invalidasi setelah commit | Cache | 15, 16 | N-07 | BELUM |
| F0-18 | Bukti constraint/race PostgreSQL Lampiran F.7 | DB | 08; schema irisan booking & target tes siap | N-03 | BELUM |
| F0-19 | Monitoring Sentry dan redaksi data sensitif | Observabilitas | 07, 10; target monitoring disetujui | N-10 | BELUM |
| F0-20 | Docker standalone dan pemeriksaan artefak | Infrastruktur | 07 | N-08, N-10 | BELUM |
| F0-21 | Pengukuran performa runtime dan media | Infrastruktur | 14, 16, 17, 20 | N-08 | BELUM |
| F0-22 | Backup terenkripsi dan restore-verify | Infrastruktur + DB | 08, 18, 20; resource/izin siap | N-03, N-10 | BELUM |
| F0-23 | CI gabungan dan pengujian integrasi akhir | QA + koordinator | 12, 14, 16, 17, 18, 19, 20, 21, 22 | N-01, N-06, N-10 | BELUM |
| F0-24 | Review gerbang dan handoff Fase 1 | Koordinator + reviewer | Semua 00 sampai 23 selesai | N-01 sampai N-10 | BELUM |

### Gelombang kerja paralel

Gelombang adalah contoh jadwal, bukan pengganti dependensi setiap task. Agent yang selesai lebih awal boleh mengerjakan task berikutnya hanya jika semua prasyaratnya terpenuhi.

1. **Gelombang A, audit serentak:** F0-01, 02, 03, 04, 05. Koordinator menangani F0-00. Tidak ada implementasi aplikasi/cloud.
2. **Gelombang B, titik sinkronisasi:** F0-06 lalu F0-07. Usulan dependency/env/API digabung sekali oleh koordinator. Jangan memulai schema/auth berdasarkan asumsi berbeda.
3. **Gelombang C, fondasi terpisah:** F0-08 (DB), F0-09 (policy murni), F0-13 (pipeline gambar), dan F0-20 (Docker) boleh paralel dalam worktree berbeda.
4. **Gelombang D, integrasi keamanan:** F0-10 lalu 11/12; F0-18 dapat berjalan terpisah pada DB tes sendiri. F0-14 mulai sesudah auth/policy/pipeline/schema media siap. F0-19 dapat paralel setelah F0-10.
5. **Gelombang E, irisan konten:** F0-15 lalu 16 lalu 17. F0-22 dapat paralel jika schema gabungan sudah dibekukan untuk pengujian restore; ulangi restore jika schema berubah. F0-21 menunggu irisan runtime/media lengkap.
6. **Gelombang F, verifikasi gabungan:** F0-23 lalu F0-24. Dilarang menutup gerbang dari hasil branch yang belum digabung atau dari tes terhadap schema yang berbeda.

## Rincian tugas per task Fase 0

### F0-00: Baseline dan koordinasi

**Wilayah tulis:** rencana ini, daftar penugasan dan file bersama. **Keluaran:** baseline yang disepakati dan `docs/fase-0/laporan/F0-00.md`.
- [x] Tinjau perubahan reset dan file untracked; pisahkan pekerjaan pemilik/tool dari calon baseline. Inventaris dan klasifikasi sementara ada di [laporan F0-00](docs/fase-0/laporan/F0-00.md); asal setiap berkas belum dapat dibuktikan hanya dari status Git.
- [x] Minta persetujuan checkpoint commit sebelum menyiapkan worktree kode; pemilik menyetujui checkpoint **lokal** dan snapshot WIP proyek, dengan memori tool/rahasia dikecualikan. Tidak ada izin push.
- [x] Catat HEAD/branch sekarang, penanggung jawab per peran, pemilik file bersama, serta alokasi port/resource tes yang **diusulkan**, bukan penugasan agent aktif atau SHA baseline yang sudah disetujui; lihat laporan F0-00.
- [x] Tetapkan urutan integrasi dan gerbang verifikasi gabungan di laporan F0-00; belum dijalankan karena checkpoint belum disetujui.
**Selesai bila:** setiap agent kode memakai baseline yang sama, wilayah tulis jelas, dan tidak ada perubahan pemilik yang hilang.

Status `SELESAI` di sini hanya untuk koordinasi/checkpoint F0-00, bukan untuk penerimaan draft kode dalam snapshot. SHA checkpoint lokal dicatat pada handoff sesi dan dapat diperoleh dari `git rev-parse HEAD` pada branch ini; semua agent kode berikutnya wajib mencatat SHA yang sama sebelum mulai. Branch/port pada laporan adalah alokasi calon, bukan klaim agent sedang berjalan; target cloud/DB tetap perlu izin terpisah. Tidak ada worktree kode dibuat selama F0-00.

### F0-01: Audit runtime dan dependency

**Wilayah tulis:** laporan task saja; usulan konfigurasi diserahkan ke koordinator.
- [x] Inventaris versi terkunci, engines, peer dependency dan API paket terpasang; pisahkan bukti Node 26 dari target Node 22.
- [x] Telusuri advisory `esbuild` moderate dan deprecation; usulkan perbaikan beserta risiko/tes, jangan langsung upgrade atau menambah override.
- [x] Daftar kebutuhan paket per task termasuk S3, Sentry dan editor; pemasangan hanya jika dibutuhkan prototype/PRD dan disetujui.
- [x] Rancang clean install terisolasi, audit penuh/produksi, dan pengujian target Node tanpa menghapus `node_modules` working tree milik agent lain.
**Selesai bila:** ada matriks kompatibilitas dan rekomendasi berbukti; ini belum menutup N-01 tanpa eksekusi F0-07/23.

### F0-02: Inventaris prototype publik

**Wilayah tulis:** `docs/fase-0/prototype-publik.md` dan laporan task; prototype baca-saja.
- [x] Daftar seluruh file layar publik, route yang direncanakan, rilis, dan bagian PRD terkait; tandai referensi di luar scope.
- [x] Per layar, petakan section, form, navigasi, modal/filter, state kosong/loading/error/sukses, mobile dan keyboard.
- [x] Petakan komponen, DTO/service/schema yang dibutuhkan, konten pemilik yang belum tersedia, dan acceptance criteria/test case.
- [x] Catat konflik prototype/PRD dan state yang belum tergambar tanpa menciptakan desain atau aset baru.
**Selesai bila:** setiap file layar telah dipetakan atau diberi alasan pengecualian; tidak ada klaim pixel-match/UI sudah dibangun.

### F0-03: Inventaris prototype admin

**Wilayah tulis:** `docs/fase-0/prototype-admin.md` dan laporan task; prototype baca-saja.
- [x] Petakan seluruh layar/tab/modal/form/table/action admin, termasuk login/TOTP, pengaturan, media dan tindakan operasional.
- [x] Per aksi/field, tentukan owner/editor, operasi, resource, state gagal, konfirmasi tindakan destruktif, dan audit yang diperlukan menurut PRD.
- [x] Petakan kebutuhan rich text/blok/versi/draft/preview, komponen/service/schema, serta acceptance criteria dan request langsung yang harus ditolak.
- [x] Pisahkan Rilis 2 dan referensi blog/invoice dari scope Rilis 1; catat keputusan pemilik yang diperlukan.
**Selesai bila:** inventaris melengkapi F0-02 dan dapat dipakai menyusun matriks izin, bukan hanya daftar nama layar.

### F0-04: Kelayakan Better Auth versi terkunci

**Wilayah tulis:** `docs/fase-0/auth-kelayakan.md` dan laporan task; belum membuka endpoint auth.
- [x] Baca API/dokumentasi versi terpasang untuk adapter Drizzle, model identitas, sesi, TOTP, recovery dan penutupan signup.
- [x] Buktikan rancangan alur tanpa pengiriman email, termasuk identifier login yang didukung; jangan mengarang API paket.
- [x] Usulkan representasi sesi password-only vs TOTP-complete, role domain, pencabutan sesi, lockout 5/15 dan recovery CLI.
- [x] Daftar tabel/kolom/relasi auth yang dibutuhkan penulis DB, risiko enkripsi TOTP, dan tes bypass; laporkan ketidakcocokan untuk keputusan pemilik.
**Selesai bila:** kontrak didukung API versi terkunci atau blocker dijelaskan; kegagalan kemampuan paket tidak disembunyikan lewat bypass keamanan.

### F0-05: Resource dan isolasi tes

**Wilayah tulis:** `docs/fase-0/resource-pengujian.md` dan laporan task; tidak menulis secret atau membuat resource.
- [x] Daftar kebutuhan DB disposable lokal/Neon, versi PostgreSQL, bucket/prefix R2, monitoring, staging, Docker dan batas hosting.
- [x] Tentukan identifikasi target tes yang eksplisit, guard sebelum mutasi, kepemilikan resource, pembersihan terbatas, dan pemisahan antar-agent.
- [x] Daftar variabel/nama secret yang diperlukan tanpa membaca/menyalin nilainya ke laporan; minta pemilik menyediakan konfigurasi melalui kanal aman.
- [x] Pisahkan pemeriksaan lokal dari pembuktian Neon/R2/hosting; minta izin untuk akses cloud, biaya, backup, dan penghapusan objek tes.
**Selesai bila:** izin yang sudah/belum tersedia tercatat dan task cloud tahu kapan harus berhenti.

### F0-06: Bekukan kontrak lintas-agent

**Wilayah tulis:** `docs/fase-0/kontrak.md` dan rencana ini oleh koordinator; masukan dari agent lain melalui laporan.
**Dibuka kembali oleh koordinator:** draft dan kode konsumen sudah ada, tetapi checklist F0-06 sampai F0-10 di bawah adalah kriteria penerimaan yang belum ditutup pada baseline gabungan. Membuka checklist tidak menghapus pekerjaan atau menyangkal run lokal yang pernah dilaporkan penulis.
- [ ] Sepakati nama/tipe ID, tabel/kolom fisik, relasi identitas auth ke users domain, timestamp UTC dan integer Rupiah.
- [ ] Sepakati bentuk actor/session, pembuktian TOTP, signature policy/service, DTO publik/admin, kode error aman dan batas transaksi/audit.
- [ ] Sepakati kontrak media, blok rich text/versi/publish/preview, cache key/tag dan invalidasi setelah commit; pilih editor hanya dari kebutuhan prototype.
- [ ] Tetapkan nama file/subpath dan pemiliknya, route proof-of-concept, pembagian schema fondasi vs seluruh schema Fase 1, serta test case kontrak.
- [ ] Catat persetujuan pemilik untuk upgrade/target resource yang diperlukan; keputusan teknis yang tidak mengubah scope mengikuti PRD.
**Selesai bila:** seluruh konsumen menyetujui kontrak berversi. Perubahan selanjutnya menyebut task terdampak dan membutuhkan sinkronisasi ulang sebelum integrasi.

### F0-07: Eksekusi tooling terverifikasi

**Wilayah tulis:** usulan tooling oleh agent; file bersama diterapkan koordinator.
- [ ] Terapkan hanya dependency/config/env-validator yang sudah disetujui, exact-pinned dan tanpa override yang tidak terbukti perlu.
- [ ] Jalankan clean install dan frozen-lockfile install di checkout/container bersih, typecheck/build serta audit pada target runtime.
- [ ] Tangani advisory F0-01 dengan perubahan teruji; jika belum aman diselesaikan, laporkan blocker/keputusan risiko pemilik dan jangan mengklaim audit bersih.
- [ ] Pastikan build tidak memerlukan DB pemilik, tidak menjalankan DDL, dan tidak membagikan artefak `.env` lokal.
**Selesai bila:** hasil kompatibilitas dapat direproduksi; paket yang baru ditambahkan pada task berikutnya tetap harus diaudit/diuji ulang.

### F0-08: Schema fondasi dan migrasi

**Wilayah tulis eksklusif DB:** `src/db/**`, `drizzle.config.*`, migrasi dan `scripts/db-*`; konfigurasi script/env melalui koordinator.
- [ ] Tulis schema minimum untuk irisan gerbang Fase 0 sesuai F0-06, termasuk relasi auth/users; tidak membangun semua CRUD Fase 1.
- [ ] Buat migrasi SQL berversi, review FK/index/unique/check dan koneksi pooled runtime vs direct migrator.
- [ ] Bangun guard target tes eksplisit; tambahkan `db:generate`, `db:migrate`, `db:check` hanya jika benar-benar berfungsi.
- [ ] Uji dari DB kosong, migrasi ulang tanpa korupsi/duplikasi, konsistensi schema, dan relasi pada target lokal serta Neon tes yang disetujui.
- [ ] Sediakan mekanisme perubahan schema satu penulis untuk F0-10/14/15/18; perubahan tersebut diuji dan diberi bukti baru.
**Selesai bila:** fondasi schema/migrator terbukti; N-03 masih menunggu constraint dan restore pada F0-18/22.

### F0-09: Policy, field dan DTO

**Wilayah tulis:** `src/access/**`, `tests/unit/access/**`; signature mengikuti F0-06.
- [ ] Tulis matriks anonim/password-only/TOTP owner/TOTP editor terhadap resource, operasi dan field Rilis 1 sesuai PRD 5.4.
- [ ] Implementasi default-deny sebagai policy yang dapat diuji; role/actor hanya berasal dari server, bukan input browser.
- [ ] Uji penolakan data operasional/Sistem/Settings WhatsApp/Tracking bagi editor, field privat, operasi tak dikenal, dan akses silang resource/IDOR.
- [ ] Tetapkan DTO allowlist dan kontrak pemanggilan dari setiap service/action/route; inventaris permukaan runtime akan diperluas oleh F0-12/23.
**Selesai bila:** matriks policy lulus tes positif/negatif; ini belum membuktikan seluruh route memakai policy.

### F0-10: Auth, sesi, TOTP dan lockout

**Wilayah tulis:** `src/auth/**`, service auth dan route/login/TOTP yang dialokasikan F0-06, `tests/unit/auth/**`. Schema melalui penulis DB; file routing/layout bersama melalui koordinator.
- [ ] Konfigurasi Better Auth/adapter sesuai versi terpasang, signup tertutup, identitas/role tepercaya dan cookie/origin aman.
- [ ] Implementasi enrollment, verifikasi dan kewajiban TOTP owner/editor, sesi password-only terbatas, logout serta pencabutan sesi sesuai PRD.
- [ ] Terapkan lockout login/TOTP 5/15 dengan pencatatan aman dan uji upaya serentak; lindungi material TOTP/recovery tanpa log.
- [ ] Bangun irisan login/admin minimum untuk pembuktian Fase 0 mengikuti prototype, bukan keseluruhan dashboard Fase 2.
- [ ] Hubungkan pemeriksaan sesi/TOTP/policy pada request/service, termasuk route auth paket yang dapat menjadi bypass; tidak cukup menyembunyikan menu.
**Selesai bila:** alur auth riil lulus unit/integrasi; UI/request E2E independen dan CLI masih menunggu F0-11/12.

### F0-11: Owner create dan recovery CLI

**Wilayah tulis:** `scripts/owner-*`, service recovery yang dialokasikan, `tests/unit/owner/**`; schema/audit melalui DB.
- [ ] Implementasi bootstrap owner dan recovery/reset tanpa email menggunakan API/service tervalidasi, bukan penulisan password mentah.
- [ ] Gunakan input rahasia yang aman, validasi target, konfirmasi tindakan dan pembatasan eksekusi CLI.
- [ ] Uji perubahan credential/TOTP, invalidasi sesi lama dan audit sesuai kontrak; jangan log password atau recovery code.
- [ ] Tambah command `owner:create`/`owner:reset` hanya sesudah berfungsi; tidak dijalankan pada akun pemilik tanpa izin terpisah.
**Selesai bila:** recovery terbukti pada akun sintetis dengan sesi lama tidak dapat terus dipakai.

### F0-12: Verifikasi auth/akses lewat request nyata

**Wilayah tulis:** `tests/int/access/**`, `tests/e2e/auth/**` dan helper keamanan tes yang dialokasikan; tidak mengubah implementasi untuk menyamarkan temuan.
- [ ] Uji login, TOTP, lockout, logout dan recovery melalui browser/request riil pada DB tes.
- [ ] Serang direct URL, request API/Server Action dan IDOR sebagai anonim/password-only/editor/owner; uji jalur auth paket selain UI.
- [ ] Buktikan sesi password-only, sesi kedaluwarsa/dicabut dan input role/ID palsu tidak melewati guard; verifikasi field DTO tidak bocor.
- [ ] Usulkan perluasan `check:access` ke koordinator, dengan daftar permukaan yang benar-benar diuji dan kekurangan yang masih terbuka.
**Selesai bila:** bukti positif/negatif lulus tanpa menonaktifkan guard; integrasi media/konten yang belum tersedia diuji lagi pada F0-23.

### F0-13: Validasi byte dan pipeline Sharp

**Wilayah tulis:** `src/lib/media/**`, `tests/unit/media/**`; fungsi pemrosesan terpisah dari endpoint dan izin.
- [x] Tulis fixture valid/invalid dahulu; uji MIME sebenarnya, byte/ukuran/dimensi, SVG ditolak dan nama/object key tidak dipercaya.
- [x] Implementasi varian WebP yang diminta PRD, batas proses dan hasil metadata yang tervalidasi.
- [x] Uji gambar rusak, tipe palsu dan batas resource; jangan bergantung hanya pada ekstensi/Content-Type browser.
- [x] Serahkan kontrak hasil/error terstruktur ke F0-14; hasil lokal bukan bukti upload R2.
**Selesai bila:** pipeline deterministik lulus tes validasi dan varian tanpa mengakses aset pemilik.

### F0-14: Signed upload R2 dan finalisasi

**Wilayah tulis:** `src/services/media/**`, action/route media yang dialokasikan, `tests/int/media/**`; schema oleh DB.
- [ ] Integrasikan S3-compatible SDK, signed upload berumur pendek, key/prefix buatan server dan policy admin sebelum penerbitan URL.
- [ ] Finalisasi membaca objek otoritatif, memvalidasi melalui F0-13, menyimpan varian/metadata/audit sesuai transaksi yang memungkinkan, serta menangani kegagalan parsial.
- [ ] Uji akses anonim/editor/owner, penyalahgunaan key, URL kedaluwarsa dan pengulangan finalisasi; hapus objek invalid hanya pada target tes yang diizinkan.
- [ ] Buktikan upload langsung R2, kebijakan URL publik/privat dan persistensi setelah redeploy pada staging yang disetujui; Rilis 2 tidak diaktifkan.
**Selesai bila:** bukti R2 nyata dan kegagalan aman tersedia; mock SDK saja tidak menutup N-04.

### F0-15: Blok, versi konten dan publish

**Wilayah tulis:** schema Zod konten, `src/services/content/**`, action konten dan tes konten yang dialokasikan; schema DB/migrasi oleh DB.
- [ ] Implementasi irisan konten minimum dari inventaris prototype, validasi node rich text/URL/relasi media dan penolakan `[ISI]` saat publish.
- [ ] Terapkan draft/published, content_versions, update/publish/restore, serta audit append-only dalam transaksi domain terkait.
- [ ] Restore menciptakan revisi baru; field turunan dihitung server dan tidak dipercaya dari browser.
- [ ] Uji akses/field, publish invalid, konflik/perubahan gagal, rollback transaksi dan DTO publik tanpa draft/field internal.
**Selesai bila:** irisan vertikal draft sampai publish/restore terbukti; bukan klaim seluruh CRUD konten Fase 1/2 selesai.

### F0-16: Preview dan Draft Mode

**Wilayah tulis:** route preview/exit dan komponen proof-of-concept yang dialokasikan, `tests/e2e/preview/**`; konfigurasi bersama melalui koordinator.
- [ ] Baca API Next terkunci sebelum mengimplementasikan preview token, cookie Draft Mode dan keluar preview.
- [ ] Ikat token pada sesi/resource/hak, umur berlaku dan validasi origin sesuai kontrak; TOTP/policy tetap diperiksa.
- [ ] Uji anonim, editor tanpa izin, token palsu/kedaluwarsa/resource salah dan sesi dicabut; draft tidak masuk endpoint/cache publik.
- [ ] Buktikan preview dan publik sebagai dua context terpisah, tanpa merender teks pengguna sebagai HTML bebas.
**Selesai bila:** preview berfungsi untuk admin berizin dan tidak membocorkan draft melalui URL/cookie/cache.

### F0-17: Cache dan invalidasi

**Wilayah tulis:** modul cache/read publik yang dialokasikan dan `tests/int/cache/**`; perubahan hook publish dikoordinasikan dengan pemilik konten.
- [ ] Verifikasi API cache Next terkunci; tetapkan key/tag per environment, DTO publik, dan jalur preview no-store.
- [ ] Invalidasi hanya setelah commit sukses; uji commit gagal tidak memublikasikan state yang dibatalkan.
- [ ] Uji publish/update/unpublish/restore dan batas waktu publikasi/diskon tanpa cron aplikasi, memakai waktu tes yang terkendali.
- [ ] Ukur perubahan admin ke publik <=60 detik pada runtime staging target; buktikan staging/produksi tidak silang data tanpa membaca/menulis data produksi.
**Selesai bila:** ada waktu pengukuran dan bukti isolasi; hasil unit test cache saja belum menutup N-07.

### F0-18: Constraint dan race booking

**Wilayah tulis:** irisan schema/migrasi booking oleh DB, `tests/int/booking-constraint/**`; bukan implementasi engine/UI booking Fase 4.
- [ ] Porting kontrak Lampiran F.7 ke fixture/tes baru terlebih dahulu, tidak menghidupkan kembali implementasi lama sebagai hasil baru.
- [ ] Terapkan constraint rentang/unik yang dituntut PRD pada schema irisan tes; review dukungan PostgreSQL/ekstensi yang diperlukan.
- [ ] Uji dua transaksi/pemesanan serentak, kasus batas waktu/durasi/status, serta kode konflik `23P01`/`23505` sesuai kontrak.
- [ ] Ulangi pada Neon tes yang disetujui dan simpan bukti tanpa PII; mapping pesan ke UI final tetap pekerjaan fase terkait.
**Selesai bila:** constraint fisik menolak race, bukan hanya validasi aplikasi sebelum insert.

### F0-19: Sentry dan redaksi

**Wilayah tulis:** konfigurasi monitoring dan tes redaksi yang dialokasikan; `instrumentation.ts`, Next config, env melalui koordinator.
- [ ] Integrasikan SDK versi yang disetujui tanpa memindahkan rahasia ke bundle browser atau menambah paket `@vercel/*`.
- [ ] Sanitasi event/breadcrumb/request sehingga secret, password, TOTP/recovery, cookie, PII dan IP mentah tidak terkirim.
- [ ] Uji redaksi lokal dan kirim error sintetis ke project monitoring tes berizin; catat korelasi tanpa payload sensitif.
- [ ] Pastikan tanpa DSN tidak merusak runtime dan error publik tetap tersanitasi.
**Selesai bila:** bukti redaksi dan penerimaan event aman tersedia; tidak cukup SDK terpasang.

### F0-20: Docker dan artefak standalone

**Wilayah tulis:** `Dockerfile`, `.dockerignore`, pemeriksaan packaging yang dialokasikan; perubahan config/env melalui koordinator.
- [ ] Build dari context bersih pada runtime target, salin standalone/static/public secara benar dan jalankan sebagai non-root.
- [ ] Verifikasi rahasia `.env*`, memori tool dan file pengembangan tidak ikut image/artefak yang didistribusikan.
- [ ] Jalankan container dengan env sintetis; uji health serta batas root/admin/tracking sesuai baseline pada saat pengujian.
- [ ] Catat batas Windows symlink/junction bila relevan; jangan menyamakan build lokal Windows dengan image Linux yang portabel.
**Selesai bila:** Docker build/run nyata berhasil. Ulangi smoke test setelah irisan auth/media/konten digabung pada F0-23.

### F0-21: Profil performa

**Wilayah tulis:** script pengukuran terisolasi dan `docs/fase-0/performa.md`; tidak mengubah UI/hosting secara sepihak.
- [ ] Ukur build, cold start, penggunaan memori, ukuran artefak/fungsi dan pemrosesan gambar pada beban/ukuran berkas yang dicatat.
- [ ] Uji batas upload/finalisasi sinkron, timeout dan penggunaan memori; bedakan hasil lokal/container dari runtime hosting target.
- [ ] Reproduksi pada staging yang diizinkan dengan beban aman; laporkan metode, sampel, versi, hasil dan batas pengukuran.
- [ ] Beri rekomendasi kelayakan hosting berdasarkan PRD 7.7/Lampiran H, bukan membeli layanan/domain atau mengubah paket.
**Selesai bila:** N-08 memiliki angka pengukuran nyata dan masalah yang belum selesai dinyatakan terbuka.

### F0-22: Backup dan restore-verify

**Wilayah tulis:** workflow backup, script restore-verification dan tes yang dialokasikan; penggunaan DB oleh penulis DB, CI utama oleh F0-23.
- [ ] Verifikasi versi mayor pg_dump/pg_restore, akses minimum, enkripsi dan upload ke bucket cadangan terpisah yang disetujui.
- [ ] Gunakan data sintetis, unduh/dekripsi secara aman dan restore ke DB kosong dengan guard target; tidak menimpa DB pemilik.
- [ ] Uji ulang schema/constraint F0-18 dan irisan aplikasi pada hasil restore; lakukan pengujian tambahan jika schema berubah.
- [ ] Catat lokasi/cara pengelolaan passphrase oleh pemilik tanpa mencetak nilainya; jadwal harian hanya diaktifkan setelah bukti dan persetujuan siap.
**Selesai bila:** cadangan benar-benar dipulihkan dan diverifikasi, bukan sekadar upload berhasil.

### F0-23: CI dan verifikasi baseline gabungan

**Wilayah tulis:** workflow CI dan tes integrasi lintas-modul yang dialokasikan; config bersama diterapkan koordinator.
- [ ] Jalankan clean install, lint, typecheck, unit/integrasi, access matrix, portability, migration/drift check, build dan Playwright pada target Node.
- [ ] Uji semua service/action/route yang benar-benar dibangun pada Fase 0 melalui matriks actor/field/resource; lengkapi interaksi media/konten/preview yang belum ada pada F0-12.
- [ ] Jalankan audit dependency, Docker smoke setelah integrasi, serta restore-verify pada schema gabungan; jangan mencetak secret/PII dalam artefak CI.
- [ ] Jalankan workflow GitHub nyata setelah izin commit/push tersedia; pin action sesuai arahan PRD setelah versi dipilih dan diuji.
- [ ] Catat SHA baseline gabungan, hasil, artefak tersanitasi dan semua pemeriksaan cloud yang belum berjalan; tes branch terpisah tidak menggantikan run gabungan.
**Selesai bila:** pipeline dan pengujian gabungan benar-benar berjalan tanpa klaim sukses dari pemeriksaan yang dilewati.

### F0-24: Review gerbang dan handoff

**Wilayah tulis:** rencana ini dan `docs/fase-0/handoff.md` oleh koordinator/reviewer.
- [ ] Cocokkan bukti masing-masing N-01 sampai N-10 terhadap PRD 12.3, bukan hanya status task atau jumlah tes.
- [ ] Tinjau keamanan, matriks akses, advisory terbuka, keputusan pemilik, target cloud dan perubahan schema yang belum diuji ulang.
- [ ] Pisahkan kode proof-of-concept dari fitur produk yang masih harus diselesaikan; tandai helper/route tes agar tidak menjadi endpoint produksi tidak berizin.
- [ ] Siapkan backlog Fase 1 dengan kontrak/schema yang benar-benar terbukti, pemilik modul dan dependensi; minta keputusan sebelum pindah fase.
**Selesai bila:** semua gerbang memiliki bukti lulus, atau pengecualian eksplisit pemilik dicatat beserta risiko tanpa mengubah hasil gagal menjadi lulus. Tidak ada klaim aplikasi/Rilis 1 selesai.

## Matriks penutupan gerbang

| Gerbang | Task pembawa bukti | Catatan review |
|---|---|---|
| N-01 | 01, 04, 06, 07, 23 | Audit/clean install diulang setelah dependency terakhir digabung. |
| N-02 | 04, 08, 10, 11, 12 | UI login saja tidak cukup; jalur langsung dan recovery wajib diuji. |
| N-03 | 05, 08, 18, 22, 23 | Migrasi, constraint Neon dan pemulihan harus pada schema yang konsisten. |
| N-04 | 05, 13, 14, 21 | Fixture lokal dan bukti R2 nyata keduanya diperlukan. |
| N-05 | 03, 06, 15, 16 | Draft/public/preview, audit dan restore versi teruji. |
| N-06 | 03, 06, 09, 10, 12, 14, 15, 16, 23 | Matriks lengkap kontrak Rilis 1; pemaksaan diuji pada seluruh permukaan Fase 0 yang tersedia. Service/route baru fase berikutnya wajib menambah bukti, bukan dianggap sudah aman. |
| N-07 | 16, 17 | Bukti waktu dan isolasi pada runtime target. |
| N-08 | 05, 20, 21 | Docker lokal tidak menggantikan pengukuran hosting. |
| N-09 | 02, 03, 06 | Inventaris seluruh layar, state dan acceptance criteria, bukan implementasi desain. |
| N-10 | 19, 20, 22, 23 | Pipeline nyata, monitoring aman, portabilitas dan restore. |

F0-24 adalah review akhir seluruh baris. Matriks ini tidak mengurangi kriteria PRD; jika bukti task belum memenuhi kriterianya, gerbang tetap terbuka.

## Format penugasan dan laporan agent

Salin template berikut untuk satu agent. Isi hanya task yang prasyaratnya tersedia; jangan memberi satu agent instruksi “selesaikan semua Fase 0” bersamaan dengan agent lain.

```text
Kerjakan task F0-XX saja dari RENCANA_IMPLEMENTASI_PRD_1_5.md.
Acuan: PRD_v1_5.md, AGENTS.md, rincian task dan kontrak F0-06 jika sudah disepakati.
Peran/penanggung jawab: <nama>.
Baseline SHA/branch/worktree: <isi; untuk audit awal sebut working tree belum di-commit>.
Prasyarat yang sudah tersedia: <ID task, lokasi laporan/kontrak, versi>.
Wilayah tulis yang dialokasikan: <path persis>; file lain baca-saja.
Mode: <audit baca-saja / implementasi setelah baseline & kontrak siap>.
Target tes/port: <target sintetis yang diizinkan; jangan masukkan secret>.
Jangan mengubah file bersama, schema di luar kepemilikan, prototype, PRD atau .env pemilik.
Jika perlu dependency/schema/kontrak baru, serahkan usulan kepada koordinator dan berhenti pada blocker.
Jangan commit, push, deploy, membuat resource berbiaya atau menghapus data tanpa izin terpisah.
Tulis hasil ke docs/fase-0/laporan/F0-XX.md, bukan mengubah status rencana utama.
Laporkan file yang berubah, bukti tes nyata, keterbatasan, dan task berikutnya yang kini bisa dibuka.
```

Laporan per task harus memuat:
1. ID, penanggung jawab, status usulan, baseline/SHA, branch/worktree, runtime dan kontrak yang dipakai.
2. Checklist tugas, file yang diubah, keputusan/API yang diverifikasi dan perbedaan terhadap kontrak bila ada.
3. Perintah tes, hasil/exit code, target sintetis, waktu run dan lokasi bukti tersanitasi; bedakan lokal, mock dan cloud nyata.
4. Pemeriksaan gagal/dilewati, blocker/izin yang belum tersedia, risiko dan permintaan perubahan file bersama.
5. Handoff: interface/schema yang tersedia, task konsumen yang dapat mulai, serta tes yang wajib diulang setelah integrasi.

Koordinator baru mengubah status menjadi `SELESAI` setelah review dan verifikasi gabungan. Template ini tidak berarti agent sudah dijalankan atau task sudah diklaim.

## Keputusan reset

Pemilik memilih reset seluruh implementasi, bukan hanya melepas dependency CMS. Seluruh route, komponen, integrasi, schema/migrasi lokal, engine bisnis, helper, fixture, dan tes implementasi sebelumnya dibuang. Referensi fungsional untuk pembangunan ulang tetap Lampiran F PRD baru.

Tetap dipertahankan: PRD baru, prototype full-page, aset `public/`, konfigurasi rahasia pemilik, data database dan R2, serta histori Git. Memori tool pribadi yang tidak di-track bukan acuan implementasi dan tidak dibersihkan sebagai kode aplikasi.

**Reset file tidak berarti DROP TABLE, penghapusan akun, penghapusan bucket, deploy, commit, atau push.** Migrasi histori database yang sudah pernah diterapkan tidak dapat diasumsikan hilang karena file migrasi lokal dibuang.

## Status setelah reset

- Fase aktif: **Fase 0, baru dimulai**, bukan selesai.
- Fondasi HTTP dan health dibangun ulang, tanpa frontend/admin lama.
- Website/admin sengaja 503; tracking 404; tidak ada endpoint CRUD/auth publik yang aktif.
- Query health memakai driver `pg` dan Drizzle, pooled runtime; tidak membuat tabel.
- Better Auth terpasang untuk verifikasi kompatibilitas berikutnya, belum merupakan sistem autentikasi yang berfungsi.
- UI prototype belum diimplementasikan. Tidak ada desain baru yang dibuat pada reset ini.
- Tidak ada schema baru/migrasi yang dijalankan; seluruh akses tulis ke data pemilik tetap di luar cakupan.

## Inventaris pembersihan

| Area sebelumnya | Tindakan |
|---|---|
| PRD dan rencana kerja terdahulu | Dihapus; dokumen ini menggantikan rencana kerja. |
| Integrasi CMS, route admin/API generik, generated types/import map | Dihapus seluruhnya. |
| Koleksi/global/hook/definisi blocks dan migrasi integrasi sebelumnya | Dihapus dari working tree, tidak menjalankan rollback database. |
| Frontend, CSS implementasi, renderer/DTO/cache/adaptor server | Dihapus, dibangun ulang pada fase yang relevan. |
| Engine calculator/booking/WA/security dan seluruh fixture/tes lama | Dihapus sesuai pilihan reset total; ditulis ulang dari Lampiran F, test dahulu. |
| Owner/seed/access scripts lama | Dihapus; tidak dapat dipakai mengubah database sebelumnya. |
| Konfigurasi Next/tooling/CI/Docker | Ditulis ulang untuk fondasi tanpa CMS. |
| Integrasi monitoring sebelumnya | Dihapus; Sentry akan diintegrasikan ulang dan diuji N-10. |
| Dependency dan lockfile | Dibentuk ulang; tidak ada override lama tanpa kebutuhan yang terbukti. |
| Prototype dan aset pemilik | Dipertahankan; hanya tautan dokumen aktif pada peta struktur diselaraskan. |

## Hasil verifikasi reset, 28 Oktober 2026

Lingkungan lokal: Windows, Node `26.8.2`, pnpm `12.3.4`, branch `refactor/prd-v1-5-reset`. CI dan Docker ditargetkan ke Node `22.23.4`, belum dijalankan di lingkungan tersebut.

| Pemeriksaan | Hasil nyata |
|---|---|
| `pnpm install --frozen-lockfile` | Lulus pada working tree yang sudah terpasang; bukan bukti clean install di mesin baru. |
| `pnpm lint` | Lulus tanpa temuan ESLint. |
| `pnpm typecheck` | Lulus, termasuk tipe route hasil build. |
| `pnpm test --no-cache` | 15 tes lulus pada 3 berkas, termasuk dua regresi URL invalid. |
| `pnpm check:portability` | Lulus; manifest/import aplikasi tidak memakai CMS lama atau paket `@vercel/*`. |
| `pnpm check:access` | 4 tes batas reset lulus; tes yang sama termasuk dalam 15 unit test, bukan tambahan matriks RBAC. |
| `pnpm build` | Lulus setelah konfigurasi `runtime`/`dynamic` health dideklarasikan langsung, bukan di-re-export. Build memakai environment sintetis dan database pada port tertutup. |
| `pnpm test:e2e` | 4 tes HTTP lulus pada `node .next/standalone/server.js`, tanpa browser atau koneksi database pemilik. |
| `pnpm audit --prod --audit-level=high` dan audit seluruh dependency dengan ambang high | Exit 0, tidak ada high/critical; tetap ada satu moderate. |
| `pnpm audit --prod --audit-level=moderate` | Exit 1: `esbuild@0.18.20`, GHSA-67mh-4wv8-2f99, melalui `better-auth > drizzle-kit > @esbuild-kit/esm-loader > @esbuild-kit/core-utils`. Perbaikan transitif perlu diuji sebelum N-01 ditutup. |
| Pemeriksaan dependency | Tidak ada paket Payload pada lockfile baru. Referensi `@vercel/postgres` hanya metadata optional peer Drizzle, bukan paket terpasang (`pnpm why @vercel/postgres` kosong). Override Happy DOM dihapus setelah Vitest 5 tidak lagi memasangnya (`pnpm why happy-dom` kosong). |
| Pemeriksaan aset dan diff | `git diff --check` lulus, hanya peringatan konversi LF/CRLF. Satu-satunya perubahan di `public/` dan `prototype/` adalah tautan acuan pada `prototype/STRUKTUR.md`; HTML/aset tetap utuh. |

Bukti HTTP: `/`, `/admin`, dan `/admin/users` memberi 503 dengan `no-store`/`noindex`; tiga jalur tracking memberi 404; `/api/users`, `/api/projects`, dan `/api/draft` memberi 404; POST `/admin` ditolak 405; `/health` dan `/api/health` memberi 503 dengan body tersanitasi saat database tidak tersedia.

Batasan: Vitest pada Node lokal menampilkan peringatan deprecation `module.register()`. Instalasi menampilkan deprecation ESLint 9 serta loader esbuild-kit transitif. Tidak ada klaim kompatibilitas runtime Node 22 dari run lokal Node 26. Tidak ada UI baru, sehingga audit visual/mobile/keyboard dan E2E TOTP belum berlaku sebagai hasil implementasi.

Belum dijalankan: clean install tanpa `node_modules`, CI GitHub, Docker build/run, koneksi sukses ke Neon, migrasi schema, auth/TOTP/RBAC, R2/Sharp, Sentry, profiling memori/cold start, serta backup/restore. Tidak ada migrasi, deploy, commit, push, atau mutasi data pemilik pada reset ini. Jangan mendistribusikan output standalone lokal yang dapat menyertakan `.env`; gunakan build lingkungan bersih.

## Gerbang Fase 0

Semua N-01 sampai N-10 tetap belum selesai sampai kriteria PRD 12.3 terbukti. Lulus smoke test fondasi tidak menutup gerbang ini.

| ID | Pekerjaan berikutnya | Bukti yang diperlukan |
|---|---|---|
| N-01 | Verifikasi clean install, peer dependency dan audit versi exact-pinned; tentukan kebutuhan editor dari prototype sebelum menambah Lexical. | Install bersih, lockfile, typecheck, build, audit, catatan versi Node/pnpm/paket. |
| N-02 | Better Auth dengan schema identitas/sesi/TOTP, owner/editor, signup tertutup, 2FA wajib, login/TOTP lockout 5/15, reset/recovery CLI tanpa email. | Unit/integrasi/E2E membuktikan sesi password-only tidak dapat membuka admin/actions; tidak ada jalur bypass atau pengiriman email. |
| N-03 | Pilih identity domain dan relasi auth, schema Drizzle, migrator direct, guard database disposable yang memeriksa target eksplisit. | DB baru terisolasi, migrasi dari kosong dan berulang sesuai migrator, review SQL, restore, F.7 pada schema fisik baru. |
| N-04 | S3-compatible SDK, signed upload pendek, finalisasi byte/MIME/ukuran, empat varian Sharp dan penyimpanan R2. | Upload langsung, berkas invalid ditolak/dihapus, hasil WebP, persistensi redeploy, batas waktu/memori. |
| N-05 | Schema blok terbatas, content_versions, publish service, preview token terikat sesi dan hak, restore versi menjadi revisi baru. | Draft tidak bocor, publikasi tervalidasi, dua context preview/publik, jejak versi/audit transaksional. |
| N-06 | Policy default deny untuk role/resource/action/field dan DTO; hubungkan ke semua service/action/route. | Matriks lengkap, URL/request langsung, IDOR, dan penolakan field internal; bukan sekadar menu tersembunyi. |
| N-07 | Cache sesuai Next terkunci, invalidasi setelah commit, publikasi/diskon berbasis waktu tanpa cron. | Perubahan admin ke publik <=60 detik pada runtime target, preview dan staging/produksi terisolasi. |
| N-08 | Profil build/cold start/memori, Sharp, upload dan packaging standalone. | Angka hasil pengukuran, batas layanan, Docker build/run; jangan menyimpulkan performa dari kode saja. |
| N-09 | Petakan layar publik dan admin berikut modal, form, state, mobile, keyboard dan aksi. | Inventaris setiap layar ke komponen, service, schema, role, rilis dan test case; tidak mengimplementasikan blog/invoice di luar scope. |
| N-10 | CI lengkap setelah schema tersedia, drift/migration checks, Sentry, encrypted backup/restore, Docker dan portabilitas. | Run nyata unit/integrasi/E2E, audit dependency, restore ke database kosong dan pengujian ulang constraint; bukti tanpa rahasia. |

### Urutan eksekusi

Gunakan daftar task, dependensi dan gelombang kerja di awal dokumen. Tabel N-01 sampai N-10 di atas tetap menjadi gerbang penerimaan PRD, sedangkan ID F0-XX adalah unit penugasan agent. Keduanya bukan daftar fase baru.

Hentikan sebelum Fase 1 sampai review F0-24 selesai atau pemilik mencatat pengecualian yang jelas. Jangan mengubah status gerbang menjadi selesai hanya karena dependency terpasang atau task audit sudah diserahkan.

## Peta prototype untuk N-09

| Referensi | Modul | Rilis/catatan |
|---|---|---|
| `prototype/stitch/site/beranda.html` | Home dan blocks | Rilis 1. |
| `prototype/stitch/site/daftar-portofolio.html` | Galeri/filter kategori | Rilis 1. |
| `prototype/stitch/site/detail-proyek-sinduksadati.html` | Detail proyek | Rilis 1. |
| `prototype/stitch/site/paket-layanan-harga.html` | Paket/add-on | Rilis 1. |
| `prototype/stitch/site/kalkulator-estimasi-biaya.html` | Kalkulator/quote | Rilis 1. |
| `prototype/stitch/site/booking-konsultasi.html` | Availability/booking | Rilis 1. |
| `prototype/stitch/site/tentang-kami.html` | Konten Tentang | Sesuai route konten yang disepakati. |
| `prototype/stitch/site/ketentuan-layanan.html`, `404.html` | Legal/error | Isi kebijakan dari pemilik; state tambahan tetap wajib. |
| `prototype/stitch/cms/login-admin.html` | Login dan 2FA | Rilis 1, Better Auth; jangan menganggap OTP sebagai email. |
| `prototype/stitch/cms/dashboard-cms-admin.html` | Dashboard/Perlu Tindakan | Rilis 1, data nyata. |
| `prototype/stitch/cms/site-settings.html` | Settings bertab | Rilis 1, pembatasan field editor. |
| `prototype/stitch/cms/proyek-showcase.html` | Proyek/publish/versi/media | Rilis 1. |
| `prototype/stitch/cms/layanan-bento.html` | Layanan | Rilis 1; tampilan prototype, bukan design system baru. |
| `prototype/stitch/cms/kategori-teknologi.html` | Taksonomi | Rilis 1, integritas relasi. |
| `prototype/stitch/cms/paket-layanan-addon.html` | Paket dan add-on | Rilis 1. |
| `prototype/stitch/cms/testimoni-faq.html` | Testimoni/FAQ | Rilis 1; tanpa data rekaan. |
| `prototype/stitch/cms/inquiry-pemesanan.html`, `quote-kalkulator.html` | Inquiry/quote | Rilis 1, owner saja. |
| `prototype/stitch/cms/booking-konsultasi.html` | Booking/jadwal/blokir | Rilis 1, owner saja. |
| `prototype/stitch/cms/manajemen-staf.html`, `log-aktivitas-2fa.html` | Users/audit | Rilis 1, owner; audit append-only. |
| Layar tracking, proyek klien, template tahap | Portal/admin proyek klien | Rilis 2; tidak ditautkan sebelum diminta. |
| Layar blog, detail layanan, invoice/penagihan | Referensi tambahan | Tidak otomatis menambah scope. Cocokkan PRD dan minta keputusan untuk fitur di luar rilis. |

Peta di atas adalah inventaris awal nama file, bukan klaim audit seluruh state, pixel match, aksesibilitas, atau implementasi layar sudah selesai.

## Roadmap sesudah gerbang Fase 0

- Fase 1: seluruh schema domain Rilis 1, FK/index/constraint, Zod/service, transaksi/versi/audit, seed idempotent dan matriks izin.
- Fase 2: admin custom mengikuti prototype, CRUD, media, settings, draft/versioning/preview, reorder/duplicate/trash, tindakan operasional dan WA.
- Fase 3: website publik prototype desktop/mobile, SEO, legal, cache, DTO aman, LCP/kontras.
- Fase 4: bangun ulang engine dengan fixture F dahulu; integrasikan kalkulator, inquiry, booking, Turnstile/WA/rate limit, paritas browser/server dan E2E race.
- Fase 5: keputusan hosting/domain, konten final, QA produksi, restore, sitemap, persetujuan dan pengumuman Rilis 1.
- Fase 6: hanya setelah diminta, portal klien/Rilis 2.

Estimasi sebelumnya tidak berlaku. Estimasi baru menunggu inventaris layar/interaksi dan hasil gerbang teknis.

## Kondisi berhenti

- Kredensial/resource belum jelas, target data belum disetujui, atau operasi berpotensi menimpa data pemilik.
- Versi/API tidak memenuhi kebutuhan TOTP wajib/recovery tanpa email.
- Perubahan harga, kebijakan, scope rilis, domain/hosting/biaya, atau penghapusan data diperlukan.
- Prototype berkonflik dengan fungsi/keamanan/aksesibilitas: laporkan dan konfirmasikan penyesuaian.
- Laporan verifikasi tidak boleh memuat secret, data pelanggan, kode TOTP, atau klaim tes cloud yang tidak dijalankan.
