import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const directories: string[] = [];
const helper = pathToFileURL(
  fileURLToPath(new URL("../../scripts/lib/load-local-env.ts", import.meta.url)),
).href;

afterEach(() => {
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

function runLoader(
  files: Record<string, string>,
  environment: Record<string, string> = {},
) {
  const directory = mkdtempSync(join(tmpdir(), "openbyte-env-test-"));
  directories.push(directory);
  for (const [filename, contents] of Object.entries(files))
    writeFileSync(join(directory, filename), contents);
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: "development" };
  Object.assign(env, environment);
  delete env.__NEXT_PROCESSED_ENV;
  for (const key of Object.keys(env))
    if (key.startsWith("OB_ENV_TEST_") && !(key in environment)) delete env[key];
  // Node 22 + tsx menyajikan berkas .ts yang diimpor dari eval ESM sebagai
  // CommonJS (namespace hanya `default`), sehingga named import gagal.
  // Namespace import + fallback default bekerja pada kedua bentuk modul.
  return spawnSync(
    process.execPath,
    [
      "--import", "tsx", "--input-type=module", "-e",
      `import * as envModule from ${JSON.stringify(helper)};
       const loadLocalEnv = envModule.loadLocalEnv ?? envModule.default?.loadLocalEnv;
       if (typeof loadLocalEnv !== "function") throw new Error("loadLocalEnv tidak tersedia.");
       try {
         loadLocalEnv(${JSON.stringify(directory)});
         console.log(JSON.stringify({
           value: process.env.OB_ENV_TEST_VALUE,
           base: process.env.OB_ENV_TEST_BASE,
           expanded: process.env.OB_ENV_TEST_EXPANDED,
         }));
       } catch (error) { console.error(error.message); process.exitCode = 1; }`,
    ],
    { env, encoding: "utf8", timeout: 20_000 },
  );
}

describe("environment skrip operator mengikuti Next.js", () => {
  it("membaca .env meskipun .env.local hanya berisi variabel lain", () => {
    const result = runLoader({
      ".env": "OB_ENV_TEST_BASE=from-env\nOB_ENV_TEST_EXPANDED=$OB_ENV_TEST_BASE/suffix\n",
      ".env.local": "OB_ENV_TEST_VALUE=from-local\n",
    });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({
      base: "from-env", expanded: "from-env/suffix", value: "from-local",
    });
  }, 30_000);

  it("memprioritaskan shell lalu environment-local, local, environment, dan .env", () => {
    const files = {
      ".env": "OB_ENV_TEST_VALUE=base\n",
      ".env.development": "OB_ENV_TEST_VALUE=development\n",
      ".env.local": "OB_ENV_TEST_VALUE=local\n",
      ".env.development.local": "OB_ENV_TEST_VALUE=development-local\n",
    };
    expect(JSON.parse(runLoader(files).stdout).value).toBe("development-local");
    expect(JSON.parse(runLoader(files, { OB_ENV_TEST_VALUE: "shell" }).stdout).value).toBe("shell");
    delete (files as Partial<typeof files>)[".env.development.local"];
    expect(JSON.parse(runLoader(files).stdout).value).toBe("local");
    delete (files as Partial<typeof files>)[".env.local"];
    expect(JSON.parse(runLoader(files).stdout).value).toBe("development");
  }, 30_000);

  it("memakai environment production dan mengabaikan .env.local pada test", () => {
    const files = {
      ".env": "OB_ENV_TEST_VALUE=base\n",
      ".env.local": "OB_ENV_TEST_VALUE=local\n",
      ".env.production.local": "OB_ENV_TEST_VALUE=production-local\n",
      ".env.test": "OB_ENV_TEST_VALUE=test\n",
    };
    expect(JSON.parse(runLoader(files, { NODE_ENV: "production" }).stdout).value).toBe("production-local");
    expect(JSON.parse(runLoader(files, { NODE_ENV: "test" }).stdout).value).toBe("test");
  }, 30_000);

  it("merahasiakan isi file saat ekspansi env gagal", () => {
    const result = runLoader({
      ".env": "OB_ENV_TEST_VALUE=$OB_ENV_TEST_VALUE\nOB_ENV_TEST_BASE=secret-do-not-print\n",
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Konfigurasi environment gagal dibaca.");
    expect(result.stderr + result.stdout).not.toContain("secret-do-not-print");
  }, 30_000);
});
