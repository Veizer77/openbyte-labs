import { notFound, redirect } from "next/navigation";
import { getAdminPrincipal } from "@/auth/session";
import { getDb } from "@/db";
import { createProjectStore } from "@/db/project-store";
import { listAdminProjects } from "@/services/projects";
import { getPublicSiteSettings } from "@/lib/server/public-site";
import { getPublicMediaAssets } from "@/lib/server/public-media";
import { ProjectDetail } from "@/components/public/ProjectDetail";
import { DraftPreviewGate } from "@/components/admin/DraftPreviewGate";
import { createCategoryStore } from "@/db/category-store";
import { createTechnologyStore } from "@/db/technology-store";
import { listCategories } from "@/services/categories";
import { listAdminTechnologies } from "@/services/technologies";
import { z } from "zod";

export const dynamic = "force-dynamic";
export default async function ProjectPreview({ params }: { params: Promise<{ id: string }> }) {
  const principal = await getAdminPrincipal();
  if (!principal) redirect("/admin/login");
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const db = getDb();
  const [records, settings, categories, technologies] = await Promise.all([
    listAdminProjects(createProjectStore(db), principal, { limit: 100, offset: 0 }),
    getPublicSiteSettings(),
    listCategories(createCategoryStore(db), principal, { limit: 100, offset: 0 }),
    listAdminTechnologies(createTechnologyStore(db), principal, { limit: 100, offset: 0 }),
  ]);
  const project = records.find((item) => item.id === id);
  if (!project) notFound();
  const ids = [project.featuredImageId, project.ogImageId, ...project.gallery.map((image) => image.mediaId)];
  for (const block of project.contentBlocks) {
    if (block.type === "image") ids.push(block.mediaId);
    if (block.type === "gallery") ids.push(...block.images.map((image) => image.mediaId));
  }
  const media = await getPublicMediaAssets(db, ids);
  const cover = project.featuredImageId ? media.get(project.featuredImageId) : undefined;
  const data = { ...project, imageUrl: cover?.urls.hero ?? null, imageAlt: cover?.alt ?? project.title, categories: categories.filter((item) => project.categoryIds.includes(item.id)).map((item) => item.name), technologies: technologies.filter((item) => project.technologyIds.includes(item.id)).map((item) => item.name) };
  return <DraftPreviewGate kind="projects" slug={id}><div className="fixed left-4 top-20 z-50 rounded-lg bg-amber-100 p-3 text-sm">Preview draft proyek, hanya admin</div><ProjectDetail project={data} settings={settings} media={media} /></DraftPreviewGate>;
}
