"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const handleSignatureClick = () => {
    setIsModalOpen(true);
  };

  const handleAdminTestPassed = () => {
    window.localStorage.removeItem(adminTestRequiredKey);
    window.localStorage.setItem(adminTestPassedKey, "true");
    setIsModalOpen(false);
    router.replace(ADMIN_TERMINAL_PATH);
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
    </div>
  );
}
