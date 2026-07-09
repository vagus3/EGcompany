"use client";

import { ChevronDown, Languages, Monitor, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cx } from "@/theme/classes";
import { useCorporateTheme } from "@/theme/ThemeProvider";

const navLinks = [
  { href: "/about", ko: "회사소개", en: "About Us" },
  { href: "/rules", ko: "규정", en: "Rules" },
  { href: "/news", ko: "뉴스", en: "News" },
  { href: "/contact", ko: "문의", en: "Contact" },
];

type Language = "ko" | "en";
type ThemeMode = "light" | "dark" | "system";
type CurrentUser = {
  email: string;
  name: string | null;
};

const languageChangeEvent = "eg-language-change";
const themeChangeEvent = "eg-theme-change";

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
];

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
  const { classes: theme } = useCorporateTheme();
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot
  );
  const themeMode = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    applyThemeMode(themeMode, false);
  }, [themeMode]);

  useEffect(() => {
    let ignore = false;

    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load current user.");
        }

        const data = (await response.json()) as {
          user: CurrentUser | null;
          adminTestPassed: boolean;
        };

        if (!ignore) {
          setCurrentUser(data.user);
          setAdminUnlocked(data.adminTestPassed);
        }
      } catch {
        if (!ignore) {
          setCurrentUser(null);
          setAdminUnlocked(false);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      ignore = true;
    };
  }, [pathname]);

  function handleLanguageChange(nextLanguage: Language) {
    window.localStorage.setItem("eg-language", nextLanguage);
    window.location.reload();
  }

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to log out.");
      }

      setCurrentUser(null);
    } catch {
      setCurrentUser(null);
    }
  }

  const currentUserLabel = currentUser?.name ?? currentUser?.email;

  return (
    <header
      className={cx(
        "bg-corporate-surface/95 sticky top-0 z-50 border-b backdrop-blur",
        theme.border
      )}
    >
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:grid lg:min-h-16 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:py-0">
        <Link href="/" className={cx("flex items-center gap-2.5 font-black tracking-tight", theme.text)}>
          <Image
            src="/eg_png/egcompany_picture/EGCompanyLOGO.png"
            alt="EG Company"
            width={64}
            height={64}
            className="h-16 w-auto shrink-0 object-contain"
          />
          <span className="text-lg sm:text-xl">EG Company</span>
        </Link>

        <ul className="hidden min-w-0 flex-wrap items-center gap-x-5 gap-y-2 lg:flex lg:justify-center">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cx(
                    "text-sm font-semibold transition-colors",
                    active ? theme.text : theme.linkMuted
                  )}
                >
                  {language === "ko" ? link.ko : link.en}
                </Link>
              </li>
            );
          })}
          {adminUnlocked && (
            <li>
              <Link
                href="/portals/security/terminal"
                className="text-sm font-black text-red-600 transition-colors hover:text-red-500"
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden items-center justify-end gap-2 lg:flex">
          <HeaderControls
            language={language}
            themeMode={themeMode}
            onLanguageChange={handleLanguageChange}
            theme={theme}
          />

          {currentUserLabel ? (
            <>
              <button
                type="button"
                onClick={handleLogout}
                className={cx("px-2 py-1.5 text-sm font-semibold", theme.linkMuted)}
              >
                Log Out
              </button>

              <span
                className={cx(
                  "max-w-36 truncate border px-3 py-1.5 text-xs font-black",
                  theme.border,
                  theme.text
                )}
                title={currentUserLabel}
              >
                {currentUserLabel}
              </span>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cx("px-2 py-1.5 text-sm font-semibold", theme.linkMuted)}
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className={cx("px-4 py-2 text-sm font-black", theme.buttonPrimary)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className={cx(
            "grid h-10 w-10 shrink-0 place-items-center border transition-colors lg:hidden",
            theme.border,
            theme.text
          )}
          aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          <span className="relative block h-4 w-5">
            <span
              className={cx(
                "absolute left-0 block h-0.5 w-5 bg-current transition-[transform,top] duration-300 ease-in-out",
                mobileMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0 rotate-0"
              )}
            />
            <span
              className={cx(
                "absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 bg-current transition-[opacity,transform] duration-200 ease-in-out",
                mobileMenuOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
              )}
            />
            <span
              className={cx(
                "absolute left-0 block h-0.5 w-5 bg-current transition-[transform,top] duration-300 ease-in-out",
                mobileMenuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-4 rotate-0"
              )}
            />
          </span>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div id="mobile-nav-menu" className={cx("border-t px-4 py-5 lg:hidden", theme.border)}>
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const active = pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cx(
                      "block text-sm font-semibold transition-colors",
                      active ? theme.text : theme.linkMuted
                    )}
                  >
                    {language === "ko" ? link.ko : link.en}
                  </Link>
                </li>
              );
            })}
            {adminUnlocked && (
              <li>
                <Link
                  href="/portals/security/terminal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-black text-red-600 transition-colors hover:text-red-500"
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className={cx("mt-5 flex flex-wrap items-center gap-2 border-t pt-5", theme.border)}>
            <HeaderControls
              language={language}
              themeMode={themeMode}
              onLanguageChange={handleLanguageChange}
              theme={theme}
            />
          </div>

          <div className={cx("mt-5 flex items-center gap-2 border-t pt-5", theme.border)}>
            {currentUserLabel ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    void handleLogout();
                  }}
                  className={cx("px-2 py-1.5 text-sm font-semibold", theme.linkMuted)}
                >
                  Log Out
                </button>

                <span
                  className={cx(
                    "max-w-36 truncate border px-3 py-1.5 text-xs font-black",
                    theme.border,
                    theme.text
                  )}
                  title={currentUserLabel}
                >
                  {currentUserLabel}
                </span>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cx("px-2 py-1.5 text-sm font-semibold", theme.linkMuted)}
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cx("px-4 py-2 text-sm font-black", theme.buttonPrimary)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function HeaderControls({
  language,
  themeMode,
  onLanguageChange,
  theme,
}: {
  language: Language;
  themeMode: ThemeMode;
  onLanguageChange: (language: Language) => void;
  theme: ReturnType<typeof useCorporateTheme>["classes"];
}) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        langMenuRef.current &&
        event.target instanceof Node &&
        !langMenuRef.current.contains(event.target)
      ) {
        setLangMenuOpen(false);
      }
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

  function handleThemeChange(nextTheme: ThemeMode) {
    applyThemeMode(nextTheme);
    window.dispatchEvent(new Event(themeChangeEvent));
    setThemeMenuOpen(false);
  }

  const activeThemeOption = themeOptions.find((o) => o.value === themeMode);
  const ActiveThemeIcon = activeThemeOption?.icon ?? Sun;
  const activeLangOption = languageOptions.find((o) => o.value === language);

  return (
    <>
      {/* 언어 커스텀 드롭다운 */}
      <div className="relative" ref={langMenuRef}>
        <button
          type="button"
          onClick={() => setLangMenuOpen((open) => !open)}
          className={cx(
            "flex items-center gap-1.5 border px-2 py-1.5 text-[11px] font-bold",
            theme.border,
            theme.textMuted
          )}
          aria-label="Language selector"
          aria-expanded={langMenuOpen}
          aria-haspopup="menu"
        >
          <Languages className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">{activeLangOption?.label}</span>
          <ChevronDown
            className={cx("h-3.5 w-3.5 transition-transform", langMenuOpen && "rotate-180")}
            aria-hidden="true"
          />
        </button>

        {langMenuOpen && (
          <div
            className={cx(
              "bg-corporate-surface absolute top-[calc(100%+4px)] right-0 z-20 w-max min-w-full border whitespace-nowrap shadow-lg",
              theme.border
            )}
            role="menu"
          >
            {languageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onLanguageChange(option.value);
                  setLangMenuOpen(false);
                }}
                className={cx(
                  "hover:bg-corporate-surface-muted flex w-full items-center gap-3 px-4 py-3 text-left text-[11px] font-bold transition-colors",
                  theme.textMuted,
                  option.value === language && theme.surfaceMuted
                )}
                role="menuitemradio"
                aria-checked={option.value === language}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 테마 커스텀 드롭다운 */}
      <div className="relative" ref={themeMenuRef}>
        <button
          type="button"
          onClick={() => setThemeMenuOpen((open) => !open)}
          className={cx(
            "flex items-center gap-1.5 border px-2 py-1.5 text-[11px] font-bold",
            theme.border,
            theme.linkMuted
          )}
          aria-label="Theme selector"
          aria-expanded={themeMenuOpen}
          aria-haspopup="menu"
        >
          <ActiveThemeIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">{activeThemeOption?.label}</span>
          <ChevronDown
            className={cx("h-3.5 w-3.5 transition-transform", themeMenuOpen && "rotate-180")}
            aria-hidden="true"
          />
        </button>

        {themeMenuOpen && (
          <div
            className={cx(
              "bg-corporate-surface absolute top-[calc(100%+4px)] right-0 z-20 w-max min-w-full border whitespace-nowrap shadow-lg",
              theme.border
            )}
            role="menu"
          >
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleThemeChange(option.value)}
                className={cx(
                  "hover:bg-corporate-surface-muted flex w-full items-center gap-3 px-4 py-3 text-left text-[11px] font-bold transition-colors",
                  theme.textMuted,
                  option.value === themeMode && theme.surfaceMuted
                )}
                role="menuitemradio"
                aria-checked={option.value === themeMode}
              >
                <option.icon className="h-4 w-4" aria-hidden="true" />
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
