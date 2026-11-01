import { spawn } from "node:child_process";

export function postgresCommand(binary: string, args: string[], uri: string): Promise<void> {
  const url = new URL(uri);
  if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new Error("Invalid PostgreSQL URL.");
  const env = {
    PATH: process.env.PATH, Path: process.env.Path, SYSTEMROOT: process.env.SYSTEMROOT,
    HOME: process.env.HOME, USERPROFILE: process.env.USERPROFILE,
    PGHOST: url.hostname, PGPORT: url.port || "5432",
    PGUSER: decodeURIComponent(url.username), PGPASSWORD: decodeURIComponent(url.password),
    PGDATABASE: decodeURIComponent(url.pathname.slice(1)),
    PGSSLMODE: url.searchParams.get("sslmode") || "require",
    PGCONNECT_TIMEOUT: "15",
  };
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { env, stdio: "ignore", windowsHide: true });
    child.once("error", () => reject(new Error("PostgreSQL client unavailable.")));
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error("PostgreSQL command failed; diagnostics withheld.")));
  });
}
