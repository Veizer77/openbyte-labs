import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { describe, expect, it, vi } from "vitest";
import { createR2MediaStorage } from "@/lib/server/r2-media-storage";

describe("adapter R2", () => {
  it("membuat signed PUT staging yang mengikat MIME upload", async () => {
    const storage = createR2MediaStorage({
      accountId: "12345678901234567890123456789012",
      accessKeyId: "test-access-key",
      secretAccessKey: "test-secret-key",
      stagingBucket: "private-staging",
      publicBucket: "public-assets",
      publicBaseUrl: "https://cdn.example",
    });

    const url = await storage.signPut({
      key: "pending/example/source",
      mimeType: "image/png",
      expiresInSeconds: 300,
    });
    const signedUrl = new URL(url);
    const signedHeaders = signedUrl.searchParams
      .get("X-Amz-SignedHeaders")
      ?.split(";");

    expect(signedUrl.hostname).toContain("private-staging.");
    expect(signedUrl.pathname).toBe("/pending/example/source");
    expect(signedUrl.searchParams.get("X-Amz-Expires")).toBe("300");
    expect(signedHeaders).toContain("content-type");
    expect(signedHeaders).toContain("host");
    expect(signedHeaders).not.toContain("content-length");
    expect(
      [...signedUrl.searchParams.keys()].some((key) =>
        key.toLowerCase().includes("checksum"),
      ),
    ).toBe(false);
  });

  it("menyimpan source import di bucket staging privat", async () => {
    const storage = createR2MediaStorage({
      accountId: "12345678901234567890123456789012",
      accessKeyId: "test-access-key",
      secretAccessKey: "test-secret-key",
      stagingBucket: "private-staging",
      publicBucket: "public-assets",
      publicBaseUrl: "https://cdn.example",
    });
    const send = vi.spyOn(S3Client.prototype, "send").mockResolvedValue({} as never);

    try {
      await storage.putPending(
        "pending/example/source",
        new Uint8Array([1, 2, 3]),
        "image/jpeg",
      );

      const command = send.mock.calls[0]?.[0];
      expect(command).toBeInstanceOf(PutObjectCommand);
      expect((command as PutObjectCommand).input).toMatchObject({
        Bucket: "private-staging",
        Key: "pending/example/source",
        ContentType: "image/jpeg",
        CacheControl: "private, no-store",
      });
    } finally {
      send.mockRestore();
    }
  });
});
