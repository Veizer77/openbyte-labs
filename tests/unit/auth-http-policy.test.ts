import { describe, expect, it } from "vitest";
import { isAllowedAuthHttpRequest } from "@/auth/http-policy";

describe("permukaan HTTP Better Auth", () => {
  it("hanya membuka pembacaan sesi dan menutup seluruh mutasi generik", () => {
    expect(isAllowedAuthHttpRequest("GET", "/api/auth/get-session")).toBe(true);

    for (const [method, pathname] of [
      ["POST", "/api/auth/sign-in/email"],
      ["POST", "/api/auth/sign-up/email"],
      ["POST", "/api/auth/two-factor/verify-totp"],
      ["POST", "/api/auth/two-factor/verify-backup-code"],
      ["POST", "/api/auth/two-factor/enable"],
      ["POST", "/api/auth/sign-out"],
      ["GET", "/api/auth/sign-in/email"],
      ["GET", "/api/auth/nested/get-session"],
    ]) {
      expect(isAllowedAuthHttpRequest(method, pathname)).toBe(false);
    }
  });
});
