import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";
import { publicIndexingEnabled } from "./src/lib/indexing";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_OUTPUT_DIR || ".next",
  poweredByHeader: false,
  redirects() {
    return [
      { source: "/portofolio", destination: "/proyek", permanent: true },
      { source: "/portofolio/:slug", destination: "/proyek/:slug", permanent: true },
      { source: "/booking", destination: "/konsultasi", permanent: true },
      { source: "/layanan", destination: "/paket", permanent: true },
      { source: "/tentang", destination: "/tentang-kami", permanent: true },
      // Design route map (prototype/stitch/system/route-map-architecture.html).
      { source: "/admin/proyek", destination: "/admin/proyek-klien", permanent: true },
      { source: "/admin/paket", destination: "/admin/packages", permanent: true },
      { source: "/admin/staf", destination: "/admin/users", permanent: true },
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
    ];
    if (!publicIndexingEnabled()) securityHeaders.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });
    if (process.env.NODE_ENV === "production") {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000",
      });
    }
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      { source: "/tracking/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

/**
 * Source map upload is opt-in: it only runs when the build has a Sentry auth
 * token plus the organization and project slugs. CI builds have none of them,
 * so the wrapper is skipped and the build stays a plain `next build`.
 * `org`/`project` are slugs (not secrets); `SENTRY_AUTH_TOKEN` is read from the
 * environment by the Sentry build plugin and never written into this file.
 */
const sentryOrg = process.env.SENTRY_ORG?.trim();
const sentryProject = process.env.SENTRY_PROJECT?.trim();
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN?.trim();

export default sentryAuthToken && sentryOrg && sentryProject
  ? withSentryConfig(nextConfig, {
      org: sentryOrg,
      project: sentryProject,
      telemetry: false,
      widenClientFileUpload: true,
      // Source maps are deleted from the build output right after the upload
      // attempt, so they are never served from the deployment. A failed upload
      // therefore costs symbolication, not confidentiality.
      sourcemaps: { deleteSourcemapsAfterUpload: true },
      // Navigation tracing is disabled (tracesSampleRate: 0), so the router
      // transition hook is intentionally not exported.
      suppressOnRouterTransitionStartWarning: true,
    })
  : nextConfig;
