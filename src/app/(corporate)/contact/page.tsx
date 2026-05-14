"use client";

import { useState } from "react";
import Link from "next/link";
import { departments } from "@/lib/departments-data";

export default function Page() {
  const [report, setReport] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!report.trim()) return;
    setSent(true);
    setReport("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Heading */}
      <h1 className="mb-14 text-[clamp(3rem,6vw,5rem)] font-black tracking-tight text-black">
        Contact.
      </h1>

      {/* Department cards */}
      <div className="mb-20 grid grid-cols-2 gap-px border border-gray-200 bg-gray-200">
        {departments.map(({ category, name, slug, email, phone }) => (
          <Link
            key={name}
            href={
              slug.toLowerCase() === "hr" || name.includes("HR") || name === "Human Resources"
                ? "/HR"
                : `/portals/${slug}`
            }
            className="group block bg-white p-7 transition-colors hover:bg-gray-50"
          >
            <p className="mb-1 text-[10px] tracking-widest text-gray-400 uppercase">{category}</p>
            <h2 className="mb-4 text-2xl font-black tracking-tight text-black underline-offset-2 group-hover:underline">
              {name}
            </h2>
            <p className="text-sm text-gray-600">{email}</p>
            <p className="mt-1 text-sm text-gray-600">{phone}</p>
          </Link>
        ))}
        {/* Empty cell to fill last row if odd */}
        {departments.length % 2 !== 0 && <div className="bg-white" />}
      </div>

      {/* Report form */}
      <div className="max-w-xl">
        <h2 className="mb-2 text-3xl font-black tracking-tight text-black">Report</h2>
        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          무언가 회사 측에 익명의 제보가 필요하거나, 도움이 필요한 사항이 있다면 이곳에 접수 해
          주세요.
          <br />
          검토 후 인사팀에게 전달됩니다.
        </p>
        <textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="Enter your report details here..."
          rows={7}
          className="w-full resize-none border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="mt-4 bg-black px-8 py-3 text-xs tracking-widest text-white uppercase transition-colors hover:bg-gray-800"
        >
          {sent ? "Sent ✓" : "Send Report"}
        </button>
      </div>
    </div>
  );
}
