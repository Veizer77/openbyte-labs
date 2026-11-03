"use server";

import { eq } from "drizzle-orm";
import type { AdminRole } from "@/access/rules";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { adminProfiles } from "@/db/schema/admin-profile";
import { authUser } from "@/db/schema/admin-identity";
import { ok, toFailure, type ActionResult } from "../result";

export type AdminNavigationUser = {
  role: AdminRole;
  name: string;
  email: string;
  twoFactorVerified: boolean;
};

/** Used only to tailor navigation; every destination still checks access server-side. */
export async function getAdminNavigationRoleAction(): Promise<
  ActionResult<AdminNavigationUser>
> {
  try {
    const principal = await requireAdmin();
    const db = getDb();
    const [row] = await db
      .select({
        name: authUser.name,
        email: authUser.email,
      })
      .from(adminProfiles)
      .innerJoin(authUser, eq(adminProfiles.authUserId, authUser.id))
      .where(eq(adminProfiles.id, principal.id))
      .limit(1);

    return ok({
      role: principal.role,
      name: row?.name || (principal.role === "owner" ? "Admin Owner" : "Editor"),
      email: row?.email || "",
      twoFactorVerified: principal.twoFactorVerified,
    });
  } catch (error) {
    return toFailure(error);
  }
}
