import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import { pageRecordSchema, type PageRecord } from "@/schemas/pages";

const slugSchema = z
  .string()
  .min(1)
  .max(150)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export interface PublicPageStore {
  findBySlug(slug: string, includeDraft: boolean): Promise<unknown | null>;
}

export async function getPublishedPage(
  store: PublicPageStore,
  slug: unknown,
  now = new Date(),
): Promise<PageRecord | null> {
  const parsedSlug = slugSchema.parse(slug);
  const value = await store.findBySlug(parsedSlug, false);
  if (value === null) return null;
  const page = pageRecordSchema.parse(value);
  return page.status === "published" && page.deletedAt === null && page.publishedAt !== null && page.publishedAt <= now ? page : null;
}

export async function getAdminPagePreview(
  store: PublicPageStore,
  principal: AdminPrincipal | null,
  slug: unknown,
): Promise<PageRecord | null> {
  authorize(principal, "pages", "read");
  const parsedSlug = slugSchema.parse(slug);
  const value = await store.findBySlug(parsedSlug, true);
  if (value === null) return null;
  const page = pageRecordSchema.parse(value);
  return page.deletedAt === null ? page : null;
}
