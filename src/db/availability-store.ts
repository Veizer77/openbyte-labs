import "server-only";
import { eq } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { availabilityRules } from "./schema/booking";
import { siteSettings } from "./schema/settings";
import type { AvailabilityStore } from "@/services/availability";

export function createAvailabilityStore(db: Database): AvailabilityStore {
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
          async listDay(weekday) {
            return tx
              .select({
                id: availabilityRules.id,
                weekday: availabilityRules.weekday,
                startTime: availabilityRules.startTime,
                endTime: availabilityRules.endTime,
                isActive: availabilityRules.isActive,
              })
              .from(availabilityRules)
              .where(eq(availabilityRules.weekday, weekday));
          },
          async save(id, input) {
            const rows =
              id === null
                ? await tx
                    .insert(availabilityRules)
                    .values(input)
                    .returning({ id: availabilityRules.id })
                : await tx
                    .update(availabilityRules)
                    .set({ ...input, updatedAt: new Date() })
                    .where(eq(availabilityRules.id, id))
                    .returning({ id: availabilityRules.id });
            return rows[0]?.id ?? null;
          },
          async remove(id) {
            const rows = await tx
              .delete(availabilityRules)
              .where(eq(availabilityRules.id, id))
              .returning({ id: availabilityRules.id });
            return rows.length === 1;
          },
          async audit(actorId, action, id) {
            await tx
              .insert(auditLogs)
              .values({
                actorId,
                actorType: "admin",
                action,
                collection: "availability-rules",
                docId: id,
                summary: "Jadwal konsultasi diperbarui",
              });
          },
        }),
      ),
  };
}
