import { describe, expect, it, vi } from "vitest";
import type { Database } from "@/db/connection";
import { availabilityRules } from "@/db/schema/booking";
import { seedState } from "@/db/schema/seed-state";
import { initializeAvailabilityRules } from "@/seed/availability-store";

function fakeDatabase(markers: unknown[][], existing: unknown[]) {
  const markerReturning = vi.fn();
  for (const marker of markers) markerReturning.mockResolvedValueOnce(marker);
  const rulesReturning = vi
    .fn()
    .mockResolvedValue(Array.from({ length: 20 }, (_, id) => ({ id })));
  const values = vi.fn((value: unknown) => ({
    onConflictDoNothing: vi.fn(() => ({
      returning: Array.isArray(value) ? rulesReturning : markerReturning,
    })),
  }));
  const insert = vi.fn((table: unknown) => {
    void table;
    return { values };
  });
  const select = vi.fn(() => ({
    from: vi.fn(() => ({ limit: vi.fn().mockResolvedValue(existing) })),
  }));
  const db = {
    transaction: (callback: (tx: unknown) => Promise<unknown>) =>
      callback({ insert, select }),
  } as unknown as Database;
  return { db, insert, values, select };
}

describe("seed jadwal awal", () => {
  it("mencatat marker agar seed ulang tidak mengembalikan aturan yang telah diedit", async () => {
    const fake = fakeDatabase([[{ key: "availability-v1" }], []], []);
    expect(await initializeAvailabilityRules(fake.db)).toEqual({
      status: "created",
      created: 20,
    });
    expect(await initializeAvailabilityRules(fake.db)).toEqual({
      status: "already_initialized",
      created: 0,
    });
    expect(fake.insert).toHaveBeenCalledWith(seedState);
    expect(fake.insert).toHaveBeenCalledWith(availabilityRules);
    const defaults = fake.values.mock.calls.find(([value]) =>
      Array.isArray(value),
    )?.[0];
    expect(defaults).toHaveLength(20);
    expect(fake.select).toHaveBeenCalledOnce();
  });
  it("tidak mencampurkan default dengan aturan yang sudah ada", async () => {
    const fake = fakeDatabase(
      [[{ key: "availability-v1" }]],
      [{ id: "existing" }],
    );
    expect(await initializeAvailabilityRules(fake.db)).toEqual({
      status: "existing_rules",
      created: 0,
    });
    expect(fake.insert).not.toHaveBeenCalledWith(availabilityRules);
  });
});
