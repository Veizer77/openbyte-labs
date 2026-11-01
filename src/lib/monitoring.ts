import type { ErrorEvent } from "@sentry/nextjs";

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
