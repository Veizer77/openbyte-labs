# Transport Layer — Server Actions & Route Handlers

**Dibangun:** mulai 30 Oktober 2026; direkonsiliasi 31 Oktober 2026.
**Status:** Server Actions, route auth, dan sebagian UI telah terhubung. Belum merupakan bukti kesiapan Rilis 1 produksi.

Sebelum ini service hanya berupa pustaka yang tidak bisa dipanggil aplikasi. Sekarang tersedia route Better Auth/login admin, 3 public Server Actions, dan 18 modul admin Server Action. Action admin BE-03 telah ditambahkan untuk layanan, testimoni, teknologi, add-on, kalkulator, pengguna, dan audit.

---

## 1. Route Handler

| Rute | Metode | Fungsi | Bukti |
|---|---|---|---|
| `/api/auth/get-session` | GET | Pembacaan sesi Better Auth; mutasi generic ditutup | belum diuji HTTP |
| `/api/admin/login` | POST | Langkah kata sandi + lockout 5/15 | `401` generik, `403` lintas-origin, `400` input salah |
| `/api/admin/totp` | POST | Verifikasi TOTP/recovery, menulis `admin_session_assurances` | unit flow in-memory; belum diuji dengan database nyata |
| `/api/admin/enroll/start`, `/confirm` | POST | Enrollment TOTP dan bukti MFA per sesi | unit flow Better Auth in-memory |
| `/health` | GET | Menjalankan `SELECT 1`; 200 saat database tersambung, 503 saat belum siap | pemeriksaan implementasi lokal; bukan uptime produksi |

Semua handler memakai `runtime = "nodejs"` dan `dynamic = "force-dynamic"`. Endpoint mutasi Better Auth generik tidak diekspos; login, verifikasi faktor, dan enrollment hanya lewat endpoint aplikasi yang menerapkan guard masing-masing.

## 2. Server Action

### Publik (`src/actions/public/`)

| Action | Service | Anti-spam | Hasil |
|---|---|---|---|
| `submitBookingAction` | `createBooking` | Turnstile + budget IP | `reference`, `slotStart/End`, `calendarUrl` |
| `submitInquiryAction` | `createInquiry` | Turnstile + budget IP | `reference`, `whatsappUrl` |
| `submitQuoteAction` | `createQuote` | Turnstile + budget IP | `reference`, `calculation`, `whatsappUrl` |

### Admin (`src/actions/admin/`)

`settings`, `packages`, `faqs`, `categories`, `bookings`, `inquiries`, `quotes`, `schedule`, `media`, `pages`, `projects`, `services`, `testimonials`, `technologies`, `service-addons`, `calculator`, `users`, `audit-logs`.

Setiap action admin memanggil `requireAdmin()` → `requireAdminSession()` → `authorize()`. Menyembunyikan menu tidak pernah menjadi otorisasi.

## 3. Kontrak Hasil

Semua action mengembalikan nilai, tidak melempar error ke klien:

```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: ActionErrorCode; message: string };
```

`toFailure()` memetakan galat domain (`AccessDeniedError`, `BookingSubmissionError`, dst.) ke kode stabil. Galat tak dikenal **tidak** diteruskan pesannya — hanya `"Permintaan tidak dapat diproses. Coba lagi."` dan dicatat di server.

## 4. Keputusan Keamanan

| Keputusan | Alasan |
|---|---|
| `isSameOrigin()` pada semua POST admin | Route Handler tidak mendapat proteksi origin bawaan Server Action (PRD 6.2). Tanpa `Origin` → ditolak. |
| Pool terpisah untuk lock login (`getLoginDb`, max 2) | Transaksi lock menahan koneksi selama Better Auth memverifikasi kata sandi. Dengan satu pool `max: 1`, keduanya saling menunggu (deadlock) — sudah dibuktikan dan diperbaiki. |
| Pesan login selalu generik | Membedakan "email tidak ada" dan "kata sandi salah" membocorkan daftar akun. |
| Turnstile wajib di produksi | `getEnv()` menolak boot produksi tanpa `TURNSTILE_SECRET_KEY` dan `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; development boleh tanpa kunci. |
| Variabel opsional kosong = tidak diatur | Panel deployment sering menulis `SENTRY_DSN=`; tanpa normalisasi, aplikasi gagal boot. |
| Origin produksi tervalidasi | `SITE_URL` produksi wajib HTTPS dan bukan loopback; bila `BETTER_AUTH_URL` diisi, origin-nya harus sama. Pengujian lokal memakai `NODE_ENV` non-produksi. |
| CSP per-request | `src/proxy.ts` membuat nonce per request untuk script/style Next, membatasi sumber Turnstile, dan hanya mengizinkan origin media R2 yang dikonfigurasi. Perlu validasi browser terhadap seluruh alur eksternal. |
| HSTS produksi | `Strict-Transport-Security` hanya dikirim saat `NODE_ENV=production`; domain dan deployment HTTPS tetap harus disetujui sebelum aktivasi. |
| Konfigurasi R2 | Semua variabel R2 divalidasi sebagai satu set; isi lengkap atau kosongkan seluruhnya. |

## 5. Konfigurasi Lingkungan

`src/env.ts` memvalidasi seluruh env dengan Zod, **lazy** (bukan saat import) supaya `next build` tidak butuh rahasia.

Wajib: `DATABASE_URI`, `BETTER_AUTH_SECRET` (≥32), `IP_HASH_SALT` (≥32).
Default development: `SITE_URL=http://localhost:3000`; produksi wajib menetapkan `SITE_URL` HTTPS. `BETTER_AUTH_URL`, bila diisi, harus satu origin dengan `SITE_URL`. Produksi memerlukan `TURNSTILE_SECRET_KEY` dan `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Variabel `R2_*` harus lengkap atau kosong seluruhnya. `SENTRY_DSN` tetap opsional dan integrasinya belum aktif.

