import "server-only";
import { createAdminAuth } from "./configuration";
import { getDb } from "@/db";
import { authBaseUrl, getEnv } from "@/env";

type Auth = ReturnType<typeof createAdminAuth>;

const globalForAuth = globalThis as typeof globalThis & {
  __openbyteAuth?: Auth;
};

/**
 * Better Auth is created on first use, not at module load, so builds and unit
 * tests never need secrets or a database connection.
 */
export function getAuth(): Auth {
  if (!globalForAuth.__openbyteAuth) {
    const env = getEnv();
    globalForAuth.__openbyteAuth = createAdminAuth(getDb(), {
      baseURL: authBaseUrl(env),
      secret: env.BETTER_AUTH_SECRET,
      production: env.NODE_ENV === "production",
    });
  }
  return globalForAuth.__openbyteAuth;
}
