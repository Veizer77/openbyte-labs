import { notFound, redirect } from "next/navigation";
import { getDb } from "@/db";
import { createTrackingStore } from "@/db/tracking-store";
import { getTrackingSession } from "@/lib/server/tracking-session";
import { getPublicSiteSettings } from "@/lib/server/public-site";
import { TrackingLogin } from "@/components/tracking/TrackingLogin";
import { normalizeWhatsapp } from "@/lib/whatsapp";
import { TrackingError } from "@/lib/tracking/errors";

export default async function TrackingPage() {
  const store = createTrackingStore(getDb());
  const config = await store.settings();
  if (!config.trackingEnabled) notFound();
  const session = await getTrackingSession();
  if (session) {
    let valid = false;
    try {
      await store.clientPortal(session);
      valid = true;
    } catch (error) {
      if (!(error instanceof TrackingError)) throw error;
    }
    if (valid) redirect("/tracking/proyek");
  }
  const settings = await getPublicSiteSettings();
  const phone = normalizeWhatsapp(settings.general.whatsappNumber);
  return (
    <TrackingLogin
      whatsappUrl={phone ? `https://wa.me/${phone}` : null}
      sessionMinutes={config.sessionMinutes}
      maxAttempts={config.maxLoginAttempts}
    />
  );
}
