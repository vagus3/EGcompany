"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle2, Clock3, Lock, Shield, ShieldCheck, UserRound } from "lucide-react";

import { useLanguage } from "@/hooks/useLanguage";

type AdminAccessGrantedModalProps = {
  onClose: () => void;
};

function formatNow() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AdminAccessGrantedModal({ onClose }: AdminAccessGrantedModalProps) {
  const lang = useLanguage();
  const [now] = useState(() => formatNow());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-neutral-200 bg-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex items-center gap-4">
            <Image
              src="/eg_png/egcompany_picture/EGCompanyLOGO.png"
              alt="EG Company logo"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase">
                EG Company
              </p>
              <h2 className="text-xl font-black text-black">Administrator Access Protocol</h2>
            </div>
          </div>
          <button
            className="text-xl leading-none text-neutral-400 transition-colors hover:text-black"
            onClick={onClose}
            type="button"
            aria-label="Close administrator access notice"
          >
            ✕
          </button>
        </div>
        <hr className="border-neutral-200" />

        {/* 본문 */}
        <div className="px-5 py-10 text-center sm:px-10 sm:py-12">
          {/* 방패 아이콘 + 동심원 */}
          <div className="relative mx-auto grid h-40 w-40 place-items-center">
            <span className="absolute inset-0 rounded-full border border-neutral-200" />
            <span className="absolute inset-5 rounded-full border border-neutral-100" />
            <Shield className="h-20 w-20 text-black" strokeWidth={1.4} />
            <Lock className="absolute h-7 w-7 text-black" strokeWidth={1.8} />
          </div>

          <h3 className="mt-6 text-[clamp(1.8rem,4.5vw,2.6rem)] font-black tracking-tight text-black">
            Administrator Access Granted
          </h3>

          {/* 가운데 점 구분선 */}
          <div className="mx-auto mt-7 flex max-w-xl items-center gap-3">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <p className="mt-8 text-2xl font-bold text-black sm:text-3xl">
            {lang === "en" ? "New employee sign-in complete." : "신규 사원 로그인 완료."}
          </p>
          <p className="mt-4 text-lg leading-8 text-neutral-600 sm:text-xl">
            {lang === "en" ? (
              <>
                Before starting work,
                <br />
                please review the <strong className="font-black text-black">regulations</strong>.
              </>
            ) : (
              <>
                업무 시작 전
                <br />
                <strong className="font-black text-black">규정</strong>을 숙지하시기 바랍니다.
              </>
            )}
          </p>

          <hr className="mt-10 border-neutral-200" />

          {/* 3열 정보 */}
          <div className="mt-8 grid grid-cols-1 divide-y divide-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex items-center justify-center gap-3 px-4 py-3 sm:py-1">
              <UserRound className="h-7 w-7 text-neutral-700" strokeWidth={1.6} />
              <div className="text-left">
                <p className="text-[10px] font-bold tracking-[0.14em] text-neutral-500 uppercase">
                  Access Level
                </p>
                <p className="text-base font-black text-black">Administrator</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 px-4 py-3 sm:py-1">
              <ShieldCheck className="h-7 w-7 text-neutral-700" strokeWidth={1.6} />
              <div className="text-left">
                <p className="text-[10px] font-bold tracking-[0.14em] text-neutral-500 uppercase">
                  Status
                </p>
                <p className="flex items-center gap-2 text-base font-black text-black">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Verified
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 px-4 py-3 sm:py-1">
              <Clock3 className="h-7 w-7 text-neutral-700" strokeWidth={1.6} />
              <div className="text-left">
                <p className="text-[10px] font-bold tracking-[0.14em] text-neutral-500 uppercase">
                  Time
                </p>
                <p className="text-base font-black text-black">{now}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-dashed border-neutral-300" />

          {/* 하단 체크 항목 */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-neutral-200">
            {(lang === "en"
              ? ["Administrator verified", "Permissions confirmed", "Security protocol applied"]
              : ["관리자 인증 완료", "권한 확인 완료", "보안 프로토콜 적용"]
            ).map((label) => (
              <p
                key={label}
                className="flex items-center justify-center gap-2 text-sm font-bold text-black"
              >
                <CheckCircle2 className="h-5 w-5 text-neutral-600" strokeWidth={1.8} />
                {label}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
