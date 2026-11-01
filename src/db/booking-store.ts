import "server-only";
import { and, eq, gt, inArray, lt } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import {
  availabilityRules,
  blockedDates,
  consultationBookings,
} from "./schema/booking";
import { siteSettings } from "./schema/settings";
import { settingsSchemas } from "@/schemas/site-settings";
import type { BookingStore } from "@/services/create-booking";

export function createBookingStore(db: Database): BookingStore {
  return {
    transaction: (callback) =>
      db.transaction(async (tx) =>
        callback({
          async readSchedule(day) {
            const [settings] = await tx
              .select({ data: siteSettings.data })
              .from(siteSettings)
              .where(eq(siteSettings.id, 1))
              .for("update");
            if (!settings)
              throw new Error("Site Settings belum diinisialisasi.");
            const config = settingsSchemas.booking.parse(settings.data.booking);
            const start = new Date(`${day}T00:00:00+07:00`);
            const end = new Date(start.getTime() + 86_400_000);
            const weekday = new Date(`${day}T00:00:00Z`).getUTCDay();
            const rules = await tx
              .select({
                weekday: availabilityRules.weekday,
                startTime: availabilityRules.startTime,
                endTime: availabilityRules.endTime,
                isActive: availabilityRules.isActive,
              })
              .from(availabilityRules)
              .where(eq(availabilityRules.weekday, weekday));
            const blocks = await tx
              .select({
                date: blockedDates.date,
                startTime: blockedDates.startTime,
                endTime: blockedDates.endTime,
              })
              .from(blockedDates)
              .where(eq(blockedDates.date, day));
            const bookings = await tx
              .select({
                slotStart: consultationBookings.slotStart,
                slotEnd: consultationBookings.slotEnd,
                status: consultationBookings.status,
              })
              .from(consultationBookings)
              .where(
                and(
                  inArray(consultationBookings.status, [
                    "pending",
                    "confirmed",
                  ]),
                  lt(consultationBookings.slotStart, end),
                  gt(consultationBookings.slotEnd, start),
                ),
              );
            return {
              config,
              rules,
              blocks: blocks.map((block) => ({
                date: block.date,
                startTime: block.startTime ?? undefined,
                endTime: block.endTime ?? undefined,
              })),
              bookings: bookings.map((booking) => ({
                slotStart: booking.slotStart.toISOString(),
                slotEnd: booking.slotEnd.toISOString(),
                status: booking.status,
              })),
            };
          },
          async tryInsert(record) {
            const [inserted] = await tx
              .insert(consultationBookings)
              .values(record)
              .onConflictDoNothing({ target: consultationBookings.reference })
              .returning({ id: consultationBookings.id });
            return inserted?.id ?? null;
          },
          async insertAudit(bookingId) {
            await tx.insert(auditLogs).values({
              actorType: "system",
              action: "create",
              collection: "consultation-bookings",
              docId: bookingId,
              summary: "Booking konsultasi dibuat",
            });
          },
        }),
      ),
  };
}
