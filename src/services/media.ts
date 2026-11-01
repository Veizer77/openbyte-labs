import "server-only";
import { randomUUID } from "node:crypto";
import sharp, { type Metadata } from "sharp";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import { MediaServiceError } from "@/services/media-errors";
import {
  mediaAssetSchema,
  mediaFinalizeInputSchema,
  mediaListOptionsSchema,
  mediaRecordSchema,
  mediaUploadGrantSchema,
  mediaUploadInputSchema,
  type MediaAsset,
  type MediaListOptions,
  type MediaMimeType,
  type MediaRecord,
  type MediaUploadGrant,
  type MediaVariant,
} from "@/schemas/media";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 40_000_000;
const MAX_DIMENSION = 10_000;
const UPLOAD_URL_TTL_SECONDS = 300;
const pendingKey = (id: string) => `pending/${id}/source`;

const variants = {
  thumb: { width: 320, height: 240 },
  card: { width: 800, height: 600 },
  hero: { width: 1920, height: 1200 },
  og: { width: 1200, height: 630 },
} as const satisfies Record<MediaVariant, { width: number; height: number }>;

const mimeForFormat: Record<string, MediaMimeType> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export interface MediaStore {
  createPending(input: {
    id: string;
    key: string;
    filename: string;
    mimeType: MediaMimeType;
    sizeBytes: number;
    uploadedBy: string | null;
  }): Promise<unknown>;
  read(id: string): Promise<unknown | null>;
  finalize(input: {
    id: string;
    pendingKey: string;
    key: string;
    filename: string;
    sizeBytes: number;
    width: number;
    height: number;
    alt: string;
    variants: Record<MediaVariant, string>;
    uploadedBy: string | null;
    actorId: string | null;
  }): Promise<unknown | null>;
  listFinalized(options: MediaListOptions): Promise<unknown[]>;
}

export interface MediaObjectStorage {
  signPut(input: {
    key: string;
    mimeType: MediaMimeType;
    expiresInSeconds: number;
  }): Promise<string>;
  head(
    key: string,
  ): Promise<{ sizeBytes: number; mimeType: string | undefined }>;
  get(key: string): Promise<Uint8Array>;
  putPending(
    key: string,
    body: Uint8Array,
    mimeType: MediaMimeType,
  ): Promise<void>;
  put(key: string, body: Uint8Array, mimeType: MediaMimeType): Promise<void>;
  remove(key: string): Promise<void>;
  publicUrl(key: string): string;
}

export async function createMediaUpload(
  store: MediaStore,
  storage: MediaObjectStorage,
  principal: AdminPrincipal | null,
  input: unknown,
  now = new Date(),
): Promise<MediaUploadGrant> {
  authorize(principal, "media", "create");
  const parsed = mediaUploadInputSchema.parse(input);
  if (parsed.sizeBytes > MAX_UPLOAD_BYTES)
    throw new MediaServiceError(
      "media_invalid",
      "Ukuran gambar maksimal 15 MB.",
    );
  if (!Number.isFinite(now.getTime()))
    throw new MediaServiceError("media_unavailable", "Jam server tidak valid.");

  const filename = sanitizeFilename(parsed.filename);
  const id = randomUUID();
  const key = pendingKey(id);
  const uploadUrl = await storage.signPut({
    key,
    mimeType: parsed.mimeType,
    expiresInSeconds: UPLOAD_URL_TTL_SECONDS,
  });
  const pending = mediaRecordSchema.parse(
    await store.createPending({
      id,
      key,
      filename,
      mimeType: parsed.mimeType,
      sizeBytes: parsed.sizeBytes,
      uploadedBy: principal.id,
    }),
  );
  if (pending.finalizedAt || pending.deletedAt)
    throw new MediaServiceError(
      "media_unavailable",
      "Upload media tidak dapat disiapkan.",
    );

  return mediaUploadGrantSchema.parse({
    id,
    uploadUrl,
    headers: { "Content-Type": parsed.mimeType },
    expiresAt: new Date(
      now.getTime() + UPLOAD_URL_TTL_SECONDS * 1000,
    ).toISOString(),
  });
}

