"use client";

import Image from "next/image";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { companyEvolutionData } from "@/lib/evolution-data";

export default function Page() {
  const lang = useLanguage();

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="mx-auto grid max-w-5xl items-start gap-8 px-4 pt-14 pb-16 sm:px-6 md:grid-cols-2 md:gap-16 md:pt-20 md:pb-24">
        <h1 className="text-[clamp(2.8rem,5vw,4.2rem)] leading-tight font-black tracking-tight text-black">
          {t("about_subtitle_1", lang)}
          <br />
          {t("about_subtitle_2", lang)}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-500">{t("about_desc", lang)}</p>
      </section>

      {/* Director section */}
      <section className="mx-auto grid max-w-5xl items-start gap-10 px-4 pb-16 sm:px-6 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] lg:gap-16 lg:pb-24">
        {/* Portrait */}
        <div>
          <div className="relative aspect-4/5 w-full max-w-72 overflow-hidden bg-gray-800 md:max-w-none">
            <Image
              src="/eg_png/egcompany_picture/AboutUs/AboutUs.png"
              alt="Director E.G. portrait"
              fill
              sizes="(min-width: 768px) 280px, 288px"
              className="object-cover"
              priority
            />
          </div>
          <p className="mt-3 text-sm font-semibold text-black">Director E.G.</p>
          <p className="mt-0.5 text-xs tracking-widest text-gray-400 uppercase">
            {t("about_director_title", lang)}
          </p>
        </div>

        {/* Quote & speech */}
        <div className="pt-4">
          <span className="font-serif text-5xl leading-none text-gray-300 select-none">&quot;</span>
          <blockquote className="mt-2 text-[1.35rem] leading-snug font-semibold text-black">
            &quot;{t("about_quote", lang)}&quot;
          </blockquote>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-gray-600">
            <p>{t("about_speech_1", lang)}</p>
            <p>{t("about_speech_2", lang)}</p>
            <p>{t("about_speech_3", lang)}</p>
            <p className="font-semibold text-black">{t("about_speech_4", lang)}</p>
          </div>
          <p className="mt-8 flex items-center gap-3 text-xs tracking-[0.25em] text-gray-400 uppercase">
            <span className="inline-block h-px w-10 bg-gray-400" />
            Director E.G.
          </p>
        </div>
      </section>

      {/* Company Evolution */}
      <section className="bg-gray-100 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-14 text-xs tracking-widest text-gray-400 uppercase">
            {t("about_evolution", lang)}
          </h2>
          <div className="divide-y divide-gray-300">
            {companyEvolutionData.map(({ year, title, desc, desc_en }) => (
              <div
                key={year}
                className="grid items-start gap-3 py-8 sm:grid-cols-[120px_1fr] lg:grid-cols-[140px_220px_1fr] lg:gap-8 lg:py-10"
              >
                <span className="text-4xl font-black text-gray-300">{year}</span>
                <p className="pt-2 text-xs tracking-widest text-gray-500 uppercase">{title}</p>
                <p className="text-sm leading-relaxed text-gray-600">
                  {lang === "en" ? desc_en : desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
