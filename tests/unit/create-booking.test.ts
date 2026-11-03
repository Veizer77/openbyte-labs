import { describe, expect, it, vi } from "vitest";
import { bookingConfig, availabilityRules } from "@/fixtures/booking";
import { createReference } from "@/lib/reference";
import {
  createBooking,
  type BookingSchedule,
  type BookingStore,
} from "@/services/create-booking";

const now = new Date("2026-10-26T03:00:00Z");
const ipHash = "a".repeat(64);
const request = {
  name: " Budi ",
  whatsapp: "081234567890",
  email: "",
  organizationOrBusiness: "",
  serviceInterest: "Website",
  projectBrief: "Konsultasi",
  slotStart: "2026-11-02T09:00:00+07:00",
  consultationMode: "google_meet",
  consent: true,
  turnstileToken: "test-token",
  honeypot: "",
};
const schedule = (): BookingSchedule => ({
  config: { ...bookingConfig, availableModes: ["google_meet", "offline"] },
  rules: availabilityRules,
  blocks: [],
  bookings: [],
});

function setup(current = schedule()) {
  const readSchedule = vi.fn().mockResolvedValue(current);
  const tryInsert = vi.fn().mockResolvedValue("booking-id");
  const insertAudit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) =>
    callback({ readSchedule, tryInsert, insertAudit }),
  );
  const store = { transaction } as BookingStore;
  const verifyChallenge = vi.fn().mockResolvedValue(true);
  const consumeBudget = vi.fn().mockResolvedValue(true);
  const reference = vi.fn().mockReturnValue("BKG-2610-ABCD");
  return {
    store,
    verifyChallenge,
    consumeBudget,
    now: () => now,
    reference,
    readSchedule,
    tryInsert,
    insertAudit,
    transaction,
  };
}

describe("pembuatan booking server", () => {
  it("memvalidasi spam dan rate limit sebelum mengakses jadwal", async () => {
    const ctx = setup();
    ctx.verifyChallenge.mockResolvedValue(false);
    await expect(createBooking(request, ipHash, ctx)).rejects.toMatchObject({
      code: "anti_spam",
    });
    expect(ctx.consumeBudget).not.toHaveBeenCalled();
    expect(ctx.transaction).not.toHaveBeenCalled();
    ctx.verifyChallenge.mockResolvedValue(true);
    ctx.consumeBudget.mockResolvedValue(false);
    await expect(createBooking(request, ipHash, ctx)).rejects.toMatchObject({
      code: "rate_limit",
    });
    expect(ctx.transaction).not.toHaveBeenCalled();
    await expect(
      createBooking({ ...request, honeypot: "bot" }, ipHash, ctx),
    ).rejects.toMatchObject({ code: "anti_spam" });
  });
  it("mengabaikan tanggal akhir dari klien dan menyimpan slot dari konfigurasi server", async () => {
    const ctx = setup();
    await expect(
      createBooking(
        { ...request, slotEnd: "2030-01-01T00:00:00Z" },
        ipHash,
        ctx,
      ),
    ).rejects.toThrow();
    expect(await createBooking(request, ipHash, ctx)).toMatchObject({
      reference: "BKG-2610-ABCD",
      slotStart: "2026-11-02T02:00:00.000Z",
      slotEnd: "2026-11-02T03:00:00.000Z",
    });
    expect(ctx.readSchedule).toHaveBeenCalledWith("2026-11-02");
    expect(ctx.tryInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Budi",
        whatsapp: "6281234567890",
        email: null,
        slotStart: new Date("2026-11-02T02:00:00Z"),
        slotEnd: new Date("2026-11-02T03:00:00Z"),
        consentAt: now,
      }),
    );
    expect(ctx.insertAudit).toHaveBeenCalledWith("booking-id");
  });
  it("menolak slot atau mode yang tidak lagi tersedia", async () => {
    const blocked = schedule();
    blocked.blocks = [
      { date: "2026-11-02", startTime: "09:00", endTime: "10:00" },
    ];
    const ctx = setup(blocked);
    await expect(createBooking(request, ipHash, ctx)).rejects.toMatchObject({
      code: "slot_unavailable",
    });
    expect(ctx.tryInsert).not.toHaveBeenCalled();
    const mode = setup();
    await expect(
      createBooking(
        { ...request, consultationMode: "whatsapp_call" },
        ipHash,
        mode,
      ),
    ).rejects.toMatchObject({ code: "mode_unavailable" });
    expect(mode.tryInsert).not.toHaveBeenCalled();
  });
  it("memeriksa jam setelah mengambil lock jadwal", async () => {
    const ctx = setup();
    const clock = vi.fn(() => new Date("2026-11-02T02:30:00Z"));
    await expect(
      createBooking(request, ipHash, { ...ctx, now: clock }),
    ).rejects.toMatchObject({ code: "slot_unavailable" });
    expect(ctx.readSchedule.mock.invocationCallOrder[0]).toBeLessThan(
      clock.mock.invocationCallOrder[0],
    );
  });
  it("menolak slot yang jamnya sudah lewat walau booking hari yang sama diizinkan", async () => {
    // minDaysAhead = 0 opens today's schedule; only the wall-clock guard can
    // reject the 09:00 WIB slot once the server clock reaches 09:30 WIB.
    const sameDay = schedule();
    sameDay.config = { ...sameDay.config, minDaysAhead: 0 };
    const ctx = setup(sameDay);
    await expect(
      createBooking(request, ipHash, {
        ...ctx,
        now: () => new Date("2026-11-02T02:30:00Z"),
      }),
    ).rejects.toMatchObject({ code: "slot_unavailable" });
    expect(ctx.readSchedule).toHaveBeenCalledWith("2026-11-02");
    expect(ctx.tryInsert).not.toHaveBeenCalled();
    expect(ctx.insertAudit).not.toHaveBeenCalled();
  });
  it("mengulang benturan referensi dan membatasi percobaan", async () => {
    const ctx = setup();
    ctx.tryInsert
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce("booking-id");
    ctx.reference
      .mockReturnValueOnce("BKG-2610-AAAA")
      .mockReturnValueOnce("BKG-2610-BBBB");
    await expect(createBooking(request, ipHash, ctx)).resolves.toMatchObject({
      reference: "BKG-2610-BBBB",
    });
    expect(ctx.tryInsert).toHaveBeenCalledTimes(2);
    const exhausted = setup();
    exhausted.tryInsert.mockResolvedValue(null);
    await expect(
      createBooking(request, ipHash, exhausted),
    ).rejects.toMatchObject({ code: "reference_exhausted" });
    expect(exhausted.tryInsert).toHaveBeenCalledTimes(5);
    expect(exhausted.insertAudit).not.toHaveBeenCalled();
  });
  it("mengubah benturan constraint booking menjadi pesan aman dan meneruskan gagal audit", async () => {
    const ctx = setup();
    ctx.tryInsert.mockRejectedValue({
      cause: {
        code: "23P01",
        constraint_name: "consultation_bookings_no_overlap",
      },
    });
    await expect(createBooking(request, ipHash, ctx)).rejects.toMatchObject({
      code: "slot_unavailable",
    });
    const failure = setup();
    failure.insertAudit.mockRejectedValue(new Error("audit gagal"));
    await expect(createBooking(request, ipHash, failure)).rejects.toThrow(
      "audit gagal",
    );
  });
  it("nomor referensi memakai bulan WIB dan alfabet tanpa karakter ambigu", () => {
    const result = createReference("BKG", new Date("2026-10-31T18:00:00Z"));
    expect(result).toMatch(/^BKG-2611-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/);
  });
});