export async function finalizeMediaUpload(
  store: MediaStore,
  storage: MediaObjectStorage,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<MediaAsset> {
  authorize(principal, "media", "update");
  return finalizeMediaUploadWithActor(store, storage, principal.id, input);
}

/** Imports a validated local asset through the same private-staging pipeline. */
export async function importMediaAsset(
  store: MediaStore,
  storage: MediaObjectStorage,
  input: {
    id: string;
    filename: string;
    mimeType: MediaMimeType;
    bytes: Uint8Array;
    alt: string;
  },
): Promise<MediaAsset> {
  const { id, alt } = z
    .object({ id: z.uuid(), alt: z.string().trim().min(1).max(250) })
    .strict()
    .parse({ id: input.id, alt: input.alt });
  const parsed = mediaUploadInputSchema.parse({
    filename: input.filename,
    mimeType: input.mimeType,
    sizeBytes: input.bytes.byteLength,
  });
  if (parsed.sizeBytes > MAX_UPLOAD_BYTES)
    throw new MediaServiceError(
      "media_invalid",
      "Ukuran gambar maksimal 15 MB.",
    );

  const filename = sanitizeFilename(parsed.filename);
  const sourceKey = pendingKey(id);
  const currentValue = await store.read(id);
  if (currentValue) {
    const current = mediaRecordSchema.parse(currentValue);
    if (current.deletedAt)
      throw new MediaServiceError("media_not_found", "Media sudah dihapus.");
    if (
      current.filename !== filename ||
      current.sizeBytes !== parsed.sizeBytes ||
      current.uploadedBy !== null
    )
      throw new MediaServiceError(
        "media_invalid",
        "ID media impor sudah digunakan oleh aset lain.",
      );
    if (current.finalizedAt) {
      if (current.alt !== alt)
        throw new MediaServiceError(
          "media_invalid",
          "Teks alternatif media impor yang sudah final tidak boleh ditimpa.",
        );
      return toMediaAsset(current, storage);
    }
    if (current.key !== sourceKey || current.mimeType !== parsed.mimeType)
      throw new MediaServiceError(
        "media_invalid",
        "Status media impor yang tertunda tidak cocok.",
      );
  } else {
    const pending = mediaRecordSchema.parse(
      await store.createPending({
        id,
        key: sourceKey,
        filename,
        mimeType: parsed.mimeType,
        sizeBytes: parsed.sizeBytes,
        uploadedBy: null,
      }),
    );
    if (pending.finalizedAt || pending.deletedAt)
      throw new MediaServiceError(
        "media_unavailable",
        "Metadata media impor tidak dapat disiapkan.",
      );
  }

  await storage.putPending(sourceKey, input.bytes, parsed.mimeType);
  return finalizeMediaUploadWithActor(store, storage, null, { id, alt });
}

async function finalizeMediaUploadWithActor(
  store: MediaStore,
  storage: MediaObjectStorage,
  actorId: string | null,
  input: unknown,
): Promise<MediaAsset> {
  const { id, alt } = mediaFinalizeInputSchema.parse(input);
  const existingValue = await store.read(id);
  if (!existingValue)
    throw new MediaServiceError(
      "media_not_found",
      "Upload media tidak ditemukan.",
    );
  const existing = mediaRecordSchema.parse(existingValue);
  if (existing.deletedAt)
    throw new MediaServiceError("media_not_found", "Media sudah dihapus.");
  if (existing.finalizedAt) return toMediaAsset(existing, storage);

  const sourceKey = pendingKey(id);
  if (existing.key !== sourceKey)
    throw new MediaServiceError(
      "media_invalid",
      "Status upload media tidak valid.",
    );
  if (existing.sizeBytes > MAX_UPLOAD_BYTES)
    throw new MediaServiceError(
      "media_invalid",
      "Ukuran gambar maksimal 15 MB.",
    );

  let objectInfo: { sizeBytes: number; mimeType: string | undefined };
  let source: Uint8Array;
  try {
    objectInfo = await storage.head(sourceKey);
    if (
      objectInfo.sizeBytes !== existing.sizeBytes ||
      objectInfo.mimeType !== existing.mimeType
    )
      throw new MediaServiceError(
        "media_invalid",
        "File yang diunggah tidak cocok dengan ukuran atau tipe yang diminta.",
      );
    source = await storage.get(sourceKey);
  } catch (error) {
    if (error instanceof MediaServiceError) throw error;
    throw new MediaServiceError(
      "media_invalid",
      "File belum diunggah atau tidak dapat dibaca.",
    );
  }
  if (
    source.byteLength !== existing.sizeBytes ||
    source.byteLength > MAX_UPLOAD_BYTES
  )
    throw new MediaServiceError(
      "media_invalid",
      "Ukuran file gambar tidak valid.",
    );

  const inputBuffer = Buffer.from(source);
  let metadata: Metadata;
  try {
    metadata = await sharp(inputBuffer, {
      failOn: "error",
      limitInputPixels: MAX_IMAGE_PIXELS,
      sequentialRead: true,
    }).metadata();
  } catch {
    throw new MediaServiceError(
      "media_invalid",
      "File bukan gambar yang valid.",
    );
  }

  const detectedMime = metadata.format
    ? mimeForFormat[metadata.format]
    : undefined;
  if (!detectedMime || detectedMime !== existing.mimeType)
    throw new MediaServiceError(
      "media_invalid",
      "Isi file tidak cocok dengan tipe gambar yang dipilih.",
    );
  const { width, height } = metadata;
  if (
    !width ||
    !height ||
    width > MAX_DIMENSION ||
    height > MAX_DIMENSION ||
    width * height > MAX_IMAGE_PIXELS ||
    (metadata.pages ?? 1) > 1
  )
    throw new MediaServiceError(
      "media_invalid",
      "Dimensi terlalu besar atau gambar animasi tidak didukung.",
    );

  const orientation = metadata.orientation ?? 1;
  const orientedWidth = orientation >= 5 && orientation <= 8 ? height : width;
  const orientedHeight = orientation >= 5 && orientation <= 8 ? width : height;
  const attemptId = randomUUID();
  const variantKeys = {} as Record<MediaVariant, string>;
  const createdKeys: string[] = [];
  let commitAttempted = false;

  try {
    for (const variant of Object.keys(variants) as MediaVariant[]) {
      const dimensions = variants[variant];
      const key = `media/${id}/${attemptId}/${variant}.webp`;
      const output = await sharp(inputBuffer, {
        failOn: "error",
        limitInputPixels: MAX_IMAGE_PIXELS,
        sequentialRead: true,
      })
        .rotate()
        .resize({
          width: dimensions.width,
          height: dimensions.height,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 82, effort: 4 })
        .toBuffer();
      await storage.put(key, output, "image/webp");
      createdKeys.push(key);
      variantKeys[variant] = key;
    }

    commitAttempted = true;
    const finalizedValue = await store.finalize({
      id,
      pendingKey: sourceKey,
      key: variantKeys.hero,
      filename: existing.filename,
      sizeBytes: source.byteLength,
      width: orientedWidth,
      height: orientedHeight,
      alt,
      variants: variantKeys,
      uploadedBy: existing.uploadedBy ?? actorId,
      actorId,
    });
    if (!finalizedValue)
      throw new MediaServiceError(
        "media_not_found",
        "Upload media tidak ditemukan.",
      );

    const finalized = mediaRecordSchema.parse(finalizedValue);
    if (!finalized.finalizedAt || finalized.deletedAt)
      throw new MediaServiceError(
        "media_unavailable",
        "Finalisasi media gagal.",
      );

    if (
      !Object.values(finalized.variants).some((key) =>
        createdKeys.includes(key),
      )
    )
      await removeObjects(storage, createdKeys);
    await removeObjects(storage, [sourceKey]);
    return toMediaAsset(finalized, storage);
  } catch (error) {
    // Once the DB commit starts, keep deterministic ownership decisions in the
    // store result; deleting here could remove another concurrent finalizer's files.
    if (!commitAttempted) await removeObjects(storage, createdKeys);
    throw error;
  }
}

function sanitizeFilename(filename: string): string {
  const basename = filename.replace(/\\/g, "/").split("/").at(-1) ?? "";
  const safe = basename
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, 255);
  if (!safe)
    throw new MediaServiceError(
      "media_invalid",
      "Nama file gambar tidak valid.",
    );
  return safe;
}

async function removeObjects(
  storage: MediaObjectStorage,
  keys: string[],
): Promise<void> {
  await Promise.allSettled(keys.map((key) => storage.remove(key)));
}

function toMediaAsset(
  record: MediaRecord,
  storage: MediaObjectStorage,
): MediaAsset {
  if (!record.finalizedAt || record.deletedAt)
    throw new MediaServiceError(
      "media_invalid",
      "Media belum selesai difinalisasi.",
    );
  const requiredVariants: MediaVariant[] = ["thumb", "card", "hero", "og"];
  const urls = Object.fromEntries(
    requiredVariants.map((variant) => {
      const key = record.variants[variant];
      if (!key)
        throw new MediaServiceError(
          "media_unavailable",
          "Varian gambar tidak lengkap.",
        );
      return [variant, storage.publicUrl(key)];
    }),
  );
  return mediaAssetSchema.parse({ ...record, urls });
}

export async function listAdminMedia(
  store: MediaStore,
  storage: MediaObjectStorage,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<MediaAsset[]> {
  authorize(principal, "media", "read");
  const options = mediaListOptionsSchema.parse(input);
  const records = await store.listFinalized(options);
  return records.map((record) =>
    toMediaAsset(mediaRecordSchema.parse(record), storage),
  );
}
