import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Klien | OpenByte Labs",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default function TrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
