import { describe, expect, it } from "vitest";
import { z } from "zod";
import { defaultCalculatorRows } from "@/seed/calculator-defaults";

describe("seed kalkulator", () => {
  it("membangun grup dan item PRD dengan ID valid serta aturan yang utuh", () => {
    const data = defaultCalculatorRows();
    expect(data.groups).toHaveLength(3);
    expect(data.items).toHaveLength(13);
    expect(
      data.groups.find((group) => group.key === "platform")?.isRequired,
    ).toBe(true);
    expect(
      data.items.find((item) => item.label === "Web Saja")?.isDefault,
    ).toBe(true);
    expect(
      data.groups.every((group) => z.uuid().safeParse(group.id).success),
    ).toBe(true);
    const groupIds = new Set(data.groups.map((group) => group.id));
    const itemIds = new Set(data.items.map((item) => item.id));
    expect(data.items.every((item) => groupIds.has(item.groupId))).toBe(true);
    expect(data.rules.length).toBeGreaterThan(0);
    expect(
      data.rules.every(
        (rule) => itemIds.has(rule.itemId) && itemIds.has(rule.relatedItemId),
      ),
    ).toBe(true);
  });
});
