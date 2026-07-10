"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { clearClientGameProgress } from "@/lib/game-progress-reset";
import { loginAction, type LoginState } from "./actions";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { WelcomeVideoIntro } from "@/components/layout/WelcomeVideoIntro";

const initialState: LoginState = {
  ok: false,
  message: "",
};

export default function LoginForm() {
  const lang = useLanguage();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!state.ok) {
      return;
    }

    // 브라우저 단위 저장값은 계정 구분이 안 되므로 로그인마다 새 플레이로 시작한다.
    clearClientGameProgress();
  }, [state.ok]);

  return (
    <>
      <form className="mt-10 space-y-10 sm:mt-14 sm:space-y-12" action={formAction}>
        <div>
          <label
            htmlFor="email"
            className="block text-[12px] font-black tracking-[0.28em] text-black uppercase"
          >
            {t("login_email_label", lang)}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="VANCE.A@EG.COM"
            className="auth-input mt-4 w-full border-0 border-b border-black bg-transparent px-0 pb-4 text-[clamp(2rem,11vw,4.1rem)] leading-none font-black tracking-normal text-black outline-none placeholder:text-neutral-200 focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[12px] font-black tracking-[0.28em] text-black uppercase"
          >
            {t("login_password_label", lang)}
          </label>
          <div className="relative mt-4">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="********"
              className="auth-input w-full border-0 border-b border-black bg-transparent px-0 pr-12 pb-4 text-[clamp(2rem,11vw,4.1rem)] leading-none font-black tracking-normal text-black outline-none placeholder:text-neutral-200 focus:border-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              aria-pressed={showPassword}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600"
            >
              {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={pending}
            className="h-20 w-full bg-black text-[13px] font-black tracking-[0.28em] text-white uppercase transition-colors hover:bg-neutral-800 sm:h-24 sm:w-36"
          >
            {pending ? t("login_btn_checking", lang) : t("login_btn_signin", lang)}
          </button>
          <p className="max-w-md text-[13px] leading-7 font-black tracking-[0.2em] text-neutral-400 uppercase">
            {t("login_no_account", lang)}{" "}
            <Link href="/signup" className="text-black underline underline-offset-4">
              {t("login_request_access", lang)}
            </Link>
            .
          </p>
        </div>
        {state.message && (
          <p
            className={`border px-5 py-4 text-[12px] font-black tracking-[0.18em] uppercase ${
              state.ok ? "border-black bg-black text-white" : "border-red-300 bg-red-50 text-red-700"
            }`}
            role="status"
          >
            {state.message}
          </p>
        )}
      </form>
      {state.ok && <WelcomeVideoIntro onComplete={() => router.push("/")} />}
    </>
  );
}