`src/env.ts` menolak runtime tanpa nilai wajib yang valid. Skrip migrasi/owner/seed/preflight memakai target direct terpisah dan konfirmasi operator; jangan memakai konfigurasi runtime sebagai persetujuan target tulis. Contoh variabel tersedia di `.env.example`; jangan menampilkan atau membagikan nilai secret.

## 6. Cara Menguji Manual

```bash
# 1. Baca sesi Better Auth (tanpa cookie umumnya null)
curl -i http://localhost:3001/api/auth/get-session

# 2. Origin guard
curl -i -X POST http://localhost:3001/api/admin/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"a@b.co","password":"x"}'            # 403

# 3. Kredensial salah (butuh database hidup)
curl -i -X POST http://localhost:3001/api/admin/login \
  -H 'Content-Type: application/json' -H 'Origin: http://localhost:3001' \
  -d '{"email":"owner@example.com","password":"salah"}'   # 401
```

Hasil yang sudah dibuktikan pada build produksi lokal di checkpoint sebelumnya (bukan pengujian owner/TOTP Neon):

```
GET /api/auth/get-session → route Better Auth yang diizinkan
login tanpa Origin      → 403 {"error":"Permintaan lintas-origin ditolak."}
login Origin asing      → 403
body tidak valid        → 400
kredensial salah        → 401 (pesan generik)
6 percobaan berturut    → 401 semua, 1 kunci terkunci di rate_limits
```

## 7. Yang Belum

| Kebutuhan | Dampak |
|---|---|
| Login/TOTP end-to-end pada Neon | Route aplikasi dan flow unit tersedia; kompatibilitas Better Auth/Drizzle dan seluruh langkah auth belum diuji end-to-end terhadap Neon |
| `owner:reset` | CLI break-glass tersedia, meminta target dan konfirmasi `RESET`, mengganti password, menonaktifkan 2FA, mencabut sesi, dan mengaudit; jangan jalankan tanpa target yang disetujui |
| Integrasi UI belum menyeluruh | Form publik booking/inquiry/quote dan layar admin proyek, layanan, kategori/teknologi, media, kalkulator, booking/jadwal, inquiry, serta quote terhubung. Settings, Page Builder, paket/add-on, FAQ/testimoni, staf, audit UI, billing, dan portal tetap preview atau belum memanggil action. |
| Health dan observability | `/health` mengecek DB. CSP/HSTS dan security headers sudah dikonfigurasi, tetapi belum divalidasi pada deployment; Sentry, uptime monitor, backup, dan uji restore belum selesai. |
| Verifikasi layanan eksternal | Enam aset katalog dev melewati importer, staging privat, finalisasi, dan varian WebP. Turnstile belum diuji ke Cloudflare; konfigurasi R2 produksi belum diuji. |
| Cache | Route katalog memakai `force-dynamic` dan membaca DB per request; belum memakai fetch cache bertag. Jangan mengklaim integrasi cache tag end-to-end. |
| Status akun | Harus diverifikasi pemilik pada target yang disetujui; status akun/kredensial tidak disimpan di dokumen. Flow in-memory bukan bukti login/TOTP end-to-end. |

## 8. Verifikasi

Typecheck, lint, unit test, dan build pada tabel berikut dijalankan setelah perubahan readiness pada 31 Oktober 2026. Tes integrasi dan layanan eksternal tidak dijalankan ulang.

| Pemeriksaan | Hasil |
|---|---|
| Unit tests | **237 lulus** di 54 berkas setelah perubahan readiness pada 31 Oktober 2026 |
| `pnpm test:integration` | Checkpoint terdokumentasi: **7 lulus** di 3 berkas pada `openbyte_r1_test` branch dev; suite tidak dijalankan ulang dalam pembaruan dokumen ini |
| `pnpm typecheck` | Lulus pada verifikasi saat ini |
| `pnpm lint` | Lulus tanpa error atau warning setelah perubahan readiness pada 31 Oktober 2026 |
| `pnpm audit --prod` | Tidak ada advisory dikenal setelah override terarah `esbuild` ke `0.25.12`; `@esbuild-kit` tetap deprecated |
| `pnpm build` | Lulus pada Next.js 16.4.3 setelah perubahan readiness pada 31 Oktober 2026 |
