import sharp from 'sharp'

import { MediaValidationError } from './errors'
import { validateImageBytes, type ValidatedImage } from './validate'
import {
  DEFAULT_MEDIA_LIMITS,
  MEDIA_CONTENT_TYPE,
  MEDIA_VARIANT_SPECS,
  MEDIA_VARIANTS,
  WEBP_EFFORT,
  WEBP_QUALITY,
  type MediaLimits,
  type MediaVariant,
} from './types'

export interface MediaVariantResult {
  readonly variant: MediaVariant
  readonly contentType: typeof MEDIA_CONTENT_TYPE
  readonly buffer: Buffer
  readonly width: number
  readonly height: number
  readonly byteLength: number
}

export interface ProcessedMedia {
  readonly source: ValidatedImage
  readonly variants: readonly MediaVariantResult[]
  readonly totalBytes: number
}

/**
 * Membuat seluruh varian WebP dari satu berkas sumber.
 *
 * Sumber divalidasi lebih dulu (byte, MIME nyata, dimensi). Varian tidak
 * pernah memperbesar gambar: `withoutEnlargement` membuat hasil tetap
 * <= dimensi sumber. Orientasi EXIF diterapkan sebelum resize lalu metadata
 * dibuang agar hasil deterministik.
 *
 * Fungsi ini murni terhadap I/O jaringan dan database; penyimpanan ke R2
 * adalah tanggung jawab F0-14.
 */
export async function buildMediaVariants(
  input: Uint8Array,
  limits: MediaLimits = DEFAULT_MEDIA_LIMITS,
): Promise<ProcessedMedia> {
  const source = await validateImageBytes(input, limits)
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input)
  const limitInputPixels = limits.maxWidth * limits.maxHeight

  const variants: MediaVariantResult[] = []

  for (const variant of MEDIA_VARIANTS) {
    const spec = MEDIA_VARIANT_SPECS[variant]
    try {
      const { data, info } = await sharp(buffer, { limitInputPixels, failOn: 'error' })
        .rotate()
        .resize({
          width: spec.width,
          height: spec.height ?? undefined,
          fit: spec.fit,
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
        .toBuffer({ resolveWithObject: true })

      variants.push({
        variant,
        contentType: MEDIA_CONTENT_TYPE,
        buffer: data,
        width: info.width,
        height: info.height,
        byteLength: info.size,
      })
    } catch {
      throw new MediaValidationError('VARIANT_FAILED', `Varian gambar "${variant}" gagal dibuat.`)
    }
  }

  return {
    source,
    variants,
    totalBytes: variants.reduce((total, item) => total + item.byteLength, 0),
  }
}
