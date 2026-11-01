import type { Metadata } from "next";
import { OrderPage } from "@/components/public/SupportingPages";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Pemesanan Paket",
  alternates: { canonical: "/pesan" },
};

export default async function PackageOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ paket?: string }>;
}) {
  return <OrderPage packageSlug={(await searchParams).paket} />;
}
