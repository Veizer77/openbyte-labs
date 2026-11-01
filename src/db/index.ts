import "server-only";
import { createDatabase } from "./connection";
import { getEnv } from "@/env";

type Connection = ReturnType<typeof createDatabase>;

/**
 * One pooled client per process. Next.js reloads modules in development, so the
 * handle is parked on globalThis to avoid leaking pools on every edit.
 */
const globalForDb = globalThis as typeof globalThis & {
  __openbyteDb?: Connection;
  __openbyteLoginDb?: Connection;
};

export function getDb(): Connection["db"] {
  if (!globalForDb.__openbyteDb) {
    globalForDb.__openbyteDb = createDatabase(getEnv().DATABASE_URI, { max: 4 });
  }
  return globalForDb.__openbyteDb.db;
}

/**
 * Dedicated pool for the admin-login lock. The lock transaction stays open while
 * Better Auth verifies credentials on its own connection, so sharing one
 * max-1 pool would deadlock.
 */
export function getLoginDb(): Connection["db"] {
  if (!globalForDb.__openbyteLoginDb) {
    globalForDb.__openbyteLoginDb = createDatabase(getEnv().DATABASE_URI, {
      max: 2,
    });
  }
  return globalForDb.__openbyteLoginDb.db;
}

export async function closeDb(): Promise<void> {
  const connections = [globalForDb.__openbyteDb, globalForDb.__openbyteLoginDb];
  globalForDb.__openbyteDb = undefined;
  globalForDb.__openbyteLoginDb = undefined;
  await Promise.all(connections.map((connection) => connection?.close()));
}
