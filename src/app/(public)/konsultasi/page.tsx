import type { Metadata } from "next";
import Screen from "@/components/screens/site/booking-konsultasi";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Booking Konsultasi",
  alternates: { canonical: "/konsultasi" },
};
export default function ConsultationPage() {
  return <Screen />;
}
