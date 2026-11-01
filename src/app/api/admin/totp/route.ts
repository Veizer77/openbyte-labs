import { z } from "zod";
import {
  completeAdminRecoveryCode,
  completeAdminTotp,
} from "@/auth/complete-totp";
import { getAuth } from "@/auth/server";
import { getDb } from "@/db";
import { getEnv } from "@/env";
import { crossOriginResponse, isSameOrigin } from "@/security/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const inputSchema = z
  .object({
    method: z.enum(["totp", "recovery"]),
    code: z.string().min(6).max(32),
  })
  .strict();

/**
 * Second factor for the admin session. Only this step writes
 * `admin_session_assurances`; a password-only session is rejected everywhere.
 */
export async function POST(request: Request): Promise<Response> {
  const env = getEnv();
  if (!isSameOrigin(request, env.SITE_URL)) return crossOriginResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Permintaan tidak valid." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Kode verifikasi tidak valid." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const auth = getAuth();
    const db = getDb();
    const headers =
      parsed.data.method === "totp"
        ? await completeAdminTotp(auth, db, request.headers, parsed.data.code)
        : await completeAdminRecoveryCode(
            auth,
            db,
            request.headers,
            parsed.data.code,
          );
    return Response.json(
      { verified: true },
      { status: 200, headers },
    );
  } catch {
    // Never distinguish wrong code, expired challenge, and missing session.
    return Response.json(
      { error: "Kode verifikasi tidak sesuai atau sesi sudah berakhir." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
}
