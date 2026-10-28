# Usulan Rekonsiliasi Auth dan Database Fase 0

Tanggal: 28 Oktober 2026  
Status: **DRAFT USULAN REVIEW**, bukan kontrak final dan bukan bukti F0-08/F0-10 selesai  
Acuan: `PRD_v1_5.md`, `RENCANA_IMPLEMENTASI_PRD_1_5.md`, `docs/fase-0/kontrak.md` versi `1.0.1-draft`, laporan F0-04/F0-05/F0-08/F0-10, `src/auth/**`, `src/db/**`, `scripts/db-*`, dan Better Auth `1.7.14` yang terpasang  
Batas: review ini tidak mengubah source/schema/migrasi, tidak membuka koneksi database, dan tidak menjalankan migrasi.

---

## 1. Putusan ringkas

| Area | Usulan keputusan |
|---|---|
| Identitas | `auth_user` adalah sumber otoritatif `id`, `name`, dan `email`. Tabel domain `users` hanya merupakan profil otorisasi 1:1 yang menyimpan `auth_user_id` dan `role`, tanpa salinan `name`/`email`. |
| Relasi auth-profil | Gunakan `users.auth_user_id` sebagai primary key sekaligus foreign key ke `auth_user.id`. Hilangkan ID profil kedua agar `Actor.userId`, audit, dan relasi domain selalu berarti ID auth yang sama. |
| Role | `users.role` adalah satu-satunya sumber role `owner | editor`. Role tidak disimpan pada `auth_user`, sesi, cookie, atau input browser. |
| Enrollment | Sesi password valid untuk user yang belum enroll diberi assurance `password_only`, berumur pendek, dan hanya boleh mengakses endpoint enrollment serta logout. Selesai enrollment mencabut seluruh sesi user dan mewajibkan login baru. |
| Pending 2FA | Untuk user dengan TOTP aktif, hasil password benar adalah challenge tanpa sesi. Cookie `two_factor` bukan sesi dan tidak memiliki hak admin. |
| Bukti faktor per sesi | Akses admin memerlukan baris `auth_session` yang memiliki assurance faktor kedua dan waktu verifikasi. `auth_user.two_factor_enabled` hanya status akun, bukan bukti sesi. |
| Lockout | Satu state lockout aplikasi per principal dikenal, dipakai bersama oleh kegagalan password dan TOTP. Mutasi counter harus berupa upsert atomik; kegagalan kelima mengunci 15 menit. Reset hanya setelah autentikasi faktor kedua selesai atau recovery terotorisasi. |
| Trusted device | Seluruh input `trustDevice=true` ditolak di server. Request sign-in yang membawa cookie trusted-device juga ditolak dan cookie dihapus. Tidak cukup menyembunyikan opsi UI. |
| Pencabutan | Baris sesi adalah sumber validitas. Cookie cache/secondary storage sesi tidak boleh membuat sesi hidup setelah baris DB dihapus. Reset password/TOTP, recovery, disable user, dan selesai enrollment mencabut seluruh sesi serta challenge terkait. |
| Nama migrasi | Baseline lokal yang konsisten adalah `0000_magenta_iron_patriot`: nama SQL dan tag jurnal sama. `0000_luxuriant_drax.sql` hanya muncul di F0-08 dan tidak boleh dibuat/di-rename tanpa pemeriksaan ledger database. |
| Guard DB | Hapus konsep izin remote universal `ALLOW_DB_MIGRATE=true`. Setiap command harus memilih target bernama dengan host, port, database, user, kelas environment, SSL, dan Neon endpoint/branch yang exact; verifikasi ulang identitas setelah connect tetapi sebelum mutasi. |

Keputusan di atas menutup pilihan arsitektur untuk draft F0-06. Implementasi dan penerimaan tetap menunggu review koordinator, penulis DB tunggal, target disposable yang disetujui, serta tes nyata.

---

## 2. Sumber identitas otoritatif dan relasi auth-profil

### 2.1 Pembagian kepemilikan data

| Data | Sumber otoritatif | Aturan |
|---|---|---|
| ID user, nama, email | `auth_user` | Ditulis hanya melalui service auth/admin-user. Email dinormalisasi dengan aturan Better Auth dan unik di DB. |
| Password/hash dan provider account | `auth_account` | Tidak pernah disalin ke profil domain. |
| TOTP secret, backup codes, status faktor | `auth_two_factor` dan flag Better Auth yang diperlukan | Secret/recovery material tidak masuk DTO, audit, atau log. |
| Sesi | `auth_session` | Validitas, expiry, dan assurance per sesi dibaca dari server/DB. |
| Role | `users.role` | Hanya `owner` yang boleh mengubahnya melalui service berizin dan audit. |
| Nama/email historis pada audit | snapshot event `audit_logs.actor_email` | Boleh didenormalisasi sebagai fakta pada waktu event, tetapi tidak boleh dibaca sebagai profil aktif. |

### 2.2 Bentuk relasi yang dibekukan sebagai usulan

```text
auth_user
  id PK
  name
  email UNIQUE
  ...field Better Auth...
       1
       │ FK ON DELETE CASCADE
       1
users
  auth_user_id PK
  role CHECK (role IN ('owner', 'editor'))
  created_at
  updated_at
```

Aturan relasi:

