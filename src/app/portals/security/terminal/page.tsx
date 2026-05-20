import {
  Archive,
  Bell,
  Box,
  Eye,
  FileLock2,
  Lock,
  Printer,
  Radio,
  Send,
  Settings,
  Shield,
  TerminalSquare,
  Users,
} from "lucide-react";
import { transmissions } from "@/lib/terminal-data";
import { cx, terminalTheme } from "@/theme/classes";

const challengeCodes = [
  { label: "BIOHAZARD", icon: Box },
  { label: "OBSERVE", icon: Eye },
  { label: "LOCKDOWN", icon: Lock },
  { label: "ARCHIVE", icon: Archive },
  { label: "CHANNEL", icon: Radio },
  { label: "CLASSIFIED", icon: FileLock2 },
];

export default function Page() {
  return (
    <main className={cx("min-h-dvh overflow-x-hidden", terminalTheme.page)}>
      <header
        className={cx(
          "flex min-h-[74px] flex-col gap-4 border-b px-4 py-4 sm:px-6 lg:grid lg:grid-cols-[minmax(240px,350px)_1fr_auto] lg:items-center lg:px-8",
          terminalTheme.border,
          terminalTheme.panel
        )}
      >
        <h1 className="text-xl font-black tracking-normal sm:text-[26px] sm:tracking-[-0.02em]">
          SITE-19 ADMINISTRATIVE TERMINAL
        </h1>
        <p className={cx("font-mono text-sm sm:text-lg", terminalTheme.accent)}>
          SYSTEM_STATUS:NOMINAL
        </p>
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <Bell className={cx("h-7 w-7", terminalTheme.textDim)} />
          <TerminalSquare className={cx("h-7 w-7", terminalTheme.textDim)} />
          <button
            className={cx(
              "px-7 py-3 font-mono text-base font-black tracking-widest text-white",
              terminalTheme.accentBg
            )}
          >
            LOCKDOWN
          </button>
        </div>
      </header>

      <div className="grid min-h-[calc(100dvh-74px)] lg:grid-cols-[280px_minmax(320px,420px)_1fr] xl:grid-cols-[350px_550px_1fr]">
        <aside
          className={cx(
            "flex min-h-0 flex-col border-b lg:border-r lg:border-b-0",
            terminalTheme.border,
            terminalTheme.panelDeep
          )}
        >
          <section
            className={cx(
              "flex items-center gap-4 border-b px-4 py-6 sm:px-8 sm:py-9",
              terminalTheme.border
            )}
          >
            <div
              className={cx("flex h-14 w-14 items-center justify-center", terminalTheme.accentBg)}
            >
              <Shield className="h-8 w-8 fill-white text-white" />
            </div>
            <div>
              <p className={cx("font-mono text-xs tracking-[0.42em]", terminalTheme.textDim)}>
                ADM. CLEARANCE L5
              </p>
              <p className="mt-2 font-mono text-sm tracking-[0.16em]">SITE-19 SECTOR-01</p>
            </div>
          </section>

          <nav
            className={cx(
              "grid grid-cols-2 py-4 font-mono tracking-[0.16em] sm:tracking-[0.26em] lg:block lg:py-8",
              terminalTheme.textDim
            )}
          >
            <a className="flex items-center gap-3 px-4 py-4 text-xs sm:gap-5 sm:px-8 sm:py-5 sm:text-base">
              <span className="text-xl">!</span>
              DIRECTIVES
            </a>
            <a
              className={cx(
                "border-terminal-accent bg-terminal-accent-strong flex items-center gap-3 border-y px-4 py-4 text-xs font-black text-white sm:gap-5 sm:px-8 sm:py-5 sm:text-base"
              )}
            >
              <Archive className="h-5 w-5 fill-white" />
              ARCHIVE
            </a>
            <a className="flex items-center gap-3 px-4 py-4 text-xs sm:gap-5 sm:px-8 sm:py-5 sm:text-base">
              <Shield className="h-5 w-5" />
              CONTAINMENT LOGS
            </a>
            <a className="flex items-center gap-3 px-4 py-4 text-xs sm:gap-5 sm:px-8 sm:py-5 sm:text-base">
              <Users className="h-5 w-5" />
              PERSONNEL
            </a>
          </nav>

          <div className={cx("mt-auto border-t p-6", terminalTheme.border)}>
            <button
              className={cx(
                "mb-6 w-full px-5 py-4 font-mono text-xs font-black",
                terminalTheme.inverseButton
              )}
            >
              NEW_INCIDENT_LOG
            </button>
            <p
              className={cx(
                "mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.2em]",
                terminalTheme.textDim
              )}
            >
              <Settings className="h-4 w-4" />
              SYSTEM SETTINGS
            </p>
            <p className={cx("font-mono text-xs tracking-[0.2em]", terminalTheme.textDim)}>
              LOGOUT
            </p>
          </div>
        </aside>

        <section
          className={cx(
            "min-h-0 border-b lg:border-r lg:border-b-0",
            terminalTheme.border,
            terminalTheme.panelDeep
          )}
        >
          <div
            className={cx(
              "flex min-h-[74px] flex-wrap items-center justify-between gap-3 border-b px-4 py-4 sm:px-6",
              terminalTheme.border,
              terminalTheme.panelMuted
            )}
          >
            <h2 className="font-mono text-lg font-black tracking-[0.08em] sm:text-2xl sm:tracking-[0.16em]">
              INCOMING_TRANSMISSIONS
            </h2>
            <p className={cx("font-mono text-xs font-bold", terminalTheme.accentMuted)}>
              LIVE_FEED
            </p>
          </div>
          <div>
            {transmissions.map((item) => (
              <article
                key={item.title}
                className={cx(
                  "border-b px-4 py-5 sm:px-7 sm:py-7",
                  terminalTheme.border,
                  item.active
                    ? "bg-terminal-accent-active border-l-4 border-l-white"
                    : "bg-terminal-panel-deep"
                )}
              >
                <div className="mb-4 flex justify-between font-mono text-xs">
                  <p className={item.active ? "text-terminal-accent-muted" : terminalTheme.textDim}>
                    {item.level}
                  </p>
                  <p className={terminalTheme.textDim}>{item.time}</p>
                </div>
                <h3 className="mb-2 text-xl font-black">{item.title}</h3>
                <p className={cx("truncate font-mono text-sm", terminalTheme.textDim)}>
                  {item.body}
                </p>
                {item.active && (
                  <div className="mt-5 flex gap-3">
                    <span className="bg-white/20 px-4 py-2 font-mono text-[10px] font-black">
                      TRANSPORT
                    </span>
                    <span className="bg-white/20 px-4 py-2 font-mono text-[10px] font-black">
                      REQUEST
                    </span>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className={cx("min-h-0 overflow-y-auto", terminalTheme.panel)}>
          <div className={cx("border-b px-4 py-8 sm:px-8 lg:px-11 lg:py-12", terminalTheme.border)}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <p
                className={cx(
                  "font-mono text-xs font-black tracking-[0.5em]",
                  terminalTheme.accent
                )}
              >
                LOGISTICS DIVISION ACCESS AUTHORIZED
              </p>
              <div className="flex gap-3">
                <button
                  className={cx("bg-terminal-tile-hover border p-3", terminalTheme.borderWarm)}
                >
                  <Printer className="h-6 w-6" />
                </button>
                <button
                  className={cx("bg-terminal-tile-hover border p-3", terminalTheme.borderWarm)}
                >
                  <Send className="h-6 w-6" />
                </button>
              </div>
            </div>
            <h2 className="text-2xl font-light tracking-normal sm:text-[40px] sm:tracking-[-0.03em]">
              [업무 요청] SCP 개체 정보 전달 요청
            </h2>
            <div className="mt-8 flex flex-col gap-4 font-mono text-sm xl:flex-row xl:gap-16">
              <p className={cx("border-terminal-accent border-l-2 pl-5", terminalTheme.textDim)}>
                FROM:{" "}
                <span className={cx("ml-5 font-sans", terminalTheme.copyStrong)}>
                  제이크 (수송팀 리더)
                </span>
              </p>
              <p className={cx("border-terminal-accent border-l-2 pl-5", terminalTheme.textDim)}>
                TO:{" "}
                <span className={cx("ml-5", terminalTheme.copyStrong)}>
                  ADMIN_L5@SITE-19.TERMINAL
                </span>
              </p>
            </div>
          </div>

          <div className="mx-4 my-8 max-w-[770px] sm:mx-8 lg:mx-11 lg:my-11">
            <article
              className={cx(
                "border p-5 text-base leading-[1.7] sm:p-9 sm:text-[21px]",
                terminalTheme.borderAlert,
                terminalTheme.accentSoftBg,
                terminalTheme.copy
              )}
            >
              <p>안녕하세요, 수송팀 리더 제이크입니다.</p>
              <p className="mt-6">
                금일 캐나다 지부에서 샌프란시스코 지부로 총 4건의 SCP 개체 수송이 예정되어 있습니다.
                현재 수송 준비 과정에서 일부 개체의 세부 정보 확인이 지연되고 있어, 안전한 수송을
                위해 각 개체에 대한 최신 정보를 요청드립니다.
              </p>
              <p className="mt-6">아래 항목을 포함하여 회신 부탁드립니다.</p>
              <ul className="mt-6 space-y-3 font-mono text-sm sm:text-lg">
                <li>▪ - 개체 등급 (Object Class)</li>
                <li>▪ - 격리 절차 (Special Containment Procedures)</li>
                <li>▪ - 주요 특성 및 위험 요소 (Key Traits/Hazards)</li>
                <li>▪ - 수송 시 유의점 (Transport Precautions)</li>
              </ul>
            </article>

            <aside
              className={cx(
                "border-terminal-accent mt-8 border-l-4 p-5 sm:p-7",
                terminalTheme.panelSoft
              )}
            >
              <h3
                className={cx(
                  "font-mono text-base font-black sm:text-xl",
                  terminalTheme.accentText
                )}
              >
                *** SECURITY ALERT: INTERNAL SYSTEM ANOMALY ***
              </h3>
              <p className={cx("mt-5 text-base leading-7", terminalTheme.copy)}>
                추가로, 최근 내부 시스템에서 일부 SCP 관련 문서 접근 로그가 비정상적으로 기록되는
                사례가 보고되었습니다. 단순 오류로 판단되고 있으나, 관련 문서 열람 시 이상 징후가
                발생할 경우 즉시 관리자에게 보고해 주시기 바랍니다.
              </p>
            </aside>

            <div className="bg-terminal-border my-8 h-px" />

            <section
              className={cx("border p-5 sm:p-8", terminalTheme.border, terminalTheme.panelDeep)}
            >
              <div className="mb-8 flex items-center gap-4">
                <Shield className={cx("h-4 w-4", terminalTheme.accentText)} />
                <h3 className="font-mono text-sm font-black tracking-[0.45em]">
                  SECURITY_CHALLENGE
                </h3>
              </div>
              <p className={cx("mb-8 text-sm", terminalTheme.textMuted)}>
                안전한 수송을 위한 보안 승인 코드를 선택하십시오 (4개 선택 필요)
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {challengeCodes.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    className={cx(
                      "flex aspect-square min-h-28 flex-col items-center justify-center gap-3 px-2 text-center sm:gap-4",
                      terminalTheme.tile
                    )}
                  >
                    <Icon className="h-9 w-9" />
                    <span className="font-mono text-xs tracking-[0.22em]">{label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
