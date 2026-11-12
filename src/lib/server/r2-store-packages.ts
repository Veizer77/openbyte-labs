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

/** Hard ceiling for a store package. The portal's 5 MB limit does not apply here. */
export const MAX_STORE_PACKAGE_BYTES = 200 * 1024 * 1024;
const ZIP_MAGIC = [0x50, 0x4b, 0x03, 0x04] as const;

/** Prevent header injection through a crafted download filename. */
export function sanitizeStoreFilename(filename: string): string {
  const cleaned = filename
    .replace(/[\r\n"\\]/g, "_")
    .replace(/[^\x20-\x7e]/g, "_")
    .trim()
    .slice(0, 160);
  return cleaned || "package.zip";
}

/**
 * Presigned access to the private R2 bucket for Digital Store `.zip` packages.
 * Nothing here ever uses R2_PUBLIC_BASE_URL: there is no anonymous URL.
 */
export function storePackageStorage() {
  const env = getEnv();
  if (
    !env.R2_ACCOUNT_ID ||
    !env.R2_ACCESS_KEY_ID ||
    !env.R2_SECRET_ACCESS_KEY ||
    !env.R2_BUCKET_STAGING ||
    env.R2_BUCKET_STAGING === env.R2_BUCKET_PUBLIC
  ) {
    throw new TrackingError(
      "Penyimpanan privat Digital Store belum siap. Admin harus mengatur bucket privat terpisah dari bucket publik.",
    );
  }
  const bucket = env.R2_BUCKET_STAGING;
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    requestChecksumCalculation: "WHEN_REQUIRED",
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });

  return {
    /** Browser uploads directly to the private bucket via a 10-minute PUT URL. */
    async createUploadUrl(productId: string, filename: string) {
      const cleanFilename = sanitizeStoreFilename(filename);
      if (!/\.zip$/i.test(cleanFilename)) {
        throw new TrackingError("Paket produk harus berupa berkas .zip.");
      }
      if (!/^[0-9a-f-]{36}$/i.test(productId)) {
        throw new TrackingError("ID produk tidak valid.");
      }
      const key = `store-packages/${productId}/${randomUUID()}-${cleanFilename}`;
      const uploadUrl = await getSignedUrl(
        client,
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: "application/zip",
        }),
        { expiresIn: 600, signableHeaders: new Set(["content-type"]) },
      );
      return { key, uploadUrl };
    },

    /** Confirms object existence, size, and the ZIP magic bytes; deletes impostors. */
    async verifyUploadedZip(key: string) {
      if (!/^store-packages\/[0-9a-f-]{36}\/[0-9a-f-]{36}-.+\.zip$/i.test(key)) {
        throw new TrackingError("Kunci berkas paket tidak valid.");
      }
      const head = await client.send(
        new HeadObjectCommand({ Bucket: bucket, Key: key }),
      );
      const sizeBytes = head.ContentLength ?? 0;
      if (sizeBytes <= 0 || sizeBytes > MAX_STORE_PACKAGE_BYTES) {
        await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
        throw new TrackingError(
          "Ukuran paket .zip tidak valid (maksimal 200 MB).",
        );
      }
      const result = await client.send(
        new GetObjectCommand({ Bucket: bucket, Key: key, Range: "bytes=0-3" }),
      );
      const bytes = await result.Body?.transformToByteArray();
      const isZip =
        !!bytes &&
        bytes.length >= 4 &&
        ZIP_MAGIC.every((value, index) => bytes[index] === value);
      if (!isZip) {
        await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
        throw new TrackingError("Isi berkas bukan arsip ZIP yang valid.");
      }
      const filename = key.slice(key.lastIndexOf("/") + 1).replace(
        /^[0-9a-f-]{36}-/i,
        "",
      );
      return { key, filename, sizeBytes };
    },

    /** 60-second link: a shared URL becomes useless almost immediately. */
    async createSignedDownloadUrl(key: string, downloadFilename: string) {
      return getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
          ResponseContentDisposition: `attachment; filename="${sanitizeStoreFilename(downloadFilename)}"`,
          ResponseContentType: "application/zip",
          ResponseCacheControl: "private, no-store",
        }),
        { expiresIn: 60 },
      );
    },
  };
}
