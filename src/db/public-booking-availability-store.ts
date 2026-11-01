import "server-only";
import { and, eq, gt, gte, inArray, lt } from "drizzle-orm";
import type { Database } from "./connection";
import {
  availabilityRules,
  blockedDates,
  consultationBookings,
} from "./schema/booking";
import { siteSettings } from "./schema/settings";
import { settingsSchemas } from "@/schemas/site-settings";
import type { PublicBookingAvailabilityStore } from "@/services/public-booking-availability";

export function createPublicBookingAvailabilityStore(
  db: Database,
): PublicBookingAvailabilityStore {
  return {
    async readSchedule(date) {
      const [settings] = await db
        .select({ data: siteSettings.data })
        .from(siteSettings)
        .where(eq(siteSettings.id, 1))
        .limit(1);
      if (!settings) throw new Error("Site Settings belum diinisialisasi.");
      const config = settingsSchemas.booking.parse(settings.data.booking);

      const start = new Date(`${date}T00:00:00+07:00`);
      const end = new Date(start.getTime() + 86_400_000);
      const [rules, blocks, bookings] = await Promise.all([
        db
          .select({
            weekday: availabilityRules.weekday,
            startTime: availabilityRules.startTime,
            endTime: availabilityRules.endTime,
            isActive: availabilityRules.isActive,
          })
          .from(availabilityRules)
          .where(eq(availabilityRules.isActive, true)),
        db
          .select({
            date: blockedDates.date,
            startTime: blockedDates.startTime,
            endTime: blockedDates.endTime,
          })
          .from(blockedDates)
          .where(eq(blockedDates.date, date)),
        db
          .select({
            slotStart: consultationBookings.slotStart,
            slotEnd: consultationBookings.slotEnd,
            status: consultationBookings.status,
          })
          .from(consultationBookings)
          .where(
            and(
              inArray(consultationBookings.status, ["pending", "confirmed"]),
              lt(consultationBookings.slotStart, end),
              gt(consultationBookings.slotEnd, start),
            ),
          ),
      ]);

      return {
        config,
        consultationModes: config.availableModes,
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
    async readMonth(startDate, endDate) {
      const start = new Date(`${startDate}T00:00:00+07:00`);
      const end = new Date(`${endDate}T00:00:00+07:00`);
      const [settings, rules, blocks, bookings] = await Promise.all([
        db
          .select({ data: siteSettings.data })
          .from(siteSettings)
          .where(eq(siteSettings.id, 1))
          .limit(1),
        db
          .select({
            weekday: availabilityRules.weekday,
            startTime: availabilityRules.startTime,
            endTime: availabilityRules.endTime,
            isActive: availabilityRules.isActive,
          })
          .from(availabilityRules)
          .where(eq(availabilityRules.isActive, true)),
        db
          .select({
            date: blockedDates.date,
            startTime: blockedDates.startTime,
            endTime: blockedDates.endTime,
          })
          .from(blockedDates)
          .where(
            and(gte(blockedDates.date, startDate), lt(blockedDates.date, endDate)),
          ),
        db
          .select({
            slotStart: consultationBookings.slotStart,
            slotEnd: consultationBookings.slotEnd,
            status: consultationBookings.status,
          })
          .from(consultationBookings)
          .where(
            and(
              inArray(consultationBookings.status, ["pending", "confirmed"]),
              lt(consultationBookings.slotStart, end),
              gt(consultationBookings.slotEnd, start),
            ),
          ),
      ]);
      if (!settings[0]) throw new Error("Site Settings belum diinisialisasi.");
      const config = settingsSchemas.booking.parse(settings[0].data.booking);

      return {
        config,
        consultationModes: config.availableModes,
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
  };
}
