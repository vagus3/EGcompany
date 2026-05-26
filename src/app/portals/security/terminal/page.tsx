"use client";

import { useState } from "react";
import {
  Archive,
  Bell,
  Box,
  Camera,
  Eye,
  FileLock2,
  KeyRound,
  Lock,
  LogOut,
  Printer,
  Radio,
  Send,
  Settings,
  Shield,
  Skull,
  TerminalSquare,
  TriangleAlert,
  Users,
} from "lucide-react";

const challengeCodes = [
  { label: "BIOHAZARD", icon: Box },
  { label: "OBSERVE", icon: Eye },
  { label: "LOCKDOWN", icon: Lock },
  { label: "ARCHIVE", icon: Archive },
  { label: "CHANNEL", icon: Radio },
  { label: "CLASSIFIED", icon: FileLock2 },
];

const archiveItems = [
  { id: "WESEN-096", icon: Skull },
  { id: "WESEN-783", icon: Eye },
  { id: "WESEN-1744", icon: KeyRound, active: true },
  { id: "WESEN-0491", icon: Lock },
  { id: "WESEN-106", icon: Camera },
  { id: "WESEN-392", icon: Shield },
  { id: "WESEN-9428", icon: TriangleAlert },
  { id: "WESEN-0101", icon: TerminalSquare },
];

