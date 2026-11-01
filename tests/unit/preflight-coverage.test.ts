import { readFile, readdir } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  COUNTED_TABLES,
  EXPECTED_TABLES,
  REQUIRED_SEED_MARKERS,
} from "@/db/preflight-rules";

async function tablesCreatedByMigrations(): Promise<string[]> {
  const dir = "src/db/migrations";
  const files = (await readdir(dir)).filter((file) => file.endsWith(".sql"));
  const names = new Set<string>();
  for (const file of files) {
    const sql = await readFile(`${dir}/${file}`, "utf8");
    for (const match of sql.matchAll(/CREATE TABLE "([a-z_]+)"/g)) {
      names.add(match[1]);
    }
  }
  return [...names].sort();
}

describe("daftar tabel preflight", () => {
  it("selalu mencakup setiap tabel yang dibuat migrasi", async () => {
    const migrated = await tablesCreatedByMigrations();
    expect(migrated.length).toBeGreaterThan(20);
    const expected = [...EXPECTED_TABLES].sort();
    expect(expected).toEqual(migrated);
    expect(new Set(EXPECTED_TABLES).size).toBe(EXPECTED_TABLES.length);
  });
  it("hanya menghitung tabel yang benar-benar ada di daftar tabel", () => {
    for (const table of COUNTED_TABLES) {
      expect(EXPECTED_TABLES).toContain(table);
    }
  });
  it("mewajibkan marker seed yang memang ditulis modul seed", async () => {
    const sources = await Promise.all(
      [
        "src/seed/availability-store.ts",
        "src/seed/faq-store.ts",
        "src/seed/calculator-store.ts",
        "src/seed/package-store.ts",
      ].map((path) => readFile(path, "utf8")),
    );
    const markers = sources
      .flatMap((source) => [...source.matchAll(/key: "([a-z-]+-v1)"/g)])
      .map((match) => match[1])
      .sort();
    expect(markers).toEqual([...REQUIRED_SEED_MARKERS].sort());
  });
});
