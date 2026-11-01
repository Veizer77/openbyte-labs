/** A stored navigation target must never expose internal or gated routes. */
export function isPublicNavigationTarget(target: string, trackingEnabled: boolean) {
  if (/^\/tracking(?:\/|$)/i.test(target)) return trackingEnabled;
  if (/^https:\/\//i.test(target)) {
    try {
      const url = new URL(target);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  }
  if (!target.startsWith("/") || target.startsWith("//")) return false;
  const path = target.split(/[?#]/, 1)[0];
  if (/^\/(?:admin|api|preview)(?:\/|$)/i.test(path)) return false;
  return /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/i.test(path);
}
