# Kontrak Fondasi & Lintas-Modul: PRD v1.5 (F0-06)

Tanggal: 28 Oktober 2026  
Versi: 1.0.2-draft  
Status: KONSOLIDASI TIGA USULAN; belum dibekukan dan bukan izin implementasi/migrasi

Dokumen ini menyaring `usulan/auth-db.md`, `usulan/akses-konten.md`, dan `usulan/media.md` terhadap PRD serta source terkini. Lihat [review konsolidasi](review-usulan-3-agent.md) untuk bukti, koreksi, dan keputusan yang belum tersedia. Usulan asli dipertahankan sebagai masukan, bukan tiga kontrak yang dapat dipakai secara terpisah. Ketentuan PRD tetap mengikat; keputusan teknis draft belum menjadi bukti kompatibilitas API, persetujuan pemilik, atau implementasi yang lulus.

---

## 1. Tipe Data & Konvensi Fisik

* **Primary Key (ID):** Entitas domain mengikuti PRD §2.2: integer identity atau UUID yang dipilih konsisten per tabel. Larangan integer dan kewajiban Nanoid/Cuid2 dari draft lama dicabut. ID model Better Auth mengikuti adapter versi terkunci; pemetaan PK/FK profil ke identitas auth harus diputuskan sebelum migrasi, bukan diasumsikan dari string ID yang sekarang ada. Object key storage adalah identifier buatan server, bukan izin mempercayai ID browser.
* **Mata Uang:** Integer Rupiah (`bigint` atau `integer`). Tidak ada pecahan desimal di DB.
* **Waktu / Tanggal:**
  * Di Database: UTC (`timestamp with time zone` atau `timestamp` UTC).
  * Di API/JSON: ISO-8601 string (`YYYY-MM-DDTHH:mm:ss.sssZ`).
  * Di Tampilan UI: Format WIB (`Asia/Jakarta`).
* **Audit Trail:** Append-only. Tidak ada mutasi `UPDATE` atau `DELETE` pada tabel audit.

---

## 2. Struktur Schema Fondasi (F0-08)

### 2.1. Tabel Autentikasi (Better Auth)

Nama fisik yang ditemukan di schema/journal lokal adalah singular: `auth_user`, `auth_session`, `auth_account`, `auth_verification`, `auth_two_factor`. Kontrak menyebut nama tersebut agar sesuai dengan artefak lokal, bukan memerintahkan rename database. Field model paket, tipe ID, nullability, FK, unique dan additional fields harus direview penulis DB terhadap API Better Auth 1.7.14 sebelum migrasi final.

| Data | Otoritas yang dipilih untuk draft | Invariant |
|---|---|---|
| Identitas, `name`, `email` | `auth_user` | Tidak diduplikasi sebagai sumber tulis pada profil domain. |
| Password/hash, provider account | `auth_account` | Hanya struktur auth; tidak masuk profil, audit atau DTO. |
| Validitas dan expiry sesi | `auth_session` | Baris sesi dicabut berarti request berikutnya ditolak; cache cookie tidak boleh mempertahankannya. |
| Bukti faktor per sesi | Additional fields sesi yang perlu dibuktikan API-nya | Konsep `assuranceLevel`, `secondFactorVerifiedAt`, `secondFactorMethod`; bukan input browser. Default sesi harus berizin paling rendah. |
| Secret/faktor/recovery | `auth_two_factor` dan struktur paket | Faktor aktif pada akun bukan bukti bahwa sesi saat ini sudah melewati TOTP. Enkripsi, unique user-factor dan semantik null harus diuji. |
| Counter upaya auth | State PostgreSQL atomik aplikasi | Satu budget lintas password/TOTP untuk principal yang sama; bukan `Map` proses. |

Nama konseptual additional fields bukan API paket yang dianggap sudah tersedia. F0-07/F0-10 harus membuktikan hook/façade dapat menandai sesi dari verifikasi TOTP sebelum response sukses. Jika gagal, cabut sesi dan jangan membuka endpoint tersebut. Batas memori/sesi/challenge dan enforcement lintas-instance wajib diuji dengan DB disposable.

