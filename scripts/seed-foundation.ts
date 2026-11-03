import { stdout } from "node:process";
import { createDatabase } from "@/db/connection";
import { initializeAvailabilityRules } from "@/seed/availability-store";
import { initializeCalculator } from "@/seed/calculator-store";
import { initializeFaqs } from "@/seed/faq-store";
import { initializePackages } from "@/seed/package-store";
import { initializePages } from "@/seed/page-store";
import { initializeSiteSettings } from "@/seed/site-settings-store";
import { confirmTarget } from "./lib/confirm-target";
import { loadLocalEnv } from "./lib/load-local-env";

loadLocalEnv();

async function main(): Promise<void> {
  const target = await confirmTarget("seed", {
    label: "Seed",
    keyword: "SEED",
  });
  const connection = createDatabase(target.uri);
  try {
    const settings = await initializeSiteSettings(connection.db);
    const schedule = await initializeAvailabilityRules(connection.db);
    const faqs = await initializeFaqs(connection.db);
    const calculator = await initializeCalculator(connection.db);
    const packages = await initializePackages(connection.db);
    const pages = await initializePages(connection.db);
    stdout.write(
      `Settings: ${settings ? "dibuat" : "sudah ada"}. Jadwal: ${schedule.status}. FAQ: ${faqs.status}. Kalkulator: ${calculator.status}. Paket: ${packages.status}. Halaman: ${pages.status}.\n`,
    );
    stdout.write(
      "Seed ini hanya mencakup enam modul; konten dan modul lain belum diisi.\n",
    );
  } finally {
    await connection.close();
  }
}

main().catch(() => {
  process.stderr.write(
    "Seed gagal atau dibatalkan. Periksa target dan konfigurasi tanpa membagikan kredensial.\n",
  );
  process.exitCode = 1;
});
