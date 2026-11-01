import { describe, expect, it, vi } from "vitest";
import {
  signInAdmin,
  type AdminLoginStore,
  type AdminLoginTransaction,
} from "@/auth/admin-login";

class MemoryLoginStore implements AdminLoginStore {
  now = 0;
  failures: number[] = [];
  lockedUntil = 0;
  keys: string[] = [];
  private tail: Promise<void> = Promise.resolve();

  async transaction<T>(
    keyHash: string,
    callback: (tx: AdminLoginTransaction) => Promise<T>,
  ): Promise<T> {
    this.keys.push(keyHash);
    const previous = this.tail;
    let release!: () => void;
    this.tail = new Promise<void>((resolve) => {
      release = resolve;
    });
    await previous;
    try {
      return await callback({
        isLocked: async () => this.lockedUntil > this.now,
        pruneFailures: async () => {
          this.failures = this.failures.filter(
            (time) => time > this.now - 900_000,
          );
        },
        countFailures: async () => this.failures.length,
        recordFailure: async () => {
          this.failures.push(this.now);
        },
        lock: async () => {
          this.lockedUntil = this.now + 900_000;
        },
      });
    } finally {
      release();
    }
  }
}
const secret = "long-test-secret-only-for-login-rate-limits";
const input = { email: "OWNER@EXAMPLE.TEST", password: "test-password-123" };
const wrong = () => Promise.reject({ statusCode: 401 });
const success = () =>
  Promise.resolve({ headers: new Headers(), requiresTwoFactor: true });

describe("batas kegagalan login admin", () => {
  it("mengunci setelah lima kegagalan, bahkan jika password berikutnya benar", async () => {
    const store = new MemoryLoginStore();
    const verify = vi.fn(wrong);
    for (let attempt = 0; attempt < 5; attempt++)
      await expect(signInAdmin(store, input, secret, verify)).rejects.toThrow(
        "Login tidak berhasil",
      );
    const correct = vi.fn(success);
    await expect(signInAdmin(store, input, secret, correct)).rejects.toThrow(
      "Login tidak berhasil",
    );
    expect(correct).not.toHaveBeenCalled();
    expect(store.failures).toHaveLength(5);
    expect(store.keys[0]).toMatch(/^[a-f0-9]{64}$/);
    expect(store.keys[0]).not.toContain("owner");
    expect(verify).toHaveBeenCalledWith("owner@example.test", input.password);
    store.now = 900_001;
    await expect(
      signInAdmin(store, input, secret, correct),
    ).resolves.toMatchObject({ requiresTwoFactor: true });
  });
  it("menghitung kegagalan dalam jendela bergulir, bukan reset tiap batas jam", async () => {
    const store = new MemoryLoginStore();
    store.now = 14 * 60_000;
    for (let attempt = 0; attempt < 4; attempt++)
      await expect(signInAdmin(store, input, secret, wrong)).rejects.toThrow();
    store.now = 16 * 60_000;
    await expect(signInAdmin(store, input, secret, wrong)).rejects.toThrow();
    expect(store.failures).toHaveLength(5);
    const verify = vi.fn(success);
    await expect(signInAdmin(store, input, secret, verify)).rejects.toThrow();
    expect(verify).not.toHaveBeenCalled();
  });
  it("membatasi permintaan paralel dan tidak menghitung error infrastruktur sebagai password salah", async () => {
    const store = new MemoryLoginStore();
    const verify = vi.fn(wrong);
    const results = await Promise.allSettled(
      Array.from({ length: 10 }, () =>
        signInAdmin(store, input, secret, verify),
      ),
    );
    expect(results.every((result) => result.status === "rejected")).toBe(true);
    expect(verify).toHaveBeenCalledTimes(5);
    const other = new MemoryLoginStore();
    await expect(
      signInAdmin(other, input, secret, async () => {
        throw new Error("database unavailable");
      }),
    ).rejects.toThrow("database unavailable");
    expect(other.failures).toHaveLength(0);
  });
});
