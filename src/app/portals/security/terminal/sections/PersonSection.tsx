"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cx } from "@/theme/classes";

type Person = {
  id: string;
  rank: string;
  name: string;
  callNum: string;
  isPlayer?: boolean;
  position: string;
  department: string;
  clearance: string;
  status: string;
  bio: string;
  imageSrc?: string;
};

const leader: Person = {
  id: "daniel_weber",
  rank: "LEADER",
  name: "DANIEL K. WEBER",
  callNum: "09-459273",
  position: "Security Division Director",
  department: "SECURITY // SITE-15",
  clearance: "LEVEL 5",
  status: "ACTIVE",
  bio: "Site-15 전체 격리 운영을 총괄. 1982년 EG Company 합류 후 보안 부문 최고위직 역임. 격리 실패 사고 대응 및 내부 보안 프로토콜 설계의 핵심 책임자.",
  imageSrc: "/eg_png/personnel/daniel_weber.png",
};

const seniorStaff: Person[] = [
  {
    id: "lee_so_yeon",
    rank: "SENIOR STAFF",
    name: "LEE SO-YEON",
    callNum: "09-905316",
    position: "Senior Containment Specialist",
    department: "RESEARCH // CONTAINMENT",
    clearance: "LEVEL 4",
    status: "ACTIVE",
    bio: "격리 절차 설계 및 개체 행동 패턴 분석 전문가. WESEN-783 최초 보고자. 장기 격리 대상 전담 연구를 수행 중.",
    imageSrc: "/eg_png/personnel/lee_so_yeon.png",
  },
  {
    id: "marcus_hale",
    rank: "SENIOR STAFF",
    name: "MARCUS HALE",
    callNum: "09-274859",
    position: "Research Coordinator",
    department: "RESEARCH // ANALYSIS",
    clearance: "LEVEL 4",
    status: "ACTIVE",
    bio: "개체 접촉 로그 및 인지 위협 데이터 통합 관리 담당. 3차 누출 사고 이후 데이터 폐기 절차를 직접 집행했으며, 해당 기록 일부 열람 권한 보유.",
    imageSrc: "/eg_png/personnel/marcus_hale.png",
  },
  {
    id: "park_min_ho",
    rank: "SENIOR STAFF",
    name: "PARK MIN-HO",
    callNum: "09-618042",
    position: "Field Operations Lead",
    department: "SECURITY // FIELD",
    clearance: "LEVEL 4",
    status: "ACTIVE",
    bio: "현장 대응 팀 지휘 및 개체 수송 보안 총괄. 캐나다 지부 운송 사고 당시 현장 지원 인원 파견을 승인한 책임자.",
    imageSrc: "/eg_png/personnel/park_min_ho.png",
  },
];

const juniorStaff: Person[] = [
  {
    id: "kim_do_yun",
    rank: "JUNIOR STAFF",
    name: "KIM DO-YUN",
    callNum: "09-483721",
    position: "Containment Analyst",
    department: "RESEARCH // ANALYSIS",
    clearance: "LEVEL 2",
    status: "ACTIVE",
    bio: "격리 데이터 분석 및 일일 상태 보고서 작성 담당. 최근 내부 시스템 접근 로그 비정상 기록 건으로 보안팀 조사 대상.",
    imageSrc: "/eg_png/personnel/kim_do_yun.png",
  },
  {
    id: "han_ji_woo",
    rank: "JUNIOR STAFF",
    name: "HAN JI-WOO",
    callNum: "09-739165",
    position: "Systems Monitor",
    department: "SECURITY // MONITORING",
    clearance: "LEVEL 2",
    status: "ACTIVE",
    bio: "내부 감시 시스템 및 CCTV 운영 담당. WESEN-783 보관실 카메라 자동 초점 이상 현상을 최초 보고.",
    imageSrc: "/eg_png/personnel/han_ji_woo.png",
  },
  {
    id: "player",
    rank: "JUNIOR STAFF",
    name: "",
    callNum: "09-152984",
    isPlayer: true,
    position: "Junior Administrator",
    department: "SECURITY // ADMIN",
    clearance: "LEVEL 2",
    status: "MONITORING",
    bio: "신규 관리자 테스트 통과 후 배치. 현재 내부 보안 시스템 열람 권한 부여 상태. 접근 이력 모니터링 중.",
    imageSrc: "/eg_png/personnel/player.png",
  },
  {
    id: "elena_kovac",
    rank: "JUNIOR STAFF",
    name: "ELENA KOVAC",
    callNum: "09-867203",
    position: "Documentation Specialist",
    department: "RESEARCH // RECORDS",
    clearance: "LEVEL 2",
    status: "ACTIVE",
    bio: "개체 문서화 및 아카이브 관리 담당. WESEN-0101 관련 내부 기록 접근 이력 보유. 최근 위치 데이터 이상 보고 접수.",
    imageSrc: "/eg_png/personnel/elena_kovac.png",
  },
];

