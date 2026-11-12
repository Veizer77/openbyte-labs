import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getDb } from "@/db";
import { createCalculatorAdminStore } from "@/db/calculator-store";
import { getPublicSiteSettings } from "@/lib/server/public-site";
import { readPublicCalculatorConfig } from "@/services/calculator-admin";

const cachedCalculatorItems = unstable_cache(
  async () => readPublicCalculatorConfig(createCalculatorAdminStore(getDb())),
  ["public-calculator-config"],
  { tags: ["calculator"], revalidate: 300 },
);

async function loadCalculatorItems() {
  try {
    return await cachedCalculatorItems();
  } catch (error) {
    if (error instanceof Error && /incrementalCache/i.test(error.message)) {
      return readPublicCalculatorConfig(createCalculatorAdminStore(getDb()));
    }
    throw error;
  }
}

/** Public, validated calculator configuration with its public price floor. */
export const getPublicCalculatorConfig = cache(async function getPublicCalculatorConfig() {
  const [calculator, settings] = await Promise.all([
    loadCalculatorItems(),
    getPublicSiteSettings(),
  ]);

  return {
    ...calculator,
    minimumPrice: settings.calculator.minimumPrice,
    showRange: settings.calculator.showRange,
    disclaimer: settings.calculator.disclaimer,
    consentText: settings.legal.consentText,
    settings,
  };
});
