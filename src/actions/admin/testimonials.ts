"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createTestimonialStore } from "@/db/testimonial-store";
import { invalidateCatalogCache } from "@/services/catalog-cache";
import {
  deleteTestimonial,
  listAdminTestimonials,
  saveTestimonial,
} from "@/services/testimonials";
import { ok, toFailure, type ActionResult } from "../result";

const idSchema = z.uuid();

export async function listTestimonialsAction(input: unknown): Promise<ActionResult<unknown>> {
  try {
    const principal = await requireAdmin();
    return ok(await listAdminTestimonials(createTestimonialStore(getDb()), principal, input));
  } catch (error) {
    return toFailure(error);
  }
}

export async function saveTestimonialAction(input: unknown): Promise<ActionResult<string>> {
  try {
    const { id, value } = z.object({ id: idSchema.nullable(), value: z.unknown() }).strict().parse(input);
    const principal = await requireAdmin();
    return ok(await saveTestimonial(createTestimonialStore(getDb()), principal, id, value, invalidateCatalogCache));
  } catch (error) {
    return toFailure(error);
  }
}

export async function deleteTestimonialAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const id = idSchema.parse(input);
    const principal = await requireAdmin();
    await deleteTestimonial(createTestimonialStore(getDb()), principal, id, invalidateCatalogCache);
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}
