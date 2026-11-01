import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  testimonialInputSchema,
  testimonialRecordSchema,
  type TestimonialInput,
  type TestimonialRecord,
} from "@/schemas/testimonials";

const listOptions = z
  .object({
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
  })
  .strict();

export interface TestimonialStore {
  list(options: z.output<typeof listOptions> & { publicOnly: boolean }): Promise<unknown[]>;
  transaction<T>(
    callback: (tx: {
      ensurePhotoReady(id: string | null): Promise<void>;
      ensureProjectAvailable(id: string | null): Promise<void>;
      save(id: string | null, value: TestimonialInput): Promise<string | null>;
      remove(id: string): Promise<boolean>;
      audit(actorId: string, action: "create" | "update" | "delete", id: string): Promise<void>;
    }) => Promise<T>,
  ): Promise<T>;
}

async function invalidate(callback: () => void | Promise<void>): Promise<void> {
  try {
    await callback();
  } catch {
    throw new Error("Testimoni sudah disimpan, tetapi cache katalog belum diperbarui.");
  }
}

export async function listAdminTestimonials(
  store: TestimonialStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<TestimonialRecord[]> {
  authorize(principal, "testimonials", "read");
  return z.array(testimonialRecordSchema).parse(
    await store.list({ ...listOptions.parse(input), publicOnly: false }),
  );
}

export async function listPublicTestimonials(
  store: TestimonialStore,
  input: unknown,
): Promise<TestimonialRecord[]> {
  const rows = z.array(testimonialRecordSchema).parse(
    await store.list({ ...listOptions.parse(input), publicOnly: true }),
  );
  return rows.filter((row) => row.isActive);
}

export async function saveTestimonial(
  store: TestimonialStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
  invalidateCache: () => void | Promise<void>,
): Promise<string> {
  authorize(principal, "testimonials", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const value = testimonialInputSchema.parse(input);
  const savedId = await store.transaction(async (tx) => {
    await tx.ensurePhotoReady(value.photoId);
    await tx.ensureProjectAvailable(value.projectId);
    const saved = await tx.save(id, value);
    if (!saved) throw new Error("Testimoni tidak ditemukan.");
    await tx.audit(principal.id, id === null ? "create" : "update", saved);
    return saved;
  });
  await invalidate(invalidateCache);
  return savedId;
}

export async function deleteTestimonial(
  store: TestimonialStore,
  principal: AdminPrincipal | null,
  id: string,
  invalidateCache: () => void | Promise<void>,
): Promise<void> {
  authorize(principal, "testimonials", "delete");
  z.uuid().parse(id);
  await store.transaction(async (tx) => {
    if (!(await tx.remove(id))) throw new Error("Testimoni tidak ditemukan.");
    await tx.audit(principal.id, "delete", id);
  });
  await invalidate(invalidateCache);
}
