"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { signUpAction, type SignUpState } from "./actions";

const initialState: SignUpState = {
  ok: false,
  message: "",
};

export default function SignUpForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  useEffect(() => {
    if (!state.ok) {
      return;
    }

    window.localStorage.setItem("eg-new-admin-test-required", "true");
    // 회원가입 완료 후 메인페이지로 이동 (모달 표시를 위해)
    setTimeout(() => {
      router.push("/");
    }, 1000);
  }, [state.ok, router]);

  return (
    <form action={formAction} className="mt-10 space-y-10 sm:mt-14 sm:space-y-12">
      <input type="hidden" name="language" value="ko" />
      <input type="hidden" name="theme" value="light" />

      <div>
        <label
          htmlFor="name"
          className="block text-[12px] font-black tracking-[0.28em] text-black uppercase"
        >
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="ALEXANDER VANCE"
          className="mt-4 w-full border-0 border-b border-black bg-transparent px-0 pb-4 text-[clamp(2rem,11vw,4.1rem)] leading-none font-black tracking-normal text-black uppercase outline-none placeholder:text-neutral-200 focus:border-black"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-[12px] font-black tracking-[0.28em] text-black uppercase"
        >
          Corporate Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="VANCE.A@EG.COM"
          className="mt-4 w-full border-0 border-b border-black bg-transparent px-0 pb-4 text-[clamp(2rem,11vw,4.1rem)] leading-none font-black tracking-normal text-black uppercase outline-none placeholder:text-neutral-200 focus:border-black"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-[12px] font-black tracking-[0.28em] text-black uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="********"
          className="mt-4 w-full border-0 border-b border-black bg-transparent px-0 pb-4 text-[clamp(2rem,11vw,4.1rem)] leading-none font-black tracking-normal text-black uppercase outline-none placeholder:text-neutral-200 focus:border-black"
        />
      </div>

      <div className="h-56 overflow-y-auto border border-black bg-neutral-50 p-5 text-left sm:p-8">
        <h2 className="text-[12px] font-black tracking-[0.24em] text-black uppercase">
          EG Code of Conduct
        </h2>
        <div className="mt-7 space-y-5 text-[12px] leading-7 font-semibold tracking-[0.18em] text-neutral-600 uppercase">
          <p>
            By accessing the EG monolith system, all employees agree to adhere to the strictest
            standards of corporate integrity and data security. Any breach of protocol, unauthorized
            access to restricted partitions, or failure to report anomalies will result in immediate
            termination of access rights.
          </p>
          <p>
            Usage of proprietary algorithms and data structures for non-corporate purposes is
            prohibited. All operational activity may be audited for compliance and system safety.
          </p>
        </div>
      </div>

      <label className="flex items-start gap-4 text-[12px] font-black tracking-[0.22em] text-black uppercase sm:items-center sm:gap-5">
        <input
          name="conduct"
          type="checkbox"
          required
          className="mt-0.5 h-5 w-5 shrink-0 appearance-none border border-black bg-white checked:bg-black sm:mt-0"
        />
        I acknowledge and agree to the privacy policy and code of conduct.
      </label>

      <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="h-20 w-full bg-black text-[13px] font-black tracking-[0.28em] text-white uppercase transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400 sm:h-24 sm:w-36"
        >
          {pending ? "Saving" : "Sign Up"}
        </button>
        <p className="max-w-md text-[13px] leading-7 font-black tracking-[0.2em] text-neutral-400 uppercase">
          By proceeding, you adhere to the{" "}
          <Link href="/rules" className="text-black underline underline-offset-4">
            EG Code of Conduct
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
  );
}
