import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { RichText } from "@/schemas/rich-text";
import { adminProfiles } from "./admin-profile";
import { projects } from "./content";
import { categories, servicePackages } from "./packages";

/**
 * Rilis 2 — Portal klien (PRD 3.6-3.8). The tables are defined now so the whole
 * schema is reviewable; they are only wired into the app in Fase 6.
 */

export type ClientVisibility = {
  staging: boolean;
  production: boolean;
  github: boolean;
  payments: boolean;
  documents: boolean;
  timeline: boolean;
};

const CLOSED_VISIBILITY: ClientVisibility = {
  staging: false,
  production: false,
  github: false,
  payments: false,
  documents: false,
  timeline: false,
};

export const stepTemplates = pgTable(
  "step_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    stepNumber: smallint("step_number").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    defaultMilestones: jsonb("default_milestones")
      .$type<string[]>()
      .notNull()
      .default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("step_templates_number_unique").on(table.stepNumber),
    check(
      "step_templates_number_check",
      sql`${table.stepNumber} BETWEEN 1 AND 6`,
    ),
    check(
      "step_templates_milestones_array_check",
      sql`jsonb_typeof(${table.defaultMilestones}) = 'array'`,
    ),
  ],
);

/** Metadata for objects in the private R2 bucket. Never served anonymously. */
export const privateFiles = pgTable(
  "private_files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull().unique(),
    filename: text("filename").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    uploadedByType: text("uploaded_by_type")
      .$type<"admin" | "client">()
      .notNull(),
    uploadedByAdminId: text("uploaded_by_admin_id").references(
      () => adminProfiles.id,
      { onDelete: "set null" },
    ),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("private_files_size_check", sql`${table.sizeBytes} >= 0`),
    check(
      "private_files_uploader_check",
      sql`${table.uploadedByType} IN ('admin', 'client')`,
    ),
  ],
);

export const clientProjects = pgTable(
  "client_projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    trackingCode: text("tracking_code").notNull(),
    accessPinHash: text("access_pin_hash").notNull(),
    pinVersion: integer("pin_version").notNull().default(1),
    clientName: text("client_name").notNull(),
    clientWhatsapp: text("client_whatsapp").notNull(),
    clientEmail: text("client_email"),
    projectTitle: text("project_title").notNull(),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "restrict",
    }),
    servicePackageId: uuid("service_package_id").references(
      () => servicePackages.id,
      { onDelete: "restrict" },
    ),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    totalCost: integer("total_cost").notNull().default(0),
    revisionsIncluded: smallint("revisions_included").notNull().default(0),
    extraRevisionPrice: integer("extra_revision_price"),
    revisionPolicySnapshot: jsonb("revision_policy_snapshot").$type<RichText>(),
    isReviewOpen: boolean("is_review_open").notNull().default(false),
    reviewOpenedAt: timestamp("review_opened_at", { withTimezone: true }),
    stagingUrl: text("staging_url"),
    productionUrl: text("production_url"),
    githubUrl: text("github_url"),
    clientVisibility: jsonb("client_visibility")
      .$type<ClientVisibility>()
      .notNull()
      .default(CLOSED_VISIBILITY),
    startDate: date("start_date", { mode: "string" }),
    targetCompletionDate: date("target_completion_date", { mode: "string" }),
    internalNotes: text("internal_notes").notNull().default(""),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    /** Derived columns: only ever written by services inside one transaction. */
    paidAmount: integer("paid_amount").notNull().default(0),
    balance: integer("balance").notNull().default(0),
    paymentStatus: text("payment_status")
      .$type<"unpaid" | "down_payment" | "paid_off">()
      .notNull()
      .default("unpaid"),
    currentStep: smallint("current_step").notNull().default(1),
    revisionsUsed: smallint("revisions_used").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("client_projects_tracking_code_unique").on(table.trackingCode),
    check(
      "client_projects_tracking_code_check",
      sql`${table.trackingCode} ~ '^PRJ-[A-HJ-NP-Z2-9]{8}$'`,
    ),
    check("client_projects_pin_version_check", sql`${table.pinVersion} > 0`),
    check(
      "client_projects_money_check",
      sql`${table.totalCost} >= 0 AND ${table.paidAmount} >= 0 AND (${table.extraRevisionPrice} IS NULL OR ${table.extraRevisionPrice} >= 0)`,
    ),
    check(
      "client_projects_derived_check",
      sql`${table.balance} = ${table.totalCost} - ${table.paidAmount} AND ${table.revisionsUsed} >= 0 AND ${table.revisionsIncluded} >= 0`,
    ),
    check(
      "client_projects_payment_status_check",
      sql`${table.paymentStatus} IN ('unpaid', 'down_payment', 'paid_off')`,
    ),
    check(
      "client_projects_current_step_check",
      sql`${table.currentStep} BETWEEN 1 AND 6`,
    ),
    check(
      "client_projects_visibility_object_check",
      sql`jsonb_typeof(${table.clientVisibility}) = 'object'`,
    ),
    index("client_projects_archived_idx").on(table.archivedAt, table.deletedAt),
  ],
);

