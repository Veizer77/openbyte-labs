import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql as query } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "@/db/connection";
import { createTrackingStore, type TrackingStore } from "@/db/tracking-store";
import { authUser } from "@/db/schema/admin-identity";
import { adminProfiles } from "@/db/schema/admin-profile";
import { siteSettings } from "@/db/schema/settings";
import { clientProjects, projectApprovals } from "@/db/schema/portal";
import { defaultSiteSettings } from "@/seed/site-settings-defaults";
import {
  signTrackingSession,
  readTrackingSession,
  trackingRateKey,
  type TrackingSession,
} from "@/lib/tracking/security";
import type { ClientProjectInput } from "@/schemas/tracking";
import { requireTestDatabaseUri } from "./target";

let connection: postgres.Sql;
let db: Database;
type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];
const secret = "integration-tracking-secret-at-least-32-characters";
const ip = "a".repeat(64);
const input: ClientProjectInput = {
  clientName: "Integration Client",
  clientWhatsapp: "081234567890",
  clientEmail: "client@example.test",
  projectTitle: "Integration Project",
  categoryId: null,
  servicePackageId: null,
  totalCost: 1000000,
  revisionsIncluded: 1,
  extraRevisionPrice: 250000,
  stagingUrl: "https://staging.example.test",
  productionUrl: "",
  githubUrl: "",
  startDate: "",
  targetCompletionDate: "",
  internalNotes: "DO_NOT_EXPOSE",
  clientVisibility: {
    staging: false,
    production: false,
    github: false,
    payments: false,
    documents: false,
    timeline: false,
  },
};
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

