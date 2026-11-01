import type { PageBlock } from "@/schemas/blocks";

export const pageBlockLabels: Record<PageBlock["type"], string> = {
  hero: "Hero", servicesGrid: "Layanan", portfolioShowcase: "Portofolio",
  calculator: "Kalkulator", pricing: "Paket", testimonials: "Testimoni",
  faq: "FAQ", about: "Tentang", ctaBanner: "Banner CTA", richText: "Teks",
};

export function createPageBlock(type: PageBlock["type"], id: string): PageBlock {
  const base = { id, isVisible: true };
  switch (type) {
    case "hero": return { ...base, type, headline: "Judul halaman", subheadline: "", primaryCtaLabel: "Konsultasi", secondaryCtaLabel: "Lihat paket", heroImageId: null, trustMetrics: [] };
    case "servicesGrid": return { ...base, type, title: "Layanan", description: "" };
    case "portfolioShowcase": return { ...base, type, title: "Proyek pilihan", limit: 6, featuredOnly: true };
    case "calculator": return { ...base, type, title: "Estimasi biaya", disclaimer: "" };
    case "pricing": return { ...base, type, title: "Paket layanan", showAddons: true };
    case "testimonials": return { ...base, type, title: "Testimoni", limit: 6 };
    case "faq": return { ...base, type, title: "Pertanyaan umum", limit: 10 };
    case "about": return { ...base, type, title: "Tentang", body: { version: 1, blocks: [] }, imageId: null };
    case "ctaBanner": return { ...base, type, title: "Diskusikan kebutuhan Anda", text: "", primaryCtaLabel: "Konsultasi", secondaryCtaLabel: "Lihat paket" };
    case "richText": return { ...base, type, body: { version: 1, blocks: [] } };
  }
}

export function moveBlock<T>(items: readonly T[], from: number, to: number): T[] {
  const next = [...items];
  if (from < 0 || to < 0 || from >= next.length || to >= next.length) return next;
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
