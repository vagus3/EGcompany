"use client";

import type { CSSProperties } from "react";
import { useMemo, useState, useSyncExternalStore } from "react";

const visualStyles = {
  hero: {
    backgroundImage:
      "linear-gradient(90deg, rgb(0 0 0 / 0.72), rgb(255 255 255 / 0.08) 48%, rgb(0 0 0 / 0.72)), repeating-linear-gradient(90deg, rgb(255 255 255 / 0.2) 0 1px, transparent 1px 36px), linear-gradient(104deg, transparent 0 42%, rgb(230 230 230 / 0.58) 42% 48%, transparent 48% 55%, rgb(235 235 235 / 0.52) 55% 61%, transparent 61%), repeating-linear-gradient(0deg, rgb(255 255 255 / 0.08) 0 1px, transparent 1px 23px)",
    backgroundColor: "#171717",
  },
  stairs: {
    backgroundImage:
      "linear-gradient(145deg, transparent 0 34%, rgb(235 235 235 / 0.62) 34% 37%, transparent 37%), repeating-linear-gradient(155deg, rgb(255 255 255 / 0.22) 0 2px, transparent 2px 18px), linear-gradient(90deg, rgb(0 0 0 / 0.82), rgb(70 70 70 / 0.42))",
    backgroundColor: "#181818",
  },
  logistics: {
    backgroundImage:
      "repeating-linear-gradient(150deg, rgb(255 255 255 / 0.22) 0 2px, transparent 2px 18px), repeating-linear-gradient(30deg, rgb(255 255 255 / 0.14) 0 1px, transparent 1px 26px), linear-gradient(135deg, #111, #4a4a4a)",
  },
  terrain: {
    backgroundImage:
      "radial-gradient(ellipse at 18% 28%, transparent 0 16px, rgb(80 80 80 / 0.28) 17px 18px, transparent 19px), radial-gradient(ellipse at 70% 38%, transparent 0 24px, rgb(30 30 30 / 0.22) 25px 26px, transparent 27px), repeating-radial-gradient(ellipse at 45% 50%, rgb(60 60 60 / 0.18) 0 1px, transparent 1px 11px), linear-gradient(135deg, #dadada, #f4f4f4 52%, #bcbcbc)",
  },
  horizon: {
    backgroundImage:
      "radial-gradient(ellipse at center, transparent 0 21%, rgb(255 255 255 / 0.12) 22% 22.6%, transparent 23%), repeating-radial-gradient(ellipse at center, rgb(255 255 255 / 0.13) 0 1px, transparent 1px 15px), linear-gradient(135deg, #000, #111 48%, #030303)",
  },
  insightA: {
    backgroundImage:
      "linear-gradient(132deg, transparent 0 24%, #f5f5f5 24% 38%, transparent 38% 49%, #8c8c8c 49% 62%, transparent 62%), linear-gradient(45deg, #161616, #d8d8d8)",
  },
  insightB: {
    backgroundImage:
      "repeating-linear-gradient(0deg, rgb(255 255 255 / 0.18) 0 1px, transparent 1px 8px), repeating-linear-gradient(90deg, rgb(0 0 0 / 0.18) 0 1px, transparent 1px 11px), linear-gradient(135deg, #444, #bcbcbc)",
  },
} satisfies Record<string, CSSProperties>;

const onboardingQuestions = [
  {
    num: "01",
    question:
      "발신자를 확인할 수 없는 메일이라도, 긴급 요청이 있으면 즉시 첨부파일을 실행해도 된다.",
    options: [
      { text: "O (예)", value: false },
      { text: "X (아니오)", value: true },
    ],
  },
  {
    num: "02",
    question: "시스템 로그에 본인의 이름이나 개인 정보가 노출되면 관리자에게 즉시 보고해야 한다.",
    options: [
      { text: "O (예)", value: true },
      { text: "X (아니오)", value: false },
    ],
  },
  {
    num: "03",
    question:
      "CCTV 화면에서 비정상적인 움직임이 보이면 해당 구역 접근을 중지하고 보안팀에 보고한다.",
    options: [
      { text: "O (예)", value: true },
      { text: "X (아니오)", value: false },
    ],
  },
  {
    num: "04",
    question: "업무 중 누군가 보고 있다는 감각과 따가운 감각이 동반되면 즉시 연구팀을 호출한다.",
    options: [
      { text: "O (예)", value: true },
      { text: "X (아니오)", value: false },
    ],
  },
  {
    num: "05",
    question: "관리자 권한은 테스트 통과 후에만 제한 구역 접근에 사용할 수 있다.",
    options: [
      { text: "O (예)", value: true },
      { text: "X (아니오)", value: false },
    ],
  },
];

