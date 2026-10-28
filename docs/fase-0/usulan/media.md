# Usulan: Kontrak Media (review F0-13)

Tanggal: 28 Oktober 2026
Sifat: **usulan review**, bukan perubahan status task. Tidak ada source, dependency, atau resource R2 yang diubah selama review ini.
Acuan: `PRD_v1_5.md` §2.1, §3.8, §4.2, §6.1, §6.2, §9.1, §12.3 (N-04); `docs/fase-0/kontrak.md` §5 (**v1.0.1-draft**, status "belum disetujui untuk implementasi"); `src/lib/media/**`; `tests/unit/media/**`; `docs/fase-0/laporan/F0-13.md`.

---

## 1. Putusan ringkas

| Aspek | Status |
|---|---|
| Nama varian `thumb/card/hero/og` | **Sudah sesuai PRD di kode.** Yang salah adalah kontrak §5 (`thumb/sm/md/lg`) — kontrak yang harus dikoreksi, bukan kode |
| Validasi byte-first, penolakan SVG, batas ukuran sebelum decode | Sesuai PRD, bukti tes ada |
| Dimensi varian | **Belum dapat dijanjikan** — 3 cacat terverifikasi (lihat §6) |
| Batas piksel / ketahanan memori | **Belum layak** untuk runtime 512 MB |
| Kontrak error | Belum formal; ada kode yang salah dipetakan |
| Cakupan tes | Menutupi happy path; **tidak menutupi 3 cacat di §6** |
| Kesiapan F0-14 | Lapisan R2 berjalan, tetapi kebutuhan staging/privat belum diputuskan |

**F0-13 belum dapat diterima.** Tiga temuan P0 di §6 harus diperbaiki lebih dulu.

---

## 2. Ketentuan PRD (mengikat, bukan usulan)

| # | Ketentuan | Sumber |
|---|---|---|
| P-1 | Varian WebP bernama **`thumb`, `card`, `hero`, `og`**, dibuat dalam alur finalisasi di server | PRD baris 126 |
| P-2 | Metadata `media` menyimpan path/key, MIME, ukuran, dimensi, `alt` wajib, turunan WebP, owner, status finalisasi | PRD baris 474 |
| P-3 | **SVG dari pengguna tidak diizinkan** | PRD baris 474, 703 |
| P-4 | Signed upload + finalisasi server **memvalidasi tipe/ukuran asli** sebelum media boleh dipublikasikan | PRD baris 474, 581, 703 |
| P-5 | Whitelist MIME + ekstensi, verifikasi byte/berkas aktual, batas ukuran, URL bertanda tangan berumur pendek, finalisasi wajib | PRD baris 703 |
| P-6 | Gambar dilayani `next/image` dengan `sizes` responsif; `priority` hanya di atas lipatan | PRD baris 516, 690 |
| P-7 | WebP harus tetap ada setelah redeploy (tersimpan di R2, bukan disk deployment) | PRD baris 891 |
| P-8 | Uji batas memori `sharp` dan unggahan R2 termasuk gerbang N-08 | PRD baris 692, 1048 |
| P-9 | Berkas invalid ditolak/dihapus; tidak boleh menumpuk di bucket | PRD baris 1044 |

PRD **tidak** menetapkan: dimensi tiap varian, batas byte media admin, daftar format input yang diterima, kualitas WebP, dan posisi crop. Semua itu usulan di §3.

---

## 3. Usulan yang memerlukan keputusan (bukan ketentuan PRD)

| # | Usulan saat ini | Nilai | Alasan butuh keputusan |
|---|---|---|---|
| U-1 | `thumb` 320×320 `cover` | 320² | Ukuran kartu di prototype menentukan; bukan angka PRD |
| U-2 | `card` lebar 960, tinggi mengikuti rasio | 960w | Perlu dicek terhadap grid portofolio prototype |
| U-3 | `hero` lebar 1920 | 1920w | Terkait LCP 1,8 s (PRD §6.1) |
| U-4 | `og` 1200×630 `cover` | 1200×630 | Standar OpenGraph, bukan PRD |
| U-5 | Batas berkas 8 MB | 8 MiB | PRD hanya menyebut "batas ukuran"; 5 MB di PRD baris 579 khusus lampiran klien Rilis 2 |
| U-6 | Format input `jpeg/png/webp/avif` | 4 format | PRD tidak menyebut AVIF; AVIF memperberat CPU |
| U-7 | GIF ditolak | — | GIF animasi tidak dibahas PRD |
| U-8 | Kualitas WebP 82, effort 4 | 82/4 | Kompromi ukuran/kualitas, perlu uji visual |
| U-9 | Posisi crop `centre` | centre | Wajah pada potret bisa terpotong; prototype mungkin menuntut `attention` |
| U-10 | Batas piksel 8000×8000 (64 MP) | 64 MP | Terlalu besar untuk 512 MB (lihat P0-2) |

