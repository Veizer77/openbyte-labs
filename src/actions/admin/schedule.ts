"use server";

import { z } from "zod";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/auth/session";
import { authorize } from "@/access/rules";
import { getDb } from "@/db";
import { createAvailabilityStore } from "@/db/availability-store";
import { createBlockedDateStore } from "@/db/blocked-dates-store";
import { availabilityRules, blockedDates } from "@/db/schema/booking";
import {
  deleteAvailabilityRule,
  saveAvailabilityRule,
} from "@/services/availability";
import { deleteBlockedDate, saveBlockedDate } from "@/services/blocked-dates";
import { ok, toFailure, type ActionResult } from "../result";

const idSchema = z.uuid();

export type AdminScheduleData = {
  availabilityRules: Array<{
    id: string;
    weekday: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }>;
  blockedDates: Array<{
    id: string;
    date: string;
    startTime: string | null;
    endTime: string | null;
    reason: string;
  }>;
};

export async function listScheduleAction(): Promise<
  ActionResult<AdminScheduleData>
> {
  try {
    const principal = await requireAdmin();
    authorize(principal, "availability-rules", "read");
    authorize(principal, "blocked-dates", "read");
    const db = getDb();
    const [rules, dates] = await Promise.all([
      db
        .select({
          id: availabilityRules.id,
          weekday: availabilityRules.weekday,
          startTime: availabilityRules.startTime,
          endTime: availabilityRules.endTime,
          isActive: availabilityRules.isActive,
        })
        .from(availabilityRules)
        .orderBy(asc(availabilityRules.weekday), asc(availabilityRules.startTime)),
      db
        .select({
          id: blockedDates.id,
          date: blockedDates.date,
          startTime: blockedDates.startTime,
          endTime: blockedDates.endTime,
          reason: blockedDates.reason,
        })
        .from(blockedDates)
        .orderBy(asc(blockedDates.date), asc(blockedDates.startTime)),
    ]);
    return ok({ availabilityRules: rules, blockedDates: dates });
  } catch (error) {
    return toFailure(error);
  }
}

/** Weekly availability. Writes share the schedule lock used by booking creation. */
export async function saveAvailabilityAction(
  input: unknown,
): Promise<ActionResult<string>> {
  try {
    const { id, value } = z
      .object({ id: idSchema.nullable(), value: z.unknown() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    const saved = await saveAvailabilityRule(
      createAvailabilityStore(getDb()),
      principal,
      id,
      value,
    );
    return ok(saved);
  } catch (error) {
    return toFailure(error);
  }
}

export async function deleteAvailabilityAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const id = idSchema.parse(input);
    const principal = await requireAdmin();
    await deleteAvailabilityRule(createAvailabilityStore(getDb()), principal, id);
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}

export async function saveBlockedDateAction(
  input: unknown,
): Promise<ActionResult<string>> {
  try {
    const { id, value } = z
      .object({ id: idSchema.nullable(), value: z.unknown() })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    const saved = await saveBlockedDate(
      createBlockedDateStore(getDb()),
      principal,
      id,
      value,
    );
    return ok(saved);
  } catch (error) {
    return toFailure(error);
  }
}

export async function deleteBlockedDateAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const id = idSchema.parse(input);
    const principal = await requireAdmin();
    await deleteBlockedDate(createBlockedDateStore(getDb()), principal, id);
    return ok({ id });
  } catch (error) {
    return toFailure(error);
  }
}
