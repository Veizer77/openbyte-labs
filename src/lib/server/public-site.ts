import "server-only";
import { getDb } from "@/db";
import { createPublicSiteStore } from "@/db/public-site-store";
import {
  publicSiteSettingsMediaIds,
  toPublicSiteSettings,
} from "@/schemas/public-site-settings";
import { getPublicMediaAssets } from "@/lib/server/public-media";
import { cache } from "react";

/** Server Component entry point for live public Settings. */
export const getPublicSiteSettings = cache(function getPublicSiteSettings() {
  const db = getDb();
  return createPublicSiteStore(db)
    .readSettingsDocument()
    .then(async (document) =>
      toPublicSiteSettings(
        document,
        await getPublicMediaAssets(db, publicSiteSettingsMediaIds(document)),
      ),
    );
});