### 2.2. Tabel Domain Profil & Otorisasi
`users` menyimpan otorisasi (`role`, lifecycle yang ditetapkan) dan relasi unik ber-FK ke `auth_user`. Nama/email dibaca melalui join/proyeksi dari identitas auth. `role` hanya dari DB, dibatasi owner/editor dan dilindungi constraint; profil hilang/nonaktif tidak dapat menjadi admin.

Usulan memakai `auth_user_id` sekaligus PK/FK profil dinilai layak ditelaah, tetapi bentuk fisik final harus konsisten dengan keputusan ID domain PRD §2.2 dan kemampuan adapter. `Actor.userId` harus memiliki satu makna tetap: ID identitas auth, bukan berganti menjadi ID profil saat status autentikasi berubah. Relasi domain lain harus eksplisit tentang ID yang dirujuk.

Tidak ada penghapusan kolom, penggantian PK, atau cascade baru yang diizinkan oleh draft ini. Penulis DB harus meninjau ledger dan data existing serta mendapat persetujuan porting sebelum mutasi target yang pernah berisi data. Penghapusan akun/retensi tidak diputuskan hanya dari usulan cascade.

### 2.3. Tabel Audit Log
* **`audit_logs`:**
  * `id`: text primary key
  * `actorId`: ID identitas auth yang maknanya stabil; nullable untuk system/unauthenticated
  * `actorEmail`: text
  * `actorRole`: text (`owner` | `editor` | `system` | `anonymous`)
  * `action`: text not null (e.g. `auth.login`, `auth.lockout`, `content.publish`, `media.upload`)
  * `resource`: text not null (e.g. `session`, `project`, `settings`)
  * `resourceId`: text
  * `diff`: JSONB proyeksi audit tervalidasi dan tersanitasi, mengikuti nama field lokal; bukan snapshot mentah seluruh record
  * `ipHash`: text
  * `createdAt`: timestamp not null default now()

Audit dan perubahan domain/versi terkait harus satu transaksi. Append-only perlu dibuktikan pada service dan privilege/constraint mekanisme DB yang dipilih, bukan dianggap tersedia karena tabel sudah dibuat. Data identitas historis audit bukan profil aktif; kebijakan retensinya tetap terpisah.

---

## 3. Matriks Otorisasi & Policy Default-Deny (F0-09)

### 3.1. Klasifikasi Aktor
1. **`anonymous`**: Permintaan publik tanpa cookie sesi valid.
2. **`password_only`**: Sesi Better Auth ada untuk akun yang `twoFactorEnabled=false` (belum enroll TOTP). Sesi ini hanya boleh menyelesaikan enrollment terbatas; tolak dari seluruh route/action/data admin sampai TOTP aktif dan terverifikasi. Nama ini tidak boleh dipakai untuk challenge TOTP milik akun yang sudah mengaktifkan faktor.
3. **Konteks `pending_2fa`**: Challenge Better Auth saat akun dengan TOTP aktif belum menyelesaikan faktor kedua. Pada Better Auth 1.7.14, sesi awal dihapus dan challenge cookie bukan sesi penuh. Perlakukan sebagai unauthenticated, sama dengan anonymous untuk hak publik, dan tolak dari seluruh route/action admin. Untuk audit log, klasifikasikan sebagai unauthenticated, bukan role domain.
4. **`authenticated_editor`**: Sesi aktif + TOTP lolos, role = `editor`.
5. **`authenticated_owner`**: Sesi aktif + TOTP lolos, role = `owner`.

Sesi admin memerlukan bukti TOTP pada **sesi tersebut**, faktor akun masih verified, profil aktif, dan policy resource/operasi/field yang mengizinkan. Pemeriksaan hanya `twoFactorEnabled` seperti resolver sekarang belum memenuhi invariant. Proposal `recovery_only` dari backup code tidak otomatis diadopsi: sebelum flow disetujui, backup code tidak boleh menjadi jalur masuk admin yang melewati TOTP. Pending challenge bukan actor domain; normalisasikan menjadi anonim untuk policy sambil menjaga konteks challenge hanya pada boundary auth.

