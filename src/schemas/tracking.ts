import { z } from "zod";
import { normalizeWhatsapp } from "@/lib/whatsapp";

const id = z.uuid();
const money = z.number().int().min(0).max(2_147_483_647);
const text = z.string().trim().min(1).max(200);
const body = z.string().trim().min(1).max(10_000);
export const trackingUrl = z
  .string()
  .max(2048)
  .refine((value) => {
    try {
      const u = new URL(value);
      return (
        u.protocol === "https:" &&
        !u.username &&
        !u.password &&
        !/[\\\u0000-\u001f\u007f]/.test(value)
      );
    } catch {
      return false;
    }
  }, "Tautan harus HTTPS tanpa kredensial.");
const optionalUrl = z
  .union([z.literal(""), trackingUrl])
  .transform((v) => v || null);
const date = z.union([z.literal(""), z.iso.date()]).transform((v) => v || null);
const fileIds = z
  .array(id)
  .max(5)
  .refine((v) => new Set(v).size === v.length, "Lampiran duplikat.")
  .default([]);
export const visibilitySchema = z
  .object({
    staging: z.boolean(),
    production: z.boolean(),
    github: z.boolean(),
    payments: z.boolean(),
    documents: z.boolean(),
    timeline: z.boolean(),
  })
  .strict();
export const trackingLoginSchema = z
  .object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^PRJ-[A-HJ-NP-Z2-9]{8}$/, "Format kode tracking tidak valid."),
    pin: z.string().regex(/^\d{6}$/, "PIN harus 6 digit."),
  })
  .strict();
export const clientProjectInput = z
  .object({
    clientName: text,
    clientWhatsapp: z.string().transform((v, ctx) => {
      const n = normalizeWhatsapp(v);
      if (!n) {
        ctx.addIssue({ code: "custom", message: "WhatsApp tidak valid." });
        return z.NEVER;
      }
      return n;
    }),
    clientEmail: z
      .union([z.literal(""), z.email()])
      .transform((v) => v || null),
    projectTitle: text,
    totalCost: money,
    revisionsIncluded: z.number().int().min(0).max(32767),
    extraRevisionPrice: money.nullable(),
    categoryId: id.nullable(),
    servicePackageId: id.nullable(),
    stagingUrl: optionalUrl,
    productionUrl: optionalUrl,
    githubUrl: optionalUrl,
    startDate: date,
    targetCompletionDate: date,
    internalNotes: z.string().max(20_000),
    clientVisibility: visibilitySchema,
  })
  .strict()
  .refine(
    (v) =>
      !v.startDate ||
      !v.targetCompletionDate ||
      v.targetCompletionDate >= v.startDate,
    "Target selesai tidak boleh sebelum mulai.",
  );
export const clientMutationSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("comment"),
      body,
      revisionRequestId: id.nullable(),
      fileIds,
    })
    .strict(),
  z
    .object({
      kind: z.literal("revision"),
      type: z.enum(["revision", "change_request", "bug"]),
      title: text,
      description: body,
      fileIds,
    })
    .strict(),
  z
    .object({ kind: z.literal("quote"), revisionId: id, accept: z.boolean() })
    .strict(),
  z
    .object({
      kind: z.literal("approve"),
      type: z.enum(["step_review", "final_handover"]),
      name: text,
      pin: z.string().regex(/^\d{6}$/),
      note: z.string().max(2000),
    })
    .strict(),
]);
export const adminMutationSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("update"), value: clientProjectInput }).strict(),
  z.object({ kind: z.literal("pin") }).strict(),
  z.object({ kind: z.literal("archive"), archived: z.boolean() }).strict(),
  z.object({ kind: z.literal("review"), open: z.boolean() }).strict(),
  z
    .object({
      kind: z.literal("step"),
      stepNumber: z.number().int().min(1).max(6),
      title: text,
      description: z.string().max(2000),
      status: z.enum(["pending", "in_progress", "done"]),
      milestones: z
        .array(z.object({ title: text, isCompleted: z.boolean() }).strict())
        .max(50),
    })
    .strict(),
  z
    .object({
      kind: z.literal("payment"),
      id: id.nullable(),
      amount: money.positive(),
      paidAt: z.iso.datetime({ offset: true }),
      method: z.enum(["transfer", "tunai", "qris"]),
      note: z.string().max(2000),
      isVisibleToClient: z.boolean(),
      proofFileId: id.nullable(),
      invoiceId: id.nullable().optional(),
    })
    .strict(),
  z.object({ kind: z.literal("deletePayment"), id }).strict(),
  z
    .object({
      kind: z.literal("updatePost"),
      title: text,
      body,
      isVisibleToClient: z.boolean(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("document"),
      title: text,
      url: trackingUrl.nullable(),
      fileId: id.nullable(),
      isVisibleToClient: z.boolean(),
    })
    .strict()
    .refine(
      (v) => Boolean(v.url) !== Boolean(v.fileId),
      "Pilih tautan atau berkas, bukan keduanya.",
    ),
  z.object({ kind: z.literal("deleteDocument"), id }).strict(),
  z
    .object({
      kind: z.literal("revision"),
      id,
      event: z.enum(["ACCEPT", "REJECT", "SET_QUOTE", "START", "DONE"]),
      quotedPrice: money.optional(),
      adminResponse: z.string().max(2000).optional(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("comment"),
      body,
      revisionRequestId: id.nullable(),
      isInternal: z.boolean(),
      fileIds,
    })
    .strict(),
]);
export const uploadInputSchema = z
  .object({
    filename: z
      .string()
      .trim()
      .min(1)
      .max(150)
      .regex(/^[^/\\\u0000-\u001f\u007f]+$/),
    mimeType: z.enum([
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/zip",
    ]),
    sizeBytes: z
      .number()
      .int()
      .positive()
      .max(5 * 1024 * 1024),
  })
  .strict();
export type ClientProjectInput = z.input<typeof clientProjectInput>;
export type ClientMutation = z.output<typeof clientMutationSchema>;
export type AdminMutation = z.output<typeof adminMutationSchema>;
export type UploadInput = z.output<typeof uploadInputSchema>;
