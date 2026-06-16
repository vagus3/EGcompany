"use client";

import type { CSSProperties } from "react";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";

import { AdminAccessTestModal } from "@/components/layout/AdminAccessTestModal";
import {
  adminTestPassedKey,
  adminTestRequiredKey,
  adminTestStorageEvent,
} from "@/lib/admin-test";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

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
  const lang = useLanguage();
  const adminTestRequired = useSyncExternalStore(
    subscribeToAdminTest,
    getAdminTestRequiredSnapshot,
    getServerAdminTestRequiredSnapshot
  );
  const [testDismissed, setTestDismissed] = useState(false);

  function handleAdminTestPassed() {
    window.localStorage.removeItem(adminTestRequiredKey);
    window.localStorage.setItem(adminTestPassedKey, "true");
    window.dispatchEvent(new Event(adminTestStorageEvent));
    setTestDismissed(false);
  }

  const modalOpen = adminTestRequired && !testDismissed;

  const impactMetrics = [
    { value: "2.4B", label: t("home_metric_data", lang) },
    { value: "150+", label: t("home_metric_systems", lang) },
    { value: "12K", label: t("home_metric_nodes", lang) },
  ];

  const footprintMetrics = [
    { value: "142", label: t("home_foot_sites", lang) },
    { value: "84K+", label: t("home_foot_employees", lang) },
    { value: "$12B", label: t("home_foot_assets", lang) },
    { value: "99.9%", label: t("home_foot_continuity", lang) },
  ];

  return (
    <div className="bg-corporate-bg text-corporate-text">
      <HeroSection lang={lang} />
      <StatementSection lang={lang} />
      <StrategicCoreSection lang={lang} />
      <FootprintSection lang={lang} footprintMetrics={footprintMetrics} />
      <FutureSection lang={lang} />
      <ImpactSection lang={lang} impactMetrics={impactMetrics} />
      <EcosystemSection lang={lang} />
      <InsightsSection lang={lang} />

      {modalOpen && (
        <AdminAccessTestModal
          onClose={() => setTestDismissed(true)}
          onPassed={handleAdminTestPassed}
        />
      )}
    </div>
  );
}

type Lang = ReturnType<typeof useLanguage>;

function HeroSection({ lang }: { lang: Lang }) {
  return (
    <section className="relative grid min-h-[calc(100vh-3.5rem)] place-items-center overflow-hidden border-b border-corporate-border">
      <div className="absolute inset-0 grayscale" style={visualStyles.hero} />
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center px-6 text-center">
        <p className="mb-8 border border-white/25 bg-black/60 px-3 py-1 font-mono text-[9px] font-black tracking-[0.26em] text-white/70 uppercase">
          {t("home_tagline", lang)}
        </p>
        <h1 className="text-[clamp(3.4rem,13vw,9.5rem)] leading-none font-black tracking-normal text-black/10 uppercase [-webkit-text-stroke:1px_rgb(255_255_255_/0.54)]">
          EG Company
        </h1>
        <p className="mt-8 max-w-md border border-white/20 bg-white px-5 py-3 text-[10px] font-semibold tracking-[0.08em] text-black">
          {t("home_hero_desc", lang)}
        </p>
      </div>
    </section>
  );
}

function StatementSection({ lang }: { lang: Lang }) {
  return (
    <section className="border-b border-corporate-border px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="mb-8 text-center font-mono text-[9px] tracking-[0.24em] text-corporate-text-subtle uppercase">
          {t("home_manifesto_label", lang)}
        </p>
        <h2 className="mx-auto max-w-3xl text-center text-[clamp(1.6rem,4vw,3.2rem)] leading-[0.95] font-black tracking-normal uppercase">
          {t("home_manifesto", lang)}
        </h2>
      </div>
    </section>
  );
}