const RANK_COLOR: Record<string, string> = {
  LEADER: "border-terminal-accent text-terminal-accent",
  "SENIOR STAFF": "border-[#d09a00] text-[#d09a00]",
  "JUNIOR STAFF": "border-terminal-text-dim text-terminal-text-dim",
};

function PersonCard({
  person,
  userName,
  onClick,
}: {
  person: Person;
  userName: string;
  onClick: () => void;
}) {
  const isPlayer = !!person.isPlayer;
  const displayName = isPlayer ? userName : person.name;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full border bg-[#1a1a1a] p-4 text-left transition-all duration-200 sm:p-5",
        "hover:bg-[#242424]",
        isPlayer
          ? "border-terminal-accent hover:shadow-[0_0_12px_rgba(176,0,0,0.25)]"
          : "border-terminal-border hover:border-terminal-text-dim"
      )}
    >
      <div className="mb-3">
        <p
          className={cx(
            "font-mono text-[10px] font-black tracking-[0.2em]",
            isPlayer ? "text-terminal-accent" : "text-terminal-text-dim"
          )}
        >
          {person.rank}
        </p>
      </div>
      <h3
        className={cx(
          "text-base font-black tracking-wide sm:text-lg",
          isPlayer ? "text-terminal-accent-muted" : "text-white"
        )}
      >
        {displayName || "(PLAYER)"}
      </h3>
      <p className="text-terminal-text-dim mt-2 font-mono text-[10px] tracking-[0.12em]">
        CALL NUM: {person.callNum}
      </p>
    </button>
  );
}

