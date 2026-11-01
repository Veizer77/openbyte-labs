import Link from "next/link";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { PublicAddonsSection } from "./PublicContentSections";
import { rupiah } from "@/lib/format";
import type { PublicCatalog } from "@/lib/server/public-catalog";

function textFromRichText(
  blocks: PublicCatalog["faqs"][number]["answer"]["blocks"],
): string[] {
  return blocks.map((block) => {
    if (block.type === "list")
      return block.items.map((item) => item.map((node) => node.text).join(""))
        .join(" ");
    return block.children.map((node) => node.text).join("");
  });
}

export function PublicPackageCatalog({
  catalog,
}: {
  catalog: PublicCatalog;
}) {
  return (
    <div className="screen public-screen min-h-screen bg-white">
      <PublicHeader settings={catalog.settings} />
      <main
        id="konten"
        className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-28 sm:px-6 lg:px-8"
      >
        <section className="mb-8 flex flex-col gap-3">
          <div className="text-[11px] font-medium tracking-[.55px] text-[#52525b]">
            KATALOG LAYANAN
          </div>
          <h1 className="m-0 text-[28px] font-semibold tracking-[-.7px] text-[#18181a] sm:text-[34px]">
            Pilihan Paket Layanan
          </h1>
          <p className="m-0 max-w-3xl text-sm leading-6 text-[#52525b]">
            Paket yang tampil di sini berasal dari katalog aktif. Rincian dan
            harga mengikuti data yang diterbitkan di dashboard. Harga, fitur,
            estimasi waktu, dan revisi merupakan informasi awal; ketentuan final
            perlu dicantumkan dalam penawaran tertulis.
          </p>
        </section>

        {catalog.packages.length ? (
          <section
            aria-label="Paket layanan tersedia"
            className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {catalog.packages.map((item) => (
              <article
                key={item.id}
                className={`flex h-full flex-col gap-5 rounded-2xl border p-6 ${
                  item.isPopular
                    ? "border-[#aeb768] bg-[#fbfcf3]"
                    : "border-neutral-200 bg-white"
                }`}
              >
                <div className="flex-1">
                  {item.isPopular ? (
                    <p className="mb-3 text-[11px] font-semibold text-[#586016]">
                      Paket unggulan
                    </p>
                  ) : null}
                  <h2 className="m-0 text-xl font-semibold text-[#18181a]">
                    {item.name}
                  </h2>
                  {item.targetMarket ? (
                    <p className="mt-2 text-sm text-[#52525b]">
                      {item.targetMarket}
                    </p>
                  ) : null}
                  <div className="mt-5">
                    {item.effectivePrice < item.price ? (
                      <p className="m-0 text-xs text-[#71717a] line-through">
                        {rupiah(item.price)}
                      </p>
                    ) : null}
                    <p className="m-0 text-3xl font-bold tracking-[-.6px] text-[#18181a]">
                      {item.billingType === "custom"
                        ? "Hubungi kami"
                        : rupiah(item.effectivePrice)}
                    </p>
                    {item.billingType === "subscription_yearly" ? (
                      <p className="mt-1 text-xs text-[#52525b]">per tahun</p>
                    ) : null}
                  </div>
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-neutral-200 py-4 text-sm">
                    <div>
                      <dt className="text-xs text-[#71717a]">Estimasi kerja</dt>
                      <dd className="m-0 mt-1 font-medium text-[#18181a]">
                        {item.estimatedDays} hari
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#71717a]">Revisi tercantum</dt>
                      <dd className="m-0 mt-1 font-medium text-[#18181a]">
                        {item.includedRevisions} kali
                      </dd>
                    </div>
                  </dl>
                  <ul className="mt-4 space-y-2 pl-5 text-sm leading-5 text-[#52525b]">
                    {item.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/pesan?paket=${encodeURIComponent(item.slug)}`}
                  className="flex min-h-12 items-center justify-center rounded-xl bg-[#18181a] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#586016]"
                >
                  {item.ctaLabel || `Tanyakan ${item.name}`}
                </Link>
              </article>
            ))}
          </section>
        ) : (
          <p
            role="status"
            className="rounded-xl border border-neutral-200 bg-[#f9f9f9] p-5 text-sm text-[#52525b]"
          >
            Belum ada paket yang dipublikasikan.
          </p>
        )}

        {catalog.faqs.length ? (
          <section className="mt-12 max-w-4xl">
            <h2 className="mb-4 text-2xl font-semibold text-[#18181a]">
              Pertanyaan tentang paket
            </h2>
            <div className="divide-y divide-neutral-200 border-y border-neutral-200">
              {catalog.faqs.map((faq) => (
                <details key={faq.id} className="py-4">
                  <summary className="cursor-pointer text-sm font-semibold text-[#18181a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#586016]">
                    {faq.question}
                  </summary>
                  <div className="mt-3 space-y-2 text-sm leading-6 text-[#52525b]">
                    {textFromRichText(faq.answer.blocks).map((paragraph, i) =>
                      paragraph ? <p key={`${faq.id}-${i}`}>{paragraph}</p> : null,
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ) : null}
        <PublicAddonsSection addons={catalog.addons} />
      </main>
      <PublicFooter settings={catalog.settings} />
    </div>
  );
}
