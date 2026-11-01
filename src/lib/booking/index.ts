export interface AvailabilityRule {
  weekday: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}
export interface BlockedDate {
  date: string;
  startTime?: string;
  endTime?: string;
}
export interface ExistingBooking {
  slotStart: string;
  slotEnd: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}
export interface BookingConfig {
  slotDurationMinutes: number;
  bufferMinutes: number;
  minDaysAhead: number;
  maxDaysAhead: number;
}
export interface Slot {
  start: string;
  end: string;
  label: string;
}
export interface DaySlot extends Slot {
  isPast: boolean;
  isBlocked: boolean;
  isBooked: boolean;
  isAvailable: boolean;
}
const DAY = 86_400_000;
const WIB = 7 * 3_600_000;
const minutes = (time: string) => {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) return NaN;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
export const wibDay = (now: Date) =>
  new Date(now.getTime() + WIB).toISOString().slice(0, 10);

export function getDaySlots(
  date: string,
  now: Date,
  rules: readonly AvailabilityRule[],
  blocks: readonly BlockedDate[],
  bookings: readonly ExistingBooking[],
  config: BookingConfig,
): DaySlot[] {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(now.getTime()) ||
    !Number.isInteger(config.slotDurationMinutes) ||
    config.slotDurationMinutes <= 0 ||
    config.slotDurationMinutes > 1440 ||
    !Number.isInteger(config.bufferMinutes) ||
    config.bufferMinutes < 0 ||
    config.bufferMinutes > 1440 ||
    !Number.isInteger(config.minDaysAhead) ||
    !Number.isInteger(config.maxDaysAhead) ||
    config.minDaysAhead < 0 ||
    config.maxDaysAhead < config.minDaysAhead
  )
    return [];
  const day = Date.parse(`${date}T00:00:00Z`);
  if (
    !Number.isFinite(day) ||
    new Date(day).toISOString().slice(0, 10) !== date
  )
    return [];
  const daysAhead = (day - Date.parse(`${wibDay(now)}T00:00:00Z`)) / DAY;
  if (daysAhead < 0 || daysAhead > config.maxDaysAhead)
    return [];
  const weekday = new Date(day).getUTCDay();
  if (
    blocks.some((block) => {
      if (block.date !== date || (!block.startTime && !block.endTime))
        return false;
      if (!block.startTime || !block.endTime) return true;
      const start = minutes(block.startTime);
      const end = minutes(block.endTime);
      return !Number.isFinite(start) || !Number.isFinite(end) || start >= end;
    })
  )
    return [];
  const results = new Map<string, DaySlot>();
  for (const rule of rules) {
    if (rule.isActive === false || rule.weekday !== weekday) continue;
    if (
      !Number.isFinite(minutes(rule.startTime)) ||
      !Number.isFinite(minutes(rule.endTime)) ||
      minutes(rule.startTime) >= minutes(rule.endTime)
    )
      continue;
    for (
      let start = minutes(rule.startTime);
      start + config.slotDurationMinutes <= minutes(rule.endTime);
      start += config.slotDurationMinutes + config.bufferMinutes
    ) {
      const end = start + config.slotDurationMinutes;
      const startMs = day - WIB + start * 60_000;
      const endMs = day - WIB + end * 60_000;
      const isPast = startMs <= now.getTime();
      const isBlocked = blocks.some(
        (block) =>
          block.date === date &&
          (!block.startTime ||
            !block.endTime ||
            (start < minutes(block.endTime) &&
              end > minutes(block.startTime))),
      );
      const isBooked = bookings.some(
        (booking) =>
          ["pending", "confirmed"].includes(booking.status) &&
          startMs < Date.parse(booking.slotEnd) &&
          endMs > Date.parse(booking.slotStart),
      );
      const isAvailable =
        !isPast && !isBlocked && !isBooked && daysAhead >= config.minDaysAhead;
      const time = (n: number) =>
        `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
      const slot: DaySlot = {
        start: new Date(startMs).toISOString(),
        end: new Date(endMs).toISOString(),
        label: `${time(start)} - ${time(end)}`,
        isPast,
        isBlocked,
        isBooked,
        isAvailable,
      };
      results.set(slot.start, slot);
    }
  }
  return [...results.values()].sort((a, b) => a.start.localeCompare(b.start));
}

export function getSlots(
  date: string,
  now: Date,
  rules: readonly AvailabilityRule[],
  blocks: readonly BlockedDate[],
  bookings: readonly ExistingBooking[],
  config: BookingConfig,
): Slot[] {
  return getDaySlots(date, now, rules, blocks, bookings, config)
    .filter((slot) => slot.isAvailable)
    .map(({ start, end, label }) => ({ start, end, label }));
}
