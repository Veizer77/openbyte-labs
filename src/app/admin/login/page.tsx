import LoginScreen from "@/components/screens/cms/login-admin";
import { quickLoginEnabled } from "@/auth/dev-bypass";

/**
 * Rendered per request so the middleware CSP nonce matches the inline scripts.
 * A prerendered login page would ship build-time scripts without that nonce.
 */
export const dynamic = "force-dynamic";

export default function LoginPage() {
  // Resolved on the server: the client never decides whether the bypass exists.
  return <LoginScreen quickLogin={quickLoginEnabled()} />;
}
