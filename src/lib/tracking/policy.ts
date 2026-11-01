import { TrackingError } from "./errors";

export const defaultSteps = [
  "Pengumpulan Kebutuhan & Kontrak / DP",
  "Arsitektur & Desain UI/UX",
  "Coding & Integrasi Database",
  "Pengujian Fungsional & Perbaikan Bug",
  "Review Klien & Revisi",
  "Deployment & Serah Terima",
] as const;

export function derivePayment(totalCost: number, paidAmount: number) {
  return {
    paidAmount,
    balance: totalCost - paidAmount,
    paymentStatus:
      paidAmount <= 0
        ? ("unpaid" as const)
        : totalCost > 0 && paidAmount >= totalCost
          ? ("paid_off" as const)
          : ("down_payment" as const),
  };
}
export function deriveCurrentStep(
  steps: { stepNumber: number; status: string }[],
): number {
  return (
    [...steps]
      .sort((a, b) => a.stepNumber - b.stepNumber)
      .find((s) => s.status !== "done")?.stepNumber ?? 6
  );
}
export interface LoginCounter {
  count: number;
  windowStartedAt: Date;
  lockedUntil: Date | null;
}
export function nextLoginCounter(
  previous: LoginCounter | null,
  success: boolean,
  now: Date,
  max: number,
  lockMinutes: number,
): LoginCounter {
  if (previous?.lockedUntil && previous.lockedUntil > now) return previous;
  if (success) return { count: 0, windowStartedAt: now, lockedUntil: null };
  const count =
    !previous || now.getTime() - previous.windowStartedAt.getTime() >= 900_000
      ? 1
      : previous.count + 1;
  return {
    count,
    windowStartedAt: count === 1 ? now : previous!.windowStartedAt,
    lockedUntil:
      count >= max ? new Date(now.getTime() + lockMinutes * 60_000) : null,
  };
}
export function assertProjectSession(
  project:
    | {
        id: string;
        pinVersion: number;
        archivedAt: Date | null;
        deletedAt: Date | null;
      }
    | undefined,
  session: { projectId: string; pinVersion: number; expiresAt: number },
  now = Date.now(),
): void {
  if (
    !project ||
    project.id !== session.projectId ||
    project.pinVersion !== session.pinVersion ||
    project.archivedAt ||
    project.deletedAt ||
    session.expiresAt <= now
  )
    throw new TrackingError();
}

export const privateFileTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/zip",
] as const;
export function isPrivateFileContent(bytes: Uint8Array, mime: string): boolean {
  const b = Buffer.from(bytes);
  if (mime === "image/png")
    return b
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mime === "image/jpeg")
    return b[0] === 255 && b[1] === 216 && b[2] === 255;
  if (mime === "image/webp")
    return (
      b.subarray(0, 4).toString() === "RIFF" &&
      b.subarray(8, 12).toString() === "WEBP"
    );
  if (mime === "application/pdf")
    return b.subarray(0, 5).toString() === "%PDF-";
  if (mime === "application/zip")
    return (
      b[0] === 80 &&
      b[1] === 75 &&
      ((b[2] === 3 && b[3] === 4) || (b[2] === 5 && b[3] === 6))
    );
  return false;
}