1. `users` tidak memiliki `id`, `name`, atau `email` sendiri.
2. `users.auth_user_id` adalah PK dan FK. Bentuk ini menegakkan tepat paling banyak satu profil per identitas tanpa unique constraint kedua.
3. `Actor.userId` selalu berisi `auth_user.id`, baik pada state `password_only` maupun `authenticated`.
4. Profil tidak ada berarti default deny. Identitas Better Auth yang sah tidak otomatis menjadi admin.
5. Role selalu dibaca dari DB pada request berizin. Role dari form, cookie, session payload klien, atau parameter action diabaikan.
6. Read model admin melakukan join/proyeksi dari `auth_user` dan `users`; tidak ada sinkronisasi dua arah nama/email karena salinannya tidak ada.
7. Update nama/email hanya menulis `auth_user` melalui service. Mutasi role hanya menulis `users` melalui service yang berbeda dan diaudit.
8. Penghapusan identitas boleh menghapus profil melalui cascade, tetapi audit historis tidak ikut terhapus. Kebijakan penghapusan akun dan retensi audit tetap memerlukan persetujuan pemilik sebelum implementasi.

### 2.3 Alasan memilih `auth_user`

- PRD §2.2 menyatakan Better Auth mengelola identitas/sesi/akun/verifikasi dan melarang duplikasi data identitas.
- Better Auth memerlukan `name` dan `email` pada model user untuk alur email/password dan URI TOTP.
- Kode saat ini membuat makna `Actor.userId` berubah: `password_only` memakai `auth_user.id`, sedangkan `authenticated` memakai `users.id`. Menggunakan satu ID menghilangkan ambiguitas itu.
- Role adalah concern domain/otorisasi, sehingga tetap berada di `users`, bukan di model auth atau browser.

---

## 3. State auth dan pembuktian faktor per sesi

### 3.1 State yang harus dibedakan

| State | Artefak server | Hak |
|---|---|---|
| `anonymous` | Tidak ada sesi valid | Hanya kebijakan publik. |
| `password_only` | Ada `auth_session` dengan assurance `password_only`; user belum memiliki TOTP verified | Endpoint enrollment terpilih dan logout saja. Seluruh admin/service privat ditolak. |
| `pending_2fa` | Cookie challenge bertanda tangan + record `auth_verification`; tidak ada `auth_session` | Diperlakukan seperti anonymous untuk otorisasi. Hanya endpoint verifikasi faktor/challenge cancel. |
| `recovery_only` | Backup code sekali pakai menghasilkan sesi terbatas dengan assurance `recovery_only` | Hanya reset/re-enroll faktor dan logout. Tidak boleh membuka admin. |
| `authenticated` | `auth_session` aktif dengan assurance `aal2`, `second_factor_verified_at` terisi, profil ada, faktor akun masih verified | Policy role/resource/operation/field berlaku. |

`pending_2fa` tidak perlu menjadi varian `Actor` yang diteruskan ke service. Boundary request boleh mencatat alasan penolakan internal, tetapi policy menerima `anonymous` karena challenge bukan identitas terautentikasi.

### 3.2 Bukti yang wajib berada pada sesi

Schema final perlu menyediakan additional fields Better Auth pada `auth_session`, dengan nama final ditetapkan penulis DB:

| Field konseptual | Tipe/aturan | Tujuan |
|---|---|---|
| `assurance_level` | text not null, default `password_only`, check `password_only | recovery_only | aal2` | Fail closed untuk setiap sesi baru yang tidak secara eksplisit lahir dari verifikasi faktor. |
| `second_factor_verified_at` | timestamptz nullable | Bukti waktu faktor kedua diselesaikan untuk sesi tersebut. |
| `second_factor_method` | text nullable, check `totp | backup_code` | Membedakan TOTP normal dari recovery. Backup code tidak otomatis memberi hak admin. |

Constraint konseptual:

- `assurance_level='aal2'` hanya valid jika `second_factor_verified_at IS NOT NULL` dan `second_factor_method='totp'`.
- `password_only` tidak boleh memiliki waktu/metode faktor.
- Field assurance bersifat `input: false` dan `returned: false` pada konfigurasi Better Auth. Browser tidak boleh dapat menulis atau membacanya melalui endpoint generik.

Resolver admin harus memerlukan seluruh kondisi berikut:

1. token sesi valid, belum kedaluwarsa, dan baris sesi masih ada;
2. `auth_session.assurance_level='aal2'` dan waktu faktor terisi;
3. `auth_user.two_factor_enabled=true`;
4. tepat satu `auth_two_factor` milik user dengan `verified=true`;
5. profil `users` ada dengan role valid;
6. policy resource, operation, dan field mengizinkan.

Flag `two_factor_enabled` tidak cukup. Pada Better Auth 1.7.14, verifikasi enrollment mengganti sesi aktif, tetapi sesi password-only lain milik user dapat tetap ada. Setelah flag global berubah menjadi true, resolver saat ini akan salah menganggap sesi lama tersebut sudah lolos TOTP.

### 3.3 Alur enrollment

1. Akun dibuat melalui service/CLI terkontrol: identitas auth dan profil role ditulis dalam satu transaksi aplikasi yang diaudit, tanpa password/secret di log.
2. Password sign-in untuk user dengan TOTP belum aktif membuat sesi `password_only` berumur maksimum **15 menit**.
3. Saat sesi enrollment dibuat, sesi enrollment lama untuk user yang sama dicabut agar hanya ada satu alur enrollment aktif.
4. Allowlist sesi ini hanya:
   - membaca status enrollment minimal milik sendiri;
   - `two-factor/enable` untuk TOTP;
   - `two-factor/verify-totp` dalam mode enrollment;
   - logout/cancel.
