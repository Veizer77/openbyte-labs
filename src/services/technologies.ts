import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  technologyInputSchema,
  technologyRecordSchema,
  type TechnologyInput,
  type TechnologyRecord,
} from "@/schemas/technologies";

const listOptions = z
  .object({
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
  })
  .strict();

export interface TechnologyStore {
  list(options: z.output<typeof listOptions>): Promise<unknown[]>;
  transaction<T>(
    callback: (tx: {
      lockNames(): Promise<void>;
      nameTaken(name: string, exceptId: string | null): Promise<boolean>;
      save(id: string | null, value: TechnologyInput): Promise<string | null>;
      remove(id: string): Promise<boolean>;
      audit(actorId: string, action: "create" | "update" | "delete", id: string): Promise<void>;
    }) => Promise<T>,
  ): Promise<T>;
}

function isReferencedTechnology(error: unknown): boolean {
  let current = error;
  for (let depth = 0; depth < 5 && current && typeof current === "object"; depth++) {
    const value = current as { code?: unknown; constraint?: unknown; constraint_name?: unknown; cause?: unknown };
    const constraint = value.constraint ?? value.constraint_name;
    if (
      value.code === "23503" &&
      constraint === "project_technologies_technology_id_technologies_id_fk"
    ) return true;
    current = value.cause;
  }
  return false;
}

async function invalidate(callback: () => void | Promise<void>): Promise<void> {
  try {
    await callback();
  } catch {
    throw new Error("Teknologi sudah disimpan, tetapi cache katalog belum diperbarui.");
  }
}

export async function listAdminTechnologies(
  store: TechnologyStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<TechnologyRecord[]> {
  authorize(principal, "technologies", "read");
  return z.array(technologyRecordSchema).parse(await store.list(listOptions.parse(input)));
}

export async function listPublicTechnologies(
  store: TechnologyStore,
  input: unknown,
): Promise<TechnologyRecord[]> {
  return z.array(technologyRecordSchema).parse(await store.list(listOptions.parse(input)));
}

export async function saveTechnology(
  store: TechnologyStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
  invalidateCache: () => void | Promise<void>,
): Promise<string> {
  authorize(principal, "technologies", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const value = technologyInputSchema.parse(input);
  const savedId = await store.transaction(async (tx) => {
    await tx.lockNames();
    if (await tx.nameTaken(value.name, id)) throw new Error("Nama teknologi sudah digunakan.");
    const saved = await tx.save(id, value);
    if (!saved) throw new Error("Teknologi tidak ditemukan.");
    await tx.audit(principal.id, id === null ? "create" : "update", saved);
    return saved;
  });
  await invalidate(invalidateCache);
  return savedId;
}

export async function deleteTechnology(
  store: TechnologyStore,
  principal: AdminPrincipal | null,
  id: string,
  invalidateCache: () => void | Promise<void>,
): Promise<void> {
  authorize(principal, "technologies", "delete");
  z.uuid().parse(id);
  try {
    await store.transaction(async (tx) => {
      if (!(await tx.remove(id))) throw new Error("Teknologi tidak ditemukan.");
      await tx.audit(principal.id, "delete", id);
    });
  } catch (error) {
    if (isReferencedTechnology(error)) throw new Error("Teknologi masih digunakan oleh proyek.");
    throw error;
  }
  await invalidate(invalidateCache);
}
