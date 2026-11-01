import type { ReactNode } from "react";
import { AdminHeader, AdminSidebar } from "./AdminShell";

export function AdminFrame({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="screen admin-screen relative flex min-h-screen w-full flex-col bg-[#f9f9f9]">
      <AdminSidebar />
      <div className="flex min-h-screen w-full flex-col lg:pl-[288px]">
        <AdminHeader />
        <main
          id="konten"
          className="mx-auto w-full max-w-[1920px] flex-1 px-4 pb-12 pt-20 sm:px-6 lg:px-8"
        >
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[.08em] text-[#71717a]">
                Admin / OpenByte Labs
              </p>
              <h1 className="m-0 text-2xl font-semibold tracking-[-.5px] text-[#18181a]">
                {title}
              </h1>
              <p className="mb-0 mt-2 max-w-3xl text-sm leading-5 text-[#52525b]">
                {description}
              </p>
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
