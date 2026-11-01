import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import type { ContentVersionRecord } from "@/schemas/content-versions";
import {
  pageInputSchema,
  type PageInput,
  type PageRecord,
} from "@/schemas/pages";
import {
  projectInputSchema,
  type ProjectInput,
  type ProjectRecord,
} from "@/schemas/projects";
import {
  publishPage,
  savePage,
  type PageStore,
  type PageTransaction,
} from "@/services/pages";
import { getPublishedPage, type PublicPageStore } from "@/services/public-pages";
import {
  publishProject,
  saveProject,
  type ProjectStore,
  type ProjectTransaction,
} from "@/services/projects";

const editor: AdminPrincipal = {
  id: "editor-id",
  role: "editor",
  twoFactorVerified: true,
};
const pageId = "03a45fa0-3b54-4d51-ac21-335a00655744";
const projectId = "64f83a30-f94b-4da1-a2e0-3cf7e43de702";
const now = new Date("2026-10-30T10:00:00.000Z");

const pageInput: PageInput = {
  slug: "tentang",
  title: "Tentang Kami",
  layout: [],
  metaTitle: null,
  metaDescription: null,
  ogImageId: null,
  sortOrder: 0,
};
const projectInput: ProjectInput = {
  title: "Sistem Informasi",
  slug: "sistem-informasi",
  tagline: "",
  clientName: null,
  year: null,
  featuredImageId: null,
  gallery: [],
  summary: "",
  contentBlocks: [],
  links: [],
  isFeatured: false,
  categoryIds: [],
  technologyIds: [],
  metaTitle: null,
  metaDescription: null,
  ogImageId: null,
  sortOrder: 0,
};

