import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { it, expect } from "vitest";
import { encryptBackup, decryptBackup } from "../../scripts/lib/backup-crypto";

it("authenticates encrypted backup contents and rejects tampering or a wrong key", async () => {
  const folder = await mkdtemp(join(tmpdir(), "openbyte-backup-test-"));
  try {
    const source = join(folder, "source"); const encrypted = join(folder, "encrypted"); const output = join(folder, "output");
    const secret = "test-backup-secret-at-least-32-characters";
    await writeFile(source, "test-only database dump");
    await encryptBackup(source, encrypted, secret);
    expect((await readFile(encrypted)).includes(Buffer.from("test-only"))).toBe(false);
    await decryptBackup(encrypted, output, secret);
    expect(await readFile(output, "utf8")).toBe("test-only database dump");
    await expect(decryptBackup(encrypted, join(folder, "bad-key"), "wrong-backup-secret-at-least-32-characters")).rejects.toThrow();
    const bytes = await readFile(encrypted); bytes[37] ^= 1; await writeFile(encrypted, bytes);
    await expect(decryptBackup(encrypted, join(folder, "tampered"), secret)).rejects.toThrow();
  } finally { await rm(folder, { recursive: true, force: true }); }
});
