import "server-only";
import type { Database } from "@/db/connection";
import { siteSettings } from "@/db/schema/settings";
import { defaultSiteSettings } from "./site-settings-defaults";

/** Explicitly invoked only after the operator has verified the database target. */
export async function initializeSiteSettings(db: Database): Promise<boolean> {
  const inserted = await db
    .insert(siteSettings)
    .values({ id: 1, data: defaultSiteSettings() })
    .onConflictDoNothing({ target: siteSettings.id })
    .returning({ id: siteSettings.id });
  return inserted.length === 1;
}
