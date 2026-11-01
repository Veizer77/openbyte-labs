"use server";

import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { createBookingAdminStore } from "@/db/booking-admin-store";
import { confirmBooking, listAdminBookings } from "@/services/booking-admin";
import type { BookingAdminDto } from "@/services/booking-admin";
import { ok, toFailure, type ActionResult } from "../result";

export async function listBookingsAction(
  input: unknown,
): Promise<ActionResult<BookingAdminDto[]>> {
  try {
    const principal = await requireAdmin();
    return ok(
      await listAdminBookings(
        createBookingAdminStore(getDb()),
        principal,
        input,
      ),
    );
  } catch (error) {
    return toFailure(error);
  }
}

/** Confirms a slot and returns the pre-filled WhatsApp confirmation link. */
export async function confirmBookingAction(
  input: unknown,
): Promise<ActionResult<{ whatsappUrl: string }>> {
  try {
    const { id, meetingUrl } = z
      .object({ id: z.uuid(), meetingUrl: z.string().max(2048) })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    const result = await confirmBooking(
      createBookingAdminStore(getDb()),
      principal,
      id,
      { meetingUrl },
    );
    return ok(result);
  } catch (error) {
    return toFailure(error);
  }
}
