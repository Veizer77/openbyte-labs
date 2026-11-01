import "server-only";

import { z } from "zod";
import { faqInputSchema } from "@/schemas/faqs";
import { projectContentBlockSchema, projectLinkSchema } from "@/schemas/blocks";
import { serviceInputSchema } from "@/schemas/services";

const sourceKey = z.string().regex(/^[a-z][a-z0-9:_-]{2,100}$/);
const sourcePath = z.string().regex(/^(src|public)\/[\w./()\[\] -]+(?::\d+)?$/);
const plainText = z.string().trim().min(1).max(4_000);

export const contentAssetSchema = z
  .object({
    sourceKey,
    sourcePath: z
      .string()
      .regex(/^public\/images\/[A-Za-z0-9_. -]+\.(?:jpe?g|png|webp)$/i),
    expectedMimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
    altCandidate: z.string().trim().min(1).max(250),
    usageSourceKeys: z.array(sourceKey).min(1).max(20),
    reviewFlags: z.array(z.string().min(1).max(120)).max(12),
  })
  .strict();

const sourceVariantSchema = z
  .object({
    sourcePath,
    title: z.string().trim().min(1).max(250).optional(),
    summary: z.string().trim().min(1).max(4_000).optional(),
    clientName: z.string().trim().max(250).nullable().optional(),
    year: z.number().int().min(1900).max(2200).nullable().optional(),
    categoryLabels: z.array(plainText).max(10).optional(),
    technologies: z.array(plainText).max(30).optional(),
    imageSourceKey: sourceKey.optional(),
  })
  .strict();

const projectPayloadSchema = z
  .object({
    title: z.string().trim().min(1).max(250),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(120),
    tagline: z.string().trim().max(500),
    clientName: z.string().trim().max(250).nullable(),
    year: z.number().int().min(1900).max(2200).nullable(),
    summary: z.string().trim().max(4_000),
    categoryNames: z.array(plainText).max(10),
    technologies: z.array(plainText).max(30),
    featuredImageSourceKey: sourceKey.nullable(),
    galleryImageSourceKeys: z.array(sourceKey).max(24),
    contentBlocks: z.array(projectContentBlockSchema).max(50),
    links: z.array(projectLinkSchema).max(30),
    isFeatured: z.boolean(),
    sortOrder: z.number().int().min(0).max(2_147_483_647),
  })
  .strict();

const projectEntrySchema = z
  .object({
    sourceKey,
    sourceVersion: z.string().min(1).max(80),
    sourcePath,
    evidencePaths: z.array(sourcePath).min(1).max(20),
    intendedStatus: z.enum(["draft", "published"]),
    /** Publication is allowed only after the canonical copy has owner approval. */
    canonicalPayloadApproved: z.boolean(),
    payload: projectPayloadSchema,
    sourceVariants: z.array(sourceVariantSchema).min(1).max(12),
    conflicts: z
      .array(
        z
          .object({
            field: z.string().min(1).max(80),
            reason: z.string().min(1).max(500),
          })
          .strict(),
      )
      .max(20),
    reviewFlags: z.array(z.string().min(1).max(120)).max(20),
  })
  .strict()
  .refine(
    (entry) =>
      entry.intendedStatus !== "published" || entry.canonicalPayloadApproved,
    {
      path: ["canonicalPayloadApproved"],
      message: "Proyek tidak dapat dipublikasikan sebelum persetujuan pemilik.",
    },
  );

const serviceEntrySchema = z
  .object({
    sourceKey,
    sourceVersion: z.string().min(1).max(80),
    sourcePath,
    intendedStatus: z.enum(["draft", "active"]),
    canonicalPayloadApproved: z.boolean(),
    payload: serviceInputSchema,
    reviewFlags: z.array(z.string().min(1).max(120)).max(20),
  })
  .strict()
  .refine(
    (entry) =>
      entry.intendedStatus === "draft"
        ? !entry.canonicalPayloadApproved &&
          !entry.payload.isActive &&
          entry.reviewFlags.length > 0
        : entry.canonicalPayloadApproved &&
          entry.payload.isActive &&
          entry.reviewFlags.length === 0,
    {
      path: ["canonicalPayloadApproved"],
      message:
        "Layanan hanya dapat aktif setelah payload kanonis disetujui dan review selesai; kandidat draf wajib nonaktif.",
    },
  );

