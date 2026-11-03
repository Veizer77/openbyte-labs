import { describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/connection";
import { pages } from "@/db/schema/content";
import { seedState } from "@/db/schema/seed-state";
import { pageInputSchema } from "@/schemas/pages";
import { defaultPages } from "@/seed/page-defaults";
import { initializePages } from "@/seed/page-store";

describe("Halaman bawaan", () => {
  it("menyediakan empat halaman inti yang lolos validasi Page Builder", () => {
    const pages = defaultPages();
    expect(pages.map((page) => page.slug)).toEqual([
      "home",
      "tentang",
      "ketentuan-layanan",
      "kebijakan-privasi",
    ]);
    expect(pages.every((page) => pageInputSchema.safeParse(page).success)).toBe(
      true,
    );
    expect(
      pages.every((page) =>
        page.layout.every((block) => block.isVisible === true),
      ),
    ).toBe(true);
  });

  it("tidak memakai blok duplikat di dalam satu halaman", () => {
    for (const page of defaultPages()) {
      const ids = page.layout.map((block) => block.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("hanya memakai blok yang benar-benar dirender Page Builder", () => {
    const allowed = new Set([
      "hero",
      "servicesGrid",
      "portfolioShowcase",
      "calculator",
      "pricing",
      "testimonials",
      "faq",
      "about",
      "ctaBanner",
      "richText",
    ]);
    for (const page of defaultPages()) {
      for (const block of page.layout) expect(allowed.has(block.type)).toBe(true);
    }
  });

  it("menyemai halaman sebagai draft dan tidak menimpa konten yang ada", async () => {
    const marker = vi
      .fn()
      .mockResolvedValueOnce([{ key: "pages-v1" }])
      .mockResolvedValueOnce([]);
    const insertPages = vi
      .fn()
      .mockResolvedValue(Array.from({ length: 4 }, (_, id) => ({ id })));
    const existing = vi.fn().mockResolvedValue([]);
    const insertedValues: unknown[] = [];
    const insert = vi.fn((table: unknown) => {
      if (table === seedState)
        return {
          values: () => ({
            onConflictDoNothing: () => ({ returning: marker }),
          }),
        };
      if (table === pages)
        return {
          values: (values: unknown) => {
            insertedValues.push(values);
            return { returning: insertPages };
          },
        };
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

    expect(await initializePages(db)).toEqual({ status: "created", created: 4 });
    const rows = insertedValues[0] as Array<Record<string, unknown>>;
    expect(rows).toHaveLength(4);
    expect(rows.every((row) => row.status === "draft")).toBe(true);
    expect(rows.map((row) => row.slug)).toEqual([
      "home",
      "tentang",
      "ketentuan-layanan",
      "kebijakan-privasi",
    ]);

    expect(await initializePages(db)).toEqual({
      status: "already_initialized",
      created: 0,
    });
    expect(insertPages).toHaveBeenCalledOnce();

    const markerAgain = vi.fn().mockResolvedValue([{ key: "pages-v1" }]);
    marker.mockImplementation(markerAgain);
    existing.mockResolvedValue([{ id: "existing" }]);
    expect(await initializePages(db)).toEqual({
      status: "existing_pages",
      created: 0,
    });
    expect(insertPages).toHaveBeenCalledOnce();
  });
});
