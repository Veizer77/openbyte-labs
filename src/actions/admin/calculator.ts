"use server";

import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createCalculatorAdminStore } from "@/db/calculator-store";
import { invalidateCalculatorCache } from "@/services/calculator-cache";
import {
  listCalculatorConfig,
  saveCalculatorConfig,
} from "@/services/calculator-admin";
import { ok, toFailure, type ActionResult } from "../result";

export async function listCalculatorConfigAction(): Promise<ActionResult<unknown>> {
  try {
    const principal = await requireAdmin();
    return ok(await listCalculatorConfig(createCalculatorAdminStore(getDb()), principal));
  } catch (error) {
    return toFailure(error);
  }
}

/** Replaces the complete group/item/rule graph atomically after domain validation. */
export async function saveCalculatorConfigAction(input: unknown): Promise<ActionResult<{ saved: true }>> {
  try {
    const principal = await requireAdmin();
    await saveCalculatorConfig(
      createCalculatorAdminStore(getDb()),
      principal,
      input,
      invalidateCalculatorCache,
    );
    return ok({ saved: true });
  } catch (error) {
    return toFailure(error);
  }
}
