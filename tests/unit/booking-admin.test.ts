import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import { googleCalendarUrl } from "@/lib/google-calendar";
import {
  confirmBooking,
  listAdminBookings,
  type BookingAdminStore,
} from "@/services/booking-admin";

const owner: AdminPrincipal = {
  id: "owner-id",
  role: "owner",
  twoFactorVerified: true,
};
const editor: AdminPrincipal = {
  id: "editor-id",
  role: "editor",
  twoFactorVerified: true,
};
const id = "03a45fa0-3b54-4d51-ac21-335a00655744";
const booking = {
  id,
  reference: "BKG-2610-ABCD",
  name: "Budi",
  whatsapp: "6281234567890",
  slotStart: new Date("2026-11-02T02:00:00Z"),
  slotEnd: new Date("2026-11-02T03:00:00Z"),
  consultationMode: "google_meet",
  status: "pending",
  meetingUrl: null,
};
function setup() {
  const list = vi.fn().mockResolvedValue([]);
  const getForUpdate = vi.fn().mockResolvedValue(booking);
  const readConfirmationTemplate = vi
    .fn()
    .mockResolvedValue(
      "Halo {nama}, {tanggal} {jam} WIB: {meeting_url}. {referensi}",
    );
  const confirm = vi.fn().mockResolvedValue(undefined);
  const audit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) =>
    callback({ getForUpdate, readConfirmationTemplate, confirm, audit }),
  );
  return {
    store: { list, transaction } as BookingAdminStore,
    list,
    getForUpdate,
    readConfirmationTemplate,
    confirm,
    audit,
    transaction,
  };
}

describe("admin booking", () => {
  it("menolak editor dan input URL tidak aman", async () => {
    const ctx = setup();
    await expect(
      listAdminBookings(ctx.store, editor, { limit: 10, offset: 0 }),
    ).rejects.toThrow("Akses ditolak");
    await expect(
      confirmBooking(ctx.store, editor, id, {
        meetingUrl: "https://example.com",
      }),
    ).rejects.toThrow("Akses ditolak");
    for (const meetingUrl of [
      "javascript:alert(1)",
      "http://example.com",
      "https://user:pass@example.com",
    ]) {
      await expect(
        confirmBooking(ctx.store, owner, id, { meetingUrl }),
      ).rejects.toThrow();
    }
    expect(ctx.transaction).not.toHaveBeenCalled();
  });
  it("mengonfirmasi booking pending dan membentuk pesan WIB untuk klien", async () => {
    const ctx = setup();
    const result = await confirmBooking(ctx.store, owner, id, {
      meetingUrl: "https://meet.example.com/abc",
    });
    const url = new URL(result.whatsappUrl);
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe("/6281234567890");
    expect(url.searchParams.get("text")).toContain("09:00 WIB");
    expect(url.searchParams.get("text")).toContain("BKG-2610-ABCD");
    expect(ctx.confirm).toHaveBeenCalledWith(
      id,
      "https://meet.example.com/abc",
    );
    expect(ctx.audit).toHaveBeenCalledWith(owner.id, id);
  });
  it("menolak status yang salah atau Google Meet tanpa URL", async () => {
    const ctx = setup();
    await expect(
      confirmBooking(ctx.store, owner, id, { meetingUrl: "" }),
    ).rejects.toThrow("Meeting URL wajib");
    ctx.getForUpdate.mockResolvedValue({ ...booking, status: "cancelled" });
    await expect(
      confirmBooking(ctx.store, owner, id, {
        meetingUrl: "https://example.com",
      }),
    ).rejects.toThrow("pending");
    expect(ctx.confirm).not.toHaveBeenCalled();
  });
  it("membedakan mode tanpa meeting URL dan meneruskan kegagalan audit", async () => {
    const ctx = setup();
    ctx.getForUpdate.mockResolvedValue({
      ...booking,
      consultationMode: "offline",
    });
    const result = await confirmBooking(ctx.store, owner, id, {
      meetingUrl: "",
    });
    expect(new URL(result.whatsappUrl).searchParams.get("text")).toContain(
      "Tatap muka",
    );
    ctx.audit.mockRejectedValue(new Error("audit gagal"));
    await expect(
      confirmBooking(ctx.store, owner, id, { meetingUrl: "" }),
    ).rejects.toThrow("audit gagal");
  });
  it("membuat tautan Calendar tanpa membuat meeting otomatis", () => {
    const url = new URL(
      googleCalendarUrl(booking.slotStart, booking.slotEnd, booking.reference),
    );
    expect(url.hostname).toBe("calendar.google.com");
    expect(url.searchParams.get("dates")).toBe(
      "20261102T020000Z/20261102T030000Z",
    );
    expect(url.searchParams.get("details")).toBe("Referensi: BKG-2610-ABCD");
  });
});
