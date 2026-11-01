import "server-only";
import { eq } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { blockedDates } from "./schema/booking";
import { siteSettings } from "./schema/settings";
import type { BlockedDateStore } from "@/services/blocked-dates";

export function createBlockedDateStore(db: Database): BlockedDateStore {
  return {
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async lockSchedule() {
            const rows = await tx
              .select({ id: siteSettings.id })
              .from(siteSettings)
              .where(eq(siteSettings.id, 1))
              .for("update");
            if (!rows.length)
              throw new Error("Site Settings belum diinisialisasi.");
          },
          async save(id, input) {
            const rows =
              id === null
                ? await tx
                    .insert(blockedDates)
                    .values(input)
                    .returning({ id: blockedDates.id })
                : await tx
                    .update(blockedDates)
                    .set({ ...input, updatedAt: new Date() })
                    .where(eq(blockedDates.id, id))
                    .returning({ id: blockedDates.id });
            return rows[0]?.id ?? null;
          },
          async remove(id) {
            const rows = await tx
              .delete(blockedDates)
              .where(eq(blockedDates.id, id))
              .returning({ id: blockedDates.id });
            return rows.length === 1;
          },
          async audit(actorId, action, id) {
            await tx
              .insert(auditLogs)
              .values({
                actorId,
                actorType: "admin",
                action,
                collection: "blocked-dates",
                docId: id,
                summary: "Tanggal terblokir diperbarui",
              });
          },
        }),
      ),
  };
}