export const projectSteps = pgTable(
  "project_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientProjectId: uuid("client_project_id")
      .notNull()
      .references(() => clientProjects.id, { onDelete: "cascade" }),
    stepNumber: smallint("step_number").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    status: text("status")
      .$type<"pending" | "in_progress" | "done">()
      .notNull()
      .default("pending"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    sortOrder: smallint("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("project_steps_number_unique").on(
      table.clientProjectId,
      table.stepNumber,
    ),
    check(
      "project_steps_number_check",
      sql`${table.stepNumber} BETWEEN 1 AND 6`,
    ),
    check(
      "project_steps_status_check",
      sql`${table.status} IN ('pending', 'in_progress', 'done')`,
    ),
    check(
      "project_steps_done_check",
      sql`(${table.status} = 'done') = (${table.completedAt} IS NOT NULL)`,
    ),
  ],
);

export const projectMilestones = pgTable(
  "project_milestones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectStepId: uuid("project_step_id")
      .notNull()
      .references(() => projectSteps.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    isCompleted: boolean("is_completed").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    sortOrder: smallint("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "project_milestones_done_check",
      sql`${table.isCompleted} = (${table.completedAt} IS NOT NULL)`,
    ),
    index("project_milestones_step_idx").on(table.projectStepId, table.sortOrder),
  ],
);

/** Manual installment invoices; payment totals remain derived from the payments ledger. */
export const projectInvoices = pgTable(
  "project_invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientProjectId: uuid("client_project_id")
      .notNull()
      .references(() => clientProjects.id, { onDelete: "cascade" }),
    invoiceNumber: text("invoice_number").notNull().unique(),
    title: text("title").notNull(),
    amount: integer("amount").notNull(),
    dueAt: date("due_at", { mode: "string" }).notNull(),
    status: text("status").$type<"draft" | "issued" | "void">().notNull().default("draft"),
    note: text("note").notNull().default(""),
    createdById: text("created_by_id").references(() => adminProfiles.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("project_invoices_amount_check", sql`${table.amount} > 0`),
    check(
      "project_invoices_number_check",
      sql`${table.invoiceNumber} ~ '^INV-[0-9]{4}-[A-Z0-9-]{3,32}$'`,
    ),
    check(
      "project_invoices_status_check",
      sql`${table.status} IN ('draft', 'issued', 'void')`,
    ),
    index("project_invoices_project_due_idx").on(
      table.clientProjectId,
      table.dueAt,
    ),
  ],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientProjectId: uuid("client_project_id")
      .notNull()
      .references(() => clientProjects.id, { onDelete: "cascade" }),
    invoiceId: uuid("invoice_id").references(() => projectInvoices.id, {
      onDelete: "set null",
    }),
    paidAt: timestamp("paid_at", { withTimezone: true }).notNull(),
    amount: integer("amount").notNull(),
    method: text("method")
      .$type<"transfer" | "tunai" | "qris">()
      .notNull(),
    note: text("note").notNull().default(""),
    proofFileId: uuid("proof_file_id").references(() => privateFiles.id, {
      onDelete: "set null",
    }),
    isVisibleToClient: boolean("is_visible_to_client").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("payments_amount_check", sql`${table.amount} > 0`),
    check(
      "payments_method_check",
      sql`${table.method} IN ('transfer', 'tunai', 'qris')`,
    ),
    index("payments_project_idx").on(table.clientProjectId, table.paidAt),
    index("payments_invoice_idx").on(table.invoiceId, table.paidAt),
  ],
);

