import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  packageInputSchema,
  packageRecordSchema,
  type PackageInput,
  type PackageRecord,
} from "@/schemas/packages";

const listOptions = z
  .object({
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
  })
  .strict();
export interface PackageStore {
  list(
    options: z.output<typeof listOptions> & { publicOnly: boolean },
  ): Promise<unknown[]>;
  transaction<T>(
    callback: (tx: {
      categoryForUpdate(id: string): Promise<{ isActive: boolean } | null>;
      packageForUpdate(id: string): Promise<{ deletedAt: Date | null } | null>;
      save(id: string | null, value: PackageInput): Promise<string | null>;
      setDeleted(id: string, deleted: boolean): Promise<boolean>;
      audit(
        actorId: string,
        action: "create" | "update" | "delete" | "restore",
        id: string,
      ): Promise<void>;
    }) => Promise<T>,
  ): Promise<T>;
}
async function invalidate(callback: () => void | Promise<void>): Promise<void> {
  try {
    await callback();
  } catch {
    throw new Error(
      "Paket sudah disimpan, tetapi cache belum berhasil diperbarui.",
    );
  }
}

export async function listAdminPackages(
  store: PackageStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<PackageRecord[]> {
  authorize(principal, "service-packages", "read");
  return z
    .array(packageRecordSchema)
    .parse(
      await store.list({ ...listOptions.parse(input), publicOnly: false }),
    );
}
export async function listPublicPackages(
  store: PackageStore,
  input: unknown,
  now = new Date(),
): Promise<Array<PackageRecord & { effectivePrice: number }>> {
  if (!Number.isFinite(now.getTime()))
    throw new Error("Jam server tidak valid.");
  const rows = z
    .array(packageRecordSchema)
    .parse(await store.list({ ...listOptions.parse(input), publicOnly: true }));
  return rows
    .filter((row) => row.isActive && row.categoryActive && !row.deletedAt)
    .map((row) => ({
      ...row,
      effectivePrice:
        row.discountPrice !== null && row.discountEndsAt! > now
          ? row.discountPrice
          : row.price,
    }));
}
export async function savePackage(
  store: PackageStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
  invalidateCache: () => void | Promise<void>,
): Promise<string> {
  authorize(principal, "service-packages", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const value = packageInputSchema.parse(input);
  const result = await store.transaction(async (tx) => {
    if (id !== null) {
      const existing = await tx.packageForUpdate(id);
      if (!existing) throw new Error("Paket tidak ditemukan.");
      if (existing.deletedAt)
        throw new Error("Pulihkan paket sebelum mengubahnya.");
    }
    const category = await tx.categoryForUpdate(value.categoryId);
    if (!category || (value.isActive && !category.isActive))
      throw new Error("Kategori tidak tersedia.");
    const saved = await tx.save(id, value);
    if (!saved) throw new Error("Paket tidak ditemukan.");
    await tx.audit(principal.id, id === null ? "create" : "update", saved);
    return saved;
  });
  await invalidate(invalidateCache);
  return result;
}
export async function setPackageTrash(
  store: PackageStore,
  principal: AdminPrincipal | null,
  id: string,
  input: unknown,
  invalidateCache: () => void | Promise<void>,
): Promise<void> {
  const deleted = z.boolean().parse(input);
  authorize(principal, "service-packages", deleted ? "delete" : "restore");
  z.uuid().parse(id);
  await store.transaction(async (tx) => {
    if (!(await tx.setDeleted(id, deleted)))
      throw new Error("Paket tidak ditemukan atau status tidak berubah.");
    await tx.audit(principal.id, deleted ? "delete" : "restore", id);
  });
  await invalidate(invalidateCache);
}