### 3.2. Matriks Akses Domain

| Resource / Domain | Operasi | Anonymous | Password-only (enrollment saja) | Pending 2FA challenge (unauthenticated) | Editor | Owner |
|---|---|---|---|---|---|---|
| **Publik (Website)** | Read | ALLOW | ALLOW, hanya akses publik | Sama dengan anonymous | ALLOW | ALLOW |
| **Publik (Mutasi/Inquiry/Booking)** | Create | ALLOW (rate-limited + captcha) | ALLOW, dengan guard publik yang sama | Sama dengan anonymous | ALLOW | ALLOW |
| **Admin Route (`/admin/*`)** | Any | DENY (login flow terpisah) | DENY, kecuali alur enrollment terbatas yang eksplisit | DENY (challenge bukan sesi admin) | ALLOW | ALLOW |
| **Konten Website (Proyek, Layanan, Testimoni)** | Read, Create, Update, Publish | DENY | DENY | DENY | ALLOW | ALLOW |
| **Konten Website** | Hard Delete | DENY | DENY | DENY | DENY | ALLOW |
| **Operasional Klien (Inquiry, Quote, Booking)** | Read, Update | DENY | DENY | DENY | DENY | ALLOW |
| **Site Settings, field konten terizinkan** | Read, Update | DENY | DENY | DENY | ALLOW sesuai allowlist field | ALLOW sesuai validasi |
| **Settings WhatsApp/Tracking dan Sistem/Staf** | Read, Write | DENY | DENY | DENY | DENY | ALLOW sesuai validasi |
| **Audit Logs** | Read | DENY | DENY | DENY | DENY | ALLOW |
| **Tracking Portal (`/tracking*`)** | Any | DENY (404 Rilis 1) | DENY (404) | DENY (404) | DENY (404) | DENY (404) |

### 3.3. DTO & Field-Level Protection
* Field sensitif yang **tidak boleh bocor** ke response publik atau editor:
  * `password`, `secret`, `backupCodes`, `twoFactorEnabled`, `lockedUntil`.
  * `ipAddress`, `ipHash`, nomor WhatsApp admin privat.
  * Internal metadata & audit details.
* Semua response controller/action memakai proyeksi allowlist dan schema output, termasuk untuk owner. Hak owner bukan izin mengirim row mentah, token, atau secret.
* Status enrollment minimal milik sendiri memakai DTO auth khusus; larangan field auth pada DTO konten bukan alasan menghilangkan informasi minimum yang dibutuhkan flow enrollment.
* Mutasi menolak field tidak dikenal/terlarang, termasuk nested path, bukan diam-diam men-strip serangan lalu melaporkan sukses. DTO output justru memilih field terizinkan dan tidak membocorkan key terlarang sebagai nilai masked.

### 3.4. Field Settings dan batas service

Field logis mengikuti tepat PRD §3.1, termasuk `whatsapp.tplPackageOrder` dan daftar `booking.availableModes` dari domain PRD; jangan menciptakan nama field/enum dari mockup.

| Kelompok | Aturan dasar PRD | Usulan tambahan yang belum disetujui |
|---|---|---|
| `general`, `hero`, `navigation`, `seo` | Konten website, validasi field dan URL/media; bukan akses Sistem umum | Owner-only untuk perubahan kontak bisnis dan `analyticsId` perlu keputusan policy, bukan disebut sebagai larangan eksplisit PRD. |
| `calculator`, `booking` | Konfigurasi logis sesuai PRD, tetap berbeda dari record inquiry/quote/booking yang owner-only | Owner-only `minimumPrice`, parameter jadwal dan sebagian mode adalah usulan; tetapkan field read/write satu per satu sebelum F0-09. |
| `legal` | Konten dan kebijakan dari pemilik; `[ISI]` tidak dapat dipublish | Peran pengedit/pemberi persetujuan final harus eksplisit bila ditambah, tidak disimpulkan dari UI. |
| `whatsapp`, `tracking` | Editor ditolak baca/tulis; DTO tidak memuat tab ini | Tidak ada usulan yang boleh melonggarkan larangan tersebut. Tracking tetap tidak aktif pada Rilis 1. |

