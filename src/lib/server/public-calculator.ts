import "server-only";
import { getDb } from "@/db";
import { createCalculatorAdminStore } from "@/db/calculator-store";
import { getPublicSiteSettings } from "@/lib/server/public-site";
import { readPublicCalculatorConfig } from "@/services/calculator-admin";

/** Public, validated calculator configuration with its public price floor. */
export async function getPublicCalculatorConfig() {
  const [calculator, settings] = await Promise.all([
    readPublicCalculatorConfig(createCalculatorAdminStore(getDb())),
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
}
