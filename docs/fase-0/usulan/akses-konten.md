# Usulan Arsitektur Akses, Kontrol Konten & Settings: PRD v1.5 (F0-15..F0-17)

Tanggal: 28 Oktober 2026  
Status: DRAFT USULAN ARSITEKTUR (Fase 0)  
Acuan: `PRD_v1_5.md` (§3.1, §4.2, §5.4, §6.1, §6.2), `kontrak.md`, `prototype-publik.md`, `prototype-admin.md`  
Prinsip: Default-Deny, Server-as-Authority, Least Privilege, Zero Client Trust, Append-Only Audit

---

## 1. Matriks Otorisasi Aktor × Resource × Operasi × Field

### 1.1 Klasifikasi Aktor
1. **`anonymous`**: Klien publik tanpa sesi autentikasi.
2. **`password_only`**: Sesi autentikasi Better Auth valid tetapi pengguna belum menyelesaikan pendaftaran TOTP (`twoFactorEnabled = false`). Hanya memiliki izin akses ke endpoint enrollment 2FA.
3. **`pending_2fa`**: Status challenge transien setelah verifikasi password untuk pengguna dengan 2FA aktif; bukan sesi aktif admin. Hak akses identik dengan `anonymous`.
4. **`editor`**: Staf terautentikasi penuh dengan verifikasi TOTP selesai (`role = 'editor'`). Hanya mengelola konten publik yang diizinkan.
5. **`owner`**: Administrator utama terautentikasi penuh dengan verifikasi TOTP selesai (`role = 'owner'`). Memiliki wewenang administratif penuh; audit log tetap append-only.

### 1.2 Matriks Hak Akses Resource & Operasi

| Resource | Operasi | Anonymous | Password-only | Pending 2FA | Editor | Owner | Keterangan Batasan Field / Kebijakan |
|---|---|---|---|---|---|---|---|
| **`public_content`** | Read | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW | Hanya data berstatus `published` dan `publishedAt <= now()`. |
| | Create/Update/Delete | DENY | DENY | DENY | DENY | DENY | Mutasi harus lewat resource `website_content`. |
| **`public_submission`** | Create | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW | Form publik: Zod schema, Turnstile, honeypot, rate limit atomik (5 req/15 mnt/IP). |
| | Read/Update/Delete | DENY | DENY | DENY | DENY | DENY | Pemrosesan hanya via `operational_data`. |
| **`admin_portal`** | Read (Route `/admin/*`) | DENY | DENY* | DENY | ALLOW | ALLOW | *Password-only hanya boleh membuka `/admin/auth/2fa/enroll`. |
| **`website_content`** | Read (Draft/All) | DENY | DENY | DENY | ALLOW | ALLOW | Akses melihat daftar dan detail konten (draft/published). |
| | Create / Update | DENY | DENY | DENY | ALLOW | ALLOW | Validasi Zod per blok, sanitasi teks, verifikasi relasi. |
| | Publish | DENY | DENY | DENY | ALLOW | ALLOW | Wajib lolos validasi publikasi (larangan teks `[ISI]`, alt media wajib). |
| | Restore Version | DENY | DENY | DENY | ALLOW | ALLOW | Mengembalikan snapshot versi lama menjadi draft/published baru. |
| | Soft Delete / Trash | DENY | DENY | DENY | ALLOW | ALLOW | Mengubah status menjadi `archived` / `trashed`. |
| | Hard Delete | DENY | DENY | DENY | DENY | ALLOW | Penghapusan permanen dari basis data hanya oleh `owner`. |
| **`site_settings`** | Read | DENY | DENY | DENY | ALLOW* | ALLOW | *Editor membaca DTO tersaring (tanpa tab WhatsApp, Tracking, data rahasia). |
| | Update | DENY | DENY | DENY | ALLOW* | ALLOW | *Editor HANYA boleh mengubah field konten yang masuk allowlist (lihat Bagian 2). |
| **`operational_data`** | Read / Update | DENY | DENY | DENY | DENY | ALLOW | Inquiries, Quote Requests, Bookings, Client Projects (Rilis 2). Editor ditolak total. |
| | Delete | DENY | DENY | DENY | DENY | ALLOW | Hanya owner; data booking mengikuti status pembatalan, bukan sembarang hapus. |
| **`system_users`** | Read / Create / Update / Reset | DENY | DENY | DENY | DENY | ALLOW | Manajemen staf admin, role assignment, reset TOTP, recovery akun. |
| **`audit_logs`** | Read | DENY | DENY | DENY | DENY | ALLOW | Audit trail aktivitas sistem. Editor ditolak total. |
| | Create | DENY | DENY | DENY | DENY | DENY | Dibuat otomatis oleh internal service dalam transaksi. |
| | Update / Delete | DENY | DENY | DENY | DENY | DENY | Mutlak DILARANG untuk SEMUA AKTOR (kebijakan append-only DB & aplikasi). |
| **`media`** | Request Signed Upload | DENY | DENY | DENY | ALLOW | ALLOW | Menghasilkan pre-signed URL R2 jangka pendek (maks 5 menit). |
| | Finalize & Process (Sharp) | DENY | DENY | DENY | ALLOW | ALLOW | Verifikasi byte, konversi WebP, simpan metadata ke DB. |
| | Delete Media | DENY | DENY | DENY | DENY | ALLOW | Penghapusan berkas fisik di storage R2 hanya wewenang `owner`. |
| **`tracking_portal`** | Any (`/tracking*`) | DENY | DENY | DENY | DENY | DENY | **404 Mutlak pada Rilis 1** untuk semua aktor. |