Matriks resource harus dikembangkan per entitas/operasi/field, bukan satu `delete` generik yang menyamakan trash, restore versi, restore trash dan hard delete. Penghapusan data operasional/retensi tidak otomatis diizinkan hanya karena actor owner. Setiap service memeriksa actor tepercaya, TOTP, policy, scope ID dan field; guard di route/action atau Proxy saja tidak cukup untuk caller service langsung.

---

## 4. Mekanisme Keamanan Auth (F0-10)

* **Signup publik:** DITUTUP total (`disableSignUp: true`). Pembuatan akun admin hanya melalui CLI (`owner:create`) atau oleh owner dari panel admin.
* **Tanpa pengiriman email:** istilah ini berarti tidak ada layanan/callback email untuk verifikasi, reset atau notifikasi. Better Auth email/password tetap menggunakan identifier berformat email. Jika yang dimaksud adalah login username tanpa email, itu memerlukan keputusan produk dan bukti API terpisah.
* **TOTP Wajib:** Kedua role (`owner` & `editor`) wajib mengaktifkan dan memverifikasi TOTP sebelum dapat mengakses resource admin. User yang belum enroll dapat memiliki sesi Better Auth password-only, tetapi hanya boleh menyelesaikan alur enrollment terbatas dan tidak memperoleh izin admin.
* **Challenge dan sesi:** untuk akun dengan TOTP aktif, hasil password sign-in adalah challenge unauthenticated, bukan sesi terbatas; Better Auth menghapus sesi awal sebelum challenge. Session dengan izin admin hanya boleh dipakai setelah TOTP valid dan policy memuat profil/role domain terpercaya. Perbedaan session password-only unenrolled vs challenge `pending_2fa` harus diuji eksplisit.
* **Enrollment dan revocation:** draft memilih alur enrollment terbatas yang tidak dipromosikan otomatis menjadi admin. Setelah enrollment selesai, cabut sesi/challenge user dan minta login password + TOTP baru; buktikan sesi password-only lain tidak mewarisi flag faktor global. Batas sesi dan hook revocation masih perlu bukti API/runtime sebelum kontrak dibekukan.
* **Trusted device:** `trustDevice` tidak boleh diterima/diaktifkan karena dapat melewati kewajiban TOTP pada login berikutnya. Menyembunyikan checkbox UI tidak cukup; penolakan jalur API langsung harus diverifikasi pada versi Better Auth terkunci.
* **Recovery:** bootstrap dan reset/recovery owner berjalan melalui CLI/service terkontrol tanpa email, memakai input rahasia yang aman, audit tanpa secret, dan pencabutan sesi lama. Detail command dan verifikasi target dibuktikan pada F0-11; belum dianggap tersedia.
* **Lockout:**
  * Target PRD adalah maksimum 5 percobaan gagal dalam 15 menit dan lock sementara 15 menit, mencakup kegagalan credential dan TOTP sesuai kebijakan aplikasi.
  * `accountLockout` Better Auth hanya melindungi verifikasi faktor kedua pada versi yang diaudit; konfigurasi plugin saja tidak membuktikan lockout password atau gabungan. Kebijakan aplikasi perlu counter atomik/rate limit yang menutup seluruh jalur credential/TOTP dan percobaan paralel.
  * Tercatat di `audit_logs` dengan status `auth.lockout`.
  * Rancangan yang ditelaah: fixed window dimulai kegagalan pertama, kegagalan kelima di window mengunci 15 menit sejak kegagalan kelima; password benar yang masih menunggu TOTP tidak mereset budget. Reset hanya setelah autentikasi penuh/recovery terotorisasi. Jangan menyatakan opsi plugin `durationSeconds` sebagai jendela hitung aplikasi.
  * Upsert/row lock dan audit transisi lock harus atomik. Uji keberhasilan yang bersaing dengan kegagalan kelima agar tidak meloloskan penerbitan sesi saat lock sudah berlaku. Semantik linearization dan hook outcome belum dibuktikan; jangan menonaktifkan proteksi paket sampai façade seluruh jalur teruji.
