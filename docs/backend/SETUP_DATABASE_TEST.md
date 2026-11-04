# Menyiapkan database test terpisah

Panduan ini hanya menyiapkan **target uji**. Tidak ada migrasi otomatis, tidak ada kredensial yang ditulis ke repo, dan tidak ada perintah di sini yang boleh dijalankan terhadap database produksi.

> **Status setelah Rilis 1 (4 November 2026):** branch `dev` memuat beberapa
> database legacy yang **bukan** target aplikasi. Daftar lengkapnya ada di
> `docs/RELEASE-1-2026-11-03.md` §1.3. Yang paling berbahaya: `openbyte_labs`
> ada di **dua** branch dengan isi berbeda — selalu periksa branch, bukan hanya
> nama database.

## 1. Buat branch Neon khusus test

Pilih salah satu, keduanya menghasilkan PostgreSQL terpisah dari branch `main`/produksi:

**A. Lewat Console**

1. Buka proyek Neon → tab **Branches** → **New branch**.
2. Pilih parent **main** (skema akan diisi migrasi kita, jadi isi parent tidak penting), beri nama `test`.
3. Buka branch `test` → **Databases** → **New database**, nama `openbyte_test`.
4. Buka **Connect** pada branch `test`, pilih database `openbyte_test`, lalu salin **dua** connection string:
   - **Pooled** (host berakhiran `-pooler`) → untuk runtime aplikasi.
   - **Direct** (port 5432, tanpa `-pooler`) → untuk migrasi, seed, preflight, dan tes integrasi.

**B. Lewat Neon CLI**

```powershell
neonctl branches create --project-id <project-id> --name test
neonctl databases create --project-id <project-id> --branch test --name openbyte_test
neonctl connection-string test --project-id <project-id> --database-name openbyte_test --pooled
neonctl connection-string test --project-id <project-id> --database-name openbyte_test
```

Jangan menempelkan hasil perintah tersebut ke chat, issue, atau commit.

## 2. Isi variabel lokal (tanpa commit)

`.env.local` sudah diabaikan Git. Tambahkan hanya di mesin Anda:

```dotenv
# Runtime aplikasi memakai pooled dari branch test selama pengujian.
DATABASE_URI=[connection string disimpan di secret manager]
# Koneksi langsung untuk migrasi/seed/preflight/tes.
DATABASE_URI_DIRECT=[connection string disimpan di secret manager]
DATABASE_MIGRATION_TARGET=<host-direct>/openbyte_test
DATABASE_SEED_TARGET=<host-direct>/openbyte_test
DATABASE_PREFLIGHT_TARGET=<host-direct>/openbyte_test
OWNER_BOOTSTRAP_TARGET=<host-direct>/openbyte_test
```

`<host-direct>` adalah host **tanpa** `-pooler`, termasuk port bila ada, misalnya `ep-xxx.ap-southeast-1.aws.neon.tech:5432`. Tanpa variabel konfirmasi ini, perintah operator akan berhenti sebelum membuka koneksi.

Untuk tes integrasi, pakai proses terpisah agar guard dapat membandingkan target:

```dotenv
TEST_DATABASE_URL=[connection string disimpan di secret manager]
TEST_DATABASE_TARGET=<host-direct>/openbyte_test
TEST_DATABASE_WRITE_CONFIRM=I_CONFIRM_ISOLATED_TEST_DATABASE
```

Guard `pnpm test:integration` menolak target yang host+database-nya sama dengan `DATABASE_URI`, `DATABASE_URI_DIRECT`, atau nama lama `DATABASE_URL`/`DATABASE_DIRECT_URL`. Artinya bila Anda memakai **satu** database test yang sama untuk aplikasi dan tes, jalankan tes dari shell yang **tidak** memuat variabel runtime tersebut:

```powershell
$env:TEST_DATABASE_URL="..."
$env:TEST_DATABASE_TARGET="<host-direct>/openbyte_test"
$env:TEST_DATABASE_WRITE_CONFIRM="I_CONFIRM_ISOLATED_TEST_DATABASE"
pnpm test:integration
```

## 3. Urutan perintah (manual, satu per satu)

```powershell
pnpm db:migrate           # menjalankan seluruh migrasi (20/20) lewat koneksi langsung
pnpm db:preflight         # verifikasi read-only: tabel, migrasi, constraint, seed
pnpm db:seed:foundation   # Settings, jadwal, FAQ, kalkulator, paket
pnpm db:preflight         # harus lulus sebelum tes integrasi
pnpm test:integration     # rollback, exclusion constraint, rate limit paralel, auth
```

Setiap perintah meminta nama database diketik ulang; `db:migrate` dan `db:seed:foundation` juga meminta kata kunci. Tanpa TTY, operator dapat memberi konfirmasi eksplisit melalui `--confirm-target=<nama_database>` dan, untuk operasi tulis, `--confirm-keyword=MIGRATE` atau `--confirm-keyword=SEED`. `db:preflight` normal hanya menerima nama `*_test` atau `*_dev`.

Preflight produksi bersifat read-only dan memerlukan persetujuan terpisah:

```powershell
pnpm db:preflight -- --allow-production
```

Gunakan koneksi direct dan `DATABASE_PREFLIGHT_TARGET` yang telah disetujui. Operator harus mengonfirmasi nama database serta mengetik `PRODUCTION-READONLY`. Mode ini hanya membaca kondisi skema/seed; jangan menjalankan tes integrasi atau perintah tulis pada target produksi. Status preflight bukan pengganti verifikasi backup/restore, akses owner/MFA, Turnstile, atau persetujuan rilis.

`pnpm db:preflight` memeriksa:

- seluruh tabel di `EXPECTED_TABLES` hasil migrasi ada;
- `drizzle.__drizzle_migrations` berisi jumlah baris yang sama dengan jumlah berkas jurnal migrasi (saat Rilis 1: **20**);
- constraint `consultation_bookings_no_overlap` bertipe exclusion ada;
- marker `availability-v1`, `faq-v1`, `calculator-v1`, `packages-v1` ada;
- Settings berisi satu baris dan tabel seed terisi;
- memberi peringatan bila sudah ada booking/inquiry/quote atau akun admin (tanda target bukan database bersih).

## 4. Setelah tes berhasil

1. Kosongkan data uji atau buat ulang branch test; tes integrasi menulis lalu menghapus barisnya, tetapi kegagalan di tengah dapat menyisakan data.
2. Catat hasil di `docs/backend/FONDASI.md` (jumlah tes, tanggal, dan bahwa target adalah branch test).
3. Jangan memakai branch test sebagai target produksi. Migrasi produksi mengikuti PRD 10.2 dan dijalankan terpisah sebelum rilis.

## 5. Bila tidak ingin memakai Neon untuk saat ini

PRD G.4 mengizinkan PostgreSQL lokal terpasang langsung, bukan container. Instal PostgreSQL 17 untuk Windows, buat role dan database `openbyte_test`, lalu isi variabel di atas dengan `localhost:5432`. Langkah migrasi/seed/preflight tetap sama.
