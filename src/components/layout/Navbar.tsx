"use client";

import { Languages, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/about", ko: "회사소개", en: "About Us" },
  { href: "/rules", ko: "규정", en: "Rules" },
  { href: "/news", ko: "뉴스", en: "News" },
  { href: "/contact", ko: "문의", en: "Contact" },
];

type Language = "ko" | "en";

export default function Navbar() {
  const pathname = usePathname();
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "ko";
    return window.localStorage.getItem("eg-language") === "en" ? "en" : "ko";
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.classList.add("light-mode");
  }, [language]);

  function handleLanguageChange(nextLanguage: Language) {
    setLanguage(nextLanguage);
    window.localStorage.setItem("eg-language", nextLanguage);
    document.documentElement.lang = nextLanguage;
  }

  function enforceLightMode() {
    document.documentElement.classList.add("light-mode");
    window.localStorage.setItem("eg-theme", "light");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto grid min-h-14 max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-6 lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="text-xl font-black tracking-tight text-black">
          EG Company
        </Link>

        <ul className="hidden items-center justify-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    active ? "text-black" : "text-neutral-500 hover:text-black"
                  }`}
                >
                  {language === "ko" ? link.ko : link.en}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-end gap-2">
          <label className="hidden items-center gap-1.5 border border-neutral-200 px-2 py-1.5 text-[11px] font-bold text-neutral-600 sm:flex">
            <Languages className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Language</span>
            <select
              value={language}
              onChange={(event) => handleLanguageChange(event.target.value as Language)}
              className="bg-transparent text-[11px] font-bold outline-none"
              aria-label="Language"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </label>

          <button
            type="button"
            onClick={enforceLightMode}
            className="hidden items-center gap-1.5 px-2 py-1.5 text-[11px] font-bold text-neutral-600 transition-colors hover:text-black sm:flex"
            aria-label="Enable light mode"
          >
            <Sun className="h-3.5 w-3.5" aria-hidden="true" />
            Light
          </button>

          <Link
            href="/login"
            className="hidden px-2 py-1.5 text-sm font-semibold text-neutral-500 transition-colors hover:text-black sm:inline-flex"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="bg-black px-4 py-2 text-sm font-black text-white transition-colors hover:bg-neutral-700"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
