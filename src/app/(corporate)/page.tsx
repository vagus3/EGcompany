"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";

import { AdminAccessTestModal } from "@/components/layout/AdminAccessTestModal";
import Footer from "@/components/layout/Footer";
import {
  adminTestPassedKey,
  adminTestRequiredKey,
  adminTestStorageEvent,
} from "@/lib/admin-test";

const visualStyles = {
  hero: {
    backgroundImage:
      "linear-gradient(90deg, rgb(0 0 0 / 0.72), rgb(255 255 255 / 0.08) 48%, rgb(0 0 0 / 0.72)), url('/eg_png/egcompany_picture/main.png')",
    backgroundColor: "#171717",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  stairs: {
    backgroundImage:
      "linear-gradient(90deg, rgb(0 0 0 / 0.72), rgb(0 0 0 / 0.08)), url('/eg_png/egcompany_picture/News/03.png')",
    backgroundColor: "#181818",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  logistics: {
    backgroundImage:
      "linear-gradient(90deg, rgb(0 0 0 / 0.52), rgb(0 0 0 / 0.1)), url('/eg_png/egcompany_picture/News/04.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  terrain: {
    backgroundImage:
      "linear-gradient(0deg, rgb(255 255 255 / 0.38), rgb(255 255 255 / 0.38)), url('/eg_png/egcompany_picture/News/02.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  horizon: {
    backgroundImage:
      "linear-gradient(0deg, rgb(0 0 0 / 0.58), rgb(0 0 0 / 0.58)), url('/eg_png/egcompany_picture/Company%20Information.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  insightA: {
    backgroundImage:
      "linear-gradient(0deg, rgb(0 0 0 / 0.08), rgb(0 0 0 / 0.08)), url('/eg_png/egcompany_picture/News/01.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  insightB: {
    backgroundImage:
      "linear-gradient(0deg, rgb(0 0 0 / 0.08), rgb(0 0 0 / 0.08)), url('/eg_png/egcompany_picture/News/05.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
} satisfies Record<string, CSSProperties>;

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [testDismissed, setTestDismissed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const sections = Array.from(container.querySelectorAll<HTMLElement>("[data-snap]"));

    function animateSection(section: HTMLElement, entering: boolean) {
      const els = Array.from(section.querySelectorAll<HTMLElement>("[data-anim]"));
      els.forEach((el, i) => {
        el.style.setProperty("--anim-delay", `${i * 0.1}s`);
        if (entering) {
          el.classList.remove("anim-out");
          el.classList.add("anim-in");
        } else {
          el.classList.remove("anim-in");
          el.classList.add("anim-out");
        }
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          animateSection(entry.target as HTMLElement, entry.isIntersecting);
        });
      },
      { root: container, threshold: 0.35 }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data: { user: { email: string } | null } | null) => {
        setIsLoggedIn(!!data?.user);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  function handleAdminTestPassed() {
    window.localStorage.removeItem(adminTestRequiredKey);
    window.localStorage.setItem(adminTestPassedKey, "true");
    window.dispatchEvent(new Event(adminTestStorageEvent));
    setTestDismissed(false);
  }

  const modalOpen = isLoggedIn && adminTestRequired && !testDismissed;

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

  return (
    <div
      ref={scrollRef}
      className="bg-black text-corporate-text h-[calc(100vh-3.5rem)] overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollbarWidth: "none" }}
    >
      <HeroSection />
      <StatementSection />
      <StrategicCoreSection />
      <FootprintSection footprintMetrics={footprintMetrics} />
      <FutureSection />
      <ImpactSection impactMetrics={impactMetrics} />
      <EcosystemSection />
      <InsightsSection />
      <div data-snap className="snap-start snap-always bg-corporate-bg">
        <Footer />
      </div>

      {modalOpen && (
        <AdminAccessTestModal
          onClose={() => setTestDismissed(true)}
          onPassed={handleAdminTestPassed}
        />
      )}
    </div>
  );
}

function HeroSection() {
  return (
    <section data-snap className="relative grid min-h-[calc(100vh-3.5rem)] place-items-center overflow-hidden border-b border-corporate-border snap-start snap-always">
      {/* 레이어 1 — 배경 영상 */}
      <video
        src="/EGCompany_mainpage.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* 레이어 2 — 다크 오버레이 (텍스트 가독성) */}
      <div className="absolute inset-0 bg-black/55" />
      {/* 레이어 3 — 콘텐츠 */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center px-6 text-center">
        <p data-anim className="mb-8 border border-white/25 bg-black/60 px-3 py-1 font-mono text-[9px] font-black tracking-[0.26em] text-white/70 uppercase">
          Infrastructure / Control / Scale
        </p>
        <h1 data-anim className="text-[clamp(3.4rem,13vw,9.5rem)] leading-none font-black tracking-normal text-black/10 uppercase [-webkit-text-stroke:1px_rgb(255_255_255_/0.54)]">
          EG Company
        </h1>
        <p data-anim className="mt-8 max-w-md border border-white/20 bg-white px-5 py-3 text-[10px] font-semibold tracking-[0.08em] text-black">
          We design systems that operate at velocity, severity, and scale.
        </p>
      </div>
    </section>
  );
}

function StatementSection() {
  return (
    <section data-snap className="snap-start snap-always bg-corporate-bg border-b border-corporate-border px-6 py-10 min-h-[calc(100vh-3.5rem)] flex items-center overflow-y-auto">
      <div className="mx-auto max-w-4xl">
        <p data-anim className="mb-8 font-mono text-[9px] tracking-[0.24em] text-corporate-text-subtle uppercase">
          Manifesto
        </p>
        <h2 data-anim className="text-center text-[clamp(1.6rem,4vw,3.2rem)] leading-[1.05] font-black tracking-normal uppercase">
          We believe in structure.<br />
          We believe in precision.<br />
          In a world of noise, we engineer silence and certainty.<br />
          Our methodology is brutalist; our execution is flawless.
        </h2>
      </div>
    </section>
  );
}

function StrategicCoreSection() {
  return (
    <section data-snap className="snap-start snap-always bg-corporate-bg border-b border-corporate-border px-4 py-6 sm:px-6 sm:py-10 lg:py-14 min-h-[calc(100vh-3.5rem)] flex flex-col justify-center overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl">
        <div data-anim><SectionHeading title="Strategic Core" /></div>
        <div data-anim className="mt-4 sm:mt-6 grid gap-2 sm:gap-3 md:grid-cols-3">
          <article className="relative min-h-36 sm:min-h-52 lg:min-h-64 overflow-hidden border border-corporate-border bg-black text-white md:col-span-2">
            <div className="absolute inset-0 opacity-85" style={visualStyles.stairs} />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/70 to-transparent p-4 sm:p-5">
              <p className="text-lg sm:text-2xl font-black uppercase">Strategic Intelligence</p>
              <p className="mt-1 max-w-md text-xs text-white/70 hidden sm:block">
                Precision architecture across operational depth and data channels.
              </p>
            </div>
          </article>
          <article className="border border-corporate-border bg-corporate-surface p-4 sm:p-6">
            <p className="font-mono text-[10px] text-corporate-text-muted">01</p>
            <h3 className="mt-4 sm:mt-8 text-lg sm:text-2xl leading-none font-black uppercase">Fiscal Control</h3>
            <p className="mt-2 sm:mt-4 text-xs leading-5 text-corporate-text-muted">
              Capital allocation, internal audit, risk balance, and containment finance.
            </p>
            <div className="mt-4 sm:mt-8 bg-corporate-text px-4 py-3 text-center text-[9px] font-black tracking-[0.18em] text-corporate-bg uppercase">
              Analysis Dashboard
            </div>
          </article>
          <article className="border border-corporate-border bg-corporate-surface p-4 sm:p-6">
            <p className="font-mono text-[10px] text-corporate-text-muted">02</p>
            <h3 className="mt-4 sm:mt-8 text-lg sm:text-2xl leading-none font-black uppercase">Human Capital</h3>
            <p className="mt-2 sm:mt-4 text-xs leading-5 text-corporate-text-muted">
              Operational personnel systems and precision recruitment.
            </p>
          </article>
          <article className="relative min-h-28 sm:min-h-40 overflow-hidden border border-corporate-border bg-black text-white md:col-span-2">
            <div className="absolute inset-0 opacity-80" style={visualStyles.logistics} />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 p-4 sm:p-6">
              <p className="text-lg sm:text-2xl font-black uppercase">Logistics & Mobility</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function FootprintSection({
  footprintMetrics,
}: {
  footprintMetrics: { value: string; label: string }[];
}) {
  const dots = [
    "left-[20%] top-[55%]",
    "left-[48%] top-[47%]",
    "left-[66%] top-[35%]",
    "left-[82%] top-[59%]",
  ];

  return (
    <section data-snap className="snap-start snap-always bg-corporate-bg border-b border-corporate-border px-4 py-6 sm:px-6 sm:py-10 lg:py-14 min-h-[calc(100vh-3.5rem)] flex flex-col justify-center overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl">
        <div data-anim className="grid gap-4 sm:grid-cols-[1fr_1fr] sm:items-end">
          <SectionHeading title="Global Footprint" compact />
          <p className="max-w-xs text-xs leading-5 text-corporate-text-muted sm:justify-self-end">
            Operational control across multi-continental nodes. Manufacturing, intelligence,
            pressure.
          </p>
        </div>
        <div
          data-anim
          className="relative mt-4 sm:mt-6 min-h-35 sm:min-h-50 lg:min-h-70 overflow-hidden border border-corporate-border"
          style={visualStyles.terrain}
        >
          {dots.map((dot) => (
            <span key={dot} className={`absolute h-2.5 w-2.5 bg-black ${dot}`} />
          ))}
        </div>
        <div data-anim className="grid grid-cols-2 border-x border-b border-corporate-border md:grid-cols-4">
          {footprintMetrics.map((metric) => (
            <div
              key={metric.label}
              className="border-r border-corporate-border p-3 sm:p-5 last:border-r-0"
            >
              <p className="text-2xl sm:text-3xl font-black">{metric.value}</p>
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
    <section data-snap className="snap-start snap-always relative grid min-h-[calc(100vh-3.5rem)] place-items-center overflow-hidden bg-black px-6 py-12 text-white overflow-y-auto">
      <div className="absolute inset-0 opacity-75" style={visualStyles.horizon} />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 max-w-4xl text-center">
        <h2 data-anim className="text-[clamp(3rem,10vw,8rem)] leading-none font-black tracking-normal text-transparent uppercase [-webkit-text-stroke:1px_rgb(255_255_255_/0.65)]">
          Future Horizon
        </h2>
        <p data-anim className="mx-auto mt-5 max-w-2xl text-[clamp(1.2rem,3vw,2.4rem)] leading-none font-black uppercase">
          We do not predict the future. We construct it. Our architecture for the next decade is
          already in motion.
        </p>
      </div>
    </section>
  );
}

function ImpactSection({
  impactMetrics,
}: {
  impactMetrics: { value: string; label: string }[];
}) {
  return (
    <section data-snap className="snap-start snap-always bg-corporate-bg border-b border-corporate-border px-4 py-6 sm:px-6 sm:py-10 lg:py-14 min-h-[calc(100vh-3.5rem)] flex flex-col justify-center overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl">
        <div data-anim><SectionHeading title="Impact Metrics" /></div>
        <div data-anim className="mt-4 sm:mt-8 grid gap-3 md:grid-cols-3">
          {impactMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`border border-corporate-border p-5 sm:p-7 text-center ${
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
    <section data-snap className="snap-start snap-always bg-corporate-bg border-b border-corporate-border px-4 py-6 text-center sm:px-6 sm:py-10 lg:py-14 min-h-[calc(100vh-3.5rem)] flex flex-col justify-center overflow-y-auto">
      <div className="mx-auto max-w-6xl">
        <h2 data-anim className="text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-none">Ecosystem</h2>
        <p data-anim className="mx-auto mt-4 max-w-xl text-sm leading-6 text-corporate-text-muted">
          Alliance forged with entities that share our commitment to absolute control and leverage.
        </p>
        <div data-anim className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {ecosystemItems.map((item) => (
            <div
              key={item}
              className="border border-corporate-border bg-corporate-surface px-4 py-8 sm:py-10 font-mono text-xs sm:text-sm font-black uppercase"
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
    <section data-snap className="snap-start snap-always bg-corporate-bg px-4 py-6 sm:px-6 sm:py-10 lg:py-14 min-h-[calc(100vh-3.5rem)] flex flex-col justify-center overflow-y-auto">
      <div className="mx-auto max-w-6xl">
        <div data-anim className="flex items-end justify-between gap-6">
          <SectionHeading title="Insights" compact />
          <Link
            href="/news"
            className="font-mono text-[9px] tracking-[0.22em] text-corporate-text-muted uppercase underline-offset-4 decoration-1 hover:underline transition-all"
          >
            View All Report
          </Link>
        </div>
        <div data-anim className="mt-4 sm:mt-8 grid gap-3 md:grid-cols-2">
          <InsightCard
            href="/news/q3-strategy-report"
            title="The Architecture of Market Consolidation"
            category="White Paper"
            style={visualStyles.insightA}
          />
          <InsightCard
            href="/news/unauthorized-language-pattern"
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
  href,
  title,
  category,
  style,
}: {
  href: string;
  title: string;
  category: string;
  style: CSSProperties;
}) {
  return (
    <div className="group relative">
      {/* 카드 오른쪽 아래에 고정 위치한 블러 그림자 — 호버 시 나타남 */}
      <div className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 bg-black/40 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <Link
        href={href}
        className="relative block border border-corporate-border bg-corporate-surface transition-transform duration-300 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2"
      >
        <div className="aspect-[1.65] overflow-hidden grayscale" style={style} />
        <div className="p-5">
          <p className="font-mono text-[9px] tracking-[0.2em] text-corporate-text-muted uppercase">
            {category}
          </p>
          <h3 className="mt-2 text-xl leading-tight font-semibold">{title}</h3>
          <p className="mt-5 font-mono text-xs text-corporate-text-muted">Read</p>
        </div>
      </Link>
    </div>
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