5. Endpoint disable, update user umum, daftar sesi, admin, content, media, preview, dan service domain ditolak.
6. Setelah kode enrollment valid, faktor ditandai verified, seluruh sesi user dicabut, challenge enrollment dibersihkan, dan user diminta login ulang.
7. Login ulang menjalani password lalu challenge TOTP normal. Hanya sesi baru dari challenge ini yang diberi `aal2`.

Mewajibkan login ulang setelah enrollment sengaja dipilih agar sesi enrollment tidak perlu dipromosikan menjadi sesi admin dan agar semua sesi password-only lama pasti mati.

### 3.4 Alur challenge user yang sudah enroll

Perilaku paket 1.7.14 yang telah dibaca:

- sesudah password benar, plugin menghapus session awal dan cookie session;
- plugin membuat record challenge dan cookie `two_factor` bertanda tangan;
- default umur challenge 600 detik;
- TOTP valid mengonsumsi challenge lalu membuat session baru;
- body verifikasi menerima `trustDevice` kecuali aplikasi menolaknya.

Kontrak aplikasi:

1. Set `twoFactorCookieMaxAge` eksplisit ke **600 detik**, jangan bergantung pada default tak tertulis.
2. Challenge tidak menghasilkan `Actor` admin dan tidak dapat dipakai pada `/admin/*`, Server Action, preview, upload, atau service privat.
3. Maksimum satu challenge aktif per user/per login. Membuat challenge baru membatalkan challenge sebelumnya.
4. Challenge dikonsumsi tepat sekali. Replay, challenge kedaluwarsa, cookie tanpa record, atau record tanpa cookie ditolak dengan respons generik.
5. Setelah TOTP benar, session baru harus ditulis sejak awal dengan assurance `aal2`, bukan dipromosikan oleh browser.
6. Jika penandaan assurance gagal, session yang baru dibuat wajib dicabut dan cookie dihapus sebelum response sukses.
7. Implementasi harus memakai hook/database hook yang terverifikasi pada Better Auth 1.7.14. Bila API hook tidak dapat menjamin penandaan sebelum response, route paket tidak boleh diekspos langsung dan perlu façade server yang fail closed.

### 3.5 Backup code dan OTP

- OTP email/SMS tidak dipakai karena produk tidak memiliki layanan pengiriman email/SMS untuk auth.
- `/two-factor/verify-otp` ditolak eksplisit, bukan hanya dibiarkan gagal karena callback tidak ada.
- Backup codes yang dibuat paket tetap rahasia dan encrypted. Verifikasi backup code hanya menghasilkan `recovery_only`; user wajib reset/re-enroll TOTP dan login ulang sebelum admin.
- Recovery owner F0-11 tetap dapat mencabut seluruh session dan faktor melalui CLI terkontrol jika backup codes hilang. Kedua jalur wajib diaudit tanpa menyimpan atau menampilkan ulang secret.

---

## 4. Lockout atomik 5/15

### 4.1 Semantik yang diusulkan

1. Budget user dikenal dipakai bersama oleh kegagalan password dan kegagalan TOTP.
2. Jendela hitung dimulai pada kegagalan pertama. Jika 15 menit berlalu tanpa lock, kegagalan berikutnya membuka jendela baru dengan count 1.
3. Kegagalan ke-5 dalam jendela mengatur `locked_until = now + 15 menit` dan request itu tetap gagal.
4. Saat terkunci, password, TOTP, backup-code, enrollment, dan penerbitan sesi baru ditolak dengan pesan generik.
5. Password benar yang baru menghasilkan `pending_2fa` tidak mereset counter. Reset hanya setelah TOTP sukses dan sesi `aal2` berhasil diterbitkan.
6. Selesai enrollment boleh mereset counter setelah faktor verified dan seluruh sesi lama dicabut.
7. Lock yang kedaluwarsa dibersihkan secara atomik pada percobaan berikutnya. Tidak perlu cron.
8. Recovery terotorisasi dapat membuka lock, tetapi harus mencabut sesi/challenge dan menulis audit tanpa secret.

### 4.2 State persisten

Gunakan tabel aplikasi terpisah, misalnya `auth_attempt_state`, bukan `Map` proses:

| Field konseptual | Aturan |
|---|---|
| `principal_key` | PK. User dikenal memakai key stabil berbasis `auth_user.id`; user tidak dikenal memakai HMAC identifier ternormalisasi. Tidak menyimpan email/IP mentah. |
| `auth_user_id` | nullable FK untuk principal dikenal; unique bila terisi. |
| `window_started_at` | timestamptz not null. |
| `failed_count` | integer not null, check `>= 0`. |
| `locked_until` | timestamptz nullable. |
| `updated_at` | timestamptz not null. |

Percobaan untuk email yang tidak ada tetap memakai respons dan jalur waktu yang setara, ditambah rate limit IP terpisah. State dummy tidak boleh mengungkap apakah akun ada.

### 4.3 Mutasi atomik dan concurrency

