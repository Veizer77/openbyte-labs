import type { ReactNode } from "react";
import { richTextSchema, type RichText } from "@/schemas/rich-text";

export const inputClass =
  "min-h-11 w-full rounded-xl border border-[#d4d4d8] bg-[#f7f7f8] px-3 py-2 text-sm text-[#18181a] focus:outline-2 focus:outline-offset-2 focus:outline-[#586016]";
export const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#18181a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#343438] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2";
export const secondaryClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d4d4d8] bg-white px-3 py-2 text-sm font-medium text-[#27272a] hover:bg-[#f4f4f5] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2";
export function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-[#e4e4e7] bg-white p-4 sm:p-6">
      <h2 className="mb-5 text-lg font-semibold text-[#18181a]">{title}</h2>
      {children}
    </section>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-2 text-xs font-semibold text-[#52525b]">
      {label}
      {children}
    </label>
  );
}
export function Notice({ error, status }: { error?: string; status?: string }) {
  return (
    <>
      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}
      {status ? (
        <p
          role="status"
          className="rounded-xl border border-[#dce3a2] bg-[#f6f8e7] p-3 text-sm text-[#3d4510]"
        >
          {status}
        </p>
      ) : null}
    </>
  );
}
export function money(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
export function dateTime(value: Date | string | null) {
  return value
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Jakarta",
      }).format(new Date(value))
    : "Belum ditentukan";
}
export function RichTextContent({ value }: { value: RichText | null }) {
  const parsed = richTextSchema.safeParse(value);
  if (!parsed.success) return null;
  const inline = (
    children: (
      | { type: "text"; text: string }
      | { type: "link"; text: string; url: string }
    )[],
  ) =>
    children.map((v, i) =>
      v.type === "link" ? (
        <a key={i} href={v.url} className="underline" rel="noreferrer">
          {v.text}
        </a>
      ) : (
        <span key={i}>{v.text}</span>
      ),
    );
  return (
    <div className="space-y-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#52525b]">
      {parsed.data.blocks.map((block, i) => {
        if (block.type === "paragraph")
          return <p key={i}>{inline(block.children)}</p>;
        if (block.type === "heading")
          return (
            <h3 key={i} className="font-semibold text-[#18181a]">
              {inline(block.children)}
            </h3>
          );
        const items = block.items.map((item, j) => (
          <li key={j}>{inline(item)}</li>
        ));
        return block.ordered ? (
          <ol key={i} className="list-decimal pl-5">
            {items}
          </ol>
        ) : (
          <ul key={i} className="list-disc pl-5">
            {items}
          </ul>
        );
      })}
    </div>
  );
}