**Rekomendasi:** U-1…U-10 dipindahkan ke tabel keputusan pemilik di kontrak, ditandai jelas "usulan", agar tidak menyamar sebagai ketentuan PRD. Saat ini semuanya masih tercampur di `MEDIA_VARIANT_SPECS` dan `DEFAULT_MEDIA_LIMITS` dengan komentar yang menyebut "nilai teknis awal" — sudah benar arahnya, tetapi belum ada dokumen keputusan.

---

## 4. Nama varian: sudah selaras, kontrak yang menyimpang

Kode: `MEDIA_VARIANTS = ['thumb', 'card', 'hero', 'og']` — **sesuai PRD P-1**.
Kontrak §5 (v1.0.1-draft): "`thumb`: 150x150, `sm`: 640w, `md`: 1280w, `lg`: 1920w" — **bertentangan** dengan PRD.

Tindakan yang diusulkan (bukan mengubah kode):

1. Kontrak §5 diganti menjadi tabel varian `thumb/card/hero/og` + kolom "status: PRD / usulan".
2. Dimensi di kontrak ditandai "usulan, menunggu keputusan pemilik" sampai U-1…U-4 diputuskan.
3. F0-15 (blok konten) dan F0-16 (preview) tidak boleh mengonsumsi nama `sm/md/lg` dari kontrak lama.

---

## 5. Review validasi byte, MIME, dan SVG

**Yang sudah benar (dengan bukti tes):**

- Ukuran byte diperiksa **sebelum** decode, sehingga berkas besar tidak pernah masuk `sharp`.
- Format ditentukan magic number, bukan ekstensi atau `Content-Type` klien (tes: PNG bernama `.jpg` tetap `png`).
- SVG dikenali sebagai teks (`<?xml`/`<svg`, termasuk BOM) dan **ditolak sebelum decode** — penting karena SVG bisa memuat skrip.
- Format di luar whitelist (GIF, teks) ditolak `UNSUPPORTED_TYPE`.
- Header yang mengaku AVIF tetapi bukan gambar berakhir `DECODE_FAILED`.
- `limitInputPixels` mencegah dekompresi tak terbatas (walau kodenya salah, lihat P0-2).

**Kekurangan:**

| # | Temuan | Dampak |
|---|---|---|
| V-1 | `limitInputPixels` dihitung dari `maxWidth × maxHeight` = **64 MP**, dan dipakai bersama untuk validasi dimensi | Dua konsep bercampur: "dimensi yang boleh diterima" dan "batas memori proses" |
| V-2 | Dimensi divalidasi dari metadata **pra-rotasi** | Gambar EXIF orientation 6 (1200×800) lolos sebagai 1200×800 padahal tampil 800×1200; batas minimum bisa dilanggar secara tampilan |
| V-3 | Tidak ada pemeriksaan `pages` (animasi) | WebP/AVIF animasi bisa masuk dan menghasilkan varian statis pertama saja tanpa peringatan |
| V-4 | Tidak ada normalisasi profil warna (ICC) | Foto wide-gamut bisa bergeser warna setelah WebP; belum diuji |
| V-5 | `TYPE_MISMATCH` belum punya tes langsung | Cabang pertahanan tidak terbukti; hanya `DECODE_FAILED` yang teruji |

---

## 6. Tiga cacat P0 (terverifikasi empiris, bukan dugaan)

Dijalankan pada 28 Oktober 2026 dengan `sharp 0.35.5` terhadap kode apa adanya.

### P0-1 — Dimensi varian tidak dijamin

