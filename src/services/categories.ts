import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  categoryInputSchema,
  categoryRecordSchema,
  type CategoryInput,
  type CategoryRecord,
} from "@/schemas/categories";

const listOptions = z
  .object({
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
  })
  .strict();
export interface CategoryStore {
  list(
    options: z.output<typeof listOptions> & { publicOnly: boolean },
  ): Promise<unknown[]>;
  transaction<T>(
    callback: (tx: {
      save(id: string | null, value: CategoryInput): Promise<string | null>;
      remove(id: string): Promise<boolean>;
      audit(
        actorId: string,
        action: "create" | "update" | "delete",
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
      "Kategori sudah disimpan, tetapi cache belum berhasil diperbarui.",
    );
  }
}
function isReferencedCategory(error: unknown): boolean {
  let current = error;
  for (let i = 0; i < 5 && current && typeof current === "object"; i++) {
    const value = current as {
      code?: unknown;
      constraint?: unknown;
      constraint_name?: unknown;
      cause?: unknown;
    };
    const constraint = value.constraint ?? value.constraint_name;
    if (
      value.code === "23503" &&
      typeof constraint === "string" &&
      [
        "service_packages_category_id_categories_id_fk",
        "project_categories_category_id_categories_id_fk",
      ].includes(constraint)
    )
      return true;
    current = value.cause;
  }
  return false;
}

export async function listCategories(
  store: CategoryStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<CategoryRecord[]> {
  authorize(principal, "categories", "read");
  return z
    .array(categoryRecordSchema)
    .parse(
      await store.list({ ...listOptions.parse(input), publicOnly: false }),
    );
}
export async function listPublicCategories(
  store: CategoryStore,
  input: unknown,
): Promise<CategoryRecord[]> {
  const records = z
    .array(categoryRecordSchema)
    .parse(await store.list({ ...listOptions.parse(input), publicOnly: true }));
  return records.filter((record) => record.isActive && record.showInFilter);
}
export async function saveCategory(
  store: CategoryStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
  invalidateCache: () => void | Promise<void>,
): Promise<string> {
  authorize(principal, "categories", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const value = categoryInputSchema.parse(input);
  const result = await store.transaction(async (tx) => {
    const saved = await tx.save(id, value);
    if (!saved) throw new Error("Kategori tidak ditemukan.");
    await tx.audit(principal.id, id === null ? "create" : "update", saved);
    return saved;
  });
  await invalidate(invalidateCache);
  return result;
}
export async function deleteCategory(
  store: CategoryStore,
  principal: AdminPrincipal | null,
  id: string,
  invalidateCache: () => void | Promise<void>,
): Promise<void> {
  authorize(principal, "categories", "delete");
  z.uuid().parse(id);
  try {
    await store.transaction(async (tx) => {
      if (!(await tx.remove(id))) throw new Error("Kategori tidak ditemukan.");
      await tx.audit(principal.id, "delete", id);
    });
  } catch (error) {
    if (isReferencedCategory(error))
      throw new Error("Kategori masih digunakan oleh paket atau proyek.");
    throw error;
  }
  await invalidate(invalidateCache);
}
