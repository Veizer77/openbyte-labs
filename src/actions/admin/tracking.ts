"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { authorize } from "@/access/rules";
import { getDb } from "@/db";
import { auditLogs } from "@/db/schema/audit";
import { clientProjects, projectApprovals, projectSteps } from "@/db/schema/portal";
import { projects as showcaseProjects, projectCategories } from "@/db/schema/content";
import { randomUUID } from "node:crypto";
import { createTrackingStore } from "@/db/tracking-store";
import { createSettingsStore } from "@/db/site-settings-store";
import {
  createClientProject,
  listClientProjects,
  readAdminClientProject,
  mutateAdminClientProject,
  convertLeadToClientProject,
} from "@/services/tracking";
import { updateSettingsSection } from "@/services/site-settings";
import { invalidateSettingsCache } from "@/services/settings-cache";
import { trackingFailure as failure } from "@/lib/server/tracking-result";
import { ok } from "../result";
import {
  createAnonymousPortfolioDraft,
  isPortfolioConversionReady,
  portfolioYearFrom,
} from "@/lib/tracking/portfolio";
export async function listClientProjectsAction() {
  try {
    const principal = await requireAdmin();
    const store = createTrackingStore(getDb());
    const projects = await listClientProjects(store, principal);
    return ok({
      projects,
      settings: await store.settings(),
      options: await store.adminOptions(),
    });
  } catch (error) {
    return failure(error);
  }
}
export async function readClientProjectAction(id: string) {
  try {
    return ok(
      await readAdminClientProject(
        createTrackingStore(getDb()),
        await requireAdmin(),
        id,
      ),
    );
  } catch (error) {
    return failure(error);
  }
}
export async function createClientProjectAction(input: unknown) {
  try {
    const principal = await requireAdmin();
    const result = await createClientProject(
      createTrackingStore(getDb()),
      principal,
      input,
    );
    revalidatePath("/admin/proyek-klien");
    return ok(result);
  } catch (error) {
    return failure(error);
  }
}
/**
 * Konversi satu lead menjadi proyek klien tanpa mengetik ulang data klien.
 *
 * Identitas (nama, WhatsApp, email) dibaca ulang dari baris lead di server,
 * jadi tidak ada jalur bagi browser untuk mengirim identitas palsu.
 */
export async function convertLeadAction(input: unknown) {
  try {
    const principal = await requireAdmin();
    const result = await convertLeadToClientProject(
      createTrackingStore(getDb()),
      principal,
      input,
    );
    revalidatePath("/admin/proyek-klien");
    revalidatePath("/admin/inquiry");
    revalidatePath("/admin/quote");
    return ok(result);
  } catch (error) {
    return failure(error);
  }
}
export async function updateClientProjectAction(id: string, input: unknown) {  try {
    const principal = await requireAdmin();
    const result = await mutateAdminClientProject(
      createTrackingStore(getDb()),
      principal,
      id,
      input,
    );
    revalidatePath("/admin/proyek-klien");
    revalidatePath("/tracking/proyek");
    return ok(result);
  } catch (error) {
    return failure(error);
  }
}
export async function toggleTrackingAction(enabled: boolean) {
  try {
    const principal = await requireAdmin();
    authorize(principal, "site-settings", "update", ["tracking"]);
    const store = createTrackingStore(getDb());
    const current = await store.settings();
    await updateSettingsSection(
      createSettingsStore(getDb()),
      principal,
      "tracking",
      { ...current, trackingEnabled: z.boolean().parse(enabled) },
      invalidateSettingsCache,
    );
    revalidatePath("/", "layout");
    return ok(null);
  } catch (error) {
    return failure(error);
  }
}

/**
 * Membuat draft portofolio dari proyek klien.
 *
 * `includeClientName` adalah izin eksplisit. Tanpa izin, draf tetap anonim
 * walaupun proyek sumber punya nama klien. Konten privat proyek klien (ringkasan,
 * blok, gambar, tautan) tidak pernah disalin; admin mengisinya sendiri.
 */
export async function convertClientProjectToPortfolioAction(
  id: string,
  includeClientName = false,
) {
  try {
    const principal = await requireAdmin();
    authorize(principal, "client-projects", "update");
    const projectId = z.uuid().parse(id);
    const db = getDb();
    const result = await db.transaction(async (tx) => {
      const [clientProject] = await tx
        .select()
        .from(clientProjects)
        .where(eq(clientProjects.id, projectId))
        .for("update");
      if (!clientProject || clientProject.deletedAt)
        throw new Error("Proyek klien tidak ditemukan.");
      if (clientProject.projectId) {
        const [existing] = await tx
          .select({ id: showcaseProjects.id, slug: showcaseProjects.slug })
          .from(showcaseProjects)
          .where(eq(showcaseProjects.id, clientProject.projectId));
        if (existing) return { projectId: existing.id, slug: existing.slug, alreadyLinked: true };
        throw new Error("Relasi portofolio proyek tidak valid.");
      }
      const steps = await tx
        .select({ stepNumber: projectSteps.stepNumber, status: projectSteps.status })
        .from(projectSteps)
        .where(eq(projectSteps.clientProjectId, projectId));
      const [approval] = await tx
        .select({ id: projectApprovals.id })
        .from(projectApprovals)
        .where(and(
          eq(projectApprovals.clientProjectId, projectId),
          eq(projectApprovals.type, "final_handover"),
        ))
        .limit(1);
      if (!isPortfolioConversionReady({
        deleted: Boolean(clientProject.deletedAt),
        stepStatuses: steps.map((step) => step.status),
        finalHandoverApproved: Boolean(approval),
      }))
        throw new Error("Portofolio hanya dapat dibuat setelah enam tahap selesai dan serah terima disetujui klien.");

      const now = new Date();
      const slug = `portfolio-${randomUUID()}`;
      const year = portfolioYearFrom(
        clientProject.startDate,
        clientProject.targetCompletionDate,
        now.getFullYear(),
      );
      const [showcase] = await tx
        .insert(showcaseProjects)
        .values({
          ...createAnonymousPortfolioDraft(slug, year, {
            clientName: clientProject.clientName,
            includeClientName: Boolean(includeClientName),
            categoryIds: clientProject.categoryId ? [clientProject.categoryId] : [],
            year,
          }),
        })
        .returning({ id: showcaseProjects.id, slug: showcaseProjects.slug });
      if (!showcase) throw new Error("Draft portofolio tidak dapat dibuat.");

      // Kategori disalin karena itu atribut publik proyek, bukan identitas klien.
      if (clientProject.categoryId)
        await tx.insert(projectCategories).values({
          projectId: showcase.id,
          categoryId: clientProject.categoryId,
        });

      await tx
        .update(clientProjects)
        .set({ projectId: showcase.id, updatedAt: now })
        .where(eq(clientProjects.id, projectId));
      await tx.insert(auditLogs).values({
        actorId: principal.id,
        actorType: "admin",
        action: "create",
        collection: "projects",
        docId: showcase.id,
        summary: includeClientName
          ? "Membuat draft portofolio dari proyek klien dengan izin nama klien"
          : "Membuat draft portofolio anonim dari proyek klien",
      });
      await tx.insert(auditLogs).values({
        actorId: principal.id,
        actorType: "admin",
        action: "update",
        collection: "client-projects",
        docId: projectId,
        summary: "Menghubungkan proyek selesai ke draft portofolio",
      });
      return { projectId: showcase.id, slug: showcase.slug, alreadyLinked: false };
    });
    revalidatePath("/admin/showcase");
    revalidatePath("/admin/proyek-klien");
    return ok(result);
  } catch (error) {
    return failure(error);
  }
}
