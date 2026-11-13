import type { Metadata } from "next";

const DEFAULT_ICON_ENTRIES = [
  { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
  { url: "/icons/icon-48x48.png", sizes: "48x48", type: "image/png" },
  { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
  { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
  {
    url: "/brand/openbyte-labs-square-icon-1-1-logo-only.svg",
    type: "image/svg+xml",
    sizes: "any",
  },
];

type IconsObject = Exclude<NonNullable<Metadata["icons"]>, string | URL | unknown[]>;

/**
 * Baseline icon metadata emitted in root `<head>`.
 * Uses standard ICO/PNG (multiples of 48px) and SVG assets required by Google Search.
 */
export const PUBLIC_SITE_ICONS: IconsObject = {
  icon: DEFAULT_ICON_ENTRIES,
  shortcut: "/favicon.ico",
  apple: [
    {
      url: "/icons/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  ],
};

/**
 * Returns true if the URL path does not use `.webp` (unsupported by Google Search favicons).
 */
export function isGoogleSearchSupportedFaviconUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  return !/\.webp(?:$|[?#])/i.test(trimmed);
}

/**
 * Resolves page-level `icons` metadata without letting a `.webp` CMS favicon
 * override the compliant root ICO/PNG/SVG icon declarations.
 */
export function buildPublicPageIcons(
  cmsFaviconUrl: string | null | undefined,
): IconsObject | undefined {
  if (!cmsFaviconUrl || !isGoogleSearchSupportedFaviconUrl(cmsFaviconUrl)) {
    return undefined;
  }

  return {
    icon: [{ url: cmsFaviconUrl.trim() }, ...DEFAULT_ICON_ENTRIES],
    shortcut: "/favicon.ico",
    apple: PUBLIC_SITE_ICONS.apple,
  };
}
