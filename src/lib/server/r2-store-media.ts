import "server-only";
import { randomUUID } from "node:crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getEnv } from "@/env";
import { TrackingError } from "@/lib/tracking/errors";
import { sanitizeStoreFilename } from "./r2-store-packages";

export const MAX_STORE_VIDEO_BYTES = 100 * 1024 * 1024;
export const MAX_REVIEW_VIDEO_BYTES = 25 * 1024 * 1024;
export const MAX_REVIEW_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_PAYMENT_PROOF_BYTES = 10 * 1024 * 1024;

const ORDER_CODE_PATTERN = /^OBL-STR-[A-Z0-9]{6,10}$/;
const UUID_PATTERN = /^[0-9a-f-]{36}$/i;
const IMAGE_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);
const VIDEO_MIME = new Set(["video/mp4", "video/webm"]);
const PROOF_MIME = new Set([...IMAGE_MIME, "application/pdf"]);

type Bucket = "public" | "staging";

function config() {
  const env = getEnv();
  if (
    !env.R2_ACCOUNT_ID ||
    !env.R2_ACCESS_KEY_ID ||
    !env.R2_SECRET_ACCESS_KEY ||
    !env.R2_BUCKET_PUBLIC ||
    !env.R2_BUCKET_STAGING ||
    !env.R2_PUBLIC_BASE_URL
  ) {
    throw new TrackingError(
      "Penyimpanan media Digital Store belum siap. Lengkapi konfigurasi R2.",
    );
  }
  return {
    accountId: env.R2_ACCOUNT_ID,
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    publicBucket: env.R2_BUCKET_PUBLIC,
    stagingBucket: env.R2_BUCKET_STAGING,
    publicBaseUrl: env.R2_PUBLIC_BASE_URL.replace(/\/+$/, ""),
  };
}

