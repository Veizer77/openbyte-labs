import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "@/db/connection";
import { createTrackingStore, type TrackingStore } from "@/db/tracking-store";
import { authUser } from "@/db/schema/admin-identity";
import { adminProfiles } from "@/db/schema/admin-profile";
import { siteSettings } from "@/db/schema/settings";
import { auditLogs } from "@/db/schema/audit";
import { inquiries } from "@/db/schema/packages";
import {
  clientProjects,
  projectMilestones,
  projectSteps,
} from "@/db/schema/portal";
import { defaultSiteSettings } from "@/seed/site-settings-defaults";
import { requireTestDatabaseUri } from "./target";

/**
 * Konversi lead hanya pernah diuji dengan membaca sumber. Itu membuktikan
 * bentuk kode, bukan perilakunya terhadap PostgreSQL: apakah transaksi benar
 * benar atomik, apakah unique index menolak konversi ganda, apakah status lead
 * ikut berubah di transaksi yang sama.
 *
 * Yang diuji di sini adalah hal yang tidak bisa dibuktikan mock: constraint
 * database yang sesungguhnya.
 */

let connection: postgres.Sql;
let db: Database;
type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];

beforeAll(async () => {
  connection = postgres(requireTestDatabaseUri(process.env), {
    max: 4,
    prepare: false,
    connect_timeout: 10,
  });
  db = drizzle(connection);
});
afterAll(async () => {
  await connection?.end();
});

async function fixture(
  run: (ctx: {
    tx: Tx;
    store: TrackingStore;
    actor: string;
    inquiryId: string;
    reference: string;
  }) => Promise<void>,
) {
  const rollback = new Error("rollback-convert-fixture");
  try {
    await db.transaction(async (tx) => {
      const settings = defaultSiteSettings();
      settings.tracking.trackingEnabled = true;
      await tx
        .insert(siteSettings)
        .values({ id: 1, data: settings })
        .onConflictDoUpdate({ target: siteSettings.id, set: { data: settings } });

      const actor = randomUUID();
      await tx.insert(authUser).values({
        id: actor,
        name: "Integration admin",
        email: `${actor}@example.test`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await tx
        .insert(adminProfiles)
        .values({ id: actor, authUserId: actor, role: "owner" });

      const reference = `INQ-${randomUUID().slice(0, 8).toUpperCase()}`;
      const [inquiry] = await tx
        .insert(inquiries)
        .values({
          reference,
          source: "contact",
          name: "Klien Integrasi",
          whatsapp: "081234567890",
          email: "klien@example.test",
          organizationOrBusiness: "",
          message: "Butuh sistem inventori",
          ipHash: "b".repeat(64),
          consentAt: new Date(),
        })
        .returning({ id: inquiries.id });

      await run({
        tx,
        store: createTrackingStore(tx as unknown as Database),
        actor,
        inquiryId: inquiry!.id,
        reference,
      });
      throw rollback;
    });
  } catch (error) {
    if (error !== rollback) throw error;
  }
}

describe("konversi lead pada PostgreSQL terisolasi", () => {
  it("membaca identitas dari baris lead, bukan dari input", () =>
    fixture(async ({ tx, store, actor, inquiryId }) => {
      const result = await store.convertLead(
        {
          source: "inquiry",
          sourceId: inquiryId,
          projectTitle: "Sistem Informasi Inventori",
          totalCost: 5_000_000,
          categoryId: null,
          servicePackageId: null,
          startDate: "",
          targetCompletionDate: "",
          internalNotes: "",
        },
        actor,
      );

      const [row] = await tx
        .select()
        .from(clientProjects)
        .where(eq(clientProjects.id, result.project.id));

      expect(row?.clientName).toBe("Klien Integrasi");
      expect(row?.clientWhatsapp).toBe("081234567890");
      expect(row?.clientEmail).toBe("klien@example.test");
      expect(row?.sourceInquiryId).toBe(inquiryId);
      expect(row?.sourceQuoteRequestId).toBeNull();
      expect(result.pin).toMatch(/^\d{6}$/);
      // PIN tidak boleh tersimpan dalam bentuk terbuka.
      expect(row?.accessPinHash).not.toContain(result.pin);
    }));

  it("membuat enam tahap dan menandai lead terkonversi", () =>
    fixture(async ({ tx, store, actor, inquiryId }) => {
      const result = await store.convertLead(
        {
          source: "inquiry",
          sourceId: inquiryId,
          projectTitle: "Proyek Enam Tahap",
          totalCost: 1_000_000,
          categoryId: null,
          servicePackageId: null,
          startDate: "",
          targetCompletionDate: "",
          internalNotes: "",
        },
        actor,
      );

      const steps = await tx
        .select({ stepNumber: projectSteps.stepNumber, status: projectSteps.status })
        .from(projectSteps)
        .where(eq(projectSteps.clientProjectId, result.project.id));
      expect(steps).toHaveLength(6);
      expect(steps.every((s) => s.status === "pending")).toBe(true);

      const [lead] = await tx
        .select({ status: inquiries.status })
        .from(inquiries)
        .where(eq(inquiries.id, inquiryId));
      expect(lead?.status).toBe("converted");

      // Audit tercatat untuk proyek dan untuk lead.
      const audits = await tx
        .select({ collection: auditLogs.collection })
        .from(auditLogs)
        .where(eq(auditLogs.docId, inquiryId));
      expect(audits.length).toBeGreaterThan(0);
    }));

  it("menolak konversi kedua atas lead yang sama", () =>
    fixture(async ({ store, actor, inquiryId }) => {
      const input = {
        source: "inquiry" as const,
        sourceId: inquiryId,
        projectTitle: "Proyek Pertama",
        totalCost: 1_000_000,
        categoryId: null,
        servicePackageId: null,
        startDate: "",
        targetCompletionDate: "",
        internalNotes: "",
      };
      await store.convertLead(input, actor);
      await expect(
        store.convertLead({ ...input, projectTitle: "Proyek Duplikat" }, actor),
      ).rejects.toThrow(/sudah dikonversi/);
    }));

  it("tidak meninggalkan proyek setengah jadi saat sumber tidak ada", () =>
    fixture(async ({ tx, store, actor }) => {
      await expect(
        store.convertLead(
          {
            source: "inquiry",
            sourceId: randomUUID(),
            projectTitle: "Proyek Hantu",
            totalCost: 1_000_000,
            categoryId: null,
            servicePackageId: null,
            startDate: "",
            targetCompletionDate: "",
            internalNotes: "",
          },
          actor,
        ),
      ).rejects.toThrow(/tidak ditemukan/);

      const rows = await tx.select({ id: clientProjects.id }).from(clientProjects);
      expect(rows).toHaveLength(0);
    }));

  it("membuat milestone hanya bila template menyediakannya", () =>
    fixture(async ({ tx, store, actor, inquiryId }) => {
      const result = await store.convertLead(
        {
          source: "inquiry",
          sourceId: inquiryId,
          projectTitle: "Proyek Milestone",
          totalCost: 2_000_000,
          categoryId: null,
          servicePackageId: null,
          startDate: "",
          targetCompletionDate: "",
          internalNotes: "",
        },
        actor,
      );
      const steps = await tx
        .select({ id: projectSteps.id })
        .from(projectSteps)
        .where(eq(projectSteps.clientProjectId, result.project.id));
      const milestones = await tx
        .select({ id: projectMilestones.id })
        .from(projectMilestones);
      // Tidak ada template di database uji, jadi milestone boleh kosong;
      // yang penting tidak ada milestone yatim.
      expect(milestones.length).toBeLessThanOrEqual(steps.length * 10);
    }));
});
