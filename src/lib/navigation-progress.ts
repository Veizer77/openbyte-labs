/**
 * Decides whether a click on an anchor will trigger an in-app navigation that
 * deserves a progress indicator.
 *
 * Only same-origin, left-click, non-download, non-new-tab links to a different
 * URL qualify. Everything else (external sites, `#` anchors, `mailto:`, the
 * current page) is left to the browser so the bar never lies about progress.
 */
export function shouldTrackNavigation(input: {
  href: string | null;
  target: string | null;
  download: boolean;
  currentUrl: string;
  sameOrigin: boolean;
  modified?: boolean;
  button?: number;
}): boolean {
  if (input.modified) return false;
  if ((input.button ?? 0) !== 0) return false;
  if (input.target && input.target !== "_self") return false;
  if (input.download) return false;
  const href = input.href;
  if (!href || !href.startsWith("/") || href.startsWith("//")) return false;
  if (!input.sameOrigin) return false;
  let next: URL;
  let current: URL;
  try {
    current = new URL(input.currentUrl);
    next = new URL(href, current);
  } catch {
    return false;
  }
  if (next.origin !== current.origin) return false;
  return next.pathname !== current.pathname || next.search !== current.search;
}
