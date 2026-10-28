import 'server-only'

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { MediaValidationError } from '../../lib/media'
import { getEnvironment } from '../../lib/env'

/**
 * Klien R2 (S3-compatible). Kredensial hanya dibaca di server; tidak ada
 * nilai rahasia yang pernah dikembalikan ke pemanggil atau ditulis ke log.
 */

export interface StorageConfig {
  readonly client: S3Client
  readonly bucket: string
  readonly publicBaseUrl: string
}

let cached: StorageConfig | undefined

export function getStorage(): StorageConfig {
  if (cached) return cached

  const env = getEnvironment()
  const missing = [
    ['R2_ACCOUNT_ID', env.R2_ACCOUNT_ID],
    ['R2_ACCESS_KEY_ID', env.R2_ACCESS_KEY_ID],
    ['R2_SECRET_ACCESS_KEY', env.R2_SECRET_ACCESS_KEY],
    ['R2_BUCKET_PUBLIC', env.R2_BUCKET_PUBLIC],
    ['R2_PUBLIC_BASE_URL', env.R2_PUBLIC_BASE_URL],
  ].filter(([, value]) => !value)

  if (missing.length > 0) {
    throw new Error(`Konfigurasi R2 belum lengkap: ${missing.map(([name]) => name).join(', ')}`)
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID as string,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY as string,
    },
  })

  cached = {
    client,
    bucket: env.R2_BUCKET_PUBLIC as string,
    publicBaseUrl: (env.R2_PUBLIC_BASE_URL as string).replace(/\/$/, ''),
  }
  return cached
}

/** Hanya untuk tes: memaksa konfigurasi dibaca ulang dari environment. */
export function resetStorageForTests(): void {
  cached = undefined
}

export interface SignedUpload {
  readonly url: string
  readonly expiresInSeconds: number
}

/**
 * URL unggah bertanda tangan berumur pendek. `key` selalu dibuat server
 * (lihat `buildObjectKey`), tidak pernah berasal dari input browser.
 */
export async function createSignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 300,
): Promise<SignedUpload> {
  const { client, bucket } = getStorage()
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType })
  const url = await getSignedUrl(client, command, { expiresIn: expiresInSeconds })
  return { url, expiresInSeconds }
}

/** URL unduh bertanda tangan; dipakai untuk bucket privat (Rilis 2) dan verifikasi. */
export async function createSignedDownloadUrl(key: string, expiresInSeconds = 300): Promise<SignedUpload> {
  const { client, bucket } = getStorage()
  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  const url = await getSignedUrl(client, command, { expiresIn: expiresInSeconds })
  return { url, expiresInSeconds }
}

export interface StoredObjectHead {  readonly exists: boolean
  readonly byteLength: number
  readonly contentType: string | undefined
  readonly etag: string | undefined
}

export async function headObject(key: string): Promise<StoredObjectHead> {
  const { client, bucket } = getStorage()
  try {
    const result = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return {
      exists: true,
      byteLength: result.ContentLength ?? 0,
      contentType: result.ContentType,
      etag: result.ETag,
    }
  } catch (error) {
    const name = (error as { name?: string }).name
    if (name === 'NotFound' || name === 'NoSuchKey' || name === '404') {
      return { exists: false, byteLength: 0, contentType: undefined, etag: undefined }
    }
    throw error
  }
}

/**
 * Membaca objek otoritatif dengan batas byte. Server tidak mempercayai
 * ukuran yang diklaim browser saat upload.
 */
export async function getObjectBytes(key: string, maxBytes: number): Promise<Buffer> {
  const { client, bucket } = getStorage()
  const head = await headObject(key)
  if (!head.exists) {
    throw new MediaValidationError('EMPTY_FILE', 'Objek unggahan tidak ditemukan.')
  }
  if (head.byteLength > maxBytes) {
    throw new MediaValidationError('TOO_LARGE', 'Ukuran objek melebihi batas yang diizinkan.')
  }

  const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
  const body = result.Body as { transformToByteArray?: () => Promise<Uint8Array> } | undefined
  if (!body?.transformToByteArray) {
    throw new MediaValidationError('DECODE_FAILED', 'Objek tidak dapat dibaca.')
  }
  const bytes = Buffer.from(await body.transformToByteArray())
  if (bytes.length > maxBytes) {
    throw new MediaValidationError('TOO_LARGE', 'Ukuran objek melebihi batas yang diizinkan.')
  }
  return bytes
}

export async function putObject(key: string, body: Buffer, contentType: string): Promise<void> {
  const { client, bucket } = getStorage()
  await client.send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }),
  )
}

export async function deleteObject(key: string): Promise<void> {
  const { client, bucket } = getStorage()
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}

/** URL publik hanya dibentuk untuk objek yang sudah difinalisasi. */
export function publicUrlFor(key: string): string {
  const { publicBaseUrl } = getStorage()
  return `${publicBaseUrl}/${key.replace(/^\//, '')}`
}
