import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { AccessDeniedError, type AdminPrincipal } from "@/access/rules";
import type { Database } from "@/db/connection";
import { adminProfiles } from "@/db/schema/admin-profile";
import { adminSessionAssurances } from "@/db/schema/admin-session-assurance";
import type { createAdminAuth } from "./configuration";

/** This rejects every session until a verified TOTP/recovery flow records an assurance. */
export async function requireAdminSession(
  auth: ReturnType<typeof createAdminAuth>,
  db: Database,
  headers: Headers,
): Promise<AdminPrincipal> {
  const session = await auth.api.getSession({
    headers,
    query: { disableCookieCache: true },
  });
  const now = new Date();
  if (!session?.user.twoFactorEnabled || session.session.expiresAt <= now) {
    throw new AccessDeniedError();
  }
  const [profile] = await db
    .select({ id: adminProfiles.id, role: adminProfiles.role })
    .from(adminSessionAssurances)
    .innerJoin(
      adminProfiles,
      eq(adminProfiles.id, adminSessionAssurances.adminProfileId),
    )
    .where(
      and(
        eq(adminSessionAssurances.sessionId, session.session.id),
        eq(adminProfiles.authUserId, session.user.id),
        eq(adminProfiles.isActive, true),
        gt(adminSessionAssurances.expiresAt, now),
      ),
    )
    .limit(1);
  if (!profile || (profile.role !== "owner" && profile.role !== "editor")) {
    throw new AccessDeniedError();
  }
  return { id: profile.id, role: profile.role, twoFactorVerified: true };
}
