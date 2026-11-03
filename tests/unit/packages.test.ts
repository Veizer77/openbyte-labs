import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import { packageInputSchema } from "@/schemas/packages";
import {
  listPublicPackages,
  savePackage,
  setPackageTrash,
  type PackageStore,
} from "@/services/packages";

const editor: AdminPrincipal = {
  id: "editor-id",
  role: "editor",
  twoFactorVerified: true,
};
const id = "03a45fa0-3b54-4d51-ac21-335a00655744";
const categoryId = "64f83a30-f94b-4da1-a2e0-3cf7e43de702";
const input = {
  categoryId,
  name: "Starter",
  slug: "starter",
  targetMarket: "",
  price: 1_000_000,
  discountPrice: 800_000,
  discountEndsAt: "2026-11-01T00:00:00Z",
  billingType: "one_time",
  estimatedDays: 7,
  features: ["Landing page"],
  includedRevisions: 2,
  extraRevisionPrice: 100_000,
  revisionPolicy: null,
  ctaLabel: "Pesan",
  isPopular: false,
  isActive: true,
  sortOrder: 1,
};
function setup(rows: unknown[] = []) {
  const list = vi.fn().mockResolvedValue(rows);
  const categoryForUpdate = vi.fn().mockResolvedValue({ isActive: true });
  const packageForUpdate = vi.fn().mockResolvedValue({ deletedAt: null });
  const save = vi.fn().mockResolvedValue(id);
  const setDeleted = vi.fn().mockResolvedValue(true);
  const audit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) =>
    callback({ categoryForUpdate, packageForUpdate, save, setDeleted, audit }),
  );
  return {
    store: { list, transaction } as PackageStore,
    list,
    categoryForUpdate,
    packageForUpdate,
    save,
    setDeleted,
    audit,
    transaction,
  };
}

describe("paket layanan", () => {
  it("memvalidasi diskon dan konten sebelum menyimpan serta mencatat audit", async () => {
    const ctx = setup();
    const invalidate = vi.fn();
    await expect(
      savePackage(ctx.store, null, null, input, invalidate),
    ).rejects.toThrow("Akses ditolak");
    await expect(
      savePackage(
        ctx.store,
        editor,
        null,
        { ...input, discountPrice: 1_100_000 },
        invalidate,
      ),
    ).rejects.toThrow();
    await expect(
      savePackage(
        ctx.store,
        editor,
        null,
        { ...input, name: "[ISI: nama]" },
        invalidate,
      ),
    ).rejects.toThrow();
    expect(ctx.transaction).not.toHaveBeenCalled();
    await expect(
      savePackage(ctx.store, editor, null, input, invalidate),
    ).resolves.toBe(id);
    expect(ctx.categoryForUpdate).toHaveBeenCalledWith(categoryId);
    expect(ctx.save).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        discountEndsAt: new Date("2026-11-01T00:00:00Z"),
      }),
    );
    expect(ctx.audit).toHaveBeenCalledWith(editor.id, "create", id);
    expect(invalidate).toHaveBeenCalledOnce();
  });
  it("tidak mengaktifkan kategori nonaktif atau mengedit paket yang masih di trash", async () => {
    const ctx = setup();
    ctx.categoryForUpdate.mockResolvedValue({ isActive: false });
    await expect(
      savePackage(ctx.store, editor, null, input, vi.fn()),
    ).rejects.toThrow("Kategori tidak tersedia");
    ctx.packageForUpdate.mockResolvedValue({ deletedAt: new Date() });
    await expect(
      savePackage(ctx.store, editor, id, input, vi.fn()),
    ).rejects.toThrow("Pulihkan paket");
    expect(ctx.save).not.toHaveBeenCalled();
  });
  it("menerapkan harga efektif dan menyaring paket nonaktif atau trash", async () => {
    const row = {
      ...input,
      id,
      discountEndsAt: new Date(input.discountEndsAt),
      deletedAt: null,
      categoryActive: true,
    };
    const ctx = setup([
      row,
      { ...row, id: "cfa09082-8b42-4195-a501-67fb0c47ee71", isActive: false },
    ]);
    expect(
      (
        await listPublicPackages(
          ctx.store,
          { limit: 10, offset: 0 },
          new Date("2026-10-26T00:00:00Z"),
        )
      )[0].effectivePrice,
    ).toBe(800_000);
    const after = await listPublicPackages(
      ctx.store,
      { limit: 10, offset: 0 },
      new Date("2026-11-01T00:00:00Z"),
    );
    expect(after).toHaveLength(1);
    expect(after[0].effectivePrice).toBe(1_000_000);
  });
  it("menyimpan trash/restore dan menolak nilai boolean palsu", async () => {
    const ctx = setup();
    await expect(
      setPackageTrash(ctx.store, editor, id, "false", vi.fn()),
    ).rejects.toThrow();
    expect(ctx.transaction).not.toHaveBeenCalled();
    await expect(
      setPackageTrash(ctx.store, editor, id, true, vi.fn()),
    ).resolves.toBeUndefined();
    await expect(
      setPackageTrash(ctx.store, editor, id, false, vi.fn()),
    ).resolves.toBeUndefined();
    expect(ctx.audit).toHaveBeenCalledWith(editor.id, "delete", id);
    expect(ctx.audit).toHaveBeenCalledWith(editor.id, "restore", id);
  });
  it("menerima discountEndsAt berupa Date, string ISO, string datetime-local, dan memetakan field error", () => {
    const fromDate = packageInputSchema.parse({
      ...input,
      discountEndsAt: new Date("2026-11-01T00:00:00Z"),
    });
    expect(fromDate.discountEndsAt).toBeInstanceOf(Date);

    const fromIso = packageInputSchema.parse({
      ...input,
      discountEndsAt: "2026-11-01T00:00:00Z",
    });
    expect(fromIso.discountEndsAt).toBeInstanceOf(Date);

    const fromLocal = packageInputSchema.parse({
      ...input,
      discountEndsAt: "2026-11-04T12:00",
    });
    expect(fromLocal.discountEndsAt).toBeInstanceOf(Date);

    const fromNull = packageInputSchema.parse({
      ...input,
      discountPrice: null,
      discountEndsAt: null,
    });
    expect(fromNull.discountEndsAt).toBeNull();

    // Pastikan error memiliki path field yang tepat
    const invalidDiscount = packageInputSchema.safeParse({
      ...input,
      discountPrice: 500_000,
      discountEndsAt: null,
    });
    expect(invalidDiscount.success).toBe(false);
    if (!invalidDiscount.success) {
      expect(invalidDiscount.error.issues[0]?.path).toEqual(["discountEndsAt"]);
    }

    const invalidPrice = packageInputSchema.safeParse({
      ...input,
      discountPrice: 2_000_000,
      price: 1_000_000,
    });
    expect(invalidPrice.success).toBe(false);
    if (!invalidPrice.success) {
      expect(invalidPrice.error.issues[0]?.path).toEqual(["discountPrice"]);
    }
  });
});
