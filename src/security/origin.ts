import "server-only";

/**
 * State-changing Route Handlers do not get Server Action origin protection, so
 * they must reject cross-origin browser posts explicitly (PRD 6.2).
 */
export function isSameOrigin(request: Request, siteUrl: string): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(siteUrl).origin;
  } catch {
    return false;
  }
}

export function crossOriginResponse(): Response {
  return Response.json(
    { error: "Permintaan lintas-origin ditolak." },
    { status: 403, headers: { "Cache-Control": "no-store" } },
  );
}