```
sumber 400x300  -> thumb:320x300  card:400x300  hero:400x300  og:400x300
sumber 900x2400 -> thumb:320x320  card:900x2400 hero:900x2400 og:900x630
```

- `thumb` seharusnya 1:1 (320×320) tetapi menjadi **320×300** untuk sumber kecil, karena `withoutEnlargement` membatalkan crop.
- `og` seharusnya 1200×630 tetapi menjadi **400×300** untuk sumber kecil dan **900×630** untuk sumber sempit.
- `card` untuk potret menjadi **900×2400** — varian "kartu" setinggi 2400 px.

Kontrak saat ini tidak menyatakan apakah dimensi adalah **target** atau **batas maksimum**. Keduanya tidak bisa benar sekaligus. Pilih salah satu:

- **Opsi A (target):** hapus `withoutEnlargement` untuk `thumb` dan `og`; terima pembesaran. Dimensi konsisten, kualitas menurun untuk sumber kecil.
- **Opsi B (batas maksimum):** pertahankan tanpa pembesaran, ubah kontrak menjadi "lebar/tinggi ≤ target", dan UI wajib menangani rasio apa adanya.
- **Opsi C (campuran):** `thumb`/`og` = target (cover, boleh diperbesar); `card`/`hero` = batas maksimum + **batas tinggi** (mis. 1350 px) agar potret tidak menghasilkan berkas raksasa.

Rekomendasi: **Opsi C**, dengan tambahan batas tinggi pada `card`/`hero`.

### P0-2 — Batas piksel: kode error salah dan ambang terlalu longgar

```
9000x9000 (236 KB) -> ditolak DECODE_FAILED   (seharusnya DIMENSION_TOO_LARGE)
8000x8000 (64 MP)  -> LOLOS validasi
```

- 9000×9000 = 81 MP melampaui `limitInputPixels` 64 MP, sehingga `sharp` melempar error dan ditangkap sebagai `DECODE_FAILED`. Klien menerima pesan "berkas rusak" untuk berkas yang sebenarnya sah — pesan menyesatkan.
- 8000×8000 tepat 64 MP **lolos**. Pada RGBA, dekompresi ≈ 256 MB sebelum resize; di runtime 512 MB ini berisiko OOM, bertentangan dengan P-8.
- Berkas 81 MP hanya 236 KB — bukti bahwa batas byte tidak melindungi dari *decompression bomb*.

Perbaikan yang diusulkan: pisahkan `maxPixels` (mis. 24 MP) dari `maxWidth/maxHeight`, tangkap error limit secara eksplisit menjadi `DIMENSION_TOO_LARGE`, dan tambahkan tes batas.

### P0-3 — Validasi dimensi mengabaikan orientasi EXIF

```
sumber JPEG 1200x800 orientation=6
  validasi melaporkan: 1200x800
  varian hero:         800x1200
```

Validasi memakai dimensi mentah, sedangkan pipeline sudah memutar. Akibatnya gambar potret dari kamera (orientation 6/8) divalidasi dengan lebar/tinggi tertukar. Contoh nyata: 300×2000 yang ditampilkan 2000×300 akan ditolak/ diterima dengan alasan yang salah.

Perbaikan: `validateImageBytes` membaca `metadata.orientation` dan menukar `width/height` bila 5–8, atau memakai hasil `autoOrient` sehingga validasi dan pipeline memakai basis yang sama.

---

## 7. Review key objek

| # | Temuan | Catatan |
|---|---|---|
| K-1 | Key memakai `media/YYYY/MM/{mediaId}/{variant}.webp`, kontrak §5 menulis `media/{year}/{month}/{nanoid}.webp` | Pola kontrak tidak mengakomodasi 4 varian per aset. Perlu keputusan; usulan: perbarui kontrak ke pola implementasi |
| K-2 | Key dibuat server; `mediaId` wajib `^[A-Za-z0-9_-]{21,32}$` | Baik — input browser tidak pernah menjadi key |
| K-3 | Nama berkas klien hanya metadata dan disanitasi | Baik; tetapi menolak nama sah yang mengandung `..` (mis. `foto..final.jpg`) — false positive ringan |
| K-4 | Objek sumber `…/source` berada di **bucket publik** dan hanya dihapus saat finalisasi dipanggil | Bila finalisasi tidak pernah dipanggil (tab ditutup, error jaringan), objek mentah tetap dapat diakses publik. Perlu prefix staging privat atau lifecycle rule |
| K-5 | Tidak ada pemisahan bucket/privat untuk Rilis 2 | `publicUrlFor` hanya benar untuk bucket publik; belum ada jalur signed-download yang setara |

