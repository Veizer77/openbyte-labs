import type { MetadataRoute } from "next";
import { publicIndexingEnabled, publicSiteOrigin } from "@/lib/indexing";
export default function robots(): MetadataRoute.Robots {
  if (publicIndexingEnabled()) return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/tracking", "/api", "/pesan", "/konsultasi", "/store/akses"] }, sitemap: `${publicSiteOrigin()}/sitemap.xml` };
  return { rules: { userAgent: "*", disallow: "/" } };
}
