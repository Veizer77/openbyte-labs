"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { getEnv } from "@/env";
import { createTrackingStore } from "@/db/tracking-store";
import { loginTracking, mutateClientPortal } from "@/services/tracking";
import { signTrackingSession } from "@/lib/tracking/security";
import { trackingFailure } from "@/lib/server/tracking-result";
import {
  requireTrackingSession,
  trackingCookieName,
  trackingRequestMeta,
} from "@/lib/server/tracking-session";
import { ok, type ActionResult } from "./result";

export async function trackingLoginAction(
  input: unknown,
): Promise<ActionResult<null>> {
  try {
    const env = getEnv();
    const { ipHash } = await trackingRequestMeta();
    const result = await loginTracking(
      createTrackingStore(getDb()),
      input,
      ipHash,
      env.BETTER_AUTH_SECRET,
    );
    (await cookies()).set(
      trackingCookieName,
      signTrackingSession(
        result.projectId,
        result.pinVersion,
        result.sessionMinutes,
        env.BETTER_AUTH_SECRET,
      ),
      {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: result.sessionMinutes * 60,
      },
    );
    return ok(null);
  } catch (error) {
    return trackingFailure(error, "akses_ditolak");
  }
}
export async function trackingLogoutAction(): Promise<void> {
  (await cookies()).set(trackingCookieName, "", {
    httpOnly: true,
    secure: getEnv().NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  revalidatePath("/tracking", "layout");
}
export async function trackingMutationAction(
  input: unknown,
): Promise<ActionResult<null>> {
  try {
    const session = await requireTrackingSession();
    const meta = await trackingRequestMeta();
    await mutateClientPortal(
      createTrackingStore(getDb()),
      session,
      input,
      meta.ipHash,
      meta.userAgent,
    );
    revalidatePath("/tracking/proyek");
    return ok(null);
  } catch (error) {
    return trackingFailure(error, "akses_ditolak");
  }
}
