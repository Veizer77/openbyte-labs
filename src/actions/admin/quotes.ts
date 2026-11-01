"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createQuoteAdminStore } from "@/db/quote-admin-store";
import { listAdminQuotes, updateQuoteStatus } from "@/services/quote-admin";
import type { QuoteAdminDto } from "@/services/quote-admin";
import { ok, toFailure, type ActionResult } from "../result";

export async function listQuotesAction(
  input: unknown,
): Promise<ActionResult<QuoteAdminDto[]>> {
  try {
    const principal = await requireAdmin();
    return ok(
      await listAdminQuotes(createQuoteAdminStore(getDb()), principal, input),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function updateQuoteStatusAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { id, status } = z
      .object({
        id: z.uuid(),
        status: z.enum(["new", "contacted", "converted", "dropped"]),
      })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    await updateQuoteStatus(
      createQuoteAdminStore(getDb()),
      principal,
      id,
      status,
    );
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}
