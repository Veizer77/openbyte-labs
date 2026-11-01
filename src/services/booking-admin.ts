import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  renderWhatsappTemplate,
  validateWhatsappTemplate,
  whatsappUrl,
  WHATSAPP_TEMPLATE_FIELDS,
} from "@/lib/whatsapp";

const mode = z.enum(["google_meet", "whatsapp_call", "offline"]);
const status = z.enum(["pending", "confirmed", "completed", "cancelled"]);
const listOptions = z
  .object({
    status: status.optional(),
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
  })
  .strict();
const meetingUrl = z
  .string()
  .max(2048)
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return (
        url.protocol === "https:" &&
        !url.username &&
        !url.password &&
        !/[\u0000-\u001f\u007f\\]/.test(value)
      );
    } catch {
      return false;
    }
  }, "Meeting URL harus HTTPS dan tidak mengandung kredensial.")
  .transform((value) => value || null);
const confirmation = z.object({ meetingUrl }).strict();

const bookingDtoSchema = z.object({
  id: z.uuid(),
  reference: z.string().max(32),
  name: z.string().max(100),
  whatsapp: z.string().max(100),
  slotStart: z.date(),
  slotEnd: z.date(),
  consultationMode: mode,
  status,
  meetingUrl: z.string().nullable(),
});
export type BookingAdminDto = z.output<typeof bookingDtoSchema>;
export interface BookingAdminStore {
  list(options: z.output<typeof listOptions>): Promise<BookingAdminDto[]>;
  transaction<T>(
    callback: (tx: {
      getForUpdate(id: string): Promise<BookingAdminDto | null>;
      readConfirmationTemplate(): Promise<string>;
      confirm(id: string, url: string | null): Promise<void>;
      audit(actorId: string, id: string): Promise<void>;
    }) => Promise<T>,
  ): Promise<T>;
}

export async function listAdminBookings(
  store: BookingAdminStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<BookingAdminDto[]> {
  authorize(principal, "consultation-bookings", "read");
  return z
    .array(bookingDtoSchema)
    .parse(await store.list(listOptions.parse(input)));
}

export async function confirmBooking(
  store: BookingAdminStore,
  principal: AdminPrincipal | null,
  id: string,
  input: unknown,
): Promise<{ whatsappUrl: string }> {
  authorize(principal, "consultation-bookings", "update");
  z.uuid().parse(id);
  const { meetingUrl: url } = confirmation.parse(input);
  return store.transaction(async (tx) => {
    const booking = bookingDtoSchema
      .nullable()
      .parse(await tx.getForUpdate(id));
    if (!booking) throw new Error("Booking tidak ditemukan.");
    if (booking.status !== "pending")
      throw new Error("Hanya booking pending yang dapat dikonfirmasi.");
    if (booking.consultationMode === "google_meet" && !url)
      throw new Error("Meeting URL wajib diisi untuk Google Meet.");
    const template = await tx.readConfirmationTemplate();
    if (
      !validateWhatsappTemplate(
        template,
        WHATSAPP_TEMPLATE_FIELDS.tplBookingConfirm,
      )
    )
      throw new Error("Template konfirmasi tidak valid.");
    const tanggal = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(booking.slotStart);
    const jam = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .format(booking.slotStart)
      .replace(".", ":");
    const destination =
      url ??
      (booking.consultationMode === "whatsapp_call"
        ? "Telepon WhatsApp"
        : "Tatap muka");
    const message = renderWhatsappTemplate(template, {
      nama: booking.name,
      referensi: booking.reference,
      tanggal,
      jam,
      meeting_url: destination,
    });
    const link = whatsappUrl(message, booking.whatsapp);
    await tx.confirm(id, url);
    await tx.audit(principal.id, id);
    return { whatsappUrl: link };
  });
}
