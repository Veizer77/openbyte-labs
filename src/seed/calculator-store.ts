import "server-only";
import { eq } from "drizzle-orm";
import type { Database } from "@/db/connection";
import {
  calculatorGroups,
  calculatorItems,
  calculatorRules,
} from "@/db/schema/calculator";
import { seedState } from "@/db/schema/seed-state";
import { siteSettings } from "@/db/schema/settings";
import { defaultCalculatorRows } from "./calculator-defaults";

export async function initializeCalculator(
  db: Database,
): Promise<{
  status: "created" | "existing_configuration" | "already_initialized";
  created: number;
}> {
  return db.transaction(async (tx) => {
    const [settings] = await tx
      .select({ id: siteSettings.id })
      .from(siteSettings)
      .where(eq(siteSettings.id, 1))
      .for("update");
    if (!settings) throw new Error("Site Settings belum diinisialisasi.");
    const marker = await tx
      .insert(seedState)
      .values({ key: "calculator-v1" })
      .onConflictDoNothing({ target: seedState.key })
      .returning({ key: seedState.key });
    if (!marker.length) return { status: "already_initialized", created: 0 };
    const existingGroups = await tx
      .select({ id: calculatorGroups.id })
      .from(calculatorGroups)
      .limit(1);
    const existingItems = await tx
      .select({ id: calculatorItems.id })
      .from(calculatorItems)
      .limit(1);
    if (existingGroups.length || existingItems.length)
      return { status: "existing_configuration", created: 0 };
    const defaults = defaultCalculatorRows();
    await tx.insert(calculatorGroups).values(defaults.groups);
    await tx.insert(calculatorItems).values(defaults.items);
    if (defaults.rules.length)
      await tx.insert(calculatorRules).values(defaults.rules);
    return { status: "created", created: defaults.items.length };
  });
}