- Catat kegagalan dengan satu `INSERT ... ON CONFLICT DO UPDATE ... RETURNING`, atau transaksi row-lock yang ekuivalen. Jangan melakukan pola read-increment-write di aplikasi.
- Statement membedakan tiga keadaan: lock masih aktif, jendela sudah lewat lalu reset ke 1, atau increment dalam jendela aktif.
- Transisi pertama ke locked dan insert audit `auth.lockout` harus berada pada transaksi yang sama agar hanya satu event lock dibuat.
- Setiap kegagalan paralel dihitung tepat satu kali. Tes concurrency harus membuktikan tidak ada lost update.
- Tepat sebelum session diterbitkan, lock diperiksa lagi. Jika request benar berjalan bersamaan dengan kegagalan kelima, session yang telanjur dibuat oleh paket harus dicabut dan response autentikasi ditolak.
- Challenge aktif milik user dibatalkan saat lock mulai berlaku.

### 4.4 Integrasi dengan Better Auth

Better Auth 1.7.14 mempunyai lockout account TOTP atomik sendiri, default 10 kegagalan/900 detik, tetapi tidak melindungi password sign-in dan bukan counter gabungan. Konfigurasi saat ini juga tidak mengubah default tersebut.

Usulan sumber tunggal:

1. state aplikasi di atas menjadi keputusan lockout otoritatif lintas password/TOTP;
2. seluruh endpoint credential/factor masuk melalui hook/façade yang sama;
3. `accountLockout` plugin hanya boleh dinonaktifkan setelah tes membuktikan semua route langsung dimediasi. Sebelum itu, mempertahankannya adalah defense-in-depth, bukan bukti kontrak 5/15;
4. counter challenge hardcoded paket tetap menjadi batas lokal challenge, tetapi tidak menggantikan state akun aplikasi.

Jika Better Auth 1.7.14 tidak menyediakan hook outcome yang cukup untuk mencatat password/TOTP gagal dan memblokir penerbitan session secara konsisten, itu adalah ketidakcocokan dependency yang harus dibawa ke keputusan F0-07. Jangan menggantinya dengan lockout memory lokal.

---

## 5. Penolakan trusted-device

Paket menerima `trustDevice` pada verifikasi TOTP, OTP, dan backup code. Saat true, paket membuat cookie `trust_device` serta record verification, lalu sign-in berikutnya dapat melewati challenge TOTP. Opsi plugin yang diaudit tidak menyediakan `disableTrustDevice`.

Kontrol wajib:

1. Tolak body dengan `trustDevice=true` pada:
   - `/two-factor/verify-totp`;
   - `/two-factor/verify-otp`;
   - `/two-factor/verify-backup-code`.
2. Jangan sekadar mengganti true menjadi false tanpa audit. Request harus gagal agar client tidak mengira device dipercaya.
3. Sebelum alur sign-in berjalan, request yang membawa cookie trusted-device ditolak, response menghapus cookie, dan record verification terkait dicabut bila dapat diidentifikasi dengan aman.
4. Bersihkan record legacy ber-prefix trusted-device pada recovery/reset terkontrol. Jangan menghapus record verification dengan wildcard tanpa scope user/target yang terbukti.
5. UI tidak menampilkan checkbox, tetapi kontrol server tetap menjadi otoritas.
6. Uji request langsung harus mencakup cookie valid lama, cookie forged, `trustDevice=true`, false, tidak ada field, dan seluruh endpoint faktor.

Hook ordering harus dibuktikan. Mengirim header `Set-Cookie` expired saja tidak menghapus cookie dari request yang sedang diproses; sign-in itu sendiri harus dihentikan sebelum hook two-factor membaca cookie.

---

## 6. Pencabutan sesi dan challenge

### 6.1 Invariant

- Baris `auth_session` adalah sumber validitas. Tidak ada session JWT stateless yang tetap sah setelah row dihapus.
- Session cookie cache dan secondary storage dinonaktifkan sampai mekanisme invalidasi konsisten dibuktikan.
- Setiap request admin memeriksa sesi secara otoritatif, assurance per sesi, faktor akun, profil, dan role.
- Pencabutan bersifat idempotent: menghapus sesi/challenge yang sudah tidak ada tetap sukses tanpa membuat data baru.

### 6.2 Matriks pencabutan

| Event | Sesi saat ini | Sesi lain user | Challenge 2FA | Trusted-device record |
|---|---:|---:|---:|---:|
| Logout biasa | Cabut | Pertahankan | Cabut milik flow saat ini | Hapus cookie browser; record boleh dipertahankan hanya jika fitur diizinkan, tetapi fitur ini ditolak sehingga cabut |
| Enrollment TOTP selesai | Cabut | Cabut semua | Cabut semua user | Cabut semua user |
| Password berubah/reset | Cabut | Cabut semua | Cabut semua user | Cabut semua user |
| TOTP reset/disable/re-enroll | Cabut | Cabut semua | Cabut semua user | Cabut semua user |
| Recovery owner/CLI | Cabut | Cabut semua | Cabut semua user | Cabut semua user |
| User dinonaktifkan/dihapus | Cabut | Cabut semua | Cabut semua user | Cabut semua user |
| Role berubah | Cabut | Cabut semua | Cabut semua user | Tidak relevan, tetap dibersihkan bila ada |
| Lockout login | Tidak otomatis mencabut sesi `aal2` yang sudah aktif | Pertahankan | Cabut challenge login aktif | Cabut legacy record agar tidak menjadi bypass |

