import "server-only";
import { z } from "zod";
import { projectContentBlockSchema, projectLinkSchema } from "@/schemas/blocks";
import { projectSlugSchema } from "@/schemas/projects";
import { publicMediaUrlSchema } from "@/schemas/media";

const publicProjectSchema = z
  .object({
    slug: projectSlugSchema,
    title: z.string().min(1).max(250),
    tagline: z.string().max(500),
    summary: z.string().max(4000),
    clientName: z.string().nullable(),
    year: z.number().int().nullable(),
    imageUrl: publicMediaUrlSchema.nullable(),
    imageAlt: z.string().max(250),
    links: z.array(projectLinkSchema).max(30),
    categories: z.array(z.string()),
    technologies: z.array(z.string()),
    isFeatured: z.boolean(),
  })
  .strict();

const listOptionsSchema = z
  .object({
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
  })
  .strict();

export type PublicProject = z.output<typeof publicProjectSchema>;
const publicProjectDetailSchema = publicProjectSchema.extend({
  gallery: z.array(z.object({ mediaId: z.uuid(), alt: z.string() }).strict()).default([]),
  contentBlocks: z.array(projectContentBlockSchema).default([]),
  metaTitle: z.string().nullable().default(null),
  metaDescription: z.string().nullable().default(null),
  ogImageId: z.uuid().nullable().default(null),
});
export type PublicProjectDetail = z.output<typeof publicProjectDetailSchema>;

export interface PublicProjectStore {
  listPublished(options: z.output<typeof listOptionsSchema>): Promise<unknown[]>;
  findPublishedBySlug(slug: string): Promise<unknown | null>;
}

export async function listPublicProjects(
  store: PublicProjectStore,
  input: unknown = { limit: 100, offset: 0 },
): Promise<PublicProject[]> {
  const options = listOptionsSchema.parse(input);
  return z
    .array(publicProjectSchema)
    .parse(await store.listPublished(options));
}

export async function getPublicProjectBySlug(
  store: PublicProjectStore,
  slug: unknown,
): Promise<PublicProjectDetail | null> {
  const parsedSlug = projectSlugSchema.parse(slug);
  const project = await store.findPublishedBySlug(parsedSlug);
  return project === null ? null : publicProjectDetailSchema.parse(project);
}
