import { notFound, redirect } from "next/navigation";
import { getAdminPrincipal } from "@/auth/session";
import { PublicPageBuilder } from "@/components/public/PublicPageBuilder";
import { getPublicCatalog } from "@/lib/server/public-catalog";
import { getAdminPagePreviewView } from "@/lib/server/public-pages";
import { DraftPreviewGate } from "@/components/admin/DraftPreviewGate";

export const dynamic = "force-dynamic";

export default async function AdminPagePreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const principal = await getAdminPrincipal();
  if (!principal) redirect("/admin/login");

  const { slug } = await params;
  const [page, catalog] = await Promise.all([
    getAdminPagePreviewView(slug, principal),
    getPublicCatalog(),
  ]);
  if (!page) notFound();
  return <DraftPreviewGate kind="pages" slug={slug}><PublicPageBuilder page={page} catalog={catalog} preview /></DraftPreviewGate>;
}
