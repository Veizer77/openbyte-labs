import "server-only";
import { z } from "zod";
import { createReference } from "@/lib/reference";
import {
  normalizeWhatsapp,
  renderWhatsappTemplate,
  validateWhatsappTemplate,
  whatsappUrl,
  WHATSAPP_TEMPLATE_FIELDS,
} from "@/lib/whatsapp";
import { inquiryRequestSchema } from "@/schemas/inquiry-request";

const packageSchema = z
  .object({
    id: z.uuid(),
    name: z.string().trim().min(1).max(250),
    price: z.number().int().min(0).max(2_147_483_647),
    discountPrice: z.number().int().min(0).nullable(),
    discountEndsAt: z.date().nullable(),
    billingType: z.enum(["one_time", "subscription_yearly", "custom"]),
    isActive: z.boolean(),
    categoryActive: z.boolean(),
    deletedAt: z.date().nullable(),
  })
  .strict()
  .refine(
    (value) =>
      (value.discountPrice === null) === (value.discountEndsAt === null) &&
      (value.discountPrice === null || value.discountPrice <= value.price),
  );
type Package = z.output<typeof packageSchema>;
export interface InquiryRecord {
  reference: string;
  source: "contact" | "package";
  servicePackageId: string | null;
  packageName: string | null;
  packagePrice: number | null;
  packageBillingType: Package["billingType"] | null;
  name: string;
  whatsapp: string;
  email: string | null;
  organizationOrBusiness: string;
  message: string;
  ipHash: string;
  consentAt: Date;
}
export interface InquiryTransaction {
  readPackageForUpdate(id: string): Promise<Package | null>;
  readWhatsappConfig(): Promise<{ number: string; template: string }>;
  tryInsert(record: InquiryRecord): Promise<string | null>;
  insertAudit(inquiryId: string): Promise<void>;
}
export interface InquiryStore {
  transaction<T>(callback: (tx: InquiryTransaction) => Promise<T>): Promise<T>;
}
export class InquirySubmissionError extends Error {
  constructor(
    public readonly code:
      | "anti_spam"
      | "rate_limit"
      | "package_unavailable"
      | "reference_exhausted",
  ) {
    super(
      {
        anti_spam: "Verifikasi anti-spam gagal.",
        rate_limit: "Terlalu banyak pengiriman. Coba lagi nanti.",
        package_unavailable: "Paket tidak tersedia.",
        reference_exhausted: "Nomor referensi belum dapat dibuat. Coba lagi.",
      }[code],
    );
    this.name = "InquirySubmissionError";
  }
}

/** Calculator-linked inquiries require a separate server-trusted flow, not an arbitrary client quote ID. */
export async function createInquiry(
  input: unknown,
  ipHash: string,
  deps: {
    store: InquiryStore;
    verifyChallenge: (token: string, honeypot: string) => Promise<boolean>;
    consumeBudget: (ipHash: string) => Promise<boolean>;
    now?: () => Date;
    reference?: (now: Date) => string;
  },
): Promise<{ reference: string; whatsappUrl: string | null }> {
  const request = inquiryRequestSchema.parse(input);
  if (!/^[a-f0-9]{64}$/.test(ipHash)) throw new Error("Hash IP tidak valid.");
  if (
    request.honeypot !== "" ||
    !(await deps.verifyChallenge(request.turnstileToken, request.honeypot))
  )
    throw new InquirySubmissionError("anti_spam");
  if (!(await deps.consumeBudget(ipHash)))
    throw new InquirySubmissionError("rate_limit");
  return deps.store.transaction(async (tx) => {
    let selected: Package | null = null;
    let config: { number: string; template: string } | null = null;
    if (request.source === "package") {
      const candidate = await tx.readPackageForUpdate(request.servicePackageId);
      if (!candidate) throw new InquirySubmissionError("package_unavailable");
      selected = packageSchema.parse(candidate);
      if (!selected.isActive || !selected.categoryActive || selected.deletedAt)
        throw new InquirySubmissionError("package_unavailable");
      config = await tx.readWhatsappConfig();
      if (
        !normalizeWhatsapp(config.number) ||
        !validateWhatsappTemplate(
          config.template,
          WHATSAPP_TEMPLATE_FIELDS.tplPackageOrder,
        )
      ) {
        throw new Error("Pengaturan WhatsApp tidak valid.");
      }
    }
    const now = (deps.now ?? (() => new Date()))();
    if (!Number.isFinite(now.getTime()))
      throw new Error("Jam server tidak valid.");
    const effectivePrice =
      selected &&
      selected.discountPrice !== null &&
      selected.discountEndsAt! > now
        ? selected.discountPrice
        : (selected?.price ?? null);
    for (let attempt = 0; attempt < 5; attempt++) {
      const reference = deps.reference
        ? deps.reference(now)
        : createReference("INQ", now);
      if (!/^INQ-\d{4}-[A-HJ-NP-Z2-9]{4}$/.test(reference))
        throw new Error("Nomor referensi tidak valid.");
      const link =
        selected && config
          ? whatsappUrl(
              renderWhatsappTemplate(config.template, {
                nama: request.name,
                referensi: reference,
                platform: selected.name,
                rincian: request.message,
              }),
              config.number,
            )
          : null;
      const inquiryId = await tx.tryInsert({
        reference,
        source: request.source,
        servicePackageId: request.servicePackageId,
        packageName: selected?.name ?? null,
        packagePrice: effectivePrice,
        packageBillingType: selected?.billingType ?? null,
        name: request.name,
        whatsapp: request.whatsapp,
        email: request.email,
        organizationOrBusiness: request.organizationOrBusiness,
        message: request.message,
        ipHash,
        consentAt: now,
      });
      if (!inquiryId) continue;
      await tx.insertAudit(inquiryId);
      return { reference, whatsappUrl: link };
    }
    throw new InquirySubmissionError("reference_exhausted");
  });
}