Role dibaca per request, tetapi perubahan role tetap mencabut sesi agar perubahan privilege tidak menyisakan request lama atau cache.

---

## 7. Rekonsiliasi migrasi

### 7.1 Fakta baseline lokal

| Artefak | Nilai yang ditemukan |
|---|---|
| SQL | `src/db/migrations/0000_magenta_iron_patriot.sql` |
| Journal | tag `0000_magenta_iron_patriot` |
| Snapshot | `src/db/migrations/meta/0000_snapshot.json` |
| F0-08 | menyebut `0000_luxuriant_drax.sql`, file tidak ada |
| F0-05 dan kontrak §7 | sudah mencatat perbedaan dan melarang rename/run tanpa verifikasi |

Nama canonical untuk baseline lokal adalah **`0000_magenta_iron_patriot`** karena SQL dan journal konsisten. Laporan F0-08 harus diberi koreksi dokumentasi setelah review, bukan membuat file bernama `luxuriant`.

### 7.2 Prosedur sebelum operasi database apa pun

1. Bekukan hash SHA-256 SQL, journal, dan snapshot pada review.
2. Cari riwayat Git/artefak penulis untuk menentukan apakah `luxuriant` pernah benar-benar ada. Tidak ditemukan di working tree saat review ini.
3. Dengan izin read-only pada target yang tepat, baca ledger Drizzle dan inventaris schema yang sudah ada. Jangan mengasumsikan reset file berarti reset DB.
4. Cocokkan urutan/timestamp/hash ledger dengan artefak lokal. Nama file saja bukan bukti migrasi yang sama.
5. Jika target pernah menerima migration lain atau schema CMS lama, hentikan. Buat porting/baseline plan, jangan edit journal agar terlihat cocok.
6. Jangan rename migration yang mungkin sudah pernah diterapkan. Perubahan schema berikutnya harus migration baru expand/contract dari baseline yang telah disetujui.

### 7.3 Nama fisik yang perlu diselaraskan di kontrak

Kontrak saat ini menulis `auth_users`, `auth_sessions`, `auth_accounts`, `auth_verifications`, dan `auth_two_factors`, sedangkan schema/migration memakai `auth_user`, `auth_session`, `auth_account`, `auth_verification`, dan `auth_two_factor`.

Usulan: kontrak memakai nama fisik singular yang sudah konsisten di schema, migration, dan mapping adapter. Perubahan ke plural tidak memberi manfaat keamanan dan berisiko menjadi rename migration. Keputusan ini tetap tunduk pada pemeriksaan target DB sebelum migration final.

---

## 8. Guard target database yang eksplisit

### 8.1 Kekurangan guard saat ini

`assertSafeDatabaseTarget` saat ini:

- mengizinkan semua host remote saat `ALLOW_DB_MIGRATE=true`;
- mengizinkan database apa pun pada localhost, termasuk database pemilik yang di-forward ke port lokal;
- tidak memeriksa protocol PostgreSQL, port, nama database, user, SSL, environment, endpoint/branch Neon, atau jenis command;
- tidak melakukan verifikasi identitas setelah koneksi;
- tidak dipakai oleh `drizzle.config.ts`;
- membiarkan migrator fallback dari URI direct ke URI pooled runtime.

### 8.2 Descriptor target

Setiap target harus memiliki ID dan descriptor non-rahasia yang disetujui:

```text
targetId
environment        local-test | local-dev | neon-test | staging | production
hostname           exact, tanpa wildcard
port               exact
database           exact
user               exact role migrator
sslMode             aturan exact; remote wajib TLS
neonEndpointId      exact bila Neon
neonBranchId/name   exact bila tersedia dari konfigurasi yang disetujui
allowedCommands     check | migrate | restore-verify
destructive         false secara default
```

Connection string tetap berasal dari secret environment, tetapi harus cocok dengan descriptor. Descriptor bukan pengganti credential dan tidak boleh berisi password.

### 8.3 Guard dua tahap

**Tahap A, sebelum koneksi:**

1. Command wajib menerima `targetId`; tidak ada target default untuk remote.
2. Pilih satu env URI khusus command. Migrasi hanya menerima direct URI dan tidak fallback ke `DATABASE_URI` pooled.
3. Parse URI dan wajibkan protocol `postgres:`/`postgresql:`.
4. Bandingkan hostname, port efektif, database pathname yang sudah didecode, username, TLS, endpoint ID, environment, dan command dengan descriptor exact.
5. Tolak query option yang mengubah target/schema/search path di luar allowlist.
6. `check`/tes hard-deny production. Migrasi production hanya lewat target production terdaftar dan protected release environment yang disetujui pemilik.
7. Error dan log hanya menampilkan descriptor redacted, tidak pernah URI/password.

**Tahap B, setelah koneksi tetapi sebelum DDL/migrator:**

1. Buka koneksi direct dengan timeout ketat.
2. Query read-only `current_database()`, `current_user`, current schema/search path, dan identitas server yang tersedia.
3. Cocokkan ulang dengan descriptor. Mismatch berarti disconnect tanpa memanggil migrator.
4. Baca ledger migration dan bandingkan dengan baseline yang diharapkan.
5. Ambil PostgreSQL advisory lock khusus migration target agar dua runner tidak berjalan bersamaan.
6. Baru setelah seluruh check lulus, panggil Drizzle migrator.

