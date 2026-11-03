import { AccessDeniedError } from "@/access/rules";
import { quickLoginFromRequest } from "@/auth/dev-bypass";
import { buildSessionCookie } from "@/auth/dev-bypass-cookie";
import { getAuth } from "@/auth/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Development-only quick login used by the "Masuk tanpa 2FA" button.
 *
 * It is a POST so a crawler or a prefetch can never create a session, and every
 * response is `no-store`. The bypass itself is gated inside
 * `quickLoginFromRequest`; this handler only translates the outcome.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const result = await quickLoginFromRequest(request);
    const cookie = await buildSessionCookie(
      getAuth(),
      result.token,
      result.expiresAt,
    );
    return Response.json(
      { ok: true, email: result.target.email },
      {
        status: 200,
        headers: { "Cache-Control": "no-store", "Set-Cookie": cookie },
      },
    );
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      return Response.json(
        { error: "Login cepat hanya tersedia di lingkungan pengembangan." },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }
    console.error("[dev-quick-login] failed");
    return Response.json(
      { error: "Login cepat gagal diproses." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
