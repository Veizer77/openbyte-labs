import "server-only";
import { getCookies } from "better-auth/cookies";
import { makeSignature } from "better-auth/crypto";
import type { createAdminAuth } from "./configuration";

/**
 * Builds the `Set-Cookie` value Better Auth itself would emit for a session.
 *
 * Better Auth only signs session cookies from inside an endpoint context, and the
 * development quick login has no such context. Signing here keeps the exact wire
 * format (`token.signature`, URI-encoded) so `auth.api.getSession` accepts it
 * without any special case on the read path.
 */
export async function buildSessionCookie(
  auth: ReturnType<typeof createAdminAuth>,
  token: string,
  expiresAt: Date,
  now: Date = new Date(),
): Promise<string> {
  const { sessionToken } = getCookies(auth.options);
  const signature = await makeSignature(token, auth.options.secret!);
  const value = encodeURIComponent(`${token}.${signature}`);
  const maxAge = Math.max(
    0,
    Math.floor((expiresAt.getTime() - now.getTime()) / 1000),
  );
  const parts = [
    `${sessionToken.name}=${value}`,
    `Path=${sessionToken.attributes.path ?? "/"}`,
    "HttpOnly",
    `SameSite=${sessionToken.attributes.sameSite ?? "Lax"}`,
    `Max-Age=${maxAge}`,
  ];
  if (sessionToken.attributes.secure) parts.push("Secure");
  return parts.join("; ");
}