---

## 2. Kebijakan Akses Field `site_settings` untuk Editor

Kebijakan sebelumnya memblokir seluruh resource `system_settings` untuk Editor. Hal tersebut bertentangan dengan PRD §3.1 dan §5.4 yang menetapkan bahwa Editor diperbolehkan mengelola konten website pada Settings, namun **dilarang keras** mengakses dan mengubah tab **WhatsApp** dan **Tracking**.

Berikut pemetaan izin tingkat field (*field-level permissions*) pada singleton `site_settings`:

| Tab Pengaturan | Field Domain | Izin Editor (Baca) | Izin Editor (Tulis) | Alasan Kebijakan & Batasan Keamanan |
|---|---|---|---|---|
| **`general`** | `brandName` | ALLOW | ALLOW | Identitas teks brand pada layout publik. |
| | `logo` | ALLOW | ALLOW | Media ID aset visual brand. |
| | `favicon` | ALLOW | ALLOW | Media ID favicon situs. |
| | `address` | ALLOW | ALLOW | Informasi alamat fisik perusahaan di footer. |
| | `socialLinks` | ALLOW | ALLOW | Daftar tautan media sosial perusahaan. |
| | `whatsappNumber` | ALLOW (Read) | **DENY** | Nomor bisnis utama; pengubahan nomor diarahkan hanya untuk `owner` guna mencegah pembajakan alur prospek/leads. |
| | `contactEmail` | ALLOW (Read) | **DENY** | Email resmi kontak; perubahan hanya wewenang `owner`. |
| **`hero`** | `headline` | ALLOW | ALLOW | Teks promosi utama beranda. |
| | `subheadline` | ALLOW | ALLOW | Teks pendukung hero. |
| | `primaryCtaLabel` | ALLOW | ALLOW | Label tombol CTA kalkulator/paket. |
| | `secondaryCtaLabel` | ALLOW | ALLOW | Label tombol CTA sekunder. |
| | `heroImage` | ALLOW | ALLOW | Gambar banner utama beranda. |
| | `trustMetrics` | ALLOW | ALLOW | Metrik kredibilitas (wajib data valid, dilarang klaim palsu). |
| **`navigation`**| `menuItems` | ALLOW | ALLOW | Label, urutan, dan tujuan navigasi header/footer. |
| | `footerText` | ALLOW | ALLOW | Teks hak cipta / deskripsi singkat footer. |
| **`seo`** | `defaultTitle` | ALLOW | ALLOW | Meta title bawaan situs. |
| | `defaultDescription`| ALLOW | ALLOW | Meta description bawaan situs. |
| | `defaultOgImage` | ALLOW | ALLOW | Gambar bawaan OpenGraph media sosial. |
| | `analyticsId` | **DENY** (Masked) | **DENY** | ID telemetri eksternal; manipulasi ID dapat mengganggu observabilitas / CSP. |
| **`calculator`** | `disclaimer` | ALLOW | ALLOW | Teks syarat estimasi biaya awal. |
| | `showRange` | ALLOW | ALLOW | Opsi tampilan nilai estimasi tunggal / rentang. |
| | `minimumPrice` | ALLOW (Read) | **DENY** | Nilai batas bawah proyek (finansial); penetapan harga wewenang mutlak `owner`. |
| **`booking`** | `availableModes` | ALLOW | ALLOW | Pilihan opsi konsultasi (`online`, `offline`). |
| | `slotDurationMinutes`| ALLOW (Read)| **DENY** | Parameter operasional kapasitas jadwal; dikelola `owner`. |
| | `bufferMinutes` | ALLOW (Read) | **DENY** | Parameter jeda antar-sesi; dikelola `owner`. |
| | `minDaysAhead` | ALLOW (Read) | **DENY** | Aturan booking operasional; dikelola `owner`. |
| | `maxDaysAhead` | ALLOW (Read) | **DENY** | Aturan batas reservasi jadwal; dikelola `owner`. |
| **`legal`** | `privacyPolicy` | ALLOW | ALLOW | Konten teks kebijakan privasi (RichText). |
| | `consentText` | ALLOW | ALLOW | Teks persetujuan pemrosesan data (checkbox PDP). |
| **`whatsapp`** | `tplCalculator` | **DENY** (Dihapus) | **DENY** | Template pesan WA estimasi biaya. Khusus `owner`. |
| | `tplPackageOrder` | **DENY** (Dihapus) | **DENY** | Template pemesanan paket layanan. Khusus `owner`. |
| | `tplBookingConfirm`| **DENY** (Dihapus) | **DENY** | Template konfirmasi konsultasi & URL meeting. Khusus `owner`. |
| | `tplTrackingLink` | **DENY** (Dihapus) | **DENY** | Template tautan tracking proyek klien. Khusus `owner`. |
| | `tplRevisionNotice`| **DENY** (Dihapus) | **DENY** | Template pemberitahuan revisi. Khusus `owner`. |
| **`tracking`** | `trackingEnabled` | **DENY** (Dihapus) | **DENY** | Sakelar aktivasi portal pelacakan (Rilis 2). Khusus `owner`. |
| | `revisionPolicy` | **DENY** (Dihapus) | **DENY** | Kebijakan hak revisi bawaan. Khusus `owner`. |
| | `revisionWindowDays`| **DENY** (Dihapus)| **DENY** | Durasi pengajuan revisi. Khusus `owner`. |
| | `bugWarrantyDays` | **DENY** (Dihapus) | **DENY** | Masa garansi bebas bug. Khusus `owner`. |
| | `maxLoginAttempts` | **DENY** (Dihapus) | **DENY** | Kebijakan keamanan & rate limit PIN klien. Khusus `owner`. |
| | `lockMinutes` | **DENY** (Dihapus) | **DENY** | Durasi lockout PIN tracking. Khusus `owner`. |
| | `sessionMinutes` | **DENY** (Dihapus) | **DENY** | Durasi masa aktif cookie tracking. Khusus `owner`. |

