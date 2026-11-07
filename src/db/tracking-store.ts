import "server-only";
import { and, asc, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import type { Database } from "./connection";
import { siteSettings } from "./schema/settings";
import { rateLimits } from "./schema/rate-limits";
import { auditLogs } from "./schema/audit";
import { categories, servicePackages, inquiries } from "./schema/packages";
import { quoteRequests } from "./schema/calculator";
import {
  clientProjects,
  stepTemplates,
  projectSteps,
  projectMilestones,
  payments,
  projectInvoices,
  projectUpdates,
  projectDocuments,
  revisionRequests,
  projectComments,
  projectApprovals,
  privateFiles,
  type ClientProjectRow,
} from "./schema/portal";
import { settingsSchemas } from "@/schemas/site-settings";
import {
  clientProjectInput,
  leadConversionSchema,
  adminMutationSchema,
  clientMutationSchema,
  type UploadInput,
} from "@/schemas/tracking";
import { TrackingError } from "@/lib/tracking/errors";
import {
  assertInvoicePaymentCapacity,
  assertProjectPaymentCapacity,
} from "@/lib/invoices/policy";
import {
  assertProjectSession,
  defaultSteps,
  deriveCurrentStep,
  derivePayment,
  nextLoginCounter,
} from "@/lib/tracking/policy";
import {
  generateTrackingCode,
  generateTrackingPin,
  hashTrackingPin,
  trackingRateKey,
  verifyTrackingPin,
  type TrackingSession,
} from "@/lib/tracking/security";
import {
  initialRevisionStatus,
  nextRevisionState,
} from "@/lib/tracking/revision";
import {
  toAdminProject,
  toClientPortal,
  type TrackingBundle,
} from "@/lib/tracking/dto";

type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];
type Connection = Database | Tx;

async function settings(db: Connection) {
  const [row] = await db
    .select({ data: siteSettings.data })
    .from(siteSettings)
    .where(eq(siteSettings.id, 1));
  if (!row) throw new TrackingError("Site Settings belum diinisialisasi.");
  return settingsSchemas.tracking.parse(row.data.tracking);
}
async function project(
  db: Connection,
  id: string,
  lock: "update" | "share" = "update",
) {
  const [p] = await db
    .select()
    .from(clientProjects)
    .where(eq(clientProjects.id, id))
    .for(lock);
  if (!p || p.deletedAt) throw new TrackingError("Proyek tidak ditemukan.");
  return p;
}
async function clientProject(
  tx: Tx,
  session: TrackingSession,
  lock: "update" | "share" = "update",
) {
  if (!(await settings(tx)).trackingEnabled)
    throw new TrackingError("Portal klien sedang dinonaktifkan.");
  const p = await project(tx, session.projectId, lock);
  assertProjectSession(p, session);
  return p;
}
async function fileProject(
  tx: Tx,
  projectId: string,
  session?: TrackingSession,
  lock: "update" | "share" = "update",
) {
  const p = session
    ? await clientProject(tx, session, lock)
    : await project(tx, projectId, lock);
  if (p.id !== projectId) throw new TrackingError();
  return p;
}
async function bundle(
  db: Connection,
  p: ClientProjectRow,
): Promise<TrackingBundle> {
  const id = p.id;
  const steps = await db
    .select()
    .from(projectSteps)
    .where(eq(projectSteps.clientProjectId, id))
    .orderBy(asc(projectSteps.stepNumber));
  return {
    project: p,
    steps,
    milestones: steps.length
      ? await db
          .select()
          .from(projectMilestones)
          .where(
            inArray(
              projectMilestones.projectStepId,
              steps.map((s) => s.id),
            ),
          )
          .orderBy(asc(projectMilestones.sortOrder))
      : [],
    payments: await db
      .select()
      .from(payments)
      .where(eq(payments.clientProjectId, id))
      .orderBy(desc(payments.paidAt))
      .limit(1000),
    updates: await db
      .select()
      .from(projectUpdates)
      .where(eq(projectUpdates.clientProjectId, id))
      .orderBy(desc(projectUpdates.createdAt))
      .limit(1000),
    documents: await db
      .select()
      .from(projectDocuments)
      .where(eq(projectDocuments.clientProjectId, id))
      .orderBy(asc(projectDocuments.sortOrder))
      .limit(1000),
    revisions: await db
      .select()
      .from(revisionRequests)
      .where(eq(revisionRequests.clientProjectId, id))
      .orderBy(desc(revisionRequests.roundNumber))
      .limit(1000),
    comments: await db
      .select()
      .from(projectComments)
      .where(eq(projectComments.clientProjectId, id))
      .orderBy(desc(projectComments.createdAt))
      .limit(1000),
    approvals: await db
      .select()
      .from(projectApprovals)
      .where(eq(projectApprovals.clientProjectId, id))
      .orderBy(desc(projectApprovals.approvedAt))
      .limit(1000),
  };
}
async function recalculate(tx: Tx, p: ClientProjectRow) {
  const [paid] = await tx
    .select({ amount: sql<string>`coalesce(sum(${payments.amount}), 0)` })
    .from(payments)
    .where(eq(payments.clientProjectId, p.id));
  const [used] = await tx
    .select({ count: sql<number>`count(*)::int` })
    .from(revisionRequests)
    .where(
      and(
        eq(revisionRequests.clientProjectId, p.id),
        eq(revisionRequests.countsTowardQuota, true),
      ),
    );
  const steps = await tx
    .select()
    .from(projectSteps)
    .where(eq(projectSteps.clientProjectId, p.id));
  const amount = Number(paid.amount);
  if (
    !Number.isSafeInteger(amount) ||
    amount > 2_147_483_647 ||
    p.totalCost > 2_147_483_647
  )
    throw new TrackingError("Nilai pembayaran terlalu besar.");
  await tx
    .update(clientProjects)
    .set({
      ...derivePayment(p.totalCost, amount),
      revisionsUsed: used.count,
      currentStep: deriveCurrentStep(steps),
      updatedAt: new Date(),
    })
    .where(eq(clientProjects.id, p.id));
}
async function audit(
  tx: Tx,
  actorId: string | null,
  projectId: string,
  action: string,
  ipHash?: string,
) {
  await tx
    .insert(auditLogs)
    .values({
      actorId,
      actorType: actorId ? "admin" : "client",
      action,
      collection: "client-projects",
      docId: projectId,
      summary: `Portal klien: ${action}`,
      ipHash,
    });
}
async function attachments(tx: Tx, projectId: string, ids: string[]) {
  if (!ids.length) return [];
  const files = await tx
    .select()
    .from(privateFiles)
    .where(inArray(privateFiles.id, ids));
  if (
    files.length !== ids.length ||
    files.some(
      (f) => !f.verifiedAt || !f.key.startsWith(`tracking/${projectId}/files/`),
    )
  )
    throw new TrackingError("Lampiran tidak tersedia untuk proyek ini.");
  return files.map((f) => ({ fileId: f.id, filename: f.filename }));
}
async function revisionForProject(tx: Tx, projectId: string, id: string) {
  const [r] = await tx
    .select()
    .from(revisionRequests)
    .where(
      and(
        eq(revisionRequests.clientProjectId, projectId),
        eq(revisionRequests.id, id),
      ),
    )
    .for("update");
  if (!r) throw new TrackingError("Revisi tidak ditemukan.");
  return r;
}

