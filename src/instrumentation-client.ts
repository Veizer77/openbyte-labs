import * as Sentry from "@sentry/nextjs";
import {
  sanitizeMonitoringEvent,
  privateMonitoringData,
  monitoringEnvironmentForHost,
} from "./lib/monitoring";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT?.trim() ||
    monitoringEnvironmentForHost(
      typeof window === "undefined" ? undefined : window.location.hostname,
    ),
  dataCollection: privateMonitoringData,
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  beforeSend: sanitizeMonitoringEvent,
});
