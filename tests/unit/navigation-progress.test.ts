import { describe, expect, it } from "vitest";
import { shouldTrackNavigation } from "@/lib/navigation-progress";

const base = {
  href: "/paket",
  target: null,
  download: false,
  currentUrl: "https://openbyte.test/proyek",
  sameOrigin: true,
};

describe("progress bar navigasi", () => {
  it("melacak perpindahan internal ke halaman lain", () => {
    expect(shouldTrackNavigation(base)).toBe(true);
    expect(shouldTrackNavigation({ ...base, href: "/" })).toBe(true);
    expect(
      shouldTrackNavigation({
        ...base,
        currentUrl: "https://openbyte.test/",
        href: "/blog",
      }),
    ).toBe(true);
  });

  it("melacak perpindahan yang hanya mengubah query atau hash halaman lain", () => {
    expect(
      shouldTrackNavigation({ ...base, href: "/proyek?page=2" }),
    ).toBe(true);
  });

  it("mengabaikan tautan ke halaman yang sedang dibuka", () => {
    expect(
      shouldTrackNavigation({
        ...base,
        currentUrl: "https://openbyte.test/paket",
      }),
    ).toBe(false);
    expect(
      shouldTrackNavigation({
        ...base,
        href: "#konten",
        currentUrl: "https://openbyte.test/paket",
      }),
    ).toBe(false);
  });

  it("mengabaikan tautan eksternal, unduhan, dan tab baru", () => {
    expect(shouldTrackNavigation({ ...base, href: "https://example.com" })).toBe(
      false,
    );
    expect(shouldTrackNavigation({ ...base, href: "//example.com" })).toBe(
      false,
    );
    expect(shouldTrackNavigation({ ...base, href: "mailto:a@b.test" })).toBe(
      false,
    );
    expect(shouldTrackNavigation({ ...base, download: true })).toBe(false);
    expect(shouldTrackNavigation({ ...base, target: "_blank" })).toBe(false);
  });

  it("menghormati klik dengan tombol pengubah dan tombol non-kiri", () => {
    expect(shouldTrackNavigation({ ...base, modified: true })).toBe(false);
    expect(shouldTrackNavigation({ ...base, button: 1 })).toBe(false);
    expect(shouldTrackNavigation({ ...base, button: 2 })).toBe(false);
    expect(shouldTrackNavigation({ ...base, target: "_self" })).toBe(true);
  });

  it("menolak href kosong atau origin yang tidak sama", () => {
    expect(shouldTrackNavigation({ ...base, href: null })).toBe(false);
    expect(shouldTrackNavigation({ ...base, href: "" })).toBe(false);
    expect(shouldTrackNavigation({ ...base, sameOrigin: false })).toBe(false);
  });
});
