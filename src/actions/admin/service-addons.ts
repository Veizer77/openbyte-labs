"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createServiceAddonStore } from "@/db/service-addon-store";
import { invalidateCatalogCache } from "@/services/catalog-cache";
import {
  deleteServiceAddon,
  listAdminServiceAddons,
  saveServiceAddon,
} from "@/services/service-addons";
import { ok, toFailure, type ActionResult } from "../result";

const idSchema = z.uuid();

export async function listServiceAddonsAction(input: unknown): Promise<ActionResult<unknown>> {
  try {
    const principal = await requireAdmin();
    return ok(await listAdminServiceAddons(createServiceAddonStore(getDb()), principal, input));
  } catch (error) {
    return toFailure(error);
  }
}

export async function saveServiceAddonAction(input: unknown): Promise<ActionResult<string>> {
  try {
    const { id, value } = z.object({ id: idSchema.nullable(), value: z.unknown() }).strict().parse(input);
    const principal = await requireAdmin();
    return ok(await saveServiceAddon(createServiceAddonStore(getDb()), principal, id, value, invalidateCatalogCache));
  } catch (error) {
    return toFailure(error);
  }
}

export async function deleteServiceAddonAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const id = idSchema.parse(input);
    const principal = await requireAdmin();
    await deleteServiceAddon(createServiceAddonStore(getDb()), principal, id, invalidateCatalogCache);
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}
