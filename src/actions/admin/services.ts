"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createServiceStore } from "@/db/service-store";
import { invalidateCatalogCache } from "@/services/catalog-cache";
import {
  deleteService,
  listAdminServices,
  saveService,
} from "@/services/services";
import { ok, toFailure, type ActionResult } from "../result";

const idSchema = z.uuid();

export async function listServicesAction(input: unknown): Promise<ActionResult<unknown>> {
  try {
    const principal = await requireAdmin();
    return ok(await listAdminServices(createServiceStore(getDb()), principal, input));
  } catch (error) {
    return toFailure(error);
  }
}

export async function saveServiceAction(input: unknown): Promise<ActionResult<string>> {
  try {
    const { id, value } = z.object({ id: idSchema.nullable(), value: z.unknown() }).strict().parse(input);
    const principal = await requireAdmin();
    return ok(await saveService(createServiceStore(getDb()), principal, id, value, invalidateCatalogCache));
  } catch (error) {
    return toFailure(error);
  }
}

export async function deleteServiceAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const id = idSchema.parse(input);
    const principal = await requireAdmin();
    await deleteService(createServiceStore(getDb()), principal, id, invalidateCatalogCache);
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}
