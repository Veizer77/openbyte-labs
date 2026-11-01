import type { ProjectContentBlock, ProjectLink } from "@/schemas/blocks";

export function isPortfolioConversionReady(input: {
  deleted: boolean;
  stepStatuses: readonly string[];
  finalHandoverApproved: boolean;
}): boolean {
  return (
    !input.deleted &&
    input.stepStatuses.length === 6 &&
    input.stepStatuses.every((status) => status === "done") &&
    input.finalHandoverApproved
  );
}

/** An intentionally anonymous shell; client/project source data is never copied. */
export function createAnonymousPortfolioDraft(slug: string, year: number) {
  return {
    title: "Portofolio Baru",
    slug,
    clientName: null,
    year,
    featuredImageId: null,
    gallery: [] as { mediaId: string; alt: string }[],
    summary: "",
    contentBlocks: [] as ProjectContentBlock[],
    links: [] as ProjectLink[],
    isFeatured: false,
    status: "draft" as const,
    publishedAt: null,
    metaTitle: null,
    metaDescription: null,
    ogImageId: null,
    sortOrder: 0,
  };
}
