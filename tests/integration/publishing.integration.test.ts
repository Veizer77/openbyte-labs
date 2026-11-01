import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { afterAll, beforeAll, it, expect } from "vitest";
import { createPageStore } from "@/db/page-store";
import { createPublicPageStore } from "@/db/public-page-store";
import { createProjectStore } from "@/db/project-store";
import { createPublicProjectStore } from "@/db/public-project-store";
import { createProjectOrderStore } from "@/db/project-order-store";
import { savePage, publishPage, setPageTrash } from "@/services/pages";
import { saveProject, publishProject, setProjectTrash } from "@/services/projects";
import { getPublishedPage } from "@/services/public-pages";
import { getPublicProjectBySlug, listPublicProjects } from "@/services/public-projects";
import { pageInputSchema } from "@/schemas/pages";
import { authUser } from "@/db/schema/admin-identity";
import { adminProfiles } from "@/db/schema/admin-profile";
import { media } from "@/db/schema/content";
import { requireTestDatabaseUri } from "./target";
import type { Database } from "@/db/connection";

let connection: postgres.Sql;
beforeAll(() => { connection = postgres(requireTestDatabaseUri(process.env), { max: 1, prepare: false, connect_timeout: 10 }); });
afterAll(async () => { await connection?.end(); });

it("keeps published snapshots visible while editing, schedules safely, orders without unpublishing, and revokes on Trash", async () => {
  const rollback = new Error("rollback-publication-fixture");
  try {
    await drizzle(connection).transaction(async (transaction) => {
      const db = transaction as unknown as Database;
      const id = randomUUID();
      const imageId = randomUUID();
      await db.insert(authUser).values({ id, email: `${id}@example.test`, name: "Publishing test", createdAt: new Date(), updatedAt: new Date() });
      await db.insert(adminProfiles).values({ id, authUserId: id, role: "owner" });
      await db.insert(media).values({ id: imageId, key: `test/${id}`, filename: "test.webp", mimeType: "image/webp", sizeBytes: 1, alt: "Test", finalizedAt: new Date(), variants: { card: "test/card.webp" } });
      const actor = { id, role: "owner" as const, twoFactorVerified: true };
      const pageStore = createPageStore(db);
      const publicPages = createPublicPageStore(db);
      const page = pageInputSchema.parse({ slug: `page-${id}`, title: "Published page", layout: [], metaTitle: null, metaDescription: null, ogImageId: null, sortOrder: 0 });
      const pageId = await savePage(pageStore, actor, null, page);
      expect(await getPublishedPage(publicPages, page.slug)).toBeNull();
      await publishPage(pageStore, actor, pageId, {});
      await savePage(pageStore, actor, pageId, { ...page, title: "Private page draft" });
      expect((await getPublishedPage(publicPages, page.slug))?.title).toBe("Published page");
      await setPageTrash(pageStore, actor, pageId, true);
      await setPageTrash(pageStore, actor, pageId, false);
      expect(await getPublishedPage(publicPages, page.slug)).toBeNull();

      const store = createProjectStore(db);
      const published = createPublicProjectStore(db, "https://cdn.example.test");
      const project = { title: "Published project", slug: `project-${id}`, tagline: "", clientName: null, year: null, featuredImageId: imageId, gallery: [], summary: "Public summary", contentBlocks: [{ type: "bullets", items: ["Public detail"] }], links: [], isFeatured: false, categoryIds: [], technologyIds: [], metaTitle: "Project SEO", metaDescription: null, ogImageId: null, sortOrder: 0 };
      const projectId = await saveProject(store, actor, null, project);
      await publishProject(store, actor, projectId, {});
      await saveProject(store, actor, projectId, { ...project, title: "Private project draft", summary: "PRIVATE_DRAFT_SECRET" });
      expect(await getPublicProjectBySlug(published, project.slug)).toMatchObject({ title: "Published project", summary: "Public summary", contentBlocks: [{ type: "bullets", items: ["Public detail"] }], metaTitle: "Project SEO" });
      await publishProject(store, actor, projectId, { publishedAt: new Date(Date.now() + 86400000).toISOString() });
      expect((await getPublicProjectBySlug(published, project.slug))?.title).toBe("Published project");
      await createProjectOrderStore(db).reorder([projectId], id);
      expect((await listPublicProjects(published)).some((item) => item.slug === project.slug)).toBe(true);
      await setProjectTrash(store, actor, projectId, true);
      await setProjectTrash(store, actor, projectId, false);
      expect(await getPublicProjectBySlug(published, project.slug)).toBeNull();
      throw rollback;
    });
  } catch (error) { if (error !== rollback) throw error; }
});
