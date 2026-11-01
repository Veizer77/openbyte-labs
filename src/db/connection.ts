import "server-only";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { z } from "zod";

const databaseUrl = z
  .string()
  .url()
  .refine((value) => {
    try {
      return ["postgres:", "postgresql:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "DATABASE_URI harus berupa URL PostgreSQL.");

/** Created lazily so frontend preview and builds do not require a database. */
export function createDatabase(uri: string, options: { max?: number } = {}) {
  const client = postgres(databaseUrl.parse(uri), {
    max: options.max ?? 1,
    prepare: false,
    connect_timeout: 10,
  });
  return { db: drizzle(client), close: () => client.end({ timeout: 5 }) };
}

export type Database = ReturnType<typeof createDatabase>["db"];