Boolean konfirmasi boleh dipakai sebagai acknowledgement tambahan di production, tetapi tidak pernah menggantikan pencocokan descriptor exact.

### 8.4 Kontrak command

- `db:generate`: tidak membuka database; hanya generate migration untuk direview.
- `db:check`: pada target disposable yang disetujui, membuktikan migrate dari kosong, run ulang migrator, schema/constraint, dan ledger. Script saat ini belum melakukan ini.
- `db:migrate`: direct URI saja, descriptor exact, preflight, post-connect identity, ledger check, advisory lock, lalu migrate.
- `drizzle.config.ts`: tidak boleh memiliki fallback ke pooled URI. Command yang dapat memutasi DB harus melalui resolver/guard yang sama atau tidak diekspos.
- Restore verification memakai target baru/kosong dengan descriptor sendiri. Tidak boleh menimpa database existing.

---

## 9. Daftar ketidaksesuaian kode dan dokumen

### 9.1 P0, memblokir F0-08/F0-10

| ID | Ketidaksesuaian | Bukti saat ini | Perbaikan yang diperlukan |
|---|---|---|---|
| A-01 | Identitas diduplikasi | `auth_user` dan `users` sama-sama menyimpan `name`/`email` | Terapkan model §2; migration baru setelah target DB/porting disetujui. |
| A-02 | Makna `Actor.userId` berubah antar-state | `password_only` memakai auth ID; `authenticated` memakai `users.id` | Gunakan auth ID tunggal dan profil PK/FK yang sama. |
| A-03 | Bukti TOTP hanya flag global user | `getActorFromRequest` hanya memeriksa `authUser.twoFactorEnabled` | Tambah assurance per sesi dan cek `auth_two_factor.verified`. |
| A-04 | Sesi password-only lain dapat mewarisi flag enrollment | Paket mengganti hanya sesi enrollment aktif, sementara flag user berlaku global | Cabut seluruh sesi saat enrollment selesai dan wajibkan login baru. |
| A-05 | Resolver auth tidak dipakai boundary mana pun | Graph/source tidak menemukan caller aplikasi atau route auth | Tambah route/facade dan `requireAdminSession` pada seluruh boundary saat F0-10 dibuka. |
| A-06 | Tidak ada route Better Auth | `src/app/api/auth/**` tidak ada | Integrasikan handler hanya setelah hook/allowlist keamanan siap. |
| A-07 | Lockout memory lokal, non-atomik, dan tidak terhubung | `Map` process-global; hanya unit test memanggilnya | Ganti dengan state DB atomik dan integrasikan ke password/TOTP direct routes. |
| A-08 | Plugin masih memakai default lockout TOTP 10/900 | `twoFactor({ issuer })` tanpa `accountLockout` | Tetapkan sumber lockout tunggal dan buktikan integrasi. |
| A-09 | Trusted device terbuka pada request langsung | Tidak ada hook penolak; paket menerima `trustDevice` | Terapkan §5 pada semua endpoint dan cookie. |
| A-10 | Tidak ada enrollment/recovery/revocation/audit auth | `src/auth` hanya config, resolver, dan manager memory | Implementasikan service/flow setelah kontrak/schema disetujui. |
| D-01 | Guard remote adalah boolean universal | `ALLOW_DB_MIGRATE=true` menerima host remote apa pun | Ganti descriptor exact dan guard dua tahap. |
| D-02 | Migrator dapat memakai pooled runtime URI | `DIRECT || DATABASE_URI` | Direct-only tanpa fallback untuk migration. |
| D-03 | Drizzle config melewati guard | URL dibaca langsung di `drizzle.config.ts` | Resolver target yang sama atau batasi config hanya untuk generate. |
| D-04 | `db:check` bukan database/schema check | Hanya menghitung SQL dan menguji satu URI sintetis | Uji migration kosong/ulang, ledger, schema, FK/check/index pada target disposable. |
| D-05 | Nama migration laporan salah | F0-08 `luxuriant`; file+journal `magenta` | Koreksi laporan setelah ledger/histori ditinjau; jangan rename. |
| D-06 | Target DB existing belum direkonsiliasi | Reset kode tidak mereset DB; tidak ada ledger yang dibaca | Porting/baseline plan sebelum migration apa pun. |

### 9.2 P1, wajib sebelum penerimaan fondasi

