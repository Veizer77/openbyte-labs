import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  blockedDateSchema,
  type BlockedDateInput,
} from "@/schemas/blocked-date";

export interface BlockedDateTransaction {
  /** Shared with booking creation and weekly availability updates. */
  lockSchedule(): Promise<void>;
  save(id: string | null, input: BlockedDateInput): Promise<string | null>;
  remove(id: string): Promise<boolean>;
  audit(
    actorId: string,
    action: "create" | "update" | "delete",
    id: string,
  ): Promise<void>;
}
export interface BlockedDateStore {
  transaction<T>(
    callback: (tx: BlockedDateTransaction) => Promise<T>,
  ): Promise<T>;
}

export async function saveBlockedDate(
  store: BlockedDateStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
): Promise<string> {
  authorize(principal, "blocked-dates", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const value = blockedDateSchema.parse(input);
  return store.transaction(async (tx) => {
    await tx.lockSchedule();
    const savedId = await tx.save(id, value);
    if (!savedId) throw new Error("Tanggal terblokir tidak ditemukan.");
    await tx.audit(principal.id, id === null ? "create" : "update", savedId);
    return savedId;
  });
}

export async function deleteBlockedDate(
  store: BlockedDateStore,
  principal: AdminPrincipal | null,
  id: string,
): Promise<void> {
  authorize(principal, "blocked-dates", "delete");
  z.uuid().parse(id);
  await store.transaction(async (tx) => {
    await tx.lockSchedule();
    if (!(await tx.remove(id)))
      throw new Error("Tanggal terblokir tidak ditemukan.");
    await tx.audit(principal.id, "delete", id);
  });
}
