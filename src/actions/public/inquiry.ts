"use server";

import { headers } from "next/headers";
import { getDb } from "@/db";
import { createInquiryStore } from "@/db/inquiry-store";
import { getEnv } from "@/env";
import { verifyChallenge } from "@/security/challenge";
import { clientIpHash } from "@/security/client-ip";
import { consumePublicFormBudget } from "@/security/public-form-rate-limit";
import { createInquiry } from "@/services/create-inquiry";
import { ok, toFailure, type ActionResult } from "../result";

export type InquiryResult = {
  reference: string;
  whatsappUrl: string | null;
};

/** Public package/contact inquiry. Package price is re-read from the database. */
export async function submitInquiryAction(
  input: unknown,
): Promise<ActionResult<InquiryResult>> {
  try {
    const env = getEnv();
    const db = getDb();
    const ipHash = clientIpHash(await headers(), env);
    const data = await createInquiry(input, ipHash, {
      store: createInquiryStore(db),
      verifyChallenge: (token, honeypot) =>
        verifyChallenge(env, { token, honeypot, action: "inquiry" }),
      consumeBudget: (hash) => consumePublicFormBudget(db, hash),
    });
    return ok(data);
  } catch (error) {
    return toFailure(error);
  }
}
