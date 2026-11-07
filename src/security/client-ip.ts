import "server-only";
import type { ServerEnv } from "@/env";
import { hashClientIp } from "./client-ip-hash";

/**
 * Headers that a hosting proxy overwrites itself, so their left-most value
 * cannot be forged by a client. Vercel overwrites `x-forwarded-for` and sends
 * `x-vercel-forwarded-for` / `x-real-ip` alongside it. Reading them in order
 * keeps rate limiting intact even when the configured header is missing or
 * arrives empty, instead of trusting whatever the client sent first.
 */
const PROXY_OWNED_HEADERS = ["x-vercel-forwarded-for", "x-real-ip", "x-forwarded-for"] as const;

function firstAddress(value: string | null): string {
  return value?.split(",")[0]?.trim() ?? "";
}

/**
 * Reads the client address from the proxy header named in configuration.
 * The header is only trustworthy when the hosting proxy overwrites it; see
 * docs/backend/TRANSPORT.md before changing TRUSTED_IP_HEADER.
 */
export function clientIpHash(headers: Headers, env: ServerEnv): string {
  const configured = firstAddress(headers.get(env.TRUSTED_IP_HEADER));
  if (configured) return hashClientIp(normalizeAddress(configured), env.IP_HASH_SALT);

  for (const header of PROXY_OWNED_HEADERS) {
    if (header === env.TRUSTED_IP_HEADER) continue;
    const fallback = firstAddress(headers.get(header));
    if (fallback) return hashClientIp(normalizeAddress(fallback), env.IP_HASH_SALT);
  }

  throw new Error("Alamat klien tidak tersedia.");
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
