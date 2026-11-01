import "server-only";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import type { Database } from "./connection";
import { adminProfiles } from "./schema/admin-profile";
import { authUser } from "./schema/admin-identity";
import { auditLogs } from "./schema/audit";
import type { AuditLogStore } from "@/services/audit-logs";

export function createAuditLogStore(db: Database): AuditLogStore {
  return {
    async list(options) {
      const filters = [];
      if (options.collection) filters.push(eq(auditLogs.collection, options.collection));
      if (options.action) filters.push(eq(auditLogs.action, options.action));
      if (options.actorId) filters.push(eq(auditLogs.actorId, options.actorId));
      if (options.from) filters.push(gte(auditLogs.createdAt, options.from));
      if (options.to) filters.push(lte(auditLogs.createdAt, options.to));
      return db
        .select({
          id: auditLogs.id,
          actorId: auditLogs.actorId,
          actorName: authUser.name,
          actorEmail: authUser.email,
          actorType: auditLogs.actorType,
          action: auditLogs.action,
          collection: auditLogs.collection,
          docId: auditLogs.docId,
          summary: auditLogs.summary,
          diff: auditLogs.diff,
          ipHash: auditLogs.ipHash,
          createdAt: auditLogs.createdAt,
        })
        .from(auditLogs)
        .leftJoin(adminProfiles, eq(adminProfiles.id, auditLogs.actorId))
        .leftJoin(authUser, eq(authUser.id, adminProfiles.authUserId))
        .where(filters.length ? and(...filters) : undefined)
        .orderBy(desc(auditLogs.createdAt), desc(auditLogs.id))
        .limit(options.limit)
        .offset(options.offset);
    },
  };
}
