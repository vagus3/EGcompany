"use client";

import { useState } from "react";
import Link from "next/link";
import { departments } from "./departments-data";

export default function ContactPage() {
  const [report, setReport] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!report.trim()) return;
    setSent(true);
    setReport("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Heading */}
      <h1 className="text-[clamp(3rem,6vw,5rem)] font-black tracking-tight text-black mb-14">
        Contact.
      </h1>

      {/* Department cards */}
      <div className="grid grid-cols-2 gap-px bg-gray-200 border border-gray-200 mb-20">
        {departments.map(({ category, name, slug, email, phone }) => (
          <Link
            key={name}
            href={slug.toLowerCase() === 'hr' || name.includes('HR') || name === 'Human Resources' ? '/HR' : `/portals/${slug}`}
            className="bg-white p-7 block hover:bg-gray-50 transition-colors group"
          >
            <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">{category}</p>
            <h2 className="text-2xl font-black tracking-tight text-black mb-4 group-hover:underline underline-offset-2">
              {name}
            </h2>
            <p className="text-sm text-gray-600">{email}</p>
            <p className="text-sm text-gray-600 mt-1">{phone}</p>
          </Link>
        ))}
        {/* Empty cell to fill last row if odd */}
        {departments.length % 2 !== 0 && <div className="bg-white" />}
      </div>

      {/* Report form */}
      <div className="max-w-xl">
        <h2 className="text-3xl font-black tracking-tight text-black mb-2">Report</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          무언가 회사 측에 익명의 제보가 필요하거나, 도움이 필요한 사항이 있다면 이곳에 접수 해 주세요.
          <br />
          검토 후 인사팀에게 전달됩니다.
        </p>
        <textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="Enter your report details here..."
          rows={7}
          className="w-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black resize-none"
        />
        <button
          onClick={handleSend}
          className="mt-4 bg-black text-white text-xs tracking-widest uppercase px-8 py-3 hover:bg-gray-800 transition-colors"
        >
          {sent ? "Sent ✓" : "Send Report"}
        </button>
      </div>
    </div>
  );
}
