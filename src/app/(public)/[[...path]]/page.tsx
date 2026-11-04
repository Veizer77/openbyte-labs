import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { screenLoaders, type ScreenKey } from "@/lib/screens";
import {
  AboutPage,
  PrivacyPage,
  TermsPage,
} from "@/components/public/SupportingPages";
import { ProjectDetail } from "@/components/public/ProjectDetail";
import { PublicProjectCatalog } from "@/components/public/PublicProjectCatalog";
import { getPublicProject } from "@/lib/server/public-projects";
import { getPublicProjectListing } from "@/lib/server/public-projects";
import { getPublicCatalog, getPublicServiceList } from "@/lib/server/public-catalog";
import { getPublicSiteSettings } from "@/lib/server/public-site";
import type { PublicSiteSettings } from "@/schemas/public-site-settings";
import { getPublicPageView } from "@/lib/server/public-pages";
import { PublicPageBuilder } from "@/components/public/PublicPageBuilder";
import { PublicBlog } from "@/components/public/PublicBlog";
import { PublicServiceDetail } from "@/components/public/PublicServiceDetail";
import { findServiceBySlug } from "@/lib/service-slug";
import { publicIndexingEnabled } from "@/lib/indexing";

const routes: Record<string, { key: ScreenKey; title: string }> = {
  "": { key: "site/beranda", title: "Website, Aplikasi & Sistem Informasi" },
  proyek: { key: "site/daftar-portofolio", title: "Proyek Portofolio" },
  paket: { key: "site/paket-layanan-harga", title: "Paket Layanan & Harga" },
  kalkulator: {
    key: "site/kalkulator-estimasi-biaya",
    title: "Kalkulator Estimasi Biaya",
  },
  "tentang-kami": { key: "site/tentang-kami", title: "Tentang Kami" },
  "ketentuan-layanan": {
    key: "site/ketentuan-layanan",
    title: "Ketentuan Layanan",
  },
  // Title only: the render branch above handles `/blog` before the fallback lookup.
  blog: { key: "site/blog", title: "Blog & Wawasan Rekayasa" },
};
interface Props {
  params: Promise<{ path?: string[] }>;
}

export function generateStaticParams() {
  return [
    ...Object.keys(routes),
    "kebijakan-privasi",
  ].map((path) => ({ path: path ? path.split("/") : [] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = (await params).path?.join("/") ?? "";
  let projectTitle: string | undefined;
  let projectDescription: string | undefined;
  let projectOgImage: string | undefined;
  let page: Awaited<ReturnType<typeof getPublicPageView>> = null;
  let settings: PublicSiteSettings | undefined;
  try {
    settings = await getPublicSiteSettings();
  } catch {
    settings = undefined;
  }
  if (/^proyek\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)) {
    const slug = path.slice("proyek/".length);
    try {
      const data = await getPublicProject(slug);
      projectTitle = data?.project.metaTitle || data?.project.title;
      projectDescription = data?.project.metaDescription || data?.project.summary;
      projectOgImage = data?.project.ogImageId ? data.media.get(data.project.ogImageId)?.urls.og : data?.project.imageUrl ?? undefined;
    } catch {
      // Metadata remains generic while the public project catalog is unavailable.
    }
  }
  if (path === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)) {
    try {
      page = await getPublicPageView(path === "" ? "home" : path === "tentang-kami" ? "tentang" : path);
    } catch {
      page = null;
    }
  }
  if (/^layanan\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)) {
    try {
      const service = findServiceBySlug(
        await getPublicServiceList(),
        path.slice("layanan/".length),
      );
      projectTitle = service?.title;
      projectDescription = service?.description || undefined;
    } catch {
      // Metadata stays generic when the service catalog is unavailable.
    }
  }
  const title =
    page?.metaTitle ??
    page?.title ??
    routes[path]?.title ??
    projectTitle ??
    (path === "pesan"
      ? "Pemesanan Paket"
      : path === "kebijakan-privasi"
        ? "Kebijakan Privasi"
        : settings?.seo.defaultTitle ?? "Halaman tidak ditemukan");
  const description = page?.metaDescription ?? projectDescription ?? settings?.seo.defaultDescription;
  const ogImage = page?.ogImageUrl ?? projectOgImage ?? settings?.seo.defaultOgImageUrl;
  // /blog belum punya modul editorial sehingga isinya selalu keadaan kosong.
  // Jangan pernah diindeks walau indexing publik sudah dinyalakan.
  const indexingAllowed = publicIndexingEnabled() && path !== "blog";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${path}` },
    icons: settings?.general.faviconUrl ? { icon: settings.general.faviconUrl } : undefined,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      type: "website",
    },
    robots: { index: indexingAllowed, follow: indexingAllowed },
  };
}

export const dynamic = "force-dynamic";

export default async function PublicPage({ params }: Props) {
  const path = (await params).path?.join("/") ?? "";
  if (path === "" || ["tentang-kami", "ketentuan-layanan", "kebijakan-privasi"].includes(path)) {
    const page = await getPublicPageView(path === "" ? "home" : path === "tentang-kami" ? "tentang" : path);
    if (page) return <PublicPageBuilder page={page} catalog={await getPublicCatalog()} />;
  }
  if (
    path === "kebijakan-privasi" ||
    path === "ketentuan-layanan" ||
    path === "tentang-kami"
  ) {
    let settings: PublicSiteSettings | undefined;
    try {
      settings = await getPublicSiteSettings();
    } catch {
      settings = undefined;
    }
    if (path === "kebijakan-privasi") return <PrivacyPage settings={settings} />;
    if (path === "ketentuan-layanan") return <TermsPage settings={settings} />;
    return <AboutPage settings={settings} />;
  }

  if (/^layanan\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)) {
    const slug = path.slice("layanan/".length);
    const service = findServiceBySlug(await getPublicServiceList(), slug);
    if (!service) notFound();
    let settings: PublicSiteSettings | undefined;
    try {
      settings = await getPublicSiteSettings();
    } catch {
      settings = undefined;
    }
    return <PublicServiceDetail service={service} settings={settings} />;
  }

  if (path === "") {
    const catalog = await getPublicCatalog();
    const { default: Home } = await screenLoaders["site/beranda"]();
    return <Home catalog={catalog} />;
  }

  if (path === "proyek") {
    const { projects, settings, categories } = await getPublicProjectListing();
    return <PublicProjectCatalog projects={projects} settings={settings} categories={categories} />;
  }

  if (path === "paket") {
    const catalog = await getPublicCatalog();
    const { default: Screen } = await screenLoaders["site/paket-layanan-harga"]();
    return <Screen catalog={catalog} />;
  }

  if (path === "blog") {
    let settings: PublicSiteSettings | undefined;
    try {
      settings = await getPublicSiteSettings();
    } catch {
      settings = undefined;
    }
    return <PublicBlog settings={settings} />;
  }

  if (/^proyek\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)) {
    const slug = path.slice("proyek/".length);
    const data = await getPublicProject(slug);
    if (!data?.project) notFound();
    return <ProjectDetail project={data.project} settings={data.settings} media={data.media} related={data.related} />;
  }

  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)) {
    const page = await getPublicPageView(path);
    if (page) {
      const catalog = await getPublicCatalog();
      return <PublicPageBuilder page={page} catalog={catalog} />;
    }
  }

  const entry = Object.hasOwn(routes, path) ? routes[path] : null;
  if (!entry) notFound();
  const { default: Screen } = await screenLoaders[entry.key]();
  return <Screen />;
}
