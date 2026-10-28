/**
 * Kontrak varian media dan batas validasi (F0-13).
 *
 * Nama varian mengikuti PRD 2.1 dan 3.8 baris `media`: `thumb`, `card`,
 * `hero`, `og`. `docs/fase-0/kontrak.md` §5 masih menulis `thumb/sm/md/lg`;
 * itu bertentangan dengan PRD dan dicatat sebagai item keputusan di
 * laporan F0-13. PRD dipakai sebagai acuan.
 *
 * Dimensi di bawah adalah nilai teknis awal (bukan keputusan desain) yang
 * sengaja dikumpulkan di satu tempat agar mudah diubah setelah pemilik
 * memutuskan ukuran final.
 */

export const MEDIA_VARIANTS = ['thumb', 'card', 'hero', 'og'] as const
export type MediaVariant = (typeof MEDIA_VARIANTS)[number]

export type MediaFormat = 'jpeg' | 'png' | 'webp' | 'avif'
export type SniffedFormat = MediaFormat | 'gif' | 'svg' | 'unknown'

export interface VariantSpec {
  /** Lebar target dalam piksel. */
  readonly width: number
  /** Tinggi target; `null` berarti mengikuti rasio sumber. */
  readonly height: number | null
  readonly fit: 'inside' | 'cover'
}

export const MEDIA_VARIANT_SPECS: Readonly<Record<MediaVariant, VariantSpec>> = {
  thumb: { width: 320, height: 320, fit: 'cover' },
  card: { width: 960, height: null, fit: 'inside' },
  hero: { width: 1920, height: null, fit: 'inside' },
  og: { width: 1200, height: 630, fit: 'cover' },
}

export interface MediaLimits {
  readonly maxBytes: number
  readonly minWidth: number
  readonly minHeight: number
  readonly maxWidth: number
  readonly maxHeight: number
  readonly allowedFormats: readonly MediaFormat[]
}

/**
 * Batas awal. PRD 6.2 hanya mewajibkan "batas ukuran" tanpa angka untuk
 * media admin; angka 8 MB dipilih agar nyaman untuk foto kamera dan masih
 * aman untuk memori `sharp`. Konfirmasi pemilik dicatat di laporan F0-13.
 */
export const DEFAULT_MEDIA_LIMITS: MediaLimits = {
  maxBytes: 8 * 1024 * 1024,
  minWidth: 320,
  minHeight: 200,
  maxWidth: 8000,
  maxHeight: 8000,
  allowedFormats: ['jpeg', 'png', 'webp', 'avif'],
}

export const MEDIA_CONTENT_TYPE = 'image/webp'
export const WEBP_QUALITY = 82
export const WEBP_EFFORT = 4
