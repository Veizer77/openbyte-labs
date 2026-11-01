import "server-only";
import type { Database } from "@/db/connection";
import { availabilityRules } from "@/db/schema/booking";
import { seedState } from "@/db/schema/seed-state";

/** Does not reactivate or overwrite rules that the owner has edited. */
export async function initializeAvailabilityRules(
  db: Database,
): Promise<{
  status: "created" | "existing_rules" | "already_initialized";
  created: number;
}> {
  const defaults = [1, 2, 3, 4, 5].flatMap((weekday) =>
    [
      ["09:00", "11:00"],
      ["13:00", "15:00"],
      ["16:00", "18:00"],
      ["19:30", "21:30"],
    ].map(([startTime, endTime]) => ({ weekday, startTime, endTime })),
  );
  return db.transaction(async (tx) => {
    const marker = await tx
      .insert(seedState)
      .values({ key: "availability-v1" })
      .onConflictDoNothing({ target: seedState.key })
      .returning({ key: seedState.key });
    if (!marker.length) return { status: "already_initialized", created: 0 };
    const existing = await tx
      .select({ id: availabilityRules.id })
      .from(availabilityRules)
      .limit(1);
    if (existing.length) return { status: "existing_rules", created: 0 };
    const inserted = await tx
      .insert(availabilityRules)
      .values(defaults)
      .onConflictDoNothing({
        target: [
          availabilityRules.weekday,
          availabilityRules.startTime,
          availabilityRules.endTime,
        ],
      })
      .returning({ id: availabilityRules.id });
    return { status: "created", created: inserted.length };
  });
}
