import { describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/connection";
import { faqs } from "@/db/schema/faqs";
import { seedState } from "@/db/schema/seed-state";
import { faqInputSchema } from "@/schemas/faqs";
import { defaultFaqs } from "@/seed/faq-defaults";
import { initializeFaqs } from "@/seed/faq-store";

describe("FAQ bawaan", () => {
  it("memakai isi PRD dan tetap menonaktifkan FAQ tracking Rilis 2", () => {
    const faqs = defaultFaqs();
    expect(faqs).toHaveLength(10);
    expect(faqs.every((faq) => faqInputSchema.safeParse(faq).success)).toBe(
      true,
    );
    expect(faqs.filter((faq) => faq.isActive)).toHaveLength(9);
    expect(faqs[9]).toMatchObject({
      isActive: false,
      requiresTracking: true,
      question: "Bagaimana saya memantau progres proyek?",
    });
  });
  it("tidak mengembalikan FAQ bawaan setelah seed pertama atau menimpa konten yang ada", async () => {
    const marker = vi
      .fn()
      .mockResolvedValueOnce([{ key: "faq-v1" }])
      .mockResolvedValueOnce([]);
    const insertFaqs = vi
      .fn()
      .mockResolvedValue(Array.from({ length: 10 }, (_, id) => ({ id })));
    const existing = vi.fn().mockResolvedValue([]);
    const insert = vi.fn((table: unknown) => {
      if (table === seedState)
        return {
          values: () => ({
            onConflictDoNothing: () => ({ returning: marker }),
          }),
        };
      if (table === faqs) return { values: () => ({ returning: insertFaqs }) };
      throw new Error("Tabel tidak dikenal");
    });
    const tx = {
      insert,
      select: () => ({ from: () => ({ limit: existing }) }),
    };
    const db = {
      transaction: (callback: (value: typeof tx) => Promise<unknown>) =>
        callback(tx),
    } as unknown as Database;
    expect(await initializeFaqs(db)).toEqual({
      status: "created",
      created: 10,
    });
    expect(await initializeFaqs(db)).toEqual({
      status: "already_initialized",
      created: 0,
    });
    expect(insertFaqs).toHaveBeenCalledOnce();
    const markerAgain = vi.fn().mockResolvedValue([{ key: "faq-v1" }]);
    marker.mockImplementation(markerAgain);
    existing.mockResolvedValue([{ id: "existing" }]);
    expect(await initializeFaqs(db)).toEqual({
      status: "existing_faqs",
      created: 0,
    });
    expect(insertFaqs).toHaveBeenCalledOnce();
  });
});
