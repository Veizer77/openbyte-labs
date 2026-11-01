import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  auditLogListOptionsSchema,
  auditLogRecordSchema,
  type AuditLogListOptions,
  type AuditLogRecord,
} from "@/schemas/audit-logs";

export interface AuditLogStore {
  list(options: AuditLogListOptions): Promise<unknown[]>;
}

const secretKey = /(password|secret|token|cookie|authorization|recovery|backup.?code|credential|private.?key)/i;

function sanitize(value: unknown, depth = 0): unknown {
  if (depth > 6) return undefined;
  if (value === null || typeof value === "boolean" || typeof value === "number") return value;
  if (typeof value === "string") return value.slice(0, 2_000);
  if (Array.isArray(value)) return value.slice(0, 100).map((entry) => sanitize(entry, depth + 1));
  if (typeof value !== "object") return undefined;
  const output: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (secretKey.test(key)) continue;
    const safe = sanitize(entry, depth + 1);
    if (safe !== undefined) output[key.slice(0, 100)] = safe;
  }
  return output;
}

function sanitizeDiff(value: unknown): Record<string, unknown> | null {
  if (value === null || value === undefined) return null;
  const clean = sanitize(value);
  if (typeof clean !== "object" || clean === null || Array.isArray(clean)) return null;
  return clean as Record<string, unknown>;
}

export async function listAuditLogs(
  store: AuditLogStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<AuditLogRecord[]> {
  authorize(principal, "audit-logs", "read");
  const options = auditLogListOptionsSchema.parse(input);
  const rows = await store.list(options);
  return z.array(auditLogRecordSchema).parse(rows).map((row) => ({
    ...row,
    diff: sanitizeDiff(row.diff),
  }));
}
