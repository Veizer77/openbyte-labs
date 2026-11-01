import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  serviceInputSchema,
  serviceRecordSchema,
  type ServiceInput,
  type ServiceRecord,
} from "@/schemas/services";

const listOptions = z
  .object({
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
  })
  .strict();

export interface ServiceStore {
  list(options: z.output<typeof listOptions> & { publicOnly: boolean }): Promise<unknown[]>;
  transaction<T>(
    callback: (tx: {
      save(id: string | null, value: ServiceInput): Promise<string | null>;
      remove(id: string): Promise<boolean>;
      audit(actorId: string, action: "create" | "update" | "delete", id: string): Promise<void>;
    }) => Promise<T>,
  ): Promise<T>;
}

async function invalidate(callback: () => void | Promise<void>): Promise<void> {
  try {
    await callback();
  } catch {
    throw new Error("Layanan sudah disimpan, tetapi cache katalog belum diperbarui.");
  }
}

export async function listAdminServices(
  store: ServiceStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<ServiceRecord[]> {
  authorize(principal, "services", "read");
  return z.array(serviceRecordSchema).parse(
    await store.list({ ...listOptions.parse(input), publicOnly: false }),
  );
}

export async function listPublicServices(
  store: ServiceStore,
  input: unknown,
): Promise<ServiceRecord[]> {
  const rows = z.array(serviceRecordSchema).parse(
    await store.list({ ...listOptions.parse(input), publicOnly: true }),
  );
  return rows.filter((row) => row.isActive);
}

export async function saveService(
  store: ServiceStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
  invalidateCache: () => void | Promise<void>,
): Promise<string> {
  authorize(principal, "services", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const value = serviceInputSchema.parse(input);
  const savedId = await store.transaction(async (tx) => {
    const saved = await tx.save(id, value);
    if (!saved) throw new Error("Layanan tidak ditemukan.");
    await tx.audit(principal.id, id === null ? "create" : "update", saved);
    return saved;
  });
  await invalidate(invalidateCache);
  return savedId;
}

export async function deleteService(
  store: ServiceStore,
  principal: AdminPrincipal | null,
  id: string,
  invalidateCache: () => void | Promise<void>,
): Promise<void> {
  authorize(principal, "services", "delete");
  z.uuid().parse(id);
  await store.transaction(async (tx) => {
    if (!(await tx.remove(id))) throw new Error("Layanan tidak ditemukan.");
    await tx.audit(principal.id, "delete", id);
  });
  await invalidate(invalidateCache);
}
