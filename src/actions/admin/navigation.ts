"use server";

import type { AdminRole } from "@/access/rules";
import { requireAdmin } from "@/auth/session";
import { ok, toFailure, type ActionResult } from "../result";

/** Used only to tailor navigation; every destination still checks access server-side. */
export async function getAdminNavigationRoleAction(): Promise<
  ActionResult<AdminRole>
> {
  try {
    const principal = await requireAdmin();
    return ok(principal.role);
  } catch (error) {
    return toFailure(error);
  }
}
