import "server-only";
import { headers } from "next/headers";
import type { AdminPrincipal } from "@/access/rules";
import { getDb } from "@/db";
import { requireAdminSession } from "./require-admin";
import { getAuth } from "./server";

/**
 * Single entry point for every admin Server Action and Route Handler.
 * It verifies session, per-session MFA assurance, and active profile.
 */
export async function requireAdmin(): Promise<AdminPrincipal> {
  return requireAdminSession(getAuth(), getDb(), await headers());
}

/** Returns null instead of throwing; never use for mutations. */
export async function getAdminPrincipal(): Promise<AdminPrincipal | null> {
  try {
    return await requireAdmin();
  } catch {
    return null;
  }
}