export const projectUpdates = pgTable(
  "project_updates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientProjectId: uuid("client_project_id")
      .notNull()
      .references(() => clientProjects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: jsonb("body").$type<RichText>().notNull(),
    isVisibleToClient: boolean("is_visible_to_client").notNull().default(true),
    createdById: text("created_by_id").references(() => adminProfiles.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("project_updates_project_idx").on(
      table.clientProjectId,
      table.createdAt,
    ),
  ],
);

export const projectDocuments = pgTable(
  "project_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientProjectId: uuid("client_project_id")
      .notNull()
      .references(() => clientProjects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    type: text("type").$type<"url" | "file">().notNull(),
    url: text("url"),
    fileId: uuid("file_id").references(() => privateFiles.id, {
      onDelete: "restrict",
    }),
    isVisibleToClient: boolean("is_visible_to_client").notNull().default(true),
    sortOrder: smallint("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "project_documents_type_check",
      sql`${table.type} IN ('url', 'file') AND ((${table.type} = 'url' AND ${table.url} IS NOT NULL AND ${table.fileId} IS NULL) OR (${table.type} = 'file' AND ${table.fileId} IS NOT NULL AND ${table.url} IS NULL))`,
    ),
    check(
      "project_documents_url_check",
      sql`${table.url} IS NULL OR ${table.url} ~ '^https://'`,
    ),
    index("project_documents_project_idx").on(
      table.clientProjectId,
      table.sortOrder,
    ),
  ],
);

export const revisionRequests = pgTable(
  "revision_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientProjectId: uuid("client_project_id")
      .notNull()
      .references(() => clientProjects.id, { onDelete: "cascade" }),
    roundNumber: integer("round_number").notNull(),
    type: text("type")
      .$type<"revision" | "change_request" | "bug">()
      .notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    attachments: jsonb("attachments")
      .$type<{ fileId: string; filename: string }[]>()
      .notNull()
      .default([]),
    status: text("status")
      .$type<
        | "submitted"
        | "accepted"
        | "in_progress"
        | "done"
        | "rejected"
        | "needs_payment"
      >()
      .notNull()
      .default("submitted"),
    countsTowardQuota: boolean("counts_toward_quota").notNull().default(false),
    isExtra: boolean("is_extra").notNull().default(false),
    quotedPrice: integer("quoted_price"),
    clientAcceptedQuoteAt: timestamp("client_accepted_quote_at", {
      withTimezone: true,
    }),
    adminResponse: text("admin_response"),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("revision_requests_round_unique").on(
      table.clientProjectId,
      table.roundNumber,
    ),
    check("revision_requests_round_check", sql`${table.roundNumber} > 0`),
    check(
      "revision_requests_type_check",
      sql`${table.type} IN ('revision', 'change_request', 'bug')`,
    ),
    check(
      "revision_requests_status_check",
      sql`${table.status} IN ('submitted', 'accepted', 'in_progress', 'done', 'rejected', 'needs_payment')`,
    ),
    check(
      "revision_requests_quote_check",
      sql`${table.quotedPrice} IS NULL OR ${table.quotedPrice} >= 0`,
    ),
    check(
      "revision_requests_attachments_check",
      sql`jsonb_typeof(${table.attachments}) = 'array' AND jsonb_array_length(${table.attachments}) <= 5`,
    ),
    index("revision_requests_status_idx").on(
      table.clientProjectId,
      table.status,
    ),
  ],
);

export const projectComments = pgTable(
  "project_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientProjectId: uuid("client_project_id")
      .notNull()
      .references(() => clientProjects.id, { onDelete: "cascade" }),
    revisionRequestId: uuid("revision_request_id").references(
      () => revisionRequests.id,
      { onDelete: "cascade" },
    ),
    authorType: text("author_type").$type<"client" | "admin">().notNull(),
    authorName: text("author_name").notNull(),
    /** Plain text on purpose: rendered escaped, never as HTML. */
    body: text("body").notNull(),
    attachments: jsonb("attachments")
      .$type<{ fileId: string; filename: string }[]>()
      .notNull()
      .default([]),
    isInternal: boolean("is_internal").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "project_comments_author_check",
      sql`${table.authorType} IN ('client', 'admin')`,
    ),
    // Only admins may write internal notes.
    check(
      "project_comments_internal_check",
      sql`NOT ${table.isInternal} OR ${table.authorType} = 'admin'`,
    ),
    index("project_comments_project_idx").on(
      table.clientProjectId,
      table.createdAt,
    ),
  ],
);

/** Append-only approval evidence: no update/delete grant for any role. */
export const projectApprovals = pgTable(
  "project_approvals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientProjectId: uuid("client_project_id")
      .notNull()
      .references(() => clientProjects.id, { onDelete: "restrict" }),
    type: text("type").$type<"step_review" | "final_handover">().notNull(),
    approvedByName: text("approved_by_name").notNull(),
    note: text("note").notNull().default(""),
    ipHash: text("ip_hash").notNull(),
    userAgent: text("user_agent").notNull().default(""),
    approvedAt: timestamp("approved_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "project_approvals_type_check",
      sql`${table.type} IN ('step_review', 'final_handover')`,
    ),
    index("project_approvals_project_idx").on(
      table.clientProjectId,
      table.approvedAt,
    ),
  ],
);

export type ClientProjectRow = typeof clientProjects.$inferSelect;
export type RevisionRequestRow = typeof revisionRequests.$inferSelect;
