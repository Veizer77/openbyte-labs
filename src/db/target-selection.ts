/**
 * Chooses which connection an operator command may use, without ever printing it.
 *
 * - `migrate` and `owner` always use the direct connection. Owner bootstrap
 *   must never select a test database merely because test env is present.
 * - `seed` and `preflight` prefer a dedicated `TEST_DATABASE_URL`.
 *
 * PRD names the direct connection `DATABASE_URI_DIRECT`; `DATABASE_DIRECT_URL` is
 * still accepted so existing local files keep working.
 */

export type TargetRole = "migrate" | "seed" | "preflight" | "owner";

export interface SelectedTarget {
  uri: string;
  approvedTarget: string;
  source: "test" | "direct";
}

const APPROVED_VARIABLE: Record<TargetRole, string> = {
  migrate: "DATABASE_MIGRATION_TARGET",
  seed: "DATABASE_SEED_TARGET",
  preflight: "DATABASE_PREFLIGHT_TARGET",
  owner: "OWNER_BOOTSTRAP_TARGET",
};

export function directDatabaseUri(
  env: Record<string, string | undefined>,
): string {
  return env.DATABASE_URI_DIRECT ?? env.DATABASE_DIRECT_URL ?? "";
}

export interface TargetOptions {
  /**
   * Production preflight must never silently fall back to `TEST_DATABASE_URL`
   * just because a developer's `.env` happens to define one. Without this the
   * operator asks for the production database and quietly inspects the test one.
   */
  requireDirect?: boolean;
}

export function selectDatabaseTarget(
  env: Record<string, string | undefined>,
  role: TargetRole,
  options: TargetOptions = {},
): SelectedTarget {
  const testAllowed = !options.requireDirect;
  if (
    testAllowed &&
    (role === "seed" || role === "preflight") &&
    env.TEST_DATABASE_URL
  ) {
    return {
      uri: env.TEST_DATABASE_URL,
      approvedTarget: env.TEST_DATABASE_TARGET ?? "",
      source: "test",
    };
  }
  return {
    uri: directDatabaseUri(env),
    approvedTarget: env[APPROVED_VARIABLE[role]] ?? "",
    source: "direct",
  };
}
