import { describe, expect, it, vi } from "vitest";
import { verifyPassword } from "better-auth/crypto";
import {
  bootstrapInitialOwner,
  type OwnerBootstrapStore,
} from "@/auth/owner-bootstrap";

function setup(options: { claimed?: boolean; ownerExists?: boolean } = {}) {
  const claimBootstrap = vi.fn().mockResolvedValue(options.claimed ?? true);
  const hasOwner = vi.fn().mockResolvedValue(options.ownerExists ?? false);
  const insertOwner = vi.fn().mockResolvedValue("profile-1");
  const audit = vi.fn().mockResolvedValue(undefined);
  const transaction = vi.fn((callback) =>
    callback({ claimBootstrap, hasOwner, insertOwner, audit }),
  );
  return {
    store: { transaction } as OwnerBootstrapStore,
    claimBootstrap,
    hasOwner,
    insertOwner,
    audit,
    transaction,
  };
}

describe("bootstrap owner", () => {
  const input = {
    name: " Owner ",
    email: "OWNER@EXAMPLE.TEST",
    password: "temporary-test-password-123",
  };
  it("membuat identitas, password hash, profil, dan audit dalam satu kontrak transaksi", async () => {
    const ctx = setup();
    expect(await bootstrapInitialOwner(ctx.store, input)).toBe("profile-1");
    const inserted = ctx.insertOwner.mock.calls[0][0];
    expect(inserted).toMatchObject({
      name: "Owner",
      email: "owner@example.test",
    });
    expect(inserted.passwordHash).not.toBe(input.password);
    expect(
      await verifyPassword({
        hash: inserted.passwordHash,
        password: input.password,
      }),
    ).toBe(true);
    expect(ctx.audit).toHaveBeenCalledWith("profile-1");
  });
  it("menolak password pendek dan bootstrap ulang atau owner yang sudah ada", async () => {
    const invalid = setup();
    await expect(
      bootstrapInitialOwner(invalid.store, { ...input, password: "short" }),
    ).rejects.toThrow();
    expect(invalid.transaction).not.toHaveBeenCalled();
    for (const options of [{ claimed: false }, { ownerExists: true }]) {
      const ctx = setup(options);
      await expect(bootstrapInitialOwner(ctx.store, input)).rejects.toThrow(
        "Bootstrap owner sudah dilakukan",
      );
      expect(ctx.insertOwner).not.toHaveBeenCalled();
    }
  });
});
