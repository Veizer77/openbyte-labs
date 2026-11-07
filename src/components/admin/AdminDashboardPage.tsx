"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  readAdminDashboardAction,
  type AdminDashboardData,
} from "@/actions/admin/dashboard";
import { AdminFrame } from "./AdminFrame";
import { BentoCard, Chip, KpiCard, ToolbarButton } from "./AdminUi";

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

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
  const [leadTab, setLeadTab] = useState<"inquiry" | "quote">("inquiry");

  useEffect(() => {
    let active = true;
    void readAdminDashboardAction()
      .then((result) => {
        if (!active) return;
        if (result.ok) setData(result.data);
        else setError(result.message);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Ringkasan CMS tidak dapat dimuat.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const ops = data?.operations;
  const now = new Date();
  const monthName = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(now);
  const currentPeriod = `Bulan Ini (${monthName} ${now.getFullYear()})`;

  const headerActions = (
    <>
      <div className="flex items-center gap-1.5 rounded-[12px] border border-[#eaeaea] bg-white px-3 py-1.5 text-[13px] font-medium text-[#18181a] shadow-[0px_1px_2px_#0000000d]">
        <span className="symbol text-[18px] text-[#52525b]">calendar_month</span>
        <span>{currentPeriod}</span>
      </div>
      {ops ? (
        <ToolbarButton
          variant="dark"
          icon="add_circle"
          href="/admin/proyek-klien"
        >
          Proyek Baru
        </ToolbarButton>
      ) : (
        <ToolbarButton
          variant="dark"
          icon="add_circle"
          href="/admin/showcase"
        >
          Tambah Showcase
        </ToolbarButton>
      )}
    </>
  );

  return (
    <AdminFrame
      title="Dasbor Operasional & Analitik Agensi"
      description="Ringkasan performa bisnis, aktivitas klien, dan antrean yang membutuhkan tindakan."
      actions={headerActions}
    >
      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="rounded-[16px] border border-[#eaeaea] bg-white p-8 text-center text-sm text-[#71717a]">
          Memuat ringkasan dasbor…
        </div>
      ) : null}

      {data ? (
        <div className="flex flex-col gap-6">
          {/* Top KPI Bento Row */}
          <section
            aria-label="Metrik Utama"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4"
          >
            <KpiCard
              label="Portofolio Showcase"
              value={data.content.publishedProjects}
              subtext="Showcase aktif"
              icon="view_carousel"
              badgeType="success"
              href="/admin/showcase"
            />

            {ops ? (
              <>
                <KpiCard
                  label="Proyek Berjalan"
                  value={ops.activeClientProjects}
                  subtext={ops.activeProjectValue > 0 ? rupiah(ops.activeProjectValue) : "Aktif"}
                  icon="domain_verification"
                  badgeType="neutral"
                  href="/admin/proyek-klien"
                />

                {/* Signature Dark Bento Card from prototype */}
                <KpiCard
                  label="Booking Bulan Ini"
                  value={ops.bookingsThisMonth}
                  subtext="Konsultasi aktif"
                  icon="event_available"
                  badgeType="lime"
                  dark
                  href="/admin/booking"
                />

                <KpiCard
                  label="Inquiry Baru"
                  value={ops.newInquiries}
                  subtext={ops.newInquiries > 0 ? `${ops.newInquiries} butuh respon` : "Terjawab"}
                  icon="contact_mail"
                  badgeType={ops.newInquiries > 0 ? "warning" : "neutral"}
                  href="/admin/inquiry"
                />

                <KpiCard
                  label="Tiket Revisi"
                  value={ops.revisionsNeedingReview}
                  subtext={ops.revisionsNeedingReview > 0 ? "Perlu respon" : "Selesai"}
                  icon="pending_actions"
                  badgeType={ops.revisionsNeedingReview > 0 ? "danger" : "neutral"}
                  href="/admin/proyek-klien"
                />
              </>
            ) : (
              <>
                <KpiCard
                  label="Layanan Aktif"
                  value={data.content.activeServices}
                  subtext="Bento terbit"
                  icon="grid_view"
                  badgeType="neutral"
                  href="/admin/layanan"
                />
                <KpiCard
                  label="FAQ Aktif"
                  value={data.content.activeFaqs}
                  subtext="Katalog tayang"
                  icon="quiz"
                  badgeType="neutral"
                  href="/admin/faqs"
                />
                <KpiCard
                  label="Status Konten"
                  value="Live"
                  subtext="Siap tampil"
                  icon="tune"
                  badgeType="lime"
                  dark
                  href="/admin/settings"
                />
              </>
            )}
          </section>

          {/* Main Content Grid */}
          {ops ? (
            <>
              {ops.needsAction.length > 0 ? (
                <BentoCard>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="m-0 text-base font-semibold text-[#18181a]">
                        Perlu Tindakan
                      </h2>
                      <p className="m-0 mt-0.5 text-xs text-[#71717a]">
                        {ops.needsAction.length} hal menunggu, diurutkan dari yang paling lama.
                      </p>
                    </div>
                    <Chip variant="warning" size="sm">
                      {ops.needsAction.length}
                    </Chip>
                  </div>
                  <ul className="m-0 grid list-none gap-2 p-0">
                    {ops.needsAction.map((item) => (
                      <li key={`${item.kind}-${item.id}`}>
                        <a
                          href={item.href}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-[#eaeaea] bg-[#fcfcfc] px-3 py-2.5 text-xs no-underline transition-colors hover:border-[#18181a]"
                        >
                          <span className="min-w-0">
                            <span className="block font-semibold text-[#18181a]">
                              {item.label}
                            </span>
                            <span className="block text-[11px] text-[#71717a]">
                              {item.detail}
                            </span>
                          </span>
                          <span className="shrink-0 text-[11px] font-medium text-[#52525b]">
                            {item.ageDays > 0
                              ? `${item.ageDays} hari`
                              : "baru"}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </BentoCard>
              ) : null}

              <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-6 items-start">
              {/* Left Column: Proyek Klien & Permintaan Revisi */}
              <div className="flex flex-col gap-6">
                {/* Proyek & Klien Aktif Table Bento */}
                <BentoCard>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="m-0 text-base font-semibold text-[#18181a] flex items-center gap-2">
                        <span className="symbol text-[20px] text-[#52525b]">account_tree</span>
                        Proyek & Klien Aktif
                      </h2>
                      <p className="mt-0.5 text-xs text-[#71717a]">
                        Pipeline delivery &amp; status tahapan pengerjaan
                      </p>
                    </div>
                    <Link
                      href="/admin/proyek-klien"
                      className="text-xs font-medium text-[#18181a] hover:underline flex items-center gap-1"
                    >
                      Semua Proyek
                      <span className="symbol text-sm">arrow_forward</span>
                    </Link>
                  </div>

                  {ops.latestProjects && ops.latestProjects.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-[#eaeaea] text-[11px] font-medium uppercase tracking-[0.5px] text-[#71717a]">
                            <th className="py-2.5 px-3">Proyek & Klien</th>
                            <th className="py-2.5 px-3">Tahapan</th>
                            <th className="py-2.5 px-3">Sisa Revisi</th>
                            <th className="py-2.5 px-3">Status Finansial</th>
                            <th className="py-2.5 px-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ops.latestProjects.map((p) => {
                            const remaining = Math.max(0, p.revisionsIncluded - p.revisionsUsed);
                            const finStatus =
                              p.paymentStatus === "paid_off"
                                ? "Lunas"
                                : p.paymentStatus === "down_payment"
                                ? "DP Terbayar"
                                : "Belum Bayar";
                            const finVariant =
                              p.paymentStatus === "paid_off"
                                ? "success"
                                : p.paymentStatus === "down_payment"
                                ? "lime"
                                : "warning";

                            return (
                              <tr
                                key={p.id}
                                className="border-b border-[#f4f4f5] hover:bg-[#fafafa] transition-colors"
                              >
                                <td className="py-3 px-3">
                                  <div className="font-medium text-[#18181a]">{p.projectTitle}</div>
                                  <div className="text-xs text-[#71717a]">{p.clientName}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <Chip variant="neutral">Tahap {p.currentStep}</Chip>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="text-xs text-[#18181a] font-medium">
                                    {p.revisionsUsed} / {p.revisionsIncluded}
                                  </span>
                                  <span className="ml-1 text-[11px] text-[#71717a]">
                                    ({remaining} tersisa)
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="flex flex-col gap-0.5">
                                    <Chip variant={finVariant} size="sm">
                                      {finStatus}
                                    </Chip>
                                    <span className="text-[11px] text-[#71717a]">
                                      {rupiah(p.totalCost)}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <Link
                                    href="/admin/proyek-klien"
                                    className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-[#f0f0f0] text-[#18181a] hover:bg-[#18181a] hover:text-white transition-colors"
                                    title="Buka Proyek"
                                  >
                                    <span className="symbol text-sm">open_in_new</span>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-[12px] bg-[#f9f9f9] p-6 text-center text-sm text-[#71717a]">
                      Belum ada proyek klien aktif.
                      <div className="mt-2">
                        <Link
                          href="/admin/proyek-klien"
                          className="text-xs font-medium text-[#18181a] underline"
                        >
                          Buat proyek klien pertama
                        </Link>
                      </div>
                    </div>
                  )}
                </BentoCard>

                {/* Permintaan Revisi Menunggu Tindakan */}
                <BentoCard>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="m-0 text-base font-semibold text-[#18181a]">
                          Permintaan Revisi & Approval
                        </h2>
                        {ops.revisions.length > 0 ? (
                          <Chip variant="warning">{ops.revisions.length} Menunggu</Chip>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-xs text-[#71717a]">
                        Tiket revisi deliverable yang diajukan oleh klien
                      </p>
                    </div>
                    <Link
                      href="/admin/proyek-klien"
                      className="text-xs font-medium text-[#18181a] hover:underline"
                    >
                      Semua Tiket
                    </Link>
                  </div>

                  {ops.revisions.length > 0 ? (
                    <div className="flex flex-col gap-2.5">
                      {ops.revisions.map((rev) => (
                        <div
                          key={rev.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[12px] border border-[#eaeaea] bg-[#fafafa] p-3.5 hover:bg-white transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-[#18181a]">
                                {rev.title}
                              </span>
                              <Chip variant="warning" size="sm">
                                {rev.status}
                              </Chip>
                            </div>
                            <div className="mt-1 text-xs text-[#71717a]">
                              {rev.projectTitle} · Diajukan {time(rev.submittedAt)}
                            </div>
                          </div>
                          <Link
                            href="/admin/proyek-klien"
                            className="inline-flex items-center justify-center rounded-[8px] bg-[#18181a] px-3 py-1.5 text-xs font-medium text-white hover:bg-black transition-colors self-start sm:self-center"
                          >
                            Tinjau Revisi
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[12px] bg-[#f9f9f9] p-6 text-center text-sm text-[#71717a]">
                      <span className="symbol text-2xl text-[#82b440] block mb-1">
                        check_circle
                      </span>
                      Semua permintaan revisi telah diproses.
                    </div>
                  )}
                </BentoCard>
              </div>

              {/* Right Column: Booking, Leads, & Quick Actions */}
              <div className="flex flex-col gap-6">
                {/* Booking Konsultasi Terbaru */}
                <BentoCard>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="m-0 text-base font-semibold text-[#18181a] flex items-center gap-2">
                      <span className="symbol text-[20px] text-[#52525b]">calendar_today</span>
                      Booking Konsultasi Terbaru
                    </h2>
                    <Link
                      href="/admin/booking"
                      className="text-xs font-medium text-[#18181a] hover:underline"
                    >
                      Lihat Semua
                    </Link>
                  </div>

                  {ops.latestBookings.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {ops.latestBookings.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between gap-2 border-b border-[#f4f4f5] pb-2.5 pt-1 last:border-0 last:pb-0"
                        >
                          <div>
                            <div className="text-sm font-medium text-[#18181a]">{b.name}</div>
                            <div className="text-xs text-[#71717a]">
                              {b.reference} · {time(b.slotStart)}
                            </div>
                          </div>
                          <Chip
                            variant={
                              b.status === "confirmed"
                                ? "success"
                                : b.status === "cancelled"
                                ? "danger"
                                : "neutral"
                            }
                            size="sm"
                          >
                            {b.status}
                          </Chip>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="m-0 text-xs text-[#71717a] text-center py-4">
                      Belum ada antrean booking konsultasi.
                    </p>
                  )}
                </BentoCard>

                {/* Inquiry & Quote Tabs */}
                <BentoCard>
                  <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#eaeaea] pb-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setLeadTab("inquiry")}
                        className={`text-xs font-medium pb-1 transition-colors ${
                          leadTab === "inquiry"
                            ? "border-b-2 border-[#18181a] text-[#18181a] font-semibold"
                            : "text-[#71717a] hover:text-[#18181a]"
                        }`}
                      >
                        Inquiry ({ops.latestInquiries.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setLeadTab("quote")}
                        className={`text-xs font-medium pb-1 transition-colors ${
                          leadTab === "quote"
                            ? "border-b-2 border-[#18181a] text-[#18181a] font-semibold"
                            : "text-[#71717a] hover:text-[#18181a]"
                        }`}
                      >
                        Quote ({ops.latestQuotes.length})
                      </button>
                    </div>
                    <Link
                      href={leadTab === "inquiry" ? "/admin/inquiry" : "/admin/quotes"}
                      className="text-xs font-medium text-[#18181a] hover:underline"
                    >
                      Detail
                    </Link>
                  </div>

                  {leadTab === "inquiry" ? (
                    ops.latestInquiries.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {ops.latestInquiries.map((inq) => (
                          <div
                            key={inq.id}
                            className="flex items-center justify-between gap-2 border-b border-[#f4f4f5] pb-2 last:border-0 last:pb-0"
                          >
                            <div>
                              <div className="text-xs font-semibold text-[#18181a]">{inq.name}</div>
                              <div className="text-[11px] text-[#71717a]">
                                {inq.reference} · {time(inq.createdAt)}
                              </div>
                            </div>
                            <Chip variant={inq.status === "new" ? "warning" : "neutral"} size="sm">
                              {inq.status}
                            </Chip>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="m-0 text-xs text-[#71717a] text-center py-4">
                        Tidak ada inquiry baru.
                      </p>
                    )
                  ) : ops.latestQuotes.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {ops.latestQuotes.map((q) => (
                        <div
                          key={q.id}
                          className="flex items-center justify-between gap-2 border-b border-[#f4f4f5] pb-2 last:border-0 last:pb-0"
                        >
                          <div>
                            <div className="text-xs font-semibold text-[#18181a]">{q.reference}</div>
                            <div className="text-[11px] text-[#71717a]">{time(q.createdAt)}</div>
                          </div>
                          <Chip variant={q.status === "new" ? "warning" : "neutral"} size="sm">
                            {q.status}
                          </Chip>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="m-0 text-xs text-[#71717a] text-center py-4">
                      Tidak ada permohonan quote kalkulator baru.
                    </p>
                  )}
                </BentoCard>

                {/* Aksi Cepat Admin Bento */}
                <BentoCard>
                  <h2 className="mb-3 mt-0 text-base font-semibold text-[#18181a] flex items-center gap-2">
                    <span className="symbol text-[20px] text-[#f97316]">bolt</span>
                    Aksi Cepat Admin
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/admin/settings"
                      className="flex flex-col gap-1 rounded-[12px] border border-[#eaeaea] p-3 text-left hover:bg-[#fafafa] hover:border-[#18181a] transition-all"
                    >
                      <span className="symbol text-[20px] text-[#18181a]">tune</span>
                      <span className="text-xs font-semibold text-[#18181a]">Site Settings</span>
                      <span className="text-[10px] text-[#71717a]">SEO &amp; WhatsApp</span>
                    </Link>

                    <Link
                      href="/admin/layanan"
                      className="flex flex-col gap-1 rounded-[12px] border border-[#eaeaea] p-3 text-left hover:bg-[#fafafa] hover:border-[#18181a] transition-all"
                    >
                      <span className="symbol text-[20px] text-[#18181a]">grid_view</span>
                      <span className="text-xs font-semibold text-[#18181a]">Layanan Bento</span>
                      <span className="text-[10px] text-[#71717a]">Manajemen paket</span>
                    </Link>

                    <Link
                      href="/admin/template-tahap"
                      className="flex flex-col gap-1 rounded-[12px] border border-[#eaeaea] p-3 text-left hover:bg-[#fafafa] hover:border-[#18181a] transition-all"
                    >
                      <span className="symbol text-[20px] text-[#18181a]">checklist</span>
                      <span className="text-xs font-semibold text-[#18181a]">Template Tahap</span>
                      <span className="text-[10px] text-[#71717a]">Milestone delivery</span>
                    </Link>

                    <Link
                      href="/admin/users"
                      className="flex flex-col gap-1 rounded-[12px] border border-[#eaeaea] p-3 text-left hover:bg-[#fafafa] hover:border-[#18181a] transition-all"
                    >
                      <span className="symbol text-[20px] text-[#18181a]">manage_accounts</span>
                      <span className="text-xs font-semibold text-[#18181a]">Manajemen Staf</span>
                      <span className="text-[10px] text-[#71717a]">Role &amp; 2FA</span>
                    </Link>
                  </div>
                  </BentoCard>
                </div>
              </div>
            </>
          ) : (
            /* Editor view when ops is null */
            <BentoCard>
              <div className="py-4 text-center">
                <span className="symbol text-3xl text-[#52525b] mb-2 block">admin_panel_settings</span>
                <h3 className="m-0 text-base font-semibold text-[#18181a]">Mode Editor Konten</h3>
                <p className="mt-1 text-sm text-[#71717a] max-w-md mx-auto">
                  Anda memiliki akses untuk mengelola konten website seperti portofolio showcase, layanan bento, dan FAQ. Operasional klien hanya dapat diakses oleh peran Owner.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Link
                    href="/admin/showcase"
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#18181a] px-3.5 py-2 text-xs font-medium text-white hover:bg-black transition-colors"
                  >
                    <span className="symbol text-sm">view_carousel</span>
                    Kelola Showcase
                  </Link>
                  <Link
                    href="/admin/layanan"
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#f0f0f0] px-3.5 py-2 text-xs font-medium text-[#18181a] hover:bg-[#e4e4e7] transition-colors"
                  >
                    <span className="symbol text-sm">grid_view</span>
                    Kelola Layanan
                  </Link>
                </div>
              </div>
            </BentoCard>
          )}
        </div>
      ) : null}
    </AdminFrame>
  );
}
