import "server-only";
import type { Database } from "@/db/connection";
import { faqs } from "@/db/schema/faqs";
import { seedState } from "@/db/schema/seed-state";
import { defaultFaqs } from "./faq-defaults";

export async function initializeFaqs(
  db: Database,
): Promise<{
  status: "created" | "existing_faqs" | "already_initialized";
  created: number;
}> {
  return db.transaction(async (tx) => {
    const marker = await tx
      .insert(seedState)
      .values({ key: "faq-v1" })
      .onConflictDoNothing({ target: seedState.key })
      .returning({ key: seedState.key });
    if (!marker.length) return { status: "already_initialized", created: 0 };
    const existing = await tx.select({ id: faqs.id }).from(faqs).limit(1);
    if (existing.length) return { status: "existing_faqs", created: 0 };
    const inserted = await tx
      .insert(faqs)
      .values(defaultFaqs())
      .returning({ id: faqs.id });
    return { status: "created", created: inserted.length };
  });
}
