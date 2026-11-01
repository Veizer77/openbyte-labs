import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";

const status = z.enum(["new", "contacted", "converted", "dropped"]);
const source = z.enum(["package", "calculator", "contact"]);
const optionsSchema = z
  .object({
    status: status.optional(),
    source: source.optional(),
    search: z.string().trim().max(100).optional(),
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
  })
  .strict();
const inquiryDtoSchema = z.object({
  id: z.uuid(),
  reference: z.string().max(32),
  servicePackageId: z.uuid().nullable(),
  quoteRequestId: z.uuid().nullable(),
  packageName: z.string().nullable(),
  packagePrice: z.number().int().min(0).nullable(),
  packageBillingType: z.string().nullable(),
  name: z.string().max(100),
  whatsapp: z.string().max(100),
  email: z.string().nullable(),
  organizationOrBusiness: z.string().max(250),
  message: z.string().max(4000),
  source,
  status,
  adminNotes: z.string().max(5000),
  consentAt: z.date(),
  createdAt: z.date(),
});
const updateSchema = z
  .object({ status, adminNotes: z.string().trim().max(5000) })
  .strict();
export type InquiryAdminDto = z.output<typeof inquiryDtoSchema>;
export interface InquiryAdminStore {
  list(options: z.output<typeof optionsSchema>): Promise<unknown[]>;
  get(id: string): Promise<unknown | null>;
  transaction<T>(
    callback: (tx: {
      update(
        id: string,
        value: z.output<typeof updateSchema>,
      ): Promise<boolean>;
      audit(actorId: string, id: string): Promise<void>;
    }) => Promise<T>,
  ): Promise<T>;
}

export async function listAdminInquiries(
  store: InquiryAdminStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<InquiryAdminDto[]> {
  authorize(principal, "inquiries", "read");
  return z
    .array(inquiryDtoSchema)
    .parse(await store.list(optionsSchema.parse(input)));
}
export async function getAdminInquiry(
  store: InquiryAdminStore,
  principal: AdminPrincipal | null,
  id: string,
): Promise<InquiryAdminDto | null> {
  authorize(principal, "inquiries", "read");
  z.uuid().parse(id);
  return inquiryDtoSchema.nullable().parse(await store.get(id));
}
export async function updateAdminInquiry(
  store: InquiryAdminStore,
  principal: AdminPrincipal | null,
  id: string,
  input: unknown,
): Promise<void> {
  authorize(principal, "inquiries", "update");
  z.uuid().parse(id);
  const value = updateSchema.parse(input);
  await store.transaction(async (tx) => {
    if (!(await tx.update(id, value)))
      throw new Error("Inquiry tidak ditemukan.");
    await tx.audit(principal.id, id);
  });
}
