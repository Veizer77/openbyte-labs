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
  title = "Layanan tambahan",
}: {
  addons: Addon[];
  title?: string;
}) {
  if (!addons.length) return null;
  return (
    <section aria-labelledby="public-addons-heading" className="mt-12">
      <div className="mb-5">
        <p className="mb-1 text-[11px] font-medium tracking-[.55px] text-[#595962]">
          TAMBAHAN OPSIONAL
        </p>
        <h2 id="public-addons-heading" className="m-0 text-2xl font-semibold text-[#18181a]">
          {title}
        </h2>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 xl:grid-cols-3">
        {addons.map((addon, index) => (
          <li key={`${addon.name}-${index}`} className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="m-0 text-base font-semibold text-[#18181a]">{addon.name}</h3>
              <p className="m-0 shrink-0 text-right text-sm font-semibold text-[#18181a]">
                {rupiah(addon.price)}
                <span className="block text-[11px] font-normal text-[#71717a]">
                  {billingLabels[addon.billingType]}
                </span>
              </p>
            </div>
            {addon.description ? <p className="mb-0 mt-3 text-sm leading-5 text-[#52525b]">{addon.description}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PublicPricingSection({
  packages,
  addons,
  title = "Pilihan paket layanan",
  showAddons = true,
}: {
  packages: Package[];
  addons: Addon[];
  title?: string;
  showAddons?: boolean;
}) {
  return (
    <section aria-labelledby="public-pricing-heading" className="w-full">
      <h2 id="public-pricing-heading" className="mb-5 mt-0 text-2xl font-semibold text-[#18181a]">
        {title}
      </h2>
      {packages.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((item, index) => (
            <article key={`${item.slug}-${index}`} className={`flex flex-col rounded-2xl border p-5 ${item.isPopular ? "border-[#aeb768] bg-[#fbfcf3]" : "border-neutral-200 bg-white"}`}>
              <h3 className="m-0 text-lg font-semibold text-[#18181a]">{item.name}</h3>
              {item.targetMarket ? <p className="mb-0 mt-2 text-sm text-[#52525b]">{item.targetMarket}</p> : null}
              <p className="mb-0 mt-4 text-2xl font-bold text-[#18181a]">
                {item.billingType === "custom" ? "Hubungi kami" : rupiah(item.effectivePrice)}
                {item.billingType === "subscription_yearly" ? <span className="ml-1 text-xs font-normal">/ tahun</span> : null}
              </p>
              <ul className="mb-5 mt-4 flex-1 space-y-2 pl-5 text-sm leading-5 text-[#52525b]">
                {item.features.map((feature, featureIndex) => <li key={`${feature}-${featureIndex}`}>{feature}</li>)}
              </ul>
              <Link href={`/pesan?paket=${encodeURIComponent(item.slug)}`} className="flex min-h-11 items-center justify-center rounded-lg bg-[#18181a] px-4 py-3 text-center text-sm font-semibold text-white no-underline">
                {item.ctaLabel || `Tanyakan ${item.name}`}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="m-0 rounded-xl border border-neutral-200 p-5 text-sm text-[#52525b]">Belum ada paket yang dipublikasikan.</p>
      )}
      {showAddons ? <PublicAddonsSection addons={addons} /> : null}
    </section>
  );
}
