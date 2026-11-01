import "server-only";
import {
  createHmac,
  randomBytes,
  randomInt,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { z } from "zod";

const derive = promisify(scrypt);
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const trackingSessionSchema = z
  .object({
    projectId: z.uuid(),
    pinVersion: z.number().int().positive(),
    issuedAt: z.number().int().nonnegative(),
    expiresAt: z.number().int().positive(),
    nonce: z.string().regex(/^[a-f0-9]{32}$/),
  })
  .strict();
export type TrackingSession = z.output<typeof trackingSessionSchema>;

export function generateTrackingCode(): string {
  return `PRJ-${[...randomBytes(8)].map((n) => alphabet[n % alphabet.length]).join("")}`;
}
export function generateTrackingPin(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}
export async function hashTrackingPin(pin: string): Promise<string> {
  if (!/^\d{6}$/.test(pin)) throw new Error("PIN harus 6 digit.");
  const salt = randomBytes(16).toString("hex");
  const hash = (await derive(pin, salt, 64)) as Buffer;
  return `scrypt:${salt}:${hash.toString("hex")}`;
}
export async function verifyTrackingPin(
  pin: string,
  encoded?: string,
): Promise<boolean> {
  const parts = /^scrypt:([a-f0-9]{32}):([a-f0-9]{128})$/.exec(encoded ?? "");
  // Unknown codes do the same scrypt work as existing codes.
  const salt = parts?.[1] ?? "0".repeat(32);
  const expected = Buffer.from(parts?.[2] ?? "0".repeat(128), "hex");
  const actual = (await derive(pin.slice(0, 64), salt, 64)) as Buffer;
  return timingSafeEqual(actual, expected) && !!parts && /^\d{6}$/.test(pin);
}
export function trackingKey(secret: string): Buffer {
  if (secret.length < 32) throw new Error("Secret sesi terlalu pendek.");
  return createHmac("sha256", secret)
    .update("openbyte:tracking:session:v1")
    .digest();
}
export function signTrackingSession(
  projectId: string,
  pinVersion: number,
  minutes: number,
  secret: string,
  now = Date.now(),
): string {
  const value = trackingSessionSchema.parse({
    projectId,
    pinVersion,
    issuedAt: now,
    expiresAt: now + minutes * 60_000,
    nonce: randomBytes(16).toString("hex"),
  });
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  const signature = createHmac("sha256", trackingKey(secret))
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}
export function readTrackingSession(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): TrackingSession | null {
  if (!token || token.length > 2048) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !/^[A-Za-z0-9_-]{43}$/.test(parts[1])) return null;
  const signature = createHmac("sha256", trackingKey(secret))
    .update(parts[0])
    .digest();
  const supplied = Buffer.from(parts[1], "base64url");
  if (
    signature.length !== supplied.length ||
    !timingSafeEqual(signature, supplied)
  )
    return null;
  try {
    const result = trackingSessionSchema.safeParse(
      JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8")),
    );
    if (!result.success) return null;
    const value = result.data;
    if (
      value.issuedAt > now ||
      value.expiresAt <= now ||
      value.expiresAt <= value.issuedAt ||
      value.expiresAt - value.issuedAt > 1440 * 60_000
    )
      return null;
    return value;
  } catch {
    return null;
  }
}
export function trackingRateKey(secret: string, value: string): string {
  return createHmac("sha256", trackingKey(secret))
    .update(`rate:${value}`)
    .digest("hex");
}
