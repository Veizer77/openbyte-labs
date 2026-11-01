"use server";

import { and, desc, eq, isNull, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { authorize } from "@/access/rules";
import { getDb } from "@/db";
import { auditLogs } from "@/db/schema/audit";
import { clientProjects, payments, projectInvoices } from "@/db/schema/portal";
import { projectInvoiceInputSchema } from "@/schemas/project-invoices";
import { createTrackingStore } from "@/db/tracking-store";
import {
  assertActiveInvoiceTotal,
  assertInvoiceCoversAllocatedPayments,
} from "@/lib/invoices/policy";
import { trackingFailure } from "@/lib/server/tracking-result";
import { InvoiceError } from "@/lib/invoices/errors";
import { ok, toFailure, type ActionResult } from "../result";

const idSchema = z.uuid();

export type InvoiceListRecord = {
  id: string;
  clientProjectId: string;
  projectTitle: string;
  clientName: string;
  invoiceNumber: string;
  title: string;
  amount: number;
  dueAt: string;
  status: "draft" | "issued" | "void";
  note: string;
  paidAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function listInvoiceProjectsAction(): Promise<
  ActionResult<Array<{ id: string; projectTitle: string; clientName: string; totalCost: number }>>
> {
  try {
    const principal = await requireAdmin();
    authorize(principal, "client-projects", "read");
    const rows = await getDb()
      .select({
        id: clientProjects.id,
        projectTitle: clientProjects.projectTitle,
        clientName: clientProjects.clientName,
        totalCost: clientProjects.totalCost,
      })
      .from(clientProjects)
      .where(and(isNull(clientProjects.archivedAt), isNull(clientProjects.deletedAt)))
      .orderBy(desc(clientProjects.createdAt));
    return ok(rows);
  } catch (error) {
    return toFailure(error);
  }
}

export async function listInvoicesAction(): Promise<ActionResult<InvoiceListRecord[]>> {
  try {
    const principal = await requireAdmin();
    authorize(principal, "client-projects", "read");
    const rows = await getDb()
      .select({
        id: projectInvoices.id,
        clientProjectId: projectInvoices.clientProjectId,
        projectTitle: clientProjects.projectTitle,
        clientName: clientProjects.clientName,
        invoiceNumber: projectInvoices.invoiceNumber,
        title: projectInvoices.title,
        amount: projectInvoices.amount,
        dueAt: projectInvoices.dueAt,
        status: projectInvoices.status,
        note: projectInvoices.note,
        paidAmount: sql<number>`coalesce(sum(${payments.amount}), 0)`,
        createdAt: projectInvoices.createdAt,
        updatedAt: projectInvoices.updatedAt,
      })
      .from(projectInvoices)
      .innerJoin(clientProjects, eq(projectInvoices.clientProjectId, clientProjects.id))
      .leftJoin(payments, eq(payments.invoiceId, projectInvoices.id))
      .where(isNull(clientProjects.deletedAt))
      .groupBy(projectInvoices.id, clientProjects.id)
      .orderBy(desc(projectInvoices.createdAt))
      .limit(200);
    return ok(rows.map((row) => ({ ...row, paidAmount: Number(row.paidAmount) })));
  } catch (error) {
    return toFailure(error);
  }
}

export async function saveInvoiceAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { id, value: rawValue } = z
      .object({ id: idSchema.nullable(), value: z.unknown() })
      .strict()
      .parse(input);
    const value = projectInvoiceInputSchema.parse(rawValue);
    const principal = await requireAdmin();
    authorize(principal, "client-projects", id ? "update" : "create");
    const db = getDb();

    const savedId = await db.transaction(async (tx) => {
      let invoiceId = id;
      const [project] = await tx
        .select()
        .from(clientProjects)
        .where(eq(clientProjects.id, value.clientProjectId))
        .for("update");
      if (!project || project.deletedAt) throw new InvoiceError("Proyek klien tidak ditemukan.");

      const [duplicate] = await tx
        .select({ id: projectInvoices.id })
        .from(projectInvoices)
        .where(eq(projectInvoices.invoiceNumber, value.invoiceNumber))
        .limit(1);
      if (duplicate && duplicate.id !== id) throw new InvoiceError("Nomor invoice sudah digunakan.");

      let current: typeof projectInvoices.$inferSelect | null = null;
      if (id) {
        const [row] = await tx
          .select()
          .from(projectInvoices)
          .where(eq(projectInvoices.id, id))
          .for("update");
        if (!row || row.clientProjectId !== value.clientProjectId) throw new InvoiceError("Invoice tidak ditemukan pada proyek tersebut.");
        if (row.status === "void") throw new InvoiceError("Invoice yang sudah dibatalkan tidak dapat diubah.");
        if (row.status === "issued" && value.status === "draft") throw new InvoiceError("Invoice terbit tidak dapat dikembalikan menjadi draft.");
        current = row;
      } else if (value.status === "void") {
        throw new InvoiceError("Buat invoice sebagai draft atau terbit sebelum membatalkan.");
      }

      const [allocation] = await tx
        .select({ amount: sql<number>`coalesce(sum(${payments.amount}), 0)` })
        .from(payments)
        .where(current ? eq(payments.invoiceId, current.id) : sql`false`);
      const paidAmount = Number(allocation.amount ?? 0);
      assertInvoiceCoversAllocatedPayments(value.amount, paidAmount);
      if (value.status === "void" && paidAmount > 0) throw new InvoiceError("Invoice yang sudah memiliki pembayaran tidak dapat dibatalkan.");

      const conditions = [
        eq(projectInvoices.clientProjectId, value.clientProjectId),
        ne(projectInvoices.status, "void"),
      ];
      if (id) conditions.push(ne(projectInvoices.id, id));
      const [activeTotal] = await tx
        .select({ amount: sql<number>`coalesce(sum(${projectInvoices.amount}), 0)` })
        .from(projectInvoices)
        .where(and(...conditions));
      assertActiveInvoiceTotal(
        project.totalCost,
        Number(activeTotal.amount ?? 0),
        value.status === "void" ? 0 : value.amount,
      );

      const now = new Date();
      if (id) {
        await tx
          .update(projectInvoices)
          .set({ ...value, updatedAt: now })
          .where(eq(projectInvoices.id, id));
      } else {
        const [created] = await tx
          .insert(projectInvoices)
          .values({ ...value, createdById: principal.id, updatedAt: now })
          .returning({ id: projectInvoices.id });
        if (!created) throw new InvoiceError("Invoice tidak dapat dibuat.");
        invoiceId = created.id;
      }
      await tx.insert(auditLogs).values({
        actorId: principal.id,
        actorType: "admin",
        action: current ? "update" : "create",
        collection: "project-invoices",
        docId: invoiceId!,
        summary: `${current ? "Memperbarui" : "Membuat"} invoice ${value.invoiceNumber}`,
      });
      return invoiceId!;
    });
    return ok({ id: savedId });
  } catch (error) {
    return toFailure(error);
  }
}

