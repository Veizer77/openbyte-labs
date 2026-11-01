import "server-only";
import { getDb } from "@/db";
import { createPublicPageStore } from "@/db/public-page-store";
import { getPublicMediaAssets } from "@/lib/server/public-media";
import {
  getAdminPagePreview,
  getPublishedPage,
} from "@/services/public-pages";
import type { AdminPrincipal } from "@/access/rules";
import type { PageRecord } from "@/schemas/pages";
import type { PageBlock } from "@/schemas/blocks";
import type { PublicMediaAsset } from "@/schemas/media";

export interface PublicPageView {
  slug: string;
  title: string;
  layout: PageBlock[];
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  /** Used only by server-rendered page blocks; media IDs are not emitted. */
  media: ReadonlyMap<string, PublicMediaAsset>;
}

function referencedMediaIds(page: PageRecord): string[] {
  const ids = [page.ogImageId];
  for (const block of page.layout) {
    if (block.type === "hero") ids.push(block.heroImageId);
    if (block.type === "about") ids.push(block.imageId);
  }
  return [...new Set(ids.filter((id): id is string => id !== null))];
}

async function toPageView(page: PageRecord): Promise<PublicPageView> {
  const db = getDb();
  const media = await getPublicMediaAssets(db, referencedMediaIds(page));
  return {
    slug: page.slug,
    title: page.title,
    layout: page.layout,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    ogImageUrl: page.ogImageId
      ? (media.get(page.ogImageId)?.urls.og ?? null)
      : null,
    media,
  };
}

export async function getPublicPageView(slug: unknown) {
  const page = await getPublishedPage(
    createPublicPageStore(getDb()),
    slug,
  );
  return page ? toPageView(page) : null;
}

export async function getAdminPagePreviewView(
  slug: unknown,
  principal: AdminPrincipal | null,
) {
  const page = await getAdminPagePreview(
    createPublicPageStore(getDb()),
    principal,
    slug,
  );
  return page ? toPageView(page) : null;
}
