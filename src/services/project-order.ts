import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";

export const projectOrderSchema = z.array(z.uuid()).min(1).max(100).refine((ids) => new Set(ids).size === ids.length, "Proyek tidak boleh duplikat.");
export interface ProjectOrderStore { reorder(ids: string[], actorId: string): Promise<void> }

export async function reorderProjects(store: ProjectOrderStore, principal: AdminPrincipal | null, input: unknown) {
  authorize(principal, "projects", "update");
  await store.reorder(projectOrderSchema.parse(input), principal.id);
}