---

## 3. Spesifikasi DTO Allowlist & Batas Pemeriksaan Arsitektur

### 3.1 Lapisan Pertahanan & Batas Pemeriksaan (Defense-in-Depth)

```
[ HTTP Request ]
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Edge & Middleware Guard                                  │
│    - Origin validation & CSRF protection                    │
│    - Session token presence & base path boundary (/admin)   │
│    - Tracking portal killswitch (rewrite to 404 for R1)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Server Action / Route Handler Boundary                   │
│    - requireAdminSession(): Validasi sesi + TOTP lolos      │
│    - assertAccess(actor, resource, operation, fields)       │
│    - Zod Input Parsing (strip unknown attributes)           │
│    - Atomic Rate Limiter (tabel rate_limits)                │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Service Layer Boundary (Autoritatif Server)              │
│    - Idempotency & Database ACID Transaction                │
│    - Anti-Tamper & IDOR Check (resource ID scope check)     │
│    - Snapshot Versioning & Append-only Audit Log            │
│    - Post-Commit Cache Invalidation Trigger                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Output DTO Sanitizer Boundary                            │
│    - Allowlist projection (hapus PII, secret, IP, metadata) │
│    - Typed Response DTO returned to Client                  │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Katalog DTO Allowlist

#### A. DTO Publik (Konsumsi Browser Pengunjung)
* **`PublicHomeDTO`**: Menampung brand name, logo, menu navigasi, hero section, metrik kepercayaan, proyek unggulan terpilih, daftar ringkas paket aktif, testimoni aktif, FAQ aktif, dan footer.
* **`PublicProjectListDTO` & `PublicProjectDetailDTO`**:
  * Allowlist: `id`, `slug`, `title`, `summary`, `category` (`name`, `slug`), `technologies` (`name`, `icon`), `featuredImage`, `galleryMedia`, `liveUrl`, `publishedAt`, `layoutBlocks`.
  * Denylist (dihapus mutlak): `status` (selalu filter `published`), `clientBudget`, `internalNotes`, `clientContact`, `versionNumber`, `createdAt`, `updatedAt`, `createdById`.
* **`PublicPackageListDTO`**:
  * Allowlist: `id`, `slug`, `name`, `tagline`, `priceRupiah`, `discountPriceRupiah`, `features`, `addons`, `isPopular`.
  * Denylist: Catatan internal margin biaya, metrik konversi internal.
* **`PublicAvailabilityDTO`**:
  * Allowlist: Tanggal valid, daftar slot jam mulai & selesai (`HH:mm` WIB).
  * Denylist: Identitas pemesan lain, ID internal booking, relasi akun, catatan staf.
* **`PublicSubmissionReceiptDTO`**:
  * Allowlist: `referenceNumber` (format `OBL-YYYYMM-XXXX`), `status` (`received`), `createdAt` (WIB display).
  * Denylist: `clientIp`, `ipHash`, `internalNotes`, `id` fisik database.

#### B. DTO Admin Editor
* **`EditorSettingsDTO`**:
  * Memuat tab `general`, `hero`, `navigation`, `seo`, `calculator`, `booking`, `legal` sesuai allowlist Bagian 2.
  * Tab `whatsapp` dan `tracking` dihilangkan sepenuhnya dari respon objek JSON (`undefined`).
  * Field `analyticsId` disamarkan (`masked: true`), `minimumPrice` dan parameter durasi booking bersifat read-only.
* **`EditorContentDTO` (Proyek, Layanan, Testimoni, FAQ)**:
  * Memuat metadata konten, status (`draft`, `published`, `archived`), nomor versi aktif, daftar blok Lexical/komponen, pratinjau media.
* **`EditorDashboardDTO`**:
  * Hanya statistik operasional konten: total artikel/proyek berstatus draft vs published, media storage terpakai, draft yang membutuhkan peninjauan.
  * DILARANG memuat agregat inquiry, nilai rupiah quote request, jumlah konsultasi, data keuangan, atau ringkasan pengguna staf.

#### C. DTO Admin Owner
* **`OwnerSettingsDTO`**: Objek utuh seluruh singleton `site_settings` mencakup 9 tab form tanpa penapisan.
* **`OwnerOperationalDTO`** (`inquiries`, `quote_requests`, `bookings`):
  * Memuat nama klien, nomor WhatsApp terverifikasi, email, status alur kerja, rincian biaya resmi server, URL pertemuan konsultasi, catatan internal staf.
* **`OwnerStaffDTO`**:
  * Allowlist: `id`, `name`, `email`, `role`, `twoFactorEnabled`, `createdAt`, `updatedAt`.
  * Denylist: `password` (hash Argon2/Bcrypt), `secret` (TOTP seed), `backupCodes`, sesi aktif token.
* **`OwnerAuditLogDTO`**:
  * Allowlist: `id`, `actorEmail`, `actorRole`, `action`, `collection`, `docId`, `summary`, `diffPayload`, `ipHash`, `createdAt`.
  * Denylist: IP mentah (hanya salted hash), token rahasia, payload berisi password.

---

## 4. Mekanisme Transaksi Konten, Versioning, Audit & Cache

### 4.1 Siklus Hidup Transaksi Konten (ACID Transaction)

Setiap mutasi konten (create, update, publish, restore) dijalankan dalam satu transaksi database tunggal menggunakan Drizzle ORM (`db.transaction`).

```
                MUTASI KONTEN (Publish / Update / Restore)
                                   │
                                   ▼
                ┌──────────────────────────────────────┐
                │ 1. Buka Transaksi Database (tx)      │
                └──────────────────┬───────────────────┘
                                   │
                ┌──────────────────▼───────────────────┐
                │ 2. Validasi Aturan Bisnis            │
                │    - Larangan teks '[ISI]'           │
                │    - Validasi Alt gambar & URL aman  │
                └──────────────────┬───────────────────┘
                                   │
                ┌──────────────────▼───────────────────┐
                │ 3. Tulis Entitas Domain Utama        │
                │    - INSERT/UPDATE tabel konten      │
                │    - Increment versionNumber         │
                └──────────────────┬───────────────────┘
                                   │
                ┌──────────────────▼───────────────────┐
                │ 4. Simpan Snapshot Versi             │
                │    - INSERT ke content_versions      │
                │      (snapshot JSONB lengkap)        │
                └──────────────────┬───────────────────┘
                                   │
                ┌──────────────────▼───────────────────┐
                │ 5. Tulis Log Audit Append-Only       │
                │    - INSERT ke audit_logs            │
                │      (actor, action, diff, ipHash)   │
                └──────────────────┬───────────────────┘
                                   │
                                   ▼
                           [ Berhasil? ]
                           /          \
                     (Ya) /            \ (Tidak: Error / Pelanggaran)
                         /              \
                        ▼                ▼
            ┌──────────────────────┐   ┌───────────────────────────┐
            │ 6. Commit Transaksi  │   │ ROLLBACK Transaksi Penuh  │
            └──────────┬───────────┘   │ (Tidak ada data tersimpan)│
                       │               └───────────────────────────┘
                       ▼
            ┌──────────────────────────────────────────────┐
            │ 7. Post-Commit Trigger                       │
            │    - revalidateTag(tag)                      │
            │    - Draft cache clear                       │
            └──────────────────────────────────────────────┘