export default function Page() {
  const [activeSection, setActiveSection] = useState<"messenger" | "archive">("messenger");
  const isArchiveOpen = activeSection === "archive";

  return (
    <main className="min-h-screen overflow-hidden bg-[#101010] text-[#f2f0ec]">
      <header className="grid h-[74px] grid-cols-[350px_1fr_auto] items-center border-b border-[#2b2b2b] bg-[#151515] px-8">
        <h1 className="text-[26px] font-black tracking-[-0.02em]">
          {isArchiveOpen ? "SECURITY_15" : "SITE-19 ADMINISTRATIVE TERMINAL"}
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

      <div
        className={`grid h-[calc(100vh-74px)] ${
          isArchiveOpen ? "grid-cols-[350px_220px_1fr]" : "grid-cols-[350px_550px_1fr]"
        }`}
      >
        <aside className="flex min-h-0 flex-col border-r border-[#2b2b2b] bg-[#101111]">
          <section className="flex items-center gap-4 border-b border-[#2b2b2b] px-8 py-9">
            <div className="flex h-14 w-14 items-center justify-center bg-[#a30000]">
              <Shield className="h-8 w-8 fill-white text-white" />
            </div>
            <div>
              <p className="font-mono text-xs tracking-[0.42em] text-slate-500">
                ADM. CLEARANCE L5
              </p>
              <p className="mt-2 font-mono text-sm tracking-[0.16em]">SITE-19 SECTOR-01</p>
            </div>
          </section>

          <nav className="py-8 font-mono tracking-[0.26em] text-slate-500">
            <button
              className="flex w-full items-center gap-5 px-8 py-5 text-left text-base"
              onClick={() => setActiveSection("messenger")}
              type="button"
            >
              <span className="text-xl">!</span>
              DIRECTIVES
            </button>
            <button
              className={`flex w-full items-center gap-5 border-y px-8 py-5 text-left text-base font-black ${
                isArchiveOpen
                  ? "border-[#711] bg-[#9b0000] text-white"
                  : "border-transparent text-slate-500"
              }`}
              onClick={() => setActiveSection("archive")}
              type="button"
            >
              <Archive className="h-5 w-5 fill-white" />
              ARCHIVE
            </button>
            <button
              className="flex w-full items-center gap-5 px-8 py-5 text-left text-base"
              type="button"
            >
              <Shield className="h-5 w-5" />
              CONTAINMENT LOGS
            </button>
            <button
              className="flex w-full items-center gap-5 px-8 py-5 text-left text-base"
              type="button"
            >
              <Users className="h-5 w-5" />
              PERSONNEL
            </button>
          </nav>

          <div className="mt-auto border-t border-[#2b2b2b] p-6">
            <button className="mb-6 w-full bg-white px-5 py-4 font-mono text-xs font-black text-black">
              NEW_INCIDENT_LOG
            </button>
            <p className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-slate-500">
              <Settings className="h-4 w-4" />
              SYSTEM SETTINGS
            </p>
            <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-slate-500">
              <LogOut className="h-4 w-4" />
              LOGOUT
            </p>
          </div>
        </aside>

        {isArchiveOpen ? <ArchiveMenu /> : <TransmissionList />}

        {isArchiveOpen ? (
          <ArchiveDetail />
        ) : (
          <section className="min-h-0 overflow-y-auto bg-[#151515]">
            <div className="border-b border-[#2b2b2b] px-11 py-12">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-xs font-black tracking-[0.5em] text-[#b00000]">
                  LOGISTICS DIVISION ACCESS AUTHORIZED
                </p>
                <div className="flex gap-3">
                  <button className="border border-[#604844] bg-[#3a302e] p-3" type="button">
                    <Printer className="h-6 w-6" />
                  </button>
                  <button className="border border-[#604844] bg-[#3a302e] p-3" type="button">
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
                  금일 캐나다 지부에서 샌프란시스코 지부로 총 4건의 SCP 개체 수송이 예정되어
                  있습니다. 현재 수송 준비 과정에서 일부 개체의 세부 정보 확인이 지연되고 있어,
                  안전한 수송을 위해 각 개체에 대한 최신 정보를 요청드립니다.
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
                  추가로, 최근 내부 시스템에서 일부 SCP 관련 문서 접근 로그가 비정상적으로 기록되는
                  사례가 보고되었습니다. 단순 오류로 판단되고 있으나, 관련 문서 열람 시 이상 징후가
                  발생할 경우 즉시 관리자에게 보고해 주시기 바랍니다.
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
                      type="button"
                    >
                      <Icon className="h-9 w-9" />
                      <span className="font-mono text-xs tracking-[0.22em]">{label}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function TransmissionList() {
  return (
    <section className="min-h-0 border-r border-[#2b2b2b] bg-[#0d0e0e]">
      <div className="flex h-[74px] items-center justify-between border-b border-[#2b2b2b] bg-[#1d1d1d] px-6">
        <h2 className="font-mono text-2xl font-black tracking-[0.16em]">INCOMING_TRANSMISSIONS</h2>
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
  );
}

function ArchiveMenu() {
  return (
    <section className="min-h-0 border-r border-[#242424] bg-[#151515] pt-5">
      <div className="space-y-1 font-mono text-sm font-black">
        {archiveItems.map(({ id, icon: Icon, active }) => (
          <button
            className={`flex h-[58px] w-full items-center gap-4 px-5 text-left ${
              active ? "bg-[#a00000] text-white" : "text-[#d6d6d6] hover:bg-[#202020]"
            }`}
            key={id}
            type="button"
          >
            <Icon className="h-7 w-7 shrink-0" />
            <span>{id}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ArchiveDetail() {
  return (
    <section className="min-h-0 overflow-y-auto bg-[#0b0c0c] px-11 py-10">
      <div className="mb-9 border-[6px] border-[#1e1e1e] border-l-[#b00000] bg-[#131313] px-10 py-10">
        <h2 className="font-mono text-[42px] font-black tracking-[0.08em] text-[#f1eee8]">
          WESEN-1744
        </h2>
        <p className="mt-3 font-mono text-2xl font-black text-[#b00000]">SAFETY LEVEL: 1</p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_346px] gap-9">
        <div className="space-y-8">
          <article className="bg-[#202020] p-8">
            <h3 className="border-b border-[#674440] pb-3 text-3xl font-black text-[#b00000]">
              The Borrowed Key
            </h3>
            <p className="mt-6 text-xl leading-9 text-[#d8d2ce]">
              WESEN-1744는 금속 재질의 고전식 열쇠 형태의 개체이다. 외형은 단순하지만, “존재하지
              않는 잠금장치”에도 대응하는 특성을 가진다.
            </p>
            <p className="mt-5 text-xl leading-9 text-[#d8d2ce]">
              이 개체는 사용자가 인식하고 있는 “열려야 하는 대상”에 반응하여 해당 대상의 잠금 상태를
              해제한다.
            </p>
          </article>

          <article className="bg-[#202020] p-8">
            <h3 className="border-b border-[#674440] pb-4 font-mono text-2xl font-black text-[#e0bcb7]">
              SPECIAL CONTAINMENT PROCEDURES
            </h3>
            <ol className="mt-6 space-y-5 text-lg text-[#d8d2ce]">
              <li className="grid grid-cols-[32px_1fr] gap-5">
                <span className="font-mono text-sm font-black text-[#b00000]">01</span>
                실제 자물쇠가 없어도 작동하며, 디지털 시스템에도 적용된다.
              </li>
              <li className="grid grid-cols-[32px_1fr] gap-5">
                <span className="font-mono text-sm font-black text-[#b00000]">02</span>
                사용 시, 열리는 대상은 항상 하나로 고정되지 않는다. 사용 시 주의를 요함.
              </li>
            </ol>
          </article>

          <article className="bg-[#202020] p-8">
            <h3 className="border-b border-[#674440] pb-4 text-2xl font-black text-[#e0bcb7]">
              Containment Status
            </h3>
            <p className="mt-6 text-xl leading-9 text-[#d8d2ce]">
              현재 EG Lap 03-27 창고에 보관 중. 필요 시 담당자에게 권한 요청 바람. 하급 사원이 해당
              개체 이용해서 부적절한 상급 부서 접촉 적발 시, 징계 처리함.
            </p>
          </article>
        </div>

        <aside className="bg-[#222] p-6">
          <div className="flex aspect-square items-center justify-center bg-[radial-gradient(circle_at_35%_25%,#344044,#121719_58%,#090b0c)]">
            <KeyRound className="h-40 w-40 rotate-[-28deg] text-[#c8c2b8]" strokeWidth={1.4} />
          </div>
          <p className="mt-4 inline-block bg-[#121212] px-2 py-1 font-mono text-[10px] font-black">
            WES_1744.JPG
          </p>

          <div className="mt-14 px-8">
            <h3 className="font-mono text-base font-black text-[#b00000]">SECURITY_READOUT</h3>
            <dl className="mt-7 space-y-0 font-mono text-[10px]">
              {[
                ["LAST KNOWN LOCATION", "SEOUL, KR"],
                ["BEHAVIOR_PROFILE", "KEY-RESPONSIVE"],
                ["COGNITIVE_THREAT", "NONE_DETECTED"],
                ["ACCESS_ANOMALY", "CONFIRMED"],
              ].map(([label, value]) => (
                <div className="flex justify-between border-b border-[#34302f] py-4" key={label}>
                  <dt className="text-[#595959]">{label}</dt>
                  <dd className={value === "CONFIRMED" ? "text-[#b00000]" : "text-[#d8d2ce]"}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 h-1.5 bg-[#111]">
              <div className="h-full w-[82%] bg-[#b00000]" />
            </div>
            <p className="mt-3 text-right font-mono text-[9px] text-[#4c4c4c]">
              CONTAINMENT_INTEGRITY: 82%
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
