"use client";

import { MapPin, FileText, Shield, Trash2 } from "lucide-react";
import { cx } from "@/theme/classes";

type Person = {
  rank: string;
  name: string;
  callNum: string;
  isPlayer?: boolean;
  icon?: "pin" | "file" | "shield" | "trash";
};

const leader: Person = {
  rank: "LEADER",
  name: "DANIEL K. WEBER",
  callNum: "09-459273",
  icon: "pin",
};

const seniorStaff: Person[] = [
  { rank: "SENIOR STAFF", name: "LEE SO-YEON", callNum: "09-905316", icon: "file" },
  { rank: "SENIOR STAFF", name: "MARCUS HALE", callNum: "09-274859", icon: "shield" },
  { rank: "SENIOR STAFF", name: "PARK MIN-HO", callNum: "09-618042", icon: "trash" },
];

const juniorStaff: Person[] = [
  { rank: "JUNIOR STAFF", name: "KIM DO-YUN", callNum: "09-483721" },
  { rank: "JUNIOR STAFF", name: "HAN JI-WOO", callNum: "09-739165" },
  { rank: "JUNIOR STAFF", name: "", callNum: "09-152984", isPlayer: true },
  { rank: "JUNIOR STAFF", name: "ELENA KOVAC", callNum: "09-867203" },
];

function PersonIcon({ type, className }: { type?: Person["icon"]; className?: string }) {
  switch (type) {
    case "pin":    return <MapPin className={className} />;
    case "file":   return <FileText className={className} />;
    case "shield": return <Shield className={className} />;
    case "trash":  return <Trash2 className={className} />;
    default:       return null;
  }
}

function PersonCard({ person, userName }: { person: Person; userName: string }) {
  const isPlayer = !!person.isPlayer;
  const displayName = isPlayer ? userName : person.name;

  return (
    <div
      className={cx(
        "border bg-[#1a1a1a] p-4 sm:p-5",
        isPlayer ? "border-terminal-accent" : "border-terminal-border"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <p
          className={cx(
            "font-mono text-[10px] font-black tracking-[0.2em]",
            isPlayer ? "text-terminal-accent" : "text-terminal-text-dim"
          )}
        >
          {person.rank}
        </p>
        <PersonIcon
          type={person.icon}
          className={cx(
            "h-3.5 w-3.5 shrink-0",
            isPlayer ? "text-terminal-accent" : "text-terminal-text-dim"
          )}
        />
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
    </div>
  );
}

export function PersonSection({ userName }: { userName: string }) {
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
            <PersonCard person={leader} userName={userName} />
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
              <div key={person.name} className="flex flex-col items-center">
                <div className="h-8 w-px bg-[#2a2a2a]" />
                <div className="w-full">
                  <PersonCard person={person} userName={userName} />
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
            {juniorStaff.map((person, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-8 w-px bg-[#2a2a2a]" />
                <div className="w-full">
                  <PersonCard person={person} userName={userName} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
