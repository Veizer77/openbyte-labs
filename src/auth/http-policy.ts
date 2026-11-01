const SESSION_READ_PATH = "/api/auth/get-session";

/** The generic Better Auth transport must not expose mutating auth endpoints. */
export function isAllowedAuthHttpRequest(
  method: string,
  pathname: string,
): boolean {
  return method === "GET" && pathname === SESSION_READ_PATH;
}