function s3Client(values: ReturnType<typeof config>) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${values.accountId}.r2.cloudflarestorage.com`,
    requestChecksumCalculation: "WHEN_REQUIRED",
    credentials: {
      accessKeyId: values.accessKeyId,
      secretAccessKey: values.secretAccessKey,
    },
  });
}

function bucketName(values: ReturnType<typeof config>, bucket: Bucket) {
  return bucket === "public" ? values.publicBucket : values.stagingBucket;
}

function publicUrl(values: ReturnType<typeof config>, key: string) {
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  if (values.publicBaseUrl.includes(".r2.dev")) {
    return `/api/media/${encodedKey}`;
  }
  return `${values.publicBaseUrl}/${encodedKey}`;
}

function hasPrefix(bytes: Uint8Array, expected: readonly number[]): boolean {
  return (
    bytes.length >= expected.length &&
    expected.every((value, index) => bytes[index] === value)
  );
}

function isMp4(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 8 &&
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70
  );
}

function isWebm(bytes: Uint8Array): boolean {
  return hasPrefix(bytes, [0x1a, 0x45, 0xdf, 0xa3]);
}

function isPng(bytes: Uint8Array): boolean {
  return hasPrefix(bytes, [0x89, 0x50, 0x4e, 0x47]);
}

function isJpeg(bytes: Uint8Array): boolean {
  return hasPrefix(bytes, [0xff, 0xd8, 0xff]);
}

function isWebp(bytes: Uint8Array): boolean {
  return (
    hasPrefix(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    bytes.length >= 12 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

function isPdf(bytes: Uint8Array): boolean {
  return hasPrefix(bytes, [0x25, 0x50, 0x44, 0x46]);
}

async function readHead(
  client: S3Client,
  bucket: string,
  key: string,
): Promise<number> {
  const head = await client.send(
    new HeadObjectCommand({ Bucket: bucket, Key: key }),
  );
  return head.ContentLength ?? 0;
}

async function readBytes(
  client: S3Client,
  bucket: string,
  key: string,
  end = 11,
): Promise<Uint8Array> {
  const result = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key, Range: `bytes=0-${end}` }),
  );
  return (await result.Body?.transformToByteArray()) ?? new Uint8Array();
}

async function removeObject(
  client: S3Client,
  bucket: string,
  key: string,
): Promise<void> {
  try {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch {
    // Best effort: never mask the validation error with a cleanup failure.
  }
}

/** Direct browser upload for a product showcase video into the public bucket. */
export function storeMediaStorage() {
  const values = config();
  const client = s3Client(values);
  const publicBucket = bucketName(values, "public");
  const stagingBucket = bucketName(values, "staging");

  return {
    async createProductVideoUploadUrl(
      productId: string,
      filename: string,
      mimeType: string,
    ) {
      if (!UUID_PATTERN.test(productId)) {
        throw new TrackingError("ID produk tidak valid.");
      }
      if (!VIDEO_MIME.has(mimeType)) {
        throw new TrackingError("Video harus berformat .mp4 atau .webm.");
      }
      const cleanFilename = sanitizeStoreFilename(filename);
      const extension = mimeType === "video/webm" ? /\.webm$/i : /\.mp4$/i;
      if (!extension.test(cleanFilename)) {
        throw new TrackingError("Ekstensi berkas tidak sesuai format video.");
      }
      const key = `store-videos/${productId}/${randomUUID()}-${cleanFilename}`;
      const uploadUrl = await getSignedUrl(
        client,
        new PutObjectCommand({
          Bucket: publicBucket,
          Key: key,
          ContentType: mimeType,
          CacheControl: "public, max-age=31536000, immutable",
        }),
        { expiresIn: 600, signableHeaders: new Set(["content-type"]) },
      );
      return { key, uploadUrl };
    },

    async verifyUploadedProductVideo(key: string) {
      if (
        !/^store-videos\/[0-9a-f-]{36}\/[0-9a-f-]{36}-.+\.(mp4|webm)$/i.test(
          key,
        )
      ) {
        throw new TrackingError("Kunci berkas video tidak valid.");
      }
      const sizeBytes = await readHead(client, publicBucket, key);
      if (sizeBytes <= 0 || sizeBytes > MAX_STORE_VIDEO_BYTES) {
        await removeObject(client, publicBucket, key);
        throw new TrackingError("Ukuran video tidak valid (maksimal 100 MB).");
      }
      const bytes = await readBytes(client, publicBucket, key);
      const mp4 = /\.mp4$/i.test(key) && isMp4(bytes);
      const webm = /\.webm$/i.test(key) && isWebm(bytes);
      if (!mp4 && !webm) {
        await removeObject(client, publicBucket, key);
        throw new TrackingError("Isi berkas bukan video MP4/WebM yang valid.");
      }
      return { key, url: publicUrl(values, key), sizeBytes };
    },

    async createReviewMediaUploadUrl(
      orderCode: string,
      filename: string,
      mimeType: string,
    ) {
      if (!ORDER_CODE_PATTERN.test(orderCode)) {
        throw new TrackingError("Kode order tidak valid.");
      }
      if (!IMAGE_MIME.has(mimeType) && !VIDEO_MIME.has(mimeType)) {
        throw new TrackingError("Media ulasan harus berupa gambar atau video.");
      }
      const cleanFilename = sanitizeStoreFilename(filename);
      const key = `store-reviews/${orderCode}/${randomUUID()}-${cleanFilename}`;
      const uploadUrl = await getSignedUrl(
        client,
        new PutObjectCommand({
          Bucket: publicBucket,
          Key: key,
          ContentType: mimeType,
          CacheControl: "public, max-age=31536000, immutable",
        }),
        { expiresIn: 600, signableHeaders: new Set(["content-type"]) },
      );
      return { key, uploadUrl };
    },

    async verifyUploadedReviewMedia(key: string) {
      if (
        !/^store-reviews\/OBL-STR-[A-Z0-9]{6,10}\/[0-9a-f-]{36}-.+\.(png|jpe?g|webp|mp4|webm)$/i.test(
          key,
        )
      ) {
        throw new TrackingError("Kunci media ulasan tidak valid.");
      }
      const sizeBytes = await readHead(client, publicBucket, key);
      const bytes = await readBytes(client, publicBucket, key);
      const image =
        isPng(bytes) || isJpeg(bytes) || isWebp(bytes);
      const video = isMp4(bytes) || isWebm(bytes);
      if (!image && !video) {
        await removeObject(client, publicBucket, key);
        throw new TrackingError("Isi media ulasan tidak dikenali.");
      }
      const limit = video ? MAX_REVIEW_VIDEO_BYTES : MAX_REVIEW_IMAGE_BYTES;
      if (sizeBytes <= 0 || sizeBytes > limit) {
        await removeObject(client, publicBucket, key);
        throw new TrackingError(
          video
            ? "Ukuran video ulasan maksimal 25 MB."
            : "Ukuran gambar ulasan maksimal 8 MB.",
        );
      }
      return {
        kind: video ? ("video" as const) : ("image" as const),
        url: publicUrl(values, key),
      };
    },

    async createPaymentProofUploadUrl(
      orderCode: string,
      filename: string,
      mimeType: string,
    ) {
      if (!ORDER_CODE_PATTERN.test(orderCode)) {
        throw new TrackingError("Kode order tidak valid.");
      }
      if (!PROOF_MIME.has(mimeType)) {
        throw new TrackingError("Bukti bayar harus gambar atau PDF.");
      }
      const cleanFilename = sanitizeStoreFilename(filename);
      const key = `store-proofs/${orderCode}/${randomUUID()}-${cleanFilename}`;
      const uploadUrl = await getSignedUrl(
        client,
        new PutObjectCommand({
          Bucket: stagingBucket,
          Key: key,
          ContentType: mimeType,
          CacheControl: "private, no-store",
        }),
        { expiresIn: 600, signableHeaders: new Set(["content-type"]) },
      );
      return { key, uploadUrl };
    },

    async verifyUploadedPaymentProof(key: string) {
      if (
        !/^store-proofs\/OBL-STR-[A-Z0-9]{6,10}\/[0-9a-f-]{36}-.+\.(png|jpe?g|webp|pdf)$/i.test(
          key,
        )
      ) {
        throw new TrackingError("Kunci bukti bayar tidak valid.");
      }
      const sizeBytes = await readHead(client, stagingBucket, key);
      if (sizeBytes <= 0 || sizeBytes > MAX_PAYMENT_PROOF_BYTES) {
        await removeObject(client, stagingBucket, key);
        throw new TrackingError("Ukuran bukti bayar maksimal 10 MB.");
      }
      const bytes = await readBytes(client, stagingBucket, key);
      const mimeType = isPdf(bytes)
        ? "application/pdf"
        : isPng(bytes)
          ? "image/png"
          : isJpeg(bytes)
            ? "image/jpeg"
            : isWebp(bytes)
              ? "image/webp"
              : null;
      if (!mimeType) {
        await removeObject(client, stagingBucket, key);
        throw new TrackingError("Isi bukti bayar tidak dikenali.");
      }
      const filename = key
        .slice(key.lastIndexOf("/") + 1)
        .replace(/^[0-9a-f-]{36}-/i, "");
      return { key, filename, mimeType, sizeBytes };
    },

    async createSignedProofViewUrl(key: string) {
      if (!/^store-proofs\/OBL-STR-[A-Z0-9]{6,10}\//.test(key)) {
        throw new TrackingError("Kunci bukti bayar tidak valid.");
      }
      return getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket: stagingBucket,
          Key: key,
          ResponseCacheControl: "private, no-store",
        }),
        { expiresIn: 300 },
      );
    },
  };
}