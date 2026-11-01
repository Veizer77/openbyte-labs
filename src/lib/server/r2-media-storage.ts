import "server-only";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getEnv } from "@/env";
import type { MediaObjectStorage } from "@/services/media";

export interface R2MediaStorageConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  stagingBucket: string;
  publicBucket: string;
  publicBaseUrl: string;
}

let cachedClient: S3Client | undefined;

function getR2Configuration(): R2MediaStorageConfig {
  const env = getEnv();
  const values = {
    accountId: env.R2_ACCOUNT_ID,
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    stagingBucket: env.R2_BUCKET_STAGING,
    publicBucket: env.R2_BUCKET_PUBLIC,
    publicBaseUrl: env.R2_PUBLIC_BASE_URL,
  };
  const missing = Object.entries(values)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length)
    throw new Error(
      `Konfigurasi media R2 belum lengkap: ${missing.join(", ")}.`,
    );
  if (values.stagingBucket === values.publicBucket)
    throw new Error("Bucket staging R2 harus terpisah dari bucket publik.");

  const publicUrl = new URL(values.publicBaseUrl!);
  if (
    publicUrl.username ||
    publicUrl.password ||
    publicUrl.search ||
    publicUrl.hash ||
    (env.NODE_ENV === "production" && publicUrl.protocol !== "https:")
  )
    throw new Error("R2_PUBLIC_BASE_URL harus berupa URL publik yang aman.");

  return {
    accountId: values.accountId!,
    accessKeyId: values.accessKeyId!,
    secretAccessKey: values.secretAccessKey!,
    stagingBucket: values.stagingBucket!,
    publicBucket: values.publicBucket!,
    publicBaseUrl: publicUrl.toString().replace(/\/+$/, ""),
  };
}

function getClient(config: R2MediaStorageConfig): S3Client {
  cachedClient ??= new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    requestChecksumCalculation: "WHEN_REQUIRED",
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  return cachedClient;
}

export function createR2MediaStorage(
  config = getR2Configuration(),
): MediaObjectStorage {
  const client = getClient(config);

  return {
    async signPut({ key, mimeType, expiresInSeconds }) {
      return getSignedUrl(
        client,
        new PutObjectCommand({
          Bucket: config.stagingBucket,
          Key: key,
          ContentType: mimeType,
        }),
        {
          expiresIn: expiresInSeconds,
          signableHeaders: new Set(["content-type"]),
        },
      );
    },
    async head(key) {
      const result = await client.send(
        new HeadObjectCommand({ Bucket: config.stagingBucket, Key: key }),
      );
      return {
        sizeBytes: result.ContentLength ?? -1,
        mimeType: result.ContentType,
      };
    },
    async get(key) {
      const result = await client.send(
        new GetObjectCommand({ Bucket: config.stagingBucket, Key: key }),
      );
      if (!result.Body) throw new Error("R2 object has no response body.");
      return result.Body.transformToByteArray();
    },
    async putPending(key, body, mimeType) {
      if (!key.startsWith("pending/"))
        throw new Error("Source upload hanya boleh disimpan di staging R2.");
      await client.send(
        new PutObjectCommand({
          Bucket: config.stagingBucket,
          Key: key,
          Body: Buffer.from(body),
          ContentType: mimeType,
          CacheControl: "private, no-store",
        }),
      );
    },
    async put(key, body, mimeType) {
      await client.send(
        new PutObjectCommand({
          Bucket: config.publicBucket,
          Key: key,
          Body: Buffer.from(body),
          ContentType: mimeType,
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );
    },
    async remove(key) {
      const bucket = key.startsWith("pending/")
        ? config.stagingBucket
        : config.publicBucket;
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    },
    publicUrl(key) {
      return `${config.publicBaseUrl}/${key
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/")}`;
    },
  };
}
