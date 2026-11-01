"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createSettingsStore } from "@/db/site-settings-store";
import { invalidateSettingsCache } from "@/services/settings-cache";
import {
  readSettingsSection,
  updateSettingsSection,
} from "@/services/site-settings";
import { ok, toFailure, type ActionResult } from "../result";

const sectionSchema = z.enum([
  "general",
  "hero",
  "navigation",
  "seo",
  "whatsapp",
  "calculator",
  "booking",
  "tracking",
  "legal",
]);

export async function readSettingsAction(
  input: unknown,
): Promise<ActionResult<unknown>> {
  try {
    const section = sectionSchema.parse(input);
    const principal = await requireAdmin();
    const value = await readSettingsSection(
      createSettingsStore(getDb()),
      principal,
      section,
    );
    return ok(value);
  } catch (error) {
    return toFailure(error);
  }
}

/** Field-level authorization (whatsapp/tracking/booking) is enforced by the service. */
export async function updateSettingsAction(
  input: unknown,
): Promise<ActionResult<unknown>> {
  try {
    const { section, value } = z
      .object({ section: sectionSchema, value: z.unknown() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    const saved = await updateSettingsSection(
      createSettingsStore(getDb()),
      principal,
      section,
      value,
      invalidateSettingsCache,
    );
    return ok(saved);
  } catch (error) {
    return toFailure(error);
  }
}
