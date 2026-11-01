"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createProjectStore } from "@/db/project-store";
import type { ContentVersionRecord } from "@/schemas/content-versions";
import type { ProjectRecord } from "@/schemas/projects";
import {
  listAdminProjects,
  listProjectVersions,
  publishProject,
  restoreProjectVersion,
  saveProject,
  setProjectTrash,
} from "@/services/projects";
import { ok, toFailure, type ActionResult } from "../result";
import { reorderProjects } from "@/services/project-order";
import { createProjectOrderStore } from "@/db/project-order-store";
import { revalidatePath } from "next/cache";

const idSchema = z.uuid();

export async function reorderProjectsAction(input: unknown): Promise<ActionResult<null>> {
  try {
    await reorderProjects(createProjectOrderStore(getDb()), await requireAdmin(), input);
    revalidatePath("/proyek");
    revalidatePath("/");
    return ok(null);
  } catch (error) { return toFailure(error); }
}

export async function listAdminProjectsAction(
  input: unknown,
): Promise<ActionResult<ProjectRecord[]>> {
  try {
    const principal = await requireAdmin();
    return ok(
      await listAdminProjects(createProjectStore(getDb()), principal, input),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function saveProjectAction(
  input: unknown,
): Promise<ActionResult<string>> {
  try {
    const { id, value } = z
      .object({ id: idSchema.nullable(), value: z.unknown() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    return ok(
      await saveProject(createProjectStore(getDb()), principal, id, value),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function publishProjectAction(
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
    await publishProject(
      createProjectStore(getDb()),
      principal,
      id,
      publishedAt ? { publishedAt } : {},
    );
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}

export async function setProjectTrashAction(
  input: unknown,
): Promise<ActionResult<{ id: string; trashed: boolean }>> {
  try {
    const { id, trashed } = z
      .object({ id: idSchema, trashed: z.boolean() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    await setProjectTrash(createProjectStore(getDb()), principal, id, trashed);
    return ok({ id, trashed });
  } catch (error) {
    return toFailure(error);
  }
}

export async function listProjectVersionsAction(
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
      await listProjectVersions(
        createProjectStore(getDb()),
        principal,
        id,
        options,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

export async function restoreProjectVersionAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { id, version } = z
      .object({ id: idSchema, version: z.number().int().positive() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    await restoreProjectVersion(
      createProjectStore(getDb()),
      principal,
      id,
      version,
    );
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}
