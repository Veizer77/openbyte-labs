"use server";

import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createMediaStore } from "@/db/media-store";
import { createR2MediaStorage } from "@/lib/server/r2-media-storage";
import {
  createMediaUpload,
  finalizeMediaUpload,
  listAdminMedia,
} from "@/services/media";
import type { MediaAsset, MediaUploadGrant } from "@/schemas/media";
import { ok, toFailure, type ActionResult } from "../result";

/** Lists finalized media assets for authenticated CMS pickers. */
export async function listMediaAction(
  input: unknown,
): Promise<ActionResult<MediaAsset[]>> {
  try {
    const principal = await requireAdmin();
    const storage = createR2MediaStorage();
    return ok(
      await listAdminMedia(
        createMediaStore(getDb()),
        storage,
        principal,
        input,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

/** Creates a short-lived signed PUT for a private R2 staging bucket. */
export async function createMediaUploadAction(
  input: unknown,
): Promise<ActionResult<MediaUploadGrant>> {
  try {
    const principal = await requireAdmin();
    const storage = createR2MediaStorage();
    return ok(
      await createMediaUpload(
        createMediaStore(getDb()),
        storage,
        principal,
        input,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

/** Verifies a staged image, writes WebP variants, and finalizes its metadata. */
export async function finalizeMediaUploadAction(
  input: unknown,
): Promise<ActionResult<MediaAsset>> {
  try {
    const principal = await requireAdmin();
    const storage = createR2MediaStorage();
    return ok(
      await finalizeMediaUpload(
        createMediaStore(getDb()),
        storage,
        principal,
        input,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}
