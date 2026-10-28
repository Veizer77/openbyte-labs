import 'server-only'

import { assertAccess, type Actor } from '../../access'
import {
  DEFAULT_MEDIA_LIMITS,
  MediaValidationError,
  buildMediaVariants,
  buildMediaPrefix,
  buildObjectKey,
  buildSourceKey,
  type MediaLimits,
  type MediaVariant,
} from '../../lib/media'
import { deleteObject, getObjectBytes, headObject, publicUrlFor, putObject } from './r2'

/**
 * Finalisasi unggahan media (F0-14).
 *
 * Alur: periksa izin → baca objek otoritatif dari R2 → validasi byte lewat
 * pipeline F0-13 → unggah varian WebP → hapus objek sumber.
 *
 * Belum ada penulisan ke database: tabel `media` dan audit belum tersedia
 * (menunggu keputusan schema). Karena itu fungsi ini mengembalikan metadata
 * agar pemanggil (service admin) dapat menyimpannya dalam transaksi.
 */

export interface FinalizedVariant {
  readonly variant: MediaVariant
  readonly key: string
  readonly url: string
  readonly width: number
  readonly height: number
  readonly byteLength: number
}

export interface FinalizedMedia {
  readonly mediaId: string
  readonly prefix: string
  readonly source: {
    readonly format: string
    readonly width: number
    readonly height: number
    readonly bytes: number
  }
  readonly variants: readonly FinalizedVariant[]
  readonly totalBytes: number
}

export interface FinalizeInput {
  readonly actor: Actor
  readonly mediaId: string
  readonly date?: Date
  readonly limits?: MediaLimits
}

export async function finalizeMediaUpload({
  actor,
  mediaId,
  date = new Date(),
  limits = DEFAULT_MEDIA_LIMITS,
}: FinalizeInput): Promise<FinalizedMedia> {
  // Editor boleh mengelola media konten; anonim dan sesi password-only ditolak.
  assertAccess(actor, 'website_content', 'create')

  const sourceKey = buildSourceKey({ mediaId, date })
  const head = await headObject(sourceKey)
  if (!head.exists) {
    throw new MediaValidationError('EMPTY_FILE', 'Objek unggahan tidak ditemukan.')
  }
  if (head.byteLength > limits.maxBytes) {
    // Hapus objek yang melanggar agar tidak menumpuk di bucket.
    await deleteObject(sourceKey)
    throw new MediaValidationError('TOO_LARGE', 'Ukuran berkas melebihi batas yang diizinkan.')
  }

  const bytes = await getObjectBytes(sourceKey, limits.maxBytes)

  let processed
  try {
    processed = await buildMediaVariants(bytes, limits)
  } catch (error) {
    // Berkas tidak valid tidak boleh tertinggal di bucket.
    await deleteObject(sourceKey).catch(() => undefined)
    throw error
  }

  const uploaded: string[] = []
  try {
    const variants: FinalizedVariant[] = []
    for (const item of processed.variants) {
      const key = buildObjectKey({ mediaId, variant: item.variant, date })
      await putObject(key, item.buffer, item.contentType)
      uploaded.push(key)
      variants.push({
        variant: item.variant,
        key,
        url: publicUrlFor(key),
        width: item.width,
        height: item.height,
        byteLength: item.byteLength,
      })
    }

    // Sumber sudah tidak diperlukan: varian WebP adalah bentuk kanonik.
    await deleteObject(sourceKey).catch(() => undefined)

    return {
      mediaId,
      prefix: buildMediaPrefix({ mediaId, date }),
      source: {
        format: processed.source.format,
        width: processed.source.width,
        height: processed.source.height,
        bytes: processed.source.bytes,
      },
      variants,
      totalBytes: processed.totalBytes,
    }
  } catch (error) {
    // Kegagalan parsial: bersihkan varian yang sudah terunggah.
    await Promise.all(uploaded.map((key) => deleteObject(key).catch(() => undefined)))
    throw error instanceof MediaValidationError
      ? error
      : new MediaValidationError('VARIANT_FAILED', 'Varian media gagal disimpan.')
  }
}
