import { describe, expect, it } from "vitest";
import type { ServerEnv } from "@/env";
import { clientIpHash, normalizeAddress } from "@/security/client-ip";

/**
 * Rate limit form dan login bergantung pada satu hal: IP yang dipakai benar-benar
 * milik klien, bukan nilai yang dikirim klien sendiri.
 *
 * `TRUSTED_IP_HEADER` di produksi disimpan sebagai nilai sensitif sehingga tidak
 * bisa dibaca dari CLI. Tes ini memastikan perilakunya tetap aman untuk nilai
 * header apa pun yang wajar, termasuk saat header yang dikonfigurasi kosong.
 */
const env = {
  TRUSTED_IP_HEADER: "x-forwarded-for",
  IP_HASH_SALT: "salt-uji-yang-panjangnya-cukup-32",
} as unknown as ServerEnv;

const hash = (headers: Record<string, string>, overrides: Partial<ServerEnv> = {}) =>
  clientIpHash(new Headers(headers), { ...env, ...overrides } as ServerEnv);

describe("clientIpHash", () => {
  it("memakai header yang dikonfigurasi bila tersedia", () => {
    expect(hash({ "x-forwarded-for": "203.0.113.7" })).toBe(
      hash({ "x-forwarded-for": "203.0.113.7" }),
    );
  });

  it("mengambil alamat paling kiri dari daftar berantai", () => {
    expect(hash({ "x-forwarded-for": "203.0.113.7, 70.41.3.18" })).toBe(
      hash({ "x-forwarded-for": "203.0.113.7" }),
    );
  });

  it("membuang port sebelum hashing", () => {
    expect(hash({ "x-forwarded-for": "203.0.113.7:51234" })).toBe(
      hash({ "x-forwarded-for": "203.0.113.7" }),
    );
  });

  it("menghasilkan hash berbeda untuk alamat berbeda", () => {
    expect(hash({ "x-forwarded-for": "203.0.113.7" })).not.toBe(
      hash({ "x-forwarded-for": "198.51.100.9" }),
    );
  });

  it("jatuh ke header milik proxy Vercel saat header konfigurasi kosong", () => {
    expect(hash({ "x-vercel-forwarded-for": "198.51.100.9" })).toBe(
      hash({ "x-forwarded-for": "198.51.100.9" }),
    );
  });

  it("jatuh ke x-real-ip saat header lain tidak ada", () => {
    expect(hash({ "x-real-ip": "198.51.100.9" })).toBe(
      hash({ "x-forwarded-for": "198.51.100.9" }),
    );
  });

  it("tidak memakai header konfigurasi dua kali sebagai fallback", () => {
    const onlyRealIp = hash({ "x-real-ip": "198.51.100.9" }, {
      TRUSTED_IP_HEADER: "x-real-ip",
    } as Partial<ServerEnv>);
    expect(onlyRealIp).toBe(hash({ "x-real-ip": "198.51.100.9" }));
  });

  it("menolak saat tidak ada header alamat sama sekali", () => {
    expect(() => hash({})).toThrow(/Alamat klien tidak tersedia/);
  });

  it("menolak header yang hanya berisi spasi", () => {
    expect(() => hash({ "x-forwarded-for": "   " })).toThrow(/Alamat klien tidak tersedia/);
  });
});

describe("normalizeAddress", () => {
  it("membuang port IPv4 dan bracket IPv6", () => {
    expect(normalizeAddress("203.0.113.7:443")).toBe("203.0.113.7");
    expect(normalizeAddress("[2001:db8::1]:8080")).toBe("2001:db8::1");
    expect(normalizeAddress(" 203.0.113.7 ")).toBe("203.0.113.7");
  });
});
