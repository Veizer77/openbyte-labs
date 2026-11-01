# Backend contracts for frontend integration

This document records stable server-side entry points for replacing preview
fixtures with database-backed data. Do not import database stores or `server-only`
modules into Client Components.

## Public Settings

Server Components can call:

```ts
import { getPublicSiteSettings } from "@/lib/server/public-site";

const settings = await getPublicSiteSettings();
```

The result is `PublicSiteSettings` from `src/schemas/public-site-settings.ts`.
It includes general contact details, active navigation items, hero copy, SEO
defaults, calculator and booking configuration, and legal consent text. It
intentionally excludes WhatsApp templates, tracking controls, authentication
data, analytics IDs, and media IDs. Asset URLs will be included once the R2
media pipeline is ready.

This read currently queries the database on the server and has no mock fallback.
Persistent Next.js caching is deliberately not enabled yet: the current app does
not opt into Cache Components, and its App Router handlers still declare a
`runtime` segment config that must be migrated before enabling that cache mode.
Until that migration, reads are fresh per request; the existing settings cache
invalidation should not be treated as proof of a persistent cache hit.

## Public catalog

Server Components can load the currently implemented catalog sections together:

```ts
import { getPublicCatalog } from "@/lib/server/public-catalog";

const { settings, categories, packages, faqs } = await getPublicCatalog();
```

Packages omit deleted/internal category fields. FAQ entries omit the internal
tracking marker. This catalog does not yet include projects, services, media,
or Page Builder content; those require their content services and storage work.

## Booking availability

Client Components can request a date's current availability through:

```ts
import { getPublicBookingAvailabilityAction } from "@/actions/public/booking";

const result = await getPublicBookingAvailabilityAction({ date: "2026-11-02" });
```

The action returns an `ActionResult` containing the configured consultation
modes and available slots from PostgreSQL. `submitBookingAction` remains the
authority: it rechecks the selected slot inside its transaction and the database
exclusion constraint rejects concurrent overlaps.

## Admin Pages and Projects CMS

Admin Client Components should import the Server Actions, never the stores or
`server-only` services:

```ts
import {
  listAdminPagesAction,
  savePageAction,
  publishPageAction,
  setPageTrashAction,
  listPageVersionsAction,
  restorePageVersionAction,
} from "@/actions/admin/pages";
import {
  listAdminProjectsAction,
  saveProjectAction,
  publishProjectAction,
  setProjectTrashAction,
  listProjectVersionsAction,
  restoreProjectVersionAction,
} from "@/actions/admin/projects";
```

List actions accept `{ query?, status?, trashOnly?, limit?, offset? }` and return
validated records. Save actions accept `{ id: string | null, value }`; `value`
must follow `PageInput` or `ProjectInput` from `src/schemas/pages.ts` and
`src/schemas/projects.ts`. Project inputs carry category and technology IDs,
image IDs, galleries, content blocks, links, and SEO fields. All URLs in project
links must use HTTPS. The project slug can be omitted or empty to derive it from
the title; an explicitly supplied slug is validated and retained.

Publish actions accept `{ id, publishedAt? }`; omitted `publishedAt` means now,
and a future timestamp can be stored for scheduled publication. A public loader
must filter out future timestamps when project/page reads are added. A project
needs a finalized featured image. Both types reject `[ISI]` placeholders and
unfinalized/deleted media. Save always creates a new draft version and resets the
record to draft, so a previously published record is not exposed until an
explicit publish action. Trash and restore are soft-delete operations. Version
restore revalidates its snapshot, restores it as a draft, and appends a new
`restore` version rather than rewriting history. Content write, version insert,
and audit insert share one PostgreSQL transaction.

These contracts cover Rilis 1 only and do not expose client-project portal data.

## Admin Media Upload

Import the upload actions from `@/actions/admin/media`:

```ts
import {
  createMediaUploadAction,
  finalizeMediaUploadAction,
} from "@/actions/admin/media";
```

1. Call `createMediaUploadAction({ filename, mimeType, sizeBytes })`. It returns
   `{ id, uploadUrl, headers, expiresAt }`. The URL is a five-minute bearer URL
   for one `PUT` to the private staging bucket. Upload the original `File`
   directly from the browser using the returned `Content-Type` and the original
   `File` as the request body; do not send image bytes through a Server Action.
2. After the `PUT` succeeds, call `finalizeMediaUploadAction({ id, alt })`. The
   server checks R2's object size and content type, decodes the bytes with Sharp,
   rejects MIME spoofing, SVG, animation, invalid images, images over 40 MP, or
   dimensions over 10,000 px, and writes `thumb`, `card`, `hero`, and `og` WebP
   variants to the public bucket. It then commits the finalized metadata and
   audit event in PostgreSQL and removes the staged source. The returned asset
   includes `key`, `variants`, and ready-to-render `urls` for each size.

Required server configuration: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`,
`R2_SECRET_ACCESS_KEY`, `R2_BUCKET_STAGING`, `R2_BUCKET_PUBLIC`, and
`R2_PUBLIC_BASE_URL`. Keep the staging bucket private, with no public domain, and
keep it separate from the public bucket. Scope the R2 token to object read/write
for those two buckets only. Only JPEG, PNG, and WebP are accepted; the upload
limit is 15 MiB. A pending upload is not attachable to content until finalization
succeeds. Settings, Pages, and Projects stores now fail closed for missing,
deleted, or non-finalized media references.

Configure CORS on the staging bucket for browser uploads. Restrict origins to
the exact application origins and only allow `PUT` with the `Content-Type`
header (include `http://localhost:3000` only for local development). For
example:

```json
[
  {
    "AllowedOrigins": ["https://your-app.example"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

The 15 MiB size limit is checked against R2 metadata before the server downloads
the staged object and rechecked against the bytes Sharp receives. Configure an
R2 lifecycle expiration for the staging bucket's `pending/` prefix (for example,
after one day) so abandoned or expired uploads are removed. The public bucket
must be enabled for public reads and connected to the host in
`R2_PUBLIC_BASE_URL`; no browser CORS rule is needed merely to display images.
Do not expose the staging bucket through that custom domain.
