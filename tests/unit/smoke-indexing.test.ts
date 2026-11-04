import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Smoke produksi harus mengikuti status indexing, bukan mengunci asumsi
 * "selalu noindex". Saat S7 menyalakan indexing, assert noindex global akan
 * gagal padahal perilakunya benar. Tes ini menjaga kedua mode tetap valid.
 */
const src = fs.readFileSync(
  path.join(process.cwd(), "scripts/smoke-production.mjs"),
  "utf8",
);

describe("smoke-production: gerbang robots", () => {
  it("membaca SMOKE_INDEXING_ENABLED", () => {
    expect(src).toContain('process.env.SMOKE_INDEXING_ENABLED === "true"');
  });

  it("menetapkan rute privat yang selalu noindex", () => {
    expect(src).toMatch(/const alwaysNoindex = \(route\) =>/);
    expect(src).toContain("admin|tracking|api");
  });

  it("assert noindex bersyarat, bukan tanpa syarat", () => {
    // assert noindex harus berada di dalam blok if (!indexingEnabled || alwaysNoindex(...))
    const idx = src.indexOf('get("x-robots-tag")');
    expect(idx).toBeGreaterThan(-1);
    const before = src.slice(Math.max(0, idx - 400), idx);
    expect(before).toMatch(/if \(!indexingEnabled \|\| alwaysNoindex\(route\)\)/);
  });

  it("tidak lagi memaksa noindex untuk semua rute", () => {
    // pola lama: assert.match(...) langsung tanpa kondisi
    const unconditional = /^\s{2}assert\.match\(response\.headers\.get\("x-robots-tag"\)/m.test(src);
    expect(unconditional).toBe(false);
  });
});