const testimonialEntrySchema = z
  .object({
    sourceKey,
    sourceVersion: z.string().min(1).max(80),
    sourcePath,
    intendedStatus: z.literal("inactive"),
    authorNameCandidate: z.null(),
    authorRole: z.string().trim().min(1).max(160),
    organizationCandidate: z.string().trim().max(250).nullable(),
    quote: z.string().trim().min(1).max(2_000),
    relatedProjectSourceKey: sourceKey,
    reviewFlags: z.array(z.string().min(1).max(120)).min(1).max(20),
  })
  .strict();

const faqCandidateSchema = z
  .object({
    sourceKey,
    sourceVersion: z.string().min(1).max(80),
    sourcePath,
    intendedStatus: z.literal("inactive"),
    payload: faqInputSchema,
    reviewFlags: z.array(z.string().min(1).max(120)).min(1).max(20),
  })
  .strict()
  .refine((entry) => !entry.payload.isActive, {
    path: ["payload", "isActive"],
    message: "FAQ manifest harus nonaktif sampai review selesai.",
  });

const pageGapSchema = z
  .object({
    sourceKey,
    sourcePath,
    target: z.enum(["pages", "site_settings", "existing_foundation"]),
    gap: z.string().min(1).max(600),
    disposition: z.enum([
      "schema_gap",
      "editor_gap",
      "source_conflict",
      "preserve_existing",
    ]),
  })
  .strict();

export const frontendContentManifestSchema = z
  .object({
    datasetKey: z.literal("openbyte-frontend-r1"),
    manifestVersion: z.literal(1),
    sourceRevision: z.literal("2026-10-31"),
    assets: z.array(contentAssetSchema),
    projects: z.array(projectEntrySchema),
    services: z.array(serviceEntrySchema),
    testimonials: z.array(testimonialEntrySchema),
    faqCandidates: z.array(faqCandidateSchema),
    pageGaps: z.array(pageGapSchema),
    protectedFoundation: z
      .array(
        z
          .object({
            collection: z.string().min(1).max(80),
            knownRows: z.number().int().min(0),
            action: z.literal("preserve_existing"),
            sourcePath: z.array(sourcePath).min(1).max(12),
          })
          .strict(),
      )
      .min(1),
    excludedRecords: z.array(z.string().min(1).max(160)).min(1),
    excludedAssets: z.array(sourcePath),
  })
  .strict();

export type FrontendContentManifest = z.output<
  typeof frontendContentManifestSchema
>;
export type FrontendProjectEntry = FrontendContentManifest["projects"][number];
export type FrontendServiceEntry = FrontendContentManifest["services"][number];
export type FrontendTestimonialEntry =
  FrontendContentManifest["testimonials"][number];
export type FrontendFaqCandidate =
  FrontendContentManifest["faqCandidates"][number];
export type FrontendAssetEntry = FrontendContentManifest["assets"][number];

/**
 * Frozen source snapshot for the first content import review. Values from the
 * fixture are preserved as candidates; visible screen variants and conflicts
 * remain explicit and prevent an automatic choice during apply.
 */
