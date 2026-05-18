"use client";

import { Check, ChevronDown, Languages, Monitor, Moon, Sun } from "lucide-react";
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
type ThemeMode = "light" | "dark" | "system";

const themeOptions: Array<{
  icon: typeof Sun;
  label: string;
  value: ThemeMode;
}> = [
  { value: "light", label: "Light mode", icon: Sun },
  { value: "dark", label: "Dark mode", icon: Moon },
  { value: "system", label: "System setting", icon: Monitor },
];

function applyThemeMode(mode: ThemeMode) {
  document.documentElement.classList.remove("light-mode", "dark-mode", "system-mode");
  document.documentElement.classList.add(`${mode}-mode`);
  window.localStorage.setItem("eg-theme", mode);
}

export default function Navbar() {
  const pathname = usePathname();
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "ko";
    return window.localStorage.getItem("eg-language") === "en" ? "en" : "ko";
  });
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    const savedTheme = window.localStorage.getItem("eg-theme");
    return savedTheme === "dark" || savedTheme === "system" || savedTheme === "light"
      ? savedTheme
      : "light";
  });
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        themeMenuRef.current &&
        event.target instanceof Node &&
        !themeMenuRef.current.contains(event.target)
      ) {
        setThemeMenuOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function handleLanguageChange(nextLanguage: Language) {
    setLanguage(nextLanguage);
    window.localStorage.setItem("eg-language", nextLanguage);
    document.documentElement.lang = nextLanguage;
  }

  function handleThemeChange(nextTheme: ThemeMode) {
    setThemeMode(nextTheme);
    setThemeMenuOpen(false);
  }

  const activeThemeOption = themeOptions.find((option) => option.value === themeMode);
  const ActiveThemeIcon = activeThemeOption?.icon ?? Sun;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto grid min-h-14 max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-6 lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className={cx("text-xl font-black tracking-tight", theme.text)}>
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
          <label
            className={cx(
              "hidden items-center gap-1.5 border px-2 py-1.5 text-[11px] font-bold sm:flex",
              theme.border,
              theme.textMuted
            )}
          >
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
            className={cx(
              "hidden px-2 py-1.5 text-sm font-semibold sm:inline-flex",
              theme.linkMuted
            )}
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
