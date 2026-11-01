"use client";
import { useEffect } from "react";
export default function GlobalError({
  reset,
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { if (process.env.NEXT_PUBLIC_SENTRY_DSN) void import("@sentry/nextjs").then((sentry) => sentry.captureException(error)); }, [error]);
  return (
    <html lang="id">
      <body style={{ margin: 40, fontFamily: "system-ui", color: "#18181a" }}>
        <h1>Terjadi gangguan pada aplikasi.</h1>
        <p>Silakan muat ulang halaman.</p>
        <button onClick={reset}>Coba lagi</button>
      </body>
    </html>
  );
}
