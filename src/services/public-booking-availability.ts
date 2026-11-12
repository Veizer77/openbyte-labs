import "server-only";
import { z } from "zod";
import {
  getDaySlots,
  getSlots,
  type DaySlot,
  wibDay,
  type AvailabilityRule,
  type BlockedDate,
  type ExistingBooking,
} from "@/lib/booking";
import type { BookingConfig } from "@/lib/booking";

const inputSchema = z.object({ date: z.iso.date() }).strict();
const monthInputSchema = z
  .object({
    month: z.iso.date().refine((value) => value.endsWith("-01"), {
      message: "Bulan harus menggunakan tanggal pertama.",
    }),
  })
  .strict();

export interface PublicBookingSchedule {
  config: BookingConfig;
  consultationModes: Array<"google_meet" | "whatsapp_call" | "offline">;
  rules: AvailabilityRule[];
  blocks: BlockedDate[];
  bookings: ExistingBooking[];
}

export interface PublicBookingAvailabilityStore {
  readSchedule(date: string): Promise<PublicBookingSchedule>;
  readMonth?(startDate: string, endDate: string): Promise<PublicBookingSchedule>;
}

export interface PublicBookingAvailability {
  date: string;
  consultationModes: PublicBookingSchedule["consultationModes"];
  slots: ReturnType<typeof getSlots>;
  isBlocked?: boolean;
  holidayReason?: string;
}

export interface PublicBookingMonthAvailability {
  month: string;
  /** Server clock when the snapshot was computed; clients must use this as "now". */
  serverNow: string;
  maxDate: string;
  consultationModes: PublicBookingSchedule["consultationModes"];
  days: Array<{
    date: string;
    slots: DaySlot[];
    isBlocked?: boolean;
    holidayReason?: string;
  }>;
}

export async function getPublicBookingAvailability(
  store: PublicBookingAvailabilityStore,
  input: unknown,
  now = new Date(),
): Promise<PublicBookingAvailability> {
  const { date } = inputSchema.parse(input);
  if (!Number.isFinite(now.getTime())) throw new Error("Jam server tidak valid.");

  const schedule = await store.readSchedule(date);
  const dayBlocks = schedule.blocks.filter(
    (b) => (b.date ? b.date.slice(0, 10) : "") === date,
  );
  const isFullDayBlock = dayBlocks.some((b) => !b.startTime && !b.endTime);
  const dayReason =
    dayBlocks.map((b) => b.reason).filter(Boolean).join(" • ") || undefined;
  const daySlots = getDaySlots(
    date,
    now,
    schedule.rules,
    schedule.blocks,
    schedule.bookings,
    schedule.config,
  );
  return {
    date,
    consultationModes: schedule.consultationModes,
    slots: getSlots(
      date,
      now,
      schedule.rules,
      schedule.blocks,
      schedule.bookings,
      schedule.config,
    ),
    isBlocked:
      isFullDayBlock ||
      (daySlots.length > 0 && daySlots.every((s) => s.isBlocked)),
    holidayReason: dayReason,
  };
}

/** Reads a month's schedule in one store call, then computes each day's live slots. */
export async function getPublicBookingMonthAvailability(
  store: PublicBookingAvailabilityStore,
  input: unknown,
  now = new Date(),
): Promise<PublicBookingMonthAvailability> {
  const { month } = monthInputSchema.parse(input);
  if (!Number.isFinite(now.getTime())) throw new Error("Jam server tidak valid.");

  const [year, monthNumber] = month.slice(0, 7).split("-").map(Number);
  const nextMonth = new Date(Date.UTC(year, monthNumber, 1))
    .toISOString()
    .slice(0, 10);
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const dates = Array.from(
    { length: daysInMonth },
    (_, index) => `${month.slice(0, 7)}-${String(index + 1).padStart(2, "0")}`,
  );

  if (store.readMonth) {
    const schedule = await store.readMonth(month, nextMonth);
    return {
      month,
      serverNow: now.toISOString(),
      maxDate: new Date(
        Date.parse(`${wibDay(now)}T00:00:00Z`) +
          schedule.config.maxDaysAhead * 86_400_000,
      )
        .toISOString()
        .slice(0, 10),
      consultationModes: schedule.consultationModes,
      days: dates.map((date) => {
        const dayBlocks = schedule.blocks.filter(
    (b) => (b.date ? b.date.slice(0, 10) : "") === date,
  );
        const isFullDayBlock = dayBlocks.some((b) => !b.startTime && !b.endTime);
        const dayReason =
          dayBlocks.map((b) => b.reason).filter(Boolean).join(" • ") || undefined;
        const slots = getDaySlots(
          date,
          now,
          schedule.rules,
          schedule.blocks,
          schedule.bookings,
          schedule.config,
        );
        return {
          date,
          slots,
          isBlocked:
            isFullDayBlock ||
            (slots.length > 0 && slots.every((s) => s.isBlocked)),
          holidayReason: dayReason,
        };
      }),
    };
  }

  const schedules = await Promise.all(
    dates.map((date) => store.readSchedule(date)),
  );
  return {
    month,
    serverNow: now.toISOString(),
    maxDate: new Date(
      Date.parse(`${wibDay(now)}T00:00:00Z`) +
        (schedules[0]?.config.maxDaysAhead ?? 0) * 86_400_000,
    )
      .toISOString()
      .slice(0, 10),
    consultationModes: schedules[0]?.consultationModes ?? [],
    days: dates.map((date, index) => {
      const schedule = schedules[index];
      const dayBlocks = schedule.blocks.filter(
    (b) => (b.date ? b.date.slice(0, 10) : "") === date,
  );
      const isFullDayBlock = dayBlocks.some((b) => !b.startTime && !b.endTime);
      const dayReason =
        dayBlocks.map((b) => b.reason).filter(Boolean).join(" • ") || undefined;
      const slots = getDaySlots(
        date,
        now,
        schedule.rules,
        schedule.blocks,
        schedule.bookings,
        schedule.config,
      );
      return {
        date,
        slots,
        isBlocked:
          isFullDayBlock ||
          (slots.length > 0 && slots.every((s) => s.isBlocked)),
        holidayReason: dayReason,
      };
    }),
  };
}
