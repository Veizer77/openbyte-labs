import { validateTestDatabase } from "@/db/test-target";

export { validateTestDatabase };

/** Requires an explicitly approved, disposable test database; never displays the URI. */
export function requireTestDatabaseUri(
  env: Record<string, string | undefined>,
): string {
  return validateTestDatabase(env).uri;
}
