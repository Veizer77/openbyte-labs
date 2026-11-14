"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function PublicHeaderNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(false);

  const syncFades = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const overflow = nav.scrollWidth - nav.clientWidth;
    if (overflow <= 2) {
      setFadeLeft(false);
      setFadeRight(false);
      return;
    }
    setFadeLeft(nav.scrollLeft > 4);
    setFadeRight(nav.scrollLeft < overflow - 4);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
    if (active && nav.scrollWidth > nav.clientWidth) {
      const target =
        active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
      const maxScroll = nav.scrollWidth - nav.clientWidth;
      nav.scrollLeft = Math.max(0, Math.min(target, maxScroll));
    }
    syncFades();
    window.addEventListener("resize", syncFades);
    return () => window.removeEventListener("resize", syncFades);
  }, [pathname, syncFades]);

  return (
    <div className="relative border-t border-[#eaeaea] lg:border-t-0 py-1.5 lg:py-0 -mx-4 sm:-mx-6 lg:mx-0 lg:px-0 lg:justify-self-center">
      <nav
        ref={navRef}
        aria-label="Navigasi utama"
        onScroll={syncFades}
        className="flex items-center gap-1 lg:gap-1 xl:gap-2 2xl:gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 scroll-px-4 sm:scroll-px-6 lg:rounded-[10px] lg:border lg:border-[#eaeaea] lg:bg-[#f0f0f0]/75 lg:px-1.5 lg:py-1"
        data-pencil-name="nav"
      >
        {children}
      </nav>
      {fadeLeft ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-white via-white/85 to-transparent lg:hidden"
        />
      ) : null}
      {fadeRight ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-7 bg-gradient-to-l from-white via-white/85 to-transparent lg:hidden"
        />
      ) : null}
    </div>
  );
}
