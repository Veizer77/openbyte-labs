import { NextResponse, type NextRequest } from "next/server";

function r2PublicOrigin(): string | null {
  try {
    const url = new URL(process.env.R2_PUBLIC_BASE_URL ?? "");
    return url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}
function r2UploadOrigins(): string[] {
  const account = process.env.R2_ACCOUNT_ID ?? "";
  const bucket = process.env.R2_BUCKET_STAGING || process.env.R2_BUCKET_PRIVATE || "";
  if (!/^[a-f0-9]{32}$/i.test(account) || !/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucket)) return [];
  return [`https://${account}.r2.cloudflarestorage.com`, `https://${bucket}.${account}.r2.cloudflarestorage.com`];
}
function monitoringOrigin(): string {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SENTRY_DSN ?? "");
    return url.protocol === "https:" && /^[a-z0-9.-]+\.sentry\.io$/i.test(url.hostname) ? url.origin : "";
  } catch { return ""; }
}

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const isDev = process.env.NODE_ENV === "development";
  const imageSources = ["'self'", "blob:", "data:", r2PublicOrigin()].filter(
    (source): source is string => Boolean(source),
  );
  // Next.js dev tools (error overlay, indicator, React DevTools) inject <style>
  // elements at runtime, so they never carry the request nonce. A nonce in
  // `style-src` makes browsers ignore `'unsafe-inline'`, which left the overlay
  // unstyled and parked the indicator at the end of the document. Production
  // never ships those styles, so it keeps the stricter nonce-only policy.
  const styleSrc = isDev
    ? "style-src 'self' 'unsafe-inline'"
    : `style-src 'self' 'nonce-${nonce}'`;
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ""}`,
    styleSrc,
    "style-src-attr 'unsafe-inline'",
    `img-src ${imageSources.join(" ")}`,
    "font-src 'self' data:",
    // Turnstile calls per-customer subdomains such as hagen.challenges.cloudflare.com.
    `connect-src 'self' https://challenges.cloudflare.com https://*.challenges.cloudflare.com ${r2UploadOrigins().join(" ")} ${monitoringOrigin()}`,
    // The Turnstile challenge iframe is served from a per-customer subdomain.
    "frame-src https://challenges.cloudflare.com https://*.challenges.cloudflare.com https://www.youtube-nocookie.com https://player.vimeo.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
