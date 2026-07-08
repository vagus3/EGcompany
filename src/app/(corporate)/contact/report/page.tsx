"use client";

import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

// ── 계좌 정보 ────────────────────────────────────────────────────────────────
const ACCOUNT_INFO = {
  bank_ko: "카카오뱅크",
  bank_en: "Kakaobank",
  number:  "3333-22-4926678",
  holder:  "김*진",
};

// ── 계좌 모달 ────────────────────────────────────────────────────────────────
function AccountModal({ onClose }: { onClose: () => void }) {
  const lang = useLanguage();
  const isEn = lang === "en";
  const [copied, setCopied] = useState(false);

  function copyAccount() {
    navigator.clipboard.writeText(ACCOUNT_INFO.number).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm border border-gray-200 bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.28em] text-gray-400 uppercase">
              Developer Support
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-black">
              {isEn ? "Developer Account Info" : "개발자 후원 계좌"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-black"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 계좌 정보 */}
        <div className="space-y-4 border-y border-gray-100 py-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-widest text-gray-400 uppercase">
              {isEn ? "Bank" : "은행"}
            </span>
            <span className="text-sm font-black text-black">
              {isEn ? ACCOUNT_INFO.bank_en : ACCOUNT_INFO.bank_ko}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] tracking-widest text-gray-400 uppercase">
              {isEn ? "Account No." : "계좌번호"}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black text-black">{ACCOUNT_INFO.number}</span>
              <button
                onClick={copyAccount}
                className="flex h-7 w-7 items-center justify-center border border-gray-200 text-gray-400 transition-all hover:border-black hover:text-black"
                aria-label={isEn ? "Copy account number" : "계좌번호 복사"}
              >
                {copied
                  ? <Check className="h-3.5 w-3.5 text-black" />
                  : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-widest text-gray-400 uppercase">
              {isEn ? "Holder" : "예금주"}
            </span>
            <span className="text-sm font-black text-black">{ACCOUNT_INFO.holder}</span>
          </div>
        </div>

        {copied && (
          <p className="mt-4 text-center text-[11px] font-black tracking-widest text-black uppercase">
            {isEn ? "Account number copied" : "계좌번호가 복사되었습니다"}
          </p>
        )}
      </div>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function Page() {
  const lang = useLanguage();
  const isEn = lang === "en";
  const [showModal, setShowModal] = useState(false);
  const [report,    setReport]    = useState("");
  const [sent,      setSent]      = useState(false);

  function handleSend() {
    if (!report.trim()) return;
    setSent(true);
    setReport("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      {/* 헤딩 */}
      <h1 className="mb-14 text-[clamp(2.5rem,5vw,4rem)] font-black tracking-tight text-black">
        Contact Us.
      </h1>

      {/* 개발자에게 사탕사주기 */}
      <div className="mb-14 border-b border-gray-100 pb-14">
        <p className="mb-2 text-[10px] font-black tracking-[0.28em] text-gray-400 uppercase">
          Optional
        </p>
        <h2 className="mb-4 text-2xl font-black tracking-tight text-black">
          {isEn ? "Buy the Developer a Candy 🍬" : "개발자에게 사탕사주기 🍬"}
        </h2>
        <p className="mb-6 max-w-md text-sm leading-relaxed text-gray-500">
          {isEn
            ? "If you enjoyed this service, send the developer a small token of appreciation. The price of a candy is more than enough."
            : "이 서비스가 마음에 드셨다면 개발자에게 작은 응원을 보내주세요. 사탕 한 봉지 값이면 충분합니다."}
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="border border-black px-8 py-3 text-[12px] font-black tracking-[0.22em] text-black uppercase transition-colors hover:bg-black hover:text-white"
        >
          {isEn ? "View Account" : "계좌 확인하기"}
        </button>
      </div>

      {/* 리포트 폼 */}
      <div className="max-w-xl">
        <h2 className="mb-2 text-2xl font-black tracking-tight text-black">
          {t("contact_report_heading", lang)}
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          {t("contact_report_desc_1", lang)}
          <br />
          {t("contact_report_desc_2", lang)}
        </p>
        <textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder={t("contact_placeholder", lang)}
          rows={7}
          className="w-full resize-none border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="mt-4 bg-black px-8 py-3 text-xs tracking-widest text-white uppercase transition-colors hover:bg-gray-800"
        >
          {sent ? t("contact_sent", lang) : t("contact_send", lang)}
        </button>
      </div>

      {/* 모달 */}
      {showModal && <AccountModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