| ID | Ketidaksesuaian | Dampak |
|---|---|---|
| A-11 | `auth_two_factor.user_id` tidak unique | Lebih dari satu row faktor per user mungkin terjadi, sedangkan resolver paket memakai `findOne`. |
| A-12 | `users.role` hanya enum TypeScript, tanpa CHECK SQL | Nilai role arbitrer dapat ditulis lewat SQL/bug service. |
| A-13 | `two_factor_enabled`, `verified`, dan counter dapat nullable | Tiga-state boolean/counter memperumit default-deny dan lockout. Nullability final harus sesuai API paket dan invariant aplikasi. |
| A-14 | Cookie/origin/session lifetime tidak dibekukan eksplisit | Kode hanya mengatur `useSecureCookies` produksi; klaim `httpOnly/sameSite/origin/session` belum diuji runtime. |
| A-15 | `catch` resolver mengubah semua error menjadi anonymous | Gangguan DB/auth tidak dapat dibedakan dari tidak login dan observability hilang. Respons klien boleh aman, tetapi error internal perlu tercatat tersanitasi. |
| A-16 | Tidak ada status disable/activation profil yang diperiksa | User yang profilnya masih ada selalu dianggap aktif. Lifecycle akun perlu kontrak sebelum panel manajemen user. |
| A-17 | Backup-code dapat menghasilkan sesi biasa pada paket | Bertentangan dengan TOTP wajib bila tidak dipetakan ke recovery-only atau diblokir. |
| D-07 | Kontrak memakai nama tabel plural, kode singular | Dokumentasi dan migration tidak mempunyai nama fisik yang sama. |
| D-08 | Kontrak audit menyebut `payload`, schema memakai `diff` | Konsumen DTO/service tidak mempunyai nama field stabil. |
| D-09 | Migration tidak memiliki CHECK role dan index FK yang ditinjau | Integritas role serta performa join/session belum dibuktikan. |
| D-10 | `db-check` bergantung pada state `ALLOW_DB_MIGRATE` proses | Jika env sudah true, self-test remote-deny dapat berperilaku berbeda; test harus mengisolasi env. |
| D-11 | Append-only audit baru berupa klaim dokumen | Schema hanya mendefinisikan tabel; tidak ada service/privilege/trigger yang menolak `UPDATE` dan `DELETE`. F0-08 tidak boleh menyebut append-only sebagai hasil teruji. |
| D-12 | `audit_logs.actor_id` tidak memiliki relasi dan maknanya ambigu | Kontrak membolehkan ID domain atau auth. Setelah model §2 dipilih, gunakan auth ID yang sama dan tetapkan perilaku retensi saat user dihapus. |

### 9.3 Ketidaksesuaian klaim laporan

- F0-04 dan F0-05 secara umum sudah mencatat blocker yang benar dan tidak mengklaim runtime lulus.
- F0-08 berstatus usulan `SELESAI`, tetapi nama migration salah, guard belum exact, `db:check` belum menguji DB, dan migration target belum direkonsiliasi. Status resmi di rencana tetap `TERBLOKIR`.
- F0-10 berstatus usulan `SELESAI`, tetapi lockout hanya manager memory yang tidak dipanggil, resolver belum membuktikan faktor per sesi, tidak ada route/enrollment/trusted-device/revocation/audit, dan tes hanya memeriksa object config serta manager lokal. Status resmi tetap `TERBLOKIR`.
- Kontrak `1.0.1-draft` sudah mengidentifikasi sebagian besar blocker, tetapi belum memilih identitas, bukti assurance sesi, counter lockout, nama tabel fisik, atau bentuk guard executable.

---

## 10. Tes yang diperlukan

Tes di bawah belum dijalankan oleh review ini.

### 10.1 Unit dan contract test

1. **ID-01:** schema hanya memiliki `name`/`email` pada `auth_user`; profil hanya auth ID + role/lifecycle.
2. **ID-02:** `Actor.userId` sama pada password-only dan authenticated untuk user yang sama.
3. **ID-03:** role invalid ditolak DB; role dari body/cookie diabaikan.
4. **SES-01:** sesi default selalu `password_only`; browser tidak dapat mengirim field assurance.
5. **SES-02:** resolver menolak kombinasi null/invalid assurance, faktor tidak verified, profil hilang, role invalid, expired/revoked session.
6. **LOCK-01:** kegagalan 1-4 tidak lock; kegagalan ke-5 lock tepat 900 detik; expiry membuka window baru.
7. **LOCK-02:** password success tanpa TOTP tidak mereset budget; TOTP success + session `aal2` mereset.
8. **LOCK-03:** clock diinjeksi pada test, bukan `Date.now()` global tanpa kontrol.
9. **DB-GUARD-01:** protocol, host, port, database, user, SSL, endpoint ID, environment, dan command mismatch masing-masing ditolak sebelum connect.
10. **DB-GUARD-02:** localhost dengan database salah, tunnel localhost, encoded pathname, IPv6, query `search_path`, pooled host, dan URI malformed ditolak.
11. **MIG-01:** SQL basename, journal tag, snapshot, dan content hash konsisten.

### 10.2 Integration test auth dengan PostgreSQL disposable

1. **AUTH-INT-01:** akun tanpa faktor login password mendapat satu sesi enrollment 15 menit dan tidak dapat membaca/mutasi admin.
2. **AUTH-INT-02:** buat dua sesi password-only, enroll lewat salah satu, lalu buktikan keduanya dicabut dan login baru diwajibkan.
3. **AUTH-INT-03:** user enrolled + password benar menghasilkan challenge tanpa row session/cookie session yang berhak.
4. **AUTH-INT-04:** TOTP valid mengonsumsi challenge dan menghasilkan row session `aal2` dengan waktu/metode faktor; TOTP salah tidak menghasilkan sesi.
5. **AUTH-INT-05:** ubah hanya `two_factor_enabled=true` pada fixture tanpa proof sesi; admin tetap ditolak.
6. **AUTH-INT-06:** `auth_two_factor.verified=false/null` selalu ditolak walau flag user true.
7. **AUTH-INT-07:** challenge expired, replay, paralel, record hilang, dan cookie forged ditolak.
8. **AUTH-INT-08:** backup code sekali pakai hanya menghasilkan recovery-only atau ditolak, sesuai keputusan final.
9. **AUTH-INT-09:** logout menghapus current row; revoke-all/password reset/TOTP reset/role change menghapus semua row dan challenge.
10. **AUTH-INT-10:** stale cookie setelah row session dihapus tidak lolos, termasuk setelah refresh/cookie cache.
11. **AUTH-INT-11:** profil hilang atau role invalid tidak pernah menjadi anonymous diam-diam pada telemetry; akses tetap ditolak dengan error internal tersanitasi.

