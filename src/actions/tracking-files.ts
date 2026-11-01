"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { authorize } from "@/access/rules";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createTrackingStore } from "@/db/tracking-store";
import { privateStorage } from "@/lib/server/r2-private-storage";
import {
  requireTrackingSession,
  trackingRequestMeta,
} from "@/lib/server/tracking-session";
import { uploadInputSchema } from "@/schemas/tracking";
import { trackingFailure } from "@/lib/server/tracking-result";
import { ok } from "./result";

async function context(adminProjectId?: string, read = false) {
  if (adminProjectId !== undefined) {
    const principal = await requireAdmin();
    authorize(principal, "client-projects", read ? "read" : "update");
    return {
      projectId: z.uuid().parse(adminProjectId),
      actorId: principal.id,
      session: undefined,
    };
  }
  const session = await requireTrackingSession();
  const store = createTrackingStore(getDb());
  if (!read)
    await store.consumeBudget(session, (await trackingRequestMeta()).ipHash);
  return { projectId: session.projectId, actorId: null, session };
}
function failure(error: unknown) {
  return trackingFailure(error, "media_invalid");
}
export async function prepareTrackingUploadAction(
  input: unknown,
  adminProjectId?: string,
) {
  try {
    const ctx = await context(adminProjectId);
    const value = uploadInputSchema.parse(input);
    const storage = privateStorage();
    const key = `tracking/${ctx.projectId}/pending/${randomUUID()}`;
    const fileId = await createTrackingStore(getDb()).registerUpload(
      ctx.projectId,
      value,
      key,
      ctx.actorId,
      ctx.session,
    );
    return ok({
      fileId,
      uploadUrl: await storage.uploadUrl(key, value.mimeType),
    });
  } catch (error) {
    return failure(error);
  }
}
export async function finalizeTrackingUploadAction(
  fileId: string,
  adminProjectId?: string,
) {
  try {
    const ctx = await context(adminProjectId);
    const store = createTrackingStore(getDb());
    const file = await store.uploadFile(
      ctx.projectId,
      z.uuid().parse(fileId),
      ctx.session,
    );
    const key = await privateStorage().verifyAndMove(ctx.projectId, file);
    await store.finalizeUpload(
      ctx.projectId,
      file.id,
      key,
      file.key,
      ctx.session,
    );
    return ok({ fileId: file.id, filename: file.filename });
  } catch (error) {
    return failure(error);
  }
}
export async function downloadTrackingFileAction(
  fileId: string,
  adminProjectId?: string,
) {
  try {
    const ctx = await context(adminProjectId, true);
    const file = await createTrackingStore(getDb()).downloadFile(
      ctx.projectId,
      z.uuid().parse(fileId),
      ctx.session,
    );
    return ok({
      url: await privateStorage().downloadUrl(file.key, file.filename),
    });
  } catch (error) {
    return failure(error);
  }
}
