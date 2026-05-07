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

const transmissions = [
  {
    level: "INTERNAL // LOGISTICS",
    time: "16:45:12 ZULU",
    title: "[업무 요청] SCP 개체 정보 전달 요청",
    body: "안녕하세요, 수송팀 리더 제이크입니다. 금일 캐나다 지부에서...",
    active: true,
  },
  {
    level: "URGENT // LEVEL 5",
    time: "14:22:09 ZULU",
    title: "SCP-682 CONTAINMENT BREACH: URGENT",
    body: "Security protocols bypassed. Sector-04 compromised. I...",
  },
  {
    level: "INTERNAL // STAFFING",
    time: "12:15:33 ZULU",
    title: "Site-19 Personnel Reassignment",
    body: "Following the recent incidents in Sector-01, personne...",
  },
  {
    level: "ENCRYPTED // O5-DIRECTIVE",
    time: "09:02:11 ZULU",
    title: "Directives from O5-Council",
    body: "Authorization required for Project [REDACTED] impleme...",
  },
];

const challengeCodes = [
  { label: "BIOHAZARD", icon: Box },
  { label: "OBSERVE", icon: Eye },
  { label: "LOCKDOWN", icon: Lock },
  { label: "ARCHIVE", icon: Archive },
  { label: "CHANNEL", icon: Radio },
  { label: "CLASSIFIED", icon: FileLock2 },
];

