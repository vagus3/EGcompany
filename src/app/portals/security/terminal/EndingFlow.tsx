"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cx } from "@/theme/classes";

export type EmployeeCardDelivery =
  | { status: "idle" }
  | { status: "sending" }
  | { email?: string; rank?: string; status: "sent" }
  | { message: string; status: "failed" };

const employeeCardRewardImages = [
  "/eg_png/egcompany_picture/card/card_a.png",
  "/eg_png/egcompany_picture/card/card_b.png",
] as const;

export function FullscreenEndingVideo({
  posterSrc,
  videoSrc,
  onEnded,
}: {
  posterSrc?: string;
  videoSrc: string;
  onEnded: () => void;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black font-mono text-white">
      <video
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        onEnded={onEnded}
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0_45%,rgb(0_0_0_/0.72)_82%)]" />
      <div className="terminal-noise absolute inset-0 opacity-25" />

      <div className="absolute right-6 bottom-6 z-20">
        <button
          type="button"
          onClick={onEnded}
          className="hover:border-terminal-accent border border-white/20 px-3 py-2 text-[10px] font-black tracking-[0.24em] text-white/50 transition hover:text-white"
        >
          SKIP
        </button>
      </div>
    </main>
  );
}

export function SurveyQrPage({
  delivery,
  surveyUrl,
  onReset,
}: {
  delivery: EmployeeCardDelivery;
  surveyUrl: string;
  onReset: () => void;
}) {
  const [rewardCardSrc, setRewardCardSrc] = useState<(typeof employeeCardRewardImages)[number]>();
  const deliveryMessage =
    delivery.status === "failed"
      ? delivery.message
      : delivery.status === "sent"
        ? `${delivery.email ?? "등록된 이메일"}로 ${delivery.rank ?? "?"} 등급 사원증이 발송 되었습니다.`
        : delivery.status === "sending"
          ? "등록된 이메일로 사원증을 발송하는 중입니다."
          : "영상 종료 후 사원증 발송이 예약됩니다.";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setRewardCardSrc(
        employeeCardRewardImages[Math.floor(Math.random() * employeeCardRewardImages.length)]
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#111] px-4 py-14 text-white sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <section className="mb-12 w-full max-w-[320px] sm:mb-14 sm:max-w-380px">
          <div className="border-terminal-accent/45 relative aspect-638/1016 overflow-hidden border bg-black shadow-[0_0_60px_rgba(176,0,0,0.22)]">
            {rewardCardSrc ? (
              <Image
                src={rewardCardSrc}
                alt="발급된 EG 사원증"
                fill
                sizes="(max-width: 640px) 320px, 380px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="terminal-noise absolute inset-0 opacity-30" />
            )}
          </div>
          <p className="text-terminal-text-dim mt-4 text-center font-mono text-[10px] font-black tracking-[0.18em]">
            EMPLOYEE ID CARD ISSUED
          </p>
        </section>

        <section className="border-terminal-accent/55 w-full max-w-3xl border bg-black px-6 py-10 text-center shadow-[0_0_40px_rgba(176,0,0,0.18)] sm:px-12 sm:py-14">
          <p className="text-terminal-accent-text font-mono text-[clamp(1.1rem,2vw,1.65rem)] tracking-[0.18em]">
            UNKNOWN SYSTEM
          </p>
          <p className="mt-8 text-[clamp(1.7rem,4vw,3.15rem)] leading-[1.45] font-semibold tracking-normal text-neutral-400">
            회원가입 시에 입력한 이메일로
            <br />
            사원증이 발송 되었습니다.
          </p>
          <p
            className={cx(
              "mt-6 font-mono text-xs font-black tracking-[0.16em]",
              delivery.status === "failed" ? "text-terminal-accent-text" : "text-terminal-text-dim"
            )}
          >
            {deliveryMessage}
          </p>
        </section>

        <section className="mt-20 w-full max-w-520px bg-white p-10 text-center text-black shadow-[0_0_60px_rgba(255,255,255,0.12)] sm:p-14">
          <MockQrCode value={surveyUrl} />
          <p className="mt-9 text-[clamp(1.45rem,3vw,2.3rem)] font-black tracking-normal">
            &gt;_ 플레이 후기 설문조사 폼
          </p>
          <p className="mt-5 font-mono text-[10px] font-bold tracking-[0.12em] break-all text-neutral-400">
            {surveyUrl}
          </p>
        </section>

        <button
          type="button"
          onClick={onReset}
          className="hover:border-terminal-accent mt-10 border border-white/15 px-5 py-3 font-mono text-[10px] font-black tracking-[0.22em] text-white/35 transition hover:text-white"
        >
          RESET TERMINAL
        </button>
      </div>
    </main>
  );
}

function MockQrCode({ value }: { value: string }) {
  const size = 29;
  const cells = Array.from({ length: size * size }, (_, index) => {
    const x = index % size;
    const y = Math.floor(index / size);
    const inTopLeft = x < 7 && y < 7;
    const inTopRight = x >= size - 7 && y < 7;
    const inBottomLeft = x < 7 && y >= size - 7;
    const inFinder = inTopLeft || inTopRight || inBottomLeft;

    if (inFinder) {
      const localX = inTopRight ? x - (size - 7) : x;
      const localY = inBottomLeft ? y - (size - 7) : y;
      const border = localX === 0 || localX === 6 || localY === 0 || localY === 6;
      const center = localX >= 2 && localX <= 4 && localY >= 2 && localY <= 4;
      return border || center;
    }

    const code = value.charCodeAt((x * 7 + y * 11) % value.length);
    return (x * 3 + y * 5 + code) % 7 < 3;
  });

  return (
    <div
      className="mx-auto grid aspect-square w-full max-w-270px gap-2px bg-white p-2"
      style={{ gridTemplateColumns: "repeat(29, minmax(0, 1fr))" }}
      aria-label="Mock survey QR code"
    >
      {cells.map((active, index) => (
        <span key={index} className={active ? "bg-black" : "bg-white"} />
      ))}
    </div>
  );
}