function StrategicCoreSection({ lang }: { lang: Lang }) {
  return (
    <section className="border-b border-corporate-border px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("home_strategic_core", lang)} />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <article className="relative min-h-72 overflow-hidden border border-corporate-border bg-black text-white md:col-span-2">
            <div className="absolute inset-0 opacity-85" style={visualStyles.stairs} />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/70 to-transparent p-5">
              <p className="text-2xl font-black uppercase">{t("home_strategic_intel", lang)}</p>
              <p className="mt-1 max-w-md text-xs text-white/70">
                {t("home_strategic_intel_desc", lang)}
              </p>
            </div>
          </article>
          <article className="border border-corporate-border bg-corporate-surface p-6">
            <p className="font-mono text-[10px] text-corporate-text-muted">01</p>
            <h3 className="mt-8 text-2xl leading-none font-black uppercase">
              {t("home_fiscal_control", lang)}
            </h3>
            <p className="mt-4 text-xs leading-5 text-corporate-text-muted">
              {t("home_fiscal_control_desc", lang)}
            </p>
            <div className="mt-16 bg-corporate-text px-4 py-3 text-center text-[9px] font-black tracking-[0.18em] text-corporate-bg uppercase">
              {t("home_fiscal_dashboard", lang)}
            </div>
          </article>
          <article className="border border-corporate-border bg-corporate-surface p-6">
            <p className="font-mono text-[10px] text-corporate-text-muted">02</p>
            <h3 className="mt-8 text-2xl leading-none font-black uppercase">
              {t("home_human_capital", lang)}
            </h3>
            <p className="mt-4 text-xs leading-5 text-corporate-text-muted">
              {t("home_human_capital_desc", lang)}
            </p>
          </article>
          <article className="relative min-h-48 overflow-hidden border border-corporate-border bg-black text-white md:col-span-2">
            <div className="absolute inset-0 opacity-80" style={visualStyles.logistics} />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 p-6">
              <p className="text-2xl font-black uppercase">{t("home_logistics", lang)}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function FootprintSection({
  lang,
  footprintMetrics,
}: {
  lang: Lang;
  footprintMetrics: { value: string; label: string }[];
}) {
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
          <SectionHeading title={t("home_global_footprint", lang)} compact />
          <p className="max-w-xs text-xs leading-5 text-corporate-text-muted sm:justify-self-end">
            {t("home_footprint_desc", lang)}
          </p>
        </div>
        <div
          className="relative mt-8 min-h-310px overflow-hidden border border-corporate-border"
          style={visualStyles.terrain}
        >
          {dots.map((dot) => (
            <span key={dot} className={`absolute h-2.5 w-2.5 bg-black ${dot}`} />
          ))}
        </div>
        <div className="grid grid-cols-2 border-x border-b border-corporate-border md:grid-cols-4">
          {footprintMetrics.map((metric) => (
            <div
              key={metric.label}
              className="border-r border-corporate-border p-5 last:border-r-0"
            >
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

function FutureSection({ lang }: { lang: Lang }) {
  return (
    <section className="relative grid min-h-430px place-items-center overflow-hidden bg-black px-6 py-20 text-white">
      <div className="absolute inset-0 opacity-75" style={visualStyles.horizon} />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 max-w-4xl text-center">
        <h2 className="text-[clamp(3rem,10vw,8rem)] leading-none font-black tracking-normal text-transparent uppercase [-webkit-text-stroke:1px_rgb(255_255_255_/0.65)]">
          {t("home_future", lang)}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[clamp(1.2rem,3vw,2.4rem)] leading-none font-black uppercase">
          {t("home_future_desc", lang)}
        </p>
      </div>
    </section>
  );
}

function ImpactSection({
  lang,
  impactMetrics,
}: {
  lang: Lang;
  impactMetrics: { value: string; label: string }[];
}) {
  return (
    <section className="border-b border-corporate-border px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t("home_impact", lang)} />
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

function EcosystemSection({ lang }: { lang: Lang }) {
  return (
    <section className="border-b border-corporate-border px-4 py-16 text-center sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black uppercase">
          {t("home_ecosystem", lang)}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-xs leading-5 text-corporate-text-muted">
          {t("home_ecosystem_desc", lang)}
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

function InsightsSection({ lang }: { lang: Lang }) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading title={t("home_insights", lang)} compact />
          <p className="font-mono text-[9px] tracking-[0.22em] text-corporate-text-muted uppercase">
            {t("home_view_all", lang)}
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <InsightCard
            href="/news/q3-strategy-report"
            title={t("home_insight_a_title", lang)}
            category={t("home_insight_a_cat", lang)}
            readLabel={t("home_read", lang)}
            style={visualStyles.insightA}
          />
          <InsightCard
            href="/news/unauthorized-language-pattern"
            title={t("home_insight_b_title", lang)}
            category={t("home_insight_b_cat", lang)}
            readLabel={t("home_read", lang)}
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
  readLabel,
  style,
}: {
  href: string;
  title: string;
  category: string;
  readLabel: string;
  style: CSSProperties;
}) {
  return (
    <Link href={href} className="block border border-corporate-border bg-corporate-surface">
      <div className="aspect-[1.65] grayscale" style={style} />
      <div className="p-5">
        <p className="font-mono text-[9px] tracking-[0.2em] text-corporate-text-muted uppercase">
          {category}
        </p>
        <h3 className="mt-2 text-xl leading-tight font-semibold">{title}</h3>
        <p className="mt-5 font-mono text-xs text-corporate-text-muted">{readLabel}</p>
      </div>
    </Link>
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
