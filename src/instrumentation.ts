import type { Instrumentation } from "next";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.SENTRY_DSN) {
    const Sentry = await import("@sentry/nextjs");
    const { sanitizeMonitoringEvent, privateMonitoringData } = await import("./lib/monitoring");
    Sentry.init({ dsn: process.env.SENTRY_DSN, enabled: process.env.NODE_ENV === "production", dataCollection: privateMonitoringData, tracesSampleRate: 0, beforeSend: sanitizeMonitoringEvent });
  }
}

export const onRequestError: Instrumentation.onRequestError = async (...args) => {
  if (!process.env.SENTRY_DSN || process.env.NODE_ENV !== "production") return;
  const Sentry = await import("@sentry/nextjs");
  await Sentry.captureRequestError(...args);
};
