import "server-only";
import { eq } from "drizzle-orm";
import { AccessDeniedError } from "@/access/rules";
import { getAuth } from "@/auth/server";
import type { Database } from "@/db/connection";
import { authUser } from "@/db/schema/admin-identity";
import { adminProfiles } from "@/db/schema/admin-profile";
import { adminSessionAssurances } from "@/db/schema/admin-session-assurance";
import { auditLogs } from "@/db/schema/audit";
import { getEnv } from "@/env";

/**
 * Development-only shortcut that skips the TOTP challenge.
 *
 * This is not a second login implementation: the session is created by Better
 * Auth's own internal adapter and the assurance row is written with the honest
 * method `dev_bypass`. Nothing here pretends a second factor was verified, and
 * `requireAdminSession` keeps running unchanged for every request.
 *
 * Two independent gates must pass, so a production deployment cannot reach this
 * code path even when the environment is misconfigured:
 *   1. `NODE_ENV` must not be `production`;
 *   2. the operator must opt in with `DEV_ADMIN_QUICK_LOGIN=true`.
 */
export function quickLoginEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return env.NODE_ENV !== "production" && env.DEV_ADMIN_QUICK_LOGIN === "true";
}

export interface QuickLoginTarget {
  profileId: string;
  userId: string;
  email: string;
}

/** Oldest active admin, so the button always targets a real profile. */
export async function findQuickLoginTarget(
  db: Database,
): Promise<QuickLoginTarget | null> {
  const [row] = await db
    .select({
      profileId: adminProfiles.id,
      userId: authUser.id,
      email: authUser.email,
    })
    .from(adminProfiles)
    .innerJoin(authUser, eq(authUser.id, adminProfiles.authUserId))
    .where(eq(adminProfiles.isActive, true))
    .limit(1);
  return row ?? null;
}

export interface QuickLoginResult {
  target: QuickLoginTarget;
  /** Raw session token; the route handler turns it into a signed cookie. */
  token: string;
  expiresAt: Date;
}

/**
 * Creates a real Better Auth session for the given admin and records a
 * `dev_bypass` assurance so the rest of the app keeps its normal checks.
 */
export async function createQuickLoginSession(
  db: Database,
  target: QuickLoginTarget,
): Promise<QuickLoginResult> {
  const context = await getAuth().$context;
  const session = await context.internalAdapter.createSession(target.userId, false);

  await db.transaction(async (tx) => {
    await tx.insert(adminSessionAssurances).values({
      sessionId: session.id,
      adminProfileId: target.profileId,
      method: "dev_bypass",
      verifiedAt: new Date(),
      expiresAt: session.expiresAt,
    });
    await tx.insert(auditLogs).values({
      actorId: target.profileId,
      actorType: "admin",
      action: "dev-bypass-login",
      collection: "users",
      docId: target.profileId,
      summary: "Login cepat pengembangan tanpa faktor kedua",
    });
  });

  return { target, token: session.token, expiresAt: session.expiresAt };
}

/**
 * Route-handler entry point. The gates are re-checked here because a direct POST
 * can be reached without ever rendering the login page.
 */
export async function quickLoginFromRequest(
  request: Request,
): Promise<QuickLoginResult> {
  if (!quickLoginEnabled()) throw new AccessDeniedError();
  const origin = request.headers.get("origin");
  if (!origin) throw new AccessDeniedError();
  let sameOrigin = false;
  try {
    sameOrigin = new URL(origin).origin === new URL(getEnv().SITE_URL).origin;
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin) throw new AccessDeniedError();

  const { getDb } = await import("@/db");
  const db = getDb();
  const target = await findQuickLoginTarget(db);
  if (!target) throw new AccessDeniedError();
  return createQuickLoginSession(db, target);
}