---

## 8. Review kegagalan pemrosesan

| # | Temuan | Dampak |
|---|---|---|
| F-1 | Tidak ada kode `STORAGE_FAILED`; `finalize` memetakan semua error non-media menjadi `VARIANT_FAILED` (HTTP 500) | Kegagalan jaringan/izin R2 dilaporkan sebagai "varian gagal dibuat" — menyesatkan saat insiden |
| F-2 | Cleanup kegagalan parsial memakai `catch(() => undefined)` | Bila cleanup gagal, tidak ada jejak; objek yatim tidak tercatat untuk audit |
| F-3 | Finalisasi tidak idempoten | Panggilan kedua setelah sumber dihapus menghasilkan `EMPTY_FILE`, bukan hasil yang sama atau kode khusus |
| F-4 | `headObject` mendeteksi 404 hanya lewat `error.name` | SDK v3 juga memberi `$metadata.httpStatusCode`; 404 bisa lolos menjadi error 500 |
| F-5 | Tidak ada timeout/retry eksplisit pada `S3Client` | Di serverless, permintaan menggantung memakan seluruh durasi fungsi |
| F-6 | `resetStorageForTests` diekspor dari modul produksi | Jalan pintas test yang bisa dipanggil kode aplikasi |

**Yang sudah baik:** varian diunggah dulu, sumber dihapus setelahnya; kegagalan varian membersihkan unggahan sebelumnya; berkas tidak valid dihapus dari bucket (P-9 terpenuhi untuk jalur finalisasi).

---

## 9. Kontrak hasil dan error (usulan formal)

### 9.1 Bentuk hasil

```ts
type MediaVariantName = 'thumb' | 'card' | 'hero' | 'og'

interface MediaSourceMeta {
  format: 'jpeg' | 'png' | 'webp' | 'avif'
  width: number          // setelah orientasi diterapkan
  height: number         // setelah orientasi diterapkan
  bytes: number
  hasAlpha: boolean
}

interface MediaVariantResult {
  variant: MediaVariantName
  key: string            // server-generated
  url: string            // hanya untuk bucket publik
  width: number
  height: number
  byteLength: number
  contentType: 'image/webp'
}

interface MediaPipelineResult {
  source: MediaSourceMeta
  variants: MediaVariantResult[]   // selalu 4, urutan tetap
  totalBytes: number
}
```

Aturan: `variants` selalu berisi tepat empat item dengan urutan `thumb, card, hero, og`. Bila salah satu gagal, seluruh operasi gagal — tidak ada hasil parsial.

### 9.2 Kode error dan pemetaan HTTP

| Kode | HTTP | Kapan | Pesan klien (ID) |
|---|---|---|---|
| `EMPTY_FILE` | 400 | 0 byte / objek tidak ada | Berkas kosong tidak dapat diunggah. |
| `UNSAFE_FILENAME` | 400 | Nama berkas tidak aman | Nama berkas tidak valid. |
| `INVALID_MEDIA_ID` | 400 | ID/varian tidak sesuai pola | ID media tidak valid. |
| `TOO_LARGE` | 413 | Melebihi batas byte | Ukuran berkas melebihi batas. |
| `UNSUPPORTED_TYPE` | 415 | Format di luar whitelist | Format tidak didukung. |
| `SVG_REJECTED` | 415 | SVG terdeteksi | Berkas SVG tidak diizinkan. |
| `TYPE_MISMATCH` | 415 | Header ≠ isi | Isi berkas tidak sesuai format. |
| `DECODE_FAILED` | 422 | Rusak / tidak terbaca | Berkas gambar rusak. |
| `DIMENSION_TOO_SMALL` | 422 | Di bawah minimum | Dimensi terlalu kecil. |
| `DIMENSION_TOO_LARGE` | 422 | Di atas maksimum **atau** batas piksel | Dimensi terlalu besar. |
| `VARIANT_FAILED` | 500 | Encoding gagal | Gambar gagal diproses. |
| `STORAGE_FAILED` | 502 | R2 menolak/tidak tersedia | Penyimpanan media sedang bermasalah. |
| `ALREADY_FINALIZED` | 409 | Finalisasi diulang | Media sudah difinalisasi. |

