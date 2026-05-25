"use client";

import { Check, ChevronDown, Languages, Monitor, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Theme color mappings
const themeColors = {
  light: {
    text: "text-black",
    border: "border-neutral-200",
    textMuted: "text-neutral-500",
    linkMuted: "text-neutral-500 hover:text-black",
    bg: "bg-white",
  },
  dark: {
    text: "text-white",
    border: "border-neutral-700",
    textMuted: "text-neutral-400",
    linkMuted: "text-neutral-400 hover:text-white",
    bg: "bg-neutral-900",
  },
};

// Utility function to combine classnames
function cx(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const navLinks = [
  { href: "/about", ko: "회사소개", en: "About Us" },
  { href: "/rules", ko: "규정", en: "Rules" },
  { href: "/news", ko: "뉴스", en: "News" },
  { href: "/contact", ko: "문의", en: "Contact" },
];

type Language = "ko" | "en";
type ThemeMode = "light" | "dark" | "system";

const languageChangeEvent = "eg-language-change";
const themeChangeEvent = "eg-theme-change";

const themeOptions: Array<{
  icon: typeof Sun;
  label: string;
  value: ThemeMode;
}> = [
  { value: "light", label: "Light mode", icon: Sun },
  { value: "dark", label: "Dark mode", icon: Moon },
  { value: "system", label: "System setting", icon: Monitor },
];

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "dark" || value === "system" || value === "light";
}

function getLanguageSnapshot(): Language {
  return window.localStorage.getItem("eg-language") === "en" ? "en" : "ko";
}

function getServerLanguageSnapshot(): Language {
  return "ko";
}

function getThemeSnapshot(): ThemeMode {
  const savedTheme = window.localStorage.getItem("eg-theme");
  return isThemeMode(savedTheme) ? savedTheme : "light";
}

function getServerThemeSnapshot(): ThemeMode {
  return "light";
}

function subscribeToLanguage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(languageChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(languageChangeEvent, onStoreChange);
  };
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(themeChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(themeChangeEvent, onStoreChange);
  };
}

function applyThemeMode(mode: ThemeMode, persist = true) {
  document.documentElement.classList.remove("light-mode", "dark-mode", "system-mode");
  document.documentElement.classList.add(`${mode}-mode`);
  if (persist) {
    window.localStorage.setItem("eg-theme", mode);
  }
}

export default function Navbar() {
  const pathname = usePathname();
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot
  );
  const themeMode = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const theme = themeMode === "dark" ? themeColors.dark : themeColors.light;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    applyThemeMode(themeMode, false);
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
    window.localStorage.setItem("eg-language", nextLanguage);
    window.dispatchEvent(new Event(languageChangeEvent));
    document.documentElement.lang = nextLanguage;
  }

  function handleThemeChange(nextTheme: ThemeMode) {
    applyThemeMode(nextTheme);
    window.dispatchEvent(new Event(themeChangeEvent));
    setThemeMenuOpen(false);
  }

  const activeThemeOption = themeOptions.find((option) => option.value === themeMode);
  const ActiveThemeIcon = activeThemeOption?.icon ?? Sun;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <nav className="relative mx-auto grid min-h-14 max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-6 lg:grid-cols-[1fr_auto_1fr]">
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
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="hidden items-center gap-1.5 border px-2 py-1.5 text-[11px] font-bold sm:flex"
            style={{
              borderColor: theme.border === "border-neutral-200" ? "#e5e7eb" : "#404040",
              color: theme.textMuted === "text-neutral-500" ? "#6b7280" : "#9ca3af",
            }}
            aria-label="Theme selector"
            aria-expanded={themeMenuOpen}
            aria-haspopup="menu"
          >
            <ActiveThemeIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {activeThemeOption?.label}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${themeMenuOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {themeMenuOpen && (
            <div
              ref={themeMenuRef}
              className={`absolute top-14 right-0 border shadow-lg ${theme.bg}`}
              style={{
                borderColor: theme.border === "border-neutral-200" ? "#e5e7eb" : "#404040",
              }}
              role="menu"
            >
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-[11px] font-bold transition-colors ${
                    option.value === themeMode
                      ? theme.text === "text-black"
                        ? "bg-neutral-100"
                        : "bg-neutral-800"
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      option.value === themeMode
                        ? theme.text === "text-black"
                          ? "#f3f4f6"
                          : "#1f2937"
                        : undefined,
                    color: theme.textMuted === "text-neutral-500" ? "#6b7280" : "#9ca3af",
                  }}
                  onMouseEnter={(e) => {
                    if (option.value !== themeMode) {
                      e.currentTarget.style.backgroundColor =
                        theme.text === "text-black" ? "#f9fafb" : "#111827";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      option.value === themeMode
                        ? theme.text === "text-black"
                          ? "#f3f4f6"
                          : "#1f2937"
                        : "";
                  }}
                  role="menuitemradio"
                  aria-checked={option.value === themeMode}
                >
                  <option.icon className="h-4 w-4" aria-hidden="true" />
                  {option.label}
                  {option.value === themeMode && (
                    <Check className="ml-auto h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          )}

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
