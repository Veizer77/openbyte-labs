import sharp, { type Metadata } from 'sharp'

import { MediaValidationError } from './errors'
import { normalizeSharpFormat, sniffImageFormat } from './sniff'
import { DEFAULT_MEDIA_LIMITS, type MediaFormat, type MediaLimits } from './types'

export interface ValidatedImage {
  readonly format: MediaFormat
  readonly width: number
  readonly height: number
  readonly bytes: number
  readonly hasAlpha: boolean
}

/**
 * Validasi byte gambar sebelum diproses atau dipublikasikan.
 *
 * Urutan pemeriksaan disengaja: ukuran byte lebih dulu (murah), lalu magic
 * number, baru decode `sharp`. SVG ditolak sebelum decode karena bisa memuat
 * skrip dan bukan gambar raster.
 */
export async function validateImageBytes(
  input: Uint8Array,
  limits: MediaLimits = DEFAULT_MEDIA_LIMITS,
): Promise<ValidatedImage> {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input)

  if (buffer.length === 0) {
    throw new MediaValidationError('EMPTY_FILE', 'Berkas kosong tidak dapat diunggah.')
  }

  if (buffer.length > limits.maxBytes) {
    throw new MediaValidationError('TOO_LARGE', 'Ukuran berkas melebihi batas yang diizinkan.')
  }

  const sniffed = sniffImageFormat(buffer)

  if (sniffed === 'svg') {
    throw new MediaValidationError('SVG_REJECTED', 'Berkas SVG tidak diizinkan.')
  }

  if (sniffed === 'unknown' || sniffed === 'gif' || !limits.allowedFormats.includes(sniffed)) {
    throw new MediaValidationError('UNSUPPORTED_TYPE', 'Format berkas tidak didukung. Gunakan JPEG, PNG, WebP, atau AVIF.')
  }

  let metadata: Metadata
  try {
    metadata = await sharp(buffer, { limitInputPixels: limits.maxWidth * limits.maxHeight, failOn: 'error' }).metadata()
  } catch {
    throw new MediaValidationError('DECODE_FAILED', 'Berkas gambar rusak atau tidak dapat dibaca.')
  }

  const actual = normalizeSharpFormat(metadata.format)
  if (actual !== sniffed) {
    // Header mengaku satu format, isi berkas lain. Jangan ditebak.
    throw new MediaValidationError('TYPE_MISMATCH', 'Isi berkas tidak sesuai dengan format yang dinyatakan.')
  }

  const { width, height } = metadata
  if (!width || !height) {
    throw new MediaValidationError('DECODE_FAILED', 'Dimensi gambar tidak dapat dibaca.')
  }

  if (width < limits.minWidth || height < limits.minHeight) {
    throw new MediaValidationError(
      'DIMENSION_TOO_SMALL',
      `Dimensi gambar minimal ${limits.minWidth}x${limits.minHeight} piksel.`,
    )
  }

  if (width > limits.maxWidth || height > limits.maxHeight) {
    throw new MediaValidationError(
      'DIMENSION_TOO_LARGE',
      `Dimensi gambar maksimal ${limits.maxWidth}x${limits.maxHeight} piksel.`,
    )
  }

  return {
    format: sniffed,
    width,
    height,
    bytes: buffer.length,
    hasAlpha: Boolean(metadata.hasAlpha),
  }
}
