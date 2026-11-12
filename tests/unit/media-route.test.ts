import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const { getPublicMediaObject } = vi.hoisted(() => ({
  getPublicMediaObject: vi.fn(),
}));

vi.mock("@/lib/server/r2-media-storage", () => ({
  getPublicMediaObject,
}));

import { GET, HEAD } from "@/app/api/media/[...key]/route";

function makeRequest(url: string, headers: Record<string, string> = {}): NextRequest {
  return new Request(url, { headers }) as unknown as NextRequest;
}

describe("Media Proxy Route Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when media key contains directory traversal (..)", async () => {
    const req = makeRequest("https://example.com/api/media/../secret.env");
    const res = await GET(req, {
      params: Promise.resolve({ key: ["..", "secret.env"] }),
    });

    expect(res.status).toBe(400);
    expect(await res.text()).toBe("Invalid media key");
  });

  it("returns 400 when key is empty", async () => {
    const req = makeRequest("https://example.com/api/media");
    const res = await GET(req, {
      params: Promise.resolve({ key: [] }),
    });

    expect(res.status).toBe(400);
  });

  it("returns 404 when media is not found in R2", async () => {
    getPublicMediaObject.mockResolvedValue(null);

    const req = makeRequest("https://example.com/api/media/missing/image.webp");
    const res = await GET(req, {
      params: Promise.resolve({ key: ["missing", "image.webp"] }),
    });

    expect(res.status).toBe(404);
  });

  it("returns 200 with media bytes and cache headers when found", async () => {
    const sampleBytes = new Uint8Array([1, 2, 3, 4, 5]);
    getPublicMediaObject.mockResolvedValue({
      body: sampleBytes,
      contentType: "image/webp",
      contentLength: 5,
      etag: '"hash123"',
    });

    const req = makeRequest("https://example.com/api/media/test-sample/hero.webp");
    const res = await GET(req, {
      params: Promise.resolve({ key: ["test-sample", "hero.webp"] }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/webp");
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=31536000, immutable");
    expect(res.headers.get("ETag")).toBe('"hash123"');
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");

    const arrayBuffer = await res.arrayBuffer();
    expect(new Uint8Array(arrayBuffer)).toEqual(sampleBytes);
  });

  it("returns 304 when client sends matching If-None-Match header", async () => {
    getPublicMediaObject.mockResolvedValue({
      body: new Uint8Array([1, 2, 3]),
      contentType: "image/webp",
      contentLength: 3,
      etag: '"match-etag"',
    });

    const req = makeRequest("https://example.com/api/media/cached/hero.webp", {
      "if-none-match": '"match-etag"',
    });
    const res = await GET(req, {
      params: Promise.resolve({ key: ["cached", "hero.webp"] }),
    });

    expect(res.status).toBe(304);
  });

  it("HEAD handler returns headers without body", async () => {
    getPublicMediaObject.mockResolvedValue({
      body: new Uint8Array([1, 2, 3]),
      contentType: "image/webp",
      contentLength: 3,
      etag: '"head-etag"',
    });

    const req = makeRequest("https://example.com/api/media/test/hero.webp");
    const res = await HEAD(req, {
      params: Promise.resolve({ key: ["test", "hero.webp"] }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/webp");
    expect(res.headers.get("Content-Length")).toBe("3");
    const text = await res.text();
    expect(text).toBe("");
  });
});
