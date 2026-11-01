"use client";

// Ported from prototype/stitch/cms/template-tahap.html. Prototype remains read-only.
import { useState } from "react";
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminShell";
import { UiAction, ScreenState } from "@/components/preview/Controls";

const blueprintList = [
  { id: "Web App MVP", name: "Web App MVP", badge: "Template draf" },
  { id: "Company Portal", name: "Company Portal", badge: "3 Tahap" },
  { id: "E-Commerce", name: "E-Commerce", badge: "5 Tahap" },
  { id: "Mobile Flutter", name: "Mobile Flutter", badge: "4 Tahap" },
];

export default function CmsTemplateTahap() {
  const [activeBlueprint, setActiveBlueprint] = useState("Web App MVP");
  return (
    <ScreenState screen={"cms/template-tahap"}>
      <div
        className={
          "box-border w-full min-h-screen flex flex-col bg-[#f9f9f9] relative screen admin-screen"
        }
        data-pencil-name={"CMS / 11 - Template Tahap"}
        data-screen={"cms/template-tahap"}
        id="konten"
        tabIndex={-1}
      >
        <AdminSidebar />
        <div
          className="box-border w-full min-h-screen flex flex-col lg:pl-[288px] relative z-0"
          data-layout="canvas-content"
        >
          <AdminHeader />
          <main
            className={
              "box-border w-full h-fit flex flex-col gap-[14px] pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto bg-[#f9f9f9] relative z-0 flex-1"
            }
            data-pencil-name={"main"}
            data-section-padding="true"
          >
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
            }
            data-pencil-name={"Page Header"}
          >
            <div
              className={
                "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
              }
              data-pencil-name={"Breadcrumb Row"}
              data-responsive="row"
            >
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Crumb 1"}
                data-text="true"
              >
                {"Admin"}
              </div>
              <div
                className={
                  "text-[14px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                }
                data-pencil-name={"Sep 1"}
                data-text="true"
                aria-hidden="true"
              >
                {"chevron_right"}
              </div>
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Crumb 2"}
                data-text="true"
              >
                {"Operasional Klien"}
              </div>
              <div
                className={
                  "text-[14px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                }
                data-pencil-name={"Sep 2"}
                data-text="true"
                aria-hidden="true"
              >
                {"chevron_right"}
              </div>
              <div
                className={
                  "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Crumb 3"}
                data-text="true"
              >
                {"Template Tahap & Milestone"}
              </div>
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-center bg-[#82B4401A] rounded-[4px]"
                }
                data-pencil-name={"Framework Tag"}
              >
                <div
                  className={
                    "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Tag Text"}
                  data-text="true"
                >
                  {"Template tahap • draf"}
                </div>
              </div>
            </div>
            <div
              className={
                "box-border w-full h-fit shrink-0 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
              }
              data-pencil-name={"Title & Actions"}
              data-responsive="row"
            >
              <div
                className={
                  "box-border flex-1 min-w-0 max-w-3xl h-fit flex flex-col gap-[4px] justify-start items-start"
                }
                data-pencil-name={"Title Column"}
              >
                <div
                  className={
                    "text-[22px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.3px] text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Page Title"}
                  data-text="true"
                >
                  {"Workflow & Milestone Stage Templates"}
                </div>
                <div
                  className={
                    "text-[13px]/[19px] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                  }
                  data-pencil-name={"Page Subtitle"}
                  data-text="true"
                >
                  {
                    "Draf template tahapan. Durasi, deliverable, dan fitur tracking harus disepakati serta dikonfigurasi per proyek."
                  }
                </div>
              </div>
              <UiAction
                label={
                  "Export Blueprint JSON Buat Template Baru Auto-Clone ke Klien"
                }
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                }
                data-pencil-name={"Header Buttons"}
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[8px_12px] justify-start items-center bg-[#FFFFFF] rounded-[8px]"
                  }
                  data-pencil-name={"Btn Export"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Export Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"download"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Export Label"}
                    data-text="true"
                  >
                    {"Export Blueprint JSON"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[8px_14px] justify-start items-center bg-[#18181A] rounded-[8px]"
                  }
                  data-pencil-name={"Btn Add Template"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Add Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"add"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Add Label"}
                    data-text="true"
                  >
                    {"Buat Template Baru"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[8px_14px] justify-start items-center bg-[#D2D88F] rounded-[8px]"
                  }
                  data-pencil-name={"Btn Auto Clone Top"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Bolt Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"bolt"}
                  </div>
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Clone Label"}
                    data-text="true"
                  >
                    {"Auto-Clone ke Klien"}
                  </div>
                </div>
              </UiAction>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-row gap-[14px] justify-start items-start"
            }
            data-pencil-name={"Bento Metrics Row"}
            data-responsive="row"
          >
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_3px_#00000008] flex flex-col gap-[8px] p-[14px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"Metric - Template draf"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Card Top"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Template draf • belum disetujui"}
                </div>
                <div
                  className={
                    "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Box"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"schema"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end"
                }
                data-pencil-name={"Value Row"}
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-pencil-name={"Val Col"}
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.2px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Value"}
                    data-text="true"
                  >
                    {"4 Template"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#9CA3AF] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Subtext"}
                    data-text="true"
                  >
                    {"Web MVP, Portal, E-Com, App"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                  }
                  data-pencil-name={"Badge Pill"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Badge Text"}
                    data-text="true"
                  >
                    {"Draf • belum disetujui"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_3px_#00000008] flex flex-col gap-[8px] p-[14px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"Metric - Siklus Rata-rata Sprint"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Card Top"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Siklus Rata-rata Sprint"}
                </div>
                <div
                  className={
                    "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Box"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"timelapse"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end"
                }
                data-pencil-name={"Value Row"}
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-pencil-name={"Val Col"}
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.2px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Value"}
                    data-text="true"
                  >
                    {"Belum ditetapkan"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#9CA3AF] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Subtext"}
                    data-text="true"
                  >
                    {"Jadwal per proyek"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#18181A0F] rounded-[4px]"
                  }
                  data-pencil-name={"Badge Pill"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Badge Text"}
                    data-text="true"
                  >
                    {"Durasi belum diverifikasi"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_3px_#00000008] flex flex-col gap-[8px] p-[14px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"Metric - Daftar butir draf"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Card Top"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Deliverables contoh • draf"}
                </div>
                <div
                  className={
                    "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Box"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"fact_check"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end"
                }
                data-pencil-name={"Value Row"}
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-pencil-name={"Val Col"}
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.2px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Value"}
                    data-text="true"
                  >
                    {"Daftar butir belum disetujui"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#9CA3AF] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Subtext"}
                    data-text="true"
                  >
                    {"Kriteria belum ditetapkan"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#D2D88F40] rounded-[4px]"
                  }
                  data-pencil-name={"Badge Pill"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#454A10] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Badge Text"}
                    data-text="true"
                  >
                    {"Pengujian ditetapkan per proyek"}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "box-border [flex:1_1_0] h-fit [box-shadow:0px_1px_3px_#00000008] flex flex-col gap-[8px] p-[14px] justify-start items-start bg-[#FFFFFF] rounded-[12px]"
              }
              data-pencil-name={"Metric - Proyek Terkloning (Q1-Q2)"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Card Top"}
              >
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Label"}
                  data-text="true"
                >
                  {"Proyek Terkloning (Q1-Q2)"}
                </div>
                <div
                  className={
                    "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Icon Box"}
                >
                  <div
                    className={
                      "text-[16px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"rocket_launch"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end"
                }
                data-pencil-name={"Value Row"}
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-pencil-name={"Val Col"}
                >
                  <div
                    className={
                      "text-[18px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-0.2px] text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Value"}
                    data-text="true"
                  >
                    {"Jumlah proyek belum diverifikasi"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#9CA3AF] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Subtext"}
                    data-text="true"
                  >
                    {"Portal tracking nonaktif"}
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#82B4401A] rounded-[4px]"
                  }
                  data-pencil-name={"Badge Pill"}
                >
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Badge Text"}
                    data-text="true"
                  >
                    {"Jadwal disepakati per proyek"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[8px_12px] justify-between items-center bg-[#FFFFFF] rounded-[10px]"
            }
            data-pencil-name={"Template Selector Bar"}
            data-responsive="row"
          >
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
              }
              data-pencil-name={"Blueprint Tabs"}
              data-responsive="row"
            >
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Tab Label Prefix"}
                data-text="true"
              >
                {"Blueprint:"}
              </div>
              {blueprintList.map((bp) => {
                const isActive = activeBlueprint === bp.id;
                return (
                  <button
                    key={bp.id}
                    type="button"
                    onClick={() => setActiveBlueprint(bp.id)}
                    className={`box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] p-[6px_10px] justify-start items-center rounded-[7px] transition-all cursor-pointer ${
                      isActive ? "bg-[#18181A]" : "bg-[#F4F4F5] hover:bg-[#E4E4E7]"
                    }`}
                    data-pencil-name={`Tab ${bp.name}`}
                  >
                    <div
                      className={`text-[12px]/[normal] box-border font-[var(--font-inter),system-ui,sans-serif] text-left [white-space:nowrap] ${
                        isActive ? "text-[#FFFFFF] font-semibold" : "text-[#52525B] font-medium"
                      }`}
                      data-pencil-name={"Tab Title"}
                      data-text="true"
                    >
                      {bp.name}
                    </div>
                    <div
                      className={`box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start rounded-[4px] ${
                        isActive ? "bg-[#D2D88F]" : "bg-[#E4E4E7]"
                      }`}
                      data-pencil-name={"Tab Badge"}
                    >
                      <div
                        className={`text-[10px]/[normal] box-border font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap] ${
                          isActive ? "text-[#18181A]" : "text-[#71717A]"
                        }`}
                        data-pencil-name={"Badge Text"}
                        data-text="true"
                      >
                        {bp.badge}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center"
              }
              data-pencil-name={"Selector Right Group"}
            >
              <div
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[4px_8px] justify-start items-center bg-[#82B44012] rounded-[6px]"
                }
                data-pencil-name={"Compliance Tag"}
              >
                <div
                  className={
                    "text-[13px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Shield Icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"verified_user"}
                </div>
                <div
                  className={
                    "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Shield Text"}
                  data-text="true"
                >
                  {"Aksesibilitas perlu ditinjau"}
                </div>
              </div>
              <UiAction
                label={"Duplikat Blueprint"}
                className={
                  "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[5px_10px] justify-start items-center bg-[#FFFFFF] hover:bg-neutral-100 rounded-[6px] border border-neutral-200 transition-colors cursor-pointer"
                }
                data-pencil-name={"Btn Duplicate"}
              >
                <div
                  className={
                    "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Dup Icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"content_copy"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Dup Text"}
                  data-text="true"
                >
                  {"Duplikat Blueprint"}
                </div>
              </UiAction>
            </div>
          </div>
          <div
            className={
              "box-border w-full h-fit shrink-0 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
            }
            data-pencil-name={"Bento Workspace Grid"}
            data-responsive="row"
          >
            <div
              className={
                "box-border xl:col-span-7 shrink-0 h-fit [box-shadow:0px_1px_3px_#00000008] flex flex-col gap-[12px] p-4 sm:p-6 justify-start items-start bg-[#FFFFFF] rounded-[16px] w-full"
              }
              data-pencil-name={"Left Column - Stages"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                }
                data-pencil-name={"Stages Card Header"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-pencil-name={"Head Text Col"}
                >
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Head Title"}
                    data-text="true"
                  >
                    {"Milestone Stage Templates"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Head Subtitle"}
                    data-text="true"
                  >
                    {
                      "Draf template • tahapan, durasi, dan bobot menunggu persetujuan"
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"Head Actions"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[3px_6px] justify-start items-center bg-[#82B44014] rounded-[4px]"
                    }
                    data-pencil-name={"Lock Badge"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Lock Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"lock"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Lock Text"}
                      data-text="true"
                    >
                      {"Sequential Gated"}
                    </div>
                  </div>
                  <UiAction
                    label={"Reorder"}
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[4px_8px] justify-start items-center bg-[#F4F4F5] rounded-[6px]"
                    }
                    data-pencil-name={"Sort Button"}
                  >
                    <div
                      className={
                        "text-[14px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Sort Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"reorder"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Sort Text"}
                      data-text="true"
                    >
                      {"Reorder"}
                    </div>
                  </UiAction>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_10px] justify-between items-center bg-[#F4F4F5] rounded-[6px]"
                }
                data-pencil-name={"Blueprint Summary Bar"}
                data-responsive="row"
              >
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                  }
                  data-pencil-name={"B Left"}
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Tune Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"tune"}
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Banner Text"}
                    data-text="true"
                  >
                    {
                      "Master template draf • milestone dan deliverable belum disetujui"
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                  }
                  data-pencil-name={"B Right"}
                >
                  <div
                    className={
                      "text-[12px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Check Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"verified"}
                  </div>
                  <div
                    className={
                      "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Verified Text"}
                    data-text="true"
                  >
                    {"Draf • belum disetujui"}
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 flex flex-col gap-[10px] justify-start items-start"
                }
                data-pencil-name={"Stages List"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#FFFFFF] rounded-[10px]"
                  }
                  data-pencil-name={"Stage 01"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Stage Top Row"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"Left Meta"}
                    >
                      <div
                        className={
                          "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                        }
                        data-pencil-name={"Num Box"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Num"}
                          data-text="true"
                        >
                          {"01"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Stage Title"}
                        data-text="true"
                      >
                        {"Discovery, Wireframe & Arsitektur Sistem"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Right Meta"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"SLA Pill"}
                      >
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"SLA Text"}
                          data-text="true"
                        >
                          {"Durasi disepakati"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#18181A0D] rounded-[4px]"
                        }
                        data-pencil-name={"Weight Pill"}
                      >
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Weight Text"}
                          data-text="true"
                        >
                          {"Bobot belum ditetapkan"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-pencil-name={"Stage Description"}
                    data-text="true"
                  >
                    {
                      "Analisis kebutuhan teknis, ERD PostgreSQL, wireframe desktop & mobile 12-kolom, rancangan PRD dan skema endpoint REST API."
                    }
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Stage Bottom Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Chips Group"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Chip Daftar Butir Draf"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"checklist"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Daftar butir draf"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Chip Wireframing"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"dashboard"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Wireframing"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#82B4401A] rounded-[4px]"
                        }
                        data-pencil-name={"Chip Sign-off Gate"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"verified"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Sign-off Gate"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Actions Group"}
                    >
                      <div
                        className={
                          "box-border w-[22px] shrink-0 h-[22px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Btn Edit Stage"}
                      >
                        <UiAction
                          label={"edit"}
                          className={
                            "text-[12px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Edit Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"edit"}
                        </UiAction>
                      </div>
                      <div
                        className={
                          "box-border w-[22px] shrink-0 h-[22px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Btn Drag Handle"}
                      >
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Drag Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"drag_handle"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 [box-shadow:0px_2px_6px_#D2D88F33] flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#FBFDF7] rounded-[10px]"
                  }
                  data-pencil-name={"Stage 02"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Stage Top Row"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"Left Meta"}
                    >
                      <div
                        className={
                          "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[6px]"
                        }
                        data-pencil-name={"Num Box"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Num"}
                          data-text="true"
                        >
                          {"02"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Stage Title"}
                        data-text="true"
                      >
                         {"Desain antarmuka dan sistem desain (contoh)"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Right Meta"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#D2D88F40] rounded-[4px]"
                        }
                        data-pencil-name={"SLA Pill"}
                      >
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#454A10] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"SLA Text"}
                          data-text="true"
                        >
                          {"Durasi disepakati"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#18181A0D] rounded-[4px]"
                        }
                        data-pencil-name={"Weight Pill"}
                      >
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Weight Text"}
                          data-text="true"
                        >
                          {"Bobot belum ditetapkan"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#18181A] rounded-[4px]"
                        }
                        data-pencil-name={"Active Badge"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Active Text"}
                          data-text="true"
                        >
                          {"TERPILIH"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-pencil-name={"Stage Description"}
                    data-text="true"
                  >
                    {
                       "Draf aktivitas desain. Komponen, aksesibilitas, dan integrasi perlu ditinjau untuk tiap proyek."
                    }
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] p-[8px_10px] justify-start items-start bg-[#FFFFFF] rounded-[8px]"
                    }
                    data-pencil-name={"Active Stage Detail Box"}
                  >
                    <div
                      className={
                        "box-border w-fit h-fit shrink-0 flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"SLA Breakdown Row"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"SLA Chip"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"grid_view"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Desain dan komponen ditetapkan per proyek"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"SLA Chip"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"smart_button"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Prototipe dan integrasi ditetapkan per proyek"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#82B44014] rounded-[4px]"
                        }
                        data-pencil-name={"SLA Chip"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"verified"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Pengujian dan persetujuan ditetapkan per proyek"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                      }
                      data-pencil-name={"Milestone Gates Row"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"Gate Chain"}
                      >
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chain Label"}
                          data-text="true"
                        >
                          {"Gate Kloning:"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_5px] justify-start items-center bg-[#82B4401A] rounded-[3px]"
                          }
                          data-pencil-name={"Step Tokens MoveIQ"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"Step Icon"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"check"}
                          </div>
                          <div
                            className={
                              "text-[9px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Step Text"}
                            data-text="true"
                          >
                            {"Tokens MoveIQ"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Arrow"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"chevron_right"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_5px] justify-start items-center bg-[#82B4401A] rounded-[3px]"
                          }
                          data-pencil-name={"Step Bento UI"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"Step Icon"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"check"}
                          </div>
                          <div
                            className={
                              "text-[9px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Step Text"}
                            data-text="true"
                          >
                            {"Bento UI"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Arrow"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"chevron_right"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_5px] justify-start items-center bg-[#82B4401A] rounded-[3px]"
                          }
                          data-pencil-name={"Step Prototype"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"Step Icon"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"check"}
                          </div>
                          <div
                            className={
                              "text-[9px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Step Text"}
                            data-text="true"
                          >
                            {"Prototype"}
                          </div>
                        </div>
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Arrow"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"chevron_right"}
                        </div>
                        <div
                          className={
                            "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_5px] justify-start items-center bg-[#F973161A] rounded-[3px]"
                          }
                          data-pencil-name={"Step BAST Sign-off"}
                        >
                          <div
                            className={
                              "text-[10px]/[normal] box-border text-[#F97316] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                            }
                            data-pencil-name={"Step Icon"}
                            data-text="true"
                            aria-hidden="true"
                          >
                            {"schedule"}
                          </div>
                          <div
                            className={
                              "text-[9px]/[normal] box-border text-[#F97316] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                            }
                            data-pencil-name={"Step Text"}
                            data-text="true"
                          >
                            {"BAST Sign-off"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                      }
                      data-pencil-name={"Sync Route Row"}
                      data-responsive="row"
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"Left Sync"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Link Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"share"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Sync Text"}
                          data-text="true"
                        >
                          {"Rute tracking belum dikonfigurasi"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                        }
                        data-pencil-name={"Right PDP"}
                      >
                        <div
                          className={
                            "text-[11px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Shield Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"lock"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"PDP Text"}
                          data-text="true"
                        >
                        {"Persyaratan privasi dan akses ditinjau per proyek"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Stage Bottom Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Chips Group"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#18181A] rounded-[4px]"
                        }
                        data-pencil-name={"Chip Daftar Butir Draf"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"checklist"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Daftar butir draf"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#D2D88F] rounded-[4px]"
                        }
                           data-pencil-name={"Chip sinkronisasi belum dikonfigurasi"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"sync"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Sinkronisasi klien belum dikonfigurasi"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#82B4401A] rounded-[4px]"
                        }
                        data-pencil-name={"Chip WCAG AA Audited"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"accessibility_new"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Aksesibilitas belum diverifikasi"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Actions Group"}
                    >
                      <div
                        className={
                          "box-border w-[22px] shrink-0 h-[22px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Btn Edit Stage"}
                      >
                        <UiAction
                          label={"edit"}
                          className={
                            "text-[12px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Edit Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"edit"}
                        </UiAction>
                      </div>
                      <div
                        className={
                          "box-border w-[22px] shrink-0 h-[22px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Btn Drag Handle"}
                      >
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Drag Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"drag_handle"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#FFFFFF] rounded-[10px]"
                  }
                  data-pencil-name={"Stage 03"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Stage Top Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"Left Meta"}
                    >
                      <div
                        className={
                          "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                        }
                        data-pencil-name={"Num Box"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Num"}
                          data-text="true"
                        >
                          {"03"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Stage Title"}
                        data-text="true"
                      >
                        {"Core Development & Backend Integration"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Right Meta"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"SLA Pill"}
                      >
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"SLA Text"}
                          data-text="true"
                        >
                          {"Durasi disepakati"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#18181A0D] rounded-[4px]"
                        }
                        data-pencil-name={"Weight Pill"}
                      >
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Weight Text"}
                          data-text="true"
                        >
                          {"Bobot belum ditetapkan"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-pencil-name={"Stage Description"}
                    data-text="true"
                  >
                    {
                      "Implementasi RESTful API Laravel 13 / Filament, auth session 120 menit, PostgreSQL index guard anti-double booking, dan webhook notifikasi."
                    }
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Stage Bottom Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Chips Group"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Chip Daftar Butir Draf"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"checklist"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Daftar butir draf"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Chip Database Guard"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"database"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Database Guard"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#82B4401A] rounded-[4px]"
                        }
                        data-pencil-name={"Chip Docker Dev Ready"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"terminal"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Docker Dev Ready"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Actions Group"}
                    >
                      <div
                        className={
                          "box-border w-[22px] shrink-0 h-[22px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Btn Edit Stage"}
                      >
                        <UiAction
                          label={"edit"}
                          className={
                            "text-[12px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Edit Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"edit"}
                        </UiAction>
                      </div>
                      <div
                        className={
                          "box-border w-[22px] shrink-0 h-[22px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Btn Drag Handle"}
                      >
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Drag Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"drag_handle"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#FFFFFF] rounded-[10px]"
                  }
                  data-pencil-name={"Stage 04"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Stage Top Row"}
                    data-responsive="row"
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[8px] justify-start items-center"
                      }
                      data-pencil-name={"Left Meta"}
                    >
                      <div
                        className={
                          "box-border w-[26px] shrink-0 h-[26px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[6px]"
                        }
                        data-pencil-name={"Num Box"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Num"}
                          data-text="true"
                        >
                          {"04"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[12px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Stage Title"}
                        data-text="true"
                      >
                        {"Pengujian, penerimaan, dan rilis ditetapkan per proyek"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Right Meta"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"SLA Pill"}
                      >
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"SLA Text"}
                          data-text="true"
                        >
                          {"Durasi disepakati"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_6px] justify-start items-start bg-[#18181A0D] rounded-[4px]"
                        }
                        data-pencil-name={"Weight Pill"}
                      >
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Weight Text"}
                          data-text="true"
                        >
                          {"Bobot belum ditetapkan"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border w-full text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left"
                    }
                    data-pencil-name={"Stage Description"}
                    data-text="true"
                  >
                    {
                      "Jenis pengujian, penerimaan, infrastruktur, serah terima, dan dukungan ditinjau serta disepakati untuk setiap proyek."
                    }
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                    }
                    data-pencil-name={"Stage Bottom Row"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Chips Group"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Chip Daftar Butir Draf"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"checklist"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Daftar butir draf"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Chip UU PDP Audit"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"policy"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Tinjauan privasi dan data"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[3px] p-[2px_6px] justify-start items-center bg-[#82B4401A] rounded-[4px]"
                        }
                        data-pencil-name={"Chip BAST Resmi"}
                      >
                        <div
                          className={
                            "text-[12px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Chip Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"assignment_turned_in"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Chip Text"}
                          data-text="true"
                        >
                          {"Serah terima sesuai kesepakatan"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Actions Group"}
                    >
                      <div
                        className={
                          "box-border w-[22px] shrink-0 h-[22px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Btn Edit Stage"}
                      >
                        <UiAction
                          label={"edit"}
                          className={
                            "text-[12px]/[normal] box-border text-[#52525B] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Edit Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"edit"}
                        </UiAction>
                      </div>
                      <div
                        className={
                          "box-border w-[22px] shrink-0 h-[22px] flex flex-row gap-0 justify-center items-center bg-[#F4F4F5] rounded-[4px]"
                        }
                        data-pencil-name={"Btn Drag Handle"}
                      >
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Drag Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"drag_handle"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <UiAction
                label={"+ Tambah Tahapan Baru ke Blueprint"}
                className={
                  "box-border w-full h-fit shrink-0 flex flex-row gap-[6px] p-[10px_14px] justify-center items-center bg-[#F9F9FB] rounded-[8px]"
                }
                data-pencil-name={"Add Stage Dashed Button"}
              >
                <div
                  className={
                    "text-[16px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                  }
                  data-pencil-name={"Add Stage Icon"}
                  data-text="true"
                  aria-hidden="true"
                >
                  {"add_circle_outline"}
                </div>
                <div
                  className={
                    "text-[11px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                  }
                  data-pencil-name={"Add Stage Text"}
                  data-text="true"
                >
                  {"+ Tambah Tahapan Baru ke Blueprint"}
                </div>
              </UiAction>
            </div>
            <div
              className={
                "box-border xl:col-span-5 shrink-0 h-fit flex flex-col gap-6 justify-start items-start w-full"
              }
              data-pencil-name={"Right Column - Deliverables & Clone"}
            >
              <div
                className={
                  "box-border w-full h-fit shrink-0 [box-shadow:0px_1px_3px_#00000008] flex flex-col gap-[10px] p-[14px] justify-start items-start bg-[#FFFFFF] rounded-[14px]"
                }
                data-pencil-name={"Deliverables Card"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                  data-pencil-name={"Deliv Header"}
                  data-responsive="row"
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] justify-start items-start"
                    }
                    data-pencil-name={"Deliv Head Text"}
                  >
                    <div
                      className={
                        "text-[13px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Deliv Title"}
                      data-text="true"
                    >
                      {"Sprint Deliverables Checklist"}
                    </div>
                    <div
                      className={
                        "text-[11px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Deliv Subtitle"}
                      data-text="true"
                    >
                      {"Tahap 02: Desain antarmuka (contoh)"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[3px_6px] justify-start items-center bg-[#82B4401A] rounded-[4px]"
                    }
                    data-pencil-name={"Progress Badge"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Prog Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"check_circle"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Prog Text"}
                      data-text="true"
                    >
                        {"Status checklist contoh"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-[4px] shrink-0 flex flex-row gap-0 justify-start items-start bg-[#E4E4E7] rounded-[2px]"
                  }
                  data-pencil-name={"Progress Bar Track"}
                >
                  <div
                    className={
                      "box-border [flex:1_1_0] h-[4px] flex flex-row gap-0 justify-start items-start bg-[#82B440] rounded-[2px]"
                    }
                    data-pencil-name={"Progress Bar Fill"}
                  ></div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start"
                  }
                  data-pencil-name={"Deliverables List"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_8px] justify-between items-center bg-[#FAFAFA] rounded-[6px]"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Item Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Checkbox"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_box"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Item Title"}
                        data-text="true"
                      >
                        {"Design tokens contoh • bukan standar layanan"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Item Tags"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#18181A] rounded-[3px]"
                        }
                        data-pencil-name={"Category Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Tag Content"}
                          data-text="true"
                        >
                          {"Tokens"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#D2D88F40] rounded-[3px]"
                        }
                        data-pencil-name={"Gate Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#454A10] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Gate Content"}
                          data-text="true"
                        >
                          {"Auto-sync"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_8px] justify-between items-center bg-[#FAFAFA] rounded-[6px]"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Item Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Checkbox"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_box"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Item Title"}
                        data-text="true"
                      >
                        {"Wireframe Desktop & Mobile 12-Kolom"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Item Tags"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#F4F4F5] rounded-[3px]"
                        }
                        data-pencil-name={"Category Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Tag Content"}
                          data-text="true"
                        >
                          {"Wireframe"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#82B4401A] rounded-[3px]"
                        }
                        data-pencil-name={"Gate Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Gate Content"}
                          data-text="true"
                        >
                          {"Sign-off"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_8px] justify-between items-center bg-[#FAFAFA] rounded-[6px]"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Item Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Checkbox"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_box"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Item Title"}
                        data-text="true"
                      >
                        {"High-Fidelity Mockup & Bento Components"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Item Tags"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#F4F4F5] rounded-[3px]"
                        }
                        data-pencil-name={"Category Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Tag Content"}
                          data-text="true"
                        >
                          {"Figma UI"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#F4F4F5] rounded-[3px]"
                        }
                        data-pencil-name={"Gate Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Gate Content"}
                          data-text="true"
                        >
                          {"Client Gate"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_8px] justify-between items-center bg-[#FAFAFA] rounded-[6px]"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Item Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Checkbox"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_box"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Item Title"}
                        data-text="true"
                      >
                      {"Tinjau aksesibilitas dan kontras untuk tiap proyek"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Item Tags"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#82B4401A] rounded-[3px]"
                        }
                        data-pencil-name={"Category Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Tag Content"}
                          data-text="true"
                        >
                        {"Perlu ditinjau"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#18181A0D] rounded-[3px]"
                        }
                        data-pencil-name={"Gate Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Gate Content"}
                          data-text="true"
                        >
                          {"Mandatory"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_8px] justify-between items-center bg-[#FAFAFA] rounded-[6px]"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Item Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Checkbox"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_box"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Item Title"}
                        data-text="true"
                      >
                        {"Interactive Prototype • contoh draf"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Item Tags"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#F4F4F5] rounded-[3px]"
                        }
                        data-pencil-name={"Category Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Tag Content"}
                          data-text="true"
                        >
                          {"Prototype"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#F4F4F5] rounded-[3px]"
                        }
                        data-pencil-name={"Gate Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Gate Content"}
                          data-text="true"
                        >
                          {"User Flow"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_8px] justify-between items-center bg-[#FAFAFA] rounded-[6px]"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Item Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Checkbox"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_box"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Item Title"}
                        data-text="true"
                      >
                        {"Handoff Asset & Material Symbols Outlined"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Item Tags"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#F4F4F5] rounded-[3px]"
                        }
                        data-pencil-name={"Category Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#52525B] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Tag Content"}
                          data-text="true"
                        >
                          {"Handoff"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#82B4401A] rounded-[3px]"
                        }
                        data-pencil-name={"Gate Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Gate Content"}
                          data-text="true"
                        >
                          {"Dev Ready"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_8px] justify-between items-center bg-[#FAFAFA] rounded-[6px]"
                    }
                    data-pencil-name={"Deliv Item"}
                  >
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                      }
                      data-pencil-name={"Item Left"}
                    >
                      <div
                        className={
                          "text-[16px]/[normal] box-border text-[#82B440] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Checkbox"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"check_box"}
                      </div>
                      <div
                        className={
                          "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                        }
                        data-pencil-name={"Item Title"}
                        data-text="true"
                      >
                        {"Milestone Review Session & Sign-off BAST"}
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                      }
                      data-pencil-name={"Item Tags"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#F973161A] rounded-[3px]"
                        }
                        data-pencil-name={"Category Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#F97316] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Tag Content"}
                          data-text="true"
                        >
                          {"BAST Gate"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#F973161A] rounded-[3px]"
                        }
                        data-pencil-name={"Gate Tag"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#F97316] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Gate Content"}
                          data-text="true"
                        >
                          {"Blocking Gate"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_10px] justify-between items-center bg-[#F4F4F5] rounded-[6px]"
                  }
                  data-pencil-name={"Add Deliverable Row"}
                >
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#9CA3AF] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Add Placeholder"}
                    data-text="true"
                  >
                    {"+ Tambah butir checklist sprint deliverable..."}
                  </div>
                  <div
                    className={
                      "box-border w-[20px] shrink-0 h-[20px] flex flex-row gap-0 justify-center items-center bg-[#18181A] rounded-[4px]"
                    }
                    data-pencil-name={"Add Btn"}
                  >
                    <div
                      className={
                        "text-[14px]/[normal] box-border text-[#FFFFFF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Add Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"add"}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "box-border w-full h-fit shrink-0 [box-shadow:0px_2px_8px_#00000026] flex flex-col gap-[10px] p-[14px] justify-start items-start bg-[#18181A] rounded-[14px]"
                }
                data-pencil-name={"Obsidian Capsule - Auto Clone"}
              >
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                  }
                  data-pencil-name={"Clone Header Row"}
                >
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] p-[2px_6px] justify-start items-center bg-[#D2D88F] rounded-[4px]"
                    }
                    data-pencil-name={"Engine Badge"}
                  >
                    <div
                      className={
                        "text-[12px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                      }
                      data-pencil-name={"Bolt Icon"}
                      data-text="true"
                      aria-hidden="true"
                    >
                      {"bolt"}
                    </div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-extrabold tracking-[0.3px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Badge Text"}
                      data-text="true"
                    >
                      {"SIMULASI • BELUM TERHUBUNG"}
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-fit shrink-0 h-fit flex flex-row gap-[4px] justify-start items-center"
                    }
                    data-pencil-name={"Live Status"}
                  >
                    <div
                      className={
                        "box-border w-[6px] shrink-0 h-[6px] bg-[#82B440] rounded-[50%]"
                      }
                      data-pencil-name={"Live Dot"}
                    ></div>
                    <div
                      className={
                        "text-[10px]/[normal] box-border text-[#82B440] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Live Text"}
                      data-text="true"
                    >
                      {"Belum dikonfigurasi"}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-fit h-fit shrink-0 flex flex-col gap-[2px] justify-start items-start"
                  }
                  data-pencil-name={"Clone Title Col"}
                >
                  <div
                    className={
                      "text-[13px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Title"}
                    data-text="true"
                  >
                    {"Clone Blueprint ke Pelacakan Klien"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Subtitle"}
                    data-text="true"
                  >
                    {
                      "Simulasi pratinjau • tidak menerapkan data atau mengaktifkan tracking."
                    }
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-col gap-[8px] justify-start items-start"
                  }
                  data-pencil-name={"Form Fields Col"}
                >
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"Field Target Project"}
                  >
                    <div
                      className={
                        "text-[9px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.2px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Label 1"}
                      data-text="true"
                    >
                      {"TARGET PROYEK KLIEN"}
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_8px] justify-between items-center bg-[#242427] rounded-[6px]"
                      }
                      data-pencil-name={"Select Box"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                        }
                        data-pencil-name={"Sel Left"}
                      >
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Domain Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"domain"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Proj Name"}
                          data-text="true"
                        >
                          {"Proyek Contoh (DRAF-001)"}
                        </div>
                      </div>
                      <div
                        className={
                          "text-[14px]/[normal] box-border text-[#71717A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                        }
                        data-pencil-name={"Arrow"}
                        data-text="true"
                        aria-hidden="true"
                      >
                        {"unfold_more"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                    }
                    data-pencil-name={"Field Kickoff Date"}
                  >
                    <div
                      className={
                        "text-[9px]/[normal] box-border text-[#A1A1AA] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.2px] text-left [white-space:nowrap]"
                      }
                      data-pencil-name={"Label 2"}
                      data-text="true"
                    >
                      {"TANGGAL DAN DURASI • BELUM DITETAPKAN"}
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 p-[6px_8px] justify-between items-center bg-[#242427] rounded-[6px]"
                      }
                      data-pencil-name={"Date Box"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                        }
                        data-pencil-name={"Date Left"}
                      >
                        <div
                          className={
                            "text-[14px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Cal Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"calendar_today"}
                        </div>
                        <div
                          className={
                            "text-[11px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Date Text"}
                          data-text="true"
                        >
                          {"01 Apr 2025 → 15 Apr 2025"}
                        </div>
                      </div>
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[2px_5px] justify-start items-start bg-[#D2D88F26] rounded-[3px]"
                        }
                        data-pencil-name={"SLA Badge"}
                      >
                        <div
                          className={
                            "text-[9px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"SLA Label"}
                          data-text="true"
                        >
                          {"Durasi disepakati"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "box-border w-full h-fit shrink-0 flex flex-col gap-[6px] justify-start items-start"
                    }
                    data-pencil-name={"Toggles Group"}
                  >
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                      }
                      data-pencil-name={"Toggle Row"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                        }
                        data-pencil-name={"Tog Left"}
                      >
                        <div
                          className={
                            "text-[13px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Tog Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"pin"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#E4E4E7] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Tog Label"}
                          data-text="true"
                        >
                          {"Portal tracking nonaktif • akses belum tersedia"}
                        </div>
                      </div>
                      <div
                        className={
                        "box-border w-[28px] shrink-0 h-[16px] flex flex-row gap-0 p-[2px] justify-start items-center bg-[#71717A] rounded-[9999px]"
                        }
                        data-pencil-name={"Switch OFF"}
                      >
                        <div
                          className={
                            "box-border w-[12px] shrink-0 h-[12px] bg-[#18181A] rounded-[50%]"
                          }
                          data-pencil-name={"Knob"}
                        ></div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                      }
                      data-pencil-name={"Toggle Row"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                        }
                        data-pencil-name={"Tog Left"}
                      >
                        <div
                          className={
                            "text-[13px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Tog Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"chat"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#E4E4E7] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Tog Label"}
                          data-text="true"
                        >
                          {"Notifikasi eksternal belum dikonfigurasi"}
                        </div>
                      </div>
                      <div
                        className={
                        "box-border w-[28px] shrink-0 h-[16px] flex flex-row gap-0 p-[2px] justify-start items-center bg-[#71717A] rounded-[9999px]"
                        }
                        data-pencil-name={"Switch OFF"}
                      >
                        <div
                          className={
                            "box-border w-[12px] shrink-0 h-[12px] bg-[#18181A] rounded-[50%]"
                          }
                          data-pencil-name={"Knob"}
                        ></div>
                      </div>
                    </div>
                    <div
                      className={
                        "box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
                      }
                      data-pencil-name={"Toggle Row"}
                    >
                      <div
                        className={
                          "box-border w-fit shrink-0 h-fit flex flex-row gap-[6px] justify-start items-center"
                        }
                        data-pencil-name={"Tog Left"}
                      >
                        <div
                          className={
                            "text-[13px]/[normal] box-border text-[#9CA3AF] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                          }
                          data-pencil-name={"Tog Icon"}
                          data-text="true"
                          aria-hidden="true"
                        >
                          {"verified"}
                        </div>
                        <div
                          className={
                            "text-[10px]/[normal] box-border text-[#E4E4E7] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                          }
                          data-pencil-name={"Tog Label"}
                          data-text="true"
                        >
                          {"Dukungan dan garansi hanya jika disepakati tertulis"}
                        </div>
                      </div>
                      <div
                        className={
                        "box-border w-[28px] shrink-0 h-[16px] flex flex-row gap-0 p-[2px] justify-start items-center bg-[#71717A] rounded-[9999px]"
                        }
                        data-pencil-name={"Switch OFF"}
                      >
                        <div
                          className={
                            "box-border w-[12px] shrink-0 h-[12px] bg-[#18181A] rounded-[50%]"
                          }
                          data-pencil-name={"Knob"}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-[4px] p-[6px_8px] justify-start items-center bg-[#242427] rounded-[6px]"
                  }
                  data-pencil-name={"Summary Output Box"}
                >
                  <div
                    className={
                      "text-[14px]/[normal] box-border text-[#D2D88F] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"Info Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"info"}
                  </div>
                  <div
                    className={
                      "text-[9px]/[normal] box-border text-[#D4D4D8] font-[var(--font-inter),system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"Summary Text"}
                    data-text="true"
                  >
                    {
                      "Draf template • rincian proyek belum disetujui"
                    }
                  </div>
                </div>
                <UiAction
                  label={"Eksekusi Auto-Clone Blueprint (1-Klik)"}
                  className={
                    "box-border w-full h-fit shrink-0 flex flex-row gap-[6px] p-[9px_12px] justify-center items-center bg-[#D2D88F] rounded-[8px]"
                  }
                  data-pencil-name={"CTA Auto-Clone Button"}
                >
                  <div
                    className={
                      "text-[15px]/[normal] box-border text-[#18181A] font-['Material_Symbols_Outlined',system-ui,sans-serif] font-normal text-left [white-space:nowrap] symbol"
                    }
                    data-pencil-name={"CTA Icon"}
                    data-text="true"
                    aria-hidden="true"
                  >
                    {"rocket_launch"}
                  </div>
                  <div
                    className={
                      "text-[11px]/[normal] box-border text-[#18181A] font-[var(--font-inter),system-ui,sans-serif] font-bold text-left [white-space:nowrap]"
                    }
                    data-pencil-name={"CTA Label"}
                    data-text="true"
                  >
                    {"Eksekusi Auto-Clone Blueprint (1-Klik)"}
                  </div>
                </UiAction>
                <div
                  className={
                    "text-[9px]/[normal] box-border text-[#71717A] font-[var(--font-inter),system-ui,sans-serif] font-normal text-center [white-space:nowrap]"
                  }
                  data-pencil-name={"Clone Audit Log"}
                  data-text="true"
                >
                  {
                    "Belum ada proyek yang disetujui untuk ditampilkan."
                  }
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
