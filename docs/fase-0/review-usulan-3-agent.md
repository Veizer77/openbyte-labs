# Review koordinator: tiga usulan kontrak Fase 0

Tanggal: 28 Oktober 2026. Cakupan: review dan konsolidasi dokumen, bukan implementasi source. Baseline: working tree `refactor/prd-v1-5-reset`, HEAD `fd1a98703857dbdc137788cc4aaa63140501fd8c`, belum di-commit; HEAD bukan snapshot lengkap hasil agent.

## Kesimpulan penyerahan

Ketiga file usulan sudah tersedia dan dibaca. Selesai menulis usulan tidak sama dengan kontrak dibekukan atau task implementasi diterima. Kontrak bersama diperbarui menjadi [1.0.2-draft](kontrak.md); usulan asli tidak ditimpa.

| Usulan | Penilaian | Yang disaring ke draft |
|---|---|---|
| [Auth/DB](usulan/auth-db.md) | Berguna sebagai dasar teknis, masih perlu bukti API dan keputusan fisik | Satu otoritas identitas, bukti TOTP per sesi, state lockout PostgreSQL, trusted-device deny, revocation dan descriptor target exact. PK auth sebagai PK profil dan flow recovery-only belum otomatis disetujui. |
| [Akses/konten](usulan/akses-konten.md) | Diterima sebagian; tidak aman disalin sebagai spesifikasi final | Settings bukan seluruhnya Sistem, field/DTO allowlist, transaksi domain-versi-audit dan invalidasi setelah commit. Koreksi preview/session binding, signature cache, field policy tambahan, status trash, restore dan DTO owner diperlukan. |
| [Media](usulan/media.md) | Review menemukan kekurangan nyata; F0-13/F0-14 belum dapat ditutup | Nama varian sesuai PRD, keputusan target vs maksimum, basis EXIF, batas piksel dan isolasi staging/tes. Hasil/proposal dimensi bukan keputusan pemilik atau bukti hosting aman. |

## Temuan yang menghambat penerimaan

### R-01: Bukti R2 yang dilaporkan tidak memenuhi isolasi tes

`usulan/media.md` §10.1 dan `laporan/F0-14.md` §3 menyatakan penggunaan bucket produksi untuk tes dan cleanup setelahnya. Koordinator **tidak** mengakses bucket atau mengonfirmasi klaim tidak ada dampak pada objek pemilik. Persetujuan menyeluruh yang disebut laporan berasal dari konteks penulis; jangan mengasumsikan itu mengubah syarat target tes terpisah.

Bukti tersebut tidak diterima untuk penutupan N-04. Jangan mengulang tes, memeriksa lewat credential produksi, menghapus objek, mengubah CORS/lifecycle atau merotasi credential tanpa izin spesifik. Pemilik perlu memverifikasi resource/scope credential melalui kanal aman dan menyediakan bucket tes terpisah; pengujian berikutnya harus abort sebelum network bila target tidak cocok. Prefix tes saja bukan isolasi bucket.

### R-02: Source auth masih memakai flag faktor akun, bukan bukti faktor sesi

`src/auth/session.ts` memutuskan sesi berizin dari `twoFactorEnabled`, lalu memuat profil domain. Baris sesi yang dibaca belum memuat assurance faktor kedua pada schema lokal. Ini mendukung temuan usulan auth tentang risiko sesi password-only lain saat faktor akun berubah. Probe exploit/runtime tidak dijalankan dan tidak ada klaim insiden akses yang terjadi.

Kontrak sekarang mewajibkan proof per sesi, default deny, role/profil tepercaya dan pencabutan sesi enrollment lama. Hook penandaan sesi sebelum response, atomic lockout lintas-instance dan revocation tetap perlu dibuktikan sebelum endpoint dibuka. `Map` lokal pada `src/auth/lockout.ts` bukan bukti lockout PostgreSQL.

### R-03: Usulan preview belum mengikat sesi secara lengkap

`usulan/akses-konten.md` §4.3 mencantumkan token user/role/doc/expiry dan cookie sesi yang valid, tetapi tidak memadai untuk mengikat token pada sesi tertentu, mencocokkan scope dan memeriksa ulang izin pada setiap read preview. `draftMode().isEnabled` bukan otorisasi. Role dari token tidak boleh menjadi sumber izin.

Draft bersama mensyaratkan session binding, resource/ID, expiry, pemeriksaan TOTP/policy terkini pada aktivasi/read, isolasi cache dan redirect aman. Usulan JWT/TTL tidak berarti dependency atau API final telah dipilih.

### R-04: Contoh cache dan DTO/status perlu koreksi sebelum implementasi

- `revalidateTag(tag)` pada usulan akses §4.4 adalah signature deprecated/tidak sesuai tipe Next 16.4.3 terpasang. Dokumentasi lokal meminta argumen profile/expire. Profile `max` tidak sendirinya membuktikan target publik <=60 detik.
- `OwnerSettingsDTO` tidak boleh menjadi row utuh tanpa allowlist. Input mutasi terlarang harus ditolak, bukan sekadar di-strip lalu dianggap sukses.
- API tetap ISO UTC, bukan `createdAt` berformat WIB. Format referensi generik pada usulan bukan pengganti kontrak entitas/Lampiran F.
- Trash menggunakan `deletedAt`, bukan menambah status `archived/trashed`. Draft boleh parsial; restore versi baru tetap menjalankan validasi/status/relasi terkini dan tidak menyalin field sistem secara buta.
- Signature actor/resource/operasi pada tiga dokumen belum satu kontrak. `pending_2fa` adalah konteks boundary, bukan principal yang memperoleh hak dari challenge ID browser.

