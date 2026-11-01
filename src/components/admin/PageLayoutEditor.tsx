"use client";

import { useState } from "react";
import { pageLayoutSchema, type PageBlock } from "@/schemas/blocks";
import { createPageBlock, moveBlock, pageBlockLabels } from "@/lib/page-blocks";
import { RichTextEditor } from "./RichTextEditor";

export function PageLayoutEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [type, setType] = useState<PageBlock["type"]>("hero");
  const [dragging, setDragging] = useState<number | null>(null);
  let blocks: PageBlock[] | null = null;
  try { const parsed = pageLayoutSchema.safeParse(JSON.parse(value)); if (parsed.success) blocks = parsed.data; } catch { /* Advanced edits remain available for correction. */ }
  const update = (items: PageBlock[]) => onChange(JSON.stringify(items, null, 2));
  const change = (index: number, patch: Partial<PageBlock>) => {
    if (blocks) update(blocks.map((item, at) => at === index ? { ...item, ...patch } as PageBlock : item));
  };
  return <section aria-label="Susunan blok halaman" className="grid min-w-0 gap-4">
    <div className="flex flex-wrap items-end gap-2">
      <label className="field">Jenis blok<select value={type} onChange={(event) => setType(event.target.value as PageBlock["type"])}>{Object.entries(pageBlockLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <button type="button" disabled={!blocks || blocks.length >= 40} className="secondary-button min-h-11" onClick={() => { if (blocks) update([...blocks, createPageBlock(type, crypto.randomUUID())]); }}>Tambah blok</button>
    </div>
    {blocks?.map((block, index) => <fieldset key={block.id} draggable onDragStart={(event) => { if ((event.target as HTMLElement).closest("input,textarea,select")) { event.preventDefault(); return; } setDragging(index); }} onDragEnd={() => setDragging(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (dragging !== null) update(moveBlock(blocks, dragging, index)); setDragging(null); }} className="grid min-w-0 gap-3 rounded-xl border border-neutral-200 p-4">
      <legend className="px-1 text-sm font-semibold">{index + 1}. {pageBlockLabels[block.type]}</legend>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={block.isVisible} onChange={(event) => change(index, { isVisible: event.target.checked })} />Tampilkan blok</label>
        <button type="button" disabled={index === 0} aria-label={`Naikkan blok ${index + 1}`} className="secondary-button min-h-11" onClick={() => update(moveBlock(blocks, index, index - 1))}>Naik</button>
        <button type="button" disabled={index === blocks.length - 1} aria-label={`Turunkan blok ${index + 1}`} className="secondary-button min-h-11" onClick={() => update(moveBlock(blocks, index, index + 1))}>Turun</button>
        <button type="button" className="secondary-button min-h-11" onClick={() => update(blocks.filter((_, at) => at !== index))}>Hapus blok {index + 1}</button>
      </div>
      {Object.entries(block).filter(([key]) => !["id", "type", "isVisible", "body", "trustMetrics"].includes(key)).map(([key, item]) => <label key={key} className="field">{{ headline: "Headline", subheadline: "Subheadline", title: "Judul", description: "Deskripsi", primaryCtaLabel: "Label CTA utama", secondaryCtaLabel: "Label CTA kedua", heroImageId: "ID media hero", imageId: "ID media", limit: "Jumlah item", featuredOnly: "Hanya unggulan", showAddons: "Tampilkan add-on", disclaimer: "Disclaimer", text: "Teks" }[key] ?? key}
        {typeof item === "boolean" ? <input type="checkbox" checked={item} onChange={(event) => change(index, { [key]: event.target.checked })} /> : <input type={typeof item === "number" ? "number" : "text"} value={item === null ? "" : String(item)} onChange={(event) => change(index, { [key]: typeof item === "number" ? Number(event.target.value) : /ImageId$|^imageId$/.test(key) ? event.target.value || null : event.target.value })} />}
      </label>)}
      {"body" in block ? <RichTextEditor value={block.body} onChange={(body) => change(index, { body })} /> : null}
      {block.type === "hero" ? <p className="m-0 text-xs text-[#52525b]">Metrik hanya boleh diisi dengan data yang dapat dibuktikan. Metrik dan tautan rich text dapat diedit melalui JSON lanjutan.</p> : null}
    </fieldset>)}
    {!blocks ? <p role="alert" className="text-sm text-red-800">Perbaiki data JSON sebelum menggunakan editor visual.</p> : blocks.length === 0 ? <p className="text-sm text-[#52525b]">Belum ada blok. Tambahkan blok pertama untuk halaman ini.</p> : null}
    <details><summary className="cursor-pointer py-3 text-sm">JSON lanjutan</summary><label className="field">Susunan blok (JSON)<textarea rows={16} spellCheck={false} value={value} onChange={(event) => onChange(event.target.value)} /></label></details>
  </section>;
}
