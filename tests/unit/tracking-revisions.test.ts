import { describe, expect, it } from "vitest";
import {
  initialRevisionStatus,
  nextRevisionState,
  type RevisionType,
  type RevisionStatus,
} from "@/lib/tracking/revision";

const revision = (
  status: RevisionStatus,
  type: RevisionType = "revision",
  price: number | null = null,
  agreed = false,
) => ({
  status,
  type,
  quotedPrice: price,
  clientAcceptedQuoteAt: agreed ? new Date() : null,
});
describe("revision state machine F.4", () => {
  it.each([
    ["revision", 1, 3, "submitted"],
    ["revision", 3, 3, "needs_payment"],
    ["change_request", 0, 3, "needs_payment"],
    ["bug", 3, 3, "submitted"],
  ] as const)("SUBMIT %s %s/%s", (type, used, included, status) =>
    expect(initialRevisionStatus(type, used, included)).toBe(status),
  );
  it("R5 accepts a revision and consumes quota only upon acceptance", () => {
    expect(
      nextRevisionState(revision("submitted"), "ACCEPT", 1, 3),
    ).toMatchObject({
      status: "accepted",
      countsTowardQuota: true,
      totalCostDelta: 0,
    });
  });
  it("R6 moves a raced revision to needs_payment when quota has been consumed", () => {
    expect(
      nextRevisionState(revision("submitted"), "ACCEPT", 3, 3).status,
    ).toBe("needs_payment");
  });
  it("R7 never charges bugs or consumes their quota", () => {
    expect(
      nextRevisionState(revision("submitted", "bug"), "ACCEPT", 3, 3),
    ).toMatchObject({
      status: "accepted",
      countsTowardQuota: false,
      isExtra: false,
      totalCostDelta: 0,
    });
  });
  it("R8/R10 require a quote and explicit client agreement", () => {
    expect(() =>
      nextRevisionState(revision("needs_payment"), "ACCEPT", 3, 3),
    ).toThrow();
    expect(() =>
      nextRevisionState(
        revision("needs_payment", "revision", 250000),
        "ACCEPT",
        3,
        3,
      ),
    ).toThrow();
  });
  it("R9 charges an accepted extra once and rejects replay", () => {
    const next = nextRevisionState(
      revision("needs_payment", "revision", 250000, true),
      "ACCEPT",
      3,
      3,
    );
    expect(next).toMatchObject({
      status: "accepted",
      isExtra: true,
      countsTowardQuota: false,
      totalCostDelta: 250000,
    });
    expect(() =>
      nextRevisionState(
        revision("accepted", "revision", 250000, true),
        "ACCEPT",
        3,
        3,
      ),
    ).toThrow();
  });
  it("R11/R12 reject invalid transitions", () => {
    expect(() =>
      nextRevisionState(revision("rejected"), "START", 1, 3),
    ).toThrow();
    expect(() =>
      nextRevisionState(revision("accepted"), "DONE", 1, 3),
    ).toThrow();
  });
  it("R13/R14 allow START then DONE", () => {
    expect(nextRevisionState(revision("accepted"), "START", 1, 3).status).toBe(
      "in_progress",
    );
    expect(
      nextRevisionState(revision("in_progress"), "DONE", 1, 3).status,
    ).toBe("done");
  });
  it("requires a rejection response and rejects missing or negative quotes", () => {
    expect(() =>
      nextRevisionState(revision("submitted"), "REJECT", 1, 3),
    ).toThrow();
    expect(
      nextRevisionState(revision("submitted"), "REJECT", 1, 3, {
        adminResponse: "Hors scope",
      }).status,
    ).toBe("rejected");
    expect(() =>
      nextRevisionState(revision("needs_payment"), "SET_QUOTE", 1, 3, {
        quotedPrice: -1,
      }),
    ).toThrow();
    expect(
      nextRevisionState(revision("needs_payment"), "SET_QUOTE", 1, 3, {
        quotedPrice: 0,
      }).status,
    ).toBe("needs_payment");
    expect(() =>
      nextRevisionState(revision("needs_payment"), "CLIENT_ACCEPT_QUOTE", 1, 3),
    ).toThrow();
    expect(
      nextRevisionState(
        revision("needs_payment", "change_request", 0),
        "CLIENT_ACCEPT_QUOTE",
        1,
        3,
      ).status,
    ).toBe("needs_payment");
  });
});
