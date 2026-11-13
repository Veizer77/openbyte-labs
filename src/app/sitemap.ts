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
  const fetchProjectSlugs = async () => {
    const slugs: string[] = [];
    for (let offset = 0; ; offset += 100) {
      const batch = await listPublicProjects(store, { limit: 100, offset });
      for (const project of batch) slugs.push(`/proyek/${project.slug}`);
      if (batch.length < 100) break;
    }
    return slugs;
  };
  const fetchCustomPages = async () => {
    const rows = await getDb()
      .select({ slug: pages.slug })
      .from(pages)
      .where(and(eq(pages.publicationEnabled, true), isNull(pages.deletedAt)));
    const resolved = await Promise.all(rows.map((item) => getPublicPageView(item.slug)));
    const excluded = new Set(["proyek", "paket", "kalkulator", "pesan", "konsultasi", "tracking", "admin", "api", "health"]);
    const customPaths: string[] = [];
    for (const page of resolved) {
      if (page && !excluded.has(page.slug)) {
        customPaths.push(page.slug === "home" ? "/" : page.slug === "tentang" ? "/tentang-kami" : `/${page.slug}`);
      }
    }
    return customPaths;
  };

  const [projectPaths, services, storeSlugs, customPaths] = await Promise.all([
    fetchProjectSlugs(),
    getPublicServiceList(),
    listStoreSitemapSlugs(),
    fetchCustomPages(),
  ]);

  for (const projectPath of projectPaths) paths.add(projectPath);
  for (const service of services) {
    const slug = serviceSlug(service.title);
    if (slug) paths.add(`/layanan/${slug}`);
  }
  for (const slug of storeSlugs) {
    paths.add(`/store/${slug}`);
  }
  for (const customPath of customPaths) {
    paths.add(customPath);
  }
  return [...paths].map((path) => ({ url: `${origin}${path}` }));
}