```

### 4.2 Alur Publish & Restore

#### A. Penerbitan Konten (`publish`)
1. **Pre-condition Validation**:
   * Memeriksa seluruh node teks pada dokumen dan blok: jika mengandung substring `[ISI]`, transaksi digagalkan seketika (`PublishValidationError: Konten masih memuat placeholder [ISI] yang belum disetujui`).
   * Memeriksa seluruh referensi media: setiap media wajib memiliki atribut `alt` tekstual non-kosong.
   * Memeriksa seluruh tautan eksternal: hanya skema protokol `https:`, `http:`, `mailto:`, dan `tel:` yang diizinkan.
2. **Transaction Step**:
   * Set `status = 'published'`.
   * Set `publishedAt = now()` jika sebelumnya berstatus `draft`.
   * Generate snapshot JSONB pada tabel `content_versions` dengan label `publish`.
   * Catat entri `audit_logs` dengan aksi `content.publish`.
3. **Commit & Invalidate**:
   * Setelah transaksi selesai, panggil revalidasi cache sesuai domain entitas.

#### B. Pemulihan Versi Lama (`restore`)
1. **Fetch Snapshot**: Mengambil snapshot data dari tabel `content_versions` berdasarkan `versionId` yang dipilih admin.
2. **Transaction Step**:
   * Tulis data snapshot ke tabel dokumen aktif (timpa record saat ini).
   * Nilai `versionNumber` bertambah (inkremental); history versi lama tidak pernah dihapus atau ditimpa (bersifat append-only versioning).
   * Catat entri `audit_logs` dengan aksi `content.restore` beserta `sourceVersionId`.
3. **Commit & Invalidate**:
   * Commit transaksi dan picu revalidasi cache.

### 4.3 Pratinjau Berizin (Authorized Preview via Draft Mode)

Sistem pratinjau memanfaatkan fitur bawaan Next.js `draftMode` yang diproteksi secara kriptografis:

1. **Pembuatan Token Pratinjau**:
   * Admin yang terautentikasi (memiliki sesi 2FA aktif) menekan tombol "Pratinjau" di dashboard admin.
   * Server Action menerbitkan signed JWT token bertenggat waktu singkat (kedaluwarsa dalam 10 menit) yang ditandatangani dengan secret server.
   * Payload token memuat: `userId`, `role`, `docId`, `collection`, `exp`.
2. **Aktivasi Draft Mode Endpoint (`/api/preview`)**:
   * Browser diarahkan ke Route Handler `/api/preview?token=<TOKEN>&slug=<SLUG>`.
   * Endpoint memverifikasi:
     a. Keabsahan tanda tangan kriptografis token dan waktu kedaluwarsa.
     b. Memeriksa cookie sesi admin pengirim request (memastikan sesi Better Auth + 2FA valid).
   * Jika valid, endpoint mengeksekusi `(await draftMode()).enable()` dan menyetel cookie pratinjau aman (`httpOnly`, `sameSite: 'lax'`).
   * Endpoint melakukan redirect ke rute publik tujuan (misalnya `/proyek/[slug]`).
3. **Penyajian Konten Pratinjau**:
   * Komponen server publik memeriksa `(await draftMode()).isEnabled`.
   * Jika aktif, query diarahkan membaca data versi *draft* langsung dari basis data tanpa melalui cache bertag.
   * UI menyajikan floating preview banner ("Mode Pratinjau Admin Aktif - [Keluar]") dengan tombol penonaktifan via `/api/preview/exit`.

### 4.4 Pola Invalidasi Cache Pasca-Commit (Post-Commit Invalidation)

**Anti-Pattern yang Dilarang:** Memanggil `revalidateTag()` di dalam blok transaksi basis data.  
*Risiko:* Jika revalidasi dijalankan sebelum commit DB tuntas, request publik konkuren yang masuk akan membaca snapshot DB lama dari transaction isolation level read-committed, kemudian mengisi kembali cache Next.js dengan data basi (stale-cache race condition).

**Pola Wajib (Post-Commit Invalidation):**
```typescript
// Pola eksekusi standar service
export async function executeContentMutation<T>(
  mutationFn: (tx: DatabaseTransaction) => Promise<T>,
  cacheTagsToInvalidate: string[]
): Promise<T> {
  // 1. Eksekusi transaksi DB hingga selesai commit
  const result = await db.transaction(async (tx) => {
    return await mutationFn(tx)
  })

  // 2. Transaksi terbukti sukses commit; jalankan revalidasi cache
  for (const tag of cacheTagsToInvalidate) {
    try {
      revalidateTag(tag)
    } catch (err) {
      // Catat peringatan observabilitas; jangan gagalkan respon mutasi yang sudah commit
      console.error(`Gagal revalidate tag ${tag}:`, err)
    }
  }

  return result
}
```

**Daftar Registry Tag Cache Aplikasi:**
* `'settings'`: Invalidation saat tab `site_settings` diperbarui.
* `'pages'`: Invalidation saat halaman landing (`/`), tentang, atau legal berubah.
* `'projects'`: Invalidation daftar portofolio (`/proyek`) dan detail proyek.
* `'packages'`: Invalidation daftar paket dan layanan (`/paket`).
* `'testimonials'`: Invalidation blok testimoni di seluruh halaman.
* `'faqs'`: Invalidation daftar FAQ.
* `'calculator'`: Invalidation konfigurasi item kalkulator publik.

---

## 5. Interface Usulan & Skenario Pengujian

### 5.1 Definisi Interface TypeScript (`src/access/types.ts` & `src/access/content.ts`)

```typescript
// --- Aktor & Peran ---
export type Role = 'owner' | 'editor'

