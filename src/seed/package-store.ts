import "server-only";
import type { Database } from "@/db/connection";
import {
  categories,
  serviceAddons,
  servicePackages,
} from "@/db/schema/packages";
import { seedState } from "@/db/schema/seed-state";
import { defaultPackageRows } from "./package-defaults";

export async function initializePackages(
  db: Database,
): Promise<{
  status: "created" | "existing_content" | "already_initialized";
  created: number;
}> {
  return db.transaction(async (tx) => {
    const marker = await tx
      .insert(seedState)
      .values({ key: "packages-v1" })
      .onConflictDoNothing({ target: seedState.key })
      .returning({ key: seedState.key });
    if (!marker.length) return { status: "already_initialized", created: 0 };
    const existingCategories = await tx
      .select({ id: categories.id })
      .from(categories)
      .limit(1);
    const existingPackages = await tx
      .select({ id: servicePackages.id })
      .from(servicePackages)
      .limit(1);
    const existingAddons = await tx
      .select({ id: serviceAddons.id })
      .from(serviceAddons)
      .limit(1);
    if (
      existingCategories.length ||
      existingPackages.length ||
      existingAddons.length
    )
      return { status: "existing_content", created: 0 };
    const defaults = defaultPackageRows();
    await tx.insert(categories).values(defaults.categories);
    await tx.insert(servicePackages).values(defaults.packages);
    await tx.insert(serviceAddons).values(defaults.addons);
    return { status: "created", created: defaults.packages.length };
  });
}
