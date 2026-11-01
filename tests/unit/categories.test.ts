import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import {
  deleteCategory,
  listPublicCategories,
  saveCategory,
  type CategoryStore,
} from "@/services/categories";

const editor: AdminPrincipal = {
  id: "editor-id",
  role: "editor",
  twoFactorVerified: true,
};
const id = "03a45fa0-3b54-4d51-ac21-335a00655744";
const category = {
  name: "Bisnis & UMKM",
  slug: "bisnis-umkm",
  icon: "",
  showInFilter: true,
  isActive: true,
  sortOrder: 1,
};
function setup(rows: unknown[] = []) {
  const list = vi.fn().mockResolvedValue(rows);
  const save = vi.fn().mockResolvedValue(id);
  const remove = vi.fn().mockResolvedValue(true);
  const audit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) => callback({ save, remove, audit }));
  return {
    store: { list, transaction } as CategoryStore,
    list,
    save,
    remove,
    audit,
    transaction,
  };
}

describe("kategori", () => {
  it("memvalidasi input dan mencatat perubahan editor", async () => {
    const ctx = setup();
    const invalidate = vi.fn();
    await expect(
      saveCategory(ctx.store, null, null, category, invalidate),
    ).rejects.toThrow("Akses ditolak");
    await expect(
      saveCategory(
        ctx.store,
        editor,
        null,
        { ...category, slug: "Bad Slug" },
        invalidate,
      ),
    ).rejects.toThrow();
    expect(ctx.transaction).not.toHaveBeenCalled();
    await expect(
      saveCategory(ctx.store, editor, null, category, invalidate),
    ).resolves.toBe(id);
    expect(ctx.audit).toHaveBeenCalledWith(editor.id, "create", id);
    expect(invalidate).toHaveBeenCalledOnce();
  });
  it("menolak penghapusan kategori yang masih direferensikan", async () => {
    const ctx = setup();
    ctx.remove.mockRejectedValue({
      cause: {
        code: "23503",
        constraint_name: "service_packages_category_id_categories_id_fk",
      },
    });
    const invalidate = vi.fn();
    await expect(
      deleteCategory(ctx.store, editor, id, invalidate),
    ).rejects.toThrow("Kategori masih digunakan");
    expect(ctx.audit).not.toHaveBeenCalled();
    expect(invalidate).not.toHaveBeenCalled();
  });
  it("hanya mengembalikan kategori aktif yang ditampilkan di filter publik", async () => {
    const ctx = setup([
      { ...category, id },
      {
        ...category,
        id: "64f83a30-f94b-4da1-a2e0-3cf7e43de702",
        isActive: false,
      },
    ]);
    expect(
      await listPublicCategories(ctx.store, { limit: 10, offset: 0 }),
    ).toEqual([{ ...category, id }]);
  });
});
