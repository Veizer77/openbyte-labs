import { z } from "zod";

export const contentVersionRecordSchema = z
  .object({
    id: z.uuid(),
    collection: z.enum(["pages", "projects"]),
    docId: z.uuid(),
    version: z.number().int().positive(),
    snapshot: z.record(z.string(), z.unknown()),
    changeType: z.enum(["draft", "publish", "restore"]),
    actorId: z.string().nullable(),
    createdAt: z.date(),
  })
  .strict();

export const contentVersionListOptionsSchema = z
  .object({
    limit: z.number().int().min(1).max(100).default(50),
    offset: z.number().int().min(0).max(1_000_000).default(0),
  })
  .strict();

export type ContentVersionRecord = z.output<typeof contentVersionRecordSchema>;
