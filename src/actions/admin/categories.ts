"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createCategoryStore } from "@/db/category-store";
import { invalidateCatalogCache } from "@/services/catalog-cache";
import {
  deleteCategory,
  listCategories,
  saveCategory,
} from "@/services/categories";
import { ok, toFailure, type ActionResult } from "../result";

const idSchema = z.uuid();

export async function listCategoriesAction(
  input: unknown,
): Promise<ActionResult<unknown>> {
  try {
    const principal = await requireAdmin();
    return ok(
      await listCategories(createCategoryStore(getDb()), principal, input),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function saveCategoryAction(
  input: unknown,
): Promise<ActionResult<string>> {
  try {
    const { id, value } = z
      .object({ id: idSchema.nullable(), value: z.unknown() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    const saved = await saveCategory(
      createCategoryStore(getDb()),
      principal,
      id,
      value,
      invalidateCatalogCache,
    );
    return ok(saved);
  } catch (error) {
    return toFailure(error);
  }
}

/** Referenced categories are refused by the service and by FK RESTRICT. */
export async function deleteCategoryAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const id = idSchema.parse(input);
    const principal = await requireAdmin();
    await deleteCategory(
      createCategoryStore(getDb()),
      principal,
      id,
      invalidateCatalogCache,
    );
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}
