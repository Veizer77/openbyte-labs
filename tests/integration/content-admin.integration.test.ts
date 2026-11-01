import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "@/db/connection";
import { createAdminUserStore } from "@/db/admin-user-store";
import { createAuditLogStore } from "@/db/audit-log-store";
import { createCalculatorAdminStore } from "@/db/calculator-store";
import { createServiceAddonStore } from "@/db/service-addon-store";
import { createServiceStore } from "@/db/service-store";
import { createTechnologyStore } from "@/db/technology-store";
import { createTestimonialStore } from "@/db/testimonial-store";
import { adminProfiles } from "@/db/schema/admin-profile";
import { authAccount, authUser } from "@/db/schema/admin-identity";
import { auditLogs } from "@/db/schema/audit";
import { projectTechnologies } from "@/db/schema/content";
import {
  createAdminUser,
  listAdminUsers,
  updateAdminUser,
} from "@/services/admin-users";
import { listAuditLogs } from "@/services/audit-logs";
import {
  listCalculatorConfig,
  saveCalculatorConfig,
} from "@/services/calculator-admin";
import {
  deleteServiceAddon,
  listAdminServiceAddons,
  listPublicServiceAddons,
  saveServiceAddon,
} from "@/services/service-addons";
import { deleteService, listAdminServices, listPublicServices, saveService } from "@/services/services";
import { deleteTechnology, listAdminTechnologies, saveTechnology } from "@/services/technologies";
import {
  deleteTestimonial,
  listPublicTestimonials,
  saveTestimonial,
} from "@/services/testimonials";
import { media, projects, services, technologies, testimonials } from "@/db/schema/content";
import { serviceAddons } from "@/db/schema/packages";
import { requireTestDatabaseUri } from "./target";

let client: postgres.Sql;
let db: Database;
const marker = randomUUID();
const actorId = randomUUID();
const actorAuthId = randomUUID();
const actorEmail = `be03-owner-${marker}@example.test`;
const projectId = randomUUID();
const mediaId = randomUUID();
const actor = { id: actorId, role: "owner" as const, twoFactorVerified: true };

const createdServiceIds: string[] = [];
const createdAddonIds: string[] = [];
const createdTechnologyIds: string[] = [];
let createdTestimonialId: string | null = null;
let createdAdminProfileId: string | null = null;
let createdAdminAuthId: string | null = null;

beforeAll(async () => {
  client = postgres(requireTestDatabaseUri(process.env), {
    max: 16,
    prepare: false,
    connect_timeout: 10,
  });
  db = drizzle(client);
  const now = new Date();
  await db.insert(authUser).values({
    id: actorAuthId,
    name: "BE-03 Integration Owner",
    email: actorEmail,
    emailVerified: false,
    image: null,
    createdAt: now,
    updatedAt: now,
    twoFactorEnabled: true,
  });
  await db.insert(adminProfiles).values({
    id: actorId,
    authUserId: actorAuthId,
    role: "owner",
    isActive: true,
  });
  await db.insert(projects).values({
    id: projectId,
    title: "BE-03 integration project",
    slug: `be03-${marker}`,
    status: "draft",
  });
  await db.insert(media).values({
    id: mediaId,
    key: `integration/${marker}/testimonial.jpg`,
    filename: "testimonial.jpg",
    mimeType: "image/jpeg",
    sizeBytes: 128,
    width: 1,
    height: 1,
    alt: "Foto testimoni integration",
    variants: {},
    uploadedBy: actorId,
    finalizedAt: now,
  });
});

