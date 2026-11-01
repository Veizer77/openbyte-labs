import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import {
  listAdminQuotes,
  updateQuoteStatus,
  type QuoteAdminStore,
} from "@/services/quote-admin";

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

function setup() {
  const list = vi.fn().mockResolvedValue([]);
  const changeStatus = vi.fn().mockResolvedValue(true);
  const audit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) => callback({ changeStatus, audit }));
  return {
    store: { list, transaction } as QuoteAdminStore,
    list,
    transaction,
    changeStatus,
    audit,
  };
}

describe("pengelolaan quote", () => {
  it("menolak editor dan membatasi pagination sebelum membaca data", async () => {
    const ctx = setup();
    await expect(
      listAdminQuotes(ctx.store, editor, { limit: 10, offset: 0 }),
    ).rejects.toThrow("Akses ditolak");
    await expect(
      listAdminQuotes(ctx.store, owner, { limit: 101, offset: 0 }),
    ).rejects.toThrow();
    expect(ctx.list).not.toHaveBeenCalled();
    await expect(
      listAdminQuotes(ctx.store, owner, {
        status: "new",
        limit: 10,
        offset: 0,
      }),
    ).resolves.toEqual([]);
  });
  it("mencatat perubahan status owner dan menolak status asing", async () => {
    const ctx = setup();
    await expect(
      updateQuoteStatus(ctx.store, editor, id, "contacted"),
    ).rejects.toThrow("Akses ditolak");
    await expect(
      updateQuoteStatus(ctx.store, owner, id, "paid"),
    ).rejects.toThrow();
    expect(ctx.transaction).not.toHaveBeenCalled();
    await expect(
      updateQuoteStatus(ctx.store, owner, id, "contacted"),
    ).resolves.toBeUndefined();
    expect(ctx.changeStatus).toHaveBeenCalledWith(id, "contacted");
    expect(ctx.audit).toHaveBeenCalledWith(owner.id, id);
  });
  it("tidak mengembalikan hash IP atau kolom tambahan dari adapter", async () => {
    const ctx = setup();
    ctx.list.mockResolvedValue([
      {
        id,
        reference: "QTE-2610-ABCD",
        selection: [],
        priceMin: 1,
        priceMax: 1,
        daysMin: 0,
        daysMax: 0,
        contactName: null,
        contactWhatsapp: null,
        status: "new",
        createdAt: new Date(),
        ipHash: "private",
      },
    ]);
    const result = await listAdminQuotes(ctx.store, owner, {
      limit: 10,
      offset: 0,
    });
    expect(result[0]).not.toHaveProperty("ipHash");
  });
});
