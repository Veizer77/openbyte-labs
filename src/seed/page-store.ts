import "server-only";
import type { Database } from "@/db/connection";
import { pages } from "@/db/schema/content";
import { seedState } from "@/db/schema/seed-state";
import { defaultPages } from "./page-defaults";

/**
 * Seeds the Page Builder with starter pages. Every row is inserted as a draft:
 * the owner reviews and publishes each page from /admin/pages, so the public
 * site keeps rendering its designed screens until then.
 */
export async function initializePages(
  db: Database,
): Promise<{
  status: "created" | "existing_pages" | "already_initialized";
  created: number;
}> {
  return db.transaction(async (tx) => {
    const marker = await tx
      .insert(seedState)
      .values({ key: "pages-v1" })
      .onConflictDoNothing({ target: seedState.key })
      .returning({ key: seedState.key });
    if (!marker.length) return { status: "already_initialized", created: 0 };
    const existing = await tx.select({ id: pages.id }).from(pages).limit(1);
    if (existing.length) return { status: "existing_pages", created: 0 };
    const inserted = await tx
      .insert(pages)
      .values(
        defaultPages().map((page) => ({
          slug: page.slug,
          title: page.title,
          layout: page.layout,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          ogImageId: page.ogImageId,
          sortOrder: page.sortOrder,
          status: "draft" as const,
        })),
      )
      .returning({ id: pages.id });
    return { status: "created", created: inserted.length };
  });
}
