"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAdminNavigationRoleAction } from "@/actions/admin/navigation";
import type { AdminRole } from "@/access/rules";

export const adminNavigation = [
  {
    label: "Ringkasan",
    items: [["dashboard", "Dashboard", "/admin/dashboard"]],
  },
  {
    label: "Konten Website",
    items: [
      ["tune", "Site Settings", "/admin/settings"],
      ["web", "Halaman", "/admin/pages"],
      ["grid_view", "Layanan", "/admin/layanan"],
      ["view_carousel", "Proyek Showcase", "/admin/showcase"],
      ["folder", "Kategori & Teknologi", "/admin/kategori"],
      ["sell", "Paket", "/admin/packages"],
      ["extension", "Add-on", "/admin/addons"],
      ["reviews", "Testimoni", "/admin/testimonials"],
      ["quiz", "FAQ", "/admin/faqs"],
      ["calculate", "Kalkulator", "/admin/kalkulator"],
      ["perm_media", "Media", "/admin/media"],
    ],
  },
  {
    label: "Operasional Klien",
    ownerOnly: true,
    items: [
      ["account_tree", "Proyek Klien & Tracking", "/admin/proyek-klien"],
      ["calendar_today", "Booking Konsultasi", "/admin/booking"],
      ["contact_mail", "Inquiry", "/admin/inquiry"],
      ["request_quote", "Quote Kalkulator", "/admin/quotes"],
      ["checklist", "Template Tahap", "/admin/template-tahap"],
      ["receipt_long", "Invoice & Penagihan", "/admin/invoice"],
    ],
  },
  {
    label: "Sistem",
    ownerOnly: true,
    items: [
      ["manage_accounts", "Pengguna & Staf", "/admin/users"],
      ["history", "Log Aktivitas", "/admin/audit-logs"],
      ["folder_lock", "Berkas Privat", "/admin/berkas"],
    ],
  },
] as const;

function Navigation() {
  const pathname = usePathname();
  const [role, setRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    let active = true;
    void getAdminNavigationRoleAction().then((result) => {
      if (active && result.ok) setRole(result.data);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Link
        href="/admin/showcase"
        aria-label="OpenByte Labs, proyek"
        className="block w-[193px] h-[49px] mb-4 bg-contain bg-left bg-no-repeat"
        style={{ backgroundImage: "url('/images/e72160f2d93da97a.png')" }}
      />
      <div className="pb-3 text-[11px] text-[#71717a]">
        CMS OpenByte Labs
      </div>
      {adminNavigation.map((group) => (
        ("ownerOnly" in group && group.ownerOnly && role !== "owner") ? null : (
        <div key={group.label} className="pt-3">
          <div className="text-[11px] tracking-[.55px] uppercase text-[#595962] p-1">
            {group.label}
          </div>
          <nav aria-label={group.label} className="flex flex-col gap-[2px]">
            {group.items.map(([icon, label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}
                className={`flex items-center gap-2 p-2 rounded-lg text-[13px] leading-[18px] min-h-[34px] ${pathname === href ? "bg-[#18181a] text-white" : "text-[#46464a] hover:bg-[#f0f0f0]"}`}
              >
                <span className="symbol text-[18px]" aria-hidden="true">
                  {icon}
                </span>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        )
      ))}
    </>
  );
}

export function AdminSidebar() {
  const mobile = useRef<HTMLDialogElement>(null);
  return (
    <>
      <aside
        data-pencil-name="aside"
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[288px] h-screen bg-white shadow-[0px_1px_8px_#0000000a] flex-col justify-between z-30 overflow-y-auto"
      >
        <div className="p-5">
          <Navigation />
        </div>
        <div className="p-5 text-[11px] text-[#52525b] bg-[#f0f0f066]">
          Next.js / React / TypeScript
        </div>
      </aside>
      <button
        className="mobile-menu-button"
        onClick={() => mobile.current?.showModal()}
        aria-label="Buka menu admin"
      >
        <span className="symbol" aria-hidden="true">
          menu
        </span>
        Menu
      </button>
      <dialog
        ref={mobile}
        className="ui-dialog mobile-admin-dialog"
        aria-label="Navigasi admin"
        onClick={(event) => {
          if (
            event.target === mobile.current ||
            (event.target as HTMLElement).closest("a")
          )
            mobile.current?.close();
        }}
      >
        <button
          className="float-right symbol p-2"
          onClick={() => mobile.current?.close()}
          aria-label="Tutup menu"
        >
          close
        </button>
        <Navigation />
      </dialog>
    </>
  );
}

export function AdminHeader() {
  return (
    <header
      data-pencil-name="header"
      className="admin-header fixed left-0 lg:left-[288px] top-0 right-0 w-full lg:w-[calc(100%-288px)] h-16 flex items-center justify-between px-4 sm:px-6 bg-[#ffffffe6] backdrop-blur-md shadow-[0px_1px_8px_#0000000a] z-20"
    >
      <span className="text-xs text-[#52525b]">Panel admin</span>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/" className="text-[13px] flex items-center gap-1 hover:text-black">
          <span className="hidden sm:inline">Lihat Website Publik</span>
          <span className="symbol text-base">north_east</span>
        </Link>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="text-[13px] flex items-center gap-1 hover:text-black">
            <span className="hidden sm:inline">Keluar</span>
            <span className="symbol text-base" aria-hidden="true">logout</span>
          </button>
        </form>
      </div>
    </header>
  );
}
