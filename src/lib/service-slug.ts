/**
 * Services are stored without a slug column, so the public detail route derives
 * one from the title. The derivation is stable: the same title always yields the
 * same URL, and the route rejects anything that does not round-trip.
 */
export function serviceSlug(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
}

/**
 * Legacy design URLs (`/layanan/[slug]` in the prototype route map) that must
 * keep resolving even though the derived slug is longer.
 */
const legacyAliases: Record<string, string> = {
  "sistem-informasi": "sistem-informasi-dan-satu-data",
  "aplikasi-mobile": "aplikasi-mobile-lintas-platform",
  website: "website-dan-web-app-bisnis",
  "sistem-kustom": "sistem-kustom-dan-event-interaktif",
};

export function normalizeServiceSlug(slug: string): string {
  return legacyAliases[slug] ?? slug;
}

/** Resolves a URL slug to the matching service, or null when nothing matches. */
export function findServiceBySlug<T extends { title: string }>(
  services: readonly T[],
  slug: string,
): T | null {
  const wanted = normalizeServiceSlug(slug);
  return services.find((service) => serviceSlug(service.title) === wanted) ?? null;
}
