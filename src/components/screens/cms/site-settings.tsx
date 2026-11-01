"use client";

// Ported from prototype/stitch/cms/site-settings.html. Prototype remains read-only.
import { useEffect, useState, useRef } from "react";
import { ReferenceImage } from "@/components/public/ReferenceImage";
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import {
  UiAction,
  EditableField,
  ScreenState,
} from "@/components/preview/Controls";
import { usePreview } from "@/components/preview/PreviewProvider";
import {
  readSettingsAction,
  updateSettingsAction,
} from "@/actions/admin/settings";

type GeneralSettings = {
  brandName: string;
  logoId: string | null;
  faviconId: string | null;
  whatsappNumber: string;
  contactEmail: string;
  address: string;
  socialLinks: Array<{ label: string; url: string }>;
};

export default function CmsSiteSettings() {
  const { notify } = usePreview();
  const [activeTab, setActiveTab] = useState("Umum & Brand");
  const [selectedWaTemplate, setSelectedWaTemplate] = useState<number>(1);
  const [durasiKonsultasi, setDurasiKonsultasi] = useState(120);
  const [bufferSesi, setBufferSesi] = useState(30);
  const [masaGaransi, setMasaGaransi] = useState(0);
  const [sesiTracking, setSesiTracking] = useState(0);
  const [bruteForceLimit, setBruteForceLimit] = useState(5);
  const [cookieNoticeActive, setCookieNoticeActive] = useState(false);
  const [consentRequired, setConsentRequired] = useState(true);
  const [encryptLogs, setEncryptLogs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generalSettings, setGeneralSettings] =
    useState<GeneralSettings | null>(null);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(true);
  const [generalError, setGeneralError] = useState("");
  const [generalStatus, setGeneralStatus] = useState("");
  const [policyText, setPolicyText] = useState(
    "Draf kebijakan. Ruang lingkup, jumlah revisi, penanganan bug, masa dukungan, biaya, dan proses serah terima perlu ditetapkan tertulis untuk setiap proyek sebelum dipublikasikan."
  );
  const policyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let active = true;
    void readSettingsAction("general")
      .then((result) => {
        if (!active) return;
        if (!result.ok) {
          setGeneralError(result.message);
          return;
        }
        setGeneralSettings(result.data as GeneralSettings);
        setGeneralError("");
      })
      .catch(() => {
        if (active)
          setGeneralError("Pengaturan identitas tidak dapat dimuat.");
      })
      .finally(() => {
        if (active) setIsLoadingGeneral(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function saveGeneralSettings() {
    if (!generalSettings || isSaving) return;
    setIsSaving(true);
    setGeneralError("");
    setGeneralStatus("");
    try {
      const result = await updateSettingsAction({
        section: "general",
        value: generalSettings,
      });
      if (!result.ok) {
        setGeneralError(result.message);
        return;
      }
      setGeneralSettings(result.data as GeneralSettings);
      setGeneralStatus("Identitas dan kontak berhasil disimpan.");
      notify("Identitas dan kontak berhasil disimpan.");
    } catch {
      setGeneralError("Pengaturan identitas tidak dapat disimpan.");
    } finally {
      setIsSaving(false);
    }
  }

  const applyFormat = (syntaxPrefix: string, syntaxSuffix: string = syntaxPrefix, defaultPlaceholder: string = "teks") => {
    if (!policyRef.current) return;
    const textarea = policyRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = policyText.substring(start, end) || defaultPlaceholder;
    const updated = policyText.substring(0, start) + syntaxPrefix + selected + syntaxSuffix + policyText.substring(end);
    setPolicyText(updated);
    notify(`Format ${syntaxPrefix} diterapkan pada teks editor.`);
  };

  const settingsTabs = [
    { id: "sec-brand", label: "Umum & Brand" },
    { id: "sec-hero", label: "Hero & Beranda" },
    { id: "sec-whatsapp", label: "WhatsApp Templates" },
    { id: "sec-pricing", label: "Kalkulator & Pricing" },
    { id: "sec-booking", label: "Booking & Jadwal" },
    { id: "sec-tracking", label: "Tracking & Revisi" },
    { id: "sec-legal", label: "Legal & UU PDP" },
  ];

  const waTemplates = [
    {
      id: 1,
      code: "whatsapp.calculator",
      title: "1. Template Estimasi Kalkulator",
      vars: "5 Variabel Digunakan",
      statusColor: "#82b440",
      content:
        "Halo OpenByte Labs, saya {nama} ingin menindaklanjuti estimasi proyek berdasarkan kalkulator:\n\n- Rincian: {rincian}\n- Estimasi: {estimasi_harga}\n- Durasi: {estimasi_durasi}\n- Referensi: {referensi}\n\nMohon informasi langkah selanjutnya. Terima kasih!",
    },
    {
      id: 2,
      code: "whatsapp.booking_confirm",
      title: "2. Template Konfirmasi Booking Konsultasi",
      vars: "4 Variabel Digunakan",
      statusColor: "#82b440",
      content:
        "Draf konfirmasi konsultasi untuk {nama}. Jadwal dan tautan pertemuan hanya dikirim setelah dikonfirmasi oleh pengelola.",
    },
    {
      id: 3,
      code: "whatsapp.tracking_link",
      title: "3. Template Akses Tracking Proyek Klien",
      vars: "4 Variabel Digunakan",
      statusColor: "#82b440",
      content:
        "Draf pemberitahuan tracking untuk {nama_klien}. Jangan kirim token atau tautan sampai portal, akses, dan persetujuan proyek diverifikasi.",
    },
    {
      id: 4,
      code: "whatsapp.revision_notice",
      title: "4. Notifikasi Tiket Revisi Tahap",
      vars: "3 Variabel Digunakan",
      statusColor: "#f97316",
      content:
        "Draf pemberitahuan revisi untuk proyek {nama_proyek}. Waktu respons, kuota, biaya, dan status hanya mengikuti kesepakatan tertulis.",
    },
  ];

  return (
    <ScreenState screen={"cms/site-settings"}>
      <div
        className={
          "box-border w-full min-h-screen bg-[#f9f9f9] relative screen admin-screen flex flex-col"
        }
        data-pencil-name={"CMS / 05 - Site Settings"}
        data-screen={"cms/site-settings"}
        id="konten"
        tabIndex={-1}
      >
        <AdminSidebar />
        <div
          className={
            "box-border w-full min-h-screen flex flex-col lg:pl-[288px] relative z-0"
          }
          data-pencil-name={"div"}
          data-layout="canvas-content"
        >
          <AdminHeader />
          <main
            className={
              "box-border w-full h-fit flex flex-col gap-0 pt-16 bg-[#f9f9f9] relative z-0 flex-1"
            }
            data-pencil-name={"main"}
          >
            <div
              className={
                "box-border w-full max-w-[1920px] mx-auto flex flex-col gap-0 justify-start items-start"
              }
              data-pencil-name={"div"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col sm:flex-row gap-4 p-4 sm:p-6 justify-between items-start sm:items-center bg-[#ffffff]"
                }
                data-pencil-name={"div"}
                data-responsive="row"
                data-section-padding="true"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[4px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                >
                  <nav
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-[4px] justify-start items-center"
                    }
                    data-pencil-name={"nav"}
                  >
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Admin"}
                      data-text="true"
                    >
                      {"Admin"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"/"}
                      data-text="true"
                    >
                      {"/"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Konten Website"}
                      data-text="true"
                    >
                      {"Konten Website"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"/"}
                      data-text="true"
                    >
                      {"/"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Site Settings"}
                      data-text="true"
                    >
                      {"Site Settings"}
                    </div>
                  </nav>
                  <div
                    className={
                      "box-border w-[675.81px] h-[78px] shrink-0 flex flex-col gap-0 p-[2px_0px_0px_0px] justify-start items-start mobile-auto-height"
                    }
                    data-pencil-name={"div"}
                    data-responsive="fixed"
                  >
                    <h1
                      className={
                        "text-[28px]/[36px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.7px] text-left [white-space:nowrap] m-0"
                      }
                      data-pencil-name={"Site Settings & Konfigurasi Global"}
                      data-text="true"
                      data-heading="true"
                    >
                      {"Site Settings & Konfigurasi Global"}
                    </h1>
                    <div
                      className={
                        "box-border w-full h-[40px] shrink-0 flex flex-col gap-0 p-[4px_0px_0px_0px] justify-center items-start"
                      }
                      data-pencil-name={
                        "Pengaturan terpusat untuk teks brand, no"
                      }
                    >
                      <div
                        className={
                          "text-[13px]/[18px] box-border w-[675.81px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left"
                        }
                        data-text="true"
                        data-responsive="fixed"
                      >
                        {
                          "Kelola teks brand dan konfigurasi. Ketentuan privasi, kontak, harga, dukungan, dan publikasi perlu ditinjau sebelum digunakan."
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-[408.19px] shrink-0 h-fit flex flex-col gap-[8px] justify-start items-start"
                  }
                  data-pencil-name={"div"}
                  data-responsive="fixed"
                >
                  <div
                    className={
                      "box-border w-fit h-fit shrink-0 flex flex-row gap-[6.01px] p-[6px_12px] justify-start items-center bg-[#f0f0f0] rounded-[9999px]"
                    }
                    data-pencil-name={"div"}
                  >
                    <div
                      className={
                        "box-border w-[6px] shrink-0 h-[6px] opacity-[0.5] bg-[#82b440] rounded-[50%]"
                      }
                      data-pencil-name={"span"}
                    ></div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Auto-Cache Clean"}
                      data-text="true"
                    >
                      {"Auto-Cache Clean"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"On Save Active"}
                      data-text="true"
                    >
                      {"On Save Active"}
                    </div>
                  </div>
                  <UiAction
                    label={"Simpan Identitas & Kontak"}
                    disabled={isSaving || isLoadingGeneral || !generalSettings}
                    aria-busy={isSaving || isLoadingGeneral}
                    onClick={saveGeneralSettings}
                    className={
                      "box-border w-fit h-[38px] shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-[8px] p-[10px_20px] justify-start items-center bg-[#18181a] hover:bg-neutral-800 transition-colors rounded-[12px] cursor-pointer"
                    }
                    data-pencil-name={"button"}
                  >
                    <div
                      className={
                        "text-[18px]/[18px] box-border text-[#ffffff] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"save"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {isSaving ? "sync" : "save"}
                    </div>
                    <div
                      className={
                        "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                      }
                      data-pencil-name={"Simpan Identitas & Kontak"}
                      data-text="true"
                    >
                      {isLoadingGeneral
                        ? "Memuat..."
                        : isSaving
                          ? "Menyimpan..."
                          : "Simpan Identitas & Kontak"}
                    </div>
                  </UiAction>
                  <div className="text-xs" aria-live="polite">
                    {generalError ? (
                      <span role="alert" className="text-red-700">
                        {generalError}
                      </span>
                    ) : generalStatus ? (
                      <span className="text-green-800">{generalStatus}</span>
                    ) : isLoadingGeneral ? (
                      <span className="text-[#52525b]">
                        Memuat identitas dan kontak...
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-0 px-4 sm:px-6 lg:px-8 pt-4 pb-2 justify-start items-start bg-[#f9f9f9] overflow-x-auto"
                }
                data-pencil-name={"div"}
                data-section-padding="true"
              >
                <nav
                  className={
                    "box-border w-fit max-w-full h-[40px] shrink-0 flex flex-row gap-[4px] p-[4px] justify-start items-center bg-[#F4F4F5] rounded-[12px] overflow-x-auto"
                  }
                  data-pencil-name={"nav"}
                >
                  {settingsTabs.map((tab) => (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.label);
                        const el = document.getElementById(tab.id);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={`box-border w-fit shrink-0 h-[32px] flex flex-row gap-0 px-3.5 justify-center items-center rounded-[8px] cursor-pointer transition-all ${
                        activeTab === tab.label
                          ? "bg-[#18181A] text-[#FFFFFF] shadow-sm font-semibold"
                          : "bg-transparent text-[#52525B] hover:bg-neutral-200/60 font-medium"
                      }`}
                      data-pencil-name={tab.label}
                    >
                      <span className="text-[13px] whitespace-nowrap">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-4 sm:p-6 lg:p-8 justify-start items-start"
                }
                data-pencil-name={"div"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
                  }
                  data-pencil-name={"div"}
                  data-responsive="row"
                  data-section-padding="true"
                >
                  <div
                    className={
                      "box-border xl:col-span-8 flex flex-col gap-6 justify-start items-start w-full h-auto"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                    data-section-padding="true"
                  >
                    <section
                      className={
                        "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[20px] p-[24px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                      }
                      data-pencil-name={"section"}
                      data-section-padding="true"
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[12px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[20px]/[20px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"corporate_fare"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"corporate_fare"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-[40.75px] flex flex-col gap-0 justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[18px]/[25px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Identitas Brand & Kontak Resmi"
                              }
                              data-text="true"
                            >
                              {"Identitas Brand & Kontak Resmi"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Konfigurasi representasi digital publik,"
                              }
                              data-text="true"
                            >
                              {
                                "Konfigurasi representasi digital publik, kontak primer, dan visual signature."
                              }
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_8px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                          }
                          data-pencil-name={"PRD 8.5 Identity"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"PRD 8.5 Identity"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[20px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                        data-section-padding="true"
                      >
                        <div
                          className={
                            "box-border w-full h-[98px] shrink-0 flex flex-row gap-[20px] justify-start items-start mobile-auto-height"
                          }
                          data-responsive="row"
                          data-section-padding="true"
                        >
                          <div
                            className={
                              "box-border [flex:1_1_0] h-[98px] flex flex-col gap-[6px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Nama Brand / Legal *"}
                              data-text="true"
                            >
                              {"Nama Brand / Legal *"}
                            </div>
                            <EditableField
                              label={
                                "Nama brand OpenByte Labs"
                              }
                              initialValue={"OpenByte Labs"}
                              value={generalSettings?.brandName ?? ""}
                              onValueChange={(brandName) =>
                                setGeneralSettings((current) =>
                                  current ? { ...current, brandName } : current,
                                )
                              }
                              disabled={
                                isLoadingGeneral || isSaving || !generalSettings
                              }
                              className={
                                "box-border w-full h-[40px] shrink-0 [box-shadow:inset_0px_2px_4px_#0000000d] flex flex-col gap-0 p-[10px_14px] justify-center items-start bg-[#f0f0f0] rounded-[12px] overflow-hidden"
                              }
                              data-pencil-name={"OpenByte Labs"}
                            />
                            <div
                              className={
                                "text-[11px]/[14px] box-border w-full h-[28px] shrink-0 text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={
                                "Ditampilkan pada navbar utama, footer co"
                              }
                              data-text="true"
                            >
                              {
                                "Ditampilkan pada navbar utama, footer copyright, dan dokumen PDF invoice."
                              }
                            </div>
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-[98px] flex flex-col gap-[6px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Sub-brand & Spesialisasi *"}
                              data-text="true"
                            >
                              {"Sub-brand & Spesialisasi *"}
                            </div>
                            <EditableField
                              label={
                                "Sub-brand & Spesialisasi * Software Engineer & System Specialist Mempengaruhi meta-title SEO dan sub"
                              }
                              initialValue={
                                "Layanan perangkat lunak"
                              }
                              className={
                                "box-border w-full h-[40px] shrink-0 [box-shadow:inset_0px_2px_4px_#0000000d] flex flex-col gap-0 p-[10px_14px] justify-center items-start bg-[#f0f0f0] rounded-[12px] overflow-hidden"
                              }
                              data-pencil-name={
                                "Layanan perangkat lunak"
                              }
                            />
                            <div
                              className={
                                "text-[11px]/[14px] box-border w-full h-[28px] shrink-0 text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={
                                "Mempengaruhi meta-title SEO dan subtitle"
                              }
                              data-text="true"
                            >
                              {
                                "Mempengaruhi meta-title SEO dan subtitle header public portal."
                              }
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-[98px] shrink-0 flex flex-row gap-[20px] justify-start items-start mobile-auto-height"
                          }
                          data-responsive="row"
                          data-section-padding="true"
                        >
                          <div
                            className={
                              "box-border [flex:1_1_0] h-[98px] flex flex-col gap-[6px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "box-border w-full h-[18px] shrink-0 flex flex-row gap-0 justify-between items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"WhatsApp Gateway Utama *"}
                                data-text="true"
                              >
                                {"WhatsApp Gateway Utama *"}
                              </div>
                              <div
                                className={
                                  "box-border w-[109.23px] shrink-0 h-[14px] flex flex-row gap-[4px] justify-start items-center"
                                }
                                data-pencil-name={"span"}
                                data-responsive="fixed"
                              >
                                <div
                                  className={
                                    "text-[12px]/[12px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                  }
                                  data-pencil-name={"check_circle"}
                                  data-text="true"
                                  aria-hidden="true"
                                >
                                  {"check_circle"}
                                </div>
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                  }
                                  data-pencil-name={"Auto-Normalized"}
                                  data-text="true"
                                >
                                  {"Auto-Normalized"}
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start relative"
                              }
                              data-pencil-name={"div"}
                            >
                              <EditableField
                                label={"Nomor WhatsApp belum dikonfigurasi"}
                                initialValue={""}
                                value={generalSettings?.whatsappNumber ?? ""}
                                onValueChange={(whatsappNumber) =>
                                  setGeneralSettings((current) =>
                                    current
                                      ? { ...current, whatsappNumber }
                                      : current,
                                  )
                                }
                                disabled={
                                  isLoadingGeneral || isSaving || !generalSettings
                                }
                                className={
                                  "box-border w-full h-[40px] shrink-0 [box-shadow:inset_0px_2px_4px_#0000000d] flex flex-col gap-0 p-[10px_14px] justify-center items-start bg-[#f0f0f0] rounded-[12px] overflow-hidden relative [z-index:0]"
                                }
                                data-pencil-name={"Belum dikonfigurasi"}
                              />
                              <div
                                className={
                                  "box-border w-fit h-fit absolute left-[166.67px] top-[10px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#ffffff] rounded-[4px] [z-index:1]"
                                }
                                data-pencil-name={"Belum dikonfigurasi"}
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                  {"Belum dikonfigurasi"}
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border w-full h-[28px] shrink-0 text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={
                                "Input '08...' diubah otomatis ke format "
                              }
                              data-text="true"
                            >
                              {
                                "Input '08...' diubah otomatis ke format internasional tanpa '+'. Digunakan untuk semua link wa.me."
                              }
                            </div>
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-[98px] flex flex-col gap-[6px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Email Kontak Resmi *"}
                              data-text="true"
                            >
                              {"Email Kontak Resmi *"}
                            </div>
                            <EditableField
                              label={
                                "Email kontak belum dikonfigurasi"
                              }
                              initialValue={""}
                              value={generalSettings?.contactEmail ?? ""}
                              onValueChange={(contactEmail) =>
                                setGeneralSettings((current) =>
                                  current
                                    ? { ...current, contactEmail }
                                    : current,
                                )
                              }
                              disabled={
                                isLoadingGeneral || isSaving || !generalSettings
                              }
                              className={
                                "box-border w-full h-[40px] shrink-0 [box-shadow:inset_0px_2px_4px_#0000000d] flex flex-col gap-0 p-[10px_14px] justify-center items-start bg-[#f0f0f0] rounded-[12px] overflow-hidden"
                              }
                              data-pencil-name={"Belum dikonfigurasi"}
                            />
                            <div
                              className={
                                "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <div
                                className={
                                  "text-[14px]/[14px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                                }
                                data-pencil-name={"info"}
                                data-text="true"
                                aria-hidden="true"
                              >
                                {"info"}
                              </div>
                              <div
                                className={
                                  "text-[11px]/[14px] box-border w-[310.67px] shrink-0 h-[28px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                                }
                                data-pencil-name={
                                  "Hanya ditampilkan sebagai kontak resmi, "
                                }
                                data-text="true"
                                data-responsive="fixed"
                              >
                                {
                                  "Hanya ditampilkan sebagai kontak resmi, sistem tidak mengirim email otomatis."
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        id="sec-hero"
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[20px] p-[8px_0px_0px_0px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                        data-section-padding="true"
                      >
                        <div
                          className={
                            "box-border [flex:1_1_0] h-fit flex flex-row gap-[12px] p-[12px] justify-start items-center bg-[#f0f0f0] rounded-[12px]"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-0 p-[5px] justify-center items-center bg-[#ffffff] [border:1px_solid_#eaeaea] rounded-[12px] overflow-hidden"
                            }
                            data-pencil-name={"div"}
                          >
                            <ReferenceImage
                              src={
                                "/images/OpenByte%20Labs%20Tech%20Logo-1.png"
                              }
                              alt={"OpenByte Labs"}
                              contain={true}
                              className={
                                "box-border w-[110px] shrink-0 h-[28px]  bg-no-repeat bg-contain bg-center"
                              }
                              data-pencil-name={"img"}
                            />
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-fit flex flex-col gap-[4px] justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Official Brand Logo (OpenByte Labs)"
                              }
                              data-text="true"
                            >
                              {"Official Brand Logo (OpenByte Labs)"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "SVG Vektor Primer • 512x512px • Transpar"
                              }
                              data-text="true"
                            >
                              {
                                "Asset Resmi • 1589x413px • Mode High-Contrast Transparan"
                              }
                            </div>
                            <div
                              className={"box-border w-full h-[8px] shrink-0"}
                              data-pencil-name={"spacer"}
                            ></div>
                            <div
                              className={
                                "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <UiAction
                                label={"Ganti File Logo"}
                                onClick={() => notify("Pilih file logo baru (SVG/PNG transparan 512x512px).")}
                                className={
                                  "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-center bg-[#ffffff] hover:bg-neutral-100 transition-colors border border-neutral-200 rounded-[8px] cursor-pointer"
                                }
                                data-pencil-name={"Ganti File"}
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                  {"Ganti File"}
                                </div>
                              </UiAction>
                              <UiAction
                                label={"Hapus Logo"}
                                onClick={() => notify("Logo brand direset ke konfigurasi default OpenByte Labs.")}
                                className={
                                  "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-center hover:bg-neutral-200/60 transition-colors rounded-[8px] cursor-pointer"
                                }
                                data-pencil-name={"Hapus"}
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                  {"Hapus"}
                                </div>
                              </UiAction>
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border [flex:1_1_0] h-[118px] flex flex-row gap-[12px] p-[12px] justify-start items-center bg-[#f0f0f0] rounded-[12px] mobile-auto-height"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-fit [box-shadow:0px_1px_2px_#0000000d] flex flex-row gap-0 p-[4px] justify-center items-center bg-[#18181a] rounded-[12px] overflow-hidden"
                            }
                            data-pencil-name={"div"}
                          >
                            <ReferenceImage
                              src={"/images/5f9e6a2ac345b8dc.png"}
                              alt={"OpenByte Labs"}
                              contain={true}
                              className={
                                "box-border w-[48px] shrink-0 h-[48px]  bg-no-repeat bg-contain bg-center rounded-[8px]"
                              }
                              data-pencil-name={"img"}
                            />
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-[76px] flex flex-col gap-0 justify-start items-start"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Favicon Web & App Icon"}
                              data-text="true"
                            >
                              {"Favicon Web & App Icon"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border w-full h-[28px] shrink-0 text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                              }
                              data-pencil-name={
                                "ICO / PNG Dual Format • Multi-resolusi 3"
                              }
                              data-text="true"
                            >
                              {
                                "ICO / PNG Dual Format • Multi-resolusi 32-192px"
                              }
                            </div>
                            <div
                              className={"box-border w-full h-[8px] shrink-0"}
                              data-pencil-name={"spacer"}
                            ></div>
                            <div
                              className={
                                "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <UiAction
                                label={"Upload Favicon Baru"}
                                onClick={() => notify("Pilih file favicon baru (format ICO / PNG multi-resolusi).")}
                                className={
                                  "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_10px] justify-center items-center bg-[#ffffff] hover:bg-neutral-100 transition-colors border border-neutral-200 rounded-[8px] cursor-pointer"
                                }
                                data-pencil-name={"Upload Baru"}
                              >
                                <div
                                  className={
                                    "text-[11px]/[14px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-center [white-space:nowrap]"
                                  }
                                  data-text="true"
                                >
                                  {"Upload Baru"}
                                </div>
                              </UiAction>
                              <div
                                className={
                                  "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Sinkronisasi belum diverifikasi"}
                                data-text="true"
                              >
                                {"Sinkronisasi belum diverifikasi"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section
                      id="sec-whatsapp"
                      className={
                        "box-border w-full h-fit shrink-0 [box-shadow:0px_10px_12px_#0000001a,_0px_4px_2px_#0000001a] flex flex-col gap-[20px] p-[24px] justify-start items-start bg-[#18181a] rounded-[16px] overflow-hidden relative"
                      }
                      data-pencil-name={"section"}
                      data-section-padding="true"
                    >
                      <div
                        className={
                          "box-border w-[288px] h-[288px] [filter:blur(32px)] absolute left-[521.33px] top-[-80px] bg-[#e1e89c0d] rounded-[50%] [z-index:0]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="fixed"
                      ></div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-between items-center relative [z-index:1]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#242427] rounded-[12px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[20px]/[20px] box-border text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"quick_reference"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"quick_reference"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-[40px] flex flex-col gap-0 justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[18px]/[24px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Template Pesan WhatsApp Otomatis"
                              }
                              data-text="true"
                            >
                              {"Template Pesan WhatsApp Otomatis"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Sistem pesan terenkripsi URL untuk deleg"
                              }
                              data-text="true"
                            >
                              {
                                "Sistem pesan terenkripsi URL untuk delegasi aksi cepat via nomor gateway."
                              }
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[4px_10px] justify-start items-center bg-[#242427] rounded-[9999px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-[6px] shrink-0 h-[6px] bg-[#e2e89d] rounded-[50%]"
                            }
                            data-pencil-name={"span"}
                          ></div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Lampiran A Syntax"}
                            data-text="true"
                          >
                            {"Lampiran A Syntax"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-[66px] shrink-0 bg-[#242427b3] rounded-[12px] relative [z-index:2]"
                        }
                        data-pencil-name={"div"}
                        data-responsive="flow"
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border absolute left-[12px] top-[14px] text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap] [z-index:0]"
                          }
                          data-pencil-name={"VARIABEL TERSEDIA:"}
                          data-text="true"
                        >
                          {"VARIABEL TERSEDIA:"}
                        </div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[144.41px] top-[12px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#18181a] rounded-[4px] [z-index:1]"
                          }
                          data-pencil-name={"{nama}"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#e2e89d] font-[SFMono-Regular,system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"{nama}"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[204.02px] top-[12px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#18181a] rounded-[4px] [z-index:2]"
                          }
                          data-pencil-name={"{rincian}"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#e2e89d] font-[SFMono-Regular,system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"{rincian}"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[282.44px] top-[12px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#18181a] rounded-[4px] [z-index:3]"
                          }
                          data-pencil-name={"{estimasi_harga}"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#e2e89d] font-[SFMono-Regular,system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"{estimasi_harga}"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[404.73px] top-[12px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#18181a] rounded-[4px] [z-index:4]"
                          }
                          data-pencil-name={"{estimasi_durasi}"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#e2e89d] font-[SFMono-Regular,system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"{estimasi_durasi}"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[533.3px] top-[12px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#18181a] rounded-[4px] [z-index:5]"
                          }
                          data-pencil-name={"{tanggal}"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#e2e89d] font-[SFMono-Regular,system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"{tanggal}"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[611.72px] top-[12px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#18181a] rounded-[4px] [z-index:6]"
                          }
                          data-pencil-name={"{jam}"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#e2e89d] font-[SFMono-Regular,system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"{jam}"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[12px] top-[36px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#18181a] rounded-[4px] [z-index:7]"
                          }
                          data-pencil-name={"{meeting_url}"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#e2e89d] font-[SFMono-Regular,system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"{meeting_url}"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit h-fit absolute left-[115.48px] top-[36px] flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#18181a] rounded-[4px] [z-index:8]"
                          }
                          data-pencil-name={"{kode_tracking}"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#e2e89d] font-[SFMono-Regular,system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"{kode_tracking}"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start relative [z-index:3]"
                        }
                        data-pencil-name={"div"}
                      >
                        {waTemplates.map((tmpl) => {
                          const isExpanded = selectedWaTemplate === tmpl.id;
                          return (
                            <div
                              key={tmpl.id}
                              className={
                                "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-0 justify-start items-start bg-[#242427] rounded-[12px] overflow-hidden"
                              }
                            >
                              <button
                                type="button"
                                onClick={() => setSelectedWaTemplate(isExpanded ? 0 : tmpl.id)}
                                className={
                                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[14px_12px] justify-between items-center text-left cursor-pointer hover:bg-[#2c2c31] transition-colors"
                                }
                                aria-label={tmpl.title}
                              >
                                <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center">
                                  <div
                                    className="box-border w-[8px] shrink-0 h-[8px] rounded-[50%]"
                                    style={{ backgroundColor: tmpl.statusColor }}
                                  />
                                  <div className="flex flex-row items-center gap-3">
                                    <span className="text-[13px]/[18px] text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-semibold">
                                      {tmpl.title}
                                    </span>
                                    <span className="text-[11px]/[14px] text-[#a8a8ad] font-[SFMono-Regular,system-ui,sans-serif] font-medium tracking-[0.22px] hidden sm:inline">
                                      {tmpl.code}
                                    </span>
                                  </div>
                                </div>
                                <div className="box-border w-fit shrink-0 h-[18px] flex flex-row gap-[8px] justify-start items-center">
                                  <span className="text-[11px]/[14px] text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px]">
                                    {tmpl.vars}
                                  </span>
                                  <span className="text-[18px]/[18px] text-[#a8a8ad] font-['Material_Symbols_Outlined',system-ui,sans-serif] symbol">
                                    {isExpanded ? "expand_less" : "expand_more"}
                                  </span>
                                </div>
                              </button>
                              {isExpanded && (
                                <div className="box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[0px_12px_12px_12px] justify-start items-start">
                                  <div className="box-border w-full h-auto min-h-[90px] flex flex-col gap-0 p-[12px] justify-center items-start bg-[#18181a] rounded-[8px] overflow-hidden">
                                    <div className="text-[12px]/[20px] box-border text-[#ffffff] font-[SFMono-Regular,system-ui,sans-serif] font-normal tracking-[0.12px] text-left whitespace-pre-wrap">
                                      {tmpl.content}
                                    </div>
                                  </div>
                                  <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
                                    <div className="text-[11px]/[14px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left">
                                      {"URL encode test: %E2%80%A2 valid"}
                                    </div>
                                    <UiAction
                                      label={`Uji Format URL WA - ${tmpl.code}`}
                                      onClick={() => notify(`Menguji tautan WhatsApp (${tmpl.code}): URL berhasil di-generate dan siap dikirim.`)}
                                      className="box-border w-fit h-[24px] flex flex-row gap-1 px-2 items-center cursor-pointer hover:bg-[#18181a] rounded-[6px] transition-colors"
                                    >
                                      <span className="text-[14px]/[14px] text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] symbol">
                                        play_circle
                                      </span>
                                      <span className="text-[11px]/[14px] text-[#e2e89d] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px]">
                                        Uji Format URL WA
                                      </span>
                                    </UiAction>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div
                        className={
                          "box-border w-full h-[76px] shrink-0 bg-[#242427] rounded-[12px] relative [z-index:4] mobile-auto-height"
                        }
                        data-pencil-name={"div"}
                        data-responsive="absolute-layout"
                      >
                        <div
                          className={
                            "text-[20px]/[20px] box-border absolute left-[12px] top-[14px] text-[#e2e89d] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] [z-index:0] symbol"
                          }
                          data-pencil-name={"verified"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"verified"}
                        </div>
                        <div
                          className={
                            "box-border w-[625.33px] h-[52px] absolute left-[44px] top-[12px] flex flex-col gap-[2px] justify-start items-start [z-index:1] mobile-auto-height"
                          }
                          data-pencil-name={"div"}
                          data-responsive="fixed"
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Validasi Sintaks Dinamis"}
                            data-text="true"
                          >
                            {"Validasi Sintaks Dinamis"}
                          </div>
                          <div
                            className={
                              "text-[12px]/[16px] box-border w-full h-[32px] shrink-0 text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                            }
                            data-pencil-name={
                              "Variabel dinamis divalidasi otomatis saa"
                            }
                            data-text="true"
                          >
                            {
                              "Variabel dinamis divalidasi otomatis saat disimpan guna mencegah format pesan rusak saat diarahkan ke WhatsApp Web maupun WhatsApp App Android/iOS."
                            }
                          </div>
                        </div>
                      </div>
                    </section>
                    <section
                      className={
                        "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[20px] p-[24px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                      }
                      data-pencil-name={"section"}
                      data-section-padding="true"
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-start"
                        }
                        data-pencil-name={"div"}
                        data-responsive="row"
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-[12px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border w-[40px] shrink-0 h-[40px] flex flex-row gap-0 justify-center items-center bg-[#f0f0f0] rounded-[12px]"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[20px]/[20px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"tune"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"tune"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-[40.75px] flex flex-col gap-0 justify-start items-start"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[18px]/[25px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.18px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Parameter Booking & Regulasi Operasional"
                              }
                              data-text="true"
                            >
                              {"Parameter Booking & Regulasi Operasional"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Konfigurasi batasan durasi konsultasi, j"
                              }
                              data-text="true"
                            >
                              {
                                "Konfigurasi batasan durasi konsultasi, jeda waktu kalender, dan perimeter sesi aman."
                              }
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[4px_8px] justify-center items-start bg-[#e2e89d] rounded-[4px]"
                          }
                          data-pencil-name={"Engine v1.1"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Engine v1.1"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-full h-[100px] shrink-0 flex flex-row gap-[12px] justify-start items-start mobile-auto-height"
                          }
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border [flex:1_1_0] h-[100px] flex flex-col gap-[8px] p-[14px] justify-between items-start bg-[#f0f0f0] rounded-[12px]"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"DURASI KONSULTASI"}
                              data-text="true"
                            >
                              {"DURASI KONSULTASI"}
                            </div>
                            <div
                              className={
                                "box-border w-full h-[28px] shrink-0 flex flex-row items-center gap-[8px]"
                              }
                              data-pencil-name={"div"}
                            >
                              <input
                                type="number"
                                min={15}
                                max={360}
                                step={15}
                                value={durasiKonsultasi}
                                onChange={(e) => setDurasiKonsultasi(Number(e.target.value))}
                                className="box-border w-[80px] h-[28px] text-[16px]/[20px] text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-semibold text-right p-[2px_8px] bg-[#ffffff] border border-neutral-300 rounded-[8px] outline-none focus:border-black"
                              />
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Menit / Sesi"}
                                data-text="true"
                              >
                                {"Menit / Sesi"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Google Meet auto-slot 2 jam"}
                              data-text="true"
                            >
                              {"Google Meet auto-slot 2 jam"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-[100px] flex flex-col gap-[8px] p-[14px] justify-between items-start bg-[#f0f0f0] rounded-[12px]"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"JEDA ANTAR SESI (BUFFER)"}
                              data-text="true"
                            >
                              {"JEDA ANTAR SESI (BUFFER)"}
                            </div>
                            <div
                              className={
                                "box-border w-full h-[28px] shrink-0 flex flex-row items-center gap-[8px]"
                              }
                              data-pencil-name={"div"}
                            >
                              <input
                                type="number"
                                min={0}
                                max={120}
                                step={5}
                                value={bufferSesi}
                                onChange={(e) => setBufferSesi(Number(e.target.value))}
                                className="box-border w-[80px] h-[28px] text-[16px]/[20px] text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-semibold text-right p-[2px_8px] bg-[#ffffff] border border-neutral-300 rounded-[8px] outline-none focus:border-black"
                              />
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Menit buffer"}
                                data-text="true"
                              >
                                {"Menit buffer"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "Waktu rehat & persiapan arsitektur"
                              }
                              data-text="true"
                            >
                              {"Waktu rehat & persiapan arsitektur"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border [flex:1_1_0] h-[100px] flex flex-col gap-[8px] p-[14px] justify-between items-start bg-[#f0f0f0] rounded-[12px]"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"MASA GARANSI (JIKA DISEPAKATI)"}
                              data-text="true"
                            >
                              {"MASA GARANSI (JIKA DISEPAKATI)"}
                            </div>
                            <div
                              className={
                                "box-border w-full h-[28px] shrink-0 flex flex-row items-center gap-[8px]"
                              }
                              data-pencil-name={"div"}
                            >
                              <input
                                type="number"
                                min={0}
                                max={365}
                                step={1}
                                value={masaGaransi}
                                onChange={(e) => setMasaGaransi(Number(e.target.value))}
                                className="box-border w-[80px] h-[28px] text-[16px]/[20px] text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-semibold text-right p-[2px_8px] bg-[#ffffff] border border-neutral-300 rounded-[8px] outline-none focus:border-black"
                              />
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Hari Kalender"}
                                data-text="true"
                              >
                                {"Hari Kalender"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Dukungan diatur tertulis per proyek"}
                              data-text="true"
                            >
                              {"Dukungan diatur tertulis per proyek"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-[100px] shrink-0 flex flex-row gap-[12px] justify-start items-start mobile-auto-height"
                          }
                          data-responsive="row"
                        >
                          <div
                            className={
                              "box-border [flex:1_1_0] h-[100px] flex flex-col gap-[8px] p-[14px] justify-between items-start bg-[#f0f0f0] rounded-[12px]"
                            }
                            data-pencil-name={"div"}
                            data-responsive="flow"
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                              }
                            data-pencil-name={"PORTAL TRACKING"}
                              data-text="true"
                            >
                            {"PORTAL TRACKING • NONAKTIF"}
                            </div>
                            <div
                              className={
                                "box-border w-full h-[28px] shrink-0 flex flex-row items-center gap-[8px]"
                              }
                              data-pencil-name={"div"}
                            >
                              <input
                                type="number"
                                min={15}
                                max={1440}
                                step={15}
                                value={sesiTracking}
                                onChange={(e) => setSesiTracking(Number(e.target.value))}
                                className="box-border w-[80px] h-[28px] text-[16px]/[20px] text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-semibold text-right p-[2px_8px] bg-[#ffffff] border border-neutral-300 rounded-[8px] outline-none focus:border-black"
                              />
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Menit Token"}
                                data-text="true"
                              >
                                {"Menit Token"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Auto-logout portal klien"}
                              data-text="true"
                            >
                              {"Auto-logout portal klien"}
                            </div>
                          </div>
                          <div
                            className={
                              "box-border w-[450.22px] shrink-0 h-[100px] flex flex-col gap-[8px] p-[14px] justify-between items-start bg-[#f0f0f0] rounded-[12px] mobile-auto-height"
                            }
                            data-pencil-name={"div"}
                            data-responsive="fixed"
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "KEAMANAN AKSES (BRUTE-FORCE GUARD)"
                              }
                              data-text="true"
                            >
                              {"KEAMANAN AKSES (BRUTE-FORCE GUARD)"}
                            </div>
                            <div
                              className={
                                "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center"
                              }
                              data-pencil-name={"div"}
                            >
                              <input
                                type="number"
                                min={3}
                                max={20}
                                step={1}
                                value={bruteForceLimit}
                                onChange={(e) => setBruteForceLimit(Number(e.target.value))}
                                className="box-border w-[64px] h-[28px] text-[16px]/[20px] text-[#18181a] font-[SFMono-Regular,system-ui,sans-serif] font-semibold text-right p-[2px_8px] bg-[#ffffff] border border-neutral-300 rounded-[8px] outline-none focus:border-black"
                              />
                              <div
                                className={
                                  "text-[13px]/[18px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"Kali Percobaan Gagal"}
                                data-text="true"
                              >
                                {"Kali Percobaan Gagal"}
                              </div>
                              <div
                                className={
                                  "text-[16px]/[24px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"/"}
                                data-text="true"
                              >
                                {"/"}
                              </div>
                              <div
                                className={
                                  "text-[12px]/[16px] box-border text-[#f97316] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.12px] text-left [white-space:nowrap]"
                                }
                                data-pencil-name={"15 Menit Lockout Klien"}
                                data-text="true"
                              >
                                {"15 Menit Lockout Klien"}
                              </div>
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={
                                "IP & Telepon yang gagal beruntun akan di"
                              }
                              data-text="true"
                            >
                              {
                                "IP & Telepon yang gagal beruntun akan diblokir sementara."
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[8px_0px_0px_0px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-full h-[18px] shrink-0 flex flex-row gap-0 justify-between items-center"
                          }
                          data-pencil-name={"div"}
                          data-responsive="row"
                        >
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "Kebijakan Revisi Proyek Standar (Klausul"
                            }
                            data-text="true"
                          >
                            {
                              "Kebijakan Revisi Proyek Standar (Klausul Lampiran C PRD v1.1)"
                            }
                          </div>
                          <div
                            className={
                              "box-border w-fit shrink-0 h-[14px] flex flex-row gap-[4px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={
                                "text-[14px]/[14px] box-border text-[#52525b] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"format_align_left"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"format_align_left"}
                            </div>
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Rich Text Markdown Rendering"}
                              data-text="true"
                            >
                              {"Rich Text Markdown Rendering"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-full h-[44px] shrink-0 bg-[#f0f0f0] rounded-[12px_12px_0px_0px] relative"
                          }
                          data-pencil-name={"div"}
                        >
                          <UiAction
                            label={"format_bold"}
                            onClick={() => applyFormat("**", "**", "teks tebal")}
                            className={
                              "box-border w-fit h-[32px] absolute left-[6px] top-[6px] flex flex-col gap-0 p-[6px_4px_10px_4px] justify-start items-start rounded-[4px] [z-index:0] hover:bg-[#e4e4e7]"
                            }
                            data-pencil-name={"button"}
                          >
                            <div
                              className={
                                "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"format_bold"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"format_bold"}
                            </div>
                          </UiAction>
                          <UiAction
                            label={"format_italic"}
                            onClick={() => applyFormat("*", "*", "teks miring")}
                            className={
                              "box-border w-fit h-[32px] absolute left-[34px] top-[6px] flex flex-col gap-0 p-[6px_4px_10px_4px] justify-start items-start rounded-[4px] [z-index:1] hover:bg-[#e4e4e7]"
                            }
                            data-pencil-name={"button"}
                          >
                            <div
                              className={
                                "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"format_italic"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"format_italic"}
                            </div>
                          </UiAction>
                          <UiAction
                            label={"format_underlined"}
                            onClick={() => applyFormat("<u>", "</u>", "garis bawah")}
                            className={
                              "box-border w-fit h-[32px] absolute left-[62px] top-[6px] flex flex-col gap-0 p-[6px_4px_10px_4px] justify-start items-start rounded-[4px] [z-index:2] hover:bg-[#e4e4e7]"
                            }
                            data-pencil-name={"button"}
                          >
                            <div
                              className={
                                "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"format_underlined"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"format_underlined"}
                            </div>
                          </UiAction>
                          <div
                            className={
                              "box-border w-[1px] h-[16px] absolute left-[94px] top-[14px] bg-[#c6c5c94d] [z-index:3]"
                            }
                            data-pencil-name={"span"}
                          ></div>
                          <UiAction
                            label={"format_list_bulleted"}
                            onClick={() => applyFormat("\n- ", "", "daftar")}
                            className={
                              "box-border w-fit h-[32px] absolute left-[103px] top-[6px] flex flex-col gap-0 p-[6px_4px_10px_4px] justify-start items-start rounded-[4px] [z-index:4] hover:bg-[#e4e4e7]"
                            }
                            data-pencil-name={"button"}
                          >
                            <div
                              className={
                                "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"format_list_bulleted"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"format_list_bulleted"}
                            </div>
                          </UiAction>
                          <UiAction
                            label={"format_list_numbered"}
                            onClick={() => applyFormat("\n1. ", "", "daftar urut")}
                            className={
                              "box-border w-fit h-[32px] absolute left-[131px] top-[6px] flex flex-col gap-0 p-[6px_4px_10px_4px] justify-start items-start rounded-[4px] [z-index:5] hover:bg-[#e4e4e7]"
                            }
                            data-pencil-name={"button"}
                          >
                            <div
                              className={
                                "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"format_list_numbered"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"format_list_numbered"}
                            </div>
                          </UiAction>
                          <div
                            className={
                              "box-border w-[1px] h-[16px] absolute left-[163px] top-[14px] bg-[#c6c5c94d] [z-index:6]"
                            }
                            data-pencil-name={"span"}
                          ></div>
                          <UiAction
                            label={"link"}
                            onClick={() => applyFormat("[", "](https://)", "teks tautan")}
                            className={
                              "box-border w-fit h-[32px] absolute left-[172px] top-[6px] flex flex-col gap-0 p-[6px_4px_10px_4px] justify-start items-start rounded-[4px] [z-index:7] hover:bg-[#e4e4e7]"
                            }
                            data-pencil-name={"button"}
                          >
                            <div
                              className={
                                "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"link"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"link"}
                            </div>
                          </UiAction>
                          <UiAction
                            label={"code"}
                            onClick={() => applyFormat("`", "`", "kode")}
                            className={
                              "box-border w-fit h-[32px] absolute left-[200px] top-[6px] flex flex-col gap-0 p-[6px_4px_10px_4px] justify-start items-start rounded-[4px] [z-index:8] hover:bg-[#e4e4e7]"
                            }
                            data-pencil-name={"button"}
                          >
                            <div
                              className={
                                "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                              }
                              data-pencil-name={"code"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {"code"}
                            </div>
                          </UiAction>
                          <div
                            className={
                              "box-border w-fit h-fit absolute left-[433.86px] top-[15px] flex flex-col gap-0 p-[0px_8px_0px_0px] justify-center items-start [z-index:9]"
                            }
                            data-pencil-name={
                              "Otomatis Terlampir di Portal Tracking Kl"
                            }
                          >
                            <div
                              className={
                                "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                              }
                              data-text="true"
                            >
                              {"Tracking nonaktif • tidak ada lampiran otomatis"}
                            </div>
                          </div>
                        </div>
                        <textarea
                          ref={policyRef}
                          value={policyText}
                          onChange={(e) => setPolicyText(e.target.value)}
                          rows={8}
                          className="box-border w-full min-h-[170px] shrink-0 [box-shadow:0px_1px_2px_#0000000d] p-[16px] text-[13px]/[22px] text-[#18181a] font-mono bg-[#ffffff] rounded-[0px_0px_12px_12px] border-0 outline-none resize-y focus:ring-1 focus:ring-neutral-400"
                        />
                      </div>
                    </section>
                  </div>
                  <div
                    className={
                      "box-border xl:col-span-4 flex flex-col gap-6 justify-start items-start w-full h-auto"
                    }
                    data-pencil-name={"div"}
                    data-responsive="flow"
                    data-section-padding="true"
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                      }
                      data-pencil-name={"div"}
                      data-section-padding="true"
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"STATUS PENYIMPANAN"}
                          data-text="true"
                        >
                          {"STATUS PENYIMPANAN"}
                        </div>
                        <div
                          className={
                            "box-border w-[91.41px] shrink-0 h-[14px] flex flex-row gap-[4px] justify-start items-center"
                          }
                          data-pencil-name={"span"}
                          data-responsive="fixed"
                        >
                          <div
                            className={
                              "box-border w-[8px] shrink-0 h-[8px] bg-[#82b440] rounded-[50%]"
                            }
                            data-pencil-name={"span"}
                          ></div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Status koneksi belum diverifikasi"}
                            data-text="true"
                          >
                            {"Status koneksi belum diverifikasi"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-[12px] p-[4px_0px_0px_0px] justify-start items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-[48px] shrink-0 h-[48px] flex flex-row gap-0 justify-center items-center bg-[#e2e89d] rounded-[12px]"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[24px]/[24px] box-border text-[#454a10] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"cloud_sync"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"cloud_sync"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[16px]/[20px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[-0.16px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Redis / Tagged Cache"}
                            data-text="true"
                          >
                            {"Redis / Tagged Cache"}
                          </div>
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Key: settings.global.v1"}
                            data-text="true"
                          >
                            {"Key: settings.global.v1"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[12px] justify-center items-start bg-[#f0f0f0] rounded-[12px]"
                        }
                        data-pencil-name={
                          "Menyimpan perubahan akan mengeksekusi Ca"
                        }
                      >
                        <div
                          className={
                            "text-[12px]/[16px] box-border w-[290.66px] text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left"
                          }
                          data-text="true"
                          data-responsive="fixed"
                        >
                          {
                            "Menyimpan perubahan akan mengeksekusi Cache::forget('site_settings') secara seketika di semua worker container."
                          }
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[4px_0px_0px_0px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <UiAction
                          label={"Purge Cache Manual"}
                          className={
                            "box-border w-full h-[34px] shrink-0 flex flex-row gap-[8px] p-[8px_12px] justify-center items-center bg-[#f0f0f0] rounded-[12px]"
                          }
                          data-pencil-name={"button"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"refresh"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"refresh"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                            }
                            data-pencil-name={"Purge Cache Manual"}
                            data-text="true"
                          >
                            {"Purge Cache Manual"}
                          </div>
                        </UiAction>
                        <UiAction
                          label={"Audit Trail Riwayat Pengubahan (7)"}
                          className={
                            "box-border w-full h-[34px] shrink-0 flex flex-row gap-[8px] p-[8px_12px] justify-center items-center bg-[#f0f0f0] rounded-[12px]"
                          }
                          data-pencil-name={"button"}
                        >
                          <div
                            className={
                              "text-[16px]/[16px] box-border text-[#18181a] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-center [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"history"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"history"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-medium text-center [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "Audit Trail Riwayat Pengubahan (7)"
                            }
                            data-text="true"
                          >
                            {"Audit Trail Riwayat Pengubahan (7)"}
                          </div>
                        </UiAction>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                      }
                      data-pencil-name={"div"}
                      data-section-padding="true"
                    >
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "box-border w-fit shrink-0 h-[18px] flex flex-row gap-[8px] justify-start items-center"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "text-[18px]/[18px] box-border text-[#82b440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"verified_user"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"verified_user"}
                          </div>
                          <div
                            className={
                              "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Tinjauan privasi dan pemrosesan data"}
                            data-text="true"
                          >
                            {"Tinjauan privasi dan pemrosesan data"}
                          </div>
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[2px_8px] justify-center items-start bg-[#f0f0f0] rounded-[4px]"
                          }
                            data-pencil-name={"Status kepatuhan belum diverifikasi"}
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#82b440] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-text="true"
                          >
                            {"Status kepatuhan belum diverifikasi"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[4px_0px_0px_0px] justify-start items-start"
                        }
                        data-pencil-name={"div"}
                      >
                        <button
                          type="button"
                          onClick={() => setCookieNoticeActive((v) => !v)}
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px] justify-between items-center bg-[#f0f0f0] hover:bg-[#e4e4e7] rounded-[12px] transition-colors cursor-pointer"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-[16px] flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={`text-[16px]/[16px] box-border ${cookieNoticeActive ? "text-[#82b440]" : "text-[#71717a]"} font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol`}
                              data-pencil-name={"check"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {cookieNoticeActive ? "check_circle" : "cancel"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Pemberitahuan Cookie Publik"}
                              data-text="true"
                            >
                              {"Pemberitahuan Cookie Publik"}
                            </div>
                          </div>
                          <div
                            className={`text-[11px]/[14px] box-border ${cookieNoticeActive ? "text-[#2e7d32] font-semibold" : "text-[#71717a] font-medium"} font-[var(--font-inter),system-ui,sans-serif] tracking-[0.22px] text-left [white-space:nowrap]`}
                            data-pencil-name={"Aktif"}
                            data-text="true"
                          >
                            {cookieNoticeActive ? "Aktif" : "Nonaktif"}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConsentRequired((v) => !v)}
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px] justify-between items-center bg-[#f0f0f0] hover:bg-[#e4e4e7] rounded-[12px] transition-colors cursor-pointer"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-[16px] flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={`text-[16px]/[16px] box-border ${consentRequired ? "text-[#82b440]" : "text-[#71717a]"} font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol`}
                              data-pencil-name={"check"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {consentRequired ? "check_circle" : "cancel"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Consent Data Kontak Klien"}
                              data-text="true"
                            >
                              {"Consent Data Kontak Klien"}
                            </div>
                          </div>
                          <div
                            className={`text-[11px]/[14px] box-border ${consentRequired ? "text-[#2e7d32] font-semibold" : "text-[#71717a] font-medium"} font-[var(--font-inter),system-ui,sans-serif] tracking-[0.22px] text-left [white-space:nowrap]`}
                            data-pencil-name={"Wajib Check"}
                            data-text="true"
                          >
                            {consentRequired ? "Wajib Check" : "Opsional"}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEncryptLogs((v) => !v)}
                          className={
                            "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[10px] justify-between items-center bg-[#f0f0f0] hover:bg-[#e4e4e7] rounded-[12px] transition-colors cursor-pointer"
                          }
                          data-pencil-name={"div"}
                        >
                          <div
                            className={
                              "box-border w-fit shrink-0 h-[16px] flex flex-row gap-[8px] justify-start items-center"
                            }
                            data-pencil-name={"div"}
                          >
                            <div
                              className={`text-[16px]/[16px] box-border ${encryptLogs ? "text-[#82b440]" : "text-[#71717a]"} font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol`}
                              data-pencil-name={"check"}
                              data-text="true"
                              aria-hidden="true"
                            >
                              {encryptLogs ? "check_circle" : "cancel"}
                            </div>
                            <div
                              className={
                                "text-[12px]/[16px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-normal tracking-[0.12px] text-left [white-space:nowrap]"
                              }
                              data-pencil-name={"Enkripsi Log Telepon"}
                              data-text="true"
                            >
                              {"Enkripsi Log Telepon"}
                            </div>
                          </div>
                          <div
                            className={`text-[11px]/[14px] box-border ${encryptLogs ? "text-[#2e7d32] font-semibold" : "text-[#71717a] font-medium"} font-[var(--font-inter),system-ui,sans-serif] tracking-[0.22px] text-left [white-space:nowrap]`}
                            data-pencil-name={"Status enkripsi pratinjau"}
                            data-text="true"
                          >
                            {encryptLogs ? "Aktif pada contoh • belum diverifikasi" : "Nonaktif pada contoh"}
                          </div>
                        </button>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] p-[12px] justify-start items-start bg-[#e1e89c4d] rounded-[12px]"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[0.55px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"KEBIJAKAN RETENSI DATA"}
                          data-text="true"
                        >
                          {"KEBIJAKAN RETENSI DATA"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[18px] box-border w-full h-[35.75px] shrink-0 text-[#454a10] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left"
                          }
                          data-pencil-name={
                            "Log tracking sesi klien dan pesan inquir"
                          }
                          data-text="true"
                        >
                          {
                            "Draf retensi log. Masa simpan dan penghapusan data perlu ditinjau sebelum ditetapkan."
                          }
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_2px_#0000000d] flex flex-col gap-[12px] p-[20px] justify-start items-start bg-[#ffffff] rounded-[16px]"
                      }
                      data-pencil-name={"div"}
                      data-section-padding="true"
                    >
                      <div
                        className={
                          "box-border w-full h-[18px] shrink-0 flex flex-row gap-0 justify-between items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[13px]/[18px] box-border text-[#18181a] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Visual Representation"}
                          data-text="true"
                        >
                          {"Visual Representation"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#595962] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"OpenGraph Tag"}
                          data-text="true"
                        >
                          {"OpenGraph Tag"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start rounded-[12px] overflow-hidden relative"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          aria-label={"Pratinjau OpenGraph belum tersedia"}
                          className={
                            "box-border w-[314.66px] h-[176px] shrink-0 bg-[#242427] relative [z-index:0]"
                          }
                          data-pencil-name={"Placeholder pratinjau OpenGraph"}
                        />
                        <div
                          className={
                            "box-border w-[315px] h-[176px] absolute left-0 top-0 flex flex-row gap-0 p-[12px] justify-start items-end [background-image:linear-gradient(0deg,_#18181acc_0%,_#00000000_50%,_#00000000_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1] mobile-auto-height"
                          }
                          data-pencil-name={"div"}
                          data-responsive="fixed"
                        >
                          <div
                            className={
                              "text-[11px]/[14px] box-border text-[#ffffff] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                            }
                            data-pencil-name={
                              "Pratinjau OpenGraph OpenByte Labs"
                            }
                            data-text="true"
                          >
                            {"Pratinjau OpenGraph OpenByte Labs"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[4px_0px_0px_0px] justify-between items-center"
                        }
                        data-pencil-name={"div"}
                      >
                        <div
                          className={
                            "text-[11px]/[14px] box-border text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-medium tracking-[0.22px] text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Resolusi rekomendasi: 1200x630px"}
                          data-text="true"
                        >
                          {"Resolusi rekomendasi: 1200x630px"}
                        </div>
                        <UiAction
                          label={"Ganti Gambar OG"}
                          className={
                            "text-[11px]/[14px] box-border text-[#18181a] hover:text-[#52525b] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.22px] text-center [white-space:nowrap] cursor-pointer"
                          }
                          data-pencil-name={"Ganti Gambar OG"}
                          data-text="true"
                        >
                          {"Ganti Gambar OG"}
                        </UiAction>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ScreenState>
  );
}
