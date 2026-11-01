import "server-only";
import { validateBootstrapTarget } from "@/auth/bootstrap-target";

export interface TestTargetInfo {
  uri: string;
  host: string;
  database: string;
}

function parseTarget(uri: string): { host: string; database: string } {
  const url = new URL(uri);
  return {
    host: url.hostname.toLowerCase(),
    database: decodeURIComponent(url.pathname.slice(1)),
  };
}

/**
 * A test target must be disposable, explicitly named as a test database, and
 * distinct from every other configured connection. The returned URI is for the
 * test harness only; never log or display it.
 */
export function validateTestDatabase(
  env: Record<string, string | undefined>,
): TestTargetInfo {
  const uri = env.TEST_DATABASE_URL ?? "";
  const target = validateBootstrapTarget(uri, env.TEST_DATABASE_TARGET ?? "");
  if (!/[_-]test$/i.test(target.database)) {
    throw new Error("Nama database test harus berakhiran _test atau -test.");
  }
  if (env.TEST_DATABASE_WRITE_CONFIRM !== "I_CONFIRM_ISOLATED_TEST_DATABASE") {
    throw new Error("Konfirmasi penulisan database test belum diberikan.");
  }
  const host = parseTarget(uri).host;
  for (const candidate of [
    env.DATABASE_URL,
    env.DATABASE_URI,
    env.DATABASE_URI_DIRECT,
    env.DATABASE_DIRECT_URL,
  ]) {
    if (!candidate) continue;
    let other: { host: string; database: string };
    try {
      other = parseTarget(candidate);
    } catch {
      throw new Error("Konfigurasi database lain tidak valid.");
    }
    // Port and query parameters are ignored: same host + database is the same target.
    if (other.host === host && other.database === target.database) {
      throw new Error("Target test sama dengan konfigurasi database lain.");
    }
  }
  return { uri, host, database: target.database };
}
