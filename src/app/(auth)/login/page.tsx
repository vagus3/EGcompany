"use client";

import LoginForm from "./LoginForm";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

export default function Page() {
  const lang = useLanguage();

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 md:py-36">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-[clamp(3.5rem,18vw,8rem)] leading-none font-black tracking-normal text-black uppercase">
          {t("login_btn_signin", lang)}
        </h1>
        <LoginForm />
      </div>
    </section>
  );
}
