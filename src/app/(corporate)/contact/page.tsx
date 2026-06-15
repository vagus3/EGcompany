"use client";

import { useState } from "react";
import Link from "next/link";
import { departments } from "@/lib/departments-data";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

function getDepartmentHref(slug: string) {
  return slug === "security" ? "/portals/security/terminal" : `/portals/${slug}/detail`;
}

export default function Page() {
  const lang = useLanguage();
  const [report, setReport] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!report.trim()) return;
    setSent(true);
    setReport("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Heading */}
      <h1 className="mb-14 text-[clamp(3rem,6vw,5rem)] font-black tracking-tight text-black">
        Contact.
      </h1>

      {/* Department cards */}
      <div className="mb-14 grid gap-px border border-gray-200 bg-gray-200 sm:mb-20 sm:grid-cols-2">
        {departments.map(({ category, name, slug, email, phone }) => (
          <Link
            key={name}
            href={getDepartmentHref(slug)}
            className="group block bg-white p-5 transition-colors hover:bg-gray-50 sm:p-7"
          >
            <p className="mb-1 text-[10px] tracking-widest text-gray-400 uppercase">{category}</p>
            <h2 className="mb-4 text-xl font-black tracking-tight text-black underline-offset-2 group-hover:underline sm:text-2xl">
              {name}
            </h2>
            <p className="text-sm text-gray-600">{email}</p>
            <p className="mt-1 text-sm text-gray-600">{phone}</p>
          </Link>
        ))}
        {departments.length % 2 !== 0 && <div className="hidden bg-white sm:block" />}
      </div>

      {/* Report form */}
      <div className="max-w-xl">
        <h2 className="mb-2 text-3xl font-black tracking-tight text-black">
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
    </div>
  );
}
