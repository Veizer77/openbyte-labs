import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import {
  deleteFaq,
  listAdminFaqs,
  listPublicFaqs,
  saveFaq,
  type FaqStore,
} from "@/services/faqs";

const editor: AdminPrincipal = {
  id: "editor-id",
  role: "editor",
  twoFactorVerified: true,
};
const id = "03a45fa0-3b54-4d51-ac21-335a00655744";
const faq = {
  question: "Berapa lama pengerjaannya?",
  answer: {
    version: 1,
    blocks: [
      {
        type: "paragraph",
        children: [{ type: "text", text: "Sesuai kebutuhan proyek." }],
      },
    ],
  },
  isActive: true,
  requiresTracking: false,
  sortOrder: 1,
};

function setup(rows: unknown[] = []) {
  const list = vi.fn().mockResolvedValue(rows);
  const save = vi.fn().mockResolvedValue(id);
  const remove = vi.fn().mockResolvedValue(true);
  const audit = vi.fn().mockResolvedValue(undefined);
  const committed = vi.fn();
  const transaction = vi.fn(async (callback) => {
    const result = await callback({ save, remove, audit });
    committed();
    return result;
  });
  return {
    store: { list, transaction } as FaqStore,
    list,
    save,
    remove,
    audit,
    committed,
    transaction,
  };
}

describe("service FAQ", () => {
  it("memeriksa izin dan menolak konten belum lengkap saat diaktifkan", async () => {
    const ctx = setup();
    const invalid = { ...faq, question: "[ISI: pertanyaan]" };
    await expect(saveFaq(ctx.store, null, null, faq, vi.fn())).rejects.toThrow(
      "Akses ditolak",
    );
    await expect(
      saveFaq(ctx.store, editor, null, invalid, vi.fn()),
    ).rejects.toThrow();
    await expect(
      saveFaq(
        ctx.store,
        editor,
        null,
        { ...faq, answer: { version: 1, blocks: [] } },
        vi.fn(),
      ),
    ).rejects.toThrow();
    await expect(
      saveFaq(
        ctx.store,
        editor,
        null,
        { ...faq, requiresTracking: true },
        vi.fn(),
      ),
    ).rejects.toThrow();
    expect(ctx.transaction).not.toHaveBeenCalled();
    await expect(
      saveFaq(
        ctx.store,
        editor,
        null,
        { ...invalid, isActive: false },
        vi.fn(),
      ),
    ).resolves.toBe(id);
  });
  it("menyimpan dan audit dalam transaksi, lalu menginvalidasi cache", async () => {
    const ctx = setup();
    const invalidate = vi.fn();
    await expect(
      saveFaq(ctx.store, editor, null, faq, invalidate),
    ).resolves.toBe(id);
    expect(ctx.audit).toHaveBeenCalledWith(editor.id, "create", id);
    expect(ctx.committed.mock.invocationCallOrder[0]).toBeLessThan(
      invalidate.mock.invocationCallOrder[0],
    );
    await expect(
      deleteFaq(ctx.store, editor, id, invalidate),
    ).resolves.toBeUndefined();
    expect(ctx.audit).toHaveBeenCalledWith(editor.id, "delete", id);
    ctx.audit.mockRejectedValue(new Error("audit gagal"));
    invalidate.mockClear();
    await expect(
      saveFaq(ctx.store, editor, id, faq, invalidate),
    ).rejects.toThrow("audit gagal");
    expect(invalidate).not.toHaveBeenCalled();
  });
  it("membatasi daftar dan tidak mengembalikan FAQ nonaktif ke publik", async () => {
    const ctx = setup([
      { ...faq, id },
      { ...faq, id: "64f83a30-f94b-4da1-a2e0-3cf7e43de702", isActive: false },
    ]);
    await expect(
      listAdminFaqs(ctx.store, null, { limit: 10, offset: 0 }),
    ).rejects.toThrow("Akses ditolak");
    expect(await listPublicFaqs(ctx.store, { limit: 10, offset: 0 })).toEqual([
      { ...faq, id },
    ]);
    expect(ctx.list).toHaveBeenCalledWith({
      activeOnly: true,
      limit: 10,
      offset: 0,
    });
    await expect(
      listPublicFaqs(ctx.store, { limit: 1000, offset: 0 }),
    ).rejects.toThrow();
  });
});
