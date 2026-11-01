import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { privateStorage } from "@/lib/server/r2-private-storage";

const mock = vi.hoisted(() => ({
  send: vi.fn(),
  sign: vi.fn(),
  env: {
    R2_ACCOUNT_ID: "a".repeat(32),
    R2_ACCESS_KEY_ID: "test-key",
    R2_SECRET_ACCESS_KEY: "test-secret",
    R2_BUCKET_STAGING: "private-files",
    R2_BUCKET_PUBLIC: "public-assets",
  },
}));
vi.mock("@/env", () => ({ getEnv: () => mock.env }));
vi.mock("@aws-sdk/client-s3", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@aws-sdk/client-s3")>();
  return {
    ...actual,
    S3Client: class {
      send = mock.send;
    },
  };
});
vi.mock("@aws-sdk/s3-request-presigner", () => ({ getSignedUrl: mock.sign }));
beforeEach(() => {
  vi.resetAllMocks();
  mock.env.R2_BUCKET_STAGING = "private-files";
  mock.env.R2_BUCKET_PUBLIC = "public-assets";
  mock.sign.mockResolvedValue("https://signed.example.test/object");
});
describe("private attachment storage", () => {
  it("fails closed when the configured private bucket is also public", () => {
    mock.env.R2_BUCKET_STAGING = mock.env.R2_BUCKET_PUBLIC;
    expect(() => privateStorage()).toThrow(/terpisah/);
    expect(mock.send).not.toHaveBeenCalled();
  });
  it("checks size, MIME and content, then freezes the verified bytes under a new key", async () => {
    const bytes = Buffer.from("%PDF-1.7\nfixture");
    mock.send.mockImplementation(async (command: unknown) => {
      if (command instanceof HeadObjectCommand)
        return { ContentLength: bytes.length, ContentType: "application/pdf" };
      if (command instanceof GetObjectCommand)
        return { Body: { transformToByteArray: async () => bytes } };
      return {};
    });
    const source = "tracking/project/pending/upload";
    const key = await privateStorage().verifyAndMove("project", {
      key: source,
      sizeBytes: bytes.length,
      mimeType: "application/pdf",
    });
    expect(key).toMatch(/^tracking\/project\/files\//);
    expect(key).not.toBe(source);
    const commands = mock.send.mock.calls.map((c) => c[0]);
    const read = commands.find(
      (c) => c instanceof GetObjectCommand,
    ) as GetObjectCommand;
    expect(read.input.Range).toBe("bytes=0-5242880");
    const put = commands.find(
      (c) => c instanceof PutObjectCommand,
    ) as PutObjectCommand;
    expect(put.input).toMatchObject({
      Bucket: "private-files",
      Key: key,
      Body: bytes,
      ContentDisposition: "attachment",
      CacheControl: "private, no-store",
    });
    const remove = commands.find(
      (c) => c instanceof DeleteObjectCommand,
    ) as DeleteObjectCommand;
    expect(remove.input.Key).toBe(source);
  });
  it("deletes a mismatched upload without reading or publishing it", async () => {
    mock.send.mockImplementation(async (command: unknown) =>
      command instanceof HeadObjectCommand
        ? { ContentLength: 6000000, ContentType: "application/pdf" }
        : {},
    );
    await expect(
      privateStorage().verifyAndMove("project", {
        key: "pending/upload",
        sizeBytes: 12,
        mimeType: "application/pdf",
      }),
    ).rejects.toThrow(/Ukuran atau tipe/);
    expect(
      mock.send.mock.calls.some(([c]) => c instanceof DeleteObjectCommand),
    ).toBe(true);
    expect(
      mock.send.mock.calls.some(
        ([c]) => c instanceof GetObjectCommand || c instanceof PutObjectCommand,
      ),
    ).toBe(false);
  });
  it("rejects content that merely declares a permitted MIME type", async () => {
    const bytes = Buffer.from("<script>bad</script>");
    mock.send.mockImplementation(async (command: unknown) => {
      if (command instanceof HeadObjectCommand)
        return { ContentLength: bytes.length, ContentType: "application/pdf" };
      if (command instanceof GetObjectCommand)
        return { Body: { transformToByteArray: async () => bytes } };
      return {};
    });
    await expect(
      privateStorage().verifyAndMove("project", {
        key: "pending/upload",
        sizeBytes: bytes.length,
        mimeType: "application/pdf",
      }),
    ).rejects.toThrow(/Isi berkas/);
    expect(
      mock.send.mock.calls.some(([c]) => c instanceof PutObjectCommand),
    ).toBe(false);
  });
  it("issues a 60-second attachment download, never a public base URL", async () => {
    await privateStorage().downloadUrl(
      "tracking/project/files/verified",
      "Surat kontrak.pdf",
    );
    const command = mock.sign.mock.calls[0][1] as GetObjectCommand;
    expect(command.input).toMatchObject({
      Bucket: "private-files",
      Key: "tracking/project/files/verified",
      ResponseContentType: "application/octet-stream",
      ResponseCacheControl: "private, no-store",
    });
    expect(command.input.ResponseContentDisposition).toContain(
      "Surat%20kontrak.pdf",
    );
    expect(mock.sign.mock.calls[0][2]).toEqual({ expiresIn: 60 });
  });
});
