import { type NextRequest } from "next/server";
import { getPublicMediaObject } from "@/lib/server/r2-media-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CacheEntry {
  body: Uint8Array;
  contentType: string;
  contentLength: number;
  etag?: string;
}

// In-memory LRU cache to avoid re-fetching assets from R2 repeatedly
const cache = new Map<string, CacheEntry>();
const MAX_CACHE_ENTRIES = 200;

function setInCache(key: string, entry: CacheEntry) {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
  cache.set(key, entry);
}

async function resolveMedia(key: string): Promise<CacheEntry | null> {
  const cached = cache.get(key);
  if (cached) return cached;

  // 1. Try directly with the requested key
  let asset = await getPublicMediaObject(key);

  // 2. If not found and key doesn't start with "media/", try prepending "media/"
  if (!asset && !key.startsWith("media/")) {
    asset = await getPublicMediaObject(`media/${key}`);
  }

  // 3. If still not found and key starts with "media/", try stripping "media/"
  if (!asset && key.startsWith("media/")) {
    asset = await getPublicMediaObject(key.slice("media/".length));
  }

  if (asset) {
    setInCache(key, asset);
    return asset;
  }

  return null;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ key: string[] }> },
): Promise<Response> {
  const { key: segments } = await context.params;
  if (!segments || segments.length === 0) {
    return new Response("Media key missing", {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const rawKey = segments.join("/");
  // Prevent directory traversal or invalid control characters
  if (rawKey.includes("..") || /[^a-zA-Z0-9_\-\./]/.test(rawKey)) {
    return new Response("Invalid media key", {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const asset = await resolveMedia(rawKey);
    if (!asset) {
      return new Response("Media not found", {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const ifNoneMatch = request.headers.get("if-none-match");
    if (asset.etag && ifNoneMatch === asset.etag) {
      return new Response(null, {
        status: 304,
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
          ETag: asset.etag,
        },
      });
    }

    return new Response(Buffer.from(asset.body), {
      status: 200,
      headers: {
        "Content-Type": asset.contentType,
        "Content-Length": String(asset.contentLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        ...(asset.etag ? { ETag: asset.etag } : {}),
      },
    });
  } catch (error) {
    console.error(`[media-route] Error serving key "${rawKey}":`, error);
    return new Response("Media retrieval error", {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}

export async function HEAD(
  request: NextRequest,
  context: { params: Promise<{ key: string[] }> },
): Promise<Response> {
  const { key: segments } = await context.params;
  if (!segments || segments.length === 0) {
    return new Response(null, { status: 400 });
  }

  const rawKey = segments.join("/");
  if (rawKey.includes("..") || /[^a-zA-Z0-9_\-\./]/.test(rawKey)) {
    return new Response(null, { status: 400 });
  }

  try {
    const asset = await resolveMedia(rawKey);
    if (!asset) {
      return new Response(null, { status: 404 });
    }

    const ifNoneMatch = request.headers.get("if-none-match");
    if (asset.etag && ifNoneMatch === asset.etag) {
      return new Response(null, {
        status: 304,
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
          ETag: asset.etag,
        },
      });
    }

    return new Response(null, {
      status: 200,
      headers: {
        "Content-Type": asset.contentType,
        "Content-Length": String(asset.contentLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        ...(asset.etag ? { ETag: asset.etag } : {}),
      },
    });
  } catch {
    return new Response(null, { status: 500 });
  }
}
