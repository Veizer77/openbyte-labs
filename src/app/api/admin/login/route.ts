import { z } from "zod";
import { AdminLoginDeniedError, signInAdmin } from "@/auth/admin-login";
import { getAuth } from "@/auth/server";
import { getLoginDb } from "@/db";
import { createAdminLoginStore } from "@/db/admin-login-store";
import { getEnv } from "@/env";
import { crossOriginResponse, isSameOrigin } from "@/security/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const inputSchema = z
  .object({
    email: z.email().max(254),
    password: z.string().min(1).max(128),
  })
  .strict();

/**
 * Password step of the admin login. Applies the 5-failures/15-minutes lockout
 * and returns Better Auth cookies, including the short-lived 2FA challenge.
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
      { error: "Email atau kata sandi tidak valid." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const auth = getAuth();
    const result = await signInAdmin(
      createAdminLoginStore(getLoginDb()),
      parsed.data,
      env.BETTER_AUTH_SECRET,
      async (email, password) => {
        const response = await auth.api.signInEmail({
          body: { email, password },
          headers: request.headers,
          returnHeaders: true,
        });
        const payload = response.response as { twoFactorRedirect?: boolean };
        return {
          headers: response.headers,
          requiresTwoFactor: payload.twoFactorRedirect === true,
        };
      },
    );
    return Response.json(
      { requiresTwoFactor: result.requiresTwoFactor },
      { status: 200, headers: result.headers },
    );
  } catch (error) {
    if (error instanceof AdminLoginDeniedError) {
      return Response.json(
        { error: error.message },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }
    console.error("[admin-login] unexpected authentication failure; sensitive diagnostics withheld");
    return Response.json(
      { error: "Login tidak dapat diproses." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
