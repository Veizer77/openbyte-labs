import { beforeEach, describe, expect, it, vi } from "vitest";

const { getAuth } = vi.hoisted(() => ({ getAuth: vi.fn() }));

vi.mock("@/auth/server", () => ({ getAuth }));

import { GET, POST } from "@/app/api/auth/[...all]/route";

describe("transport Better Auth generik", () => {
  beforeEach(() => getAuth.mockClear());

  it("menolak login generic sebelum membuat handler auth", async () => {
    const response = await POST(
      new Request("https://openbyte.example/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "owner@example.test", password: "wrong" }),
      }),
    );

    expect(response.status).toBe(404);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(getAuth).not.toHaveBeenCalled();
  });

  it("menolak route baca lain di luar get-session", async () => {
    const response = await GET(
      new Request("https://openbyte.example/api/auth/ok"),
    );

    expect(response.status).toBe(404);
    expect(getAuth).not.toHaveBeenCalled();
  });
});
