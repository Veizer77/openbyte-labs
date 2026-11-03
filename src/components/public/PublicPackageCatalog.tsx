import SitePaketLayananHarga from "@/components/screens/site/paket-layanan-harga";
import type { PublicCatalog } from "@/lib/server/public-catalog";

export function PublicPackageCatalog({
  catalog,
}: {
  catalog: PublicCatalog;
}) {
  return <SitePaketLayananHarga catalog={catalog} />;
}
