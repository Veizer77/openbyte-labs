import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  faqInputSchema,
  faqListOptionsSchema,
  faqRecordSchema,
  type FaqInput,
} from "@/schemas/faqs";

export interface FaqRecord extends FaqInput {
  id: string;
}
export interface FaqTransaction {
  save(id: string | null, value: FaqInput): Promise<string | null>;
  remove(id: string): Promise<boolean>;
  audit(
    actorId: string,
    action: "create" | "update" | "delete",
    id: string,
  ): Promise<void>;
}
export interface FaqStore {
  list(options: {
    search?: string;
    limit: number;
    offset: number;
    activeOnly: boolean;
  }): Promise<unknown[]>;
  transaction<T>(callback: (tx: FaqTransaction) => Promise<T>): Promise<T>;
}

async function invalidate(callback: () => void | Promise<void>): Promise<void> {
  try {
    await callback();
  } catch {
    throw new Error(
      "FAQ sudah disimpan, tetapi cache belum berhasil diperbarui.",
    );
  }
}

export async function listAdminFaqs(
  store: FaqStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<FaqRecord[]> {
  authorize(principal, "faqs", "read");
  const options = faqListOptionsSchema.parse(input);
  const records = await store.list({ ...options, activeOnly: false });
  return z.array(faqRecordSchema).parse(records);
}

export async function listPublicFaqs(
  store: FaqStore,
  input: unknown,
): Promise<FaqRecord[]> {
  const options = faqListOptionsSchema.parse(input);
  const records = await store.list({ ...options, activeOnly: true });
  return z
    .array(faqRecordSchema)
    .parse(records)
    .filter((record) => record.isActive && !record.requiresTracking);
}

export async function saveFaq(
  store: FaqStore,
  principal: AdminPrincipal | null,
  id: string | null,
  input: unknown,
  invalidateCache: () => void | Promise<void>,
): Promise<string> {
  authorize(principal, "faqs", id === null ? "create" : "update");
  if (id !== null) z.uuid().parse(id);
  const value = faqInputSchema.parse(input);
  const savedId = await store.transaction(async (tx) => {
    const result = await tx.save(id, value);
    if (!result) throw new Error("FAQ tidak ditemukan.");
    await tx.audit(principal.id, id === null ? "create" : "update", result);
    return result;
  });
  await invalidate(invalidateCache);
  return savedId;
}

export async function deleteFaq(
  store: FaqStore,
  principal: AdminPrincipal | null,
  id: string,
  invalidateCache: () => void | Promise<void>,
): Promise<void> {
  authorize(principal, "faqs", "delete");
  z.uuid().parse(id);
  await store.transaction(async (tx) => {
    if (!(await tx.remove(id))) throw new Error("FAQ tidak ditemukan.");
    await tx.audit(principal.id, "delete", id);
  });
  await invalidate(invalidateCache);
}
