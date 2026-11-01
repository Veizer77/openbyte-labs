import { TrackingError } from "./errors";

export type RevisionType = "revision" | "change_request" | "bug";
export type RevisionStatus =
  | "submitted"
  | "needs_payment"
  | "accepted"
  | "in_progress"
  | "done"
  | "rejected";
export type RevisionEvent =
  | "ACCEPT"
  | "REJECT"
  | "SET_QUOTE"
  | "CLIENT_ACCEPT_QUOTE"
  | "CLIENT_REJECT_QUOTE"
  | "START"
  | "DONE";
export function initialRevisionStatus(
  type: RevisionType,
  used: number,
  included: number,
): RevisionStatus {
  return type === "bug" || (type === "revision" && used < included)
    ? "submitted"
    : "needs_payment";
}
export function nextRevisionState(
  revision: {
    status: RevisionStatus;
    type: RevisionType;
    quotedPrice: number | null;
    clientAcceptedQuoteAt: Date | null;
  },
  event: RevisionEvent,
  used: number,
  included: number,
  input: { quotedPrice?: number; adminResponse?: string } = {},
) {
  const fail = () => {
    throw new TrackingError("Transisi revisi tidak sah.");
  };
  const result = {
    status: revision.status,
    countsTowardQuota: false,
    isExtra: false,
    totalCostDelta: 0,
  };
  if (
    event === "REJECT" &&
    ["submitted", "needs_payment"].includes(revision.status)
  ) {
    if (!input.adminResponse?.trim()) return fail();
    return { ...result, status: "rejected" as const };
  }
  if (event === "CLIENT_REJECT_QUOTE" && revision.status === "needs_payment")
    return { ...result, status: "rejected" as const };
  if (event === "SET_QUOTE" && revision.status === "needs_payment") {
    if (
      input.quotedPrice === undefined ||
      !Number.isInteger(input.quotedPrice) ||
      input.quotedPrice < 0
    )
      return fail();
    return result;
  }
  if (
    event === "CLIENT_ACCEPT_QUOTE" &&
    revision.status === "needs_payment" &&
    revision.quotedPrice !== null
  )
    return result;
  if (event === "ACCEPT" && revision.status === "submitted") {
    if (revision.type === "bug")
      return { ...result, status: "accepted" as const };
    if (revision.type === "revision")
      return used < included
        ? { ...result, status: "accepted" as const, countsTowardQuota: true }
        : { ...result, status: "needs_payment" as const };
  }
  if (
    event === "ACCEPT" &&
    revision.status === "needs_payment" &&
    revision.quotedPrice !== null &&
    revision.clientAcceptedQuoteAt
  ) {
    return {
      ...result,
      status: "accepted" as const,
      isExtra: true,
      totalCostDelta: revision.quotedPrice,
    };
  }
  if (event === "START" && revision.status === "accepted")
    return { ...result, status: "in_progress" as const };
  if (event === "DONE" && revision.status === "in_progress")
    return { ...result, status: "done" as const };
  return fail();
}
