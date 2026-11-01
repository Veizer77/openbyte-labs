"use server";

import { headers } from "next/headers";
import { getDb } from "@/db";
import { createQuoteStore } from "@/db/quote-store";
import { getEnv } from "@/env";
import { verifyChallenge } from "@/security/challenge";
import { clientIpHash } from "@/security/client-ip";
import { consumePublicFormBudget } from "@/security/public-form-rate-limit";
import { createQuote } from "@/services/create-quote";
import { ok, toFailure, type ActionResult } from "../result";

export type QuoteResult = Awaited<ReturnType<typeof createQuote>>;

/**
 * Public calculator quote. The selection is re-priced from the current database
 * configuration; any price sent by the browser is ignored.
 */
export async function submitQuoteAction(
  input: unknown,
): Promise<ActionResult<QuoteResult>> {
  try {
    const env = getEnv();
    const db = getDb();
    const ipHash = clientIpHash(await headers(), env);
    const data = await createQuote(input, ipHash, {
      store: createQuoteStore(db),
      verifyChallenge: (token, honeypot) =>
        verifyChallenge(env, { token, honeypot, action: "calculator" }),
      consumeBudget: (hash) => consumePublicFormBudget(db, hash),
    });
    return ok(data);
  } catch (error) {
    return toFailure(error);
  }
}
