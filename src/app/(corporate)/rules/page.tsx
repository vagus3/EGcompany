"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminAccessTestModal } from "@/components/layout/AdminAccessTestModal";
import { adminTestPassedKey, adminTestRequiredKey } from "@/lib/admin-test";
import { rules } from "@/lib/rules-data";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

const ADMIN_TERMINAL_PATH = "/portals/security/terminal";

export default function Page() {
  const lang = useLanguage();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const handleSignatureClick = () => {
    setIsModalOpen(true);
  };

  const handleAdminTestPassed = () => {
    window.localStorage.removeItem(adminTestRequiredKey);
    window.localStorage.setItem(adminTestPassedKey, "true");
    setIsModalOpen(false);
    setTransitioning(true);
    // 리다이렉트는 AccessTerminal 컴포넌트의 onComplete에서 처리
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="mx-auto max-w-4xl px-4 pt-14 pb-12 sm:px-6 sm:pt-20 sm:pb-16">
        <h1 className="mb-6 text-[clamp(2.2rem,4.5vw,3.5rem)] leading-tight font-black tracking-tight text-black">
          {t("rules_title_line1", lang)}
          <br />
          {t("rules_title_line2", lang)}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-500">
          {t("rules_subtitle", lang)}
        </p>
        <hr className="mt-10 border-gray-200" />
      </section>

      {/* Rules list */}
      <section className="mx-auto max-w-4xl space-y-10 px-4 pb-16 sm:space-y-12 sm:px-6 sm:pb-20">
        {rules.map(({ num, title, title_en, body, body_en }) => (
          <div
            key={num}
            className="grid grid-cols-[48px_1fr] gap-4 sm:grid-cols-[72px_1fr] sm:gap-6"
          >
            <span className="pt-1 text-3xl leading-none font-black text-gray-200 select-none sm:text-4xl">
              {num}
            </span>
            <div>
              <h2 className="mb-2 text-base font-bold text-black">
                {lang === "en" ? title_en : title}
              </h2>
              <p className="text-sm leading-relaxed text-gray-500">
                {lang === "en" ? body_en : body}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Notice box */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="flex gap-4 rounded border border-gray-300 p-5 sm:p-6">
          <span className="mt-0.5 text-gray-400">ⓘ</span>
          <div>
            <p className="mb-2 text-xs font-bold text-black">{t("rules_notice_label", lang)}</p>
            <p className="text-xs leading-relaxed text-gray-500">
              {t("rules_notice_pre", lang)}
              <button
                onClick={handleSignatureClick}
                className="cursor-pointer font-bold text-black transition-all hover:underline"
              >
                {t("rules_notice_btn", lang)}
              </button>
              {t("rules_notice_post", lang)}
            </p>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <AdminAccessTestModal onClose={handleCloseModal} onPassed={handleAdminTestPassed} />
      )}

      {transitioning && (
        <AccessTerminal onComplete={() => router.replace(ADMIN_TERMINAL_PATH)} />
      )}
    </div>
  );
}

const TERMINAL_LINES: { text: string; delay: number }[] = [
  { text: "EG COMPANY SECURITY SYSTEM  v2.4.1", delay: 0 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 180 },
  { text: "> INITIATING AUTHENTICATION PROTOCOL...", delay: 500 },
  { text: "> SCANNING CLEARANCE DATABASE...", delay: 950 },
  { text: "> RETRIEVING PERSONNEL RECORD...", delay: 1380 },
  { text: "> USER IDENTITY VERIFIED", delay: 1780 },
  { text: "> CHECKING SECURITY CLEARANCE LEVEL...", delay: 2200 },
  { text: "> CLEARANCE LEVEL: CONFIRMED", delay: 2700 },
  { text: "> LOADING ACCESS PERMISSIONS...", delay: 3100 },
  { text: "> ACTIVATING SECURITY PROTOCOLS...", delay: 3500 },
  { text: "> PREPARING TERMINAL ENVIRONMENT...", delay: 3900 },
  { text: "> ALL SYSTEMS NOMINAL", delay: 4300 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 4600 },
];
const FINAL_TEXT = "ACCESS GRANTED";
const REDIRECT_LINE = "> REDIRECTING TO SECURITY TERMINAL...";
const FINAL_START = 4900;
const CHAR_SPEED = 32;
const REDIRECT_DELAY = FINAL_START + FINAL_TEXT.length * CHAR_SPEED + 400;
const TOTAL_DURATION = 7000;

function AccessTerminal({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [finalText, setFinalText] = useState("");
  const [showRedirect, setShowRedirect] = useState(false);
  const [cursor, setCursor] = useState(true);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    const timers: number[] = [];

    TERMINAL_LINES.forEach(({ text, delay }) => {
      timers.push(window.setTimeout(() => {
        setLines((prev) => [...prev, text]);
      }, delay));
    });

    FINAL_TEXT.split("").forEach((ch, i) => {
      timers.push(window.setTimeout(() => {
        setFinalText((prev) => prev + ch);
      }, FINAL_START + i * CHAR_SPEED));
    });

    timers.push(window.setTimeout(() => setShowRedirect(true), REDIRECT_DELAY));
    timers.push(window.setTimeout(() => onCompleteRef.current(), TOTAL_DURATION));

    const blink = window.setInterval(() => setCursor((v) => !v), 530);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.clearInterval(blink);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-200 overflow-y-auto bg-black px-8 pt-12 pb-8 sm:px-16 sm:pt-16 md:px-24">
      {/* 스캔라인 */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.22) 3px, rgba(0,0,0,0.22) 4px)",
        }}
      />

      <div className="relative z-10 max-w-3xl">
        {lines.map((line, i) => {
          const isHeader = i === 0 || line.startsWith("━");
          return (
            <p
              key={i}
              className="font-mono leading-7 tracking-[0.1em]"
              style={{
                fontSize: isHeader ? "11px" : "13px",
                color: isHeader ? "#550000" : "#880000",
              }}
            >
              {line}
            </p>
          );
        })}

        {/* ACCESS GRANTED */}
        {(finalText || lines.length === TERMINAL_LINES.length) && (
          <div className="mt-5 font-mono">
            <span
              className="text-[clamp(2.2rem,5vw,3.8rem)] font-black tracking-[0.05em]"
              style={{
                color: "#cc0000",
                textShadow: "0 0 10px rgba(200,0,0,0.65), 0 0 32px rgba(140,0,0,0.4)",
              }}
            >
              {finalText}
            </span>
            {finalText.length < FINAL_TEXT.length && (
              <span
                className="text-[clamp(2.2rem,5vw,3.8rem)] font-black"
                style={{ color: "#cc0000", opacity: cursor ? 1 : 0 }}
              >
                _
              </span>
            )}
          </div>
        )}

        {/* 리다이렉트 안내 */}
        {showRedirect && (
          <p
            className="mt-4 animate-pulse font-mono text-xs tracking-[0.22em]"
            style={{ color: "#660000" }}
          >
            {REDIRECT_LINE}
          </p>
        )}
      </div>
    </div>
  );
}
