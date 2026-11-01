import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  OperatorInputError,
  ownerBootstrapFailure,
} from "../../scripts/lib/operator-error";

describe("pesan aman CLI owner", () => {
  it("menampilkan pesan operator yang dibuat secara eksplisit", () => {
    expect(ownerBootstrapFailure(new OperatorInputError("OWNER_BOOTSTRAP_TARGET belum diatur.")))
      .toBe("OWNER_BOOTSTRAP_TARGET belum diatur.");
  });

  it("tidak mencetak error driver, cause, atau input rahasia", () => {
    const error = new Error("postgres://user:secret@host/db", {
      cause: new Error("recovery-code-secret"),
    });
    const message = ownerBootstrapFailure(error);
    expect(message).toContain("Periksa koneksi, migrasi, dan status owner");
    expect(message).not.toContain("secret");
    expect(message).not.toContain("postgres://");
  });

  it("membedakan validasi input dari error database tanpa mencetak input", () => {
    const result = z.object({ password: z.string().min(12) })
      .safeParse({ password: "secret" });
    if (result.success) throw new Error("Input uji seharusnya ditolak.");
    const message = ownerBootstrapFailure(result.error);
    expect(message).toContain("Data owner tidak valid.");
    expect(message).toContain("12–128 karakter");
    expect(message).not.toContain("secret");
    expect(message).not.toContain("database");
  });
});
