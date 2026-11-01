"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createPageStore } from "@/db/page-store";
import {
  listAdminPages,
  listPageVersions,
  publishPage,
  restorePageVersion,
  savePage,
  setPageTrash,
} from "@/services/pages";
import type { ContentVersionRecord } from "@/schemas/content-versions";
import type { PageRecord } from "@/schemas/pages";
import { ok, toFailure, type ActionResult } from "../result";

const idSchema = z.uuid();

export async function listAdminPagesAction(
  input: unknown,
): Promise<ActionResult<PageRecord[]>> {
  try {
    const principal = await requireAdmin();
    return ok(await listAdminPages(createPageStore(getDb()), principal, input));
  } catch (error) {
    return toFailure(error);
  }
}

export async function savePageAction(
  input: unknown,
): Promise<ActionResult<string>> {
  try {
    const { id, value } = z
      .object({ id: idSchema.nullable(), value: z.unknown() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    return ok(await savePage(createPageStore(getDb()), principal, id, value));
  } catch (error) {
    return toFailure(error);
  }
}

export async function publishPageAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { id, publishedAt } = z
      .object({
        id: idSchema,
        publishedAt: z.iso.datetime({ offset: true }).optional(),
      })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    await publishPage(
      createPageStore(getDb()),
      principal,
      id,
      publishedAt ? { publishedAt } : {},
    );
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}

export async function setPageTrashAction(
  input: unknown,
): Promise<ActionResult<{ id: string; trashed: boolean }>> {
  try {
    const { id, trashed } = z
      .object({ id: idSchema, trashed: z.boolean() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    await setPageTrash(createPageStore(getDb()), principal, id, trashed);
    return ok({ id, trashed });
  } catch (error) {
    return toFailure(error);
  }
}

export async function listPageVersionsAction(
  input: unknown,
): Promise<ActionResult<ContentVersionRecord[]>> {
  try {
    const { id, ...options } = z
      .object({
        id: idSchema,
        limit: z.number().int().min(1).max(100).optional(),
        offset: z.number().int().min(0).max(1_000_000).optional(),
      })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    return ok(
      await listPageVersions(createPageStore(getDb()), principal, id, options),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function restorePageVersionAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { id, version } = z
      .object({ id: idSchema, version: z.number().int().positive() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    await restorePageVersion(createPageStore(getDb()), principal, id, version);
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}
