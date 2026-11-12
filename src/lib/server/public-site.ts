import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getDb } from "@/db";
import { createPublicSiteStore } from "@/db/public-site-store";
import {
  publicSiteSettingsMediaIds,
  toPublicSiteSettings,
} from "@/schemas/public-site-settings";
import { getPublicMediaAssets } from "@/lib/server/public-media";

async function loadPublicSiteSettings() {
  const db = getDb();
  const document = await createPublicSiteStore(db).readSettingsDocument();
  return toPublicSiteSettings(
    document,
    await getPublicMediaAssets(db, publicSiteSettingsMediaIds(document)),
  );
}

const cachedPublicSiteSettings = unstable_cache(
  loadPublicSiteSettings,
  ["public-site-settings"],
  { tags: ["settings"], revalidate: 300 },
);

/** Server Component entry point for live public Settings. */
export const getPublicSiteSettings = cache(async function getPublicSiteSettings() {
  if (process.env.NODE_ENV === "development") {
    return loadPublicSiteSettings();
  }
  try {
    return await cachedPublicSiteSettings();
  } catch (error) {
    if (error instanceof Error && /incrementalCache/i.test(error.message)) {
      return loadPublicSiteSettings();
    }
    throw error;
  }
});
