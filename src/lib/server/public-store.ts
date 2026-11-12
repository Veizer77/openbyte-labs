import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import { createStoreStore } from "@/db/store-store";
import {
  getPublicDigitalProductBySlug,
  listPublicDigitalProducts,
  listPublicProductReviews,
  listPublishedStoreSlugs,
  listRelatedDigitalProducts,
} from "@/services/store";
import { getPublicSiteSettings } from "@/lib/server/public-site";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";
import type { PublicStoreProduct } from "@/schemas/store";

async function safeSettings(): Promise<PublicSiteSettings | undefined> {
  try {
    return await getPublicSiteSettings();
  } catch {
    return undefined;
  }
}

async function loadCatalog() {
  const [products, settings] = await Promise.all([
    listPublicDigitalProducts(createStoreStore(getDb())),
    safeSettings(),
  ]);
  return { products, settings };
}

const cachedCatalog = unstable_cache(loadCatalog, ["public-store-catalog"], {
  tags: ["catalog", "settings"],
  revalidate: 300,
});

/** Public catalogue. Falls back to a live read when the incremental cache is cold. */
export async function getPublicStoreCatalog(): Promise<{
  products: PublicStoreProduct[];
  settings?: PublicSiteSettings;
}> {
  if (process.env.NODE_ENV === "development") {
    return loadCatalog();
  }
  try {
    return await cachedCatalog();
  } catch (error) {
    if (error instanceof Error && /incrementalCache/i.test(error.message)) {
      return loadCatalog();
    }
    throw error;
  }
}

export const getPublicStoreProduct = cache(async (slug: unknown) => {
  const store = createStoreStore(getDb());
  const product = await getPublicDigitalProductBySlug(store, slug);
  if (!product) return null;
  const [settings, reviews, related] = await Promise.all([
    safeSettings(),
    listPublicProductReviews(store, product.slug).catch(() => []),
    listRelatedDigitalProducts(store, product.slug).catch(() => []),
  ]);
  return { product, settings, reviews, related };
});

export async function listStoreSitemapSlugs(): Promise<string[]> {
  try {
    return await listPublishedStoreSlugs(createStoreStore(getDb()));
  } catch {
    return [];
  }
}
