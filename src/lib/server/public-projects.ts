import "server-only";
import { getDb } from "@/db";
import { createPublicProjectStore } from "@/db/public-project-store";
import { getEnv } from "@/env";
import {
  getPublicProjectBySlug as readPublicProjectBySlug,
  listPublicProjects as readPublicProjects,
} from "@/services/public-projects";
import { getPublicSiteSettings } from "@/lib/server/public-site";
import { createCategoryStore } from "@/db/category-store";
import { listPublicCategories } from "@/services/categories";
import { getPublicMediaAssets } from "@/lib/server/public-media";
import { cache } from "react";

function stores() {
  const db = getDb();
  const env = getEnv();
  return {
    projects: createPublicProjectStore(db, env.R2_PUBLIC_BASE_URL),
  };
}

export async function getPublicProjectListing() {
  const store = stores();
  const [projects, settings, categories] = await Promise.all([
    readPublicProjects(store.projects),
    getPublicSiteSettings(),
    listPublicCategories(createCategoryStore(getDb()), { limit: 100, offset: 0 }),
  ]);
  return { projects, settings, categories: categories.map(({ name, slug }) => ({ name, slug })) };
}

export const getPublicProject = cache(async (slug: unknown) => {
  const store = stores();
  const project = await readPublicProjectBySlug(store.projects, slug);
  if (!project) return null;
  const mediaIds = [...project.gallery.map((image) => image.mediaId), ...(project.ogImageId ? [project.ogImageId] : [])];
  for (const block of project.contentBlocks) {
    if (block.type === "image") mediaIds.push(block.mediaId);
    if (block.type === "gallery") mediaIds.push(...block.images.map((image) => image.mediaId));
  }
  const [settings, media, candidates] = await Promise.all([
    getPublicSiteSettings(),
    getPublicMediaAssets(getDb(), [...new Set(mediaIds)]),
    readPublicProjects(store.projects),
  ]);
  const related = candidates.filter((item) => item.slug !== project.slug && item.categories.some((category) => project.categories.includes(category))).slice(0, 3);
  return { project, settings, media, related };
});
