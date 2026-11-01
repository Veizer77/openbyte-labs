import "server-only";
import { revalidateTag } from "next/cache";

export function invalidateFaqCache(): void {
  revalidateTag("faqs", { expire: 0 });
}
