import "server-only";
import { revalidateTag } from "next/cache";

/** Must be called from a Server Action or Route Handler after the database commit. */
export function invalidateSettingsCache(): void {
  revalidateTag("settings", { expire: 0 });
}
