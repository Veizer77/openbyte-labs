import type { NextConfig } from "next";
import { publicIndexingEnabled } from "./src/lib/indexing";

const config: NextConfig = {
  distDir: process.env.NEXT_OUTPUT_DIR || ".next",
  poweredByHeader: false,
  redirects() {
    return [
      { source: "/portofolio", destination: "/proyek", permanent: true },
      { source: "/portofolio/:slug", destination: "/proyek/:slug", permanent: true },
      { source: "/booking", destination: "/konsultasi", permanent: true },
      { source: "/layanan", destination: "/paket", permanent: true },
      { source: "/tentang", destination: "/tentang-kami", permanent: true },
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
      { source: "/preview/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default config;
