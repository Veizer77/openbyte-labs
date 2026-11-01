import "server-only";
import { and, asc, desc, eq, isNotNull, isNull } from "drizzle-orm";
import type { Database } from "./connection";
import { auditLogs } from "./schema/audit";
import { media, projects, testimonials } from "./schema/content";
import type { TestimonialStore } from "@/services/testimonials";

const fields = {
  id: testimonials.id,
  authorName: testimonials.authorName,
  authorRole: testimonials.authorRole,
  quote: testimonials.quote,
  photoId: testimonials.photoId,
  projectId: testimonials.projectId,
  isActive: testimonials.isActive,
  sortOrder: testimonials.sortOrder,
};

export function createTestimonialStore(db: Database): TestimonialStore {
  return {
    async list(options) {
      return db
        .select(fields)
        .from(testimonials)
        .where(options.publicOnly ? eq(testimonials.isActive, true) : undefined)
        .orderBy(asc(testimonials.sortOrder), desc(testimonials.updatedAt), asc(testimonials.id))
        .limit(options.limit)
        .offset(options.offset);
    },
    transaction: (callback) =>
      db.transaction((tx) =>
        callback({
          async ensurePhotoReady(id) {
            if (id === null) return;
            const [row] = await tx
              .select({ id: media.id })
              .from(media)
              .where(and(eq(media.id, id), isNotNull(media.finalizedAt), isNull(media.deletedAt)))
              .limit(1);
            if (!row) throw new Error("Foto testimoni belum selesai diunggah atau sudah dihapus.");
          },
          async ensureProjectAvailable(id) {
            if (id === null) return;
            const [row] = await tx
              .select({ id: projects.id })
              .from(projects)
              .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
              .limit(1);
            if (!row) throw new Error("Proyek testimoni tidak tersedia.");
          },
          async save(id, value) {
            const rows = id === null
              ? await tx.insert(testimonials).values(value).returning({ id: testimonials.id })
              : await tx.update(testimonials)
                  .set({ ...value, updatedAt: new Date() })
                  .where(eq(testimonials.id, id))
                  .returning({ id: testimonials.id });
            return rows[0]?.id ?? null;
          },
          async remove(id) {
            return (await tx.delete(testimonials).where(eq(testimonials.id, id)).returning({ id: testimonials.id })).length === 1;
          },
          async audit(actorId, action, id) {
            await tx.insert(auditLogs).values({
              actorId,
              actorType: "admin",
              action,
              collection: "testimonials",
              docId: id,
              summary: "Testimoni diperbarui",
            });
          },
        }),
      ),
  };
}
