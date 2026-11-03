import { stdout } from "node:process";
import postgres from "postgres";
import { validateBootstrapTarget } from "@/auth/bootstrap-target";
import { hasOperatorConfirmation } from "./lib/operator-confirmation";
import { OperatorInputError } from "./lib/operator-error";
import { loadLocalEnv } from "./lib/load-local-env";

/**
 * Copies release content from the development database to the production one.
 *
 * Design notes:
 * - Only content tables are touched. Identity, audit, rate limit, seed markers
 *   and site settings are deliberately excluded (settings are finalised by the
 *   owner through the admin panel in S5.3).
 * - Rows are matched by natural keys (slug / key / name) instead of UUIDs,
 *   because the two branches were seeded independently and therefore hold
 *   different UUIDs for the same category or technology.
 * - Every table is written delete-then-insert inside one transaction, so a
 *   partial failure leaves production unchanged and the script can be re-run.
 * - Connection strings are never printed. Only host/database and row counts are.
 */

const CONTENT_TABLES = [
  "media",
  "projects",
  "project_categories",
  "project_technologies",
  "technologies",
  "categories",
  "service_addons",
  "testimonials",
] as const;

const CONFIRM_KEYWORD = "SYNC-CONTENT";

interface SourceMedia {
  id: string;
  key: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt: string;
  variants: Record<string, string>;
  finalized_at: Date | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface SourceProject {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  publication_enabled: boolean;
  client_name: string | null;
  year: number | null;
  published_at: Date | null;
  featured_image_id: string | null;
  gallery: { mediaId: string; alt: string }[];
  summary: string;
  content_blocks: unknown;
  links: unknown;
  is_featured: boolean;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_id: string | null;
  sort_order: number;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new OperatorInputError(`${name} belum diatur.`);
  return value;
}

async function counts(
  sql: postgres.Sql,
): Promise<Record<string, number>> {
  const result: Record<string, number> = {};
  for (const table of CONTENT_TABLES) {
    const [row] = await sql<{ n: string }[]>`
      SELECT count(*)::text AS n FROM ${sql(table)}
    `;
    result[table] = Number(row.n);
  }
  return result;
}

function reportCounts(label: string, values: Record<string, number>): void {
  const line = CONTENT_TABLES.map((t) => `${t}=${values[t]}`).join(" ");
  stdout.write(`${label}: ${line}\n`);
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");

  const sourceUri = requireEnv("SYNC_SOURCE_URI");
  const destinationUri = requireEnv("SYNC_DEST_URI");
  const source = validateBootstrapTarget(
    sourceUri,
    requireEnv("SYNC_SOURCE_TARGET"),
  );
  const destination = validateBootstrapTarget(
    destinationUri,
    requireEnv("SYNC_DEST_TARGET"),
  );

  if (source.database === destination.database)
    throw new OperatorInputError(
      "Sumber dan tujuan sync tidak boleh database yang sama.",
    );
  if (/[_-]test$/i.test(destination.database))
    throw new OperatorInputError(
      "Tujuan sync tidak boleh database test; sync ini untuk database aplikasi.",
    );
  if (!hasOperatorConfirmation(process.argv, destination.database, CONFIRM_KEYWORD))
    throw new OperatorInputError(
      `Konfirmasi target wajib: --confirm-target=${destination.database} --confirm-keyword=${CONFIRM_KEYWORD}.`,
    );

  stdout.write(
    `Sumber ${source.host}/${source.database} -> tujuan ${destination.host}/${destination.database}${dryRun ? " (dry-run)" : ""}\n`,
  );

  const reader = postgres(sourceUri, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
  });
  const writer = postgres(destinationUri, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
  });

  try {
    // ---------- read the source ----------
    const media = await reader<SourceMedia[]>`
      SELECT id, key, filename, mime_type, size_bytes, width, height, alt,
             variants, finalized_at, deleted_at, created_at, updated_at
      FROM media
      WHERE deleted_at IS NULL
      ORDER BY created_at
    `;

    const projects = await reader<SourceProject[]>`
      SELECT id, title, slug, tagline, publication_enabled, client_name, year,
             published_at, featured_image_id, gallery, summary, content_blocks,
             links, is_featured, status, meta_title, meta_description,
             og_image_id, sort_order, deleted_at, created_at, updated_at
      FROM projects
      WHERE deleted_at IS NULL
      ORDER BY sort_order, slug
    `;

    const technologies = await reader<
      { name: string; slug: string; icon: string; color: string }[]
    >`
      SELECT name, slug, icon, color
      FROM technologies
      ORDER BY slug
    `;

    const categories = await reader<
      { name: string; slug: string; icon: string; showInFilter: boolean; isActive: boolean; sortOrder: number }[]
    >`
      SELECT name, slug, icon, show_in_filter AS "showInFilter",
             is_active AS "isActive", sort_order AS "sortOrder"
      FROM categories
      ORDER BY sort_order, slug
    `;

    const projectCategoryPairs = await reader<
      { projectSlug: string; categorySlug: string }[]
    >`
      SELECT p.slug AS "projectSlug", c.slug AS "categorySlug"
      FROM project_categories pc
      JOIN projects p ON p.id = pc.project_id
      JOIN categories c ON c.id = pc.category_id
      WHERE p.deleted_at IS NULL
      ORDER BY p.slug, c.slug
    `;

    const projectTechnologyPairs = await reader<
      { projectSlug: string; technologySlug: string; sortOrder: number }[]
    >`
      SELECT p.slug AS "projectSlug", t.slug AS "technologySlug",
             pt.sort_order AS "sortOrder"
      FROM project_technologies pt
      JOIN projects p ON p.id = pt.project_id
      JOIN technologies t ON t.id = pt.technology_id
      WHERE p.deleted_at IS NULL
      ORDER BY p.slug, pt.sort_order, t.slug
    `;

    const addons = await reader<
      { name: string; description: string; price: number; billingType: string; isActive: boolean; sortOrder: number }[]
    >`
      SELECT name, description, price, billing_type AS "billingType",
             is_active AS "isActive", sort_order AS "sortOrder"
      FROM service_addons
      ORDER BY sort_order, name
    `;

    const testimonials = await reader<
      { authorName: string; authorRole: string; quote: string; photoKey: string | null; projectSlug: string | null; isActive: boolean; sortOrder: number }[]
    >`
      SELECT t.author_name AS "authorName", t.author_role AS "authorRole",
             t.quote, m.key AS "photoKey", p.slug AS "projectSlug",
             t.is_active AS "isActive", t.sort_order AS "sortOrder"
      FROM testimonials t
      LEFT JOIN media m ON m.id = t.photo_id
      LEFT JOIN projects p ON p.id = t.project_id
      ORDER BY t.sort_order, t.author_name
    `;

    stdout.write(
      `Sumber berisi ${media.length} media, ${projects.length} proyek, ` +
        `${technologies.length} teknologi, ${categories.length} kategori, ` +
        `${addons.length} addon, ${testimonials.length} testimoni.\n`,
    );

    const before = await counts(writer);
    reportCounts("Tujuan sebelum sync", before);

    if (dryRun) {
      stdout.write("Dry-run: tidak ada perubahan ditulis.\n");
      return;
    }

    const mediaKeyById = new Map(media.map((item) => [item.id, item.key]));

    await writer.begin(async (tx) => {
      // Junction rows first: they reference both projects and taxonomies.
      await tx`DELETE FROM project_technologies`;
      await tx`DELETE FROM project_categories`;
      // Projects hold the restricting reference to media, so they go first.
      await tx`DELETE FROM testimonials`;
      await tx`DELETE FROM projects`;
      await tx`
        DELETE FROM media
        WHERE key IN ${tx(media.map((item) => item.key))}
      `;

      // Categories and technologies are matched by slug and updated in place:
      // production packages already reference these rows.
      for (const item of categories) {
        await tx`
          INSERT INTO categories (name, slug, icon, show_in_filter, is_active, sort_order)
          VALUES (${item.name}, ${item.slug}, ${item.icon}, ${item.showInFilter}, ${item.isActive}, ${item.sortOrder})
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            icon = EXCLUDED.icon,
            show_in_filter = EXCLUDED.show_in_filter,
            is_active = EXCLUDED.is_active,
            sort_order = EXCLUDED.sort_order,
            updated_at = now()
        `;
      }
      for (const item of technologies) {
        await tx`
          INSERT INTO technologies (name, slug, icon, color)
          VALUES (${item.name}, ${item.slug}, ${item.icon}, ${item.color})
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            icon = EXCLUDED.icon,
            color = EXCLUDED.color,
            updated_at = now()
        `;
      }

      const mediaIdByKey = new Map<string, string>();
      for (const item of media) {
        const [inserted] = await tx<{ id: string }[]>`
          INSERT INTO media (key, filename, mime_type, size_bytes, width, height,
                             alt, variants, uploaded_by, finalized_at, deleted_at,
                             created_at, updated_at)
          VALUES (${item.key}, ${item.filename}, ${item.mime_type}, ${item.size_bytes},
                  ${item.width}, ${item.height}, ${item.alt}, ${item.variants},
                  NULL, ${item.finalized_at}, ${item.deleted_at},
                  ${item.created_at}, ${item.updated_at})
          RETURNING id
        `;
        mediaIdByKey.set(item.key, inserted.id);
      }

      const mapMedia = (id: string | null): string | null => {
        if (!id) return null;
        const key = mediaKeyById.get(id);
        if (!key) return null;
        return mediaIdByKey.get(key) ?? null;
      };

      const projectIdBySlug = new Map<string, string>();
      for (const item of projects) {
        const gallery = item.gallery.map((entry) => ({
          mediaId: mapMedia(entry.mediaId),
          alt: entry.alt,
        })).filter((entry) => entry.mediaId !== null);
        const [inserted] = await tx<{ id: string }[]>`
          INSERT INTO projects (title, slug, tagline, publication_enabled,
                                client_name, year, published_at, featured_image_id,
                                gallery, summary, content_blocks, links, is_featured,
                                status, meta_title, meta_description, og_image_id,
                                sort_order, deleted_at, created_at, updated_at)
          VALUES (${item.title}, ${item.slug}, ${item.tagline}, ${item.publication_enabled},
                  ${item.client_name}, ${item.year}, ${item.published_at},
                  ${mapMedia(item.featured_image_id)}, ${JSON.stringify(gallery)},
                  ${item.summary}, ${JSON.stringify(item.content_blocks)},
                  ${JSON.stringify(item.links)}, ${item.is_featured}, ${item.status},
                  ${item.meta_title}, ${item.meta_description}, ${mapMedia(item.og_image_id)},
                  ${item.sort_order}, ${item.deleted_at}, ${item.created_at}, ${item.updated_at})
          RETURNING id
        `;
        projectIdBySlug.set(item.slug, inserted.id);
      }

      const [categoryRows, technologyRows] = await Promise.all([
        tx<{ id: string; slug: string }[]>`SELECT id, slug FROM categories`,
        tx<{ id: string; slug: string }[]>`SELECT id, slug FROM technologies`,
      ]);
      const categoryIdBySlug = new Map(categoryRows.map((r) => [r.slug, r.id]));
      const technologyIdBySlug = new Map(technologyRows.map((r) => [r.slug, r.id]));

      for (const pair of projectCategoryPairs) {
        const projectId = projectIdBySlug.get(pair.projectSlug);
        const categoryId = categoryIdBySlug.get(pair.categorySlug);
        if (!projectId || !categoryId) continue;
        await tx`
          INSERT INTO project_categories (project_id, category_id)
          VALUES (${projectId}, ${categoryId})
          ON CONFLICT DO NOTHING
        `;
      }
      for (const pair of projectTechnologyPairs) {
        const projectId = projectIdBySlug.get(pair.projectSlug);
        const technologyId = technologyIdBySlug.get(pair.technologySlug);
        if (!projectId || !technologyId) continue;
        await tx`
          INSERT INTO project_technologies (project_id, technology_id, sort_order)
          VALUES (${projectId}, ${technologyId}, ${pair.sortOrder})
          ON CONFLICT DO NOTHING
        `;
      }

      // Addons have no natural unique key; insert only the missing names so an
      // owner-edited price in production is never overwritten.
      for (const item of addons) {
        await tx`
          INSERT INTO service_addons (name, description, price, billing_type, is_active, sort_order)
          SELECT ${item.name}, ${item.description}, ${item.price}, ${item.billingType},
                 ${item.isActive}, ${item.sortOrder}
          WHERE NOT EXISTS (SELECT 1 FROM service_addons WHERE name = ${item.name})
        `;
      }

      for (const item of testimonials) {
        const photoKey = item.photoKey;
        const photoId = photoKey ? (mediaIdByKey.get(photoKey) ?? null) : null;
        const projectId = item.projectSlug
          ? (projectIdBySlug.get(item.projectSlug) ?? null)
          : null;
        await tx`
          INSERT INTO testimonials (author_name, author_role, quote, photo_id,
                                    project_id, is_active, sort_order)
          VALUES (${item.authorName}, ${item.authorRole}, ${item.quote}, ${photoId},
                  ${projectId}, ${item.isActive}, ${item.sortOrder})
        `;
      }
    });

    const after = await counts(writer);
    reportCounts("Tujuan sesudah sync", after);

    const mismatches = CONTENT_TABLES.filter(
      (table) => (after[table] ?? 0) === 0 && (before[table] ?? 0) === 0,
    );
    if (mismatches.length)
      stdout.write(
        `Catatan: tabel tanpa baris di sumber maupun tujuan: ${mismatches.join(", ")}.\n`,
      );
    stdout.write("Sync konten selesai.\n");
  } finally {
    await reader.end({ timeout: 5 });
    await writer.end({ timeout: 5 });
  }
}

main().catch((error) => {
  if (error instanceof OperatorInputError) {
    process.stderr.write(`${error.message}\n`);
  } else {
    process.stderr.write(
      "Sync konten gagal. Periksa target dan konfigurasi tanpa membagikan kredensial.\n",
    );
  }
  process.exitCode = 1;
});
