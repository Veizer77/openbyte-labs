import { ZodError } from "zod";
import { AccessDeniedError } from "@/access/rules";
import { EnrollmentError, confirmTotpEnrollment } from "@/auth/enroll-totp";
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
 * Confirms the first TOTP code, marks the factor verified, and records MFA
 * assurance for this session. The refreshed session cookie is returned.
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
    const headers = await confirmTotpEnrollment(
      getAuth(),
      db,
      request.headers,
      body,
    );
    const responseHeaders = new Headers(headers);
    responseHeaders.set("Cache-Control", "no-store");
    return Response.json(
      { verified: true },
      { status: 200, headers: responseHeaders },
    );
  } catch (error) {
    if (error instanceof AccessDeniedError)
      return json({ error: "Sesi tidak valid atau kode tidak sesuai." }, 401);
    if (error instanceof EnrollmentError)
      return json({ error: error.message }, 409);
    if (error instanceof ZodError)
      return json({ error: "Kode verifikasi tidak valid." }, 400);
    console.error("[enroll-confirm] unhandled error", error);
    return json({ error: "Verifikasi tidak dapat diproses." }, 500);
  }
}