* **Session Cookie:**
  * `httpOnly: true`, `secure: true` (pada produksi), `sameSite: 'lax'`, origin guard aktif.

---

## 5. Media & Upload (F0-13, F0-14)

* **Storage Target:** Cloudflare R2 (S3-compatible). Pembuktian gerbang memakai bucket tes terpisah dengan izin spesifik, bukan produksi.
* **Upload Pattern:** URL pendek diterbitkan setelah sesi/TOTP/policy valid; usulan TTL 300 detik bukan konstanta PRD. Ada record unggahan pending milik actor yang mengikat media ID, key sumber, batas, expiry dan state. Key/tanggal/policy tidak boleh berasal bebas dari browser saat finalisasi.
* **Validasi Byte (Sharp):**
  * Magic byte verification (MIME nyata, bukan sekadar ekstensi).
  * SVG ditolak mutlak.
  * Empat nama varian wajib PRD: **`thumb`, `card`, `hero`, `og`**. Nama lama `sm/md/lg` tidak berlaku.
  * Dimensi validasi memakai basis setelah orientasi EXIF. Pisahkan batas jumlah piksel dari lebar/tinggi dan petakan pelanggaran limit menjadi error limit, bukan otomatis berkas rusak.
  * Usulan dimensi: thumb 320×320, card 960w, hero 1920w, og 1200×630. Semuanya masih usulan, bukan ukuran yang telah disetujui pemilik atau dijamin kode.
  * Putuskan target exact vs batas maksimum, pembesaran, batas tinggi potret, crop, format input, animasi, maxBytes/maxPixels dan kualitas sebelum menerima F0-13. Kelayakan memori hosting harus diukur; estimasi raw pixel bukan hasil benchmark.
* **Key Format:** usulan varian `media/YYYY/MM/{mediaId}/{variant}.webp`, dengan ID/key dibuat server dan prefix dibaca dari record DB yang berizin. Path ini bukan kontrak tipe PK domain atau alasan mempertahankan regex Nanoid sebagai syarat PRD.
* **Sumber sebelum validasi:** tidak boleh tersedia di URL publik. Staging harus benar-benar privat; prefix di bucket publik atau lifecycle setelah 24 jam bukan pengganti isolasi akses. Resource baru/lifecycle/CORS memerlukan persetujuan pemilik dan tidak dikonfigurasi oleh draft ini.
* **Finalisasi:** validasi source otoritatif, proses empat varian, simpan metadata/relasi/audit secara transaksional dengan state finalisasi yang menahan request paralel. Object storage dan DB tidak merupakan satu transaksi; strategi kompensasi harus eksplisit. Jangan menghapus source terlalu dini sebelum hasil tersimpan dengan aman. Commit ambigu diperiksa sebelum cleanup menghapus objek yang mungkin sudah menjadi hasil sah.
* **Retry dan kegagalan:** replay media yang sudah final mengembalikan hasil tersimpan atau konflik yang eksplisit; jangan upload ulang tanpa state/ownership check. Bedakan error validasi, pemrosesan, storage, dan timeout; cleanup gagal dicatat tersanitasi untuk penanganan manual, bukan ditelan diam-diam. Tidak menambah cron aplikasi.
* **Resource pengujian:** akses Neon/R2/hosting/Sentry/backup belum diotorisasi atau dibuktikan oleh F0-05. Pengujian remote berhenti sampai pemilik menyetujui resource disposable dan izin spesifik. Bucket R2 test harus terpisah dari bucket produksi, memakai credential least-privilege; prefix saja bukan isolasi bila credential dapat menulis ke bucket produksi.

Laporan F0-14 dan usulan media menyebut tes yang memakai bucket produksi. Itu adalah klaim penulis, bukan observasi cloud koordinator, dan tidak memenuhi syarat bukti terisolasi. Klaim cleanup/ketiadaan dampak pada objek pemilik belum diverifikasi independen. Jangan mengulang tes, menghapus objek atau merotasi credential dari draft ini; pemilik perlu memverifikasi scope akses dan menyetujui target tes baru.

