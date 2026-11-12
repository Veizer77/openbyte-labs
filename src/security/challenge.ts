import "server-only";
import type { ServerEnv } from "@/env";
import { verifyTurnstile } from "./turnstile";

export type ChallengeAction =
  | "inquiry"
  | "booking"
  | "calculator"
  | "tracking"
  | "store_checkout";

/**
 * Single anti-spam gate for every public form. Without a configured secret the
 * challenge is skipped in development only; production requires Turnstile.
 */
export async function verifyChallenge(
  env: ServerEnv,
  input: { token: string; honeypot: string; action: ChallengeAction },
): Promise<boolean> {
  if (input.honeypot !== "") return false;
  if (!env.TURNSTILE_SECRET_KEY) return env.NODE_ENV !== "production";
  return verifyTurnstile({
    token: input.token,
    secret: env.TURNSTILE_SECRET_KEY,
    expectedHostname: new URL(env.SITE_URL).hostname,
    expectedAction: input.action,
    honeypot: input.honeypot,
  });
}
