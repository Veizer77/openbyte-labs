import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getDb } from "@/db";
import { createCategoryStore } from "@/db/category-store";
import { createFaqStore } from "@/db/faq-store";
import { createPackageStore } from "@/db/package-store";
import { createServiceStore } from "@/db/service-store";
import { createPublicProjectStore } from "@/db/public-project-store";
import { createTestimonialStore } from "@/db/testimonial-store";
import { createServiceAddonStore } from "@/db/service-addon-store";
import { listPublicCategories } from "@/services/categories";
import { listPublicFaqs } from "@/services/faqs";
import { listPublicPackages } from "@/services/packages";
import { listPublicServices } from "@/services/services";
import { listPublicProjects } from "@/services/public-projects";
import { listPublicTestimonials } from "@/services/testimonials";
import { listPublicServiceAddons } from "@/services/service-addons";
import { getEnv } from "@/env";
import { getPublicSiteSettings } from "@/lib/server/public-site";
import { getPublicMediaAssets } from "@/lib/server/public-media";
import {
  projectPublicServiceAddons,
  projectPublicTestimonials,
} from "@/schemas/public-catalog";

const listOptions = { limit: 100, offset: 0 } as const;

function omitKeys<T extends object, K extends keyof T>(
  value: T,
  ...keys: K[]
): Omit<T, K> {
  const result = { ...value };
  for (const key of keys) Reflect.deleteProperty(result, key);
  return result as Omit<T, K>;
}

const cachedPublicServiceList = unstable_cache(
  async () => listPublicServices(createServiceStore(getDb()), listOptions),
  ["public-service-list"],
  { tags: ["catalog"], revalidate: 300 },
);

export const getPublicServiceList = cache(async function getPublicServiceList() {
  try {
    return await cachedPublicServiceList();
  } catch (error) {
    if (error instanceof Error && /incrementalCache/i.test(error.message)) {
      return listPublicServices(createServiceStore(getDb()), listOptions);
    }
    throw error;
  }
});

async function loadPublicCatalog() {
  const db = getDb();
  const [settings, categories, packages, faqs, services, projects, testimonials, addons] =
    await Promise.all([
    getPublicSiteSettings(),
    listPublicCategories(createCategoryStore(db), listOptions),
    listPublicPackages(createPackageStore(db), listOptions),
    listPublicFaqs(createFaqStore(db), listOptions),
    listPublicServices(createServiceStore(db), listOptions),
    listPublicProjects(
      createPublicProjectStore(db, getEnv().R2_PUBLIC_BASE_URL),
      listOptions,
    ),
    listPublicTestimonials(createTestimonialStore(db), listOptions),
    listPublicServiceAddons(createServiceAddonStore(db), listOptions),
  ]);
  const testimonialMedia = await getPublicMediaAssets(
    db,
    testimonials.map((item) => item.photoId),
  );

  return {
    settings,
    categories,
    packages: packages.map((item) =>
      omitKeys(item, "deletedAt", "categoryActive"),
    ),
    faqs: faqs.map((item) => omitKeys(item, "requiresTracking")),
    services,
    projects,
    testimonials: projectPublicTestimonials(testimonials, testimonialMedia),
    addons: projectPublicServiceAddons(addons),
  };
}

const cachedPublicCatalog = unstable_cache(
  loadPublicCatalog,
  ["public-catalog"],
  { tags: ["catalog", "settings", "faqs"], revalidate: 300 },
);

/**
 * Server Component loader for the first database-backed public catalog.
 * Each section is validated and projected by its domain service.
 */
export const getPublicCatalog = cache(async function getPublicCatalog() {
  let raw: Awaited<ReturnType<typeof loadPublicCatalog>>;
  try {
    raw = await cachedPublicCatalog();
  } catch (error) {
    if (error instanceof Error && /incrementalCache/i.test(error.message)) {
      raw = await loadPublicCatalog();
    } else {
      throw error;
    }
  }
  const now = new Date();
  return {
    ...raw,
    packages: raw.packages.map((pkg) => ({
      ...pkg,
      discountEndsAt: pkg.discountEndsAt ? new Date(pkg.discountEndsAt) : null,
      effectivePrice:
        pkg.discountPrice !== null &&
        pkg.discountEndsAt !== null &&
        new Date(pkg.discountEndsAt) > now
          ? pkg.discountPrice
          : pkg.price,
    })),
  };
});

export type PublicCatalog = Awaited<ReturnType<typeof getPublicCatalog>>;
