import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import {
  deleteBlockedDate,
  saveBlockedDate,
  type BlockedDateStore,
} from "@/services/blocked-dates";

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
const fullDay = {
  date: "2026-11-02",
  startTime: null,
  endTime: null,
  reason: "Libur",
};

function setup() {
  const lockSchedule = vi.fn().mockResolvedValue(undefined);
  const save = vi.fn().mockResolvedValue(id);
  const remove = vi.fn().mockResolvedValue(true);
  const audit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) =>
    callback({ lockSchedule, save, remove, audit }),
  );
  return {
    store: { transaction } as BlockedDateStore,
    lockSchedule,
    save,
    remove,
    audit,
    transaction,
  };
}

describe("tanggal booking terblokir", () => {
  it("hanya owner yang dapat mengubah dan harus memakai tanggal serta jam sah", async () => {
    const ctx = setup();
    await expect(
      saveBlockedDate(ctx.store, editor, null, fullDay),
    ).rejects.toThrow("Akses ditolak");
    for (const input of [
      { ...fullDay, date: "2026-02-30" },
      { ...fullDay, startTime: "09:00" },
      { ...fullDay, startTime: "10:00", endTime: "09:00" },
    ])
      await expect(
        saveBlockedDate(ctx.store, owner, null, input),
      ).rejects.toThrow();
    expect(ctx.transaction).not.toHaveBeenCalled();
  });
  it("menyimpan atau menghapus dengan lock bersama dan audit", async () => {
    const ctx = setup();
    await expect(
      saveBlockedDate(ctx.store, owner, null, fullDay),
    ).resolves.toBe(id);
    expect(ctx.save).toHaveBeenCalledWith(null, fullDay);
    expect(ctx.audit).toHaveBeenCalledWith(owner.id, "create", id);
    expect(ctx.lockSchedule.mock.invocationCallOrder[0]).toBeLessThan(
      ctx.save.mock.invocationCallOrder[0],
    );
    await expect(
      deleteBlockedDate(ctx.store, owner, id),
    ).resolves.toBeUndefined();
    expect(ctx.audit).toHaveBeenCalledWith(owner.id, "delete", id);
    ctx.remove.mockResolvedValue(false);
    await expect(deleteBlockedDate(ctx.store, owner, id)).rejects.toThrow(
      "tidak ditemukan",
    );
  });
});
