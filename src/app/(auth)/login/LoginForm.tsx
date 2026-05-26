"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {
  ok: false,
  message: "",
};

const adminTestRequiredKey = "eg-new-admin-test-required";

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

const onboardingQuestions = [
  {
    num: "01",
    question:
      "발신자를 확인할 수 없는 메일이라도, 긴급 요청이 있으면 즉시 첨부파일을 실행해도 된다.",
    options: [
      { text: "O (예)", value: false },
      { text: "X (아니오)", value: true },
    ],
  },
  {
    num: "02",
    question: "시스템 로그에 본인의 이름이나 개인 정보가 노출되면 관리자에게 즉시 보고해야 한다.",
    options: [
      { text: "O (예)", value: true },
      { text: "X (아니오)", value: false },
    ],
  },
  {
    num: "03",
    question:
      "CCTV 화면에서 비정상적인 움직임이 보이면 해당 구역 접근을 중지하고 보안팀에 보고한다.",
    options: [
      { text: "O (예)", value: true },
      { text: "X (아니오)", value: false },
    ],
  },
  {
    num: "04",
    question: "업무 중 누군가 보고 있다는 감각과 따가운 감각이 동반되면 즉시 연구팀을 호출한다.",
    options: [
      { text: "O (예)", value: true },
      { text: "X (아니오)", value: false },
    ],
  },
  {
    num: "05",
    question: "관리자 권한은 테스트 통과 후에만 제한 구역 접근에 사용할 수 있다.",
    options: [
      { text: "O (예)", value: true },
      { text: "X (아니오)", value: false },
    ],
  },
];

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const adminTestRequired = useSyncExternalStore(
    subscribeToAdminTest,
    getAdminTestRequiredSnapshot,
    getServerAdminTestRequiredSnapshot
  );
  const [testDismissed, setTestDismissed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === onboardingQuestions.length;
  const passed = useMemo(
    () => onboardingQuestions.every((question) => answers[question.num] === true),
    [answers]
  );

  useEffect(() => {
    if (!state.ok) {
      return;
    }

    if (!adminTestRequired) {
      router.push("/portals/security/terminal");
    }
  }, [adminTestRequired, router, state.ok]);

  const modalOpen = state.ok && adminTestRequired && !testDismissed;

  function handleAnswer(questionNum: string, value: boolean) {
    setAnswers((current) => ({ ...current, [questionNum]: value }));
    setError("");
  }

  function handleSubmitTest() {
    if (!allAnswered) {
      setError("모든 항목을 선택해야 관리자 테스트를 제출할 수 있습니다.");
      return;
    }

    if (!passed) {
      setError("관리자 접근 테스트를 통과하지 못했습니다. 규정 탭을 다시 확인하십시오.");
      return;
    }

    window.localStorage.removeItem(adminTestRequiredKey);
    window.localStorage.setItem("eg-new-admin-test-passed", "true");
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
            autoComplete="current-password"
            required
            placeholder="********"
            className="mt-4 w-full border-0 border-b border-black bg-transparent px-0 pb-4 text-[clamp(2rem,11vw,4.1rem)] leading-none font-black tracking-normal text-black uppercase outline-none placeholder:text-neutral-200 focus:border-black"
          />
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={pending}
            className="h-20 w-full bg-black text-[13px] font-black tracking-[0.28em] text-white uppercase transition-colors hover:bg-neutral-800 sm:h-24 sm:w-36"
          >
            {pending ? "Checking" : "Sign In"}
          </button>
          <p className="max-w-md text-[13px] leading-7 font-black tracking-[0.2em] text-neutral-400 uppercase">
            No account yet?{" "}
            <Link href="/signup" className="text-black underline underline-offset-4">
              Request corporate access
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-neutral-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-5 sm:px-8 sm:py-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center border border-neutral-500 text-neutral-700">
                  ⛨
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase">
                    EG Company
                  </p>
                  <h2 className="text-lg font-black text-black sm:text-xl">
                    Administrator Access Protocol
                  </h2>
                </div>
              </div>
              <button
                className="text-xl leading-none text-neutral-400 transition-colors hover:text-black"
                onClick={() => setTestDismissed(true)}
                type="button"
                aria-label="Close administrator access test"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-7">
              <div className="grid gap-6 md:grid-cols-[1fr_160px] md:gap-8">
                <div>
                  <h3 className="text-xl font-black text-black sm:text-2xl">
                    신규 가입자 관리자 테스트
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
                    본 테스트는 신규 가입자의 사내 보안 정책 이해도를 확인하기 위한 필수 과정입니다.
                    모든 문항을 선택한 뒤 제출하면 통과 여부에 따라 관리자 페이지 접근이 처리됩니다.
                  </p>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between text-[11px] font-black text-black">
                    <span>PROGRESS</span>
                    <span>
                      {answeredCount} / {onboardingQuestions.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {onboardingQuestions.map((question) => (
                      <span
                        className={`h-2.5 w-2.5 rounded-full border border-neutral-400 ${
                          answers[question.num] !== undefined ? "bg-black" : "bg-white"
                        }`}
                        key={question.num}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-7 divide-y divide-neutral-200 border-y border-neutral-200">
                {onboardingQuestions.map((question) => (
                  <div
                    className="grid gap-3 py-4 sm:grid-cols-[48px_1fr] lg:grid-cols-[56px_1fr_220px] lg:items-center lg:gap-4"
                    key={question.num}
                  >
                    <span className="text-lg font-black text-black">{question.num}</span>
                    <p className="text-sm leading-6 text-black">{question.question}</p>
                    <div className="flex flex-wrap gap-4 lg:justify-end lg:gap-5">
                      {question.options.map((option) => (
                        <label
                          className="flex items-center gap-2 text-[11px] font-bold text-neutral-600"
                          key={option.text}
                        >
                          <input
                            checked={answers[question.num] === option.value}
                            className="h-3.5 w-3.5 accent-black"
                            name={`question-${question.num}`}
                            onChange={() => handleAnswer(question.num, option.value)}
                            type="radio"
                          />
                          {option.text}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center md:gap-6">
                <div className="flex gap-3 border border-yellow-200 bg-yellow-50 p-4">
                  <span className="text-yellow-700">⚠</span>
                  <p className="text-xs leading-5 text-neutral-700">
                    규칙 탭의 행동 수칙을 기준으로 답변하십시오. 통과 시 보안 관리자 페이지로 자동
                    접속됩니다.
                  </p>
                </div>

                <button
                  className="h-12 w-full bg-black px-8 text-[12px] font-black tracking-[0.18em] text-white uppercase transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 md:w-auto"
                  disabled={!allAnswered}
                  onClick={handleSubmitTest}
                  type="button"
                >
                  제출하기
                </button>
              </div>

              {error && (
                <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