/** Every fixture, setting change, login attempt and audit entry rolls back. */
async function fixture(
  run: (ctx: {
    tx: Tx;
    store: TrackingStore;
    actor: string;
    a: Awaited<ReturnType<TrackingStore["createProject"]>>;
    b: Awaited<ReturnType<TrackingStore["createProject"]>>;
    session: TrackingSession;
  }) => Promise<void>,
) {
  const rollback = new Error("rollback-tracking-fixture");
  try {
    await db.transaction(async (tx) => {
      const settings = defaultSiteSettings();
      settings.tracking.trackingEnabled = true;
      settings.tracking.revisionWindowDays = 14;
      settings.tracking.bugWarrantyDays = 30;
      await tx
        .insert(siteSettings)
        .values({ id: 1, data: settings })
        .onConflictDoUpdate({
          target: siteSettings.id,
          set: { data: settings },
        });
      const actor = randomUUID();
      await tx
        .insert(authUser)
        .values({
          id: actor,
          name: "Integration admin",
          email: `${actor}@example.test`,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      await tx
        .insert(adminProfiles)
        .values({ id: actor, authUserId: actor, role: "owner" });
      const store = createTrackingStore(tx as unknown as Database);
      const a = await store.createProject(input, actor);
      const b = await store.createProject(
        { ...input, projectTitle: "OTHER_CLIENT_SECRET" },
        actor,
      );
      const session = readTrackingSession(
        signTrackingSession(a.project.id, 1, 120, secret),
        secret,
      )!;
      await run({ tx, store, actor, a, b, session });
      throw rollback;
    });
  } catch (error) {
    if (error !== rollback) throw error;
  }
}

describe("portal klien pada PostgreSQL terisolasi", () => {
  it("creates six steps, stores only a PIN hash, and authenticates without exposing project existence", () =>
    fixture(async ({ tx, store, a }) => {
      const [row] = await tx
        .select()
        .from(clientProjects)
        .where(eq(clientProjects.id, a.project.id));
      expect(row.accessPinHash).toMatch(/^scrypt:/);
      expect(a.project).not.toHaveProperty("accessPinHash");
      const login = await store.login(
        a.project.trackingCode,
        a.pin,
        ip,
        secret,
      );
      expect(login).toMatchObject({ projectId: a.project.id, pinVersion: 1 });
      const portal = await store.clientPortal(
        readTrackingSession(
          signTrackingSession(login!.projectId, 1, 120, secret),
          secret,
        )!,
      );
      expect(portal.steps).toHaveLength(6);
      expect(portal.project).not.toHaveProperty("accessPinHash");
      expect(JSON.stringify(portal)).not.toContain("DO_NOT_EXPOSE");
      expect(
        await store.login("PRJ-ZZZZZZZZ", "000000", ip, secret),
      ).toBeNull();
    }));

  it("locks the project code across IPs and allows login only after expiry", () =>
    fixture(async ({ tx, store, a }) => {
      const wrong = a.pin === "000000" ? "999999" : "000000";
      for (let i = 0; i < 5; i++)
        expect(
          await store.login(
            a.project.trackingCode,
            wrong,
            String(i).repeat(64),
            secret,
          ),
        ).toBeNull();
      expect(
        await store.login(a.project.trackingCode, a.pin, ip, secret),
      ).toBeNull();
      const hash = trackingRateKey(secret, `code:${a.project.trackingCode}`);
      await tx.execute(
        query`update rate_limits set locked_until = now() - interval '1 second', window_started_at = now() - interval '20 minutes' where scope='tracking-code' and key_hash=${hash}`,
      );
      expect(
        await store.login(a.project.trackingCode, a.pin, ip, secret),
      ).not.toBeNull();
    }));

  it("enforces visibility, cross-project ownership, PIN revocation and disabled tracking", () =>
    fixture(async ({ tx, store, actor, a, b, session }) => {
      await store.adminMutate(
        a.project.id,
        {
          kind: "comment",
          body: "INTERNAL_COMMENT_SECRET",
          isInternal: true,
          revisionRequestId: null,
          fileIds: [],
        },
        actor,
      );
      await store.adminMutate(
        b.project.id,
        {
          kind: "comment",
          body: "OTHER_PROJECT_COMMENT",
          isInternal: false,
          revisionRequestId: null,
          fileIds: [],
        },
        actor,
      );
      await store.adminMutate(
        a.project.id,
        { kind: "review", open: true },
        actor,
      );
      const otherSession = { ...session, projectId: b.project.id };
      await store
        .clientMutate(
          otherSession,
          {
            kind: "revision",
            type: "bug",
            title: "other revision",
            description: "test",
            fileIds: [],
          },
          ip,
          "",
        )
        .catch(() => undefined);
      const portal = await store.clientPortal(session);
      const serialized = JSON.stringify(portal);
      for (const secretText of [
        "DO_NOT_EXPOSE",
        "INTERNAL_COMMENT_SECRET",
        "OTHER_CLIENT_SECRET",
        "OTHER_PROJECT_COMMENT",
        "staging.example.test",
      ])
        expect(serialized).not.toContain(secretText);
      expect(portal.payment).toBeNull();
      await store.adminMutate(a.project.id, { kind: "pin" }, actor);
      await expect(store.clientPortal(session)).rejects.toThrow();
      const current = await store.adminDetail(a.project.id);
      const fresh = { ...session, pinVersion: current.project.pinVersion };
      await store.adminMutate(
        a.project.id,
        { kind: "archive", archived: true },
        actor,
      );
      await expect(store.clientPortal(fresh)).rejects.toThrow();
      const config = defaultSiteSettings();
      await tx
        .update(siteSettings)
        .set({ data: config })
        .where(eq(siteSettings.id, 1));
      await expect(store.clientPortal(otherSession)).rejects.toThrow();
    }));

  it("consumes quota only on acceptance, handles exhausted quota, and charges agreed extras exactly once", () =>
    fixture(async ({ store, actor, a, session }) => {
      await store.adminMutate(
        a.project.id,
        { kind: "review", open: true },
        actor,
      );
      for (const title of ["first", "second"])
        await store.clientMutate(
          session,
          {
            kind: "revision",
            type: "revision",
            title,
            description: "change",
            fileIds: [],
          },
          ip,
          "",
        );
      let data = await store.adminDetail(a.project.id);
      expect(data.project.revisionsUsed).toBe(0);
      const first = data.revisions.find((r) => r.title === "first")!;
      const second = data.revisions.find((r) => r.title === "second")!;
      await store.adminMutate(
        a.project.id,
        { kind: "revision", id: first.id, event: "ACCEPT" },
        actor,
      );
      await store.adminMutate(
        a.project.id,
        { kind: "revision", id: second.id, event: "ACCEPT" },
        actor,
      );
      data = await store.adminDetail(a.project.id);
      expect(data.project.revisionsUsed).toBe(1);
      expect(data.revisions.find((r) => r.id === second.id)?.status).toBe(
        "needs_payment",
      );
      await expect(
        store.adminMutate(
          a.project.id,
          { kind: "revision", id: second.id, event: "ACCEPT" },
          actor,
        ),
      ).rejects.toThrow();
      await store.adminMutate(
        a.project.id,
        {
          kind: "revision",
          id: second.id,
          event: "SET_QUOTE",
          quotedPrice: 250000,
        },
        actor,
      );
      await store.clientMutate(
        session,
        { kind: "quote", revisionId: second.id, accept: true },
        ip,
        "",
      );
      await store.adminMutate(
        a.project.id,
        { kind: "revision", id: second.id, event: "ACCEPT" },
        actor,
      );
      await expect(
        store.adminMutate(
          a.project.id,
          { kind: "revision", id: second.id, event: "ACCEPT" },
          actor,
        ),
      ).rejects.toThrow();
      data = await store.adminDetail(a.project.id);
      expect(data.project.totalCost).toBe(1250000);
      expect(data.project.balance).toBe(1250000);
      expect(data.project.revisionsUsed).toBe(1);
    }));

  it("checks the PIN for approval and requires completed steps and full payment for handover", () =>
    fixture(async ({ tx, store, actor, a, session }) => {
      await store.adminMutate(
        a.project.id,
        { kind: "review", open: true },
        actor,
      );
      const approval = {
        kind: "approve",
        type: "step_review",
        name: "Integration Client",
        pin: a.pin,
        note: "Approved",
      };
      await expect(
        store.clientMutate(session, { ...approval, pin: "invalid" }, ip, ""),
      ).rejects.toThrow();
      await expect(
        store.clientMutate(
          session,
          { ...approval, type: "final_handover" },
          ip,
          "",
        ),
      ).rejects.toThrow();
      for (let step = 1; step <= 4; step++)
        await store.adminMutate(
          a.project.id,
          {
            kind: "step",
            stepNumber: step,
            title: `Step ${step}`,
            description: "",
            status: "done",
            milestones: [],
          },
          actor,
        );
      await store.clientMutate(session, approval, ip, "integration-browser");
      await expect(
        store.clientMutate(session, approval, ip, ""),
      ).rejects.toThrow();
      await store.adminMutate(
        a.project.id,
        {
          kind: "payment",
          id: null,
          amount: 1000000,
          paidAt: new Date().toISOString(),
          method: "transfer",
          note: "",
          isVisibleToClient: true,
          proofFileId: null,
        },
        actor,
      );
      await store.clientMutate(
        session,
        { ...approval, type: "final_handover" },
        ip,
        "integration-browser",
      );
      const evidence = await tx
        .select()
        .from(projectApprovals)
        .where(eq(projectApprovals.clientProjectId, a.project.id));
      expect(evidence).toHaveLength(2);
      expect(evidence[0].ipHash).toBe(ip);
      const detail = await store.adminDetail(a.project.id);
      expect(detail.project.balance).toBe(0);
      expect(detail.steps.every((s) => s.status === "done")).toBe(true);
    }));

  it("never downloads private attachments from another project or from internal notes", () =>
    fixture(async ({ store, actor, a, b, session }) => {
      const upload = {
        filename: "proof.pdf",
        mimeType: "application/pdf" as const,
        sizeBytes: 20,
      };
      const pending = `tracking/${a.project.id}/pending/${randomUUID()}`;
      const id = await store.registerUpload(
        a.project.id,
        upload,
        pending,
        actor,
      );
      await store.finalizeUpload(
        a.project.id,
        id,
        `tracking/${a.project.id}/files/${randomUUID()}`,
        pending,
      );
      await store.adminMutate(
        a.project.id,
        {
          kind: "comment",
          body: "Internal file",
          isInternal: true,
          revisionRequestId: null,
          fileIds: [id],
        },
        actor,
      );
      await expect(
        store.downloadFile(a.project.id, id, session),
      ).rejects.toThrow();
      await expect(
        store.downloadFile(b.project.id, id, session),
      ).rejects.toThrow();
      await expect(
        store.registerUpload(
          b.project.id,
          upload,
          `tracking/${b.project.id}/pending/test`,
          null,
          session,
        ),
      ).rejects.toThrow();
      await store.adminMutate(
        a.project.id,
        {
          kind: "comment",
          body: "Shared file",
          isInternal: false,
          revisionRequestId: null,
          fileIds: [id],
        },
        actor,
      );
      expect((await store.downloadFile(a.project.id, id, session)).id).toBe(id);
      await expect(
        store.clientMutate(
          { ...session, projectId: b.project.id },
          {
            kind: "comment",
            body: "cross project",
            revisionRequestId: null,
            fileIds: [id],
          },
          ip,
          "",
        ),
      ).rejects.toThrow();
    }));
});
