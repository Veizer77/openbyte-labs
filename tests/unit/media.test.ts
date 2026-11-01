import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import type { MediaRecord, MediaVariant } from "@/schemas/media";
import {
  createMediaUpload,
  finalizeMediaUpload,
  importMediaAsset,
  listAdminMedia,
  type MediaObjectStorage,
  type MediaStore,
} from "@/services/media";
import { MediaServiceError } from "@/services/media-errors";

const editor: AdminPrincipal = {
  id: "editor-profile-id",
  role: "editor",
  twoFactorVerified: true,
};
const mediaId = "03a45fa0-3b54-4d51-ac21-335a00655744";
const now = new Date("2026-10-30T10:00:00.000Z");

function makePending(overrides: Partial<MediaRecord> = {}): MediaRecord {
  return {
    id: mediaId,
    key: `pending/${mediaId}/source`,
    filename: "cover.png",
    mimeType: "image/png",
    sizeBytes: 1,
    width: null,
    height: null,
    alt: "",
    variants: {},
    uploadedBy: editor.id,
    finalizedAt: null,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function setupMedia(
  source: Uint8Array<ArrayBufferLike> = new Uint8Array([1]),
  options: { initialRecord?: boolean; uploadedBy?: string | null } = {},
) {
  let record: MediaRecord | null =
    options.initialRecord === false
      ? null
      : makePending({
          sizeBytes: source.byteLength,
          uploadedBy: options.uploadedBy ?? editor.id,
        });
  const store: MediaStore = {
    createPending: vi.fn(async (input) => {
      record = makePending(input);
      return record;
    }),
    read: vi.fn(async () => record),
    listFinalized: vi.fn(async () => (record ? [record] : [])),
    finalize: vi.fn(async (input) => {
      if (!record) return null;
      record = {
        ...record,
        key: input.key,
        mimeType: "image/webp",
        sizeBytes: input.sizeBytes,
        width: input.width,
        height: input.height,
        alt: input.alt,
        variants: input.variants,
        uploadedBy: input.uploadedBy,
        finalizedAt: now,
        updatedAt: now,
      };
      return record;
    }),
  };
  const storage: MediaObjectStorage = {
    signPut: vi.fn(async () => "https://r2.example/signed-put"),
    head: vi.fn(async () => ({
      sizeBytes: source.byteLength,
      mimeType: "image/png",
    })),
    get: vi.fn(async () => source),
    putPending: vi.fn(async () => undefined),
    put: vi.fn(async () => undefined),
    remove: vi.fn(async () => undefined),
    publicUrl: vi.fn((key) => `https://cdn.example/${key}`),
  };
  return { store, storage };
}

async function validPng(): Promise<Uint8Array<ArrayBuffer>> {
  const buffer = await sharp({
    create: {
      width: 128,
      height: 64,
      channels: 3,
      background: "#2468ac",
    },
  })
    .png()
    .toBuffer();
  return new Uint8Array(buffer);
}

describe("pipeline media R2", () => {
  it("mendaftarkan aset final untuk picker admin dengan URL varian", async () => {
    const bytes = await validPng();
    const ctx = setupMedia(bytes);
    await finalizeMediaUpload(ctx.store, ctx.storage, editor, {
      id: mediaId,
      alt: "Tampilan dashboard",
    });

    const assets = await listAdminMedia(
      ctx.store,
      ctx.storage,
      editor,
      { query: "dashboard", limit: 25, offset: 0 },
    );

    expect(ctx.store.listFinalized).toHaveBeenCalledWith({
      query: "dashboard",
      limit: 25,
      offset: 0,
    });
    expect(assets).toHaveLength(1);
    expect(assets[0]).toMatchObject({
      id: mediaId,
      alt: "Tampilan dashboard",
      urls: {
        card: expect.stringContaining("/card.webp"),
        hero: expect.stringContaining("/hero.webp"),
      },
    });
  });

  it("menolak listing media tanpa izin sebelum membaca store", async () => {
    const ctx = setupMedia();

    await expect(
      listAdminMedia(ctx.store, ctx.storage, null, { limit: 10, offset: 0 }),
    ).rejects.toThrow("Akses ditolak.");
    expect(ctx.store.listFinalized).not.toHaveBeenCalled();
  });

  it("tidak memproyeksikan media yang masih pending sebagai aset", async () => {
    const ctx = setupMedia();

    await expect(
      listAdminMedia(ctx.store, ctx.storage, editor, {}),
    ).rejects.toThrow("Media belum selesai difinalisasi.");
    expect(ctx.store.listFinalized).toHaveBeenCalledWith({
      limit: 50,
      offset: 0,
    });
  });

  it("membuat signed PUT dan metadata pending tanpa menyimpan byte di server", async () => {
    const ctx = setupMedia();

    const grant = await createMediaUpload(
      ctx.store,
      ctx.storage,
      editor,
      {
        filename: "folder\\cover.png",
        mimeType: "image/png",
        sizeBytes: 1,
      },
      now,
    );

    expect(grant.uploadUrl).toBe("https://r2.example/signed-put");
    expect(grant.headers).toEqual({ "Content-Type": "image/png" });
    expect(grant.expiresAt).toBe("2026-10-30T10:05:00.000Z");
    expect(ctx.storage.signPut).toHaveBeenCalledWith({
      key: `pending/${grant.id}/source`,
      mimeType: "image/png",
      expiresInSeconds: 300,
    });
    expect(ctx.store.createPending).toHaveBeenCalledWith(
      expect.objectContaining({ filename: "cover.png", uploadedBy: editor.id }),
    );
  });

  it("menolak tipe non-gambar atau file melebihi batas sebelum membuat URL", async () => {
    const ctx = setupMedia();

    await expect(
      createMediaUpload(ctx.store, ctx.storage, editor, {
        filename: "payload.svg",
        mimeType: "image/svg+xml",
        sizeBytes: 1,
      }),
    ).rejects.toThrow();
    await expect(
      createMediaUpload(ctx.store, ctx.storage, editor, {
        filename: "huge.png",
        mimeType: "image/png",
        sizeBytes: 15 * 1024 * 1024 + 1,
      }),
    ).rejects.toThrow();
    expect(ctx.storage.signPut).not.toHaveBeenCalled();
  });

  it("memvalidasi gambar dan menyimpan empat varian WebP sebelum finalisasi", async () => {
    const bytes = await validPng();
    const ctx = setupMedia(bytes);

    const asset = await finalizeMediaUpload(ctx.store, ctx.storage, editor, {
      id: mediaId,
      alt: "Tampilan dashboard",
    });

    expect(ctx.storage.head).toHaveBeenCalledWith(`pending/${mediaId}/source`);
    expect(ctx.storage.put).toHaveBeenCalledTimes(4);
    expect(ctx.store.finalize).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mediaId,
        width: 128,
        height: 64,
        alt: "Tampilan dashboard",
        actorId: editor.id,
      }),
    );
    const finalizeInput = vi.mocked(ctx.store.finalize).mock.calls[0]?.[0];
    expect(Object.keys(finalizeInput?.variants ?? {}).sort()).toEqual(
      ["card", "hero", "og", "thumb"].sort(),
    );
    expect(asset.mimeType).toBe("image/webp");
    expect(asset.urls.hero).toMatch(/^https:\/\/cdn\.example\/media\//);
    expect(ctx.storage.remove).toHaveBeenCalledWith(
      `pending/${mediaId}/source`,
    );
  });

  it("mengimpor gambar sebagai sistem tanpa membuat akun admin", async () => {
    const bytes = await validPng();
    const ctx = setupMedia(bytes, { initialRecord: false, uploadedBy: null });

    const asset = await importMediaAsset(ctx.store, ctx.storage, {
      id: mediaId,
      filename: "dashboard.png",
      mimeType: "image/png",
      bytes,
      alt: "Peta wilayah pada dashboard contoh",
    });

    expect(ctx.store.createPending).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mediaId,
        key: `pending/${mediaId}/source`,
        filename: "dashboard.png",
        mimeType: "image/png",
        uploadedBy: null,
      }),
    );
    expect(ctx.storage.putPending).toHaveBeenCalledWith(
      `pending/${mediaId}/source`,
      bytes,
      "image/png",
    );
    expect(ctx.store.finalize).toHaveBeenCalledWith(
      expect.objectContaining({ actorId: null, uploadedBy: null }),
    );
    expect(asset).toMatchObject({ id: mediaId, alt: "Peta wilayah pada dashboard contoh" });
  });

  it("menolak byte yang MIME-nya tidak cocok dan tidak memfinalisasi metadata", async () => {
    const bytes = await validPng();
    const ctx = setupMedia(bytes);
    vi.mocked(ctx.store.read).mockResolvedValue(
      makePending({ sizeBytes: bytes.byteLength, mimeType: "image/jpeg" }),
    );
    vi.mocked(ctx.storage.head).mockResolvedValue({
      sizeBytes: bytes.byteLength,
      mimeType: "image/jpeg",
    });

    await expect(
      finalizeMediaUpload(ctx.store, ctx.storage, editor, {
        id: mediaId,
        alt: "Gambar",
      }),
    ).rejects.toMatchObject<Partial<MediaServiceError>>({
      code: "media_invalid",
    });
    expect(ctx.storage.put).not.toHaveBeenCalled();
    expect(ctx.store.finalize).not.toHaveBeenCalled();
  });

  it("membersihkan varian parsial ketika penulisan R2 gagal", async () => {
    const bytes = await validPng();
    const ctx = setupMedia(bytes);
    vi.mocked(ctx.storage.put)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("R2 unavailable"));

    await expect(
      finalizeMediaUpload(ctx.store, ctx.storage, editor, {
        id: mediaId,
        alt: "Gambar",
      }),
    ).rejects.toThrow("R2 unavailable");
    expect(ctx.storage.remove).toHaveBeenCalledTimes(1);
    expect(ctx.store.finalize).not.toHaveBeenCalled();
  });

  it("mengembalikan aset yang sudah difinalisasi secara idempoten", async () => {
    const variants = Object.fromEntries(
      (["thumb", "card", "hero", "og"] as MediaVariant[]).map((variant) => [
        variant,
        `media/${mediaId}/done/${variant}.webp`,
      ]),
    ) as Record<MediaVariant, string>;
    const ctx = setupMedia();
    vi.mocked(ctx.store.read).mockResolvedValue(
      makePending({
        key: variants.hero,
        mimeType: "image/webp",
        alt: "Gambar tersimpan",
        width: 128,
        height: 64,
        variants,
        finalizedAt: now,
      }),
    );

    const asset = await finalizeMediaUpload(ctx.store, ctx.storage, editor, {
      id: mediaId,
      alt: "Abaikan nilai baru",
    });

    expect(asset.alt).toBe("Gambar tersimpan");
    expect(ctx.storage.head).not.toHaveBeenCalled();
    expect(ctx.store.finalize).not.toHaveBeenCalled();
  });
});
