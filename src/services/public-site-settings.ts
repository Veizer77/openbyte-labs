import "server-only";
import type { PublicSiteStore } from "@/db/public-site-store";
import {
  toPublicSiteSettings,
  type PublicSiteSettings,
} from "@/schemas/public-site-settings";

/** Read the current public projection from the database, without a mock fallback. */
export async function readPublicSiteSettings(
  store: PublicSiteStore,
): Promise<PublicSiteSettings> {
  return toPublicSiteSettings(await store.readSettingsDocument());
}
