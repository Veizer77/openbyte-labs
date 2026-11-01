import { describe, expect, it } from "vitest";
import {
  generateTrackingCode,
  generateTrackingPin,
  hashTrackingPin,
  verifyTrackingPin,
  signTrackingSession,
  readTrackingSession,
} from "@/lib/tracking/security";
import {
  assertProjectSession,
  deriveCurrentStep,
  derivePayment,
  nextLoginCounter,
  isPrivateFileContent,
} from "@/lib/tracking/policy";

const id = "11111111-1111-4111-8111-111111111111";
const secret = "tracking-test-secret-with-at-least-32-characters";
describe("tracking credentials and sessions", () => {
  it("generates unambiguous codes and six-digit PINs using the required alphabet", () => {
    const codes = Array.from({ length: 100 }, generateTrackingCode);
    expect(new Set(codes).size).toBe(100);
    for (const code of codes) expect(code).toMatch(/^PRJ-[A-HJ-NP-Z2-9]{8}$/);
    for (let i = 0; i < 100; i++)
      expect(generateTrackingPin()).toMatch(/^\d{6}$/);
  });
  it("stores salted hashes, accepts a correct PIN, and rejects unknown or malformed hashes", async () => {
    const first = await hashTrackingPin("001234");
    const second = await hashTrackingPin("001234");
    expect(first).not.toBe(second);
    expect(first).toMatch(/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/);
    expect(await verifyTrackingPin("001234", first)).toBe(true);
    expect(await verifyTrackingPin("001235", first)).toBe(false);
    expect(await verifyTrackingPin("001234")).toBe(false);
    expect(await verifyTrackingPin("001234", "broken")).toBe(false);
    await expect(hashTrackingPin("123")).rejects.toThrow();
  });
  it("signs a scoped session and rejects tampering, another secret, expiry and future sessions", () => {
    const now = 1_800_000_000_000;
    const token = signTrackingSession(id, 2, 120, secret, now);
    expect(readTrackingSession(token, secret, now)).toMatchObject({
      projectId: id,
      pinVersion: 2,
      expiresAt: now + 7_200_000,
    });
    expect(
      readTrackingSession(token, "another-32-character-secret-abcdef", now),
    ).toBeNull();
    expect(readTrackingSession(token, secret, now + 7_200_000)).toBeNull();
    expect(readTrackingSession(token, secret, now - 1)).toBeNull();
    const [payload, signature] = token.split(".");
    const changed = JSON.parse(Buffer.from(payload, "base64url").toString());
    changed.projectId = "22222222-2222-4222-8222-222222222222";
    expect(
      readTrackingSession(
        `${Buffer.from(JSON.stringify(changed)).toString("base64url")}.${signature}`,
        secret,
        now,
      ),
    ).toBeNull();
    expect(readTrackingSession(`${token}.extra`, secret, now)).toBeNull();
    expect(readTrackingSession("x".repeat(3000), secret, now)).toBeNull();
  });
  it("revokes sessions immediately on PIN rotation, archive, deletion, expiry and a different project", () => {
    const project = { id, pinVersion: 3, archivedAt: null, deletedAt: null };
    const session = { projectId: id, pinVersion: 3, expiresAt: 100 };
    expect(() => assertProjectSession(project, session, 99)).not.toThrow();
    for (const p of [
      undefined,
      { ...project, pinVersion: 4 },
      { ...project, id: "other" },
      { ...project, archivedAt: new Date() },
      { ...project, deletedAt: new Date() },
    ])
      expect(() => assertProjectSession(p, session, 99)).toThrow();
    expect(() => assertProjectSession(project, session, 100)).toThrow();
  });
});

describe("tracking rate-limit vectors F.6", () => {
  const at = (minutes: number) => new Date(minutes * 60_000);
  const failFive = () => {
    let counter = null;
    for (let i = 0; i < 5; i++)
      counter = nextLoginCounter(counter, false, at(i), 5, 15);
    return counter!;
  };
  it("L1 keeps a correct PIN locked after five failed attempts", () => {
    const counter = failFive();
    expect(counter.count).toBe(5);
    expect(counter.lockedUntil).toEqual(at(19));
    expect(nextLoginCounter(counter, true, at(5), 5, 15)).toEqual(counter);
  });
  it("L2 permits login after the lock expires", () => {
    expect(nextLoginCounter(failFive(), true, at(20), 5, 15)).toMatchObject({
      count: 0,
      lockedUntil: null,
    });
  });
  it("L3 starts a fresh window after fifteen minutes", () => {
    let counter = null;
    for (let i = 0; i < 4; i++)
      counter = nextLoginCounter(counter, false, at(i), 5, 15);
    expect(nextLoginCounter(counter, false, at(20), 5, 15)).toMatchObject({
      count: 1,
      windowStartedAt: at(20),
    });
  });
  it("L4 resets failures after a successful login", () => {
    let counter = null;
    for (let i = 0; i < 4; i++)
      counter = nextLoginCounter(counter, false, at(i), 5, 15);
    counter = nextLoginCounter(counter, true, at(4), 5, 15);
    expect(nextLoginCounter(counter, false, at(5), 5, 15).count).toBe(1);
  });
});
describe("tracking derived values and files", () => {
  it.each([
    [3500000, 0, "unpaid"],
    [3500000, 1000000, "down_payment"],
    [3500000, 3500000, "paid_off"],
    [3500000, 3600000, "paid_off"],
    [0, 0, "unpaid"],
  ])("derives payment status for %s / %s", (total, paid, status) => {
    expect(derivePayment(Number(total), Number(paid))).toMatchObject({
      paymentStatus: status,
      balance: Number(total) - Number(paid),
    });
  });
  it("uses the earliest incomplete step, not the latest completed step", () => {
    expect(
      deriveCurrentStep(
        ["done", "done", "in_progress", "pending", "pending", "pending"].map(
          (status, i) => ({ stepNumber: i + 1, status }),
        ),
      ),
    ).toBe(3);
    expect(
      deriveCurrentStep(
        ["done", "pending", "done", "done", "done", "done"].map(
          (status, i) => ({ stepNumber: i + 1, status }),
        ),
      ),
    ).toBe(2);
    expect(
      deriveCurrentStep(
        Array.from({ length: 6 }, (_, i) => ({
          stepNumber: i + 1,
          status: "done",
        })),
      ),
    ).toBe(6);
  });
  it("rejects active content disguised as an allowed attachment", () => {
    expect(
      isPrivateFileContent(
        Buffer.from("<script>alert(1)</script>"),
        "application/pdf",
      ),
    ).toBe(false);
    expect(
      isPrivateFileContent(Buffer.from("%PDF-1.7\n"), "application/pdf"),
    ).toBe(true);
    expect(
      isPrivateFileContent(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        "image/png",
      ),
    ).toBe(true);
    expect(isPrivateFileContent(Buffer.from("hello"), "application/zip")).toBe(
      false,
    );
  });
});
