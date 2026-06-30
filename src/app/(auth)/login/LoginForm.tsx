"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useSyncExternalStore } from "react";

import { AdminAccessTestModal } from "@/components/layout/AdminAccessTestModal";
import { adminTestPassedKey, adminTestRequiredKey } from "@/lib/admin-test";
import { loginAction, type LoginState } from "./actions";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

const initialState: LoginState = {
  ok: false,
  message: "",
};

function getAdminTestRequiredSnapshot() {
  return window.localStorage.getItem(adminTestRequiredKey) === "true";
}

function getServerAdminTestRequiredSnapshot() {
  return false;
}

function subscribeToAdminTest(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);

  return () => window.removeEventListener("storage", onStoreChange);
}

export default function LoginForm() {
  const lang = useLanguage();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const adminTestRequired = useSyncExternalStore(
    subscribeToAdminTest,
    getAdminTestRequiredSnapshot,
    getServerAdminTestRequiredSnapshot
  );
  const [testDismissed, setTestDismissed] = useState(false);

  useEffect(() => {
    if (!state.ok) {
      return;
    }

    if (!adminTestRequired) {
      router.push("/portals/security/terminal");
    }
  }, [adminTestRequired, router, state.ok]);

  const modalOpen = state.ok && adminTestRequired && !testDismissed;

  function handleAdminTestPassed() {
    window.localStorage.removeItem(adminTestRequiredKey);
    window.localStorage.setItem(adminTestPassedKey, "true");
    router.push("/portals/security/terminal");
  }

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
            className="mt-4 w-full border-0 border-b border-black bg-transparent px-0 pb-4 text-[clamp(2rem,11vw,4.1rem)] leading-none font-black tracking-normal text-black outline-none placeholder:text-neutral-200 focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[12px] font-black tracking-[0.28em] text-black uppercase"
          >
            {t("login_password_label", lang)}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="********"
            className="mt-4 w-full border-0 border-b border-black bg-transparent px-0 pb-4 text-[clamp(2rem,11vw,4.1rem)] leading-none font-black tracking-normal text-black outline-none placeholder:text-neutral-200 focus:border-black"
          />
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

      {modalOpen && (
        <AdminAccessTestModal
          onClose={() => setTestDismissed(true)}
          onPassed={handleAdminTestPassed}
        />
      )}
    </>
  );
}