const impactMetrics = [
  { value: "2.4B", label: "Global data points secured" },
  { value: "150+", label: "Operational systems" },
  { value: "12K", label: "Active facility nodes" },
];

const footprintMetrics = [
  { value: "142", label: "Sites" },
  { value: "84K+", label: "Employees" },
  { value: "$12B", label: "Assets" },
  { value: "99.9%", label: "Continuity" },
];

const ecosystemItems = [
  "Alpha Corp",
  "Vanguard Inc",
  "Nexus Global",
  "Apex Dynamics",
  "Omega Systems",
  "Aether Capital",
  "Quantum Ltd",
  "Stratos Alliance",
];

const adminTestStorageEvent = "eg-new-admin-test-change";
const adminTestRequiredKey = "eg-new-admin-test-required";
const adminTestPassedKey = "eg-new-admin-test-passed";

function getAdminTestRequiredSnapshot() {
  return window.localStorage.getItem(adminTestRequiredKey) === "true";
}

function getServerAdminTestRequiredSnapshot() {
  return false;
}

function subscribeToAdminTest(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(adminTestStorageEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(adminTestStorageEvent, onStoreChange);
  };
}

export default function Page() {
  const adminTestRequired = useSyncExternalStore(
    subscribeToAdminTest,
    getAdminTestRequiredSnapshot,
    getServerAdminTestRequiredSnapshot
  );
  const [testDismissed, setTestDismissed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === onboardingQuestions.length;
  const passed = useMemo(
    () => onboardingQuestions.every((question) => answers[question.num] === true),
    [answers]
  );

  function handleAnswer(questionNum: string, value: boolean) {
    setAnswers((current) => ({ ...current, [questionNum]: value }));
    setError("");
  }

  function handleSubmitTest() {
    if (!allAnswered) {
      setError("모든 항목을 선택해야 관리자 테스트를 제출할 수 있습니다.");
      return;
    }

    if (!passed) {
      setError("관리자 접근 테스트를 통과하지 못했습니다. 규정 탭을 다시 확인하십시오.");
      return;
    }

    window.localStorage.removeItem(adminTestRequiredKey);
    window.localStorage.setItem(adminTestPassedKey, "true");
    window.dispatchEvent(new Event(adminTestStorageEvent));
    setTestDismissed(false);
  }

  const modalOpen = adminTestRequired && !testDismissed;

  return (
    <div className="bg-corporate-bg text-corporate-text">
      <HeroSection />
      <StatementSection />
      <StrategicCoreSection />
      <FootprintSection />
      <FutureSection />
      <ImpactSection />
      <EcosystemSection />
      <InsightsSection />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-neutral-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-5 sm:px-8 sm:py-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center border border-neutral-500 text-neutral-700">
                  E
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase">
                    EG Company
                  </p>
                  <h2 className="text-xl font-black text-black">Administrator Access Protocol</h2>
                </div>
              </div>
              <button
                className="text-xl leading-none text-neutral-400 transition-colors hover:text-black"
                onClick={() => setTestDismissed(true)}
                type="button"
                aria-label="Close administrator access test"
              >
                x
              </button>
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-7">
              <div className="grid gap-6 md:grid-cols-[1fr_160px] md:gap-8">
                <div>
                  <h3 className="text-xl font-black text-black sm:text-2xl">
                    신규 가입자 관리자 테스트
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
                    본 테스트는 신규 가입자의 사내 보안 정책 이해도를 확인하기 위한 필수 과정입니다.
                    모든 문항을 선택한 뒤 제출하면 통과 여부에 따라 관리자 페이지 접근이 처리됩니다.
                  </p>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between text-[11px] font-black text-black">
                    <span>PROGRESS</span>
                    <span>
                      {answeredCount} / {onboardingQuestions.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {onboardingQuestions.map((question) => (
                      <span
                        className={`h-2.5 w-2.5 border border-neutral-400 ${
                          answers[question.num] !== undefined ? "bg-black" : "bg-white"
                        }`}
                        key={question.num}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-7 divide-y divide-neutral-200 border-y border-neutral-200">
                {onboardingQuestions.map((question) => (
                  <div
                    className="grid gap-3 py-4 sm:grid-cols-[48px_1fr] lg:grid-cols-[56px_1fr_220px] lg:items-center lg:gap-4"
                    key={question.num}
                  >
                    <span className="text-lg font-black text-black">{question.num}</span>
                    <p className="text-sm leading-6 text-black">{question.question}</p>
                    <div className="flex flex-wrap gap-4 lg:justify-end lg:gap-5">
                      {question.options.map((option) => (
                        <label
                          className="flex items-center gap-2 text-[11px] font-bold text-neutral-600"
                          key={option.text}
                        >
                          <input
                            checked={answers[question.num] === option.value}
                            className="h-3.5 w-3.5 accent-black"
                            name={`question-${question.num}`}
                            onChange={() => handleAnswer(question.num, option.value)}
                            type="radio"
                          />
                          {option.text}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center md:gap-6">
                <div className="flex gap-3 border border-yellow-200 bg-yellow-50 p-4">
                  <span className="text-yellow-700">!</span>
                  <p className="text-xs leading-5 text-neutral-700">
                    규칙 탭의 행동 수칙을 기준으로 답변하십시오. 통과 시 보안 관리자 페이지로 자동
                    접속됩니다.
                  </p>
                </div>

                <button
                  className="h-12 w-full bg-black px-8 text-[12px] font-black tracking-[0.18em] text-white uppercase transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 md:w-auto"
                  disabled={!allAnswered}
                  onClick={handleSubmitTest}
                  type="button"
                >
                  제출하기
                </button>
              </div>

              {error && (
                <div className="mt-6 border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative grid min-h-[calc(100vh-3.5rem)] place-items-center overflow-hidden border-b border-corporate-border">
      <div className="absolute inset-0 grayscale" style={visualStyles.hero} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0_28%,rgb(0_0_0_/_0.38)_72%)]" />
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center px-6 text-center">
        <p className="mb-8 border border-white/25 bg-black/60 px-3 py-1 font-mono text-[9px] font-black tracking-[0.26em] text-white/70 uppercase">
          Infrastructure / Control / Scale
        </p>
        <h1 className="text-[clamp(3.4rem,13vw,9.5rem)] leading-none font-black tracking-normal text-black/10 uppercase [-webkit-text-stroke:1px_rgb(255_255_255_/_0.54)]">
          EG Company
        </h1>
        <p className="mt-8 max-w-md border border-white/20 bg-white px-5 py-3 text-[10px] font-semibold tracking-[0.08em] text-black">
          We design systems that operate at velocity, severity, and scale.
        </p>
      </div>
    </section>
  );
}

function StatementSection() {
  return (
    <section className="border-b border-corporate-border px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="mb-8 text-center font-mono text-[9px] tracking-[0.24em] text-corporate-text-subtle uppercase">
          Manifesto
        </p>
        <h2 className="mx-auto max-w-3xl text-center text-[clamp(1.6rem,4vw,3.2rem)] leading-[0.95] font-black tracking-normal uppercase">
          We believe in structure. We believe in precision. In a world of noise, we engineer
          silence and certainty. Our methodology is brutalist; our execution is flawless.
        </h2>
      </div>
    </section>
  );
}

function StrategicCoreSection() {
  return (
    <section className="border-b border-corporate-border px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Strategic Core" />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <article className="relative min-h-72 overflow-hidden border border-corporate-border bg-black text-white md:col-span-2">
            <div className="absolute inset-0 opacity-85" style={visualStyles.stairs} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5">
              <p className="text-2xl font-black uppercase">Strategic Intelligence</p>
              <p className="mt-1 max-w-md text-xs text-white/70">
                Precision architecture across operational depth and data channels.
              </p>
            </div>
          </article>
          <article className="border border-corporate-border bg-corporate-surface p-6">
            <p className="font-mono text-[10px] text-corporate-text-muted">01</p>
            <h3 className="mt-8 text-2xl leading-none font-black uppercase">Fiscal Control</h3>
            <p className="mt-4 text-xs leading-5 text-corporate-text-muted">
              Capital allocation, internal audit, risk balance, and containment finance.
            </p>
            <div className="mt-16 bg-corporate-text px-4 py-3 text-center text-[9px] font-black tracking-[0.18em] text-corporate-bg uppercase">
              Analysis Dashboard
            </div>
          </article>
          <article className="border border-corporate-border bg-corporate-surface p-6">
            <p className="font-mono text-[10px] text-corporate-text-muted">02</p>
            <h3 className="mt-8 text-2xl leading-none font-black uppercase">Human Capital</h3>
            <p className="mt-4 text-xs leading-5 text-corporate-text-muted">
              Operational personnel systems and precision recruitment.
            </p>
          </article>
          <article className="relative min-h-48 overflow-hidden border border-corporate-border bg-black text-white md:col-span-2">
            <div className="absolute inset-0 opacity-80" style={visualStyles.logistics} />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 p-6">
              <p className="text-2xl font-black uppercase">Logistics & Mobility</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function FootprintSection() {
  const dots = [
    "left-[20%] top-[55%]",
    "left-[48%] top-[47%]",
    "left-[66%] top-[35%]",
    "left-[82%] top-[59%]",
  ];

  return (
    <section className="border-b border-corporate-border px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-[1fr_1fr] sm:items-end">
          <SectionHeading title="Global Footprint" compact />
          <p className="max-w-xs text-xs leading-5 text-corporate-text-muted sm:justify-self-end">
            Operational control across multi-continental nodes. Manufacturing, intelligence,
            pressure.
          </p>
        </div>
        <div className="relative mt-8 min-h-[310px] overflow-hidden border border-corporate-border" style={visualStyles.terrain}>
          {dots.map((dot) => (
            <span key={dot} className={`absolute h-2.5 w-2.5 bg-black ${dot}`} />
          ))}
        </div>
        <div className="grid grid-cols-2 border-x border-b border-corporate-border md:grid-cols-4">
          {footprintMetrics.map((metric) => (
            <div key={metric.label} className="border-r border-corporate-border p-5 last:border-r-0">
              <p className="text-3xl font-black">{metric.value}</p>
              <p className="mt-1 font-mono text-[9px] tracking-[0.18em] text-corporate-text-muted uppercase">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FutureSection() {
  return (
    <section className="relative grid min-h-[430px] place-items-center overflow-hidden bg-black px-6 py-20 text-white">
      <div className="absolute inset-0 opacity-75" style={visualStyles.horizon} />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 max-w-4xl text-center">
        <h2 className="text-[clamp(3rem,10vw,8rem)] leading-none font-black tracking-normal text-transparent uppercase [-webkit-text-stroke:1px_rgb(255_255_255_/_0.65)]">
          Future Horizon
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[clamp(1.2rem,3vw,2.4rem)] leading-none font-black uppercase">
          We do not predict the future. We construct it. Our architecture for the next decade is
          already in motion.
        </p>
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    <section className="border-b border-corporate-border px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Impact Metrics" />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {impactMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`border border-corporate-border p-7 text-center ${
                index === 1 ? "bg-corporate-text text-corporate-bg" : "bg-corporate-surface"
              }`}
            >
              <p className="text-5xl font-black">{metric.value}</p>
              <p className="mt-3 font-mono text-[9px] font-black tracking-[0.16em] uppercase">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EcosystemSection() {
  return (
    <section className="border-b border-corporate-border px-4 py-16 text-center sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black uppercase">Ecosystem</h2>
        <p className="mx-auto mt-3 max-w-lg text-xs leading-5 text-corporate-text-muted">
          Alliance forged with entities that share our commitment to absolute control and leverage.
        </p>
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
          {ecosystemItems.map((item) => (
            <div
              key={item}
              className="border border-corporate-border bg-corporate-surface px-3 py-5 font-mono text-[10px] font-black uppercase"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading title="Insights" compact />
          <p className="font-mono text-[9px] tracking-[0.22em] text-corporate-text-muted uppercase">
            View All Report
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <InsightCard
            title="The Architecture of Market Consolidation"
            category="White Paper"
            style={visualStyles.insightA}
          />
          <InsightCard
            title="Engineered Resilience in Global Supply Chains"
            category="Research"
            style={visualStyles.insightB}
          />
        </div>
      </div>
    </section>
  );
}

function InsightCard({
  title,
  category,
  style,
}: {
  title: string;
  category: string;
  style: CSSProperties;
}) {
  return (
    <article className="border border-corporate-border bg-corporate-surface">
      <div className="aspect-[1.65] grayscale" style={style} />
      <div className="p-5">
        <p className="font-mono text-[9px] tracking-[0.2em] text-corporate-text-muted uppercase">
          {category}
        </p>
        <h3 className="mt-2 text-xl leading-tight font-semibold">{title}</h3>
        <p className="mt-5 font-mono text-xs text-corporate-text-muted">Read</p>
      </div>
    </article>
  );
}

function SectionHeading({ title, compact = false }: { title: string; compact?: boolean }) {
  return (
    <div className={compact ? "" : "border-b border-corporate-border pb-4"}>
      <h2 className="text-[clamp(2.2rem,6vw,4.8rem)] leading-none font-black tracking-normal uppercase">
        {title}
      </h2>
    </div>
  );
}
