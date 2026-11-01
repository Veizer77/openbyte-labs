import "server-only";
import { z } from "zod";
import {
  calculate,
  type CalculatorGroup,
  type CalculatorItem,
  type Calculation,
} from "@/lib/calculator";
import { rupiah } from "@/lib/format";
import { createReference } from "@/lib/reference";
import {
  normalizeWhatsapp,
  renderWhatsappTemplate,
  validateWhatsappTemplate,
  whatsappUrl,
  WHATSAPP_TEMPLATE_FIELDS,
} from "@/lib/whatsapp";
import { calculatorConfigSchema } from "@/schemas/calculator-config";
import {
  quoteRequestSchema,
  type QuoteSelectionSnapshot,
} from "@/schemas/quote-request";

type QuoteCalculation = Extract<Calculation, { ok: true }>;
export interface QuoteConfiguration {
  groups: Array<CalculatorGroup & { key: string }>;
  items: CalculatorItem[];
  minimumPrice: number;
  showRange: boolean;
  whatsappNumber: string;
  template: string;
}
export interface QuoteRecord {
  reference: string;
  selection: QuoteSelectionSnapshot[];
  priceMin: number;
  priceMax: number;
  daysMin: number;
  daysMax: number;
  contactName: string | null;
  contactWhatsapp: string | null;
  ipHash: string;
  consentAt: Date;
}
export interface QuoteTransaction {
  /** Must lock settings before reading configuration; calculator writers must use the same lock. */
  readConfiguration(): Promise<QuoteConfiguration>;
  tryInsert(record: QuoteRecord): Promise<string | null>;
  insertAudit(quoteId: string): Promise<void>;
}
export interface QuoteStore {
  transaction<T>(callback: (tx: QuoteTransaction) => Promise<T>): Promise<T>;
}
export class QuoteSubmissionError extends Error {
  constructor(
    public readonly code:
      | "anti_spam"
      | "rate_limit"
      | "selection_invalid"
      | "range_exceeded"
      | "reference_exhausted",
  ) {
    super(
      {
        anti_spam: "Verifikasi anti-spam gagal.",
        rate_limit: "Terlalu banyak pengiriman. Coba lagi nanti.",
        selection_invalid: "Pilihan kalkulator tidak valid atau sudah berubah.",
        range_exceeded: "Hasil estimasi melampaui batas yang didukung.",
        reference_exhausted: "Nomor referensi belum dapat dibuat. Coba lagi.",
      }[code],
    );
    this.name = "QuoteSubmissionError";
  }
}

export async function createQuote(
  input: unknown,
  ipHash: string,
  deps: {
    store: QuoteStore;
    verifyChallenge: (token: string, honeypot: string) => Promise<boolean>;
    consumeBudget: (ipHash: string) => Promise<boolean>;
    now?: () => Date;
    reference?: (now: Date) => string;
  },
): Promise<{
  reference: string;
  calculation: QuoteCalculation;
  whatsappUrl: string;
}> {
  const request = quoteRequestSchema.parse(input);
  if (!/^[a-f0-9]{64}$/.test(ipHash)) throw new Error("Hash IP tidak valid.");
  if (
    request.honeypot !== "" ||
    !(await deps.verifyChallenge(request.turnstileToken, request.honeypot))
  )
    throw new QuoteSubmissionError("anti_spam");
  if (!(await deps.consumeBudget(ipHash)))
    throw new QuoteSubmissionError("rate_limit");
  return deps.store.transaction(async (tx) => {
    const config = await tx.readConfiguration();
    const engine = calculatorConfigSchema.parse({
      groups: config.groups.map(({ id, selectionType, isRequired }) => ({
        id,
        selectionType,
        isRequired,
      })),
      items: config.items,
      minimumPrice: config.minimumPrice,
    });
    if (
      !z.boolean().safeParse(config.showRange).success ||
      !normalizeWhatsapp(config.whatsappNumber) ||
      !validateWhatsappTemplate(
        config.template,
        WHATSAPP_TEMPLATE_FIELDS.tplCalculator,
      )
    )
      throw new Error("Pengaturan kalkulator atau WhatsApp tidak valid.");
    const calculation = calculate(
      request.selection,
      engine.groups,
      engine.items,
      engine.minimumPrice,
    );
    if (!calculation.ok) throw new QuoteSubmissionError("selection_invalid");
    if (
      [
        calculation.priceMin,
        calculation.priceMax,
        calculation.daysMin,
        calculation.daysMax,
      ].some((value) => !Number.isSafeInteger(value) || value > 2_147_483_647)
    )
      throw new QuoteSubmissionError("range_exceeded");
    const itemsById = new Map(engine.items.map((item) => [item.id, item]));
    const snapshot = request.selection.map((selection) => {
      const item = itemsById.get(selection.itemId)!;
      return {
        itemId: item.id,
        label: item.label,
        units: item.pricingType === "per_unit" ? selection.units! : 1,
      };
    });
    const platformIds = new Set(
      config.groups
        .filter((group) => group.key === "platform")
        .map((group) => group.id),
    );
    const platform = snapshot
      .filter((selected) =>
        platformIds.has(itemsById.get(selected.itemId)!.groupId),
      )
      .map((selected) => selected.label)
      .join(", ");
    const detail = snapshot
      .map((selected) =>
        selected.units > 1
          ? `${selected.label} (${selected.units})`
          : selected.label,
      )
      .join("\n");
    const price =
      config.showRange && calculation.priceMax !== calculation.priceMin
        ? `${rupiah(calculation.priceMin)} - ${rupiah(calculation.priceMax)}`
        : rupiah(calculation.priceMin);
    const duration =
      calculation.daysMax !== calculation.daysMin
        ? `${calculation.daysMin} - ${calculation.daysMax} hari kerja`
        : `${calculation.daysMin} hari kerja`;
    const now = (deps.now ?? (() => new Date()))();
    if (!Number.isFinite(now.getTime()))
      throw new Error("Jam server tidak valid.");
    for (let attempt = 0; attempt < 5; attempt++) {
      const reference = deps.reference
        ? deps.reference(now)
        : createReference("QTE", now);
      if (!/^QTE-\d{4}-[A-HJ-NP-Z2-9]{4}$/.test(reference))
        throw new Error("Nomor referensi tidak valid.");
      const message = renderWhatsappTemplate(config.template, {
        nama: request.contactName ?? "",
        referensi: reference,
        platform,
        rincian: detail,
        estimasi_harga: price,
        estimasi_durasi: duration,
      });
      const url = whatsappUrl(message, config.whatsappNumber);
      const quoteId = await tx.tryInsert({
        reference,
        selection: snapshot,
        priceMin: calculation.priceMin,
        priceMax: calculation.priceMax,
        daysMin: calculation.daysMin,
        daysMax: calculation.daysMax,
        contactName: request.contactName,
        contactWhatsapp: request.contactWhatsapp,
        ipHash,
        consentAt: now,
      });
      if (!quoteId) continue;
      await tx.insertAudit(quoteId);
      return { reference, calculation, whatsappUrl: url };
    }
    throw new QuoteSubmissionError("reference_exhausted");
  });
}
