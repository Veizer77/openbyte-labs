import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  serviceAddonInputSchema,
  serviceAddonRecordSchema,
  type ServiceAddonInput,
  type ServiceAddonRecord,
} from "@/schemas/service-addons";

const listOptions = z
  .object({
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
  })
  .strict();

export interface ServiceAddonStore {
  list(options: z.output<typeof listOptions> & { publicOnly: boolean }): Promise<unknown[]>;
  transaction<T>(
    callback: (tx: {
      save(id: string | null, value: ServiceAddonInput): Promise<string | null>;
      remove(id: string): Promise<boolean>;
      audit(actorId: string, action: "create" | "update" | "delete", id: string): Promise<void>;
    }) => Promise<T>,
  ): Promise<T>;
}

async function invalidate(callback: () => void | Promise<void>): Promise<void> {
  try {
    await callback();
  } catch {
    throw new Error("Add-on sudah disimpan, tetapi cache katalog belum diperbarui.");
  }
}

export async function listAdminServiceAddons(
  store: ServiceAddonStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<ServiceAddonRecord[]> {
  authorize(principal, "service-addons", "read");
  return z.array(serviceAddonRecordSchema).parse(
    await store.list({ ...listOptions.parse(input), publicOnly: false }),
  );
}

export async function listPublicServiceAddons(
  store: ServiceAddonStore,
  input: unknown,
): Promise<ServiceAddonRecord[]> {
  const rows = z.array(serviceAddonRecordSchema).parse(
    await store.list({ ...listOptions.parse(input), publicOnly: true }),
  );
  return rows.filter((row) => row.isActive);
}

export async function saveServiceAddon(
  store: ServiceAddonStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
  invalidateCache: () => void | Promise<void>,
): Promise<string> {
  authorize(principal, "service-addons", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const value = serviceAddonInputSchema.parse(input);
  const savedId = await store.transaction(async (tx) => {
    const saved = await tx.save(id, value);
    if (!saved) throw new Error("Add-on tidak ditemukan.");
    await tx.audit(principal.id, id === null ? "create" : "update", saved);
    return saved;
  });
  await invalidate(invalidateCache);
  return savedId;
}

export async function deleteServiceAddon(
  store: ServiceAddonStore,
  principal: AdminPrincipal | null,
  id: string,
  invalidateCache: () => void | Promise<void>,
): Promise<void> {
  authorize(principal, "service-addons", "delete");
  z.uuid().parse(id);
  await store.transaction(async (tx) => {
    if (!(await tx.remove(id))) throw new Error("Add-on tidak ditemukan.");
    await tx.audit(principal.id, "delete", id);
  });
  await invalidate(invalidateCache);
}
