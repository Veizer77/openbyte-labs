import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import {
  deleteAvailabilityRule,
  saveAvailabilityRule,
  type AvailabilityStore,
} from "@/services/availability";

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
const rule = {
  weekday: 1,
  startTime: "09:00",
  endTime: "11:00",
  isActive: true,
};

function setup(rows: Array<typeof rule & { id: string }> = []) {
  const lockSchedule = vi.fn().mockResolvedValue(undefined);
  const listDay = vi.fn().mockResolvedValue(rows);
  const save = vi.fn().mockResolvedValue(id);
  const remove = vi.fn().mockResolvedValue(true);
  const audit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) =>
    callback({ lockSchedule, listDay, save, remove, audit }),
  );
  return {
    store: { transaction } as AvailabilityStore,
    lockSchedule,
    listDay,
    save,
    remove,
    audit,
    transaction,
  };
}

describe("pengaturan jadwal owner", () => {
  it("menolak editor dan input salah sebelum transaksi", async () => {
    const ctx = setup();
    await expect(
      saveAvailabilityRule(ctx.store, editor, null, rule),
    ).rejects.toThrow("Akses ditolak");
    await expect(
      saveAvailabilityRule(ctx.store, owner, null, {
        ...rule,
        startTime: "25:00",
      }),
    ).rejects.toThrow();
    await expect(
      saveAvailabilityRule(ctx.store, owner, null, {
        ...rule,
        endTime: "08:00",
      }),
    ).rejects.toThrow();
    expect(ctx.transaction).not.toHaveBeenCalled();
  });
  it("menolak interval aktif tumpang tindih, tetapi mengizinkan interval bersebelahan", async () => {
    const ctx = setup([{ ...rule, id }]);
    await expect(
      saveAvailabilityRule(ctx.store, owner, null, {
        ...rule,
        startTime: "10:00",
        endTime: "12:00",
      }),
    ).rejects.toThrow("bertumpang tindih");
    expect(ctx.save).not.toHaveBeenCalled();
    await expect(
      saveAvailabilityRule(ctx.store, owner, null, {
        ...rule,
        startTime: "11:00",
        endTime: "12:00",
      }),
    ).resolves.toBe(id);
    expect(ctx.audit).toHaveBeenCalledWith(owner.id, "create", id);
    expect(ctx.lockSchedule.mock.invocationCallOrder[0]).toBeLessThan(
      ctx.listDay.mock.invocationCallOrder[0],
    );
  });
  it("tidak menganggap aturan itu sendiri sebagai benturan saat diubah", async () => {
    const ctx = setup([{ ...rule, id }]);
    await expect(
      saveAvailabilityRule(ctx.store, owner, id, rule),
    ).resolves.toBe(id);
    expect(ctx.audit).toHaveBeenCalledWith(owner.id, "update", id);
    ctx.audit.mockRejectedValue(new Error("audit gagal"));
    await expect(
      saveAvailabilityRule(ctx.store, owner, id, rule),
    ).rejects.toThrow("audit gagal");
  });
  it("menghapus jadwal hanya untuk owner, dengan lock dan audit", async () => {
    const ctx = setup();
    await expect(deleteAvailabilityRule(ctx.store, editor, id)).rejects.toThrow(
      "Akses ditolak",
    );
    await expect(
      deleteAvailabilityRule(ctx.store, owner, id),
    ).resolves.toBeUndefined();
    expect(ctx.remove).toHaveBeenCalledWith(id);
    expect(ctx.audit).toHaveBeenCalledWith(owner.id, "delete", id);
    ctx.remove.mockResolvedValue(false);
    await expect(deleteAvailabilityRule(ctx.store, owner, id)).rejects.toThrow(
      "Jadwal tidak ditemukan",
    );
  });
});
