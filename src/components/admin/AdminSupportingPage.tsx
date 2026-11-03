"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AdminFrame } from "./AdminFrame";
import { BentoCard, Chip, EmptyState, ToolbarButton } from "./AdminUi";
import {
  listCalculatorConfigAction,
  saveCalculatorConfigAction,
} from "@/actions/admin/calculator";
import {
  calculatorAdminConfigSchema,
  type CalculatorAdminConfig,
} from "@/schemas/calculator-admin";
import { rupiah } from "@/lib/format";
import { usePreview } from "@/components/preview/PreviewProvider";

type Kind = "halaman" | "media" | "kalkulator";
const titles: Record<Kind, string> = {
  halaman: "Halaman & Susunan Blok",
  media: "Media Library",
  kalkulator: "Kalkulator Builder",
};

const inputClass =
  "h-[38px] w-full rounded-[10px] bg-[#f0f0f0] px-3 text-xs text-[#18181a] placeholder-[#71717a] outline-none border border-transparent focus:border-[#18181a] transition-all";

function CalculatorBuilder() {
  const [groups, setGroups] = useState<CalculatorAdminConfig["groups"]>([]);
  const [items, setItems] = useState<CalculatorAdminConfig["items"]>([]);
  const [activeGroup, setActiveGroup] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const { notify } = usePreview();

  useEffect(() => {
    let active = true;
    void listCalculatorConfigAction()
      .then((result) => {
        if (!active) return;
        if (!result.ok) {
          setError(result.message);
          return;
        }
        const parsed = calculatorAdminConfigSchema.safeParse(result.data);
        if (!parsed.success) {
          setError("Konfigurasi kalkulator dari server tidak valid.");
          return;
        }
        setGroups(parsed.data.groups);
        setItems(parsed.data.items);
        setActiveGroup(parsed.data.groups[0]?.id ?? "");
      })
      .catch(() => {
        if (active) setError("Konfigurasi kalkulator tidak dapat dimuat.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const allItemIds = items.map((i) => ({ id: i.id, label: i.label }));

  const toggleRule = (
    itemId: string,
    relatedItemId: string,
    ruleType: "requires" | "excludes"
  ) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;
        const exists = item.rules.some(
          (rule) =>
            rule.ruleType === ruleType && rule.relatedItemId === relatedItemId
        );
        return {
          ...item,
          rules: exists
            ? item.rules.filter(
                (rule) =>
                  rule.ruleType !== ruleType ||
                  rule.relatedItemId !== relatedItemId
              )
            : [...item.rules, { relatedItemId, ruleType }],
        };
      })
    );
  };

  const addNewItem = () => {
    if (!activeGroup) return;
    const newItem = {
      id: crypto.randomUUID(),
      groupId: activeGroup,
      label: `Modul Baru (${activeGroup})`,
      description: "",
      pricingType: "flat" as const,
      unitLabel: null,
      maxUnits: null,
      priceMin: 500000,
      priceMax: 1500000,
      daysMin: 2,
      daysMax: 5,
      isDefault: false,
      isActive: true,
      sortOrder:
        Math.max(
          -1,
          ...items
            .filter((item) => item.groupId === activeGroup)
            .map((item) => item.sortOrder)
        ) + 1,
      rules: [],
    };
    setItems((prev) => [...prev, newItem]);
    notify("Item baru ditambahkan. Simpan konfigurasi untuk menerapkannya.");
  };

  const removeItem = (id: string) => {
    setItems((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          rules: item.rules.filter((rule) => rule.relatedItemId !== id),
        }))
    );
    notify("Item dihapus. Simpan konfigurasi untuk menerapkannya.");
  };

  const save = async () => {
    setIsSaving(true);
    setError("");
    setStatus("");
    try {
      const parsed = calculatorAdminConfigSchema.safeParse({ groups, items });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Konfigurasi tidak valid.");
        return;
      }
      const result = await saveCalculatorConfigAction(parsed.data);
      if (result.ok) {
        setStatus("Konfigurasi kalkulator estimasi berhasil disimpan.");
        notify("Konfigurasi kalkulator tersimpan.");
      } else {
        setError(result.message);
      }
    } catch {
      setError("Konfigurasi kalkulator gagal disimpan. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-5">
      {error ? (
        <div className="rounded-[12px] border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 flex items-center gap-2">
          <span className="symbol text-base">error</span>
          <span>{error}</span>
        </div>
      ) : null}
      {status ? (
        <div className="rounded-[12px] border border-green-200 bg-green-50 p-3.5 text-xs text-green-900 flex items-center gap-2">
          <span className="symbol text-base">check_circle</span>
          <span>{status}</span>
        </div>
      ) : null}

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-[14px] border border-[#eaeaea] bg-white p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#71717a]">Grup Kategori</div>
          <div className="text-2xl font-semibold text-[#18181a] mt-1">{groups.length}</div>
        </div>
        <div className="rounded-[14px] border border-[#eaeaea] bg-white p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#71717a]">Total Item Modul</div>
          <div className="text-2xl font-semibold text-[#18181a] mt-1">{items.length}</div>
        </div>
        <div className="rounded-[14px] border border-[#d6eed3] bg-[#eef8ed] p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-[#457c1d]">Item Modul Aktif</div>
          <div className="text-2xl font-semibold text-[#457c1d] mt-1">
            {items.filter((i) => i.isActive).length}
          </div>
        </div>
      </div>

      <BentoCard>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-[#eaeaea] pb-3">
          {/* Groups Pill Navigation */}
          <div className="flex flex-wrap gap-1.5">
            {groups.map((group) => {
              const isActive = activeGroup === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveGroup(group.id)}
                  className={`rounded-[8px] px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#18181a] text-white shadow-xs"
                      : "bg-[#f0f0f0] text-[#52525b] hover:bg-[#e4e4e7] hover:text-[#18181a]"
                  }`}
                >
                  {group.title}
                </button>
              );
            })}
          </div>

          <ToolbarButton
            variant="light"
            icon="add_circle"
            disabled={isLoading || !activeGroup}
            onClick={addNewItem}
          >
            Tambah Item Modul
          </ToolbarButton>
        </div>

        {isLoading ? (
          <p className="py-8 text-center text-xs text-[#71717a]">
            Memuat konfigurasi kalkulator…
          </p>
        ) : null}

        <div className="grid gap-3.5">
          {items
            .filter((item) => item.groupId === activeGroup)
            .map((item) => (
              <div
                key={item.id}
                className="rounded-[12px] border border-[#eaeaea] bg-[#fafafa] p-4 text-xs transition-all hover:border-[#18181a33]"
              >
                {/* Header item */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      value={item.label}
                      onChange={(e) =>
                        setItems((current) =>
                          current.map((v) =>
                            v.id === item.id
                              ? { ...v, label: e.target.value }
                              : v
                          )
                        )
                      }
                      className="font-semibold text-sm text-[#18181a] bg-transparent border-b border-transparent hover:border-[#eaeaea] focus:border-[#18181a] outline-none px-1"
                      placeholder="Nama modul kalkulator"
                    />
                    <span className="font-mono text-[10px] text-[#71717a] bg-[#f0f0f0] px-2 py-0.5 rounded">
                      {item.id.slice(0, 8)}…
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Chip variant="lime" size="sm">
                      {rupiah(item.priceMin)} - {rupiah(item.priceMax ?? item.priceMin)}
                    </Chip>
                    <ToolbarButton
                      variant="danger"
                      onClick={() => removeItem(item.id)}
                      icon="delete"
                    >
                      Hapus
                    </ToolbarButton>
                  </div>
                </div>

                {/* Price & Duration Grid */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(["priceMin", "priceMax", "daysMin", "daysMax"] as const).map(
                    (field) => (
                      <label key={field} className="grid gap-1 text-[11px] font-medium text-[#52525b]">
                        {
                          {
                            priceMin: "Harga Min (Rp)",
                            priceMax: "Harga Max (Rp)",
                            daysMin: "Hari Min",
                            daysMax: "Hari Max",
                          }[field]
                        }
                        <input
                          type="number"
                          min={0}
                          value={item[field] ?? ""}
                          onChange={(event) =>
                            setItems((current) =>
                              current.map((value) =>
                                value.id === item.id
                                  ? {
                                      ...value,
                                      [field]:
                                        event.target.value === ""
                                          ? field === "priceMax" ||
                                            field === "daysMax"
                                            ? null
                                            : 0
                                          : Math.max(
                                              0,
                                              Number(event.target.value)
                                            ),
                                    }
                                  : value
                              )
                            )
                          }
                          className={inputClass}
                        />
                      </label>
                    )
                  )}
                </div>

                {/* Dependency Rules: Requires & Excludes */}
                <div className="mt-3.5 grid sm:grid-cols-2 gap-3 pt-3 border-t border-[#eaeaea]">
                  {/* Requires */}
                  <div className="grid gap-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#18181a]">
                      <span className="flex items-center gap-1">
                        <span className="symbol text-sm text-[#82b440]">link</span>
                        Syarat Wajib (Requires):
                      </span>
                      <select
                        className="rounded-[6px] border border-[#eaeaea] bg-white px-2 py-1 text-[11px] outline-none"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            toggleRule(item.id, e.target.value, "requires");
                          }
                        }}
                      >
                        <option value="">+ Dependency</option>
                        {allItemIds
                          .filter((i) => i.id !== item.id)
                          .map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.label}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-1.5 rounded-[8px] bg-white p-2 border border-[#eaeaea] min-h-[32px]">
                      {item.rules.some((r) => r.ruleType === "requires") ? (
                        item.rules
                          .filter((r) => r.ruleType === "requires")
                          .map((rule) => {
                            const reqId = rule.relatedItemId;
                            const target = items.find((i) => i.id === reqId);
                            return (
                              <span
                                key={reqId}
                                className="inline-flex items-center gap-1 rounded bg-[#f0f0f0] px-2 py-0.5 text-[10px] text-[#18181a]"
                              >
                                {target?.label || reqId}
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleRule(item.id, reqId, "requires")
                                  }
                                  className="symbol text-xs text-[#71717a] hover:text-[#ba1a1a]"
                                >
                                  close
                                </button>
                              </span>
                            );
                          })
                      ) : (
                        <span className="text-[11px] text-[#a1a1aa] italic">
                          Tanpa syarat ketergantungan.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Excludes */}
                  <div className="grid gap-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#18181a]">
                      <span className="flex items-center gap-1">
                        <span className="symbol text-sm text-[#f97316]">block</span>
                        Saling Meniadakan (Excludes):
                      </span>
                      <select
                        className="rounded-[6px] border border-[#eaeaea] bg-white px-2 py-1 text-[11px] outline-none"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            toggleRule(item.id, e.target.value, "excludes");
                          }
                        }}
                      >
                        <option value="">+ Exclude</option>
                        {allItemIds
                          .filter((i) => i.id !== item.id)
                          .map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.label}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-1.5 rounded-[8px] bg-white p-2 border border-[#eaeaea] min-h-[32px]">
                      {item.rules.some((r) => r.ruleType === "excludes") ? (
                        item.rules
                          .filter((r) => r.ruleType === "excludes")
                          .map((rule) => {
                            const excId = rule.relatedItemId;
                            const target = items.find((i) => i.id === excId);
                            return (
                              <span
                                key={excId}
                                className="inline-flex items-center gap-1 rounded bg-[#fee2e2] px-2 py-0.5 text-[10px] text-[#991b1b]"
                              >
                                {target?.label || excId}
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleRule(item.id, excId, "excludes")
                                  }
                                  className="symbol text-xs text-[#991b1b] hover:text-[#ba1a1a]"
                                >
                                  close
                                </button>
                              </span>
                            );
                          })
                      ) : (
                        <span className="text-[11px] text-[#a1a1aa] italic">
                          Bebas dipilih bersamaan modul lain.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#eaeaea] pt-3.5">
          <span className="text-xs text-[#71717a]">
            Perubahan formula dan modul berlaku langsung pada widget kalkulator publik.
          </span>
          <ToolbarButton
            variant="dark"
            icon="save"
            disabled={isLoading || isSaving}
            onClick={() => void save()}
          >
            {isSaving ? "Menyimpan…" : "Simpan Konfigurasi Kalkulator"}
          </ToolbarButton>
        </div>
      </BentoCard>
    </div>
  );
}

export function AdminSupportingPage({ kind }: { kind: Kind }) {
  return (
    <AdminFrame
      title={titles[kind]}
      description="Konfigurasi modul kalkulator, batas rentang harga, estimasi durasi hari kerja, dan dependency rules."
      screenKey="cms/quote-kalkulator"
      actions={
        <div className="flex items-center gap-2">
          <ToolbarButton href="/kalkulator" variant="light" icon="open_in_new">
            Buka Kalkulator Publik
          </ToolbarButton>
        </div>
      }
    >
      <CalculatorBuilder />
    </AdminFrame>
  );
}
