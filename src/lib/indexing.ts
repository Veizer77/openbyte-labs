export function publicSiteOrigin(env: Record<string, string | undefined> = process.env): string | null {
  try {
    const url = new URL(env.SITE_URL ?? "");
    if (url.protocol !== "https:" || url.username || url.password || ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || url.hostname.endsWith(".invalid")) return null;
    return url.origin;
  } catch { return null; }
}
/** An explicit launch approval is required; previews stay unindexed by default. */
export function publicIndexingEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.NODE_ENV === "production" && env.PUBLIC_INDEXING_ENABLED === "true" && publicSiteOrigin(env) !== null;
}