function makePageRecord(
  value: PageInput = pageInput,
  status: "draft" | "published" = "draft",
): PageRecord {
  return {
    ...value,
    id: pageId,
    status,
    publishedAt: status === "published" ? now : null,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

function makeProjectRecord(
  value: ProjectInput = projectInput,
  status: "draft" | "published" = "draft",
): ProjectRecord {
  return {
    ...value,
    id: projectId,
    status,
    publishedAt: status === "published" ? now : null,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

function pageStore(initial = makePageRecord()) {
  let record = initial;
  const tx: PageTransaction = {
    readCurrent: vi.fn(async () => record),
    ensureMediaReady: vi.fn(async () => undefined),
    save: vi.fn(async (_id, value) => {
      record = makePageRecord(value);
      return pageId;
    }),
    setPublished: vi.fn(async (_id, publishedAt) => {
      record = { ...record, status: "published", publishedAt };
      return true;
    }),
    setTrash: vi.fn(async () => true),
    readVersion: vi.fn(async () => null),
    appendVersion: vi.fn(async () => undefined),
    audit: vi.fn(async () => undefined),
  };
  const store: PageStore = {
    list: vi.fn(async () => []),
    listVersions: vi.fn(async () => [] as ContentVersionRecord[]),
    transaction: async (callback) => callback(tx),
  };
  const publicStore: PublicPageStore = {
    findBySlug: vi.fn(async (slug, includeDraft) => {
      if (record.slug !== slug || record.deletedAt) return null;
      if (!includeDraft && record.status !== "published") return null;
      return record;
    }),
  };
  return { store, tx, publicStore };
}

function projectStore(initial = makeProjectRecord()) {
  let record = initial;
  const tx: ProjectTransaction = {
    readCurrent: vi.fn(async () => record),
    ensureMediaReady: vi.fn(async () => undefined),
    ensureRelationsReady: vi.fn(async () => undefined),
    save: vi.fn(async (_id, value) => {
      record = makeProjectRecord(value);
      return projectId;
    }),
    setPublished: vi.fn(async (_id, publishedAt) => {
      record = { ...record, status: "published", publishedAt };
      return true;
    }),
    setTrash: vi.fn(async () => true),
    readVersion: vi.fn(async () => null),
    appendVersion: vi.fn(async () => undefined),
    audit: vi.fn(async () => undefined),
  };
  const store: ProjectStore = {
    list: vi.fn(async () => []),
    listVersions: vi.fn(async () => [] as ContentVersionRecord[]),
    transaction: async (callback) => callback(tx),
  };
  return { store, tx };
}

describe("Pages dan Projects CMS", () => {
  it("membatasi struktur blok halaman dan relasi proyek", () => {
    expect(pageInputSchema.parse(pageInput)).toEqual(pageInput);
    expect(() => pageInputSchema.parse({ ...pageInput, unexpected: true })).toThrow();
    expect(() =>
      projectInputSchema.parse({
        ...projectInput,
        categoryIds: [pageId, pageId],
      }),
    ).toThrow("ID tidak boleh duplikat");
    expect(() =>
      projectInputSchema.parse({
        ...projectInput,
        links: [{ label: "Demo", type: "demo", url: "http://example.com" }],
      }),
    ).toThrow();
  });

  it("menyimpan halaman sebagai draft dengan snapshot dan audit atomik", async () => {
    const ctx = pageStore();

    await expect(savePage(ctx.store, editor, null, pageInput)).resolves.toBe(
      pageId,
    );

    expect(ctx.tx.save).toHaveBeenCalledWith(null, pageInput);
    expect(ctx.tx.appendVersion).toHaveBeenCalledWith(
      pageId,
      expect.objectContaining({ status: "draft", publishedAt: null }),
      "draft",
      editor.id,
    );
    expect(ctx.tx.audit).toHaveBeenCalledWith(editor.id, "create", pageId);
  });

  it("menolak publish halaman dengan marker konten yang belum diisi", async () => {
    const ctx = pageStore(
      makePageRecord({ ...pageInput, title: "Tentang [ISI]" }),
    );

    await expect(
      publishPage(ctx.store, editor, pageId, {}, now),
    ).rejects.toThrow("Konten [ISI]");
    expect(ctx.tx.setPublished).not.toHaveBeenCalled();
    expect(ctx.tx.appendVersion).not.toHaveBeenCalled();
  });

  it("menampilkan halaman ke publik hanya setelah admin memublikasikannya", async () => {
    const ctx = pageStore();
    await savePage(ctx.store, editor, null, pageInput);
    await expect(getPublishedPage(ctx.publicStore, pageInput.slug)).resolves.toBeNull();

    await publishPage(ctx.store, editor, pageId, {}, now);

    await expect(getPublishedPage(ctx.publicStore, pageInput.slug)).resolves.toMatchObject({
      id: pageId,
      status: "published",
      title: pageInput.title,
    });
  });

  it("menolak publish proyek tanpa gambar utama sebelum menulis versi", async () => {
    const ctx = projectStore();

    await expect(
      publishProject(ctx.store, editor, projectId, {}, now),
    ).rejects.toThrow("Gambar utama wajib");
    expect(ctx.tx.ensureMediaReady).not.toHaveBeenCalled();
    expect(ctx.tx.setPublished).not.toHaveBeenCalled();
    expect(ctx.tx.appendVersion).not.toHaveBeenCalled();
  });

  it("menyimpan proyek draft dan merekam versi sebelum selesai", async () => {
    const ctx = projectStore();

    await expect(
      saveProject(ctx.store, editor, null, {
        ...projectInput,
        title: "Sistem Aplikasi Mobile",
        slug: "",
      }),
    ).resolves.toBe(projectId);

    expect(ctx.tx.save).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ slug: "sistem-aplikasi-mobile" }),
    );
    expect(ctx.tx.ensureMediaReady).toHaveBeenCalledWith([]);
    expect(ctx.tx.ensureRelationsReady).toHaveBeenCalledWith([], []);
    expect(ctx.tx.appendVersion).toHaveBeenCalledWith(
      projectId,
      expect.objectContaining({ status: "draft", publishedAt: null }),
      "draft",
      editor.id,
    );
    expect(ctx.tx.audit).toHaveBeenCalledWith(
      editor.id,
      "create",
      projectId,
    );
  });
});