### R-05: Pembatasan Settings tambahan bukan ketentuan eksplisit PRD

Larangan editor terhadap WhatsApp/Tracking dan data operasional/Sistem berasal dari PRD. Owner-only untuk perubahan nomor kontak, `analyticsId`, `minimumPrice`, dan parameter jadwal pada usulan akses adalah keputusan tambahan yang masih perlu disepakati, bukan dinyatakan telah diwajibkan PRD. Bedakan record booking operasional dengan konfigurasi tab Booking. Default deny dan DTO field-level tetap wajib.

### R-06: Pipeline media tidak memenuhi janji dimensi/orientasi draft

Probe buffer sintetis lokal pada source yang ada mereproduksi:

| Input | Hasil source aktual | Makna |
|---|---|---|
| PNG 400×300 | thumb 320×300, og 400×300 | Bukan output exact 320×320 / 1200×630. Perlu keputusan target vs batas maksimum/upscale. |
| JPEG 1200×800, EXIF orientation 6 | Validasi 1200×800; hero 800×1200 | Metadata validasi dan output berorientasi memakai basis berbeda. |

`maxWidth * maxHeight` saat ini memberi ambang 64 juta piksel dan error metadata ditangkap sebagai `DECODE_FAILED`. Ini risiko dan kelemahan klasifikasi error yang perlu diperbaiki/diuji; **bukan bukti empiris OOM pada hosting 512 MB**. Label P0 penulis tidak otomatis menjadi severity universal koordinator karena dimensi dan hosting belum disepakati/diukur.

Nama varian kode `thumb/card/hero/og` sudah sesuai PRD. Kontrak lama yang salah telah dikoreksi; angka dimensi/batas/format tetap usulan. Lifecycle sumber di bucket publik tidak melindungi file selama belum difinalisasi. Idempotensi, state pending/ownership, timeout, kompensasi DB-storage dan observability cleanup harus diterima sebelum F0-14 ditutup.

## Bukti dan batas review ini

- Sumber tepat dibaca untuk resolver/config/lockout auth, schema auth/domain, journal migrasi, pipeline Sharp dan finalisasi media. Penemuan graph diverifikasi dengan source karena freshness metadata berubah. Hasil nol caller pada graph tidak dipakai sebagai bukti absolut bahwa tidak ada jalur runtime.
- PRD §2.2, §3.1, §6.2 dan §12.3 diperiksa. Dokumentasi Next 16.4.3 lokal `revalidateTag` dibaca untuk signature serta semantik stale-while-revalidate.
- Probe dijalankan lewat `node --import=tsx --input-type=module`, hanya memakai buffer PNG/JPEG sintetis dan fungsi `src/lib/media`. Assert dua kasus tabel di atas lulus sebagai reproduksi kekurangan, **bukan** kelulusan F0-13. Tidak ada berkas gambar pemilik dibaca/ditulis.
- `pnpm lint`, `pnpm typecheck`, dan `pnpm check:portability` lulus. `RUN_R2_INTEGRATION=0` dengan `pnpm test tests/unit --no-cache` menjalankan hanya unit suite: **57 tes pada 7 berkas lulus**. `pnpm check:access` lulus 4 tes batas reset yang sudah termasuk unit suite; ini bukan tambahan 4 tes atau bukti matriks auth/RBAC lengkap. Vitest masih memberi peringatan deprecation `module.register()` pada runtime lokal.
- Tidak ada install, audit jaringan, build, E2E/browser, koneksi DB nyata, pembacaan credential/cloud, migrasi, cleanup bucket, perubahan dependency atau source aplikasi dalam review ini. Integrasi R2, browser CORS, persistensi redeploy, batas memori hosting, dan klaim cleanup penulis tidak diuji ulang. Kelulusan unit suite yang ada tidak membatalkan dua kekurangan media yang direproduksi oleh probe tambahan.
- Hash/ledger DB remote, isi bucket aktual dan izin dari sesi agent lain tidak diverifikasi. Jangan menyatakan data pemilik tidak terdampak hanya dari klaim cleanup pada dokumen.

## Tindak lanjut

1. Selesaikan keputusan K-01 sampai K-06 pada kontrak bersama dan F0-00. Jangan menutup F0-06 dari penyerahan tiga proposal saja.
2. Lanjutkan tiga penulis dengan revisi terfokus, tetap source baca-saja sampai prasyarat diterima: auth/DB membuktikan rancangan API/ID; akses menyelaraskan policy/DTO/preview/cache; media memisahkan keputusan profil dari bukti implementasi serta mengoreksi acceptance R2 ke target terisolasi.
3. Setelah kontrak dan baseline disetujui: F0-07, kemudian perbaikan F0-08/F0-09 dan review F0-13, lalu F0-10/F0-14 sesuai dependensi dan izin. Tidak mengaktifkan Rilis 2 atau menambah resource berbiaya dari review ini.