export default function SecurityTerminalPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#101010] text-[#f2f0ec]">
      <header className="grid h-[74px] grid-cols-[350px_1fr_auto] items-center border-b border-[#2b2b2b] bg-[#151515] px-8">
        <h1 className="text-[26px] font-black tracking-[-0.02em]">
          SITE-19 ADMINISTRATIVE TERMINAL
        </h1>
        <p className="font-mono text-lg text-[#b00000]">SYSTEM_STATUS:NOMINAL</p>
        <div className="flex items-center gap-5">
          <Bell className="h-7 w-7 text-slate-500" />
          <TerminalSquare className="h-7 w-7 text-slate-500" />
          <button className="bg-[#9d0000] px-7 py-3 font-mono text-base font-black tracking-widest text-white">
            LOCKDOWN
          </button>
        </div>
      </header>

      <div className="grid h-[calc(100vh-74px)] grid-cols-[350px_550px_1fr]">
        <aside className="flex min-h-0 flex-col border-r border-[#2b2b2b] bg-[#101111]">
          <section className="flex items-center gap-4 border-b border-[#2b2b2b] px-8 py-9">
            <div className="flex h-14 w-14 items-center justify-center bg-[#a30000]">
              <Shield className="h-8 w-8 fill-white text-white" />
            </div>
            <div>
              <p className="font-mono text-xs tracking-[0.42em] text-slate-500">
                ADM. CLEARANCE L5
              </p>
              <p className="mt-2 font-mono text-sm tracking-[0.16em]">
                SITE-19 SECTOR-01
              </p>
            </div>
          </section>

          <nav className="py-8 font-mono tracking-[0.26em] text-slate-500">
            <a className="flex items-center gap-5 px-8 py-5 text-base">
              <span className="text-xl">!</span>
              DIRECTIVES
            </a>
            <a className="flex items-center gap-5 border-y border-[#711] bg-[#9b0000] px-8 py-5 text-base font-black text-white">
              <Archive className="h-5 w-5 fill-white" />
              ARCHIVE
            </a>
            <a className="flex items-center gap-5 px-8 py-5 text-base">
              <Shield className="h-5 w-5" />
              CONTAINMENT LOGS
            </a>
            <a className="flex items-center gap-5 px-8 py-5 text-base">
              <Users className="h-5 w-5" />
              PERSONNEL
            </a>
          </nav>

          <div className="mt-auto border-t border-[#2b2b2b] p-6">
            <button className="mb-6 w-full bg-white px-5 py-4 font-mono text-xs font-black text-black">
              NEW_INCIDENT_LOG
            </button>
            <p className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-slate-500">
              <Settings className="h-4 w-4" />
              SYSTEM SETTINGS
            </p>
            <p className="font-mono text-xs tracking-[0.2em] text-slate-500">LOGOUT</p>
          </div>
        </aside>

        <section className="min-h-0 border-r border-[#2b2b2b] bg-[#0d0e0e]">
          <div className="flex h-[74px] items-center justify-between border-b border-[#2b2b2b] bg-[#1d1d1d] px-6">
            <h2 className="font-mono text-2xl font-black tracking-[0.16em]">
              INCOMING_TRANSMISSIONS
            </h2>
            <p className="font-mono text-xs font-bold text-[#e5aaa0]">LIVE_FEED</p>
          </div>
          <div>
            {transmissions.map((item) => (
              <article
                key={item.title}
                className={`border-b border-[#2b2b2b] px-7 py-7 ${
                  item.active ? "border-l-4 border-l-white bg-[#a00000]" : "bg-[#0b0c0c]"
                }`}
              >
                <div className="mb-4 flex justify-between font-mono text-xs">
                  <p className={item.active ? "text-[#efb2aa]" : "text-slate-600"}>{item.level}</p>
                  <p className="text-slate-500">{item.time}</p>
                </div>
                <h3 className="mb-2 text-xl font-black">{item.title}</h3>
                <p className="truncate font-mono text-sm text-slate-500">{item.body}</p>
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

        <section className="min-h-0 overflow-y-auto bg-[#151515]">
          <div className="border-b border-[#2b2b2b] px-11 py-12">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-xs font-black tracking-[0.5em] text-[#b00000]">
                LOGISTICS DIVISION ACCESS AUTHORIZED
              </p>
              <div className="flex gap-3">
                <button className="border border-[#604844] bg-[#3a302e] p-3">
                  <Printer className="h-6 w-6" />
                </button>
                <button className="border border-[#604844] bg-[#3a302e] p-3">
                  <Send className="h-6 w-6" />
                </button>
              </div>
            </div>
            <h2 className="text-[40px] font-light tracking-[-0.03em]">
              [업무 요청] SCP 개체 정보 전달 요청
            </h2>
            <div className="mt-8 flex gap-16 font-mono text-sm">
              <p className="border-l-2 border-[#b00000] pl-5 text-slate-500">
                FROM: <span className="ml-5 font-sans text-[#d8d2ce]">제이크 (수송팀 리더)</span>
              </p>
              <p className="border-l-2 border-[#b00000] pl-5 text-slate-500">
                TO: <span className="ml-5 text-[#d8d2ce]">ADMIN_L5@SITE-19.TERMINAL</span>
              </p>
            </div>
          </div>

          <div className="mx-11 my-11 max-w-[770px]">
            <article className="border border-[#4b1111] bg-[#1b1111] p-9 text-[21px] leading-[1.7] text-[#d6c8c2]">
              <p>안녕하세요, 수송팀 리더 제이크입니다.</p>
              <p className="mt-6">
                금일 캐나다 지부에서 샌프란시스코 지부로 총 4건의 SCP 개체 수송이
                예정되어 있습니다. 현재 수송 준비 과정에서 일부 개체의 세부 정보
                확인이 지연되고 있어, 안전한 수송을 위해 각 개체에 대한 최신 정보를
                요청드립니다.
              </p>
              <p className="mt-6">아래 항목을 포함하여 회신 부탁드립니다.</p>
              <ul className="mt-6 space-y-3 font-mono text-lg">
                <li>▪ - 개체 등급 (Object Class)</li>
                <li>▪ - 격리 절차 (Special Containment Procedures)</li>
                <li>▪ - 주요 특성 및 위험 요소 (Key Traits/Hazards)</li>
                <li>▪ - 수송 시 유의점 (Transport Precautions)</li>
              </ul>
            </article>

            <aside className="mt-8 border-l-4 border-[#b00000] bg-[#1f1f1f] p-7">
              <h3 className="font-mono text-xl font-black text-[#ffc0b8]">
                *** SECURITY ALERT: INTERNAL SYSTEM ANOMALY ***
              </h3>
              <p className="mt-5 text-base leading-7 text-[#d6c8c2]">
                추가로, 최근 내부 시스템에서 일부 SCP 관련 문서 접근 로그가 비정상적으로
                기록되는 사례가 보고되었습니다. 단순 오류로 판단되고 있으나, 관련 문서
                열람 시 이상 징후가 발생할 경우 즉시 관리자에게 보고해 주시기 바랍니다.
              </p>
            </aside>

            <div className="my-8 h-px bg-[#333]" />

            <section className="border border-[#333] bg-[#0f1010] p-8">
              <div className="mb-8 flex items-center gap-4">
                <Shield className="h-4 w-4 text-[#ffc0b8]" />
                <h3 className="font-mono text-sm font-black tracking-[0.45em]">
                  SECURITY_CHALLENGE
                </h3>
              </div>
              <p className="mb-8 text-sm text-slate-400">
                안전한 수송을 위한 보안 승인 코드를 선택하십시오 (4개 선택 필요)
              </p>
              <div className="grid grid-cols-3 gap-4">
                {challengeCodes.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    className="flex aspect-square flex-col items-center justify-center gap-4 bg-[#2c2c2c] text-slate-500 transition-colors hover:bg-[#3a3a3a] hover:text-white"
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
