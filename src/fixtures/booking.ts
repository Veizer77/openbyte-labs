import type { AvailabilityRule, BookingConfig } from "@/lib/booking";
export const bookingConfig: BookingConfig = {
  slotDurationMinutes: 60,
  bufferMinutes: 0,
  minDaysAhead: 1,
  maxDaysAhead: 30,
};
export const availabilityRules: AvailabilityRule[] = [1, 2, 3, 4, 5].flatMap(
  (weekday) => [
    { weekday, startTime: "09:00", endTime: "11:00" },
    { weekday, startTime: "13:00", endTime: "15:00" },
    { weekday, startTime: "16:00", endTime: "18:00" },
    { weekday, startTime: "19:30", endTime: "21:30" },
  ],
);
