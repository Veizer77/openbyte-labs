import { describe, expect, it, vi } from "vitest";
import {
  OwnerResetError,
  resetOwnerCredentials,
  type OwnerResetStore,
  type OwnerResetTransaction,
} from "@/auth/owner-reset";

function createStore(overrides: Partial<OwnerResetTransaction> = {}) {
  const calls: string[] = [];
  const tx: OwnerResetTransaction = {
    findOwner: async () => ({ profileId: "profile-1", userId: "user-1" }),
    replacePassword: async () => true,
    disableTwoFactor: async () => {
      calls.push("disable-2fa");
    },
    revokeSessions: async () => {
      calls.push("revoke-sessions");
    },
    audit: async () => {
      calls.push("audit");
    },
    ...overrides,
  };
  const store: OwnerResetStore = {
    transaction: (callback) => callback(tx),
  };
  return { store, calls, tx };
}

const hash = async (password: string) => `hashed:${password}`;
const valid = {
  email: "Owner@Example.com",
  password: "kata-sandi-baru-yang-panjang",
};

describe("reset kredensial owner", () => {
  it("mengganti kata sandi, mematikan 2FA, mencabut sesi, lalu mencatat audit", async () => {
    const replace = vi.fn(async () => true);
    const { store, calls } = createStore({ replacePassword: replace });

    const result = await resetOwnerCredentials(store, valid, hash);

    expect(result).toEqual({ profileId: "profile-1" });
    expect(replace).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        passwordHash: "hashed:kata-sandi-baru-yang-panjang",
      }),
    );
    expect(calls).toEqual(["disable-2fa", "revoke-sessions", "audit"]);
  });

  it("menormalkan email sebelum mencari owner", async () => {
    const find = vi.fn(async () => ({ profileId: "p", userId: "u" }));
    const { store } = createStore({ findOwner: find });
    await resetOwnerCredentials(store, valid, hash);
    expect(find).toHaveBeenCalledWith("owner@example.com");
  });

  it("menolak bila owner aktif tidak ditemukan", async () => {
    const { store, calls } = createStore({ findOwner: async () => null });
    await expect(resetOwnerCredentials(store, valid, hash)).rejects.toThrow(
      OwnerResetError,
    );
    expect(calls).toEqual([]);
  });

  it("menolak bila akun kredensial tidak ada", async () => {
    const { store, calls } = createStore({ replacePassword: async () => false });
    await expect(resetOwnerCredentials(store, valid, hash)).rejects.toThrow(
      /kredensial owner tidak ditemukan/i,
    );
    expect(calls).toEqual([]);
  });

  it("menolak kata sandi pendek sebelum menyentuh database", async () => {
    const find = vi.fn();
    const { store } = createStore({ findOwner: find });
    await expect(
      resetOwnerCredentials(store, { email: valid.email, password: "pendek" }, hash),
    ).rejects.toThrow();
    expect(find).not.toHaveBeenCalled();
  });
});