afterAll(async () => {
  if (db) {
    await db.delete(auditLogs).where(eq(auditLogs.actorId, actorId));
    await db.delete(auditLogs).where(eq(auditLogs.docId, `be03-audit-${marker}`));
    if (createdTestimonialId)
      await db.delete(testimonials).where(eq(testimonials.id, createdTestimonialId));
    await db.delete(projectTechnologies).where(eq(projectTechnologies.projectId, projectId));
    if (createdTechnologyIds.length)
      await db.delete(technologies).where(eq(technologies.id, createdTechnologyIds[0]));
    await db.delete(projects).where(eq(projects.id, projectId));
    await db.delete(media).where(eq(media.id, mediaId));
    if (createdServiceIds.length)
      await db.delete(services).where(eq(services.id, createdServiceIds[0]));
    if (createdAddonIds.length)
      await db.delete(serviceAddons).where(eq(serviceAddons.id, createdAddonIds[0]));
    if (createdAdminProfileId)
      await db.delete(adminProfiles).where(eq(adminProfiles.id, createdAdminProfileId));
    if (createdAdminAuthId) {
      await db.delete(authAccount).where(eq(authAccount.userId, createdAdminAuthId));
      await db.delete(authUser).where(eq(authUser.id, createdAdminAuthId));
    }
    await db.delete(adminProfiles).where(eq(adminProfiles.id, actorId));
    await db.delete(authUser).where(eq(authUser.id, actorAuthId));
  }
  await client?.end({ timeout: 5 });
});

