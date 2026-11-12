"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getAdminNavigationRoleAction,
  type AdminNavigationUser,
} from "@/actions/admin/navigation";
import type { ActionResult } from "@/actions/result";

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
      ["storefront", "Digital Store", "/admin/store"],
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

let cachedNavPromise: Promise<ActionResult<AdminNavigationUser>> | null = null;
function getCachedNav() {
  if (!cachedNavPromise) {
    cachedNavPromise = getAdminNavigationRoleAction();
  }
  return cachedNavPromise;
}

function Navigation({ user }: { user: AdminNavigationUser | null }) {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/admin/dashboard"
        aria-label="OpenByte Labs, dashboard"
        className="block w-[193px] h-[49px] mb-3 bg-contain bg-left bg-no-repeat"
        style={{ backgroundImage: "url('/images/e72160f2d93da97a.png')" }}
      />
      <div className="flex items-center gap-1.5 pb-3">
        <span className="rounded-[4px] bg-[#f0f0f0] px-2 py-0.5 text-[11px] font-medium tracking-[0.2px] text-[#18181a]">
          {user?.role === "owner" ? "Superadmin" : "Editor Konten"}
        </span>
        <span className="rounded-[4px] bg-[#e2e89d] px-2 py-0.5 text-[11px] font-medium tracking-[0.2px] text-[#454a10]">
          {user?.twoFactorVerified ? "MFA Aktif" : "MFA Belum Diverifikasi"}
        </span>
      </div>

      {adminNavigation.map((group) =>
        "ownerOnly" in group && group.ownerOnly && user?.role !== "owner" ? null : (
          <div key={group.label} className="pt-3">
            <div className="text-[11px] tracking-[.55px] uppercase font-medium text-[#595962] p-1">
              {group.label}
            </div>
            <nav aria-label={group.label} className="flex flex-col gap-[2px]">
              {group.items.map(([icon, label, href]) => {
                const isActive =
                  pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(`${href}/`));
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-2 p-2 rounded-lg text-[13px] leading-[18px] min-h-[34px] transition-colors ${
                      isActive
                        ? "bg-[#18181a] text-white font-medium"
                        : "text-[#46464a] hover:bg-[#f0f0f0]"
                    }`}
                  >
                    <span className="symbol text-[18px]" aria-hidden="true">
                      {icon}
                    </span>
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )
      )}
    </>
  );
}

export function AdminSidebar() {
  const mobile = useRef<HTMLDialogElement>(null);
  const [user, setUser] = useState<AdminNavigationUser | null>(null);

  useEffect(() => {
    let active = true;
    void getCachedNav().then((result) => {
      if (!active) return;
      if (result.ok) setUser(result.data);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <aside
        data-pencil-name="aside"
        className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[288px] h-screen bg-white border-r border-[#eaeaea] shadow-[0px_1px_8px_#0000000a] flex-col justify-between z-30 overflow-y-auto"
      >
        <div className="p-5">
          <Navigation user={user} />
        </div>
        <div className="p-4 text-[11px] text-[#52525b] bg-[#f0f0f066] border-t border-[#eaeaea]">
          <div className="font-medium text-[#18181a]">OpenByte Labs CMS</div>
          <div className="text-[10px] text-[#71717a] mt-0.5">Next.js · Drizzle · Better Auth</div>
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
        <Navigation user={user} />
      </dialog>
    </>
  );
}

export function AdminHeader() {
  const [user, setUser] = useState<AdminNavigationUser | null>(null);
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    void getCachedNav().then((result) => {
      if (!active) return;
      if (result.ok) setUser(result.data);
    });
    return () => {
      active = false;
    };
  }, []);

  const allItems = adminNavigation.flatMap((group) =>
    "ownerOnly" in group && group.ownerOnly && user?.role !== "owner"
      ? []
      : group.items.map(([icon, label, href]) => ({ icon, label, href, group: group.label }))
  );

  const filteredItems = search.trim()
    ? allItems.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.group.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <header
      data-pencil-name="header"
      className="admin-header fixed left-0 lg:left-[288px] top-0 right-0 w-full lg:w-[calc(100%-288px)] h-16 flex items-center justify-between px-4 sm:px-6 bg-[#ffffffe6] backdrop-blur-md border-b border-[#eaeaea] shadow-[0px_1px_8px_#0000000a] z-20"
    >
      <div className="relative hidden md:block">
        <div className="flex items-center gap-2 rounded-[8px] bg-[#f0f0f0] px-3 py-1.5 w-[360px] max-w-full text-[#595962]">
          <span className="symbol text-[18px]">search</span>
          <input
            type="search"
            placeholder="Cari data proyek, klien, booking, invoice..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            className="w-full bg-transparent text-[12px] text-[#18181a] placeholder-[#71717a] outline-none"
          />
          <kbd className="rounded border border-[#e4e4e7] bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#71717a] shadow-sm">
            ⌘K
          </kbd>
        </div>

        {isSearchOpen && filteredItems.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-full rounded-[12px] border border-[#eaeaea] bg-white p-2 shadow-lg z-50 max-h-64 overflow-y-auto">
            {filteredItems.map((item) => (
              <button
                key={item.href}
                type="button"
                onMouseDown={() => {
                  router.push(item.href);
                  setSearch("");
                  setIsSearchOpen(false);
                }}
                className="flex items-center gap-2 w-full p-2 text-left rounded-lg text-sm hover:bg-[#f0f0f0] text-[#18181a]"
              >
                <span className="symbol text-base text-[#71717a]">{item.icon}</span>
                <span className="flex-1 font-medium">{item.label}</span>
                <span className="text-[10px] uppercase text-[#71717a]">{item.group}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#f0f0f0] px-2.5 py-1 text-[11px] font-medium text-[#18181a]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#82b440]" />
          <span>PANEL CMS AKTIF</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-[13px] font-medium flex items-center gap-1 text-[#18181a] hover:text-[#5d6226] transition-colors"
        >
          <span className="hidden sm:inline">Lihat Website Publik</span>
          <span className="symbol text-base">north_east</span>
        </Link>

        <div className="hidden sm:block h-4 w-[1px] bg-[#eaeaea]" />

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[13px] font-medium leading-none text-[#18181a]">
              {user?.name || (user?.role === "owner" ? "Admin Owner" : "Editor Konten")}
            </span>
            <span className="text-[11px] capitalize leading-tight text-[#71717a]">
              {user?.role === "owner" ? "Superadmin" : "Editor"}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#18181a] text-white">
            <span className="symbol text-[18px]">person</span>
          </div>
        </div>

        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            title="Keluar"
            className="flex items-center p-1.5 text-[#71717a] hover:text-[#18181a] rounded-lg hover:bg-[#f0f0f0] transition-colors"
          >
            <span className="symbol text-[20px]" aria-hidden="true">
              logout
            </span>
            <span className="sr-only">Keluar</span>
          </button>
        </form>
      </div>
    </header>
  );
}
