"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createPackageStore } from "@/db/package-store";
import { invalidateCatalogCache } from "@/services/catalog-cache";
import {
  listAdminPackages,
  savePackage,
  setPackageTrash,
} from "@/services/packages";
import { ok, toFailure, type ActionResult } from "../result";

const idSchema = z.uuid();

export async function listPackagesAction(
  input: unknown,
): Promise<ActionResult<unknown>> {
  try {
    const principal = await requireAdmin();
    return ok(
      await listAdminPackages(createPackageStore(getDb()), principal, input),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function savePackageAction(
  input: unknown,
): Promise<ActionResult<string>> {
  try {
    const { id, value } = z
      .object({ id: idSchema.nullable(), value: z.unknown() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    const saved = await savePackage(
      createPackageStore(getDb()),
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

/** Soft delete/restore only; a hard delete would orphan historical inquiries. */
export async function trashPackageAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { id, deleted } = z
      .object({ id: idSchema, deleted: z.boolean() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    await setPackageTrash(
      createPackageStore(getDb()),
      principal,
      id,
      deleted,
      invalidateCatalogCache,
    );
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}
