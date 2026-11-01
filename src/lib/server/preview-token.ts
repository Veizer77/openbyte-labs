import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const PREVIEW_COOKIE = "openbyte.preview";
export function createPreviewToken(target: string, sessionId: string, secret: string, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ target, sessionId, expires: now + 300_000 })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(`draft-preview:${payload}`).digest("base64url")}`;
}
export function verifyPreviewToken(token: string, target: string, sessionId: string, secret: string, now = Date.now()): boolean {
  try {
    if (token.length > 2048) return false;
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return false;
    const expected = createHmac("sha256", secret).update(`draft-preview:${payload}`).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return value.target === target && value.sessionId === sessionId && Number.isFinite(value.expires) && value.expires > now && value.expires <= now + 300_000;
  } catch { return false; }
}
