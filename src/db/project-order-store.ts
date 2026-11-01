import "server-only";
import { asc, eq, inArray, isNull, and } from "drizzle-orm";
import type { Database } from "./connection";
import { projects } from "./schema/content";
import { auditLogs } from "./schema/audit";
import type { ProjectOrderStore } from "@/services/project-order";

export function createProjectOrderStore(db: Database): ProjectOrderStore {
  return { reorder: (ids, actorId) => db.transaction(async (tx) => {
    const rows = await tx.select({ id: projects.id }).from(projects).where(and(inArray(projects.id, ids), isNull(projects.deletedAt))).orderBy(asc(projects.id)).for("update");
    if (rows.length !== ids.length) throw new Error("Sebagian proyek tidak tersedia. Muat ulang daftar.");
    for (const [sortOrder, id] of ids.entries()) await tx.update(projects).set({ sortOrder, updatedAt: new Date() }).where(eq(projects.id, id));
    await tx.insert(auditLogs).values({ actorId, actorType: "admin", action: "update", collection: "projects", docId: ids[0], summary: "Urutan katalog proyek diperbarui", diff: { orderedIds: ids } });
  }) };
}
