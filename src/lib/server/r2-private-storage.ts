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
import { isPrivateFileContent } from "@/lib/tracking/policy";

export function privateStorage() {
  const env = getEnv();
  if (
    !env.R2_ACCOUNT_ID ||
    !env.R2_ACCESS_KEY_ID ||
    !env.R2_SECRET_ACCESS_KEY ||
    !env.R2_BUCKET_STAGING ||
    env.R2_BUCKET_STAGING === env.R2_BUCKET_PUBLIC
  )
    throw new TrackingError(
      "Penyimpanan berkas privat belum siap. Admin harus mengatur bucket privat terpisah dari bucket publik.",
    );
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
    async uploadUrl(key: string, mimeType: string) {
      return getSignedUrl(
        client,
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: mimeType,
        }),
        { expiresIn: 300, signableHeaders: new Set(["content-type"]) },
      );
    },
    async verifyAndMove(
      projectId: string,
      file: { key: string; sizeBytes: number; mimeType: string },
    ) {
      const head = await client.send(
        new HeadObjectCommand({ Bucket: bucket, Key: file.key }),
      );
      if (
        head.ContentLength !== file.sizeBytes ||
        head.ContentType !== file.mimeType ||
        file.sizeBytes > 5 * 1024 * 1024
      ) {
        await client.send(
          new DeleteObjectCommand({ Bucket: bucket, Key: file.key }),
        );
        throw new TrackingError("Ukuran atau tipe berkas tidak sesuai.");
      }
      const result = await client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: file.key,
          Range: "bytes=0-5242880",
        }),
      );
      const bytes = await result.Body?.transformToByteArray();
      if (
        !bytes ||
        bytes.length !== file.sizeBytes ||
        !isPrivateFileContent(bytes, file.mimeType)
      ) {
        await client.send(
          new DeleteObjectCommand({ Bucket: bucket, Key: file.key }),
        );
        throw new TrackingError("Isi berkas tidak sesuai tipe yang diizinkan.");
      }
      // A different immutable key prevents replaying the upload URL over a verified attachment.
      const key = `tracking/${projectId}/files/${randomUUID()}`;
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: bytes,
          ContentType: file.mimeType,
          ContentDisposition: "attachment",
          CacheControl: "private, no-store",
        }),
      );
      await client.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: file.key }),
      );
      return key;
    },
    async downloadUrl(key: string, filename: string) {
      return getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
          ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
          ResponseCacheControl: "private, no-store",
          ResponseContentType: "application/octet-stream",
        }),
        { expiresIn: 60 },
      );
    },
  };
}
