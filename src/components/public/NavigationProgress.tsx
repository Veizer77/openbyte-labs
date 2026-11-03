"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { shouldTrackNavigation } from "@/lib/navigation-progress";

const TICK_MS = 150;
const START_VALUE = 8;
const MAX_BEFORE_DONE = 90;
const HIDE_DELAY_MS = 220;

/**
 * Route-transition progress bar.
 *
 * This replaces the old route-level `loading.tsx` skeleton. A `loading.tsx`
 * forces Next.js to start streaming before `notFound()` runs, which turned
 * unknown URLs into HTTP 200 soft-404s. This component reacts only to client
 * navigation and writes straight to the DOM, so the server keeps full control
 * of the response status and the bar never causes a re-render.
 *
 * `useSearchParams` is deliberately avoided: it requires a Suspense boundary,
 * which pushes this markup out of the initial HTML (so the bar disappeared on
 * streamed and not-found responses). `usePathname` plus a location poll covers
 * both path and query transitions without affecting rendering.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const container = useRef<HTMLDivElement>(null);
  const finish = useRef<() => void>(() => {});

  useEffect(() => {
    const element = container.current;
    const track = element?.firstElementChild as HTMLElement | null;
    if (!element || !track) return;

    let ticker: ReturnType<typeof setInterval> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let target: string | null = null;

    const paint = (value: number, opacity: number) => {
      track.style.width = `${value}%`;
      track.style.opacity = String(opacity);
    };
    const stopTicker = () => {
      if (ticker) clearInterval(ticker);
      ticker = null;
    };
    const complete = () => {
      if (!ticker && !hideTimer) return;
      stopTicker();
      paint(100, 1);
      hideTimer = setTimeout(() => {
        element.dataset.navigationProgress = "idle";
        paint(0, 0);
      }, HIDE_DELAY_MS);
    };
    finish.current = complete;

    const start = (href: string) => {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = null;
      stopTicker();
      try {
        target = new URL(href, window.location.href).href;
      } catch {
        target = null;
      }
      element.dataset.navigationProgress = "active";
      let current = START_VALUE;
      paint(current, 1);
      ticker = setInterval(() => {
        // The committed URL is the only reliable "navigation finished" signal;
        // it also covers transitions that only change the query string.
        if (target && window.location.href === target) {
          complete();
          return;
        }
        current = Math.min(
          MAX_BEFORE_DONE,
          current + Math.max(1, Math.round((MAX_BEFORE_DONE - current) / 8)),
        );
        paint(current, 1);
      }, TICK_MS);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !shouldTrackNavigation({
          href,
          target: anchor.getAttribute("target"),
          download: anchor.hasAttribute("download"),
          currentUrl: window.location.href,
          sameOrigin: true,
          modified:
            event.metaKey || event.ctrlKey || event.shiftKey || event.altKey,
          button: event.button,
        }) ||
        !href
      )
        return;
      start(href);
    };
    const onPopState = () => start(window.location.href);

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      stopTicker();
      if (hideTimer) clearTimeout(hideTimer);
      finish.current = () => {};
    };
  }, []);

  // Backup for redirects: the resolved pathname also ends the bar.
  useEffect(() => {
    finish.current();
  }, [pathname]);

  return (
    <div
      ref={container}
      aria-hidden="true"
      data-navigation-progress="idle"
      className="navigation-progress"
    >
      <span />
    </div>
  );
}
