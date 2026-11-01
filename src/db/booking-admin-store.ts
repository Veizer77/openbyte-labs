import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { consultationBookings } from "./schema/booking";
import { siteSettings } from "./schema/settings";
import { settingsSchemas } from "@/schemas/site-settings";
import type { BookingAdminStore } from "@/services/booking-admin";

const fields = {
  id: consultationBookings.id,
  reference: consultationBookings.reference,
  name: consultationBookings.name,
  whatsapp: consultationBookings.whatsapp,
  slotStart: consultationBookings.slotStart,
  slotEnd: consultationBookings.slotEnd,
  consultationMode: consultationBookings.consultationMode,
  status: consultationBookings.status,
  meetingUrl: consultationBookings.meetingUrl,
};

export function createBookingAdminStore(db: Database): BookingAdminStore {
  return {
    async list(options) {
      return db
        .select(fields)
        .from(consultationBookings)
        .where(
          options.status
            ? eq(consultationBookings.status, options.status)
            : undefined,
        )
        .orderBy(
          desc(consultationBookings.slotStart),
          asc(consultationBookings.id),
        )
        .limit(options.limit)
        .offset(options.offset);
    },
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async getForUpdate(id) {
            const [row] = await tx
              .select(fields)
              .from(consultationBookings)
              .where(eq(consultationBookings.id, id))
              .for("update");
            return row ?? null;
          },
          async readConfirmationTemplate() {
            const [settings] = await tx
              .select({ data: siteSettings.data })
              .from(siteSettings)
              .where(eq(siteSettings.id, 1))
              .limit(1);
            if (!settings)
              throw new Error("Site Settings belum diinisialisasi.");
            return settingsSchemas.whatsapp.parse(settings.data.whatsapp)
              .tplBookingConfirm;
          },
          async confirm(id, url) {
            await tx
              .update(consultationBookings)
              .set({
                status: "confirmed",
                meetingUrl: url,
                updatedAt: new Date(),
              })
              .where(eq(consultationBookings.id, id));
          },
          async audit(actorId, id) {
            await tx
              .insert(auditLogs)
              .values({
                actorId,
                actorType: "admin",
                action: "update",
                collection: "consultation-bookings",
                docId: id,
                summary: "Booking dikonfirmasi",
              });
          },
        }),
      ),
  };
}
