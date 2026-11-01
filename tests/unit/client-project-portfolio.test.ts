import { describe, expect, it } from "vitest";
import {
  createAnonymousPortfolioDraft,
  isPortfolioConversionReady,
} from "@/lib/tracking/portfolio";

describe("client project portfolio conversion", () => {
  it("requires six completed steps and an approved final handover", () => {
    expect(isPortfolioConversionReady({
      deleted: false,
      stepStatuses: Array(6).fill("done"),
      finalHandoverApproved: true,
    })).toBe(true);
    expect(isPortfolioConversionReady({
      deleted: false,
      stepStatuses: ["done", "done", "done", "done", "done", "in_progress"],
      finalHandoverApproved: true,
    })).toBe(false);
    expect(isPortfolioConversionReady({
      deleted: false,
      stepStatuses: Array(6).fill("done"),
      finalHandoverApproved: false,
    })).toBe(false);
    expect(isPortfolioConversionReady({
      deleted: true,
      stepStatuses: Array(6).fill("done"),
      finalHandoverApproved: true,
    })).toBe(false);
  });

  it("creates a blank anonymous draft shell rather than copying client identity or content", () => {
    const draft = createAnonymousPortfolioDraft("portfolio-random-uuid", 2026);
    expect(draft).toMatchObject({
      title: "Portofolio Baru",
      slug: "portfolio-random-uuid",
      clientName: null,
      year: 2026,
      summary: "",
      contentBlocks: [],
      links: [],
      status: "draft",
      publishedAt: null,
    });
    expect(draft).not.toHaveProperty("trackingCode");
    expect(draft).not.toHaveProperty("clientWhatsapp");
    expect(draft).not.toHaveProperty("clientEmail");
  });
});
