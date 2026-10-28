# Penugasan F0-10 s.d. F0-20 — peta ketergantungan dan blocker

Tanggal: 28 Oktober 2026
Sifat dokumen: **usulan penugasan dari agent**, bukan perubahan status pada `RENCANA_IMPLEMENTASI_PRD_1_5.md`. Status resmi hanya diubah koordinator.

## 1. Isi penugasan

Rentang yang dipegang: **F0-10 … F0-20** (11 task).

| ID | Ringkas | Prasyarat menurut rencana | Kondisi prasyarat nyata |
|---|---|---|---|
| F0-10 | Auth, sesi, TOTP wajib, lockout 5/15 | 08, 09 | **Sudah dikerjakan penulis lain** (09:04–09:09): `src/auth/**`, `tests/unit/auth`, laporan `F0-10.md`. Tidak dikerjakan ulang. |
| F0-11 | Bootstrap & recovery owner lewat CLI | 10 | Tertunda: butuh DB untuk uji sesi lama tidak berlaku |
| F0-12 | Verifikasi auth/akses lewat request nyata | 10, 11 | Tertunda: butuh DB tes + browser |
| F0-13 | Validasi byte + pipeline Sharp | 07 | **Selesai dikerjakan** → `docs/fase-0/laporan/F0-13.md` |
| F0-14 | Signed upload & finalisasi R2 | 08, 09, 10, 13; schema media | Terblokir: SDK S3 belum terpasang, kredensial R2 belum ada, schema `media` belum ada |
| F0-15 | Blok, versi, publish, audit transaksional | 08, 09, 10, 14; schema konten | Terblokir: schema konten belum ada, menunggu 14 |
| F0-16 | Preview / Draft Mode terikat sesi | 15 | Terblokir (rantai 15) |
| F0-17 | Cache dan invalidasi setelah commit | 15, 16 | Terblokir (rantai 15) |
| F0-18 | Constraint & race booking (Lampiran F.7) | 08; schema irisan booking | Terblokir: butuh PostgreSQL dengan `btree_gist` |
| F0-19 | Sentry + redaksi data sensitif | 07, 10; target monitoring | Terblokir: `@sentry/nextjs` belum terpasang, DSN belum ada |
| F0-20 | Docker standalone + pemeriksaan artefak | 07 | Terblokir: Docker tidak tersedia di mesin ini |

## 2. Bukti kondisi lingkungan (diperiksa 28 Oktober 2026, 09:06)

| Pemeriksaan | Hasil |
|---|---|
| `docker --version` | `command not found` |
| `psql --version` | `command not found` |
| Port `5432` / `3000` mendengarkan | tidak ada |
| `node_modules/@aws-sdk` | tidak ada (dibutuhkan F0-14) |
| `node_modules/@sentry/nextjs` | tidak ada (dibutuhkan F0-19) |
| `node_modules/better-auth` | `1.7.14`, plugin `two-factor` (TOTP, backup codes, schema) tersedia |
| `node_modules/sharp` | `0.35.5` tersedia |

Kesimpulan: satu-satunya task pada rentang ini yang dapat **dibuktikan penuh** tanpa resource eksternal adalah **F0-13**, dan itu sudah dikerjakan.

## 3. Urutan eksekusi yang diusulkan setelah resource tersedia

1. **F0-13** — selesai (lokal).
2. **F0-11 → F0-12** — begitu ada PostgreSQL tes (Docker Compose lokal atau branch Neon `dev`). Keduanya memvalidasi F0-10 yang sudah ada; tanpa DB, klaim auth belum sah.
3. **F0-14** — setelah `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` disetujui dan bucket/prefix tes tersedia. Butuh schema `media` dari penulis DB.
4. **F0-15 → F0-16 → F0-17** — satu rantai, tidak boleh dipecah antar-agent.
5. **F0-18** — dapat paralel dengan rantai konten selama memakai DB tes terpisah.
6. **F0-19** — setelah versi `@sentry/nextjs` disetujui dan project monitoring tes tersedia.
7. **F0-20** — begitu Docker tersedia; jika tidak, tetap `TERBLOKIR` dan tidak diganti skrip yang selalu sukses.

## 4. Keputusan yang diminta dari pemilik/koordinator

1. **Kepemilikan F0-10.** Ada penulis lain yang sudah menghasilkan artefak F0-10. Konfirmasi apakah task itu milik mereka (saya lanjut dari 11) atau perlu saya review ulang.
2. **Target database tes.** Docker tidak ada dan `psql` tidak ada. Perlu salah satu: Docker Desktop, PostgreSQL lokal, atau branch Neon tes yang disetujui. Tanpa itu F0-11/12/15/16/17/18 tetap terblokir.
3. **Izin dependency baru.** F0-14 butuh `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`; F0-19 butuh `@sentry/nextjs`. Keduanya wajib versi exact-pinned dan disetujui sebelum dipasang.
4. **Kredensial R2 tes dan project Sentry tes** (bucket/prefix terpisah, DSN khusus tes) melalui kanal aman, bukan lewat repo.
5. **Docker** untuk F0-20, atau keputusan menunda task tersebut.
6. **Konfirmasi kontrak media:** nama varian (PRD `thumb/card/hero/og` vs kontrak `thumb/sm/md/lg`), dimensi final, dan batas 8 MB.

## 5. Aturan yang saya pegang selama rentang ini

- Satu task satu pemilik; tidak menulis ulang artefak yang sudah diklaim penulis lain.
- Tidak menambah dependency, tidak menyentuh schema DB, `package.json`, lockfile, prototype, PRD, atau `.env` tanpa persetujuan.
- Tidak commit, push, deploy, membuat resource berbayar, atau menghapus data.
- Task yang butuh cloud/DB tetap `TERBLOKIR` sampai izin dan target tersedia; tidak ada klaim lulus dari mock.
