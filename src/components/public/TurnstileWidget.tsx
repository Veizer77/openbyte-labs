"use client";

import { useEffect, useRef, useState } from "react";

type TurnstileOptions = {
  sitekey: string;
  action: string;
  theme: "light" | "dark";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

let scriptLoad: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptLoad) {
    scriptLoad = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-openbyte-turnstile="true"]',
      );
      const script = existing ?? document.createElement("script");
      const loaded = () =>
        window.turnstile
          ? resolve()
          : reject(new Error("Turnstile gagal dimuat."));
      script.addEventListener("load", loaded, { once: true });
      script.addEventListener(
        "error",
        () => reject(new Error("Turnstile gagal dimuat.")),
        { once: true },
      );
      if (!existing) {
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset.openbyteTurnstile = "true";
        document.head.append(script);
      }
    }).catch((error: unknown) => {
      scriptLoad = null;
      throw error;
    });
  }
  return scriptLoad!;
}

export function TurnstileWidget({
  action,
  onTokenChange,
  resetKey,
  theme = "light",
}: {
  action: "inquiry" | "booking" | "calculator";
  onTokenChange: (token: string) => void;
  resetKey: number;
  theme?: "light" | "dark";
}) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const lastResetKey = useRef(resetKey);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "unconfigured">(
    turnstileSiteKey ? "loading" : "unconfigured",
  );

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    if (!turnstileSiteKey) {
      onTokenChangeRef.current("");
      return;
    }

    let active = true;
    void loadTurnstile()
      .then(() => {
        if (!active || !container.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(container.current, {
          sitekey: turnstileSiteKey,
          action,
          theme,
          callback(token) {
            onTokenChangeRef.current(token);
            setStatus("ready");
          },
          "expired-callback"() {
            onTokenChangeRef.current("");
            setStatus("loading");
          },
          "error-callback"() {
            onTokenChangeRef.current("");
            setStatus("error");
          },
        });
      })
      .catch(() => {
        if (!active) return;
        onTokenChangeRef.current("");
        setStatus("error");
      });

    return () => {
      active = false;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [action, theme]);

  useEffect(() => {
    if (lastResetKey.current === resetKey) return;
    lastResetKey.current = resetKey;
    if (widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
    }
  }, [resetKey]);

  return (
    <div className="flex flex-col gap-1.5" aria-live="polite">
      {turnstileSiteKey ? (
        <div ref={container} className="min-h-[65px]" />
      ) : null}
      <p
        className={`m-0 text-[10px] ${theme === "dark" ? "text-[#a8a8ad]" : "text-[#71717a]"}`}
        role="status"
      >
        {status === "unconfigured"
          ? process.env.NODE_ENV === "production"
            ? "Verifikasi keamanan belum dikonfigurasi."
            : "Turnstile tidak dikonfigurasi untuk lingkungan lokal."
          : status === "loading"
            ? "Menyiapkan verifikasi keamanan…"
            : status === "error"
              ? "Verifikasi keamanan gagal dimuat. Muat ulang halaman atau coba lagi."
              : "Verifikasi keamanan berhasil."}
      </p>
    </div>
  );
}
