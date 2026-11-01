import "server-only";
import { and, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import type { Database } from "./connection";
import { siteSettings } from "./schema/settings";
import { auditLogs } from "./schema/audit";
import { media } from "./schema/content";
import type { SettingsStore } from "@/services/site-settings";

export function createSettingsStore(db: Database): SettingsStore {
  return {
    async readSection(section) {
      const rows = await db
        .select({ data: siteSettings.data })
        .from(siteSettings)
        .where(eq(siteSettings.id, 1))
        .limit(1);
      if (!rows[0]) throw new Error("Site Settings belum diinisialisasi.");
      return rows[0].data[section];
    },
    async transaction(callback) {
      return db.transaction(async (tx) =>
        callback({
          async ensureMediaReady(ids) {
            if (!ids.length) return;
            const rows = await tx
              .select({ id: media.id })
              .from(media)
              .where(
                and(
                  inArray(media.id, [...ids]),
                  isNotNull(media.finalizedAt),
                  isNull(media.deletedAt),
                ),
              );
            if (rows.length !== ids.length)
              throw new Error("Media belum tersedia atau belum diverifikasi.");
          },
          async lockAndReplaceSection(section, value) {
            const rows = await tx
              .select({ id: siteSettings.id })
              .from(siteSettings)
              .where(eq(siteSettings.id, 1))
              .for("update");
            if (!rows.length)
              throw new Error("Site Settings belum diinisialisasi.");
            await tx
              .update(siteSettings)
              .set({
                data: sql`jsonb_set(${siteSettings.data}, ARRAY[${section}]::text[], ${JSON.stringify(value)}::jsonb, true)`,
                updatedAt: new Date(),
              })
              .where(eq(siteSettings.id, 1));
          },
          async insertAudit(entry) {
            await tx.insert(auditLogs).values({ ...entry, actorType: "admin" });
          },
        }),
      );
    },
  };
}
