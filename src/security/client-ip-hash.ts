import "server-only";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";

/** The caller must obtain the address from an explicitly trusted proxy. */
export function hashClientIp(address: string, secret: string): string {
  if (secret.length < 32)
    throw new Error("Secret hash IP harus minimal 32 karakter.");
  const ip = address.trim();
  const version = isIP(ip);
  if (!version) throw new Error("Alamat IP tidak valid.");
  // URL canonicalization collapses alternate IPv6 spellings before rate limiting.
  let canonical =
    version === 6 ? new URL(`http://[${ip}]/`).hostname.slice(1, -1) : ip;
  const mapped = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(canonical);
  if (mapped) {
    const upper = Number.parseInt(mapped[1], 16);
    const lower = Number.parseInt(mapped[2], 16);
    canonical = [upper >> 8, upper & 255, lower >> 8, lower & 255].join(".");
  }
  return createHmac("sha256", secret)
    .update(`ip:v1:${canonical}`, "utf8")
    .digest("hex");
}
