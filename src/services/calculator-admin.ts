import "server-only";
import { authorize, type AdminPrincipal } from "@/access/rules";
import {
  calculatorAdminConfigSchema,
  type CalculatorAdminConfig,
} from "@/schemas/calculator-admin";

export interface CalculatorAdminStore {
  read(): Promise<unknown>;
  transaction<T>(callback: (tx: {
    lockConfiguration(): Promise<void>;
    replace(config: CalculatorAdminConfig): Promise<void>;
    audit(actorId: string): Promise<void>;
  }) => Promise<T>): Promise<T>;
}

export async function listCalculatorConfig(
  store: CalculatorAdminStore,
  principal: AdminPrincipal | null,
): Promise<CalculatorAdminConfig> {
  authorize(principal, "calculator-groups", "read");
  authorize(principal, "calculator-items", "read");
  return calculatorAdminConfigSchema.parse(await store.read());
}

/** Replaces the calculator's groups, items, and rules as one validated transaction. */
export async function saveCalculatorConfig(
  store: CalculatorAdminStore,
  principal: AdminPrincipal | null,
  input: unknown,
  invalidateCache: () => void | Promise<void>,
): Promise<void> {
  authorize(principal, "calculator-groups", "update");
  authorize(principal, "calculator-items", "update");
  const config = calculatorAdminConfigSchema.parse(input);
  await store.transaction(async (tx) => {
    // Quote creation locks the same Settings singleton before it reads prices.
    await tx.lockConfiguration();
    await tx.replace(config);
    await tx.audit(principal.id);
  });
  try {
    await invalidateCache();
  } catch {
    throw new Error("Kalkulator sudah disimpan, tetapi cache belum berhasil diperbarui.");
  }
}

/** Read-only public DTO consumed by the quote calculator; disabled rows are omitted. */
export async function readPublicCalculatorConfig(
  store: CalculatorAdminStore,
): Promise<{
  groups: Array<{
    id: string;
    key: string;
    selectionType: "single" | "multiple";
    isRequired: boolean;
  }>;
  items: Array<{
    id: string;
    groupId: string;
    label: string;
    priceMin: number;
    priceMax?: number;
    daysMin: number;
    daysMax?: number;
    pricingType: "flat" | "per_unit";
    maxUnits?: number;
    isActive: boolean;
    isDefault: boolean;
    requires: string[];
    excludes: string[];
  }>;
}> {
  const config = calculatorAdminConfigSchema.parse(await store.read());
  const groups = config.groups.filter((group) => group.isActive);
  const activeGroupIds = new Set(groups.map((group) => group.id));
  const items = config.items.filter((item) => item.isActive && activeGroupIds.has(item.groupId));
  const itemIds = new Set(items.map((item) => item.id));
  const requiredGroupWithoutItems = groups.some(
    (group) => group.isRequired && !items.some((item) => item.groupId === group.id),
  );
  if (requiredGroupWithoutItems)
    throw new Error("Grup kalkulator wajib harus memiliki item aktif.");
  return {
    groups: groups.map(({ id, key, selectionType, isRequired }) => ({
      id,
      key,
      selectionType,
      isRequired,
    })),
    items: items.map((item) => ({
      id: item.id,
      groupId: item.groupId,
      label: item.label,
      priceMin: item.priceMin,
      ...(item.priceMax === null ? {} : { priceMax: item.priceMax }),
      daysMin: item.daysMin,
      ...(item.daysMax === null ? {} : { daysMax: item.daysMax }),
      pricingType: item.pricingType,
      ...(item.maxUnits === null ? {} : { maxUnits: item.maxUnits }),
      isActive: true,
      isDefault: item.isDefault,
      requires: item.rules.filter((rule) => rule.ruleType === "requires" && itemIds.has(rule.relatedItemId)).map((rule) => rule.relatedItemId),
      excludes: item.rules.filter((rule) => rule.ruleType === "excludes" && itemIds.has(rule.relatedItemId)).map((rule) => rule.relatedItemId),
    })),
  };
}
