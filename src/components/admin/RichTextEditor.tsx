"use client";

import type { RichText } from "@/schemas/rich-text";

export function RichTextEditor({ value, onChange, label = "Isi teks" }: { value: RichText; onChange: (value: RichText) => void; label?: string }) {
  return <fieldset className="grid min-w-0 gap-3 rounded-xl border border-neutral-200 p-3">
    <legend className="px-1 text-sm font-medium">{label}</legend>
    {value.blocks.map((block, index) => <div key={index} className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs">{block.type === "heading" ? `Judul H${block.level}` : block.type === "list" ? "Daftar" : "Paragraf"} {index + 1}</span>
        <button type="button" className="secondary-button min-h-11" onClick={() => onChange({ ...value, blocks: value.blocks.filter((_, at) => at !== index) })}>Hapus bagian {index + 1}</button>
      </div>
      <label className="field">Teks bagian {index + 1}
        <textarea rows={3} value={block.type === "list" ? block.items.map((item) => item.map((node) => node.text).join("")).join("\n") : block.children.map((node) => node.text).join("")}
          onChange={(event) => {
            const text = event.target.value;
            const next = block.type === "list" ? { ...block, items: text.split("\n").map((line) => [{ type: "text" as const, text: line }]) } : { ...block, children: [{ type: "text" as const, text }] };
            onChange({ ...value, blocks: value.blocks.map((item, at) => at === index ? next : item) });
          }} />
      </label>
      {(block.type === "list" ? block.items.flat() : block.children).some((node) => node.type === "link") ? <p className="text-xs text-amber-900">Bagian ini berisi tautan. Mengubah teks akan menjadikannya teks biasa. Gunakan JSON lanjutan untuk mempertahankan tautan.</p> : null}
    </div>)}
    <div className="flex flex-wrap gap-2">
      <button type="button" className="secondary-button min-h-11" onClick={() => onChange({ ...value, blocks: [...value.blocks, { type: "paragraph", children: [] }] })}>Tambah paragraf</button>
      <button type="button" className="secondary-button min-h-11" onClick={() => onChange({ ...value, blocks: [...value.blocks, { type: "heading", level: 2, children: [] }] })}>Tambah judul</button>
      <button type="button" className="secondary-button min-h-11" onClick={() => onChange({ ...value, blocks: [...value.blocks, { type: "list", ordered: false, items: [] }] })}>Tambah daftar</button>
    </div>
  </fieldset>;
}
