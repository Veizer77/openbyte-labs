"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createTechnologyStore } from "@/db/technology-store";
import { invalidateCatalogCache } from "@/services/catalog-cache";
import {
  deleteTechnology,
  listAdminTechnologies,
  saveTechnology,
} from "@/services/technologies";
import { ok, toFailure, type ActionResult } from "../result";

const idSchema = z.uuid();

export async function listTechnologiesAction(input: unknown): Promise<ActionResult<unknown>> {
  try {
    const principal = await requireAdmin();
    return ok(await listAdminTechnologies(createTechnologyStore(getDb()), principal, input));
  } catch (error) {
    return toFailure(error);
  }
}

export async function saveTechnologyAction(input: unknown): Promise<ActionResult<string>> {
  try {
    const { id, value } = z.object({ id: idSchema.nullable(), value: z.unknown() }).strict().parse(input);
    const principal = await requireAdmin();
    return ok(await saveTechnology(createTechnologyStore(getDb()), principal, id, value, invalidateCatalogCache));
  } catch (error) {
    return toFailure(error);
  }
}

export async function deleteTechnologyAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const id = idSchema.parse(input);
    const principal = await requireAdmin();
    await deleteTechnology(createTechnologyStore(getDb()), principal, id, invalidateCatalogCache);
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}
