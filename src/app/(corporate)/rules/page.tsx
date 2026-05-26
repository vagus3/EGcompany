"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdminAccessTestModal } from "@/components/layout/AdminAccessTestModal";
import { adminTestPassedKey, adminTestRequiredKey } from "@/lib/admin-test";
import { rules } from "@/lib/rules-data";

const ADMIN_TERMINAL_PATH = "/portals/security/terminal";

export default function Page() {
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
          Employee Conduct
          <br />& Workplace Safety
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-500">
          EG 컴퍼니 임직원의 안전과 효율적인 업무 환경 조성을 위한 기본 행동 수칙 및 보건
          가이드라인입니다. 본 규정은 사내 보안 등급에 따라 엄격히 준수되어야 합니다.
        </p>
        <hr className="mt-10 border-gray-200" />
      </section>

      {/* Rules list */}
      <section className="mx-auto max-w-4xl space-y-10 px-4 pb-16 sm:space-y-12 sm:px-6 sm:pb-20">
        {rules.map(({ num, title, body }) => (
          <div
            key={num}
            className="grid grid-cols-[48px_1fr] gap-4 sm:grid-cols-[72px_1fr] sm:gap-6"
          >
            <span className="pt-1 text-3xl leading-none font-black text-gray-200 select-none sm:text-4xl">
              {num}
            </span>
            <div>
              <h2 className="mb-2 text-base font-bold text-black">{title}</h2>
              <p className="text-sm leading-relaxed text-gray-500">{body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Notice box */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="flex gap-4 rounded border border-gray-300 p-5 sm:p-6">
          <span className="mt-0.5 text-gray-400">ⓘ</span>
          <div>
            <p className="mb-2 text-xs font-bold text-black">Notice</p>
            <p className="text-xs leading-relaxed text-gray-500">
              위 지침은 모든 임직원의 안전을 보장하기 위한 최소한의 조치입니다. 지침 미준수로
              발생하는 &#39;존재적 불일치&#39;나 &#39;물리적 소실&#39;에 대해 EG 컴퍼니는 법적
              책임을 지지 않습니다. 모든 임직원은 본 문서를 숙지했음을{" "}
              <button
                onClick={handleSignatureClick}
                className="cursor-pointer font-bold text-black transition-all hover:underline"
              >
                서명
              </button>
              으로 갈음합니다.
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