export type Actor =
  | { type: 'anonymous' }
  | { type: 'password_only'; userId: string; email: string }
  | { type: 'pending_2fa'; challengeId: string }
  | { type: 'authenticated'; userId: string; email: string; role: Role }

// --- Resource Sistem ---
export type Resource =
  | 'public_content'
  | 'public_submission'
  | 'admin_portal'
  | 'website_content'
  | 'site_settings'
  | 'operational_data'
  | 'system_users'
  | 'audit_logs'
  | 'media'
  | 'tracking_portal'

export type Operation =
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'publish'
  | 'restore'
  | 'preview'

// --- Field-Level Allowlist untuk Site Settings ---
export const EDITOR_ALLOWED_SETTINGS_FIELDS = [
  // Tab General
  'general.brandName',
  'general.logo',
  'general.favicon',
  'general.address',
  'general.socialLinks',
  // Tab Hero
  'hero.headline',
  'hero.subheadline',
  'hero.primaryCtaLabel',
  'hero.secondaryCtaLabel',
  'hero.heroImage',
  'hero.trustMetrics',
  // Tab Navigation
  'navigation.menuItems',
  'navigation.footerText',
  // Tab SEO
  'seo.defaultTitle',
  'seo.defaultDescription',
  'seo.defaultOgImage',
  // Tab Calculator
  'calculator.disclaimer',
  'calculator.showRange',
  // Tab Booking
  'booking.availableModes',
  // Tab Legal
  'legal.privacyPolicy',
  'legal.consentText',
] as const

