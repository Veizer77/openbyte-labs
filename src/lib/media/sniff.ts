import type { MediaFormat, SniffedFormat } from './types'

/**
 * Deteksi format dari byte sebenarnya (magic number), bukan dari nama file
 * atau `Content-Type` yang dikirim browser.
 *
 * `sharp` tetap dipakai sebagai pemeriksa kedua saat decode; fungsi ini
 * murah dan berjalan sebelum alokasi memori besar.
 */

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

function ascii(bytes: Buffer, start: number, end: number): string {
  return bytes.subarray(start, end).toString('latin1')
}

function looksLikeSvg(bytes: Buffer): boolean {
  // BOM UTF-8 dan spasi di awal tetap mungkin; SVG adalah teks, bukan biner.
  const head = bytes.subarray(0, Math.min(bytes.length, 1024)).toString('utf8').replace(/^\uFEFF/, '').trimStart()
  if (!head.startsWith('<')) return false
  const lowered = head.toLowerCase()
  return lowered.includes('<svg') || (lowered.startsWith('<?xml') && lowered.includes('svg'))
}

export function sniffImageFormat(bytes: Buffer): SniffedFormat {
  if (bytes.length === 0) return 'unknown'

  if (bytes.length >= PNG_SIGNATURE.length && bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    return 'png'
  }

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg'
  }

  if (bytes.length >= 12 && ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') {
    return 'webp'
  }

  if (bytes.length >= 6) {
    const signature = ascii(bytes, 0, 6)
    if (signature === 'GIF87a' || signature === 'GIF89a') return 'gif'
  }

  if (bytes.length >= 12 && ascii(bytes, 4, 8) === 'ftyp') {
    const brands = ascii(bytes, 8, Math.min(bytes.length, 32))
    if (brands.includes('avif') || brands.includes('avis')) return 'avif'
  }

  if (looksLikeSvg(bytes)) return 'svg'

  return 'unknown'
}

/**
 * Menyamakan penamaan format `sharp` dengan kontrak kita. `sharp` melaporkan
 * AVIF sebagai `heif` pada beberapa versi, sehingga keduanya dipetakan ke
 * `avif` agar pemeriksaan silang tidak memberi positif palsu.
 */
export function normalizeSharpFormat(format: string | undefined): MediaFormat | 'gif' | 'svg' | 'unknown' {
  switch (format) {
    case 'jpeg':
    case 'png':
    case 'webp':
    case 'avif':
      return format
    case 'heif':
      return 'avif'
    case 'gif':
      return 'gif'
    case 'svg':
      return 'svg'
    default:
      return 'unknown'
  }
}
