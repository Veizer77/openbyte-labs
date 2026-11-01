import { notFound, redirect } from "next/navigation";
import { getDb } from "@/db";
import { createTrackingStore } from "@/db/tracking-store";
import { getTrackingSession } from "@/lib/server/tracking-session";
import { TrackingPortal } from "@/components/tracking/TrackingPortal";
import { TrackingError } from "@/lib/tracking/errors";

export default async function ClientProjectPage() {
  const store = createTrackingStore(getDb());
  if (!(await store.settings()).trackingEnabled) notFound();
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
