import "server-only";
import { revalidateTag } from "next/cache";

export function invalidateCatalogCache(): void {
  revalidateTag("catalog", { expire: 0 });
}
