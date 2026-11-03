"use server";

import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { requireAdmin } from "@/auth/session";
import { authorize } from "@/access/rules";
import { getDb } from "@/db";
import {
  clientProjects,
  payments,
  privateFiles,
  projectComments,
  projectDocuments,
  revisionRequests,
} from "@/db/schema/portal";
import { ok, toFailure, type ActionResult } from "../result";
import { getEnv } from "@/env";

export type AdminPrivateFile = {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  verifiedAt: Date;
  clientProjectId: string;
  projectTitle: string;
  clientName: string;
  relation: string;
};

function privateStorageReady() {
  // Dibaca lewat getEnv() agar alias R2_BUCKET_STAGING/R2_BUCKET_PRIVATE dan
  // validasi skema berlaku sama seperti jalur unggah/unduh sebenarnya.
  try {
    const env = getEnv();
    return Boolean(
      env.R2_ACCOUNT_ID &&
        env.R2_ACCESS_KEY_ID &&
        env.R2_SECRET_ACCESS_KEY &&
        env.R2_BUCKET_STAGING &&
        env.R2_BUCKET_STAGING !== env.R2_BUCKET_PUBLIC,
    );
  } catch {
    return false;
  }
}

export async function listAdminPrivateFilesAction(): Promise<
  ActionResult<{ storageReady: boolean; files: AdminPrivateFile[] }>
> {
  try {
    const principal = await requireAdmin();
    authorize(principal, "client-projects", "read");
    const db = getDb();
    const [files, documents, proofs, revisions, comments] = await Promise.all([
      db
        .select({
          id: privateFiles.id,
          filename: privateFiles.filename,
          mimeType: privateFiles.mimeType,
          sizeBytes: privateFiles.sizeBytes,
          verifiedAt: privateFiles.verifiedAt,
        })
        .from(privateFiles)
        .where(isNotNull(privateFiles.verifiedAt))
        .orderBy(desc(privateFiles.verifiedAt))
        .limit(500),
      db
        .select({ fileId: projectDocuments.fileId, projectId: clientProjects.id, projectTitle: clientProjects.projectTitle, clientName: clientProjects.clientName })
        .from(projectDocuments)
        .innerJoin(clientProjects, eq(projectDocuments.clientProjectId, clientProjects.id))
        .where(and(isNotNull(projectDocuments.fileId), isNull(clientProjects.deletedAt))),
      db
        .select({ fileId: payments.proofFileId, projectId: clientProjects.id, projectTitle: clientProjects.projectTitle, clientName: clientProjects.clientName })
        .from(payments)
        .innerJoin(clientProjects, eq(payments.clientProjectId, clientProjects.id))
        .where(and(isNotNull(payments.proofFileId), isNull(clientProjects.deletedAt))),
      db
        .select({ attachments: revisionRequests.attachments, projectId: clientProjects.id, projectTitle: clientProjects.projectTitle, clientName: clientProjects.clientName })
        .from(revisionRequests)
        .innerJoin(clientProjects, eq(revisionRequests.clientProjectId, clientProjects.id))
        .where(isNull(clientProjects.deletedAt)),
      db
        .select({ attachments: projectComments.attachments, projectId: clientProjects.id, projectTitle: clientProjects.projectTitle, clientName: clientProjects.clientName })
        .from(projectComments)
        .innerJoin(clientProjects, eq(projectComments.clientProjectId, clientProjects.id))
        .where(isNull(clientProjects.deletedAt)),
    ]);

    const relations = new Map<string, Omit<AdminPrivateFile, "id" | "filename" | "mimeType" | "sizeBytes" | "verifiedAt">>();
    for (const row of documents) if (row.fileId) relations.set(row.fileId, { clientProjectId: row.projectId, projectTitle: row.projectTitle, clientName: row.clientName, relation: "Dokumen proyek" });
    for (const row of proofs) if (row.fileId) relations.set(row.fileId, { clientProjectId: row.projectId, projectTitle: row.projectTitle, clientName: row.clientName, relation: "Bukti pembayaran" });
    for (const row of revisions) for (const attachment of row.attachments) relations.set(attachment.fileId, { clientProjectId: row.projectId, projectTitle: row.projectTitle, clientName: row.clientName, relation: "Lampiran revisi" });
    for (const row of comments) for (const attachment of row.attachments) relations.set(attachment.fileId, { clientProjectId: row.projectId, projectTitle: row.projectTitle, clientName: row.clientName, relation: "Lampiran diskusi" });

    return ok({
      storageReady: privateStorageReady(),
      files: files.flatMap((file) => {
        const relation = relations.get(file.id);
        return file.verifiedAt && relation ? [{ ...file, ...relation, verifiedAt: file.verifiedAt }] : [];
      }),
    });
  } catch (error) {
    return toFailure(error);
  }
}
