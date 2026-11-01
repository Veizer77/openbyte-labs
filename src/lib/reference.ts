import "server-only";
import { randomInt } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createReference(
  prefix: "BKG" | "INQ" | "QTE",
  now: Date,
): string {
  if (!Number.isFinite(now.getTime()))
    throw new Error("Tanggal referensi tidak valid.");
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const year = String(wib.getUTCFullYear()).slice(-2);
  const month = String(wib.getUTCMonth() + 1).padStart(2, "0");
  let random = "";
  for (let i = 0; i < 4; i++) random += ALPHABET[randomInt(ALPHABET.length)];
  return `${prefix}-${year}${month}-${random}`;
}