### 10.3 Concurrency dan lockout

1. **LOCK-INT-01:** 20 kegagalan password paralel tidak kehilangan increment dan hanya satu audit transisi lock dibuat.
2. **LOCK-INT-02:** kombinasi 3 password gagal + 2 TOTP gagal mengunci principal yang sama.
3. **LOCK-INT-03:** dua instance aplikasi berbagi state lockout DB; restart proses tidak menghapus lock.
4. **LOCK-INT-04:** request benar yang berbarengan dengan kegagalan kelima tidak menyisakan sesi aktif setelah final recheck.
5. **LOCK-INT-05:** lock satu user tidak mengunci user lain; unknown identifier memakai response generik dan rate limit terpisah.
6. **LOCK-INT-06:** lock expiry dan recovery unlock bersaing tanpa negative count, lost update, atau audit ganda.

### 10.4 Trusted-device dan bypass request langsung

1. **TRUST-01:** `trustDevice=true` ditolak untuk TOTP, OTP, dan backup code.
2. **TRUST-02:** false/absent tidak membuat cookie/record trusted-device.
3. **TRUST-03:** cookie trusted-device valid lama, expired, forged, dan milik user lain tidak pernah melewati TOTP.
4. **TRUST-04:** request sign-in yang membawa cookie dihentikan pada request itu juga, cookie dihapus, dan tidak ada sesi baru.
5. **BYPASS-01:** sign-up, reset email, OTP, disable TOTP, update-session assurance, list/revoke session lintas user, serta alias route yang tidak diizinkan ditolak server.
6. **BYPASS-02:** direct URL, Route Handler, Server Action, dan service memberi hasil deny yang sama untuk anonymous/password-only/pending/recovery-only.

### 10.5 Migration dan guard pada target berizin

1. **DB-INT-01:** preflight descriptor gagal sebelum socket/connect dipanggil.
2. **DB-INT-02:** post-connect mismatch `current_database/current_user/schema` disconnect tanpa DDL.
3. **DB-INT-03:** migrate dari DB kosong menghasilkan tabel/FK/unique/check/index yang direview.
4. **DB-INT-04:** menjalankan migrator kedua kali tidak menduplikasi atau mengubah schema.
5. **DB-INT-05:** dua migrator paralel diserialkan advisory lock.
6. **DB-INT-06:** ledger tak dikenal/hash mismatch menghentikan migration.
7. **DB-INT-07:** `db:check` dan test hard-deny target production.
8. **DB-INT-08:** runtime memakai pooled URI, migrator memakai direct URI, dan keduanya tidak tertukar.
9. **DB-INT-09:** restore verification hanya dapat menuju database kosong/disposable yang descriptor-nya tepat.

### 10.6 E2E minimum F0-12

- Login unenrolled diarahkan hanya ke enrollment; mencoba URL admin langsung tetap ditolak.
- Login enrolled memerlukan password lalu TOTP pada dua request terpisah; sebelum TOTP tidak ada admin session.
- Lima kegagalan melalui UI maupun request langsung menghasilkan lock yang sama tanpa membocorkan keberadaan akun.
- Logout, reset/recovery owner, dan pencabutan dari perangkat lain membuat halaman/action berikutnya gagal.
- Editor/owner mendapat role dari profil DB, bukan payload client; editor tetap ditolak dari resource operasional/Sistem yang dilarang.

---

## 11. Urutan implementasi yang aman

1. Koordinator menerima atau mengubah keputusan §1-§5 lalu membekukan kontrak F0-06.
2. Penulis DB tunggal merancang migration baru berdasarkan ledger target, bukan mengedit migration lama secara spekulatif.
3. Implementasikan dan unit-test guard descriptor tanpa koneksi; pemilik menyetujui target disposable sebelum integration test.
4. Jalankan F0-08 pada DB lokal disposable, lalu Neon test yang disetujui. Production tetap tidak disentuh.
5. Implementasikan auth façade/hook, assurance session, lockout, trusted-device deny, dan revocation.
6. Jalankan integration test auth pada DB disposable; setelah itu F0-12 melakukan request/E2E independen.
7. Koreksi laporan F0-08/F0-10 dan kontrak hanya berdasarkan bukti baru. Jangan mengubah status resmi dari klaim unit test lama.

## 12. Batas bukti review

- Source paket Better Auth 1.7.14 yang terpasang dibaca untuk perilaku challenge, session creation, trusted-device, dan lockout TOTP.
- Graph codebase yang tersedia bertanggal generasi 28 Oktober 2026, tetapi metadata path yang direview ditandai berubah. Karena itu seluruh klaim material di atas diverifikasi ulang lewat pembacaan source langsung; migration SQL yang ditandai parse-partial juga dibaca penuh.
- Tidak ada tes, build, koneksi DB, migration, seed, backup/restore, deploy, atau akses cloud yang dijalankan.
- Dokumen ini tidak memberi izin mengubah database existing. Identitas target, data lama, ledger migration, dan rencana porting tetap harus disetujui pemilik.
