import { describe, it, expect, vi } from "vitest";
import { createPageBlock, moveBlock, pageBlockLabels } from "@/lib/page-blocks";
import { pageBlockSchema } from "@/schemas/blocks";
import { videoEmbedUrl } from "@/lib/video";
import { createPreviewToken, verifyPreviewToken } from "@/lib/server/preview-token";
import { reorderProjects } from "@/services/project-order";

describe("release content controls", () => {
  it("creates every supported block without fabricated statistics", () => {
    for (const type of Object.keys(pageBlockLabels) as Array<keyof typeof pageBlockLabels>) {
      const block = createPageBlock(type, "test-id");
      expect(pageBlockSchema.safeParse(block).success).toBe(true);
      if (block.type === "hero") expect(block.trustMetrics).toEqual([]);
    }
  });
  it("supports keyboard and drag ordering without mutating the source", () => {
    const items = ["a", "b", "c"];
    expect(moveBlock(items, 0, 2)).toEqual(["b", "c", "a"]);
    expect(moveBlock(items, 0, -1)).toEqual(items);
    expect(items).toEqual(["a", "b", "c"]);
  });
  it("restricts embeds to privacy-aware provider URLs", () => {
    expect(videoEmbedUrl("https://youtu.be/abcdefghijk?autoplay=1")).toBe("https://www.youtube-nocookie.com/embed/abcdefghijk");
    expect(videoEmbedUrl("https://vimeo.com/123456")).toBe("https://player.vimeo.com/video/123456?dnt=1");
    for (const url of ["javascript:alert(1)", "https://evil.test/watch?v=abcdefghijk", "https://youtube.com/redirect", "https://user:pass@youtube.com/watch?v=abcdefghijk"]) expect(videoEmbedUrl(url)).toBeNull();
  });
  it("binds preview authorization to target, session, signature and expiry", () => {
    const token = createPreviewToken("/admin/preview/home", "session", "test-secret", 1000);
    expect(verifyPreviewToken(token, "/admin/preview/home", "session", "test-secret", 2000)).toBe(true);
    expect(verifyPreviewToken(token, "/admin/preview/other", "session", "test-secret", 2000)).toBe(false);
    expect(verifyPreviewToken(token, "/admin/preview/home", "other", "test-secret", 2000)).toBe(false);
    expect(verifyPreviewToken(token, "/admin/preview/home", "session", "other-secret", 2000)).toBe(false);
    expect(verifyPreviewToken(token, "/admin/preview/home", "session", "test-secret", 301001)).toBe(false);
  });
  it("authorizes and validates project reordering before touching the store", async () => {
    const store = { reorder: vi.fn(async () => {}) };
    const id = "03a45fa0-3b54-4d51-ac21-335a00655744";
    await expect(reorderProjects(store, null, [id])).rejects.toThrow();
    const actor = { id: "editor", role: "editor" as const, twoFactorVerified: true };
    await expect(reorderProjects(store, actor, [id, id])).rejects.toThrow();
    expect(store.reorder).not.toHaveBeenCalled();
    await reorderProjects(store, actor, [id]);
    expect(store.reorder).toHaveBeenCalledWith([id], "editor");
  });
});
