/**
 * Formats a public `<title>` so every indexable page carries the brand name
 * without duplicating it when CMS metadata already includes the brand.
 */
export function formatPublicPageTitle(
  rawTitle: string,
  brandName = "OpenByte Labs",
  options?: { isHome?: boolean },
): { absolute: string } {
  const trimmedTitle = rawTitle.trim();
  const trimmedBrand = brandName.trim() || "OpenByte Labs";
  if (!trimmedTitle) {
    return { absolute: trimmedBrand };
  }

  const normalizedTitle = trimmedTitle.toLowerCase().replace(/\s+/g, " ");
  const normalizedBrand = trimmedBrand.toLowerCase().replace(/\s+/g, " ");
  const compactBrand = normalizedBrand.replace(/\s+/g, "");
  const compactTitle = normalizedTitle.replace(/\s+/g, "");

  if (
    normalizedTitle.includes(normalizedBrand) ||
    (compactBrand.length > 0 && compactTitle.includes(compactBrand))
  ) {
    return { absolute: trimmedTitle };
  }

  if (options?.isHome) {
    return { absolute: `${trimmedBrand} — ${trimmedTitle}` };
  }

  return { absolute: `${trimmedTitle} | ${trimmedBrand}` };
}
