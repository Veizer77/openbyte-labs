import 'dotenv/config'

import { afterAll, describe, expect, it } from 'vitest'

import type { Actor } from '../../../src/access/types'
import {
  buildObjectKey,
  buildSourceKey,
  sniffImageFormat,
  MediaValidationError,
} from '../../../src/lib/media'
import { finalizeMediaUpload } from '../../../src/services/media/finalize'
import {
  createSignedDownloadUrl,
  createSignedUploadUrl,
  deleteObject,
  getStorage,
  headObject,
  resetStorageForTests,
} from '../../../src/services/media/r2'

/**
 * Tes integrasi R2 nyata (F0-14).
 *
 * Hanya berjalan dengan `RUN_R2_INTEGRATION=1` agar CI tanpa kredensial tetap
 * hermetik. Objek uji memakai prefix `media/YYYY/MM/{id}` milik tes sendiri dan
 * dihapus di akhir.
 */

const enabled = process.env.RUN_R2_INTEGRATION === '1'
const editor: Actor = { type: 'authenticated', userId: 'usr_test_editor', email: 'editor@example.com', role: 'editor' }
const anonymous: Actor = { type: 'anonymous' }

const date = new Date('2026-10-28T00:00:00.000Z')
const mediaId = `test${Math.random().toString(36).slice(2).padEnd(20, '0')}`.slice(0, 24)
const cleanupKeys: string[] = []

async function makePng(width = 1200, height = 800): Promise<Buffer> {
  const sharp = (await import('sharp')).default
  return sharp({ create: { width, height, channels: 3, background: { r: 20, g: 80, b: 140 } } })
    .png()
    .toBuffer()
}

describe.skipIf(!enabled)('F0-14 signed upload dan finalisasi R2 nyata', () => {
  afterAll(async () => {
    for (const key of cleanupKeys) {
      await deleteObject(key).catch(() => undefined)
    }
  })

  it('menerbitkan URL bertanda tangan dan mengunggah objek sumber', async () => {
    resetStorageForTests()
    const sourceKey = buildSourceKey({ mediaId, date })
    cleanupKeys.push(sourceKey)

    const { url, expiresInSeconds } = await createSignedUploadUrl(sourceKey, 'image/png', 300)
    expect(expiresInSeconds).toBe(300)
    expect(url).toContain('X-Amz-Signature')

    const png = await makePng()
    const upload = await fetch(url, { method: 'PUT', headers: { 'content-type': 'image/png' }, body: png })
    expect(upload.status).toBe(200)

    const head = await headObject(sourceKey)
    expect(head.exists).toBe(true)
    expect(head.byteLength).toBe(png.length)
  })

  it('menolak URL bertanda tangan yang dimodifikasi', async () => {
    // ID terpisah agar tidak bertabrakan dengan objek sumber tes sebelumnya.
    const tamperedId = `tamper${Math.random().toString(36).slice(2).padEnd(18, '0')}`.slice(0, 24)
    const sourceKey = buildSourceKey({ mediaId: tamperedId, date })
    const { url } = await createSignedUploadUrl(sourceKey, 'image/png', 300)
    const tampered = url.replace(/X-Amz-Signature=([0-9a-f]{4})/, (_, prefix) => `X-Amz-Signature=${prefix}ffff`)
    const response = await fetch(tampered, { method: 'PUT', headers: { 'content-type': 'image/png' }, body: Buffer.from('x') })
    const body = await response.text()

    // R2 membalas 400 untuk signature yang tidak cocok (bukan 403 seperti S3).
    expect([400, 403]).toContain(response.status)
    expect(body).toMatch(/SignatureDoesNotMatch|Authorization|Signature/i)

    const head = await headObject(sourceKey)
    expect(head.exists).toBe(false)
  })

  it('memfinalisasi objek menjadi empat varian WebP di R2', async () => {
    const result = await finalizeMediaUpload({ actor: editor, mediaId, date })
    for (const variant of result.variants) cleanupKeys.push(variant.key)

    expect(result.variants.map((item) => item.variant)).toEqual(['thumb', 'card', 'hero', 'og'])
    expect(result.source).toMatchObject({ format: 'png', width: 1200, height: 800 })

    const { publicBaseUrl } = getStorage()
    for (const variant of result.variants) {
      expect(variant.key).toBe(buildObjectKey({ mediaId, variant: variant.variant, date }))
      expect(variant.url.startsWith(publicBaseUrl)).toBe(true)

      const head = await headObject(variant.key)
      expect(head.exists).toBe(true)
      expect(head.contentType).toBe('image/webp')
      expect(head.byteLength).toBe(variant.byteLength)
    }

    // Objek sumber dihapus setelah varian tersimpan.
    const source = await headObject(buildSourceKey({ mediaId, date }))
    expect(source.exists).toBe(false)
  })

  it('menolak aktor anonim sebelum menyentuh storage', async () => {
    await expect(finalizeMediaUpload({ actor: anonymous, mediaId, date })).rejects.toThrow(/Akses ditolak/)
  })

  it('menolak finalisasi objek yang tidak ada', async () => {
    const missingId = `hilang${Math.random().toString(36).slice(2).padEnd(18, '0')}`.slice(0, 24)
    await expect(finalizeMediaUpload({ actor: editor, mediaId: missingId, date })).rejects.toBeInstanceOf(
      MediaValidationError,
    )
    await expect(finalizeMediaUpload({ actor: editor, mediaId: missingId, date })).rejects.toMatchObject({
      code: 'EMPTY_FILE',
    })
  })

  it('menolak SVG yang diunggah dan menghapus objeknya', async () => {
    const svgId = `svg${Math.random().toString(36).slice(2).padEnd(21, '0')}`.slice(0, 24)
    const sourceKey = buildSourceKey({ mediaId: svgId, date })
    const { url } = await createSignedUploadUrl(sourceKey, 'image/svg+xml', 300)
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"></svg>')
    await fetch(url, { method: 'PUT', headers: { 'content-type': 'image/svg+xml' }, body: svg })

    await expect(finalizeMediaUpload({ actor: editor, mediaId: svgId, date })).rejects.toMatchObject({
      code: 'SVG_REJECTED',
    })
    const head = await headObject(sourceKey)
    expect(head.exists).toBe(false)
  })

  it('membaca balik varian sebagai WebP yang sah', async () => {
    const key = buildObjectKey({ mediaId, variant: 'card', date })
    const { url } = await createSignedDownloadUrl(key, 120)
    const response = await fetch(url)
    expect(response.status).toBe(200)

    const bytes = Buffer.from(await response.arrayBuffer())
    expect(sniffImageFormat(bytes)).toBe('webp')
    expect(bytes.length).toBeGreaterThan(0)
  })
})