---

## 6. Konten & Versioning (F0-15, F0-16, F0-17)

* **Blok Rich Text:** Validasi skema Zod per tipe yang benar-benar dipakai, seluruh node/URL/relasi dan versi blok. Jenis blok PRD §4.2 tetap lengkap; Lexical hanya jika kebutuhan prototype telah dibuktikan, bukan otomatis dari usulan interface.
* **Aturan Larangan Teks:** Teks penanda `[ISI]` ditolak keras pada saat publikasi (`publish`).
* **Draft Mode / Preview:** Terikat sesi admin yang sah, tidak dapat diakses publik atau melalui query string sembarangan.
* **Cache & Invalidasi:** Invalidasi tag cache Next.js dieksekusi hanya **setelah** transaksi database berhasil di-commit.

Kontrak konten yang disaring:

1. Draft boleh parsial; validasi penuh `[ISI]`, media/alt/URL dan relasi saat publish. Public read memilih published, waktu tercapai dan belum deleted. Trash memakai `deletedAt`, bukan menambahkan status `archived/trashed` tanpa kontrak baru.
2. Update/publish/restore menulis domain, snapshot tervalidasi dan audit dalam satu transaksi. Restore mengambil versi yang terikat ke resource/ID dan izin saat ini, membuat nomor revisi baru, lalu menjalankan validasi menurut status tujuan. Jangan menyalin kembali field sistem/rahasia/status publish lama secara buta. Strategi konflik versi/locking wajib diuji.
3. DTO owner tetap allowlist. Jangan mengadopsi `OwnerSettingsDTO` sebagai row mentah tanpa penapisan, format referensi generik baru, atau timestamp response WIB: API memakai ISO UTC, WIB hanya presentasi, referensi mengikuti aturan entitas/Lampiran F.
4. Preview token mengikat **sesi admin tertentu**, resource/ID/versi atau scope yang dipilih, expiry dan nonce yang diperlukan. Role token bukan sumber izin. Cocokkan identitas sesi, TOTP dan policy baru pada aktivasi **dan setiap read preview**; cookie Draft Mode aktif saja tidak memberi akses draft lain. Cegah open redirect, token logging/Referer dan cache publik. Usulan JWT/TTL/route belum berarti dependency baru disetujui.
5. Next 16.4.3 mendokumentasikan `revalidateTag(tag, profile)`; contoh satu argumen pada usulan tidak boleh disalin. Pilih `updateTag` pada konteks Server Action yang mendukung atau `revalidateTag` dengan profile/expire tervalidasi. `max` adalah stale-while-revalidate dan bukan jaminan sendiri untuk <=60 detik. Uji unpublish/restore, invalidasi gagal, batas waktu diskon/publish dan isolasi environment tanpa cron aplikasi. Log error tersanitasi, bukan objek error mentah.

---

## 7. Rekonsiliasi temuan F0-04/F0-05

Bagian ini adalah catatan perubahan kontrak pasca-audit. Label “persyaratan” berasal dari PRD atau temuan paket; label “pending” berarti keputusan/bukti belum ada, bukan asumsi bahwa implementasi telah memenuhi.

