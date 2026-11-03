import type { ReactNode } from "react";
import { AdminHeader, AdminSidebar } from "./AdminShell";

export function AdminFrame({
  title,
  description,
  actions,
  children,
  screenKey = "cms/dashboard-cms-admin",
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
  screenKey?: string;
}) {
  return (
    <div
      data-screen={screenKey}
      className="screen admin-screen relative flex min-h-screen w-full flex-col bg-[#f9f9f9]"
    >
      <AdminSidebar />
      <div className="flex min-h-screen w-full flex-col lg:pl-[288px]">
        <AdminHeader />
        <main
          id="konten"
          className="mx-auto w-full max-w-[1920px] flex-1 px-4 pb-12 pt-20 sm:px-6 lg:px-8"
        >
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <nav className="mb-1 flex items-center gap-1.5 text-[11px] font-medium tracking-[0.22px] text-[#52525b]">
                <span>OpenByte Labs</span>
                <span className="text-[#a1a1aa]">/</span>
                <span className="text-[#18181a]">{title}</span>
              </nav>
              <h1 className="m-0 text-[26px] sm:text-[28px] font-semibold tracking-[-0.7px] text-[#18181a] leading-tight">
                {title}
              </h1>
              <p className="mb-0 mt-1 max-w-3xl text-sm leading-5 text-[#52525b]">
                {description}
              </p>
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