function PersonModal({
  person,
  userName,
  onClose,
}: {
  person: Person;
  userName: string;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const isPlayer = !!person.isPlayer;
  const displayName = isPlayer ? (userName || "(PLAYER)") : person.name;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
    >
      <div
        className={cx(
          "relative w-full max-w-2xl border bg-[#080808] shadow-[0_0_60px_rgba(0,0,0,0.8)]",
          isPlayer ? "border-terminal-accent" : "border-terminal-border"
        )}
      >
        {/* 스캔라인 오버레이 */}
        <div className="tv-scanlines pointer-events-none absolute inset-0 z-20" />
        {/* 노이즈 오버레이 */}
        <div className="tv-static-overlay pointer-events-none absolute inset-0 z-20 opacity-60" />
        {/* 인터퍼런스 바 */}
        <div className="tv-interference-bar z-20" />

        {/* 헤더 */}
        <div className="relative z-30 flex items-center justify-between border-b border-terminal-border bg-[#0d0d0d] px-5 py-3">
          <p className="font-mono text-[9px] font-black tracking-[0.34em] text-terminal-text-dim">
            PERSONNEL_FILE // SITE-15
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-terminal-text-dim hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 본문 */}
        <div className="relative z-30 grid sm:grid-cols-[200px_1fr]">
          {/* 사진 영역 */}
          <div className="tv-screen relative aspect-square overflow-hidden border-b border-terminal-border bg-[#0d0d0d] sm:aspect-auto sm:border-b-0 sm:border-r">
            <div className="tv-static-overlay pointer-events-none absolute inset-0 z-10 opacity-40" />
            <div className="tv-scanlines pointer-events-none absolute inset-0 z-10" />
            {person.imageSrc ? (
              <Image
                src={person.imageSrc}
                alt={displayName}
                fill
                sizes="200px"
                className="object-cover grayscale"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            {/* 이미지 없을 때 폴백 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-mono text-[9px] text-terminal-text-dim tracking-[0.2em] opacity-40">
                NO_SIGNAL
              </p>
            </div>
            {/* 하단 ID 레이블 */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/70 px-3 py-1.5">
              <p className="font-mono text-[8px] tracking-[0.2em] text-terminal-text-dim">
                ID: {person.callNum}
              </p>
            </div>
          </div>

          {/* 정보 */}
          <div className="p-5 sm:p-6">
            {/* 직급 뱃지 */}
            <span
              className={cx(
                "inline-block border px-2 py-0.5 font-mono text-[9px] font-black tracking-[0.2em]",
                RANK_COLOR[person.rank] ?? "border-terminal-text-dim text-terminal-text-dim"
              )}
            >
              {person.rank}
            </span>

            {/* 이름 */}
            <h2
              className={cx(
                "mt-3 text-xl font-black tracking-tight sm:text-2xl",
                isPlayer ? "text-terminal-accent-muted" : "text-white"
              )}
            >
              {displayName}
            </h2>

            {/* 직위 */}
            <p className="text-terminal-text-muted mt-1 text-sm">{person.position}</p>

            <div className="border-terminal-border mt-4 border-t pt-4 space-y-2 font-mono text-[10px] tracking-[0.14em]">
              <div className="flex justify-between">
                <span className="text-terminal-text-dim">DEPT</span>
                <span className="text-terminal-copy-strong">{person.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-terminal-text-dim">CLEARANCE</span>
                <span
                  className={cx(
                    "font-black",
                    person.clearance === "LEVEL 5"
                      ? "text-terminal-accent-text"
                      : person.clearance === "LEVEL 4"
                        ? "text-[#d09a00]"
                        : "text-terminal-text-muted"
                  )}
                >
                  {person.clearance}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-terminal-text-dim">STATUS</span>
                <span
                  className={cx(
                    "font-black",
                    person.status === "MONITORING"
                      ? "text-terminal-accent animate-pulse"
                      : "text-terminal-accent-muted"
                  )}
                >
                  {person.status}
                </span>
              </div>
            </div>

            {/* 바이오 */}
            <div className="border-terminal-border mt-4 border-t pt-4">
              <p className="text-terminal-text-dim mb-2 font-mono text-[9px] tracking-[0.22em]">
                PERSONNEL_NOTE
              </p>
              <p className="text-terminal-text-muted text-xs leading-6">{person.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PersonSection({ userName }: { userName: string }) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <section className="min-h-0 overflow-y-auto bg-[#080808] px-5 py-8 lg:px-10">
      {/* 헤더 */}
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl lg:text-3xl">
            PERSONNEL SECURITY PART
          </h2>
          <p className="text-terminal-text-dim mt-1 font-mono text-[10px] tracking-[0.18em]">
            SECTOR-01 / RESPONSE UNIT ALPHA
          </p>
        </div>
        <div className="text-right font-mono">
          <p className="text-terminal-accent text-[10px] font-black tracking-[0.22em]">
            ACCESS: GRANTED
          </p>
          <p className="text-terminal-text-dim mt-1 text-[9px] tracking-[0.12em]">
            TS: 2024.11.23_14:22:09
          </p>
        </div>
      </div>

      {/* 조직도 */}
      <div className="mx-auto max-w-4xl">
        {/* LEADER */}
        <div className="flex justify-center">
          <div className="w-64 sm:w-72 lg:w-80">
            <PersonCard
              person={leader}
              userName={userName}
              onClick={() => setSelectedPerson(leader)}
            />
          </div>
        </div>

        {/* Leader → Senior 수직선 */}
        <div className="flex justify-center">
          <div className="h-8 w-px bg-[#2a2a2a]" />
        </div>

        {/* Senior 수평선 + 수직선 */}
        <div className="relative">
          <div className="absolute top-0 left-[17%] right-[17%] h-px bg-[#2a2a2a]" />
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {seniorStaff.map((person) => (
              <div key={person.id} className="flex flex-col items-center">
                <div className="h-8 w-px bg-[#2a2a2a]" />
                <div className="w-full">
                  <PersonCard
                    person={person}
                    userName={userName}
                    onClick={() => setSelectedPerson(person)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Senior → Junior 수직선 */}
        <div className="flex justify-center">
          <div className="h-8 w-px bg-[#2a2a2a]" />
        </div>

        {/* Junior 수평선 + 수직선 */}
        <div className="relative">
          <div className="absolute top-0 left-[9%] right-[9%] h-px bg-[#2a2a2a]" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {juniorStaff.map((person) => (
              <div key={person.id} className="flex flex-col items-center">
                <div className="h-8 w-px bg-[#2a2a2a]" />
                <div className="w-full">
                  <PersonCard
                    person={person}
                    userName={userName}
                    onClick={() => setSelectedPerson(person)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 모달 */}
      {selectedPerson && (
        <PersonModal
          person={selectedPerson}
          userName={userName}
          onClose={() => setSelectedPerson(null)}
        />
      )}
    </section>
  );
}
