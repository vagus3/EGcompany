"use client";

import { Archive, Mail, Shield, User } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cx } from "@/theme/classes";

export type Section = "messenger" | "archive" | "containment" | "person";

export default function TerminalSidebar({
  activeSection,
  onSectionChange,
}: {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}) {
  const lang = useLanguage();
  const navItems = [
    { id: "messenger" as const, label: "MESSENGER", icon: Mail },
    { id: "archive" as const, label: "ARCHIVE", icon: Archive },
    { id: "containment" as const, label: "CONTAINMENT LOGS", icon: Shield },
    { id: "person" as const, label: "PERSON", icon: User },
  ];

  return (
    <aside className="border-terminal-border flex min-h-0 flex-col border-b bg-[#0b0b0b] lg:border-r lg:border-b-0">
      <section className="border-terminal-border flex min-h-96px items-center gap-4 border-b px-5">
        <div className="bg-terminal-accent-strong grid h-10 w-10 place-items-center">
          <Shield className="h-5 w-5 fill-white text-white" />
        </div>
        <div>
          <p className="text-terminal-text-dim font-mono text-[10px] tracking-[0.22em]">
            {lang === "en" ? "Welcome, ClearEye" : "환영합니다, 클리어아이"}
          </p>
          <p className="mt-1 font-mono text-xs font-black tracking-[0.12em] text-white">
            SITE-15 SECTOR-01
          </p>
        </div>
      </section>

      <nav className="py-4 font-mono text-[11px] font-black tracking-[0.18em]">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSectionChange(id)}
            className={cx(
              "flex h-46 w-full items-center gap-4 px-5 py-4 text-left transition",
              activeSection === id
                ? "bg-terminal-accent-strong text-white"
                : "text-terminal-text-dim hover:bg-terminal-tile hover:text-terminal-text"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

    </aside>
  );
}
