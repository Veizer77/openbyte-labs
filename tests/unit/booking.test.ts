import { describe, expect, it } from "vitest";
import {
  getDaySlots,
  getSlots,
  wibDay,
  type BlockedDate,
  type ExistingBooking,
} from "@/lib/booking";
import { availabilityRules, bookingConfig } from "@/fixtures/booking";

const now = new Date("2026-10-26T10:00:00+07:00");
const slots = (
  date: string,
  blocks: BlockedDate[] = [],
  bookings: ExistingBooking[] = [],
  config = bookingConfig,
) => getSlots(date, now, availabilityRules, blocks, bookings, config);
describe("Slot WIB PRD F.2", () => {
  it("S1: delapan slot", () =>
    expect(slots("2026-11-02").map((slot) => slot.label)).toEqual([
      "09:00 - 10:00",
      "10:00 - 11:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "19:30 - 20:30",
      "20:30 - 21:30",
    ]));
  it("S2: blokir dan booking, interval bersebelahan diizinkan", () => {
    expect(
      slots(
        "2026-11-02",
        [{ date: "2026-11-02", startTime: "13:00", endTime: "14:00" }],
        [
          {
            slotStart: "2026-11-02T09:00:00+07:00",
            slotEnd: "2026-11-02T10:00:00+07:00",
            status: "pending",
          },
        ],
      ).map((slot) => slot.label),
    ).toEqual([
      "10:00 - 11:00",
      "14:00 - 15:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "19:30 - 20:30",
      "20:30 - 21:30",
    ]);
  });
  it.each([
    ["S3", "2026-11-07"],
    ["S4", "2026-10-26"],
    ["S5", "2026-11-26"],
  ])("%s: kosong", (_, date) => expect(slots(date)).toEqual([]));
  it("S6: durasi 45, buffer 15", () =>
    expect(
      slots("2026-11-02", [], [], {
        ...bookingConfig,
        slotDurationMinutes: 45,
        bufferMinutes: 15,
      }).map((slot) => slot.label),
    ).toEqual([
      "09:00 - 09:45",
      "10:00 - 10:45",
      "13:00 - 13:45",
      "14:00 - 14:45",
      "16:00 - 16:45",
      "17:00 - 17:45",
      "19:30 - 20:15",
      "20:30 - 21:15",
    ]));
  it("S7: blokir sehari penuh", () =>
    expect(slots("2026-11-02", [{ date: "2026-11-02" }])).toEqual([]));
  it("S8: batas atas inklusif", () => {
    expect(slots("2026-11-25")).toHaveLength(8);
    expect(slots("2026-11-26")).toEqual([]);
  });
  it("tanggal WIB tidak mengikuti timezone perangkat", () =>
    expect(wibDay(new Date("2026-10-26T18:00:00Z"))).toBe("2026-10-27"));
  it("menolak tanggal invalid dan durasi nol", () => {
    expect(slots("2026-02-30")).toEqual([]);
    expect(
      slots("2026-11-02", [], [], { ...bookingConfig, slotDurationMinutes: 0 }),
    ).toEqual([]);
  });
  it("tidak menawarkan slot yang sudah lewat pada hari ini", () => {
    expect(
      slots("2026-10-26", [], [], { ...bookingConfig, minDaysAhead: 0 }).map(
        (slot) => slot.label,
      ),
    ).toEqual([
      "13:00 - 14:00",
      "14:00 - 15:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "19:30 - 20:30",
      "20:30 - 21:30",
    ]);
  });
  it("menolak konfigurasi dan blokir yang rusak secara fail-closed", () => {
    for (const config of [
      { ...bookingConfig, slotDurationMinutes: NaN },
      { ...bookingConfig, bufferMinutes: 0.5 },
      { ...bookingConfig, minDaysAhead: 10, maxDaysAhead: 1 },
    ])
      expect(slots("2026-11-02", [], [], config)).toEqual([]);
    expect(
      slots("2026-11-02", [
        { date: "2026-11-02", startTime: "not-time", endTime: "14:00" },
      ]),
    ).toEqual([]);
    expect(
      slots("2026-11-02", [{ date: "2026-11-02", startTime: "13:00" }]),
    ).toEqual([]);
  });
  it("getDaySlots menandai slot hari ini yang sudah lewat sebagai isPast dan tidak available", () => {
    const daySlots = getDaySlots(
      "2026-10-26",
      now,
      availabilityRules,
      [],
      [],
      { ...bookingConfig, minDaysAhead: 0 },
    );
    expect(daySlots).toHaveLength(8);
    const pastSlots = daySlots.filter((s) => s.isPast);
    const availableSlots = daySlots.filter((s) => s.isAvailable);
    expect(pastSlots.map((s) => s.label)).toEqual([
      "09:00 - 10:00",
      "10:00 - 11:00",
    ]);
    expect(pastSlots.every((s) => !s.isAvailable)).toBe(true);
    expect(availableSlots.map((s) => s.label)).toEqual([
      "13:00 - 14:00",
      "14:00 - 15:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "19:30 - 20:30",
      "20:30 - 21:30",
    ]);
  });
});
