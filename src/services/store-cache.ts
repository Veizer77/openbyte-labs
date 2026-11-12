import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";

/** Called after every Digital Store admin mutation via the action layer. */
export function invalidateStoreCache(): void {
  revalidateTag("catalog", { expire: 0 });
  revalidatePath("/store");
}
