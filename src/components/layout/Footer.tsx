"use client";

import Link from "next/link";
import { cx } from "@/theme/classes";
import { useCorporateTheme } from "@/theme/ThemeProvider";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

export default function Footer() {
  const lang = useLanguage();
  const { classes: theme } = useCorporateTheme();

  return (
    <footer className={cx("mt-auto border-t py-10", theme.border)}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className={cx("text-[11px] tracking-widest uppercase", theme.textSubtle)}>
          © 2024 EG Company. Corporate Headquarters.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 sm:gap-x-10">
          <Link
            href="/information"
            className={cx("text-[11px] tracking-widest uppercase", theme.linkMuted)}
          >
            {t("footer_company_info", lang)}
          </Link>
          <Link
            href="/contact"
            className={cx("text-[11px] tracking-widest uppercase", theme.linkMuted)}
          >
            {t("footer_contact", lang)}
          </Link>
        </div>
      </div>
    </footer>
  );
}
