import "server-only";
import { and, inArray, isNotNull, isNull } from "drizzle-orm";
import type { Database } from "@/db/connection";
import { media } from "@/db/schema/content";
import { getEnv } from "@/env";
import type { PublicMediaAsset } from "@/schemas/media";

export type { PublicMediaAsset } from "@/schemas/media";

/** Build an encoded URL without exposing an R2 object key as a browser prop. */
export function publicMediaUrl(baseUrl: string, key: string): string {
  const base = baseUrl.replace(/\/+$/, "");
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/${encodedKey}`;
}

/** Resolve only finalized, non-deleted assets referenced by public content. */
export async function getPublicMediaAssets(
  db: Database,
  ids: readonly (string | null | undefined)[],
): Promise<ReadonlyMap<string, PublicMediaAsset>> {
  const uniqueIds = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  if (!uniqueIds.length) return new Map();
  const baseUrl = getEnv().R2_PUBLIC_BASE_URL;
  if (!baseUrl) return new Map();

  const rows = await db
    .select({
      id: media.id,
      alt: media.alt,
      variants: media.variants,
    })
    .from(media)
    .where(
      and(
        inArray(media.id, uniqueIds),
        isNotNull(media.finalizedAt),
        isNull(media.deletedAt),
      ),
    );

  const assets = new Map<string, PublicMediaAsset>();
  for (const row of rows) {
    const { thumb, card, hero, og } = row.variants;
    if (!thumb || !card || !hero || !og) continue;
    assets.set(row.id, {
      alt: row.alt,
      urls: {
        thumb: publicMediaUrl(baseUrl, thumb),
        card: publicMediaUrl(baseUrl, card),
        hero: publicMediaUrl(baseUrl, hero),
        og: publicMediaUrl(baseUrl, og),
      },
    });
  }
  return assets;
}
