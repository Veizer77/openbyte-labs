import "server-only";
import type { Database } from "@/db/connection";
import { createAdminLoginStore } from "@/db/admin-login-store";
import { createAdminAuth } from "./configuration";
import { signInAdmin } from "./admin-login";

/** authDb and lockDb must use separate connection pools to avoid a lock/pool deadlock. */
export function createAdminLogin(
  authDb: Database,
  lockDb: Database,
  config: Parameters<typeof createAdminAuth>[1],
  hashSecret: string,
) {
  if (authDb === lockDb)
    throw new Error("Auth dan lock login harus memakai pool terpisah.");
  const auth = createAdminAuth(authDb, config);
  const store = createAdminLoginStore(lockDb);
  return {
    auth,
    login: (headers: Headers, input: unknown) =>
      signInAdmin(store, input, hashSecret, async (email, password) => {
        const result = await auth.api.signInEmail({
          headers,
          body: { email, password, rememberMe: false },
          returnHeaders: true,
        });
        return {
          headers: result.headers,
          requiresTwoFactor:
            "twoFactorRedirect" in result.response &&
            result.response.twoFactorRedirect === true,
        };
      }),
  };
}
