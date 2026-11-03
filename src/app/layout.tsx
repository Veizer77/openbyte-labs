import type { Metadata } from "next";
import localFont from "next/font/local";
import { PreviewProvider } from "@/components/preview/PreviewProvider";
import { NavigationProgress } from "@/components/public/NavigationProgress";
import "./globals.css";
import { publicIndexingEnabled, publicSiteOrigin } from "@/lib/indexing";

const inter = localFont({
  src: "../../public/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2",
  display: "swap",
  variable: "--font-inter",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(publicSiteOrigin() ?? "https://openbyte.invalid"),
  title: {
    default: "OpenByte Labs | Website, Aplikasi & Sistem Informasi",
    template: "%s | OpenByte Labs",
  },
  description:
    "Website bisnis, aplikasi mobile Flutter, dan sistem informasi dari OpenByte Labs.",
  robots: { index: publicIndexingEnabled(), follow: publicIndexingEnabled() },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/5f9e6a2ac345b8dc.png", type: "image/png" },
      { url: "/brand/openbyte-labs-square-icon-1-1-logo-only.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/images/5f9e6a2ac345b8dc.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#konten">
          Lewati ke konten
        </a>
        <NavigationProgress />
        <PreviewProvider>{children}</PreviewProvider>
      </body>
    </html>
  );
}