export const FRONTEND_CONTENT_MANIFEST = {
  datasetKey: "openbyte-frontend-r1",
  manifestVersion: 1,
  sourceRevision: "2026-10-31",
  assets: [],
  projects: [
    {
      sourceKey: "project:example-1",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/fixtures/projects.ts:12",
      evidencePaths: [
        "src/fixtures/projects.ts:12",
        "src/components/screens/site/daftar-portofolio.tsx:448",
        "src/components/screens/site/beranda.tsx:1156",
        "src/components/screens/site/detail-proyek-contoh.tsx:180",
      ],
       intendedStatus: "draft",
       canonicalPayloadApproved: false,
      payload: {
         title: "Proyek Contoh",
         slug: "proyek-contoh",
         tagline: "Sistem informasi dengan peta dan alur layanan digital.",
        clientName: null,
        year: null,
        summary:
           "Contoh sistem informasi untuk mengelola data dan alur layanan organisasi.",
        categoryNames: ["Instansi / Pemdes"],
        technologies: [
          "Next.js 14",
          "PostGIS 3",
          "InsForge",
          "Leaflet GIS",
          "QR Surat",
        ],
        featuredImageSourceKey: null,
        galleryImageSourceKeys: [],
        contentBlocks: [],
        links: [],
        isFeatured: true,
        sortOrder: 1,
      },
      sourceVariants: [
        {
          sourcePath: "src/components/screens/site/daftar-portofolio.tsx:595",
           title: "Proyek Contoh",
           summary: "Contoh sistem informasi dengan peta dan alur layanan digital.",
          categoryLabels: ["Instansi / Pemdes"],
          technologies: [
            "Next.js 14 App Router",
            "PostgreSQL / PostGIS",
            "Leaflet Vector",
            "QR Cryptographic Sign",
          ],
        },
        {
          sourcePath: "src/components/screens/site/beranda.tsx:1156",
           title: "Proyek Contoh",
           summary: "Contoh deskripsi proyek publik yang menunggu tinjauan pemilik.",
          categoryLabels: ["PEMERINTAHAN PUBLIK"],
        },
        {
          sourcePath:
            "src/components/screens/site/detail-proyek-contoh.tsx:180",
           title: "Proyek Contoh",
           summary: "Contoh deskripsi proyek yang belum disetujui untuk publikasi.",
        },
        {
          sourcePath: "src/app/(public)/[[...path]]/page.tsx:94",
           title: "Proyek Contoh",
           clientName: null,
           year: null,
        },
      ],
      conflicts: [
        {
          field: "title",
          reason:
            "Fixture, homepage, listing, dan detail memakai nama tampilan berbeda.",
        },
        {
          field: "summary",
          reason:
            "Fixture, homepage, listing, dan detail memakai ringkasan berbeda.",
        },
        {
          field: "technologies",
          reason:
            "Daftar teknologi fixture berbeda dari tag yang dirender pada kartu portofolio.",
        },
        {
          field: "clientName/year",
          reason:
            "Identitas klien, tahun, dan rincian proyek dihapus dari fixture. Konten perlu persetujuan pemilik sebelum dipublikasikan.",
        },
      ],
      reviewFlags: [],
    },
    {
      sourceKey: "project:example-2",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/fixtures/projects.ts:29",
      evidencePaths: [
        "src/fixtures/projects.ts:29",
        "src/components/screens/site/daftar-portofolio.tsx:873",
        "src/components/screens/site/beranda.tsx:1266",
      ],
      intendedStatus: "draft",
      canonicalPayloadApproved: false,
      payload: {
        title: "Proyek Contoh 2",
        slug: "proyek-contoh-2",
        tagline: "Aplikasi pencatatan layanan dan ringkasan data.",
        clientName: null,
        year: null,
        summary:
          "Contoh aplikasi untuk pencatatan layanan; rincian proyek belum disetujui untuk publikasi.",
        categoryNames: ["Instansi / Pemdes"],
        technologies: ["React 18", "Vite", "InsForge SDK", "Vitest"],
        featuredImageSourceKey: null,
        galleryImageSourceKeys: [],
        contentBlocks: [
          {
            type: "bullets",
            items: [
              "Perhitungan Z-Score TB/U, BB/U, BB/TB otomatis",
              "Alur Registrasi → Pengukuran → Konseling Gizi",
            ],
          },
        ],
        links: [],
        isFeatured: true,
        sortOrder: 2,
      },
      sourceVariants: [
        {
          sourcePath: "src/components/screens/site/daftar-portofolio.tsx:873",
          title: "Proyek Contoh 2",
          summary: "Contoh aplikasi pencatatan layanan.",
          categoryLabels: ["Instansi / Kesehatan"],
          technologies: [
            "React 18",
            "InsForge SDK",
            "Vitest Suite",
            "WHO SD Tables",
          ],
        },
        {
          sourcePath: "src/components/screens/site/beranda.tsx:1266",
          title: "Proyek Contoh 2",
          summary: "Contoh deskripsi aplikasi yang menunggu tinjauan pemilik.",
          categoryLabels: ["LAYANAN KESEHATAN"],
        },
      ],
      conflicts: [
        {
          field: "categoryNames",
          reason:
            "Fixture menyebut Instansi / Pemdes; kartu portofolio menyebut Instansi / Kesehatan.",
        },
        {
          field: "title/summary",
          reason: "Nama dan ringkasan fixture, homepage, dan listing berbeda.",
        },
        {
          field: "technologies",
          reason: "Fixture dan daftar teknologi di kartu portofolio berbeda.",
        },
      ],
      reviewFlags: [],
    },
    {
      sourceKey: "project:example-3",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/fixtures/projects.ts:39",
      evidencePaths: [
        "src/fixtures/projects.ts:39",
        "src/components/screens/site/daftar-portofolio.tsx:1248",
        "src/components/screens/site/beranda.tsx:1376",
      ],
      intendedStatus: "draft",
      canonicalPayloadApproved: false,
      payload: {
        title: "Proyek Contoh 3",
        slug: "proyek-contoh-3",
        tagline: "Aplikasi web dan mobile untuk operasional layanan.",
        clientName: null,
        year: null,
        summary:
          "Contoh aplikasi operasional; rincian proyek belum disetujui untuk publikasi.",
        categoryNames: ["Instansi / Pemdes", "Aplikasi Mobile"],
        technologies: [
          "Next.js 16",
          "Flutter 3.x",
          "Supabase PostgreSQL",
          "RLS",
        ],
        featuredImageSourceKey: null,
        galleryImageSourceKeys: [],
        contentBlocks: [
          {
            type: "bullets",
            items: [
              "Pencatatan operasional terstruktur",
              "Sinkronisasi data untuk penggunaan lapangan",
            ],
          },
        ],
        links: [],
        isFeatured: true,
        sortOrder: 3,
      },
      sourceVariants: [
        {
          sourcePath: "src/components/screens/site/daftar-portofolio.tsx:1248",
          title: "Proyek Contoh 3",
          summary: "Contoh aplikasi web dan mobile untuk operasional layanan.",
          categoryLabels: ["Utilitas Publik"],
          technologies: [
            "Next.js 16",
            "Flutter 3.x Engine",
            "Supabase Postgres",
            "Thermal Print ESC/POS",
          ],
        },
        {
          sourcePath: "src/components/screens/site/beranda.tsx:1376",
          title: "Proyek Contoh 3",
          summary: "Contoh deskripsi proyek yang menunggu tinjauan pemilik.",
          categoryLabels: ["UTILITAS & BILLING"],
        },
      ],
      conflicts: [
        {
          field: "categoryNames",
          reason:
            "Fixture memakai Instansi / Pemdes dan Aplikasi Mobile; kartu memakai Utilitas Publik.",
        },
        {
          field: "title/summary",
          reason:
            "Fixture, homepage, dan listing memakai variasi nama/ringkasan.",
        },
        {
          field: "technologies",
          reason: "Fixture dan kartu mencantumkan teknologi yang tidak sama.",
        },
      ],
      reviewFlags: [],
    },
    {
      sourceKey: "project:example-4",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/fixtures/projects.ts:49",
      evidencePaths: [
        "src/fixtures/projects.ts:49",
        "src/components/screens/site/daftar-portofolio.tsx:1583",
      ],
      intendedStatus: "draft",
      canonicalPayloadApproved: false,
      payload: {
        title: "Proyek Contoh 4",
        slug: "proyek-contoh-4",
        tagline: "Katalog dan alur pemesanan digital.",
        clientName: null,
        year: null,
        summary:
          "Contoh direktori usaha dengan katalog produk dan alur pemesanan digital.",
        categoryNames: ["Bisnis & UMKM"],
        technologies: ["React Router v7", "Neon Serverless Postgres", "AWS S3"],
        featuredImageSourceKey: null,
        galleryImageSourceKeys: [],
        contentBlocks: [],
        links: [],
        isFeatured: false,
        sortOrder: 4,
      },
      sourceVariants: [
        {
          sourcePath: "src/components/screens/site/daftar-portofolio.tsx:1583",
          title: "Proyek Contoh 4",
          summary: "Contoh katalog digital yang menunggu tinjauan pemilik.",
          categoryLabels: ["Bisnis & UMKM"],
          technologies: [
            "React Router v7",
            "Neon Serverless Postgres",
            "AWS S3 Assets",
            "Drizzle ORM",
          ],
        },
      ],
      conflicts: [
        {
          field: "title/summary",
          reason: "Nama dan ringkasan kartu berbeda dari fixture.",
        },
        {
          field: "technologies",
          reason:
            "Kartu menambah Drizzle ORM dan memberi label berbeda untuk AWS S3.",
        },
      ],
      reviewFlags: [],
    },
    {
      sourceKey: "project:example-5",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/fixtures/projects.ts:59",
      evidencePaths: [
        "src/fixtures/projects.ts:59",
        "src/components/screens/site/daftar-portofolio.tsx:1908",
      ],
      intendedStatus: "draft",
      canonicalPayloadApproved: false,
      payload: {
        title: "Proyek Contoh 5",
        slug: "proyek-contoh-5",
        tagline: "Website layanan dengan alur pemesanan digital.",
        clientName: null,
        year: null,
        summary:
          "Contoh website layanan; rincian proyek belum disetujui untuk publikasi.",
        categoryNames: ["Bisnis & UMKM"],
        technologies: [
          "HTML5 Semantic",
          "Modern CSS",
          "WhatsApp Direct Booking",
        ],
        featuredImageSourceKey: null,
        galleryImageSourceKeys: [],
        contentBlocks: [
          {
            type: "richText",
            body: {
              version: 1,
              blocks: [
                {
                  type: "paragraph",
                  children: [
                    {
                      type: "text",
                      text: "Laman menata pilihan layanan, harga, jadwal, dan pemesanan langsung melalui WhatsApp.",
                    },
                  ],
                },
              ],
            },
          },
        ],
        links: [],
        isFeatured: false,
        sortOrder: 5,
      },
      sourceVariants: [
        {
          sourcePath: "src/components/screens/site/daftar-portofolio.tsx:1908",
          title: "Proyek Contoh 5",
          summary: "Contoh website layanan yang menunggu tinjauan pemilik.",
          categoryLabels: ["Bisnis Jasa"],
          technologies: [
            "Semantic HTML5",
            "Modular CSS Variables",
            "WhatsApp Deep Linking",
            "Zero Dependency",
          ],
        },
      ],
      conflicts: [
        {
          field: "title/summary",
          reason: "Nama dan ringkasan kartu berbeda dari fixture.",
        },
        {
          field: "categoryNames",
          reason: "Fixture memakai Bisnis & UMKM; kartu memakai Bisnis Jasa.",
        },
        {
          field: "technologies",
          reason: "Daftar teknologi fixture berbeda dari kartu portofolio.",
        },
      ],
      reviewFlags: [],
    },
    {
      sourceKey: "project:example-6",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/fixtures/projects.ts:69",
      evidencePaths: [
        "src/fixtures/projects.ts:69",
        "src/components/screens/site/daftar-portofolio.tsx:2238",
      ],
      intendedStatus: "draft",
      canonicalPayloadApproved: false,
      payload: {
        title: "Proyek Contoh 6",
        slug: "proyek-contoh-6",
        tagline: "Microsite acara dengan RSVP digital.",
        clientName: null,
        year: null,
        summary:
          "Contoh microsite acara; rincian proyek belum disetujui untuk publikasi.",
        categoryNames: ["Undangan Digital & Event"],
        technologies: ["HTML5 Canvas", "Web Audio API", "Google Sheets RSVP"],
        featuredImageSourceKey: null,
        galleryImageSourceKeys: [],
        contentBlocks: [
          {
            type: "bullets",
            items: [
              "URL slug dinamis",
              "Ucapan doa real-time",
              "QR check-in lokasi resepsi",
            ],
          },
        ],
        links: [],
        isFeatured: false,
        sortOrder: 6,
      },
      sourceVariants: [
        {
          sourcePath: "src/components/screens/site/daftar-portofolio.tsx:2238",
          title: "Proyek Contoh 6",
          summary: "Contoh microsite acara yang menunggu tinjauan pemilik.",
          categoryLabels: ["Undangan Digital & Event"],
          technologies: [
            "HTML5 Canvas Engine",
            "Web Audio API Background Player",
            "Google Sheets Live Sync",
            "Guest Slug Engine",
          ],
        },
      ],
      conflicts: [
        {
          field: "title/summary",
          reason:
            "Nama dan ringkasan kartu berbeda dari fixture dan memuat nama orang.",
        },
        {
          field: "technologies",
          reason:
            "Kartu menggunakan label teknologi yang berbeda dari fixture.",
        },
      ],
      reviewFlags: [],
    },
  ],
  services: [
    {
      sourceKey: "service:information-systems",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/components/screens/site/beranda.tsx:648",
       intendedStatus: "draft",
       canonicalPayloadApproved: false,
      payload: {
        title: "Sistem Informasi & Satu Data",
        description:
          "Sistem informasi untuk mengelola data instansi, pemetaan wilayah, dan alur persuratan digital.",
        highlights: [],
        icon: "Database",
         isActive: false,
        sortOrder: 1,
      },
       reviewFlags: ["Copy layanan menunggu verifikasi dan persetujuan pemilik."],
    },
    {
      sourceKey: "service:mobile-applications",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/components/screens/site/beranda.tsx:753",
       intendedStatus: "draft",
       canonicalPayloadApproved: false,
      payload: {
        title: "Aplikasi Mobile Lintas Platform",
        description:
          "Aplikasi mobile lintas platform untuk pencatatan data dan penggunaan layanan melalui ponsel.",
        highlights: [],
        icon: "Smartphone",
         isActive: false,
        sortOrder: 2,
      },
       reviewFlags: ["Copy layanan menunggu verifikasi dan persetujuan pemilik."],
    },
    {
      sourceKey: "service:web-business-apps",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/components/screens/site/beranda.tsx:865",
       intendedStatus: "draft",
       canonicalPayloadApproved: false,
      payload: {
        title: "Website & Web App Bisnis",
        description:
          "Website dan aplikasi web untuk menyajikan informasi, mengelola proses bisnis, dan mengarahkan pemesanan ke kanal yang disepakati.",
        highlights: [],
        icon: "Globe",
         isActive: false,
        sortOrder: 3,
      },
       reviewFlags: ["Copy layanan menunggu verifikasi dan persetujuan pemilik."],
    },
    {
      sourceKey: "service:custom-and-interactive",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/components/screens/site/beranda.tsx:970",
       intendedStatus: "draft",
       canonicalPayloadApproved: false,
      payload: {
        title: "Sistem Kustom & Event Interaktif",
        description:
          "Microsite kustom untuk pengalaman interaktif, pendaftaran acara, dan pencatatan data sesuai kebutuhan.",
        highlights: [],
        icon: "Code",
         isActive: false,
        sortOrder: 4,
      },
       reviewFlags: ["Copy layanan menunggu verifikasi dan persetujuan pemilik."],
    },
  ],
  testimonials: [
    {
      sourceKey: "testimonial:homepage-example-1",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/components/screens/site/beranda.tsx:1712",
      intendedStatus: "inactive",
      authorNameCandidate: null,
      authorRole: "Perwakilan organisasi demo",
      organizationCandidate: null,
      quote:
        "Testimoni contoh dihapus sampai kutipan, identitas, dan izin publikasi diverifikasi.",
      relatedProjectSourceKey: "project:example-1",
      reviewFlags: [
        "Nama narasumber tidak tersedia di layar.",
        "Kebenaran kutipan, hubungan proyek, izin publikasi, dan klaim bebas pungli belum diverifikasi.",
      ],
    },
    {
      sourceKey: "testimonial:homepage-example-2",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/components/screens/site/beranda.tsx:1836",
      intendedStatus: "inactive",
      authorNameCandidate: null,
      authorRole: "Perwakilan organisasi demo",
      organizationCandidate: null,
      quote:
        "Testimoni contoh dihapus sampai kutipan, identitas, klaim, dan izin publikasi diverifikasi.",
      relatedProjectSourceKey: "project:example-2",
      reviewFlags: [
        "Nama narasumber tidak tersedia di layar.",
        "Kebenaran kutipan, hubungan proyek, izin publikasi, dan klaim ribuan rekam tanpa konflik belum diverifikasi.",
      ],
    },
  ],
  faqCandidates: [
    {
      sourceKey: "faq:homepage-code-ownership",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/components/screens/site/beranda.tsx:1958",
      intendedStatus: "inactive",
      payload: {
        question:
          "Bagaimana keamanan dan kepemilikan kode sumber ditetapkan?",
        answer: {
          version: 1,
          blocks: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  text: "Penyerahan source code, hak akses, dan kepemilikan hasil kerja disepakati dalam kontrak. Keamanan dan scope ditinjau sesuai kebutuhan proyek.",
                },
              ],
            },
          ],
        },
        isActive: false,
        requiresTracking: false,
        sortOrder: 1,
      },
      reviewFlags: [
        "Jawaban masih singkat dan perlu diselaraskan dengan ketentuan legal yang disetujui.",
      ],
    },
    {
      sourceKey: "faq:homepage-hosting",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/components/screens/site/beranda.tsx:1998",
      intendedStatus: "inactive",
      payload: {
        question:
          "Apakah sistem dapat beroperasi jika instansi tidak memiliki server lokal fisik?",
        answer: {
          version: 1,
          blocks: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  text: "Bisa. Hosting aplikasi dan database dapat memakai layanan cloud. Biaya layanan pihak ketiga disepakati terpisah.",
                },
              ],
            },
          ],
        },
        isActive: false,
        requiresTracking: false,
        sortOrder: 2,
      },
      reviewFlags: [
        "Sumber tidak menetapkan provider, biaya, atau detail konfigurasi; verifikasi sebelum mengaktifkan.",
      ],
    },
    {
      sourceKey: "faq:homepage-warranty",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/components/screens/site/beranda.tsx:2038",
      intendedStatus: "inactive",
      payload: {
        question: "Apakah dukungan purnajual disediakan?",
        answer: {
          version: 1,
          blocks: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  text: "Cakupan dukungan, garansi, masa berlaku, dan pengecualian hanya ditetapkan bila disepakati tertulis dalam dokumen proyek.",
                },
              ],
            },
          ],
        },
        isActive: false,
        requiresTracking: false,
        sortOrder: 3,
      },
      reviewFlags: [
        "Cakupan dukungan dan garansi belum disetujui; isi dan durasi harus dikonfirmasi sebelum publikasi.",
      ],
    },
    {
      sourceKey: "faq:homepage-project-progress",
      sourceVersion: "frontend-review-2026-10-31",
      sourcePath: "src/components/screens/site/beranda.tsx:2078",
      intendedStatus: "inactive",
      payload: {
        question: "Bagaimana mekanisme pelaporan progres pengerjaan proyek?",
        answer: {
          version: 1,
          blocks: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  text: "Kanal komunikasi dan pelaporan ditetapkan bersama untuk setiap proyek. Portal tracking publik belum tersedia.",
                },
              ],
            },
          ],
        },
        isActive: false,
        requiresTracking: true,
        sortOrder: 4,
      },
      reviewFlags: [
        "Tracking Rilis 2 belum tersedia; jangan aktifkan FAQ ini pada Rilis 1.",
      ],
    },
  ],
  pageGaps: [
    {
      sourceKey: "page:home-copy",
      sourcePath: "src/components/screens/site/beranda.tsx:1",
      target: "pages",
      gap: "Hero sebagian ada di Settings, tetapi copy layanan, showcase, trust metrics, testimonial, FAQ dan CTA lain masih inline; layout/block yang aktif belum membaca Page Builder.",
      disposition: "editor_gap",
    },
    {
      sourceKey: "page:project-listing-copy",
      sourcePath: "src/components/screens/site/daftar-portofolio.tsx:1",
      target: "pages",
      gap: "Filter, heading, label kartu dan variasi konten per konteks masih inline; title/summary/technology berbeda dari fixture.",
      disposition: "source_conflict",
    },
    {
      sourceKey: "page:service-detail-copy",
      sourcePath: "src/components/screens/site/detail-layanan.tsx:1",
      target: "pages",
      gap: "Detail memuat modul, SLA, keamanan, harga, termin, dan timeline yang tidak direpresentasikan ServiceInput; banyak klaim perlu review.",
      disposition: "schema_gap",
    },
    {
      sourceKey: "page:about-copy",
      sourcePath: "src/components/screens/site/tentang-kami.tsx:1",
      target: "pages",
      gap: "Prinsip, metodologi, tim, kapabilitas, dan klaim garansi/keamanan belum memiliki editor field/block yang mempertahankan struktur konten aktif.",
      disposition: "schema_gap",
    },
    {
      sourceKey: "page:legal-copy",
      sourcePath: "src/components/screens/site/ketentuan-layanan.tsx:1",
      target: "site_settings",
      gap: "Legal screen inline bertentangan/berbeda dari Settings privacy policy yang memiliki marker [ISI]; legal harus direview sebelum dipetakan atau diterbitkan.",
      disposition: "source_conflict",
    },
    {
      sourceKey: "page:faq-home-copy",
      sourcePath: "src/components/screens/site/beranda.tsx:1958",
      target: "existing_foundation",
      gap: "FAQ homepage berisi 4 pasangan tanya-jawab yang berbeda dari 10 FAQ foundation; ada jawaban tracking Rilis 2 yang belum siap.",
      disposition: "source_conflict",
    },
    {
      sourceKey: "page:package-screen-copy",
      sourcePath: "src/components/screens/site/paket-layanan-harga.tsx:1",
      target: "existing_foundation",
      gap: "Screen paket menampilkan copy dan klaim berbeda dari tiga paket foundation; pertahankan data DB dan selesaikan rekonsiliasi per field.",
      disposition: "preserve_existing",
    },
  ],
  protectedFoundation: [
    {
      collection: "categories",
      knownRows: 4,
      action: "preserve_existing",
      sourcePath: ["src/seed/package-defaults.ts:4"],
    },
    {
      collection: "service_packages",
      knownRows: 3,
      action: "preserve_existing",
      sourcePath: ["src/seed/package-defaults.ts:37"],
    },
    {
      collection: "service_addons",
      knownRows: 4,
      action: "preserve_existing",
      sourcePath: ["src/seed/package-defaults.ts:94"],
    },
    {
      collection: "faqs",
      knownRows: 10,
      action: "preserve_existing",
      sourcePath: ["src/seed/faq-defaults.ts:3"],
    },
    {
      collection: "calculator_groups/items/rules",
      knownRows: 13,
      action: "preserve_existing",
      sourcePath: ["src/fixtures/calculator.ts:1"],
    },
    {
      collection: "availability_rules",
      knownRows: 20,
      action: "preserve_existing",
      sourcePath: ["src/fixtures/booking.ts:8"],
    },
    {
      collection: "site_settings",
      knownRows: 1,
      action: "preserve_existing",
      sourcePath: ["src/seed/site-settings-defaults.ts:18"],
    },
  ],
  excludedRecords: [
    "customer bookings, inquiries, quote requests, transactions, invoices and payments",
    "customer accounts, sessions, credentials, 2FA, recovery codes and audit history",
    "client portal/tracking records, project operations, client files and Rilis 2 data",
    "dashboard analytics, activity counters and other simulated operational data",
  ],
  excludedAssets: [],
} satisfies z.input<typeof frontendContentManifestSchema>;
