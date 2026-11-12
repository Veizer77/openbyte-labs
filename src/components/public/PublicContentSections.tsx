import Link from "next/link";
import { rupiah } from "@/lib/format";
import type { PublicCatalog } from "@/lib/server/public-catalog";

type Addon = PublicCatalog["addons"][number];
type Package = PublicCatalog["packages"][number];

const billingLabels = {
  one_time: "sekali bayar",
  monthly: "per bulan",
  yearly: "per tahun",
} as const;

export function PublicAddonsSection({
  addons,
  title = "Modul & Ekstensi Tambahan",
}: {
  addons: Addon[];
  title?: string;
}) {
  if (!addons.length) return null;
  return (
    <section aria-labelledby="public-addons-heading" className="box-border w-full flex flex-col gap-5 pt-4">
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold tracking-[0.55px] text-[#595962] uppercase">
          TAMBAHAN OPSIONAL &amp; FLEKSIBEL
        </div>
        <h2 id="public-addons-heading" className="text-2xl font-semibold text-[#18181a] tracking-[-0.3px] m-0">
          {title}
        </h2>
        <p className="text-sm text-[#52525b] m-0">
          Tingkatkan kapabilitas sistem Anda dengan modul teruji yang dapat diintegrasikan kapan saja sesuai kebutuhan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {addons.map((addon, index) => (
          <article
            key={`${addon.name}-${index}`}
            className="box-border p-5 rounded-[16px] border border-neutral-200/80 bg-white shadow-[0px_1px_2px_#0000000d] flex flex-col justify-between gap-4"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[#f0f0f0] flex items-center justify-center text-[#18181a] shrink-0">
                  <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-lg symbol">
                    extension
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[18px] font-bold text-[#18181a]">
                    {rupiah(addon.price)}
                  </span>
                  <span className="block text-[11px] text-[#71717a]">
                    {billingLabels[addon.billingType]}
                  </span>
                </div>
              </div>

              <h3 className="text-[16px] font-semibold text-[#18181a] m-0 mt-1">
                {addon.name}
              </h3>
              {addon.description ? (
                <p className="text-[13px]/[19px] text-[#52525b] m-0">
                  {addon.description}
                </p>
              ) : null}
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-[#82b440] font-medium">
                Kompatibel Seluruh Tier
              </span>
              <Link
                href="/konsultasi"
                className="text-[12px] font-semibold text-[#18181a] hover:underline flex items-center gap-1"
              >
                <span>Sertakan</span>
                <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm symbol">
                  add
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PublicPricingSection({
  packages,
  addons,
  title = "Pilihan Paket Layanan",
  showAddons = true,
}: {
  packages: Package[];
  addons: Addon[];
  title?: string;
  showAddons?: boolean;
}) {
  return (
    <section aria-labelledby="public-pricing-heading" className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold tracking-[0.55px] text-[#595962] uppercase">
          PAKET LAYANAN TERSTANDAR
        </div>
        <h2 id="public-pricing-heading" className="text-2xl font-semibold text-[#18181a] tracking-[-0.3px] m-0">
          {title}
        </h2>
      </div>

      {packages.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {packages.map((item, index) => (
            <article
              key={`${item.slug}-${index}`}
              className={`flex flex-col justify-between p-6 rounded-[16px] shadow-[0px_1px_2px_#0000000d] ${
                item.isPopular
                  ? "border-2 border-[#aeb768] bg-[#fbfcf3]"
                  : "border border-neutral-200/80 bg-white"
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="m-0 text-xl font-semibold text-[#18181a]">{item.name}</h3>
                  {item.isPopular ? (
                    <span className="px-2 py-0.5 bg-[#18181a] text-[#e2e89d] text-[10px] font-bold rounded-full">
                      POPULER
                    </span>
                  ) : null}
                </div>
                {item.targetMarket ? (
                  <p className="m-0 text-xs text-[#52525b]">{item.targetMarket}</p>
                ) : null}

                <div className="p-3 bg-[#f0f0f0] rounded-[10px] mt-2">
                  {item.billingType !== "custom" && item.effectivePrice < item.price ? (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs line-through text-[#71717a] font-medium">
                        {rupiah(item.price)}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#e2e89d] text-[#18181a]">
                        Hemat {Math.round((1 - item.effectivePrice / item.price) * 100)}%
                      </span>
                    </div>
                  ) : null}
                  <span className="text-2xl font-bold text-[#18181a]">
                    {item.billingType === "custom" ? "Hubungi kami" : rupiah(item.effectivePrice)}
                  </span>
                  {item.billingType === "subscription_yearly" ? (
                    <span className="ml-1 text-xs text-[#52525b]">/ tahun</span>
                  ) : (
                    <span className="ml-1 text-xs text-[#52525b]">/ proyek</span>
                  )}
                </div>

                <ul className="m-0 p-0 list-none flex flex-col gap-2 text-xs text-[#52525b] mt-3">
                  {item.features.map((feature, featureIndex) => (
                    <li key={`${feature}-${featureIndex}`} className="flex items-start gap-2">
                      <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm text-[#82b440] symbol mt-0.5">
                        check
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5 mt-4 border-t border-neutral-100">
                <Link
                  href={`/pesan?paket=${encodeURIComponent(item.slug)}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#18181a] py-2.5 text-center text-xs font-semibold text-white no-underline hover:opacity-90"
                >
                  <span>{item.ctaLabel || `Tanyakan ${item.name}`}</span>
                  <span className="font-['Material_Symbols_Outlined',system-ui,sans-serif] text-sm symbol">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="p-6 text-center bg-[#f0f0f0] rounded-[12px] text-sm text-[#52525b]">
          Belum ada paket yang dipublikasikan.
        </p>
      )}

      {showAddons ? <PublicAddonsSection addons={addons} /> : null}
    </section>
  );
}
