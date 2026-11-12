import type { MetadataRoute } from "next";
import { publicIndexingEnabled, publicSiteOrigin } from "@/lib/indexing";
import { getDb } from "@/db";
import { createPublicProjectStore } from "@/db/public-project-store";
import { listPublicProjects } from "@/services/public-projects";
import { getEnv } from "@/env";
import { pages } from "@/db/schema/content";
import { and, eq, isNull } from "drizzle-orm";
import { getPublicPageView } from "@/lib/server/public-pages";
import { getPublicServiceList } from "@/lib/server/public-catalog";
import { serviceSlug } from "@/lib/service-slug";
import { listStoreSitemapSlugs } from "@/lib/server/public-store";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!publicIndexingEnabled()) return [];
  const origin = publicSiteOrigin()!;
  const paths = new Set(["/", "/proyek", "/paket", "/kalkulator", "/tentang-kami", "/kebijakan-privasi", "/ketentuan-layanan", "/store"]);
  // Catatan: "/blog" sengaja tidak dimasukkan. Modul editorial belum ada,
  // jadi halaman itu hanya berisi keadaan kosong dan tidak layak diindeks.
  const store = createPublicProjectStore(getDb(), getEnv().R2_PUBLIC_BASE_URL);
  for (let offset = 0; ; offset += 100) {
    const batch = await listPublicProjects(store, { limit: 100, offset });
    for (const project of batch) paths.add(`/proyek/${project.slug}`);
    if (batch.length < 100) break;
  }
  for (const service of await getPublicServiceList()) {
    const slug = serviceSlug(service.title);
    if (slug) paths.add(`/layanan/${slug}`);
  }
  for (const slug of await listStoreSitemapSlugs()) {
    paths.add(`/store/${slug}`);
  }
  const customPages = await getDb().select({ slug: pages.slug }).from(pages).where(and(eq(pages.publicationEnabled, true), isNull(pages.deletedAt)));
  for (const item of customPages) {
    const page = await getPublicPageView(item.slug);
    if (page && !["proyek", "paket", "kalkulator", "pesan", "konsultasi", "tracking", "admin", "api", "health"].includes(page.slug)) paths.add(page.slug === "home" ? "/" : page.slug === "tentang" ? "/tentang-kami" : `/${page.slug}`);
  }
  return [...paths].map((path) => ({ url: `${origin}${path}` }));
}
