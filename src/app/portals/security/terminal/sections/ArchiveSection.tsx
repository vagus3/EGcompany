"use client";

import Image from "next/image";
import {
  Archive,
  Camera,
  Eye,
  KeyRound,
  Lock,
  Shield,
  Skull,
  TerminalSquare,
  TriangleAlert,
} from "lucide-react";
import { terminalObjects, type TerminalObjectEntry } from "@/lib/terminal-data";
import { cx } from "@/theme/classes";

export function ObjectSymbolIcon({ symbol, className }: { symbol: string; className?: string }) {
  switch (symbol) {
    case "OBSERVE":
      return <Eye className={className} />;
    case "TRACE":
      return <Shield className={className} />;
    case "KEY":
      return <KeyRound className={className} />;
    case "LOCK":
      return <Lock className={className} />;
    case "OPEN":
      return <Camera className={className} />;
    case "FALSE":
      return <Skull className={className} />;
    case "ARCHIVE":
      return <TriangleAlert className={className} />;
    case "CHANNEL":
      return <TerminalSquare className={className} />;
    default:
      return <Archive className={className} />;
  }
}

function getWesenImageSrc(entry: TerminalObjectEntry) {
  return `/eg_png/security_picture/${entry.id.toLowerCase().replace("-", "_")}.png`;
}

function MetaRow({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <p className="text-terminal-text-dim mb-4 flex items-center justify-between gap-3">
      <span>{label}</span>
      <span className={danger ? "text-terminal-accent" : "text-white"}>{value}</span>
    </p>
  );
}

function ArchiveCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="text-terminal-copy bg-[#1d1d1d] p-7 text-sm leading-7">
      <h3 className="text-terminal-accent border-b border-[#604844] pb-3 text-xl font-black">
        {title}
      </h3>
      <div className="pt-4">{children}</div>
    </article>
  );
}

export function ArchiveList({
  selectedArchiveId,
  onSelect,
}: {
  selectedArchiveId: string;
  onSelect: (entry: TerminalObjectEntry) => void;
}) {
  return (
    <section className="border-terminal-border min-h-0 border-b bg-[#111] lg:border-r lg:border-b-0">
      <div className="py-2">
        {terminalObjects.map((entry) => {
          const active = selectedArchiveId === entry.id;

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelect(entry)}
              className={cx(
                "flex w-full items-center gap-2 border-l-2 border-l-transparent px-3 py-3 text-left font-mono text-[11px] font-black transition",
                active
                  ? "border-l-terminal-accent bg-terminal-accent-strong text-white"
                  : "text-terminal-text-muted hover:bg-terminal-tile hover:text-white"
              )}
            >
              <ObjectSymbolIcon symbol={entry.symbol} className="h-4 w-4 shrink-0" />
              <span>{entry.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function ArchiveDetail({ entry }: { entry: TerminalObjectEntry }) {
  return (
    <section className="min-h-0 overflow-y-auto bg-[#0f0f0f] px-6 py-7 lg:px-8">
      <div className="border-terminal-border border-l-terminal-accent border border-l-4 bg-[#151515] px-8 py-7">
        <h2 className="font-mono text-[clamp(2rem,4vw,3rem)] font-black tracking-[0.08em] text-white">
          {entry.label}
        </h2>
        <p className="text-terminal-accent mt-2 font-mono text-lg font-black">
          SAFETY LEVEL: {entry.safetyLevel}
        </p>
      </div>

      <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-7">
          <ArchiveCard title={entry.title}>
            {entry.description.map((line, index) => (
              <p key={index} className="mt-4 first:mt-0">
                {line}
              </p>
            ))}
          </ArchiveCard>

          <ArchiveCard title="SPECIAL CONTAINMENT PROCEDURES">
            {entry.containment.map((line, index) => (
              <p
                key={index}
                className="before:text-terminal-accent mt-3 before:mr-4 before:content-['▪']"
              >
                {line}
              </p>
            ))}
          </ArchiveCard>

          <ArchiveCard title="Containment Status">
            {entry.status.map((line, index) => (
              <p key={index} className="mt-4 first:mt-0">
                {line}
              </p>
            ))}
          </ArchiveCard>
        </div>

        <aside className="bg-[#1b1b1b] p-5">
          <div className="text-terminal-text-dim relative block aspect-square w-full overflow-hidden bg-[#222]">
            <Image
              src={getWesenImageSrc(entry)}
              alt={`${entry.label} visual archive`}
              fill
              sizes="240px"
              className="object-cover transition duration-300"
            />
            <span className="pointer-events-none absolute inset-0 border border-white/5" />
          </div>
          <p className="mt-3 font-mono text-[9px] font-black text-white">
            {entry.imageLabel}
          </p>
          <div className="mt-8 font-mono text-[9px] tracking-[0.12em]">
            <p className="text-terminal-accent mb-5 text-center font-black">SECURITY_READOUT</p>
            {entry.securityReadout.map((row) => (
              <MetaRow key={row.label} label={row.label} value={row.value} danger={row.danger} />
            ))}
            <div className="bg-terminal-accent mt-6 h-1" />
          </div>
        </aside>
      </div>
    </section>
  );
}
