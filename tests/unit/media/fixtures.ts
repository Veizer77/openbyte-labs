import sharp from 'sharp'

/**
 * Fixture media untuk F0-13. Dibuat deterministik saat tes berjalan agar
 * tidak ada biner besar di repositori, dan agar berkas "rusak"/"palsu" bisa
 * dibuat persis sesuai skenario yang diuji.
 */

export const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

export function createRaster(
  format: 'png' | 'jpeg' | 'webp',
  width = 1200,
  height = 800,
): Promise<Buffer> {
  const base = sharp({
    create: { width, height, channels: 3, background: { r: 32, g: 96, b: 160 } },
  })
  switch (format) {
    case 'png':
      return base.png().toBuffer()
    case 'jpeg':
      return base.jpeg({ quality: 90 }).toBuffer()
    case 'webp':
      return base.webp({ quality: 90 }).toBuffer()
  }
}

/** SVG teks: harus ditolak sebelum decode, meskipun berisi markup sah. */
export const SVG_BYTES = Buffer.from(
  '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><script>alert(1)</script><rect width="600" height="400" fill="#000"/></svg>',
  'utf8',
)

/** SVG dengan BOM dan spasi di awal, tetap harus dikenali sebagai SVG. */
export const SVG_WITH_BOM = Buffer.concat([
  Buffer.from([0xef, 0xbb, 0xbf]),
  Buffer.from('   \n<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>', 'utf8'),
])

/** GIF minimal: header sah, tidak ada di whitelist. */
export const GIF_BYTES = Buffer.from('GIF89a\x01\x00\x01\x00\x00\x00\x00;', 'latin1')

/** Teks biasa: format tidak dikenal. */
export const TEXT_BYTES = Buffer.from('bukan gambar sama sekali', 'utf8')

/** PNG terpotong: signature utuh, isi tidak lengkap. */
export async function truncatedPng(): Promise<Buffer> {
  const png = await createRaster('png', 400, 300)
  return png.subarray(0, 40)
}

/** Byte besar dengan signature PNG: memicu batas ukuran tanpa decode. */
export function oversizePng(totalBytes: number): Buffer {
  const body = Buffer.alloc(Math.max(totalBytes - PNG_SIGNATURE.length, 0), 0x00)
  return Buffer.concat([PNG_SIGNATURE, body])
}

/** Header WebP yang mengaku AVIF/format lain tetapi isinya bukan gambar. */
export const FAKE_FTYP = Buffer.concat([
  Buffer.from([0x00, 0x00, 0x00, 0x20]),
  Buffer.from('ftypavif', 'latin1'),
  Buffer.alloc(16, 0x00),
])
