"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createAdminUserStore } from "@/db/admin-user-store";
import { createAdminUser, listAdminUsers, updateAdminUser } from "@/services/admin-users";
import { ok, toFailure, type ActionResult } from "../result";

const idSchema = z.string().min(1).max(100);

export async function listAdminUsersAction(input: unknown): Promise<ActionResult<unknown>> {
  try {
    const principal = await requireAdmin();
    return ok(await listAdminUsers(createAdminUserStore(getDb()), principal, input));
  } catch (error) {
    return toFailure(error);
  }
}

/** Password is accepted for account creation only and is never returned to the caller. */
export async function createAdminUserAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const principal = await requireAdmin();
    const id = await createAdminUser(createAdminUserStore(getDb()), principal, input);
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}

export async function updateAdminUserAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const { id, value } = z.object({ id: idSchema, value: z.unknown() }).strict().parse(input);
    const principal = await requireAdmin();
    await updateAdminUser(createAdminUserStore(getDb()), principal, id, value);
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}
