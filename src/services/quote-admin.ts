import "server-only";
import { z } from "zod";
import { authorize, type AdminPrincipal } from "@/access/rules";
import type { QuoteSelectionSnapshot } from "@/schemas/quote-request";

const status = z.enum(["new", "contacted", "converted", "dropped"]);
const listOptions = z
  .object({
    status: status.optional(),
    limit: z.number().int().min(1).max(100),
    offset: z.number().int().min(0).max(1_000_000),
  })
  .strict();
const quoteDtoSchema = z.object({
  id: z.uuid(),
  reference: z.string().max(32),
  selection: z
    .array(
      z
        .object({
          itemId: z.uuid(),
          label: z.string().max(250),
          units: z.number().int().min(1).max(1000),
        })
        .strict(),
    )
    .max(200),
  priceMin: z.number().int().min(0),
  priceMax: z.number().int().min(0),
  daysMin: z.number().int().min(0),
  daysMax: z.number().int().min(0),
  contactName: z.string().max(100).nullable(),
  contactWhatsapp: z.string().max(100).nullable(),
  status,
  createdAt: z.date(),
});
export interface QuoteAdminDto {
  id: string;
  reference: string;
  selection: QuoteSelectionSnapshot[];
  priceMin: number;
  priceMax: number;
  daysMin: number;
  daysMax: number;
  contactName: string | null;
  contactWhatsapp: string | null;
  status: z.output<typeof status>;
  createdAt: Date;
}
export interface QuoteAdminStore {
  list(options: z.output<typeof listOptions>): Promise<QuoteAdminDto[]>;
  transaction<T>(
    callback: (tx: {
      changeStatus(
        id: string,
        value: z.output<typeof status>,
      ): Promise<boolean>;
      audit(actorId: string, id: string): Promise<void>;
    }) => Promise<T>,
  ): Promise<T>;
}

export async function listAdminQuotes(
  store: QuoteAdminStore,
  principal: AdminPrincipal | null,
  input: unknown,
): Promise<QuoteAdminDto[]> {
  authorize(principal, "quote-requests", "read");
  return z
    .array(quoteDtoSchema)
    .parse(await store.list(listOptions.parse(input)));
}

export async function updateQuoteStatus(
  store: QuoteAdminStore,
  principal: AdminPrincipal | null,
  id: string,
  input: unknown,
): Promise<void> {
  authorize(principal, "quote-requests", "update");
  z.uuid().parse(id);
  const value = status.parse(input);
  await store.transaction(async (tx) => {
    if (!(await tx.changeStatus(id, value)))
      throw new Error("Quote tidak ditemukan.");
    await tx.audit(principal.id, id);
  });
}
