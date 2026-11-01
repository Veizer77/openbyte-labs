import "server-only";
import { eq } from "drizzle-orm";
import type { Database } from "./connection";
import { siteSettings } from "./schema/settings";

export interface PublicSiteStore {
  readSettingsDocument(): Promise<unknown>;
}

export function createPublicSiteStore(db: Database): PublicSiteStore {
  return {
    async readSettingsDocument() {
      const [row] = await db
        .select({ data: siteSettings.data })
        .from(siteSettings)
        .where(eq(siteSettings.id, 1))
        .limit(1);
      if (!row) throw new Error("Site Settings belum diinisialisasi.");
      return row.data;
    },
  };
}
