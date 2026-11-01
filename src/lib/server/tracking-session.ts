import "server-only";
import { cookies, headers } from "next/headers";
import { getEnv } from "@/env";
import { readTrackingSession } from "@/lib/tracking/security";
import { TrackingError } from "@/lib/tracking/errors";
import { clientIpHash } from "@/security/client-ip";
import { hashClientIp } from "@/security/client-ip-hash";

export const trackingCookieName = "openbyte_tracking";
export async function getTrackingSession() {
  return readTrackingSession(
    (await cookies()).get(trackingCookieName)?.value,
    getEnv().BETTER_AUTH_SECRET,
  );
}
/** The store checks database pinVersion, expiry, archived state and the feature flag again. */
export async function requireTrackingSession() {
  const session = await getTrackingSession();
  if (!session) throw new TrackingError();
  return session;
}
export async function trackingRequestMeta() {
  const h = await headers();
  const env = getEnv();
  const ipHash =
    env.NODE_ENV === "development" && !h.get(env.TRUSTED_IP_HEADER)
      ? hashClientIp("127.0.0.1", env.IP_HASH_SALT)
      : clientIpHash(h, env);
  return { ipHash, userAgent: h.get("user-agent") ?? "" };
}
