import "server-only";
import { revalidateTag } from "next/cache";

export function invalidateCalculatorCache(): void {
  revalidateTag("calculator", { expire: 0 });
}
