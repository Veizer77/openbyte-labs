import { describe, it, expect } from 'vitest'

import {
  buildMediaVariants,
  buildObjectKey,
  normalizeSharpFormat,
  sanitizeClientFilename,
  sniffImageFormat,
  validateImageBytes,
  MediaValidationError,
  DEFAULT_MEDIA_LIMITS,
  MEDIA_VARIANTS,
  type MediaErrorCode,
  type MediaLimits,
} from '../../../src/lib/media'
import {
  FAKE_FTYP,
  GIF_BYTES,
  SVG_BYTES,
  SVG_WITH_BOM,
  TEXT_BYTES,
  createRaster,
  oversizePng,
  truncatedPng,
} from './fixtures'

async function expectMediaError(run: Promise<unknown>, code: MediaErrorCode) {
  await expect(run).rejects.toBeInstanceOf(MediaValidationError)
  await expect(run).rejects.toMatchObject({ code })
}

const tightLimits = (patch: Partial<MediaLimits>): MediaLimits => ({ ...DEFAULT_MEDIA_LIMITS, ...patch })

describe('F0-13 deteksi format dari byte', () => {
  it('mengenali PNG, JPEG, WebP, GIF, dan SVG dari magic number', async () => {
    expect(sniffImageFormat(await createRaster('png'))).toBe('png')
    expect(sniffImageFormat(await createRaster('jpeg'))).toBe('jpeg')
    expect(sniffImageFormat(await createRaster('webp'))).toBe('webp')
    expect(sniffImageFormat(GIF_BYTES)).toBe('gif')
    expect(sniffImageFormat(SVG_BYTES)).toBe('svg')
  })

  it('mengenali SVG yang diawali BOM dan spasi', () => {
    expect(sniffImageFormat(SVG_WITH_BOM)).toBe('svg')
  })

  it('mengembalikan unknown untuk byte yang bukan gambar', () => {
    expect(sniffImageFormat(TEXT_BYTES)).toBe('unknown')
    expect(sniffImageFormat(Buffer.alloc(0))).toBe('unknown')
  })

  it('menyamakan penamaan sharp heif menjadi avif', () => {
    expect(normalizeSharpFormat('heif')).toBe('avif')
    expect(normalizeSharpFormat('jpeg')).toBe('jpeg')
    expect(normalizeSharpFormat('tiff')).toBe('unknown')
    expect(normalizeSharpFormat(undefined)).toBe('unknown')
  })
})

describe('F0-13 validasi byte, ukuran, dan dimensi', () => {
  it('menerima PNG, JPEG, dan WebP yang sah beserta metadata sebenarnya', async () => {
    const png = await validateImageBytes(await createRaster('png', 1200, 800))
    expect(png).toMatchObject({ format: 'png', width: 1200, height: 800 })
    expect(png.bytes).toBeGreaterThan(0)

    const jpeg = await validateImageBytes(await createRaster('jpeg', 800, 600))
    expect(jpeg).toMatchObject({ format: 'jpeg', width: 800, height: 600 })

    const webp = await validateImageBytes(await createRaster('webp', 640, 480))
    expect(webp).toMatchObject({ format: 'webp', width: 640, height: 480 })
  })

  it('menolak berkas kosong', async () => {
    await expectMediaError(validateImageBytes(Buffer.alloc(0)), 'EMPTY_FILE')
  })

  it('menolak berkas melebihi batas ukuran sebelum decode', async () => {
    const bytes = oversizePng(2048)
    await expectMediaError(validateImageBytes(bytes, tightLimits({ maxBytes: 1024 })), 'TOO_LARGE')
  })

  it('menolak SVG meskipun isinya markup yang sah', async () => {
    await expectMediaError(validateImageBytes(SVG_BYTES), 'SVG_REJECTED')
    await expectMediaError(validateImageBytes(SVG_WITH_BOM), 'SVG_REJECTED')
  })

  it('menolak GIF dan format di luar whitelist', async () => {
    await expectMediaError(validateImageBytes(GIF_BYTES), 'UNSUPPORTED_TYPE')
    await expectMediaError(validateImageBytes(TEXT_BYTES), 'UNSUPPORTED_TYPE')
  })

  it('menolak berkas rusak yang tidak bisa didecode', async () => {
    await expectMediaError(validateImageBytes(await truncatedPng()), 'DECODE_FAILED')
  })

  it('menolak header yang mengaku format gambar tetapi isinya bukan gambar', async () => {
    expect(sniffImageFormat(FAKE_FTYP)).toBe('avif')
    await expectMediaError(validateImageBytes(FAKE_FTYP), 'DECODE_FAILED')
  })

  it('menolak dimensi di bawah batas minimum', async () => {
    await expectMediaError(validateImageBytes(await createRaster('png', 200, 150)), 'DIMENSION_TOO_SMALL')
  })

  it('menolak dimensi di atas batas maksimum', async () => {
    const bytes = await createRaster('png', 1200, 800)
    await expectMediaError(validateImageBytes(bytes, tightLimits({ maxWidth: 1000 })), 'DIMENSION_TOO_LARGE')
  })
})

