import "server-only";
import {
  getSlots,
  wibDay,
  type AvailabilityRule,
  type BlockedDate,
  type BookingConfig,
  type ExistingBooking,
} from "@/lib/booking";
import { createReference } from "@/lib/reference";
import { googleCalendarUrl } from "@/lib/google-calendar";
import {
  bookingRequestSchema,
  type BookingRequest,
} from "@/schemas/booking-request";

type BookingMode = BookingRequest["consultationMode"];
export interface BookingSchedule {
  config: BookingConfig & { availableModes: BookingMode[] };
  rules: AvailabilityRule[];
  blocks: BlockedDate[];
  bookings: ExistingBooking[];
}
export interface BookingRecord {
  reference: string;
  name: string;
  whatsapp: string;
  email: string | null;
  organizationOrBusiness: string;
  serviceInterest: string;
  projectBrief: string;
  consultationMode: BookingMode;
  slotStart: Date;
  slotEnd: Date;
  consentAt: Date;
}
export interface BookingTransaction {
  /** Locks the settings singleton before reading current settings and schedule. */
  readSchedule(day: string): Promise<BookingSchedule>;
  /** Returns null only on reference collision; overlap must surface as a constraint error. */
  tryInsert(record: BookingRecord): Promise<string | null>;
  insertAudit(bookingId: string): Promise<void>;
}
export interface BookingStore {
  transaction<T>(callback: (tx: BookingTransaction) => Promise<T>): Promise<T>;
}
export class BookingSubmissionError extends Error {
  constructor(
    public readonly code:
      | "anti_spam"
      | "rate_limit"
      | "slot_unavailable"
      | "mode_unavailable"
      | "reference_exhausted",
  ) {
    super(
      {
        anti_spam: "Verifikasi anti-spam gagal.",
        rate_limit: "Terlalu banyak pengiriman. Coba lagi nanti.",
        slot_unavailable:
          "Slot tidak tersedia atau baru saja terisi, pilih jam lain.",
        mode_unavailable: "Mode konsultasi tidak tersedia.",
        reference_exhausted: "Nomor referensi belum dapat dibuat. Coba lagi.",
      }[code],
    );
    this.name = "BookingSubmissionError";
  }
}

/**
 * `23P01` is an exclusion-constraint violation, and this insert only participates
 * in one exclusion constraint, so the SQLSTATE alone identifies a slot overlap.
 * The `postgres` driver reports the name as `constraint_name` and leaves
 * `constraint` undefined, so matching on the name alone would miss real overlaps.
 */
export function isBookingOverlap(error: unknown): boolean {
  let current: unknown = error;
  for (let i = 0; i < 5 && current && typeof current === "object"; i++) {
    const value = current as { code?: unknown; cause?: unknown };
    if (value.code === "23P01") return true;
    current = value.cause;
  }
  return false;
}

/** No HTTP entry point may call this without a trusted proxy-derived IP hash. */
export async function createBooking(
  input: unknown,
  ipHash: string,
  deps: {
    store: BookingStore;
    verifyChallenge: (token: string, honeypot: string) => Promise<boolean>;
    consumeBudget: (ipHash: string) => Promise<boolean>;
    now?: () => Date;
    reference?: (now: Date) => string;
  },
): Promise<{
  reference: string;
  slotStart: string;
  slotEnd: string;
  calendarUrl: string;
}> {
  const request = bookingRequestSchema.parse(input);
  if (!/^[a-f0-9]{64}$/.test(ipHash)) throw new Error("Hash IP tidak valid.");
  if (
    request.honeypot !== "" ||
    !(await deps.verifyChallenge(request.turnstileToken, request.honeypot))
  )
    throw new BookingSubmissionError("anti_spam");
  if (!(await deps.consumeBudget(ipHash)))
    throw new BookingSubmissionError("rate_limit");
  try {
    return await deps.store.transaction(async (tx) => {
      const selected = new Date(request.slotStart);
      const day = wibDay(selected);
      const schedule = await tx.readSchedule(day);
      const now = (deps.now ?? (() => new Date()))();
      if (!Number.isFinite(now.getTime()))
        throw new Error("Jam server tidak valid.");
      if (!schedule.config.availableModes.includes(request.consultationMode))
        throw new BookingSubmissionError("mode_unavailable");
      const slot = getSlots(
        day,
        now,
        schedule.rules,
        schedule.blocks,
        schedule.bookings,
        schedule.config,
      ).find((value) => value.start === selected.toISOString());
      if (!slot) throw new BookingSubmissionError("slot_unavailable");
      for (let attempt = 0; attempt < 5; attempt++) {
        const reference = deps.reference
          ? deps.reference(now)
          : createReference("BKG", now);
        if (!/^BKG-\d{4}-[A-HJ-NP-Z2-9]{4}$/.test(reference))
          throw new Error("Nomor referensi tidak valid.");
        const bookingId = await tx.tryInsert({
          reference,
          name: request.name,
          whatsapp: request.whatsapp,
          email: request.email,
          organizationOrBusiness: request.organizationOrBusiness,
          serviceInterest: request.serviceInterest,
          projectBrief: request.projectBrief,
          consultationMode: request.consultationMode,
          slotStart: new Date(slot.start),
          slotEnd: new Date(slot.end),
          consentAt: now,
        });
        if (!bookingId) continue;
        await tx.insertAudit(bookingId);
        return {
          reference,
          slotStart: slot.start,
          slotEnd: slot.end,
          calendarUrl: googleCalendarUrl(
            new Date(slot.start),
            new Date(slot.end),
            reference,
          ),
        };
      }
      throw new BookingSubmissionError("reference_exhausted");
    });
  } catch (error) {
    if (isBookingOverlap(error))
      throw new BookingSubmissionError("slot_unavailable");
    throw error;
  }
}
