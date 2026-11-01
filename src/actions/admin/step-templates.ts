"use server";

import { asc } from "drizzle-orm";
import { requireAdmin } from "@/auth/session";
import { authorize } from "@/access/rules";
import { getDb } from "@/db";
import { auditLogs } from "@/db/schema/audit";
import { stepTemplates } from "@/db/schema/portal";
import { stepTemplatesInputSchema } from "@/schemas/step-templates";
import { ok, toFailure, type ActionResult } from "../result";

export type StepTemplateRecord = {
  stepNumber: number;
  title: string;
  description: string;
  defaultMilestones: string[];
};

export async function listStepTemplatesAction(): Promise<
  ActionResult<StepTemplateRecord[]>
> {
  try {
    const principal = await requireAdmin();
    authorize(principal, "client-projects", "read");
    const rows = await getDb()
      .select({
        stepNumber: stepTemplates.stepNumber,
        title: stepTemplates.title,
        description: stepTemplates.description,
        defaultMilestones: stepTemplates.defaultMilestones,
      })
      .from(stepTemplates)
      .orderBy(asc(stepTemplates.stepNumber));
    return ok(rows);
  } catch (error) {
    return toFailure(error);
  }
}

export async function saveStepTemplatesAction(
  input: unknown,
): Promise<ActionResult<StepTemplateRecord[]>> {
  try {
    const templates = stepTemplatesInputSchema.parse(input);
    const principal = await requireAdmin();
    authorize(principal, "client-projects", "update");
    const db = getDb();
    const saved = await db.transaction(async (tx) => {
      await tx
        .select({ id: stepTemplates.id })
        .from(stepTemplates)
        .orderBy(asc(stepTemplates.stepNumber))
        .for("update");
      const now = new Date();
      for (const template of templates) {
        await tx
          .insert(stepTemplates)
          .values({ ...template, updatedAt: now })
          .onConflictDoUpdate({
            target: stepTemplates.stepNumber,
            set: {
              title: template.title,
              description: template.description,
              defaultMilestones: template.defaultMilestones,
              updatedAt: now,
            },
          });
        await tx.insert(auditLogs).values({
          actorId: principal.id,
          actorType: "admin",
          action: "update",
          collection: "step-templates",
          docId: String(template.stepNumber),
          summary: `Memperbarui template tahap ${template.stepNumber}`,
        });
      }
      return tx
        .select({
          stepNumber: stepTemplates.stepNumber,
          title: stepTemplates.title,
          description: stepTemplates.description,
          defaultMilestones: stepTemplates.defaultMilestones,
        })
        .from(stepTemplates)
        .orderBy(asc(stepTemplates.stepNumber));
    });
    return ok(saved);
  } catch (error) {
    return toFailure(error);
  }
}
