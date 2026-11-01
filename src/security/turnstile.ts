import "server-only";
import { z } from "zod";

const requestSchema = z
  .object({
    token: z.string().min(1).max(2048),
    secret: z.string().min(1).max(1024),
    expectedHostname: z
      .string()
      .min(1)
      .max(253)
      .regex(/^[a-z0-9.-]+$/i),
    expectedAction: z
      .string()
      .min(1)
      .max(32)
      .regex(/^[a-z0-9_-]+$/i),
    honeypot: z.string().max(200),
  })
  .strict();
const responseSchema = z
  .object({
    success: z.literal(true),
    hostname: z.string(),
    action: z.string(),
  })
  .passthrough();

/** The secret and expected hostname/action are server configuration, never request fields. */
export async function verifyTurnstile(
  input: z.input<typeof requestSchema>,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success || parsed.data.honeypot !== "") return false;
  const { token, secret, expectedHostname, expectedAction } = parsed.data;
  try {
    const response = await fetcher(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
        signal: AbortSignal.timeout(5_000),
        redirect: "error",
        cache: "no-store",
      },
    );
    if (!response.ok) return false;
    const result = responseSchema.safeParse(await response.json());
    return (
      result.success &&
      result.data.hostname.toLowerCase() === expectedHostname.toLowerCase() &&
      result.data.action === expectedAction
    );
  } catch {
    return false;
  }
}