describe("CRUD backend Rilis 1 pada PostgreSQL terisolasi", () => {
  it("menjalankan layanan, testimoni, teknologi, add-on, kalkulator, pengguna, dan audit", async () => {
    const invalidate = async () => {};

    const servicesStore = createServiceStore(db);
    const serviceId = await saveService(servicesStore, actor, null, {
      title: "Layanan BE-03",
      description: "Deskripsi integration",
      highlights: ["Aman"],
      icon: "Globe",
      isActive: true,
      sortOrder: 1,
    }, invalidate);
    createdServiceIds.push(serviceId);
    expect(await listPublicServices(servicesStore, { limit: 20, offset: 0 })).toEqual([
      expect.objectContaining({ id: serviceId, title: "Layanan BE-03" }),
    ]);
    await saveService(servicesStore, actor, serviceId, {
      title: "Layanan BE-03 diperbarui",
      description: "Deskripsi integration",
      highlights: ["Aman"],
      icon: "Globe",
      isActive: false,
      sortOrder: 1,
    }, invalidate);
    expect(await listAdminServices(servicesStore, actor, { limit: 20, offset: 0 })).toEqual([
      expect.objectContaining({ id: serviceId, isActive: false }),
    ]);
    expect(await listPublicServices(servicesStore, { limit: 20, offset: 0 })).toEqual([]);

    const addonStore = createServiceAddonStore(db);
    const addonId = await saveServiceAddon(addonStore, actor, null, {
      name: "Add-on BE-03",
      description: "Support integration",
      price: 25_000,
      billingType: "monthly",
      isActive: true,
      sortOrder: 1,
    }, invalidate);
    createdAddonIds.push(addonId);
    expect(await listPublicServiceAddons(addonStore, { limit: 100, offset: 0 })).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: addonId })]),
    );
    expect(await listAdminServiceAddons(addonStore, actor, { limit: 100, offset: 0 })).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: addonId })]),
    );

    const technologyStore = createTechnologyStore(db);
    const technologyInput = {
      name: `BE03 Technology ${marker}`,
      slug: `be03-tech-${marker}`,
      icon: "Code",
      color: "#123ABC",
    };
    const sameName = { ...technologyInput, name: technologyInput.name.toLowerCase() };
    const technologyResults = await Promise.allSettled([
      saveTechnology(technologyStore, actor, null, technologyInput, invalidate),
      saveTechnology(technologyStore, actor, null, sameName, invalidate),
    ]);
    const savedTechnologies = technologyResults
      .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled")
      .map((result) => result.value);
    expect(savedTechnologies).toHaveLength(1);
    createdTechnologyIds.push(...savedTechnologies);
    const technologyId = savedTechnologies[0];
    expect(await listAdminTechnologies(technologyStore, actor, { limit: 20, offset: 0 })).toEqual([
      expect.objectContaining({ id: technologyId }),
    ]);
    await db.insert(projectTechnologies).values({ projectId, technologyId, sortOrder: 0 });
    await expect(deleteTechnology(technologyStore, actor, technologyId, invalidate)).rejects.toThrow("masih digunakan oleh proyek");
    await db.delete(projectTechnologies).where(and(
      eq(projectTechnologies.projectId, projectId),
      eq(projectTechnologies.technologyId, technologyId),
    ));
    await deleteTechnology(technologyStore, actor, technologyId, invalidate);
    createdTechnologyIds.length = 0;

    const testimonialStore = createTestimonialStore(db);
    const testimonialId = await saveTestimonial(testimonialStore, actor, null, {
      authorName: "BE-03 Client",
      authorRole: "Founder",
      quote: "Perubahan berjalan baik.",
      photoId: mediaId,
      projectId,
      isActive: true,
      sortOrder: 1,
    }, invalidate);
    createdTestimonialId = testimonialId;
    expect(await listPublicTestimonials(testimonialStore, { limit: 20, offset: 0 })).toEqual([
      expect.objectContaining({ id: testimonialId, photoId: mediaId, projectId }),
    ]);
    await deleteTestimonial(testimonialStore, actor, testimonialId, invalidate);
    createdTestimonialId = null;

    const calculatorStore = createCalculatorAdminStore(db);
    const originalConfig = await listCalculatorConfig(calculatorStore, actor);
    try {
      const changed = structuredClone(originalConfig);
      if (changed.groups[0]) changed.groups[0].description = `Integration ${marker}`;
      if (changed.groups.length > 1) {
        [changed.groups[0].key, changed.groups[1].key] = [
          changed.groups[1].key,
          changed.groups[0].key,
        ];
      }
      await saveCalculatorConfig(calculatorStore, actor, changed, invalidate);
      expect(await listCalculatorConfig(calculatorStore, actor)).toEqual(changed);
    } finally {
      await saveCalculatorConfig(calculatorStore, actor, originalConfig, invalidate);
    }

    const usersStore = createAdminUserStore(db);
    const userId = await createAdminUser(usersStore, actor, {
      name: "BE-03 User",
      email: `be03-user-${marker}@example.test`,
      password: "BE03-integration-password-123",
      role: "editor",
    });
    const [createdUser] = await db.select({ authUserId: adminProfiles.authUserId })
      .from(adminProfiles).where(eq(adminProfiles.id, userId));
    if (!createdUser) throw new Error("Profil admin integration tidak ditemukan.");
    createdAdminProfileId = userId;
    createdAdminAuthId = createdUser.authUserId;
    expect(await listAdminUsers(usersStore, actor, { limit: 20, offset: 0, query: "BE-03 User" })).toEqual([
      expect.objectContaining({ id: userId, role: "editor", twoFactorEnabled: false }),
    ]);
    await updateAdminUser(usersStore, actor, userId, {
      name: "BE-03 User Updated",
      email: `BE03-UPDATED-${marker}@example.test`,
      role: "editor",
      isActive: false,
    });
    expect(await listAdminUsers(usersStore, actor, { limit: 20, offset: 0, query: "BE-03 User Updated" })).toEqual([
      expect.objectContaining({ id: userId, name: "BE-03 User Updated", email: `be03-updated-${marker}@example.test`, isActive: false }),
    ]);

    await db.insert(auditLogs).values({
      actorId,
      actorType: "admin",
      action: "update",
      collection: "be03-integration",
      docId: `be03-audit-${marker}`,
      summary: "Audit sanitization probe",
      diff: { safe: "visible", passwordHash: "hidden", nested: { backupCode: "hidden", label: "visible" } },
      ipHash: "a".repeat(64),
    });
    const auditStore = createAuditLogStore(db);
    const logs = await listAuditLogs(auditStore, actor, {
      limit: 20,
      offset: 0,
      collection: "be03-integration",
      actorId,
    });
    expect(logs).toEqual([
      expect.objectContaining({
        actorName: "BE-03 Integration Owner",
        actorEmail,
        diff: { safe: "visible", nested: { label: "visible" } },
      }),
    ]);

    await deleteService(servicesStore, actor, serviceId, invalidate);
    createdServiceIds.length = 0;
    await deleteServiceAddon(addonStore, actor, addonId, invalidate);
    createdAddonIds.length = 0;
  });
});
