import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  availabilityRuleSchema,
  type AvailabilityRuleInput,
} from "@/schemas/availability";

export interface AvailabilityTransaction {
  /** Must lock the settings singleton, shared with booking creation. */
  lockSchedule(): Promise<void>;
  listDay(
    weekday: number,
  ): Promise<Array<AvailabilityRuleInput & { id: string }>>;
  save(id: string | null, input: AvailabilityRuleInput): Promise<string | null>;
  remove(id: string): Promise<boolean>;
  audit(
    actorId: string,
    action: "create" | "update" | "delete",
    id: string,
  ): Promise<void>;
}

export async function deleteAvailabilityRule(
  store: AvailabilityStore,
  principal: AdminPrincipal | null,
  id: string,
): Promise<void> {
  authorize(principal, "availability-rules", "delete");
  z.uuid().parse(id);
  await store.transaction(async (tx) => {
    await tx.lockSchedule();
    if (!(await tx.remove(id))) throw new Error("Jadwal tidak ditemukan.");
    await tx.audit(principal.id, "delete", id);
  });
}
export interface AvailabilityStore {
  transaction<T>(
    callback: (tx: AvailabilityTransaction) => Promise<T>,
  ): Promise<T>;
}

export async function saveAvailabilityRule(
  store: AvailabilityStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
): Promise<string> {
  authorize(principal, "availability-rules", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const rule = availabilityRuleSchema.parse(input);
  return store.transaction(async (tx) => {
    await tx.lockSchedule();
    const existing = await tx.listDay(rule.weekday);
    if (
      rule.isActive &&
      existing.some(
        (other) =>
          other.id !== id &&
          other.isActive &&
          rule.startTime < other.endTime &&
          rule.endTime > other.startTime,
      )
    ) {
      throw new Error("Rentang jadwal bertumpang tindih.");
    }
    const savedId = await tx.save(id, rule);
    if (!savedId) throw new Error("Jadwal tidak ditemukan.");
    await tx.audit(principal.id, id === null ? "create" : "update", savedId);
    return savedId;
  });
}
