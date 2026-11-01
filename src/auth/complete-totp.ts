import "server-only";
import { z } from "zod";
import { AccessDeniedError } from "@/access/rules";
import type { Database } from "@/db/connection";
import type { createAdminAuth } from "./configuration";
import { recordSessionAssurance } from "./session-assurance";

/**
 * Only completes a Better Auth sign-in challenge. Enrollment and account reset
 * require separate, rate-limited flows; this function is not an HTTP endpoint.
 */
export async function completeAdminTotp(
  auth: ReturnType<typeof createAdminAuth>,
  db: Database,
  headers: Headers,
  input: unknown,
): Promise<Headers> {
  const code = z
    .string()
    .regex(/^\d{6}$/)
    .parse(input);
  if (
    await auth.api.getSession({ headers, query: { disableCookieCache: true } })
  ) {
    throw new AccessDeniedError();
  }

  const result = await auth.api.verifyTOTP({
    headers,
    body: { code, trustDevice: false },
    returnHeaders: true,
  });
  await recordSessionAssurance(db, {
    token: result.response.token,
    userId: result.response.user.id,
    method: "totp",
  });
  return result.headers;
}

/** A recovery code is single-use; never log or return it. */
export async function completeAdminRecoveryCode(
  auth: ReturnType<typeof createAdminAuth>,
  db: Database,
  headers: Headers,
  input: unknown,
): Promise<Headers> {
  const code = z
    .string()
    .regex(/^[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}$/)
    .parse(input);
  if (
    await auth.api.getSession({ headers, query: { disableCookieCache: true } })
  )
    throw new AccessDeniedError();
  const result = await auth.api.verifyBackupCode({
    headers,
    body: { code, trustDevice: false, disableSession: false },
    returnHeaders: true,
  });
  await recordSessionAssurance(db, {
    token: result.response.token,
    userId: result.response.user.id,
    method: "recovery_code",
  });
  return result.headers;
}
