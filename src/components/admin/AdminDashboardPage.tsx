"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  readAdminDashboardAction,
  type AdminDashboardData,
} from "@/actions/admin/dashboard";
import { AdminFrame } from "./AdminFrame";

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

function Stat({ label, value, href }: { label: string; value: string | number; href?: string }) {
  const content = (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <p className="m-0 text-xs text-[#71717a]">{label}</p>
      <p className="mb-0 mt-3 text-2xl font-semibold tabular-nums text-[#18181a]">{value}</p>
    </div>
  );
  return href ? <Link href={href} className="block no-underline">{content}</Link> : content;
}

function time(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

export function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void readAdminDashboardAction().then((result) => {
      if (!active) return;
      if (result.ok) setData(result.data);
      else setError(result.message);
      setLoading(false);
    }).catch(() => {
      if (active) {
        setError("Ringkasan CMS tidak dapat dimuat.");
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const ops = data?.operations;
  return (
    <AdminFrame title="Dashboard" description="Ringkasan data CMS dan tindakan yang memerlukan perhatian, langsung dari database.">
      {error ? <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}
      {loading ? <p role="status" className="rounded-xl bg-white p-5 text-sm text-[#52525b]">Memuat ringkasan…</p> : null}
      {data ? (
        <>
          <section aria-label="Ringkasan konten" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Stat label="Proyek terbit" value={data.content.publishedProjects} href="/admin/showcase" />
            <Stat label="Layanan aktif" value={data.content.activeServices} href="/admin/layanan" />
            <Stat label="FAQ aktif" value={data.content.activeFaqs} href="/admin/faqs" />
          </section>
          {ops ? (
            <>
              <h2 className="mb-3 mt-8 text-lg font-semibold">Operasional klien</h2>
              <section aria-label="Ringkasan operasional" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Stat label="Booking bulan ini" value={ops.bookingsThisMonth} href="/admin/booking" />
                <Stat label="Inquiry baru" value={ops.newInquiries} href="/admin/inquiry" />
                <Stat label="Quote baru" value={ops.newQuotes} href="/admin/quotes" />
                <Stat label="Proyek klien aktif" value={ops.activeClientProjects} href="/admin/proyek-klien" />
                <Stat label="Nilai proyek aktif" value={rupiah(ops.activeProjectValue)} href="/admin/proyek-klien" />
                <Stat label="Revisi menunggu" value={ops.revisionsNeedingReview} href="/admin/proyek-klien" />
              </section>
              <section className="mt-8 grid gap-5 xl:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="m-0 text-base font-semibold">Perlu ditinjau</h2>
                    <Link href="/admin/proyek-klien" className="text-sm">Semua proyek</Link>
                  </div>
                  {ops.revisions.length ? <ul className="m-0 grid list-none gap-3 p-0">{ops.revisions.map((item) => <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-3"><div><p className="m-0 text-sm font-medium">{item.title}</p><p className="mb-0 mt-1 text-xs text-[#71717a]">{item.projectTitle} · {time(item.submittedAt)}</p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-800">{item.status}</span></li>)}</ul> : <p className="m-0 text-sm text-[#71717a]">Tidak ada revisi yang menunggu.</p>}
                  <div className="mt-5 flex flex-wrap gap-3 text-sm"><Link href="/admin/inquiry">Inquiry</Link><Link href="/admin/quotes">Quote</Link></div>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between gap-3"><h2 className="m-0 text-base font-semibold">Booking terbaru</h2><Link href="/admin/booking" className="text-sm">Semua booking</Link></div>
                  {ops.latestBookings.length ? <ul className="m-0 grid list-none gap-3 p-0">{ops.latestBookings.map((item) => <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-3"><div><p className="m-0 text-sm font-medium">{item.name} <span className="font-normal text-[#71717a]">· {item.reference}</span></p><p className="mb-0 mt-1 text-xs text-[#71717a]">{time(item.slotStart)}</p></div><span className="text-xs text-[#52525b]">{item.status}</span></li>)}</ul> : <p className="m-0 text-sm text-[#71717a]">Belum ada booking.</p>}
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between gap-3"><h2 className="m-0 text-base font-semibold">Inquiry terbaru</h2><Link href="/admin/inquiry" className="text-sm">Semua inquiry</Link></div>
                  {ops.latestInquiries.length ? <ul className="m-0 grid list-none gap-3 p-0">{ops.latestInquiries.map((item) => <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-3"><div><p className="m-0 text-sm font-medium">{item.name} <span className="font-normal text-[#71717a]">· {item.reference}</span></p><p className="mb-0 mt-1 text-xs text-[#71717a]">{time(item.createdAt)}</p></div><span className="text-xs text-[#52525b]">{item.status}</span></li>)}</ul> : <p className="m-0 text-sm text-[#71717a]">Belum ada inquiry.</p>}
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between gap-3"><h2 className="m-0 text-base font-semibold">Quote terbaru</h2><Link href="/admin/quotes" className="text-sm">Semua quote</Link></div>
                  {ops.latestQuotes.length ? <ul className="m-0 grid list-none gap-3 p-0">{ops.latestQuotes.map((item) => <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-3"><div><p className="m-0 text-sm font-medium">{item.reference}</p><p className="mb-0 mt-1 text-xs text-[#71717a]">{time(item.createdAt)}</p></div><span className="text-xs text-[#52525b]">{item.status}</span></li>)}</ul> : <p className="m-0 text-sm text-[#71717a]">Belum ada quote.</p>}
                </div>
              </section>
            </>
          ) : <p className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-[#52525b]">Ringkasan operasional klien hanya tersedia untuk owner.</p>}
        </>
      ) : null}
    </AdminFrame>
  );
}
