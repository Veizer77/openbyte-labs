import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/db";
import { createTrackingStore } from "@/db/tracking-store";
import { getTrackingSession } from "@/lib/server/tracking-session";
import { TrackingPortal } from "@/components/tracking/TrackingPortal";
import { TrackingError } from "@/lib/tracking/errors";

export const dynamic = "force-dynamic";

/**
 * Portal klien hanya boleh ada saat pemilik mengaktifkan tracking.
 *
 * Keputusan 404 dikerjakan di `generateMetadata` karena fase itu selesai
 * sebelum respons mulai di-stream. Bila pengecekan hanya dilakukan di komponen
 * halaman, header sudah terkirim lebih dulu dan klien menerima 200 berisi
 * halaman 404 (soft 404) — status HTTP tidak bisa diubah lagi.
 */
async function portalState() {
  const store = createTrackingStore(getDb());
  const enabled = (await store.settings()).trackingEnabled;
  if (!enabled) return { enabled: false as const, store };
  return { enabled: true as const, store };
}

export async function generateMetadata(): Promise<Metadata> {
  const { enabled } = await portalState();
  if (!enabled) notFound();
  return { title: "Proyek Klien | OpenByte Labs", robots: { index: false, follow: false } };
}

export default async function ClientProjectPage() {
  const { enabled, store } = await portalState();
  if (!enabled) notFound();

  const session = await getTrackingSession();
  if (!session) redirect("/tracking");
  let data;
  try {
    data = await store.clientPortal(session);
  } catch (error) {
    if (error instanceof TrackingError) redirect("/tracking");
    throw error;
  }
  return <TrackingPortal data={data} />;
}