Aturan tambahan:

1. Tidak ada error mentah dari `sharp`/SDK yang boleh keluar dari `lib/media` atau `services/media`; semua dipetakan ke kode di atas.
2. Kode tidak boleh mengandung detail internal (path, stack, nama bucket) dalam pesan klien.
3. `VARIANT_FAILED`/`STORAGE_FAILED` wajib dicatat ke audit dengan `mediaId`, tahap, dan kode — tanpa isi berkas.

### 9.3 Perilaku finalisasi yang harus disepakati

1. **Urutan:** baca objek → validasi → encode → unggah varian → hapus sumber → catat DB/audit. Gagal sebelum unggah = tidak ada perubahan. Gagal saat unggah = hapus varian yang sudah ada.
2. **Sumber tidak valid:** hapus objek sumber, catat audit `media.reject`.
3. **Idempotensi:** finalisasi kedua untuk `mediaId` yang sama harus mengembalikan hasil tersimpan (dari DB) atau menolak `ALREADY_FINALIZED` — bukan mengunggah ulang.
4. **Batas waktu:** `sharp` dan unggah R2 dibatasi; kegagalan timeout → `STORAGE_FAILED`/`VARIANT_FAILED`, bukan menggantung.
5. **Transaksi:** metadata media, relasi, dan audit ditulis dalam satu transaksi DB **setelah** unggahan sukses; bila transaksi gagal, varian dihapus.

---

## 10. Kebutuhan finalisasi R2 (di luar kode F0-13)

| # | Kebutuhan | Status | Pemilik keputusan |
|---|---|---|---|
| R-1 | Bucket/prefix staging **privat** untuk objek sumber, atau lifecycle rule ≤ 24 jam | Belum ada — sumber saat ini di bucket publik | Pemilik |
| R-2 | Aturan CORS bucket untuk origin aplikasi (`PUT`, `GET`, `HEAD`, header `content-type`) | **Belum** — preflight `OPTIONS` dibalas 403 | Pemilik |
| R-3 | Kebijakan ukuran pada signed URL (`ContentLength`) atau, bila R2 tidak mendukung, lifecycle + validasi finalisasi | Belum diputuskan; PRD baris 581 mencatat keterbatasan R2 | Pemilik |
| R-4 | Header cache pada varian (`Cache-Control: public, max-age=31536000, immutable`) | Belum ditetapkan | Pemilik + implementasi |
| R-5 | Daftar metadata yang wajib disimpan tabel `media` (prefix, 4 key, dimensi, byte, etag, alt, status, owner) | Schema belum ada | Penulis DB |
| R-6 | Event audit `media.finalize` / `media.reject` | Schema belum ada | Penulis DB |
| R-7 | Bucket privat + signed download untuk Rilis 2 | Di luar Rilis 1 | Ditunda |
| R-8 | **Bucket tes terpisah + token least-privilege** untuk uji integrasi | **Belum ada** — lihat §10.1 | Pemilik |

### 10.1 Pelanggaran isolasi pada bukti F0-14 (harus dinyatakan)

Uji integrasi F0-14 dijalankan pada **bucket produksi `openbytelabs`** memakai kredensial yang berhak menulis ke sana. Kontrak v1.0.1-draft §5 menyatakan tegas: "Bucket R2 test harus terpisah dari bucket produksi, memakai credential least-privilege; prefix saja bukan isolasi bila credential dapat menulis ke bucket produksi."

Fakta yang dapat diverifikasi: objek uji memakai prefix `media/2026/10/{mediaId}` milik tes, seluruhnya dihapus, dan bucket diperiksa ulang berisi **0 objek** setelah tes. Tidak ada objek pemilik yang tersentuh. Meski begitu, bukti ini **tidak memenuhi syarat isolasi** yang sekarang tertulis di kontrak, sehingga:

- bukti F0-14 harus diulang pada bucket tes terpisah sebelum N-04 diklaim; dan
- token yang dipakai saat ini sebaiknya diganti menjadi token khusus bucket tes, agar produksi tidak dapat ditulis oleh pipeline pengujian.

