"use client";

import Link from "next/link";
import { departments } from "@/lib/departments-data";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

export default function Page() {
  const lang = useLanguage();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Heading */}
      <h1 className="mb-14 text-[clamp(3rem,6vw,5rem)] font-black tracking-tight text-black">
        Contact.
      </h1>

      {/* Department cards */}
      <div className="mb-14 grid gap-px border border-gray-200 bg-gray-200 sm:mb-20 sm:grid-cols-2">
        {departments.map(({ category, name, slug, email, phone }) => (
          <div key={slug} className="bg-white p-5 sm:p-7">
            <p className="mb-1 text-[10px] tracking-widest text-gray-400 uppercase">{category}</p>
            <h2 className="mb-4 text-xl font-black tracking-tight text-black sm:text-2xl">
              {name}
            </h2>
            <p className="text-sm text-gray-600">{email}</p>
            <p className="mt-1 text-sm text-gray-600">{phone}</p>
          </div>
        ))}
        {departments.length % 2 !== 0 && <div className="hidden bg-white sm:block" />}
      </div>

      {/* Contact Us 버튼 */}
      <div>
        <Link
          href="/contact/report"
          className="inline-block bg-black px-10 py-4 text-xs font-black tracking-widest text-white uppercase transition-colors hover:bg-gray-800"
        >
          {t("footer_contact", lang)}
        </Link>
      </div>
    </div>
  );
}