export type EditorAllowedSettingsField = (typeof EDITOR_ALLOWED_SETTINGS_FIELDS)[number]

// --- Kontrak Policy Engine ---
export interface AccessPolicyEngine {
  canAccess(
    actor: Actor,
    resource: Resource,
    operation: Operation,
    context?: { fieldPath?: string; targetStatus?: string }
  ): boolean

  assertAccess(
    actor: Actor,
    resource: Resource,
    operation: Operation,
    context?: { fieldPath?: string; targetStatus?: string }
  ): void
}

// --- Kontrak Transaksional Konten & Versioning ---
export interface ContentVersionSnapshot {
  id: string
  collection: string
  docId: string
  versionNumber: number
  snapshot: Record<string, unknown>
  createdById: string
  createdAt: Date
}

export interface ContentMutationResult<T> {
  data: T
  versionId: string
  auditLogId: string
}

export interface IContentTransactionService {
  publishDoc<T>(
    actor: Actor,
    collection: string,
    docId: string,
    payload: Record<string, unknown>
  ): Promise<ContentMutationResult<T>>

  restoreVersion<T>(
    actor: Actor,
    collection: string,
    docId: string,
    targetVersionId: string
  ): Promise<ContentMutationResult<T>>
}
```

### 5.2 Skenario Pengujian Komprehensif (Unit & Integration Test Plan)

#### A. Pengujian Positif (Happy Path)
1. `TEST-ACC-POS-01`: **Akses Publik Anonim**: Memastikan aktor `anonymous` dapat membaca `public_content` berstatus published dan dapat melakukan `create` pada `public_submission`.
2. `TEST-ACC-POS-02`: **Editor Kelola Konten**: Memastikan aktor `editor` dengan 2FA terverifikasi dapat melakukan operasi `create`, `update`, `publish`, dan `restore` pada `website_content`.
3. `TEST-ACC-POS-03`: **Editor Update Settings Terizinkan**: Memastikan aktor `editor` dapat memperbarui field yang masuk dalam `EDITOR_ALLOWED_SETTINGS_FIELDS` (misal: `hero.headline`, `general.brandName`).
4. `TEST-ACC-POS-04`: **Owner Akses Penuh**: Memastikan aktor `owner` dapat mengakses seluruh resource operasional (`inquiries`, `quote_requests`, `bookings`), memodifikasi seluruh tab settings (termasuk `whatsapp` dan `tracking`), mengelola akun staf, dan membaca audit log.
5. `TEST-ACC-POS-05`: **Transaksi Konten Lengkap**: Memastikan operasi publish konten berhasil menyimpan record dokumen, record snapshot versi baru pada `content_versions`, entri audit pada `audit_logs`, dan memicu pemanggilan `revalidateTag`.
6. `TEST-ACC-POS-06`: **Draft Mode Preview**: Memastikan token pratinjau bertanda tangan yang valid berhasil mengaktifkan Draft Mode Next.js untuk user dengan sesi 2FA aktif.

#### B. Pengujian Negatif (Security & Boundary Violation)
1. `TEST-ACC-NEG-01`: **Default Deny Tracking Portal**: Menolak akses ke `tracking_portal` dengan status HTTP 404 untuk seluruh kategori aktor (`anonymous`, `password_only`, `editor`, `owner`) pada Rilis 1.
2. `TEST-ACC-NEG-02`: **Blokade Password-Only & Pending 2FA**: Memastikan aktor tanpa TOTP lengkap ditolak dari seluruh rute `/admin/*` dan mutasi konten internal.
3. `TEST-ACC-NEG-03`: **Editor Ditolak dari Settings WhatsApp**: Memastikan aktor `editor` yang mencoba mengirim mutasi pada field `whatsapp.tplCalculator` atau `whatsapp.tplBookingConfirm` menerima error penolakan hak akses (`403 Forbidden`).
4. `TEST-ACC-NEG-04`: **Editor Ditolak dari Settings Tracking**: Memastikan aktor `editor` yang mencoba memodifikasi field `tracking.trackingEnabled` atau `tracking.sessionMinutes` ditolak keras oleh Zod schema validator dan policy engine.
5. `TEST-ACC-NEG-05`: **Editor Ditolak dari Data Operasional (IDOR Prevention)**: Memastikan aktor `editor` yang mencoba mengakses endpoint/action inquiry, booking, atau quote menerima eksepsi otorisasi dan aksinya tercatat di log audit keamanan.
6. `TEST-ACC-NEG-06`: **Editor Ditolak dari Hard Delete Konten**: Memastikan operasi `delete` pada entitas `projects` atau `pages` oleh role `editor` digagalkan (hanya diizinkan untuk `owner`).
7. `TEST-ACC-NEG-07`: **Audit Log Immutability**: Memastikan percobaan eksekusi query SQL `UPDATE` atau `DELETE` pada tabel `audit_logs` digagalkan oleh constraint database dan service layer.
8. `TEST-ACC-NEG-08`: **Penolakan Teks Placeholder `[ISI]` saat Publish**: Memastikan mutasi `publish` yang berisi substring `[ISI]` pada judul, deskripsi, atau blok rich text dibatalkan sebelum commit dengan pesan error validasi spesifik.
9. `TEST-ACC-NEG-09`: **Rollback Transaksi saat Audit Gagal**: Mensimulasikan kegagalan penulisan audit log di dalam blok transaksi; memverifikasi bahwa perubahan data konten utama dan snapshot versi ikut di-rollback secara utuh (tidak ada perubahan parsial yang tersimpan).
10. `TEST-ACC-NEG-10`: **Pencegahan Cache Poisoning Pasca-Rollback**: Memastikan fungsi `revalidateTag` TIDAK pernah dipanggil apabila transaksi database mengalami kegagalan / rollback.
11. `TEST-ACC-NEG-11`: **Pencegahan Kebocoran DTO**: Memverifikasi pengujian snapshot serializer bahwa tidak ada properti rahasia (`password`, `secret`, `backupCodes`, `ipAddress`, `internalNotes`) yang lolos ke serialisasi JSON respon publik atau editor.

---

## 6. Ringkasan Rekomendasi Penyesuaian `src/access/`

Saat implementasi Fase 2/Fase 5 dimulai, file fondasi pada `src/access/` direkomendasikan untuk disesuaikan sebagai berikut (tanpa mengubah source code saat ini):
1. **Perbaikan Definisi Aktor**: Tambahkan varian transien `{ type: 'pending_2fa'; challengeId: string }` pada `Actor` di `src/access/types.ts`.
2. **Penyempurnaan Kebijakan Settings**: Ubah `canAccess(actor, 'system_settings', ...)` di `src/access/policy.ts` dari penolakan total bagi editor menjadi evaluasi berbasis `context.fieldPath` dengan allowlist `EDITOR_ALLOWED_SETTINGS_FIELDS`.
3. **Penyelarasan DTO Sanitizer**: Tambahkan `sanitizeEditorSettingsDTO` dan `sanitizeOwnerSettingsDTO` pada `src/access/dto.ts` untuk menjamin pemisahan field sensitif sejak lapisan presentasi.
