# Transport Layer — Server Actions & Route Handlers

**Dibangun:** mulai 30 Oktober 2026; direkonsiliasi 31 Oktober 2026; diperbarui 4 November 2026 (Rilis 1 final).
**Status:** Server Actions dan route auth terhubung. Rilis 1 berjalan di produksi dengan Sentry aktif dan indexing menyala; lihat `docs/RELEASE-1-2026-11-03.md` untuk status gate terkini.

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
Default development: `SITE_URL=http://localhost:3000`; produksi wajib menetapkan `SITE_URL` HTTPS. `BETTER_AUTH_URL`, bila diisi, harus satu origin dengan `SITE_URL`. Produksi memerlukan `TURNSTILE_SECRET_KEY` dan `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Variabel `R2_*` harus lengkap atau kosong seluruhnya. `SENTRY_DSN` opsional; di produksi nilainya **terpasang** dan integrasinya aktif.

Produksi memakai endpoint **pooler** (`-pooler`) untuk `DATABASE_URI` karena 4× lebih cepat (367 ms vs 1467 ms pada kueri yang sama) dan tetap mendukung prepared statement. Operasi operator (migrasi, seed, preflight, sync, backup) tetap memakai `DATABASE_URI_DIRECT`.

### Sentry (status 4 November 2026)

Integrasi terpasang dan **menerima event** di produksi:

- `src/instrumentation.ts` — `register()` menginisialisasi SDK server hanya bila `NEXT_RUNTIME === "nodejs"`, `SENTRY_DSN` terisi, dan `NODE_ENV === "production"`. `onRequestError` meneruskan error request ke Sentry.
- `src/instrumentation-client.ts` — inisialisasi klien dengan `NEXT_PUBLIC_SENTRY_DSN`, replay dan tracing dimatikan (`tracesSampleRate: 0`).
- `src/lib/monitoring.ts` — `beforeSend` membuang `user`, `request`, `breadcrumbs`, `extra`, `contexts`, `tags`, isi variabel frame, dan menormalkan pesan menjadi "Application error". Stack trace tetap dikirim agar error bisa dilacak tanpa membocorkan data pengguna.

Bukti: DSN valid, endpoint ingest merespons `401` tanpa auth (hidup), DSN ter-embed di chunk client produksi, dan event uji diterima dengan HTTP 200 + event id.

**Source map (build-time).** Upload artifact diaktifkan lewat `withSentryConfig` di `next.config.ts`. Pembungkus itu **opsional dan bergerbang**: hanya dipakai bila `SENTRY_ORG`, `SENTRY_PROJECT`, dan `SENTRY_AUTH_TOKEN` semuanya terisi. Tanpa ketiganya (mis. job `quality` di CI yang hanya menjalankan `pnpm build`), konfigurasi keluar apa adanya sebagai `next build` biasa tanpa menghubungi Sentry.

- `org`/`project` **bukan secret**; nilainya diisi dari environment, dan `SENTRY_AUTH_TOKEN` dibaca build plugin langsung dari environment serta tidak pernah ditulis di `next.config.ts`.
- `widenClientFileUpload: true` ikut meng-upload chunk framework/Next internal, bukan hanya chunk aplikasi.
- `deleteSourcemapsAfterUpload: true` menghapus `.map` dari output setelah percobaan upload, sehingga source map tidak pernah ikut tersaji dari deployment. Konsekuensinya kegagalan upload hanya menghilangkan symbolication, bukan membocorkan kode.
- `telemetry: false` mematikan telemetri build SDK; `suppressOnRouterTransitionStartWarning: true` karena navigasi tracing memang dimatikan (`tracesSampleRate: 0`).
- Build lokal dengan token dummy membuktikan wiring-nya jalan (plugin memanggil Sentry dan gagal `401`), dan `tests/unit/sentry-build-wiring.test.ts` menjaga agar gerbang token tidak hilang dan token tidak pernah masuk ke berkas konfigurasi.

**Bukti produksi (4 November 2026).** Deploy `dpl_3m4h5NvzQEFPX4hgz7yBEj97r4xp` (`openbyte-labs-liwm0mbok-...`) mencetak di build log:

```text
[@sentry/nextjs - After Production Compile] Info: Successfully uploaded source maps to Sentry
```

Verifikasi pendukung pada deploy yang sama: `/`, `/paket`, `/proyek`, `/robots.txt`, `/sitemap.xml` = 200, `/health` = `{"status":"ok","database":"connected"}`, dan setiap `/_next/static/**.js.map` menjawab **403** (source map tidak tersaji dari deployment). Dua run CI terakhir (`41869544947`, `41870222429`) tetap `success`, membuktikan gerbang no-op saat token tidak ada.

Catatan: `SENTRY_ORG` dan `SENTRY_PROJECT` diisi dengan **ID numerik** dari DSN (`o4512366287454208` → `4512366287454208`, project `4512370815401984`), bukan slug. Sentry menerima keduanya sebagai identitas organisasi/proyek, sehingga tidak perlu slug tekstual. Keduanya bukan secret, tetapi tetap disimpan sebagai env terenkripsi Vercel.

**Audit issue Sentry (6 November 2026).** Tiga issue muncul di dashboard dan sudah
didiagnosis, bukan dibiarkan:

| Issue | Level | Event | Kesimpulan |
|---|---|---|---|
| `OPENBYTE-LABS-1` | Info | 1 | Event verifikasi koneksi (`release-1-verification`) |
| `OPENBYTE-LABS-2` | Error | 1 | Unhandled SSR, kelompok sama dengan #3 |
| `OPENBYTE-LABS-3` | Error | 11 | Unhandled SSR dari mesin lokal pemilik |

`OPENBYTE-LABS-3` **bukan error produksi**. Buktinya: `server: WIN-HRI5K8PH2V3`
(nama mesin Windows), path stack trace
`C:\FLUTTER PROJEK\gabut\OpenByteLabs\.next\server\chunks\ssr\` (disk lokal, bukan
`/var/task` container Vercel), 11 event dalam 20 detik (`03:04:30Z`–`03:04:50Z`),
tanpa browser/user agent/session/request path, dan pemilik mengonfirmasi sedang
menjalankan smoke test UI lokal pada jam itu.

Pesan `Unexpected application error (details withheld)` berasal dari
`sanitizeMonitoringEvent` di `src/lib/monitoring.ts`, bukan dari Next.js. Source
map tidak terbaca karena build lokal tidak memakai `SENTRY_AUTH_TOKEN`; build
Vercel sendiri tetap mengunggah source map.

Verifikasi bahwa kelas error yang sama tidak terjadi di produksi: `GET /health`
→ `200`, `GET /path-yang-tidak-ada-xyz-12345` → `404`,
`GET /proyek/slug-tidak-ada-xyz-999` → `404`,
`GET /paket/slug-tidak-ada-xyz-888` → `404`. Catch-all route memakai `notFound()`
sehingga path tak dikenal menghasilkan 404, bukan 500. Log produksi `--level
error` (100 baris terakhir) mengembalikan nol baris.

### Turnstile (status 4 November 2026)

Kunci produksi terpasang dan berpasangan benar (`siteverify` dengan token dummy → `invalid-input-response`, artinya secret dikenali). CSP membatasi `script-src`/`frame-src`/`connect-src` ke hostname Turnstile pelanggan (lihat `src/proxy.ts`).

Uji otomatis membuktikan lapisan anti-spam menolak 4/4 percobaan (token palsu dan honeypot terisi) dengan kode `anti_spam`, tanpa membuat data nyata dan tanpa memakai budget rate-limit. Token Turnstile **sungguhan** tidak bisa diperoleh dari browser otomatis — challenge Cloudflare tidak selesai bahkan pada halaman polos tanpa CSP dengan test-key yang memaksa challenge — sehingga submission asli per form harus dilakukan manusia dengan browser biasa.

**Konsekuensi yang perlu diingat:** custom domain menuntut kunci Turnstile baru karena kunci terikat hostname, sehingga pergantian domain tidak cukup dengan mengubah DNS.

`src/env.ts` menolak runtime tanpa nilai wajib yang valid. Skrip migrasi/owner/seed/preflight memakai target direct terpisah dan konfirmasi operator; jangan memakai konfigurasi runtime sebagai persetujuan target tulis. Contoh variabel tersedia di `.env.example`; jangan menampilkan atau membagikan nilai secret.

### Alamat klien dan rate limit (status 7 November 2026)

Rate limit form publik dan login admin bergantung pada satu asumsi: alamat yang
dibaca benar-benar ditetapkan proxy, bukan dikirim klien.

`TRUSTED_IP_HEADER` di produksi disimpan sebagai environment **sensitif**, sehingga
`vercel env pull` mengembalikan penanda `SENSITIVE` dan nilainya tidak dapat
diverifikasi dari CLI. Karena itu `clientIpHash` di `src/security/client-ip.ts`
tidak lagi bergantung pada satu header saja:

1. header yang dinamai `TRUSTED_IP_HEADER` dibaca lebih dulu;
2. bila kosong atau tidak ada, pembacaan berlanjut ke
   `x-vercel-forwarded-for`, lalu `x-real-ip`, lalu `x-forwarded-for`;
3. alamat paling kiri diambil, port dan bracket IPv6 dibuang, lalu di-hash
   dengan `IP_HASH_SALT`;
4. bila keempat header tidak ada, permintaan ditolak dengan
   `Alamat klien tidak tersedia` alih-alih memakai alamat palsu.

Menurut dokumentasi Vercel (*Request headers*), Vercel menimpa `X-Forwarded-For`
dan tidak meneruskan IP eksternal, sehingga nilai paling kiri tidak dapat
dipalsukan klien pada deployment Vercel. `x-vercel-forwarded-for` identik tetapi
tidak dapat ditimpa proxy tambahan di atas Vercel, jadi ia dicoba lebih dulu.

Konsekuensi yang perlu diketahui: bila `TRUSTED_IP_HEADER` di produksi ternyata
diisi nama header yang tidak pernah dikirim Vercel, sistem tetap berfungsi lewat
fallback dan tidak pernah memakai nilai kosong. Untuk mengubah nilainya secara
sengaja, lakukan dari dashboard Vercel lalu redeploy; jangan menebak nilai lama
karena nilainya tidak dapat dibaca.

Tes penjaga: `tests/unit/client-ip.test.ts` (10 tes) mengunci urutan fallback,
normalisasi port/IPv6, dan penolakan saat header tidak tersedia.

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

## 7. Batas bukti dan catatan terbuka

| Kebutuhan | Dampak |
|---|---|
| Login/TOTP end-to-end pada Neon | Akun owner dengan TOTP aktif sudah ada di produksi dan sesi ditolak tanpa faktor kedua. Verifikasi dilakukan lewat data assurance per sesi, bukan sekadar flag pengguna. |
| `owner:reset` | CLI break-glass tersedia, meminta target dan konfirmasi `RESET`, mengganti password, menonaktifkan 2FA, mencabut sesi, dan mengaudit; jangan jalankan tanpa target yang disetujui |
| Integrasi UI | ✅ Seluruh **22 rute** pada `liveRoutes` (`src/app/admin/[[...path]]/page.tsx`) memakai Server Actions: konten, CMS (settings/pages/FAQ/testimoni/paket/add-on/kalkulator), operasional (booking/inquiry/quote/proyek-klien/template/invoice/berkas), dan sistem (users/audit-logs). Portal `/tracking` aktif di produksi sejak 10 November 2026. |
| Health dan observability | `/health` mengecek DB dan mengembalikan 200 di produksi (endpoint pooler). CSP/HSTS dan security headers aktif dan tervalidasi pada deployment. Sentry menerima event dan source map di-upload saat build (bergerbang token). Monitoring 24 jam pasca-launch dinilai penuh: 5 deployment `Ready`, nol error/fatal runtime di Vercel, 53 operasi Neon `failures_count: 0`, nol login admin gagal, dan catch-all route menjawab 404 (bukan 500) untuk path tak dikenal. Issue Sentry `OPENBYTE-LABS-2`/`-3` terdiagnosis berasal dari smoke test di mesin Windows lokal pemilik, bukan produksi. Uptime monitor dipasang di GitHub Actions (`.github/workflows/uptime.yml`, lihat di bawah); uji restore sudah lulus. |
| Verifikasi layanan eksternal | 9 objek media terdaftar di database dan merujuk bucket R2 publik. Turnstile aktif di produksi dan submission asli sudah diuji manusia 3/3 (`INQ-2611-V23Y`, `QTE-2611-RSC6`, `BKG-2611-Q76A`). |
| Cache | Route katalog memakai `force-dynamic` dan membaca DB per request; belum memakai fetch cache bertag. Jangan mengklaim integrasi cache tag end-to-end. |
| Status akun | Akun owner produksi terverifikasi lewat pembacaan database (peran, status aktif, TOTP verified, backup codes). Kredensial dan secret tidak disimpan di dokumen. |

### Uptime monitor (status 7 November 2026)

`.github/workflows/uptime.yml` menjalankan dua pemeriksaan dengan interval berbeda.
Pemisahan ini disengaja: PRD 6.7 memperingatkan bahwa memeriksa `/health` terlalu
sering membuat Neon tidak pernah suspend dan menghabiskan jatah compute gratis.

| Pemeriksaan | Interval | Target | Menyentuh DB |
|---|---|---|---|
| Halaman statis | tiap 15 menit (`7,22,37,52 * * * *`) | `/robots.txt` harus `200` | tidak |
| Kesiapan aplikasi | tiap 6 jam (`23 */6 * * *`) | `/health` harus `status: ok` + `database: connected` | ya, satu query |

Bila pemeriksaan terjadwal gagal, job `report` membuka issue berlabel `uptime`
(atau menambah komentar pada issue terbuka yang sama) berisi tautan run dan waktu
kegagalan. Tidak ada layanan berbayar yang dipakai; label dibuat otomatis bila
belum ada. Pemicu manual tersedia lewat `workflow_dispatch` dengan pilihan
`both`, `static`, atau `health`.

## 8. Verifikasi

Typecheck, lint, unit test, dan build diverifikasi ulang pada 3 November 2026 (Rilis 1). Tes integrasi dijalankan terhadap database uji terisolasi.

| Pemeriksaan | Hasil |
|---|---|
| Unit tests | **366 lulus** di 77 berkas (4 Nov 2026) |
| `pnpm test:integration` | **17 lulus** di 5 berkas terhadap database uji terisolasi |
| `pnpm typecheck` | Lulus |
| `pnpm lint` | 0 error, 9 warning (variabel tak terpakai, 1 `<img>`) |
| `pnpm db:preflight --allow-production` | Lulus 12/12 pemeriksaan pada `main.openbyte_labs` |
| `pnpm build` | Lulus pada Next.js 16.4.3 |
| Smoke produksi | **26 dari 26** rute sesuai harapan (`SMOKE_INDEXING_ENABLED=true`, `SMOKE_TRACKING_ENABLED=false`) |
