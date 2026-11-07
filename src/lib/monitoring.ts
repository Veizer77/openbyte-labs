import type { ErrorEvent } from "@sentry/nextjs";

type EnvSource = Record<string, string | undefined>;

/**
 * Resolves the Sentry environment name.
 *
 * A production build can run on a developer machine (`next build && next start`)
 * for smoke testing. Without an explicit label those events land in the
 * `production` environment and look like real incidents. Vercel sets `VERCEL=1`
 * on every deployment, so only those runs are reported as production.
 */
export function monitoringEnvironment(env: EnvSource = process.env): string {
  const explicit = env.SENTRY_ENVIRONMENT?.trim();
  if (explicit) return explicit;

  if (env.VERCEL === "1") {
    const vercelEnv = env.VERCEL_ENV?.trim();
    if (vercelEnv === "production") return "production";
    if (vercelEnv === "preview") return "preview";
    if (vercelEnv === "development") return "development-local";
    return "production";
  }

  if (env.NODE_ENV === "production") return "development-local";
  if (env.NODE_ENV === "test") return "test";
  return "development";
}

/**
 * Client-side counterpart. Browser bundles only receive `NEXT_PUBLIC_*` values,
 * so the environment is derived from the hostname instead: a Vercel deployment
 * serves from `*.vercel.app`, anything else is a local production build.
 */
export function monitoringEnvironmentForHost(hostname: string | undefined): string {
  const host = (hostname ?? "").toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
    return "development-local";
  }
  if (host.endsWith(".vercel.app")) return "production";
  return "development-local";
}

export const privateMonitoringData = {
  userInfo: false, cookies: false, httpHeaders: false,
  httpBodies: [] as never[], urlQueryParams: false,
  graphQL: { document: false, variables: false },
  genAI: { inputs: false, outputs: false }, mcp: { inputs: false, outputs: false },
  databaseQueryData: false, queues: false, stackFrameVariables: false, frameContextLines: 0,
};

/** Keep stack traces, but never send user data, form bodies, cookies or driver messages. */
export function sanitizeMonitoringEvent(event: ErrorEvent): ErrorEvent {
  event.user = undefined;
  event.request = undefined;
  event.breadcrumbs = [];
  event.extra = {};
  event.contexts = {};
  event.tags = {};
  event.message = event.message ? "Application error" : undefined;
  event.transaction = event.transaction?.split("?")[0].replace(/\/[a-f0-9-]{36}(?=\/|$)/gi, "/[id]");
  for (const exception of event.exception?.values ?? []) {
    exception.value = "Unexpected application error (details withheld)";
    for (const frame of exception.stacktrace?.frames ?? []) {
      frame.vars = undefined;
      frame.filename = frame.filename?.split("?")[0];
    }
  }
  return event;
}
