import { describe, expect, it } from "vitest";
import { stepTemplatesInputSchema } from "@/schemas/step-templates";

const templates = Array.from({ length: 6 }, (_, index) => ({
  stepNumber: index + 1,
  title: `Tahap ${index + 1}`,
  description: "",
  defaultMilestones: ["Brief disetujui"],
}));

describe("step template editor contract", () => {
  it("accepts exactly one template for each of the six steps regardless of input order", () => {
    expect(stepTemplatesInputSchema.safeParse([...templates].reverse()).success).toBe(true);
  });

  it("rejects missing or duplicated step numbers", () => {
    expect(stepTemplatesInputSchema.safeParse(templates.slice(1)).success).toBe(false);
    expect(stepTemplatesInputSchema.safeParse(templates.map((item, index) => index === 5 ? { ...item, stepNumber: 5 } : item)).success).toBe(false);
  });

  it("rejects empty titles and empty milestone labels", () => {
    expect(stepTemplatesInputSchema.safeParse(templates.map((item, index) => index === 0 ? { ...item, title: " " } : item)).success).toBe(false);
    expect(stepTemplatesInputSchema.safeParse(templates.map((item, index) => index === 0 ? { ...item, defaultMilestones: [" "] } : item)).success).toBe(false);
  });
});