| Temuan | Penyesuaian kontrak | Status |
|---|---|---|
| Better Auth menghapus sesi awal dan menerbitkan challenge bertanda tangan saat TOTP pending untuk akun yang sudah mengaktifkan faktor | Pisahkan `pending_2fa` (challenge unauthenticated) dari `password_only` (sesi akun yang belum enroll TOTP); keduanya ditolak dari admin, dengan pengecualian alur enrollment terbatas untuk yang kedua. | Persyaratan kontrak; integrasi challenge dan enrollment belum dibuktikan pada Next runtime. |
| Plugin menerima `trustDevice`; opsi yang diaudit tidak menunjukkan cara mematikannya | Trust-device dilarang sampai bypass request langsung tertutup dan diuji. Checkbox UI saja tidak cukup. | Blocker verifikasi API/runtime F0-10/12. |
| Plugin lockout yang ditemukan hanya mencakup verifikasi faktor kedua, bukan password sign-in | Kebijakan 5/15 adalah target aplikasi lintas jalur; konfigurasi plugin bukan bukti cukup. Perlu counter/rate limit atomik dan tes paralel. | Implementasi dan detail counter belum dibuktikan. |
| `name`/`email` muncul pada tabel auth dan profil domain | Draft memilih identitas auth sebagai otoritas dan profil tanpa salinan nama/email. | Bentuk PK/FK, tipe ID, lifecycle dan dampak porting belum final; belum mengizinkan migrasi. |
| “Tanpa email” berpotensi dibaca sebagai login tanpa identifier email | Kontrak membedakan tidak mengirim email dari format identifier Better Auth; username login memerlukan keputusan terpisah. | Jika username dimaksud, keputusan produk masih pending. |
| `ALLOW_DB_MIGRATE=true` meloloskan host remote arbitrer | Boolean saja tidak pernah menjadi otorisasi target. Guard sebelum koneksi harus fail-closed pada identitas host + database + environment/branch yang tepat; target production ditolak oleh jalur migrasi tes. `drizzle.config` dan script migrasi harus memakai perlindungan setara. | Temuan F0-05 terkonfirmasi dengan URI sintetis; kode belum diperbaiki dan tak ada koneksi DB. |
| Neon, R2, hosting, Sentry dan backup belum memiliki izin/bukti target disposable | Tidak menjalankan akses cloud, migrasi, upload, backup/restore atau cleanup sampai identitas target, izin dan batas biaya/penghapusan disetujui. | Blocker eksternal; bukan bukti lulus N-03/N-04/N-08/N-10. |
| Nama migrasi dalam laporan F0-08 berbeda dari nama yang ditemukan F0-05 | Cocokkan dokumen dengan direktori aktual dan migrasi yang pernah diterapkan sebelum ada operasi; jangan rename, rollback atau jalankan migration dalam rekonsiliasi ini. | Perlu verifikasi reviewer; tidak ada operasi DB. |

## 8. Keputusan dan bukti yang masih dibutuhkan

| ID | Yang belum final | Penanggung jawab / syarat |
|---|---|---|
| K-01 | Tipe ID domain/profil, PK/FK auth dan lifecycle | Koordinator + penulis DB, sesuai PRD; akun existing/retensi/porting memerlukan persetujuan pemilik. Jangan mengedit migration lama. |
| K-02 | API hook/façade assurance, lockout atomik, revocation dan backup-code | Penulis auth/DB membuktikan API versi terkunci. Flow recovery-only tambahan perlu keputusan, bukan asumsi dukungan paket. |
| K-03 | Pembatasan write Settings tambahan di luar WhatsApp/Tracking | Pemilik/koordinator memutuskan daftar field; larangan tambahan pada usulan belum menjadi policy resmi. |
| K-04 | Profil media: exact/max, upscale/crop, dimensi, byte/piksel, format/animasi | Pemilik menyetujui profil usulan setelah rekomendasi teknis; penulis media membuktikan output dan performa. Tidak mengklaim aman 512 MB sebelum ukur. |
| K-05 | Baseline dan target resource terisolasi | F0-00, izin target DB/bucket staging/tes, biaya dan cleanup yang spesifik. Persetujuan resource lain tidak otomatis mengesahkan bucket produksi untuk tes. |
| K-06 | File ownership persis, route proof-of-concept, signature dan test IDs gabungan | Koordinator mengalokasikan setelah kontrak final; penulis DB tunggal, file bersama tidak ditulis paralel. |

Ketentuan PRD dan koreksi faktual sudah dapat dipakai untuk menilai usulan, tetapi **F0-06 tetap TERBLOKIR** sampai pilihan/bukti di atas diselesaikan dan konsumen menyetujui satu kontrak. Konsolidasi ini tidak mengubah source/schema/migrasi, mengesahkan runtime, atau mengotorisasi koneksi cloud.
