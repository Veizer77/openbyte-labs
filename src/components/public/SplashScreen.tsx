"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Splash screen dengan loading bar kustom OpenByte Labs.
 * Terinspirasi dari welcome splash di direktori portfolio.
 */
export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Kunci scroll selama splash aktif
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Mulai animasi bar progres
    const startProgressTimer = setTimeout(() => {
      setMounted(true);
    }, 50);

    // Mulai transisi fade-out keluar
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      document.body.style.overflow = originalOverflow;
    }, 2500);

    // Hapus elemen sepenuhnya dari DOM setelah animasi selesai
    const removeTimer = setTimeout(() => {
      setHidden(true);
    }, 3100);

    return () => {
      clearTimeout(startProgressTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      id="splash-screen"
      role="status"
      aria-live="polite"
      aria-label="Memuat OpenByte Labs"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white text-neutral-900 transition-all duration-600 ease-out select-none ${
        isExiting
          ? "opacity-0 scale-105 pointer-events-none"
          : "opacity-100 scale-100"
      }`}
    >
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Kontainer simetris: lebar bar loading persis sama dengan logo */}
        <div className="w-[280px] sm:w-[360px] md:w-[420px] flex flex-col items-center">
          {/* Logo OpenByte Labs */}
          <div className="relative mb-8 w-full flex justify-center">
            <Image
              src="/images/OpenByte%20Labs%20Tech%20Logo-1.png"
              alt="OpenByte Labs"
              width={1589}
              height={413}
              priority
              unoptimized
              className="w-full h-auto object-contain [image-rendering:-webkit-optimize-contrast]"
            />
          </div>

          {/* Loading Progress Bar */}
          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden relative border border-neutral-200">
            <div
              className="h-full bg-gradient-to-r from-[#c8e600] via-[#e2eba2] to-[#bdc56e] rounded-full"
              style={{
                width: mounted ? "100%" : "0%",
                transition: "width 2.3s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>

          {/* Status text */}
          <p className="text-neutral-500 mt-5 text-[11px] sm:text-xs font-mono tracking-[0.28em] uppercase text-center w-full">
            Memuat OpenByte Labs
          </p>
        </div>
      </div>
    </div>
  );
}