export async function recordInvoicePaymentAction(
  input: unknown,
): Promise<ActionResult<{ invoiceId: string }>> {
  try {
    const value = z
      .object({
        invoiceId: idSchema,
        amount: z.number().int().min(1).max(2_147_483_647),
        paidAt: z.iso.datetime({ offset: true }),
        method: z.enum(["transfer", "tunai", "qris"]),
        note: z.string().max(2_000),
        isVisibleToClient: z.boolean(),
      })
      .strict()
      .parse(input);
    const principal = await requireAdmin();
    authorize(principal, "client-projects", "update");
    const [invoice] = await getDb()
      .select({ id: projectInvoices.id, clientProjectId: projectInvoices.clientProjectId, status: projectInvoices.status })
      .from(projectInvoices)
      .where(eq(projectInvoices.id, value.invoiceId));
    if (!invoice || invoice.status !== "issued") throw new InvoiceError("Hanya invoice terbit yang dapat menerima pembayaran.");
    await createTrackingStore(getDb()).adminMutate(
      invoice.clientProjectId,
      {
        kind: "payment",
        id: null,
        invoiceId: value.invoiceId,
        amount: value.amount,
        paidAt: value.paidAt,
        method: value.method,
        note: value.note,
        isVisibleToClient: value.isVisibleToClient,
        proofFileId: null,
      },
      principal.id,
    );
    return ok({ invoiceId: value.invoiceId });
  } catch (error) {
    return trackingFailure(error, "input_tidak_valid");
  }
}
