import { toNextJsHandler } from "better-auth/next-js";
import { isAllowedAuthHttpRequest } from "@/auth/http-policy";
import { getAuth } from "@/auth/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function notFound(): Response {
  return Response.json(
    { error: "Not found." },
    { status: 404, headers: { "Cache-Control": "no-store" } },
  );
}

/** Exposes only read-only session discovery from Better Auth over HTTP. */
export async function GET(request: Request): Promise<Response> {
  if (!isAllowedAuthHttpRequest("GET", new URL(request.url).pathname))
    return notFound();
  return toNextJsHandler(getAuth()).GET(request);
}

export async function POST(request: Request): Promise<Response> {
  if (!isAllowedAuthHttpRequest("POST", new URL(request.url).pathname))
    return notFound();
  return toNextJsHandler(getAuth()).POST(request);
}
