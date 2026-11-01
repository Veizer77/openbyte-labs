import { ZodError } from "zod";
import { AccessDeniedError } from "@/access/rules";
import { EnrollmentError, startTotpEnrollment } from "@/auth/enroll-totp";
import { getAuth } from "@/auth/server";
import { getDb } from "@/db";
import { getEnv } from "@/env";
import { consumeAuthBudget } from "@/security/auth-budget";
import { clientIpHash } from "@/security/client-ip";
import { crossOriginResponse, isSameOrigin } from "@/security/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/**
 * Issues a TOTP secret for the signed-in admin. Requires the current password,
 * so a stolen session cookie alone cannot enroll a new authenticator.
 */
export async function POST(request: Request): Promise<Response> {
  const env = getEnv();
  if (!isSameOrigin(request, env.SITE_URL)) return crossOriginResponse();

  try {
    const db = getDb();
    const ipHash = clientIpHash(request.headers, env);
    if (
      !(await consumeAuthBudget(db, {
        scope: "admin-enroll",
        ipHash,
        limit: 10,
      }))
    ) {
      return json({ error: "Terlalu banyak percobaan. Coba lagi nanti." }, 429);
    }

    const body = await request.json().catch(() => null);
    const result = await startTotpEnrollment(
      getAuth(),
      db,
      request.headers,
      body,
    );
    return json(result, 200);
  } catch (error) {
    if (error instanceof AccessDeniedError)
      return json({ error: "Sesi tidak valid." }, 401);
    if (error instanceof EnrollmentError)
      return json({ error: error.message }, 409);
    if (error instanceof ZodError)
      return json({ error: "Kata sandi tidak valid." }, 400);
    console.error("[enroll-start] unhandled error", error);
    return json({ error: "Pendaftaran tidak dapat diproses." }, 500);
  }
}
