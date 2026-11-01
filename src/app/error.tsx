"use client";
import { useEffect } from "react";
export default function ErrorPage({
  reset,
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { if (process.env.NEXT_PUBLIC_SENTRY_DSN) void import("@sentry/nextjs").then((sentry) => sentry.captureException(error)); }, [error]);
  return (
    <main
      id="konten"
      className="max-w-xl mx-auto p-8 my-16 rounded-2xl bg-[#f0f0f0]"
    >
      <h1 className="text-2xl">Halaman belum dapat dimuat.</h1>
      <p className="text-sm text-[#52525b] leading-6">
        Terjadi gangguan saat memuat tampilan. Silakan coba lagi.
      </p>
      <button onClick={reset} className="primary-button">
        Coba lagi
      </button>
    </main>
  );
}
