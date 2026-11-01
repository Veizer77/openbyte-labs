"use server";

import { headers } from "next/headers";
import { getDb } from "@/db";
import { createBookingStore } from "@/db/booking-store";
import { getEnv } from "@/env";
import { verifyChallenge } from "@/security/challenge";
import { clientIpHash } from "@/security/client-ip";
import { consumePublicFormBudget } from "@/security/public-form-rate-limit";
import { createBooking } from "@/services/create-booking";
import {
  getPublicBookingAvailability,
  getPublicBookingMonthAvailability,
  type PublicBookingMonthAvailability,
} from "@/services/public-booking-availability";
import { createPublicBookingAvailabilityStore } from "@/db/public-booking-availability-store";
import { ok, toFailure, type ActionResult } from "../result";
import { getPublicSiteSettings } from "@/lib/server/public-site";
import { whatsappUrl } from "@/lib/whatsapp";

export type BookingResult = {
  reference: string;
  slotStart: string;
  slotEnd: string;
  calendarUrl: string;
  whatsappUrl?: string;
};

export type PublicBookingAvailabilityResult = {
  date: string;
  consultationModes: Array<"google_meet" | "whatsapp_call" | "offline">;
  slots: Array<{ start: string; end: string; label: string }>;
};

export type PublicBookingMonthAvailabilityResult = PublicBookingMonthAvailability;

/** Reads current server availability; booking submission still rechecks atomically. */
export async function getPublicBookingAvailabilityAction(
  input: unknown,
): Promise<ActionResult<PublicBookingAvailabilityResult>> {
  try {
    const data = await getPublicBookingAvailability(
      createPublicBookingAvailabilityStore(getDb()),
      input,
    );
    return ok(data);
  } catch (error) {
    return toFailure(error);
  }
}

/** Reads live open and occupied slots for one calendar month. */
export async function getPublicBookingMonthAvailabilityAction(
  input: unknown,
): Promise<ActionResult<PublicBookingMonthAvailabilityResult>> {
  try {
    const data = await getPublicBookingMonthAvailability(
      createPublicBookingAvailabilityStore(getDb()),
      input,
    );
    return ok(data);
  } catch (error) {
    return toFailure(error);
  }
}

/**
 * Public booking submission. Price and slot are recomputed from the database
 * inside the service; nothing from the browser is trusted except raw input.
 */
export async function submitBookingAction(
  input: unknown,
): Promise<ActionResult<BookingResult>> {
  try {
    const env = getEnv();
    const db = getDb();
    const ipHash = clientIpHash(await headers(), env);
    const data = await createBooking(input, ipHash, {
      store: createBookingStore(db),
      verifyChallenge: (token, honeypot) =>
        verifyChallenge(env, { token, honeypot, action: "booking" }),
      consumeBudget: (hash) => consumePublicFormBudget(db, hash),
    });
    // A notification link must not turn a committed booking into a reported failure.
    let notificationUrl: string | undefined;
    try {
      const settings = await getPublicSiteSettings();
      notificationUrl = whatsappUrl(
        `Halo, saya sudah mengajukan konsultasi dengan referensi ${data.reference}. Mohon konfirmasi jadwalnya.`,
        settings.general.whatsappNumber,
      );
    } catch {
      notificationUrl = undefined;
    }
    return ok({ ...data, whatsappUrl: notificationUrl });
  } catch (error) {
    return toFailure(error);
  }
}
