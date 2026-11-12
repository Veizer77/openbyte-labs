import { describe, expect, it, vi } from "vitest";
import {
  getPublicBookingAvailability,
  getPublicBookingMonthAvailability,
  type PublicBookingAvailabilityStore,
} from "@/services/public-booking-availability";

const fixedNow = new Date("2026-10-30T00:00:00.000Z");

function makeStore(): PublicBookingAvailabilityStore {
  return {
    async readSchedule() {
      return {
        config: {
          slotDurationMinutes: 60,
          bufferMinutes: 0,
          minDaysAhead: 1,
          maxDaysAhead: 30,
        },
        consultationModes: ["google_meet", "whatsapp_call"],
        rules: [{ weekday: 1, startTime: "09:00", endTime: "12:00" }],
        blocks: [{ date: "2026-11-02", startTime: "09:00", endTime: "10:00" }],
        bookings: [
          {
            slotStart: "2026-11-02T03:00:00.000Z",
            slotEnd: "2026-11-02T04:00:00.000Z",
            status: "confirmed",
          },
        ],
      };
    },
  };
}

describe("public booking availability", () => {
  it("uses current DB schedule and excludes blocked and booked slots", async () => {
    const result = await getPublicBookingAvailability(
      makeStore(),
      { date: "2026-11-02" },
      fixedNow,
    );

    expect(result.consultationModes).toEqual([
      "google_meet",
      "whatsapp_call",
    ]);
    expect(result.slots).toEqual([
      {
        start: "2026-11-02T04:00:00.000Z",
        end: "2026-11-02T05:00:00.000Z",
        label: "11:00 - 12:00",
      },
    ]);
  });

  it("rejects malformed dates before reading the store", async () => {
    let reads = 0;
    const store: PublicBookingAvailabilityStore = {
      async readSchedule() {
        reads += 1;
        return makeStore().readSchedule("2026-11-02");
      },
    };

    await expect(
      getPublicBookingAvailability(store, { date: "2026-02-30" }, fixedNow),
    ).rejects.toThrow();
    expect(reads).toBe(0);
  });

  it("returns live slot status for the month from one range read", async () => {
    const store = makeStore();
    const readMonth = vi.fn(async () => store.readSchedule("2026-11-02"));
    const result = await getPublicBookingMonthAvailability(
      { ...store, readMonth },
      { month: "2026-11-01" },
      fixedNow,
    );
    const monday = result.days.find((day) => day.date === "2026-11-02");

    expect(result.consultationModes).toEqual(["google_meet", "whatsapp_call"]);
    expect(readMonth).toHaveBeenCalledWith("2026-11-01", "2026-12-01");
    // Clients must compare slots against the server clock, never the device clock.
    expect(result.serverNow).toBe(fixedNow.toISOString());
    expect(monday?.slots.map((slot) => [slot.label, slot.isBlocked, slot.isBooked, slot.isAvailable])).toEqual([
      ["09:00 - 10:00", true, false, false],
      ["10:00 - 11:00", false, true, false],
      ["11:00 - 12:00", false, false, true],
    ]);
  });

  it("marks a slot as unavailable once the server clock passes its start", async () => {
    // 10:30 WIB on the booking day: the 09:00 and 10:00 sessions have started,
    // so only 11:00 may remain bookable even though the row still exists.
    const base = makeStore();
    const readMonth = vi.fn(async () => {
      const schedule = await base.readSchedule("2026-11-02");
      // minDaysAhead 0 opens today's schedule so only the wall clock decides.
      return { ...schedule, config: { ...schedule.config, minDaysAhead: 0 } };
    });
    const result = await getPublicBookingMonthAvailability(
      { ...base, readMonth },
      { month: "2026-11-01" },
      new Date("2026-11-02T03:30:00.000Z"),
    );
    const monday = result.days.find((day) => day.date === "2026-11-02");
    expect(
      monday?.slots.map((slot) => [slot.label, slot.isPast, slot.isAvailable]),
    ).toEqual([
      ["09:00 - 10:00", true, false],
      ["10:00 - 11:00", true, false],
      ["11:00 - 12:00", false, true],
    ]);
  });

  it("passes holiday status and CMS reason for blocked dates", async () => {
    const base = makeStore();
    const readMonth = vi.fn(async () => {
      const schedule = await base.readSchedule("2026-11-02");
      return {
        ...schedule,
        blocks: [
          {
            date: "2026-11-10",
            reason: "Hari Pahlawan - Operasional Studio Tutup",
          },
        ],
      };
    });
    const result = await getPublicBookingMonthAvailability(
      { ...base, readMonth },
      { month: "2026-11-01" },
      fixedNow,
    );
    const holiday = result.days.find((day) => day.date === "2026-11-10");
    const regular = result.days.find((day) => day.date === "2026-11-02");

    expect(holiday?.isBlocked).toBe(true);
    expect(holiday?.holidayReason).toBe("Hari Pahlawan - Operasional Studio Tutup");
    expect(regular?.isBlocked).toBe(false);
    expect(regular?.holidayReason).toBeUndefined();
  });
});
