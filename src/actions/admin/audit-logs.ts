"use server";

import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createAuditLogStore } from "@/db/audit-log-store";
import { listAuditLogs } from "@/services/audit-logs";
import { ok, toFailure, type ActionResult } from "../result";

/** Audit history is owner-only; the service policy is checked after session verification. */
export async function listAuditLogsAction(input: unknown): Promise<ActionResult<unknown>> {
  try {
    const principal = await requireAdmin();
    return ok(await listAuditLogs(createAuditLogStore(getDb()), principal, input));
  } catch (error) {
    return toFailure(error);
  }
}
