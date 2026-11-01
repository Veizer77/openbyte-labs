import { getAuth } from "@/auth/server";
import { getEnv } from "@/env";
import { crossOriginResponse, isSameOrigin } from "@/security/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Clears the admin session cookie, then sends the browser back to the login
 * page. The generic Better Auth transport stays read-only, so this is the only
 * HTTP sign-out path.
 */
export async function POST(request: Request): Promise<Response> {
  const env = getEnv();
  if (!isSameOrigin(request, env.SITE_URL)) return crossOriginResponse();

  const { headers } = await getAuth().api.signOut({
    headers: request.headers,
    returnHeaders: true,
  });
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Location", "/admin/login");
  responseHeaders.set("Cache-Control", "no-store");
  return new Response(null, { status: 303, headers: responseHeaders });
}