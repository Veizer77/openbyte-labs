import { notFound, redirect } from "next/navigation";
import { AdminSupportingPage } from "@/components/admin/AdminSupportingPage";
import { AdminServicesPage } from "@/components/admin/AdminServicesPage";
import { AdminProjectsPage } from "@/components/admin/AdminProjectsPage";
import { AdminMediaPage } from "@/components/admin/AdminMediaPage";
import { AdminTaxonomyPage } from "@/components/admin/AdminTaxonomyPage";
import {
  AdminBookingPage,
  AdminInquiryPage,
  AdminQuotePage,
} from "@/components/admin/AdminOperationsPages";
import { getAdminPrincipal } from "@/auth/session";
import { AdminTrackingPage } from "@/components/admin/AdminTrackingPage";
import { authorize } from "@/access/rules";
import { AdminDashboardPage } from "@/components/admin/AdminDashboardPage";
import { AdminSettingsPage } from "@/components/admin/AdminSettingsPage";
import { AdminPagesManager } from "@/components/admin/AdminPagesManager";
import {
  AdminContentCollectionsPage,
  type ContentCollection,
} from "@/components/admin/AdminContentCollectionsPage";
import { AdminUsersPage, AdminAuditLogsPage } from "@/components/admin/AdminSystemPages";
import { AdminStepTemplatesPage } from "@/components/admin/AdminStepTemplatesPage";
import { AdminInvoicesPage } from "@/components/admin/AdminInvoicesPage";
import { AdminPrivateFilesPage } from "@/components/admin/AdminPrivateFilesPage";

const liveRoutes = new Set([
  "dashboard",
  "settings",
  "pages",
  "faqs",
  "testimonials",
  "packages",
  "addons",
  "users",
  "audit-logs",
  "template-tahap",
  "invoice",
  "berkas",
  "proyek-klien",
  "booking",
  "inquiry",
  "quotes",
  "layanan",
  "showcase",
  "kategori",
  "teknologi",
  "media",
  "kalkulator",
]);
const ownerRoutes = new Set([
  "proyek-klien",
  "booking",
  "inquiry",
  "quotes",
  "template-tahap",
  "invoice",
  "berkas",
  "users",
  "audit-logs",
]);
export const dynamic = "force-dynamic";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const path = (await params).path?.join("/") ?? "";
  if (path && !liveRoutes.has(path)) notFound();

  const principal = await getAdminPrincipal();
  if (!principal) redirect("/admin/login");

  if (!path) redirect("/admin/dashboard");
  if (ownerRoutes.has(path) && principal.role !== "owner") notFound();
  if (path === "dashboard") return <AdminDashboardPage />;
  if (path === "settings") return <AdminSettingsPage />;
  if (path === "pages") return <AdminPagesManager />;
  if (path === "faqs" || path === "testimonials" || path === "packages" || path === "addons")
    return <AdminContentCollectionsPage kind={path as ContentCollection} />;
  if (path === "users") return <AdminUsersPage />;
  if (path === "audit-logs") return <AdminAuditLogsPage />;
  if (path === "template-tahap") return <AdminStepTemplatesPage />;
  if (path === "invoice") return <AdminInvoicesPage />;
  if (path === "berkas") return <AdminPrivateFilesPage />;
  if (path === "proyek-klien") {
    authorize(principal, "client-projects", "read");
    return <AdminTrackingPage />;
  }
  if (path === "media") return <AdminMediaPage />;
  if (path === "kategori" || path === "teknologi")
    return <AdminTaxonomyPage />;
  if (path === "kalkulator")
    return <AdminSupportingPage kind="kalkulator" />;
  if (path === "layanan") return <AdminServicesPage />;
  if (path === "showcase") return <AdminProjectsPage />;
  if (path === "booking") return <AdminBookingPage />;
  if (path === "inquiry") return <AdminInquiryPage />;
  if (path === "quotes") return <AdminQuotePage />;
  notFound();
}
