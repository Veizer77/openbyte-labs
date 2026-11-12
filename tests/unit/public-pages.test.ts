import { describe, expect, it, vi } from "vitest";
import type { AdminPrincipal } from "@/access/rules";
import { getAdminPagePreview, getPublishedPage, type PublicPageStore } from "@/services/public-pages";
import { publicMediaUrl } from "@/lib/server/public-media";

const pageId = "03a45fa0-3b54-4d51-ac21-335a00655744";
const date = new Date("2026-11-01T10:00:00.000Z");
const record = (status: "draft" | "published" = "published") => ({
  id: pageId,
  slug: "layanan-baru",
  title: "Layanan Baru",
  layout: [],
  metaTitle: null,
  metaDescription: null,
  ogImageId: null,
  status,
  publishedAt: status === "published" ? date : null,
  deletedAt: null,
  sortOrder: 0,
  createdAt: date,
  updatedAt: date,
});

const owner: AdminPrincipal = {
  id: "owner-id",
  role: "owner",
  twoFactorVerified: true,
};

describe("public and admin page reads", () => {
  it("returns published pages only through the public reader", async () => {
    const store: PublicPageStore = {
      findBySlug: vi.fn(async () => record("draft")),
    };

    await expect(getPublishedPage(store, "layanan-baru")).resolves.toBeNull();
    expect(store.findBySlug).toHaveBeenCalledWith("layanan-baru", false);
  });

  it("requires page read authorization before returning a draft preview", async () => {
    const store: PublicPageStore = {
      findBySlug: vi.fn(async () => record("draft")),
    };

    await expect(getAdminPagePreview(store, null, "layanan-baru")).rejects.toThrow();
    await expect(getAdminPagePreview(store, owner, "layanan-baru")).resolves.toMatchObject({
      slug: "layanan-baru",
      status: "draft",
    });
    expect(store.findBySlug).toHaveBeenLastCalledWith("layanan-baru", true);
  });

  it("hides scheduled and undated publications", async () => {
    const store: PublicPageStore = { findBySlug: vi.fn(async () => record()) };
    await expect(getPublishedPage(store, "layanan-baru", new Date("2026-10-31T00:00:00Z"))).resolves.toBeNull();
    await expect(getPublishedPage(store, "layanan-baru", new Date("2026-11-02T00:00:00Z"))).resolves.toMatchObject({ status: "published" });
  });

  it("encodes public object path segments and preserves nested keys", () => {
    expect(publicMediaUrl("https://cdn.example.com/assets/", "media/ab c/hero.webp"))
      .toBe("https://cdn.example.com/assets/media/ab%20c/hero.webp");
    expect(publicMediaUrl("https://pub-56e1d9e9745541f7bbe1141aa7cc3be3.r2.dev", "media/ab c/hero.webp"))
      .toBe("/api/media/media/ab%20c/hero.webp");
  });
});
