import "server-only";
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
  or,
} from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { media } from "./schema/content";
import type { MediaStore } from "@/services/media";

const mediaFields = {
  id: media.id,
  key: media.key,
  filename: media.filename,
  mimeType: media.mimeType,
  sizeBytes: media.sizeBytes,
  width: media.width,
  height: media.height,
  alt: media.alt,
  variants: media.variants,
  uploadedBy: media.uploadedBy,
  finalizedAt: media.finalizedAt,
  deletedAt: media.deletedAt,
  createdAt: media.createdAt,
  updatedAt: media.updatedAt,
};

export function createMediaStore(db: Database): MediaStore {
  return {
    async createPending(input) {
      return db.transaction(async (tx) => {
        const [row] = await tx
          .insert(media)
          .values({
            ...input,
            alt: "",
            variants: {},
          })
          .returning(mediaFields);
        if (!row) throw new Error("Metadata upload media gagal disimpan.");
        await tx.insert(auditLogs).values({
          actorId: input.uploadedBy,
          actorType: input.uploadedBy === null ? "system" : "admin",
          action: "upload",
          collection: "media",
          docId: input.id,
          summary:
            input.uploadedBy === null
              ? "Import media dimulai"
              : "Upload media dimulai",
        });
        return row;
      });
    },
    async read(id) {
      const [row] = await db
        .select(mediaFields)
        .from(media)
        .where(eq(media.id, id))
        .limit(1);
      return row ?? null;
    },
    async listFinalized(options) {
      const filters = [isNotNull(media.finalizedAt), isNull(media.deletedAt)];
      const query = options.query?.trim();
      if (query) {
        const pattern = `%${query}%`;
        filters.push(
          or(ilike(media.filename, pattern), ilike(media.alt, pattern))!,
        );
      }
      return db
        .select(mediaFields)
        .from(media)
        .where(and(...filters))
        .orderBy(desc(media.createdAt), asc(media.id))
        .limit(options.limit)
        .offset(options.offset);
    },
    async finalize(input) {
      return db.transaction(async (tx) => {
        const finalizedAt = new Date();
        const [row] = await tx
          .update(media)
          .set({
            key: input.key,
            filename: input.filename,
            mimeType: "image/webp",
            sizeBytes: input.sizeBytes,
            width: input.width,
            height: input.height,
            alt: input.alt,
            variants: input.variants,
            finalizedAt,
            updatedAt: finalizedAt,
          })
          .where(
            and(
              eq(media.id, input.id),
              eq(media.key, input.pendingKey),
              isNull(media.finalizedAt),
              isNull(media.deletedAt),
            ),
          )
          .returning(mediaFields);

        if (row) {
          await tx.insert(auditLogs).values({
            actorId: input.actorId,
            actorType: input.actorId === null ? "system" : "admin",
            action: "finalize",
            collection: "media",
            docId: input.id,
            summary: "Media diverifikasi dan difinalisasi",
          });
          return row;
        }

        // A second concurrent finalizer can safely return the winner's record.
        const [existing] = await tx
          .select(mediaFields)
          .from(media)
          .where(eq(media.id, input.id))
          .limit(1);
        return existing?.finalizedAt && !existing.deletedAt ? existing : null;
      });
    },
  };
}