describe('F0-13 pipeline varian WebP', () => {
  it('menghasilkan empat varian WebP sesuai kontrak PRD', async () => {
    const result = await buildMediaVariants(await createRaster('png', 1200, 800))

    expect(result.variants.map((item) => item.variant)).toEqual([...MEDIA_VARIANTS])
    expect(result.source).toMatchObject({ format: 'png', width: 1200, height: 800 })

    for (const variant of result.variants) {
      expect(variant.contentType).toBe('image/webp')
      expect(sniffImageFormat(variant.buffer)).toBe('webp')
      expect(variant.byteLength).toBe(variant.buffer.length)
      expect(variant.byteLength).toBeGreaterThan(0)
    }

    const byVariant = Object.fromEntries(result.variants.map((item) => [item.variant, item]))
    expect(byVariant.thumb).toMatchObject({ width: 320, height: 320 })
    expect(byVariant.card).toMatchObject({ width: 960, height: 640 })
    expect(byVariant.hero).toMatchObject({ width: 1200, height: 800 })
    expect(byVariant.og).toMatchObject({ width: 1200, height: 630 })

    expect(result.totalBytes).toBe(result.variants.reduce((total, item) => total + item.byteLength, 0))
  })

  it('tidak memperbesar gambar sumber yang lebih kecil dari target', async () => {
    const result = await buildMediaVariants(await createRaster('jpeg', 400, 300))
    const hero = result.variants.find((item) => item.variant === 'hero')
    expect(hero).toBeDefined()
    expect(hero!.width).toBeLessThanOrEqual(400)
    expect(hero!.height).toBeLessThanOrEqual(300)
  })

  it('deterministik untuk input yang sama', async () => {
    const source = await createRaster('png', 900, 600)
    const first = await buildMediaVariants(source)
    const second = await buildMediaVariants(source)
    expect(second.variants.map((item) => item.byteLength)).toEqual(first.variants.map((item) => item.byteLength))
    expect(second.variants[0]!.buffer.equals(first.variants[0]!.buffer)).toBe(true)
  })

  it('menolak input tidak valid tanpa menghasilkan varian parsial', async () => {
    await expectMediaError(buildMediaVariants(SVG_BYTES), 'SVG_REJECTED')
  })
})

describe('F0-13 object key dan nama berkas klien', () => {
  it('membuat key server-side dengan tanggal UTC', () => {
    const key = buildObjectKey({
      mediaId: 'abcdefghijklmnopqrstu',
      variant: 'card',
      date: new Date(Date.UTC(2026, 9, 28, 23, 30)),
    })
    expect(key).toBe('media/2026/10/abcdefghijklmnopqrstu/card.webp')
  })

  it('menolak ID media yang tidak sesuai pola', () => {
    for (const bad of ['', 'pendek', '../escape', 'a'.repeat(40), 'id dengan spasi']) {
      expect(() => buildObjectKey({ mediaId: bad, variant: 'thumb', date: new Date() })).toThrowError(
        MediaValidationError,
      )
    }
  })

  it('membersihkan nama berkas biasa dan menolak path traversal', () => {
    expect(sanitizeClientFilename('  foto-proyek.png  ')).toBe('foto-proyek.png')

    for (const bad of ['', '../../etc/passwd', 'a/b.jpg', 'a\\b.jpg', '.env', 'nama\u0000.jpg', 'x'.repeat(201)]) {
      expect(() => sanitizeClientFilename(bad)).toThrowError(MediaValidationError)
    }
  })

  it('memakai tipe sebenarnya, bukan ekstensi nama berkas', async () => {
    // Byte PNG dengan nama berekstensi .jpg: yang menentukan tetap byte.
    const pngBytes = await createRaster('png', 640, 480)
    expect(sanitizeClientFilename('sebenarnya-png.jpg')).toBe('sebenarnya-png.jpg')
    const validated = await validateImageBytes(pngBytes)
    expect(validated.format).toBe('png')
  })
})
