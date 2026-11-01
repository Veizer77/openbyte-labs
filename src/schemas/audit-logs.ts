import { z } from "zod";

export const auditLogListOptionsSchema = z
  .object({
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
    collection: z.string().trim().min(1).max(80).optional(),
    action: z.string().trim().min(1).max(80).optional(),
    actorId: z.string().trim().min(1).max(100).optional(),
    from: z.iso.datetime({ offset: true }).optional().transform((value) => value ? new Date(value) : undefined),
    to: z.iso.datetime({ offset: true }).optional().transform((value) => value ? new Date(value) : undefined),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.from && value.to && value.from >= value.to)
      ctx.addIssue({ code: "custom", path: ["to"], message: "Batas akhir harus setelah batas awal." });
  });

export const auditLogRecordSchema = z
  .object({
    id: z.uuid(),
    actorId: z.string().nullable(),
    actorName: z.string().nullable(),
    actorEmail: z.email().nullable(),
    actorType: z.string().min(1).max(40),
    action: z.string().min(1).max(80),
    collection: z.string().min(1).max(80),
    docId: z.string().min(1).max(255),
    summary: z.string().min(1).max(500),
    diff: z.record(z.string(), z.unknown()).nullable(),
    ipHash: z.string().max(128).nullable(),
    createdAt: z.date(),
  })
  .strict();

export type AuditLogListOptions = z.output<typeof auditLogListOptionsSchema>;
export type AuditLogRecord = z.output<typeof auditLogRecordSchema>;
