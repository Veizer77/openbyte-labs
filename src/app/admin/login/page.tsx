import LoginScreen from "@/components/screens/cms/login-admin";

/**
 * Rendered per request so the middleware CSP nonce matches the inline scripts.
 * A prerendered login page would ship build-time scripts without that nonce.
 */
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <LoginScreen />;
}