export function createTrackingStore(db: Database) {
  return {
    settings: () => settings(db),
    async login(code: string, pin: string, ipHash: string, secret: string) {
      return db.transaction(async (tx) => {
        const config = await settings(tx);
        if (!config.trackingEnabled) return null;
        const now = new Date();
        const keys = [
          {
            scope: "tracking-ip",
            keyHash: trackingRateKey(secret, `ip:${ipHash}`),
            max: 50,
          },
          {
            scope: "tracking-code",
            keyHash: trackingRateKey(secret, `code:${code}`),
            max: config.maxLoginAttempts,
          },
          {
            scope: "tracking-pair",
            keyHash: trackingRateKey(secret, `pair:${code}:${ipHash}`),
            max: config.maxLoginAttempts,
          },
        ].sort((a, b) => a.scope.localeCompare(b.scope));
        const counters = [];
        for (const key of keys) {
          await tx
            .insert(rateLimits)
            .values({ ...key, count: 0, windowStartedAt: now })
            .onConflictDoNothing();
          const [row] = await tx
            .select()
            .from(rateLimits)
            .where(
              and(
                eq(rateLimits.scope, key.scope),
                eq(rateLimits.keyHash, key.keyHash),
              ),
            )
            .for("update");
          counters.push({ ...key, row });
        }
        const [p] = await tx
          .select()
          .from(clientProjects)
          .where(eq(clientProjects.trackingCode, code));
        const validPin = await verifyTrackingPin(pin, p?.accessPinHash);
        const locked = counters.some(
          ({ row }) => row.lockedUntil && row.lockedUntil > now,
        );
        const success =
          !!p && !p.archivedAt && !p.deletedAt && validPin && !locked;
        for (const counter of counters) {
          const next = nextLoginCounter(
            counter.row,
            counter.scope === "tracking-ip" ? false : success,
            now,
            counter.max,
            config.lockMinutes,
          );
          await tx
            .update(rateLimits)
            .set({ ...next, updatedAt: now })
            .where(
              and(
                eq(rateLimits.scope, counter.scope),
                eq(rateLimits.keyHash, counter.keyHash),
              ),
            );
        }
        if (!success) return null;
        await audit(tx, null, p.id, "login", ipHash);
        return {
          projectId: p.id,
          pinVersion: p.pinVersion,
          sessionMinutes: config.sessionMinutes,
        };
      });
    },
    async clientPortal(session: TrackingSession) {
      return db.transaction(async (tx) =>
        toClientPortal(
          await bundle(tx, await clientProject(tx, session, "share")),
        ),
      );
    },
    async consumeBudget(
      session: TrackingSession,
      ipHash: string,
      approval = false,
    ) {
      const rows = await db.execute(sql`
        INSERT INTO rate_limits (scope, key_hash, count, window_started_at, updated_at)
        VALUES (${approval ? "tracking-approval" : "tracking-mutation"}, ${`${session.projectId}:${ipHash}`}, 1, statement_timestamp(), statement_timestamp())
        ON CONFLICT (scope, key_hash) DO UPDATE SET
          count = CASE WHEN rate_limits.window_started_at + interval '15 minutes' <= statement_timestamp() THEN 1 ELSE rate_limits.count + 1 END,
          window_started_at = CASE WHEN rate_limits.window_started_at + interval '15 minutes' <= statement_timestamp() THEN statement_timestamp() ELSE rate_limits.window_started_at END,
          updated_at = statement_timestamp()
        WHERE rate_limits.window_started_at + interval '15 minutes' <= statement_timestamp() OR rate_limits.count < ${approval ? 5 : 20}
        RETURNING count`);
      if (!rows.length)
        throw new TrackingError(
          "Terlalu banyak permintaan. Coba lagi dalam 15 menit.",
        );
    },
    async clientMutate(
      session: TrackingSession,
      input: unknown,
      ipHash: string,
      userAgent: string,
    ) {
      const value = clientMutationSchema.parse(input);
      return db.transaction(async (tx) => {
        const p = await clientProject(tx, session);
        const now = new Date();
        if (value.kind === "comment") {
          if (value.revisionRequestId)
            await revisionForProject(tx, p.id, value.revisionRequestId);
          await tx
            .insert(projectComments)
            .values({
              clientProjectId: p.id,
              authorType: "client",
              authorName: p.clientName,
              body: value.body,
              revisionRequestId: value.revisionRequestId,
              attachments: await attachments(tx, p.id, value.fileIds),
            });
        } else if (value.kind === "revision") {
          const config = await settings(tx);
          const [handover] = await tx
            .select()
            .from(projectApprovals)
            .where(
              and(
                eq(projectApprovals.clientProjectId, p.id),
                eq(projectApprovals.type, "final_handover"),
              ),
            )
            .limit(1);
          const warranty =
            value.type === "bug" &&
            handover &&
            now.getTime() - handover.approvedAt.getTime() <=
              config.bugWarrantyDays * 86400_000;
          const review =
            p.isReviewOpen &&
            p.reviewOpenedAt &&
            now.getTime() - p.reviewOpenedAt.getTime() <=
              config.revisionWindowDays * 86400_000;
          if (!review && !warranty)
            throw new TrackingError(
              "Periode review atau garansi belum dibuka atau sudah berakhir.",
            );
          const [last] = await tx
            .select({
              round: sql<number>`coalesce(max(${revisionRequests.roundNumber}),0)::int`,
            })
            .from(revisionRequests)
            .where(eq(revisionRequests.clientProjectId, p.id));
          await tx
            .insert(revisionRequests)
            .values({
              clientProjectId: p.id,
              roundNumber: last.round + 1,
              type: value.type,
              title: value.title,
              description: value.description,
              status: initialRevisionStatus(
                value.type,
                p.revisionsUsed,
                p.revisionsIncluded,
              ),
              attachments: await attachments(tx, p.id, value.fileIds),
            });
        } else if (value.kind === "quote") {
          const r = await revisionForProject(tx, p.id, value.revisionId);
          const next = nextRevisionState(
            r,
            value.accept ? "CLIENT_ACCEPT_QUOTE" : "CLIENT_REJECT_QUOTE",
            p.revisionsUsed,
            p.revisionsIncluded,
          );
          await tx
            .update(revisionRequests)
            .set({
              status: next.status,
              clientAcceptedQuoteAt: value.accept ? now : null,
              resolvedAt: value.accept ? null : now,
              updatedAt: now,
            })
            .where(eq(revisionRequests.id, r.id));
        } else {
          if (!(await verifyTrackingPin(value.pin, p.accessPinHash)))
            throw new TrackingError("PIN tidak sesuai.");
          if (value.type === "step_review" && !p.isReviewOpen)
            throw new TrackingError("Review belum dibuka.");
          const steps = await tx
            .select()
            .from(projectSteps)
            .where(eq(projectSteps.clientProjectId, p.id));
          if (
            value.type === "final_handover" &&
            (p.balance > 0 ||
              steps.filter((s) => s.stepNumber <= 5 && s.status === "done")
                .length !== 5)
          )
            throw new TrackingError(
              "Serah terima membutuhkan tahap 1–5 selesai dan pembayaran lunas.",
            );
          const pending = await tx
            .select({ id: revisionRequests.id })
            .from(revisionRequests)
            .where(
              and(
                eq(revisionRequests.clientProjectId, p.id),
                inArray(revisionRequests.status, [
                  "submitted",
                  "accepted",
                  "in_progress",
                  "needs_payment",
                ]),
              ),
            )
            .limit(1);
          if (pending.length)
            throw new TrackingError(
              "Selesaikan atau tolak revisi terbuka sebelum menyetujui hasil.",
            );
          const existing = await tx
            .select({ id: projectApprovals.id })
            .from(projectApprovals)
            .where(
              and(
                eq(projectApprovals.clientProjectId, p.id),
                eq(projectApprovals.type, value.type),
              ),
            )
            .limit(1);
          if (existing.length)
            throw new TrackingError("Persetujuan ini sudah dicatat.");
          await tx
            .insert(projectApprovals)
            .values({
              clientProjectId: p.id,
              type: value.type,
              approvedByName: value.name,
              note: value.note,
              ipHash,
              userAgent: userAgent.slice(0, 1000),
            });
          await tx
            .update(clientProjects)
            .set({ isReviewOpen: false, updatedAt: now })
            .where(eq(clientProjects.id, p.id));
          await tx
            .update(projectSteps)
            .set({ status: "done", completedAt: now, updatedAt: now })
            .where(
              and(
                eq(projectSteps.clientProjectId, p.id),
                eq(
                  projectSteps.stepNumber,
                  value.type === "final_handover" ? 6 : 5,
                ),
              ),
            );
        }
        await recalculate(tx, p);
        await audit(tx, null, p.id, value.kind, ipHash);
      });
    },
    async listAdmin() {
      const rows = await db
        .select()
        .from(clientProjects)
        .where(isNull(clientProjects.deletedAt))
        .orderBy(desc(clientProjects.updatedAt))
        .limit(200);
      return rows.map(toAdminProject);
    },
    async adminOptions() {
      return {
        categories: await db
          .select({ id: categories.id, name: categories.name })
          .from(categories)
          .orderBy(asc(categories.name)),
        packages: await db
          .select({ id: servicePackages.id, name: servicePackages.name })
          .from(servicePackages)
          .where(isNull(servicePackages.deletedAt))
          .orderBy(asc(servicePackages.name)),
      };
    },
    async adminDetail(id: string) {
      return db.transaction(async (tx) => {
        const data = await bundle(tx, await project(tx, id, "share"));
        return { ...data, project: toAdminProject(data.project) };
      });
    },
    async createProject(input: unknown, actorId: string) {
      const value = clientProjectInput.parse(input);
      const pin = generateTrackingPin();
      const accessPinHash = await hashTrackingPin(pin);
      return db.transaction(async (tx) => {
        const config = await settings(tx);
        let included = value.revisionsIncluded;
        let extra = value.extraRevisionPrice;
        let revisionPolicy = config.revisionPolicy;
        if (value.servicePackageId) {
          const [pack] = await tx
            .select()
            .from(servicePackages)
            .where(
              and(
                eq(servicePackages.id, value.servicePackageId),
                isNull(servicePackages.deletedAt),
              ),
            );
          if (!pack) throw new TrackingError("Paket tidak tersedia.");
          included = pack.includedRevisions;
          extra = pack.extraRevisionPrice;
          revisionPolicy = pack.revisionPolicy ?? revisionPolicy;
          if (included > 32767)
            throw new TrackingError("Kuota revisi paket terlalu besar.");
        }
        for (let attempt = 0; attempt < 5; attempt++) {
          const [p] = await tx
            .insert(clientProjects)
            .values({
              ...value,
              revisionsIncluded: included,
              extraRevisionPrice: extra,
              revisionPolicySnapshot: revisionPolicy,
              balance: value.totalCost,
              trackingCode: generateTrackingCode(),
              accessPinHash,
            })
            .onConflictDoNothing({ target: clientProjects.trackingCode })
            .returning();
          if (!p) continue;
          const templates = await tx
            .select()
            .from(stepTemplates)
            .orderBy(asc(stepTemplates.stepNumber));
          for (let i = 0; i < 6; i++) {
            const template = templates.find((t) => t.stepNumber === i + 1);
            const [step] = await tx
              .insert(projectSteps)
              .values({
                clientProjectId: p.id,
                stepNumber: i + 1,
                title: template?.title ?? defaultSteps[i],
                description: template?.description ?? "",
                sortOrder: i,
              })
              .returning();
            if (template?.defaultMilestones.length)
              await tx
                .insert(projectMilestones)
                .values(
                  template.defaultMilestones.map((title, sortOrder) => ({
                    projectStepId: step.id,
                    title,
                    sortOrder,
                  })),
                );
          }
          await audit(tx, actorId, p.id, "create");
          return { project: toAdminProject(p), pin };
        }
        throw new TrackingError(
          "Kode proyek belum berhasil dibuat. Coba kembali.",
        );
      });
    },
    /**
     * Konversi lead menjadi proyek klien dalam satu transaksi.
     *
     * Semua langkah (baca lead, buat proyek, buat 6 tahap, tandai lead
     * `converted`, tulis audit) berada di transaksi yang sama. Bila salah satu
     * gagal, tidak ada proyek setengah jadi dan lead tidak berubah status.
     *
     * Idempotensi dijaga dua lapis: unique index pada `source_inquiry_id` /
     * `source_quote_request_id`, dan pemeriksaan awal yang mengembalikan proyek
     * yang sudah ada alih-alih membuat duplikat.
     */
    async convertLead(input: unknown, actorId: string) {
      const value = leadConversionSchema.parse(input);
      const pin = generateTrackingPin();
      const accessPinHash = await hashTrackingPin(pin);
      return db.transaction(async (tx) => {
        const config = await settings(tx);
        let included = 0;
        let extra: number | null = null;
        let revisionPolicy = config.revisionPolicy;
        let clientName: string;
        let clientWhatsapp: string;
        let clientEmail: string | null = null;
        let sourceLabel: string;

        if (value.source === "inquiry") {
          const [row] = await tx
            .select()
            .from(inquiries)
            .where(eq(inquiries.id, value.sourceId))
            .for("update");
          if (!row) throw new TrackingError("Inquiry tidak ditemukan.");
          clientName = row.name;
          clientWhatsapp = row.whatsapp;
          clientEmail = row.email;
          sourceLabel = `inquiry ${row.reference}`;
        } else {
          const [row] = await tx
            .select()
            .from(quoteRequests)
            .where(eq(quoteRequests.id, value.sourceId))
            .for("update");
          if (!row) throw new TrackingError("Permintaan estimasi tidak ditemukan.");
          if (!row.contactName || !row.contactWhatsapp)
            throw new TrackingError(
              "Estimasi ini tidak memuat nama dan WhatsApp, lengkapi lewat inquiry.",
            );
          clientName = row.contactName;
          clientWhatsapp = row.contactWhatsapp;
          sourceLabel = `estimasi ${row.reference}`;
        }

        const existing = await tx
          .select({ id: clientProjects.id, trackingCode: clientProjects.trackingCode })
          .from(clientProjects)
          .where(
            value.source === "inquiry"
              ? eq(clientProjects.sourceInquiryId, value.sourceId)
              : eq(clientProjects.sourceQuoteRequestId, value.sourceId),
          )
          .limit(1);
        const linked = existing[0];
        if (linked)
          throw new TrackingError(
            `Lead ini sudah dikonversi menjadi proyek ${linked.trackingCode}.`,
          );

        if (value.servicePackageId) {
          const [pack] = await tx
            .select()
            .from(servicePackages)
            .where(
              and(
                eq(servicePackages.id, value.servicePackageId),
                isNull(servicePackages.deletedAt),
              ),
            );
          if (!pack) throw new TrackingError("Paket tidak tersedia.");
          included = pack.includedRevisions;
          extra = pack.extraRevisionPrice;
          revisionPolicy = pack.revisionPolicy ?? revisionPolicy;
        }

        let created: typeof clientProjects.$inferSelect | undefined;
        for (let attempt = 0; attempt < 5; attempt++) {
          const [p] = await tx
            .insert(clientProjects)
            .values({
              clientName,
              clientWhatsapp,
              clientEmail,
              projectTitle: value.projectTitle,
              totalCost: value.totalCost,
              revisionsIncluded: included,
              extraRevisionPrice: extra,
              revisionPolicySnapshot: revisionPolicy,
              categoryId: value.categoryId,
              servicePackageId: value.servicePackageId,
              startDate: value.startDate || null,
              targetCompletionDate: value.targetCompletionDate || null,
              internalNotes: value.internalNotes,
              clientVisibility: {
                staging: false,
                production: false,
                github: false,
                payments: false,
                documents: false,
                timeline: false,
              },
              balance: value.totalCost,
              trackingCode: generateTrackingCode(),
              accessPinHash,
              sourceInquiryId: value.source === "inquiry" ? value.sourceId : null,
              sourceQuoteRequestId:
                value.source === "quote" ? value.sourceId : null,
            })
            .onConflictDoNothing({ target: clientProjects.trackingCode })
            .returning();
          if (!p) continue;
          created = p;
          break;
        }
        if (!created)
          throw new TrackingError("Kode proyek belum berhasil dibuat. Coba kembali.");

        const templates = await tx
          .select()
          .from(stepTemplates)
          .orderBy(asc(stepTemplates.stepNumber));
        for (let i = 0; i < 6; i++) {
          const template = templates.find((t) => t.stepNumber === i + 1);
          const [step] = await tx
            .insert(projectSteps)
            .values({
              clientProjectId: created.id,
              stepNumber: i + 1,
              title: template?.title ?? defaultSteps[i],
              description: template?.description ?? "",
              sortOrder: i,
            })
            .returning();
          if (template?.defaultMilestones.length && step)
            await tx.insert(projectMilestones).values(
              template.defaultMilestones.map((title, sortOrder) => ({
                projectStepId: step.id,
                title,
                sortOrder,
              })),
            );
        }

        if (value.source === "inquiry") {
          await tx
            .update(inquiries)
            .set({ status: "converted", updatedAt: new Date() })
            .where(eq(inquiries.id, value.sourceId));
        } else {
          await tx
            .update(quoteRequests)
            .set({ status: "converted", updatedAt: new Date() })
            .where(eq(quoteRequests.id, value.sourceId));
        }

        await audit(tx, actorId, created.id, "create");
        await tx.insert(auditLogs).values({
          actorId,
          actorType: "admin",
          action: "update",
          collection: value.source === "inquiry" ? "inquiries" : "quotes",
          docId: value.sourceId,
          summary: `Menandai ${sourceLabel} sebagai terkonversi ke proyek ${created.trackingCode}`,
        });

        return { project: toAdminProject(created), pin };
      });
    },
    async adminMutate(id: string, input: unknown, actorId: string) {
      const value = adminMutationSchema.parse(input);
      const pin = value.kind === "pin" ? generateTrackingPin() : undefined;
      const pinHash = pin ? await hashTrackingPin(pin) : undefined;      return db.transaction(async (tx) => {
        const p = await project(tx, id);
        const now = new Date();
        if (value.kind === "update") {
          Object.assign(p, value.value);
          await tx
            .update(clientProjects)
            .set({
              ...value.value,
              ...derivePayment(p.totalCost, p.paidAmount),
              updatedAt: now,
            })
            .where(eq(clientProjects.id, id));
        } else if (value.kind === "pin") {
          await tx
            .update(clientProjects)
            .set({
              accessPinHash: pinHash!,
              pinVersion: p.pinVersion + 1,
              updatedAt: now,
            })
            .where(eq(clientProjects.id, id));
        } else if (value.kind === "archive") {
          await tx
            .update(clientProjects)
            .set({ archivedAt: value.archived ? now : null, updatedAt: now })
            .where(eq(clientProjects.id, id));
        } else if (value.kind === "review") {
          if (value.open) {
            const existing = await tx
              .select({ id: projectApprovals.id })
              .from(projectApprovals)
              .where(
                and(
                  eq(projectApprovals.clientProjectId, id),
                  eq(projectApprovals.type, "step_review"),
                ),
              )
              .limit(1);
            if (existing.length)
              throw new TrackingError("Hasil sudah disetujui klien.");
            await tx
              .update(projectSteps)
              .set({
                status: "in_progress",
                startedAt: now,
                completedAt: null,
                updatedAt: now,
              })
              .where(
                and(
                  eq(projectSteps.clientProjectId, id),
                  eq(projectSteps.stepNumber, 5),
                ),
              );
          }
          await tx
            .update(clientProjects)
            .set({
              isReviewOpen: value.open,
              reviewOpenedAt: value.open ? now : p.reviewOpenedAt,
              updatedAt: now,
            })
            .where(eq(clientProjects.id, id));
        } else if (value.kind === "step") {
          const [step] = await tx
            .update(projectSteps)
            .set({
              title: value.title,
              description: value.description,
              status: value.status,
              startedAt: value.status === "pending" ? null : now,
              completedAt: value.status === "done" ? now : null,
              updatedAt: now,
            })
            .where(
              and(
                eq(projectSteps.clientProjectId, id),
                eq(projectSteps.stepNumber, value.stepNumber),
              ),
            )
            .returning();
          if (!step) throw new TrackingError("Tahap tidak ditemukan.");
          await tx
            .delete(projectMilestones)
            .where(eq(projectMilestones.projectStepId, step.id));
          if (value.milestones.length)
            await tx
              .insert(projectMilestones)
              .values(
                value.milestones.map((m, sortOrder) => ({
                  ...m,
                  sortOrder,
                  projectStepId: step.id,
                  completedAt: m.isCompleted ? now : null,
                })),
              );
        } else if (value.kind === "payment") {
          if (value.proofFileId) await attachments(tx, id, [value.proofFileId]);
          let previousPayment: { amount: number; invoiceId: string | null } | null = null;
          if (value.id) {
            const [existing] = await tx
              .select({ amount: payments.amount, invoiceId: payments.invoiceId })
              .from(payments)
              .where(
                and(
                  eq(payments.clientProjectId, id),
                  eq(payments.id, value.id),
                ),
              )
              .for("update");
            if (!existing) throw new TrackingError("Pembayaran tidak ditemukan.");
            previousPayment = existing;
          }
          const invoiceId = value.invoiceId === undefined
            ? previousPayment?.invoiceId ?? null
            : value.invoiceId;
          if (invoiceId) {
            const [invoice] = await tx
              .select()
              .from(projectInvoices)
              .where(
                and(
                  eq(projectInvoices.id, invoiceId),
                  eq(projectInvoices.clientProjectId, id),
                ),
              )
              .for("update");
            if (!invoice || invoice.status !== "issued")
              throw new TrackingError("Invoice tidak ditemukan atau belum terbit.");
            const [allocated] = await tx
              .select({ amount: sql<number>`coalesce(sum(${payments.amount}), 0)` })
              .from(payments)
              .where(eq(payments.invoiceId, invoiceId));
            const previousAllocation = previousPayment?.invoiceId === invoiceId
              ? previousPayment.amount
              : 0;
            assertInvoicePaymentCapacity({
              invoiceAmount: invoice.amount,
              allocatedAmount: Number(allocated.amount ?? 0),
              previousAllocation,
              paymentAmount: value.amount,
            });
          }
          const [paidTotal] = await tx
            .select({ amount: sql<number>`coalesce(sum(${payments.amount}), 0)` })
            .from(payments)
            .where(eq(payments.clientProjectId, id));
          assertProjectPaymentCapacity({
            projectTotal: p.totalCost,
            paidAmount: Number(paidTotal.amount ?? 0),
            previousPaymentAmount: previousPayment?.amount ?? 0,
            paymentAmount: value.amount,
          });
          const entry = {
            amount: value.amount,
            paidAt: new Date(value.paidAt),
            method: value.method,
            note: value.note,
            proofFileId: value.proofFileId,
            isVisibleToClient: value.isVisibleToClient,
            invoiceId,
            updatedAt: now,
          };
          if (value.id) {
            const changed = await tx
              .update(payments)
              .set(entry)
              .where(
                and(
                  eq(payments.clientProjectId, id),
                  eq(payments.id, value.id),
                ),
              )
              .returning({ id: payments.id });
            if (!changed.length)
              throw new TrackingError("Pembayaran tidak ditemukan.");
          } else
            await tx.insert(payments).values({ ...entry, clientProjectId: id });
        } else if (value.kind === "deletePayment") {
          await tx
            .delete(payments)
            .where(
              and(eq(payments.clientProjectId, id), eq(payments.id, value.id)),
            );
        } else if (value.kind === "updatePost") {
          await tx.insert(projectUpdates).values({
            clientProjectId: id,
            title: value.title,
            body: {
              version: 1,
              blocks: [
                {
                  type: "paragraph",
                  children: [{ type: "text", text: value.body }],
                },
              ],
            },
            isVisibleToClient: value.isVisibleToClient,
            createdById: actorId,
          });
        } else if (value.kind === "document") {
          if (value.fileId) await attachments(tx, id, [value.fileId]);
          await tx
            .insert(projectDocuments)
            .values({
              clientProjectId: id,
              title: value.title,
              type: value.url ? "url" : "file",
              url: value.url,
              fileId: value.fileId,
              isVisibleToClient: value.isVisibleToClient,
            });
        } else if (value.kind === "deleteDocument") {
          await tx
            .delete(projectDocuments)
            .where(
              and(
                eq(projectDocuments.clientProjectId, id),
                eq(projectDocuments.id, value.id),
              ),
            );
        } else if (value.kind === "comment") {
          if (value.revisionRequestId)
            await revisionForProject(tx, id, value.revisionRequestId);
          await tx
            .insert(projectComments)
            .values({
              clientProjectId: id,
              authorType: "admin",
              authorName: "OpenByte Labs",
              body: value.body,
              isInternal: value.isInternal,
              revisionRequestId: value.revisionRequestId,
              attachments: await attachments(tx, id, value.fileIds),
            });
        } else {
          const r = await revisionForProject(tx, id, value.id);
          const next = nextRevisionState(
            r,
            value.event,
            p.revisionsUsed,
            p.revisionsIncluded,
            value,
          );
          await tx
            .update(revisionRequests)
            .set({
              status: next.status,
              ...(value.event === "ACCEPT"
                ? {
                    countsTowardQuota: next.countsTowardQuota,
                    isExtra: next.isExtra,
                  }
                : {}),
              ...(value.event === "SET_QUOTE"
                ? {
                    quotedPrice: value.quotedPrice!,
                    clientAcceptedQuoteAt: null,
                  }
                : {}),
              ...(value.adminResponse !== undefined
                ? { adminResponse: value.adminResponse }
                : {}),
              ...(["done", "rejected"].includes(next.status)
                ? { resolvedAt: now }
                : {}),
              updatedAt: now,
            })
            .where(eq(revisionRequests.id, r.id));
          if (next.totalCostDelta) {
            p.totalCost += next.totalCostDelta;
            if (p.totalCost > 2_147_483_647)
              throw new TrackingError("Total biaya terlalu besar.");
            await tx
              .update(clientProjects)
              .set({
                totalCost: p.totalCost,
                balance: p.totalCost - p.paidAmount,
              })
              .where(eq(clientProjects.id, id));
          }
        }
        await recalculate(tx, p);
        await audit(tx, actorId, id, value.kind);
        return { pin };
      });
    },
    async registerUpload(
      projectId: string,
      input: UploadInput,
      key: string,
      actorId: string | null,
      session?: TrackingSession,
    ) {
      return db.transaction(async (tx) => {
        await fileProject(tx, projectId, session);
        const [file] = await tx
          .insert(privateFiles)
          .values({
            ...input,
            key,
            uploadedByType: actorId ? "admin" : "client",
            uploadedByAdminId: actorId,
          })
          .returning();
        return file.id;
      });
    },
    async uploadFile(
      projectId: string,
      fileId: string,
      session?: TrackingSession,
    ) {
      return db.transaction(async (tx) => {
        await fileProject(tx, projectId, session);
        const [file] = await tx
          .select()
          .from(privateFiles)
          .where(eq(privateFiles.id, fileId));
        if (!file || !file.key.startsWith(`tracking/${projectId}/pending/`))
          throw new TrackingError("Unggahan tidak ditemukan.");
        return file;
      });
    },
    async finalizeUpload(
      projectId: string,
      fileId: string,
      key: string,
      previousKey: string,
      session?: TrackingSession,
    ) {
      return db.transaction(async (tx) => {
        await fileProject(tx, projectId, session);
        if (
          !key.startsWith(`tracking/${projectId}/files/`) ||
          !previousKey.startsWith(`tracking/${projectId}/pending/`)
        )
          throw new TrackingError();
        const rows = await tx
          .update(privateFiles)
          .set({ key, verifiedAt: new Date() })
          .where(
            and(eq(privateFiles.id, fileId), eq(privateFiles.key, previousKey)),
          )
          .returning({ id: privateFiles.id });
        if (!rows.length) throw new TrackingError("Unggahan sudah diproses.");
      });
    },
    async downloadFile(
      projectId: string,
      fileId: string,
      session?: TrackingSession,
    ) {
      return db.transaction(async (tx) => {
        const p = await fileProject(tx, projectId, session, "share");
        if (session) {
          const portal = toClientPortal(await bundle(tx, p));
          const permitted =
            portal.documents.some((d) => d.fileId === fileId) ||
            portal.payment?.history.some((v) => v.proofFileId === fileId) ||
            portal.comments.some((c) =>
              c.attachments.some((a) => a.fileId === fileId),
            ) ||
            portal.revisions.some((r) =>
              r.attachments.some((a) => a.fileId === fileId),
            );
          if (!permitted) throw new TrackingError("Berkas tidak tersedia.");
        }
        const [file] = await tx
          .select()
          .from(privateFiles)
          .where(eq(privateFiles.id, fileId));
        if (
          !file?.verifiedAt ||
          !file.key.startsWith(`tracking/${projectId}/files/`)
        )
          throw new TrackingError("Berkas tidak tersedia.");
        return file;
      });
    },
  };
}
export type TrackingStore = ReturnType<typeof createTrackingStore>;
