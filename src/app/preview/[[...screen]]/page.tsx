import { notFound } from "next/navigation";
import Link from "next/link";
import { isScreenKey, screenLoaders } from "@/lib/screens";
import inventory from "@/fixtures/screens.json";
import { AdminSupportingPage } from "@/components/admin/AdminSupportingPage";

export const dynamic = "force-dynamic";
export default async function PreviewPage({
  params,
}: {
  params: Promise<{ screen?: string[] }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const key = (await params).screen?.join("/");
  if (key) {
    if (key === "cms/halaman" || key === "cms/media" || key === "cms/kalkulator") {
      const kind = key.slice("cms/".length) as "halaman" | "media" | "kalkulator";
      return <AdminSupportingPage kind={kind} />;
    }
    if (!isScreenKey(key)) notFound();
    const { default: Screen } = await screenLoaders[key]();
    return <Screen />;
  }
  return (
    <main id="konten" className="max-w-[1200px] mx-auto p-6 sm:p-12">
      <Link href="/" className="text-sm">
        ← Kembali ke website
      </Link>
      <h1 className="text-3xl mt-8 mb-3">OpenByte Labs · Katalog Frontend</h1>
      <p className="text-sm text-[#52525b] leading-6">
        33 layar prototype telah dipindahkan ke React. Preview ini hanya
        tersedia saat development, memakai data contoh tanpa autentikasi atau
        database. Tracking Rilis 2 hanya ditampilkan di katalog ini; rute
        /tracking tetap 404.
      </p>
      {["site", "cms", "system"].map((area) => (
        <section key={area} className="mt-9">
          <h2 className="text-lg">
            {area === "site"
              ? "Website Publik (13)"
              : area === "cms"
                ? "Dashboard Admin (16)"
                : "Dokumentasi Desain (4)"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inventory
              .filter((screen) => screen.key.startsWith(`${area}/`))
              .map((screen) => (
                <Link
                  href={`/preview/${screen.key}`}
                  key={screen.key}
                  className="rounded-xl border border-solid border-[#eaeaea] p-4 hover:bg-[#f0f0f0] flex flex-col gap-2"
                >
                  <span className="text-sm font-medium">{screen.title}</span>
                  <span className="text-xs text-[#52525b]">{screen.route}</span>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}
