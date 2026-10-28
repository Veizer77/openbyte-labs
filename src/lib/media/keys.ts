import { MediaValidationError } from './errors'
import { MEDIA_VARIANTS, type MediaVariant } from './types'

/**
 * Object key dibuat server. Nama berkas kiriman klien tidak pernah dipakai
 * sebagai key, hanya sebagai metadata tampilan setelah dibersihkan.
 */

const MEDIA_ID_PATTERN = /^[A-Za-z0-9_-]{21,32}$/
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/

export function assertMediaId(mediaId: string): void {
  if (!MEDIA_ID_PATTERN.test(mediaId)) {
    throw new MediaValidationError('INVALID_MEDIA_ID', 'ID media tidak valid.')
  }
}

export function isMediaVariant(value: string): value is MediaVariant {
  return (MEDIA_VARIANTS as readonly string[]).includes(value)
}

export interface ObjectKeyInput {
  readonly mediaId: string
  readonly variant: MediaVariant
  /** Tanggal pembuatan; selalu dipakai dalam UTC. */
  readonly date: Date
}

/** Prefix server-side: `media/YYYY/MM/{id}` dalam UTC. */
export function buildMediaPrefix({ mediaId, date }: { mediaId: string; date: Date }): string {
  assertMediaId(mediaId)
  const year = date.getUTCFullYear().toString().padStart(4, '0')
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  return `media/${year}/${month}/${mediaId}`
}

/** Objek sumber sementara hasil signed upload; tidak pernah dipublikasikan. */
export function buildSourceKey({ mediaId, date }: { mediaId: string; date: Date }): string {
  return `${buildMediaPrefix({ mediaId, date })}/source`
}

export function buildObjectKey({ mediaId, variant, date }: ObjectKeyInput): string {
  if (!isMediaVariant(variant)) {
    throw new MediaValidationError('INVALID_MEDIA_ID', 'Varian media tidak dikenal.')
  }
  return `${buildMediaPrefix({ mediaId, date })}/${variant}.webp`
}

/**
 * Membersihkan nama berkas kiriman klien untuk keperluan metadata.
 * Path traversal, pemisah direktori, nama tersembunyi, dan karakter kontrol
 * ditolak. Ekstensi tidak dipercaya dan tidak menentukan tipe berkas.
 */
export function sanitizeClientFilename(name: string): string {
  const trimmed = name.trim()
  if (trimmed.length === 0 || trimmed.length > 200) {
    throw new MediaValidationError('UNSAFE_FILENAME', 'Nama berkas tidak valid.')
  }
  if (CONTROL_CHARS.test(trimmed)) {
    throw new MediaValidationError('UNSAFE_FILENAME', 'Nama berkas tidak valid.')
  }
  if (trimmed.includes('/') || trimmed.includes('\\') || trimmed.includes('..')) {
    throw new MediaValidationError('UNSAFE_FILENAME', 'Nama berkas tidak valid.')
  }
  if (trimmed.startsWith('.')) {
    throw new MediaValidationError('UNSAFE_FILENAME', 'Nama berkas tidak valid.')
  }
  return trimmed
}
