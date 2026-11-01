// Ported from prototype/stitch/system/overview-architecture.html. Prototype remains read-only.
import { ReferenceImage } from "@/components/public/ReferenceImage";
import { ScreenState } from "@/components/preview/Controls";
export default function SystemOverviewArchitecture() {
  return (
    <ScreenState screen={"system/overview-architecture"}>
      <div
        className={
          "box-border w-[2000px] h-[420px] flex flex-row gap-[40px] p-[48px] justify-start items-center bg-[#18181A] rounded-[24px] overflow-hidden screen public-screen mobile-auto-height"
        }
        data-pencil-name={"System / 00 - Overview & Architecture"}
        data-screen={"system/overview-architecture"}
        id="konten"
        tabIndex={-1}
        data-responsive="row"
      >
        <div
          className={
            "box-border w-[1050px] shrink-0 h-fit flex flex-col gap-[16px] justify-start items-start"
          }
          data-pencil-name={"Title Column"}
          data-responsive="fixed"
        >
          <div
            className={
              "box-border w-fit h-fit shrink-0 flex flex-row gap-[8px] p-[6px_16px] justify-start items-center bg-[#242427] rounded-[9999px]"
            }
            data-pencil-name={"Badge"}
          >
            <div
              className={
                "box-border w-[8px] shrink-0 h-[8px] bg-[#82B440] rounded-[50%]"
              }
              data-pencil-name={"Pulse"}
            ></div>
            <div
              className={
                "text-[12px]/[normal] box-border text-[#D2D88F] font-[var(--font-inter),system-ui,sans-serif] font-semibold tracking-[0.5px] text-left [white-space:nowrap]"
              }
              data-pencil-name={"Badge Label"}
              data-text="true"
            >
              {"OPENBYTE LABS • KATALOG PRATINJAU"}
            </div>
          </div>
          <div
            className={
              "text-[44px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-bold tracking-[-1px] text-left [white-space:nowrap]"
            }
            data-pencil-name={"Main Title"}
            data-text="true"
          >
            {"OpenByte Labs"}
          </div>
          <div
            className={
              "text-[16px]/[24px] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
            }
            data-pencil-name={"Subtitle"}
            data-text="true"
          >
            {
              "Software Engineer & System Specialist — High-Performance Web, Mobile & Multi-Tenant Architecture"
            }
          </div>
          <div
            className={
              "box-border w-fit h-fit shrink-0 flex flex-row gap-[16px] p-[8px_0px_0px_0px] justify-start items-start"
            }
            data-pencil-name={"Stats Row"}
            data-responsive="row"
          >
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] p-[10px_16px] justify-start items-start bg-[#242427] rounded-[12px]"
              }
              data-pencil-name={"Fidelity Production"}
            >
              <div
                className={
                  "text-[16px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Stat Value"}
                data-text="true"
              >
                {"13 Screens"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Stat Label"}
                data-text="true"
              >
                {"Fidelity Production"}
              </div>
            </div>
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] p-[10px_16px] justify-start items-start bg-[#242427] rounded-[12px]"
              }
              data-pencil-name={"Dual-Surface Bento"}
            >
              <div
                className={
                  "text-[16px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Stat Value"}
                data-text="true"
              >
                {"MoveIQ"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Stat Label"}
                data-text="true"
              >
                {"Dual-Surface Bento"}
              </div>
            </div>
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] p-[10px_16px] justify-start items-start bg-[#242427] rounded-[12px]"
              }
              data-pencil-name={"Audit-Proof Code"}
            >
              <div
                className={
                  "text-[16px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Stat Value"}
                data-text="true"
              >
                {"Belum diverifikasi"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Stat Label"}
                data-text="true"
              >
                {"Audit-Proof Code"}
              </div>
            </div>
            <div
              className={
                "box-border w-fit shrink-0 h-fit flex flex-col gap-[2px] p-[10px_16px] justify-start items-start bg-[#242427] rounded-[12px]"
              }
              data-pencil-name={"Filament CMS Engine"}
            >
              <div
                className={
                  "text-[16px]/[normal] box-border text-[#FFFFFF] font-[var(--font-inter),system-ui,sans-serif] font-semibold text-left [white-space:nowrap]"
                }
                data-pencil-name={"Stat Value"}
                data-text="true"
              >
                {"Stack belum ditetapkan"}
              </div>
              <div
                className={
                  "text-[11px]/[normal] box-border text-[#a8a8ad] font-[var(--font-inter),system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
                }
                data-pencil-name={"Stat Label"}
                data-text="true"
              >
                {"Filament CMS Engine"}
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            "box-border w-[780px] shrink-0 h-[324px] flex flex-row gap-[32px] p-[32px] justify-center items-center bg-[#242427] rounded-[16px] mobile-auto-height"
          }
          data-pencil-name={"Logo Card"}
          data-responsive="row"
        >
          <ReferenceImage
            src={"/images/5f9e6a2ac345b8dc.png"}
            alt={"OpenByte Labs"}
            contain={false}
            className={
              "box-border w-[240px] shrink-0 h-[240px]  bg-no-repeat bg-cover bg-center rounded-[28px]"
            }
            data-pencil-name={"Square Icon"}
          />
          <div
            className={
              "box-border w-[480px] shrink-0 h-[140px] flex flex-row gap-0 p-[16px_24px] justify-center items-center bg-[#FFFFFF] rounded-[20px] mobile-auto-height"
            }
            data-pencil-name={"Logo Light Card"}
            data-responsive="fixed"
          >
            <ReferenceImage
              src={"/images/OpenByte%20Labs%20Tech%20Logo-1.png"}
              alt={"OpenByte Labs"}
              contain={true}
              className={
                "box-border w-[385px] shrink-0 h-[100px]  bg-no-repeat bg-contain bg-center"
              }
              data-pencil-name={"Official Brand Logo"}
            />
          </div>
        </div>
      </div>
    </ScreenState>
  );
}
