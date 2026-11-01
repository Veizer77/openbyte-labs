import "server-only";
import type { ServerEnv } from "@/env";
import { hashClientIp } from "./client-ip-hash";

/**
 * Reads the client address from the proxy header named in configuration.
 * The header is only trustworthy when the hosting proxy overwrites it; see
 * docs/backend/TRANSPORT.md before changing TRUSTED_IP_HEADER.
 */
export function clientIpHash(headers: Headers, env: ServerEnv): string {
  const raw = headers.get(env.TRUSTED_IP_HEADER);
  if (!raw) throw new Error("Alamat klien tidak tersedia.");
  const first = raw.split(",")[0]?.trim() ?? "";
  if (!first) throw new Error("Alamat klien tidak tersedia.");
  return hashClientIp(normalizeAddress(first), env.IP_HASH_SALT);
}

/** Strips the port and IPv6 brackets that proxies append to the address. */
export function normalizeAddress(value: string): string {
  const trimmed = value.trim();
  const bracketed = /^\[([^\]]+)\](?::\d{1,5})?$/.exec(trimmed);
  if (bracketed) return bracketed[1];
  const withPort = /^(\d{1,3}(?:\.\d{1,3}){3}):\d{1,5}$/.exec(trimmed);
  if (withPort) return withPort[1];
  return trimmed;
}
