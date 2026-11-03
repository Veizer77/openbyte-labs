import { describe, expect, it } from "vitest";
import {
  findServiceBySlug,
  normalizeServiceSlug,
  serviceSlug,
} from "@/lib/service-slug";

const services = [
  { title: "Sistem Informasi & Satu Data" },
  { title: "Aplikasi Mobile Lintas Platform" },
  { title: "Website & Web App Bisnis" },
  { title: "Sistem Kustom & Event Interaktif" },
];

describe("slug layanan publik", () => {
  it("menurunkan slug yang stabil dari judul layanan", () => {
    expect(services.map((service) => serviceSlug(service.title))).toEqual([
      "sistem-informasi-dan-satu-data",
      "aplikasi-mobile-lintas-platform",
      "website-dan-web-app-bisnis",
      "sistem-kustom-dan-event-interaktif",
    ]);
  });

  it("membuang aksen, tanda baca, dan spasi berlebih", () => {
    expect(serviceSlug("  Layanan  Kustom!!! ")).toBe("layanan-kustom");
    expect(serviceSlug("Café & Restoran")).toBe("cafe-dan-restoran");
    expect(serviceSlug("---")).toBe("");
  });

  it("membatasi panjang slug agar tetap aman untuk URL", () => {
    const slug = serviceSlug(`${"a".repeat(150)} b`);
    expect(slug).toHaveLength(100);
    expect(slug).not.toMatch(/-$/);
  });

  it("menerjemahkan alias URL desain lama", () => {
    expect(normalizeServiceSlug("sistem-informasi")).toBe(
      "sistem-informasi-dan-satu-data",
    );
    expect(normalizeServiceSlug("website")).toBe("website-dan-web-app-bisnis");
    expect(normalizeServiceSlug("slug-lain")).toBe("slug-lain");
  });

  it("menemukan layanan lewat slug turunan maupun alias", () => {
    expect(findServiceBySlug(services, "website-dan-web-app-bisnis")).toEqual(
      services[2],
    );
    expect(findServiceBySlug(services, "website")).toEqual(services[2]);
    expect(findServiceBySlug(services, "aplikasi-mobile")).toEqual(services[1]);
    expect(findServiceBySlug(services, "tidak-ada")).toBeNull();
  });

  it("menolak slug yang tidak berasal dari judul mana pun", () => {
    expect(findServiceBySlug(services, "")).toBeNull();
    expect(findServiceBySlug([], "website")).toBeNull();
  });
});