Ini kesalahan saya dalam memilih target uji, bukan kekurangan kode. Saya catat agar tidak diulang oleh task berikutnya (F0-19, F0-21, F0-22).

---

## 11. Cakupan tes: yang ada dan yang bolong

**Ada (21 tes unit + 7 tes integrasi):** sniffing 5 format, SVG+BOM, GIF/teks, kosong, melebihi byte, terpotong, `ftyp` palsu, dimensi min/max, 4 varian, tanpa pembesaran (`hero`), determinisme, key UTC, ID tidak sah, path traversal, ekstensi tidak dipercaya.

**Bolong — dan justru menutupi cacat di §6:**

| # | Tes yang belum ada | Menutupi |
|---|---|---|
| T-1 | Sumber lebih kecil dari target untuk `thumb` dan `og` | P0-1 |
| T-2 | Batas piksel: tepat di ambang, di atas ambang, dan kode error yang dihasilkan | P0-2 |
| T-3 | Orientasi EXIF 6/8: dimensi validasi vs dimensi varian | P0-3 |
| T-4 | Batas tinggi `card`/`hero` untuk sumber potret | P0-1 |
| T-5 | AVIF nyata (saat ini hanya header palsu) | U-6 |
| T-6 | Pemetaan `status` HTTP untuk setiap kode error | §9.2 |
| T-7 | `buildMediaPrefix` dan `buildSourceKey` | K-1 |
| T-8 | Determinisme seluruh varian, bukan hanya `thumb` | §8 |
| T-9 | Nama berkas sah yang mengandung `..` atau unicode | K-3 |
| T-10 | Animasi (`pages > 1`) ditolak atau dinyatakan tidak didukung | V-3 |
| T-11 | Finalisasi ganda (idempotensi) dan cleanup saat unggah gagal di tengah | F-3, F-2 |

---

## 12. Kekurangan yang memblokir penerimaan F0-13

**P0 — wajib sebelum F0-13 dapat diterima**

1. **P0-1** Dimensi varian tidak dijamin; kontrak harus memilih target vs batas maksimum, dan `card`/`hero` perlu batas tinggi.
2. **P0-2** Batas piksel 64 MP terlalu longgar untuk 512 MB; error limit salah dipetakan menjadi `DECODE_FAILED`.
3. **P0-3** Validasi dimensi memakai basis pra-rotasi EXIF.
4. **P0-4** Kontrak §5 masih memuat `thumb/sm/md/lg` yang bertentangan dengan PRD; harus dikoreksi sebelum dikonsumsi F0-15/16.

**P1 — wajib sebelum F0-14 dianggap selesai**

5. Kode `STORAGE_FAILED` dan `ALREADY_FINALIZED` belum ada; error storage menyamar sebagai `VARIANT_FAILED`.
6. Deteksi 404 `headObject` rapuh (`error.name` saja).
7. Objek sumber di bucket publik tanpa lifecycle/privat staging.
8. Tidak ada timeout/retry pada `S3Client`.
9. `resetStorageForTests` diekspor dari modul produksi.

**P2 — dapat menyusul, tetapi harus dicatat**

10. `sanitizeClientFilename` menolak nama sah bertanda `..`.
11. Profil warna/ICC tidak dinormalisasi.
12. Determinisme lintas versi `sharp` tidak dijamin.
13. Laporan F0-13 menyebut "tidak ada dependency baru" — sudah tidak akurat setelah F0-14 menambah `@aws-sdk/*`; laporan perlu catatan silang.

---

## 13. Urutan perbaikan yang diusulkan

1. Putuskan U-1…U-10 (dimensi, batas byte, format, kualitas, crop, batas piksel) → tulis di kontrak sebagai "keputusan pemilik".
2. Koreksi kontrak §5: nama varian + pola key + tabel error §9.2.
3. Perbaiki P0-1…P0-3 di kode, **tes ditulis lebih dulu** (T-1…T-4), lalu jalankan ulang seluruh suite.
4. Tambahkan T-6…T-9 dan T-11; perbarui laporan F0-13 dengan hasil baru.
5. Baru setelah itu F0-14 boleh menambah `STORAGE_FAILED`, idempotensi, dan lifecycle staging.
