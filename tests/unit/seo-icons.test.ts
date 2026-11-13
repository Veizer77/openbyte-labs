import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  buildPublicPageIcons,
  isGoogleSearchSupportedFaviconUrl,
  PUBLIC_SITE_ICONS,
} from "@/lib/seo-icons";

describe("Google Search favicon compliance", () => {
  it("rejects .webp favicon URLs and keeps non-webp URLs", () => {
    expect(
      isGoogleSearchSupportedFaviconUrl(
        "https://media.openbyte-labs.web.id/media/a/b/thumb.webp",
      ),
    ).toBe(false);
    expect(
      isGoogleSearchSupportedFaviconUrl("/api/media/id/thumb.WEBP?v=2"),
    ).toBe(false);
    expect(isGoogleSearchSupportedFaviconUrl("")).toBe(false);
    expect(
      isGoogleSearchSupportedFaviconUrl("https://cdn.example.com/favicon.png"),
    ).toBe(true);
    expect(isGoogleSearchSupportedFaviconUrl("/icons/icon-48x48.png")).toBe(
      true,
    );
  });

  it("does not override root icons when CMS favicon is null or .webp", () => {
    expect(buildPublicPageIcons(null)).toBeUndefined();
    expect(buildPublicPageIcons(undefined)).toBeUndefined();
    expect(
      buildPublicPageIcons(
        "https://media.openbyte-labs.web.id/media/e53bfa51/c97507ab/thumb.webp",
      ),
    ).toBeUndefined();
  });

  it("preserves default ICO/PNG/SVG fallback icons when CMS provides a supported URL", () => {
    const resolved = buildPublicPageIcons("https://cdn.example.com/logo.png");
    expect(resolved).toBeDefined();
    expect(Array.isArray(resolved?.icon)).toBe(true);
    const urls = (resolved?.icon as Array<{ url: string }>).map((entry) => entry.url);
    expect(urls).toEqual([
      "https://cdn.example.com/logo.png",
      "/favicon.ico",
      "/icons/icon-48x48.png",
      "/icons/icon-96x96.png",
      "/icons/icon-192x192.png",
      "/brand/openbyte-labs-square-icon-1-1-logo-only.svg",
    ]);
    expect(resolved?.shortcut).toBe(PUBLIC_SITE_ICONS.shortcut);
    expect(resolved?.apple).toEqual(PUBLIC_SITE_ICONS.apple);
  });

  it("ships a valid multi-size ICO header in public/favicon.ico", () => {
    const buf = fs.readFileSync(path.join(process.cwd(), "public/favicon.ico"));
    // Reserved = 0x0000, Type = 0x0001 (ICO), ImageCount >= 1
    expect(buf.readUInt16LE(0)).toBe(0);
    expect(buf.readUInt16LE(2)).toBe(1);
    expect(buf.readUInt16LE(4)).toBeGreaterThanOrEqual(3);
  });

  it("ships Google Search multiple-of-48px PNG icons and Apple 180px icon", async () => {
    const expected: Array<[string, number]> = [
      ["public/icons/icon-48x48.png", 48],
      ["public/icons/icon-96x96.png", 96],
      ["public/icons/icon-192x192.png", 192],
      ["public/icons/apple-touch-icon.png", 180],
    ];
    for (const [relPath, size] of expected) {
      const meta = await sharp(path.join(process.cwd(), relPath)).metadata();
      expect(meta.format).toBe("png");
      expect(meta.width).toBe(size);
      expect(meta.height).toBe(size);
    }
  });
});
