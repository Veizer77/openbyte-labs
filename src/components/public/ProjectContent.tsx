import Image from "next/image";
import type { ProjectContentBlock } from "@/schemas/blocks";
import type { PublicMediaAsset } from "@/schemas/media";
import { PublicRichText } from "./PublicRichText";
import { videoEmbedUrl } from "@/lib/video";

export function ProjectContent({ blocks, gallery, media }: {
  blocks: ProjectContentBlock[];
  gallery: Array<{ mediaId: string; alt: string }>;
  media: ReadonlyMap<string, PublicMediaAsset>;
}) {
  const image = (value: { mediaId: string; alt: string }, key: string) => {
    const asset = media.get(value.mediaId);
    return asset ? <figure key={key} className="relative m-0 aspect-video overflow-hidden rounded-xl"><Image src={asset.urls.hero} alt={value.alt || asset.alt} fill unoptimized sizes="(max-width: 768px) 100vw, 70vw" className="object-contain" /></figure> : null;
  };
  return <div className="mt-8 grid gap-8">
    {blocks.map((block, index) => {
      switch (block.type) {
        case "richText": return <PublicRichText key={index} value={block.body} />;
        case "image": return <div key={index}>{image(block, `${index}`)}{block.caption ? <p className="mt-2 text-sm text-[#52525b]">{block.caption}</p> : null}</div>;
        case "gallery": return <section key={index} aria-label="Galeri studi kasus" className="grid gap-4 sm:grid-cols-2">{block.images.map((item, at) => image(item, `${index}-${at}`))}</section>;
        case "video": {
          const src = videoEmbedUrl(block.url);
          return src ? <iframe key={index} src={src} title={`Video proyek ${index + 1}`} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-presentation" className="aspect-video w-full rounded-xl border-0" /> : null;
        }
        case "stats": return <dl key={index} className="m-0 grid gap-4 sm:grid-cols-3">{block.items.map((item, at) => <div key={at} className="rounded-xl bg-neutral-50 p-5"><dt className="text-sm text-[#52525b]">{item.label}</dt><dd className="m-0 mt-2 text-2xl font-semibold">{item.value}</dd></div>)}</dl>;
        case "quote": return <blockquote key={index} className="m-0 rounded-xl bg-neutral-50 p-6"><p className="m-0 text-lg">{block.text}</p>{block.author ? <cite className="mt-3 block text-sm">{block.author}</cite> : null}</blockquote>;
        case "bullets": return <ul key={index} className="space-y-2 pl-5 text-sm leading-7">{block.items.map((item, at) => <li key={at}>{item}</li>)}</ul>;
        case "problemSolutionImpact": return <section key={index} className="grid gap-5 md:grid-cols-3">{[["Masalah", block.problem], ["Solusi", block.solution], ["Dampak", block.impact]].map(([title, text]) => <div key={title} className="rounded-xl border border-neutral-200 p-6"><h2 className="mt-0 text-lg font-semibold">{title}</h2><p className="mb-0 whitespace-pre-wrap text-sm leading-7 text-[#52525b]">{text}</p></div>)}</section>;
      }
    })}
    {gallery.length ? <section aria-label="Galeri proyek" className="grid gap-4 sm:grid-cols-2">{gallery.map((item, index) => image(item, `gallery-${index}`))}</section> : null}
  </div>;
}
