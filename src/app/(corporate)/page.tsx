"use client";

import { useMemo, useState } from "react";
import EGShieldLogo from "@/components/ui/EGShieldLogo";

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

export default function Page() {
  const [modalOpen, setModalOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("eg-new-admin-test-required") === "true";
  });
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === onboardingQuestions.length;
  const passed = useMemo(
    () => onboardingQuestions.every((question) => answers[question.num] === true),
    [answers]
  );

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

    window.localStorage.removeItem("eg-new-admin-test-required");
    window.localStorage.setItem("eg-new-admin-test-passed", "true");
    setModalOpen(false);
  }

  return (
    <div className="flex flex-col items-center">
      {/* Hero: logo + title */}
      <section className="flex w-full flex-col items-center gap-12 pt-28 pb-16">
        <EGShieldLogo className="h-44 w-44" />
        <h1 className="text-[clamp(4rem,12vw,9rem)] leading-none font-black tracking-tight text-black uppercase">
          EG COMPANY
        </h1>
      </section>

      {/* Building image */}
      <section className="mx-auto mb-28 w-full max-w-[87%]">
        <div className="aspect-16/7 w-full overflow-hidden bg-gray-400">
          {/* public/images/hq-building.jpg 로 교체 가능 */}
          <div className="bg-gradient-linear-to-br flex h-full w-full items-center justify-center from-gray-300 via-gray-400 to-gray-500">
            <span className="text-sm tracking-widest text-gray-200 uppercase select-none">
              Corporate Headquarters
            </span>
          </div>
        </div>
      </section>

      {/* Administrator Access Protocol Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl border border-neutral-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-neutral-200 px-8 py-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center border border-neutral-500 text-neutral-700">
                  ⛨
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase">
                    EG Company
                  </p>
                  <h2 className="text-xl font-black text-black">Administrator Access Protocol</h2>
                </div>
              </div>
              <button
                className="text-xl leading-none text-neutral-400 transition-colors hover:text-black"
                onClick={() => setModalOpen(false)}
                type="button"
                aria-label="Close administrator access test"
              >
                ×
              </button>
            </div>

            <div className="px-8 py-7">
              <div className="grid grid-cols-[1fr_160px] gap-8">
                <div>
                  <h3 className="text-2xl font-black text-black">신규 가입자 관리자 테스트</h3>
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
                    className="grid grid-cols-[56px_1fr_220px] items-center gap-4 py-4"
                    key={question.num}
                  >
                    <span className="text-lg font-black text-black">{question.num}</span>
                    <p className="text-sm leading-6 text-black">{question.question}</p>
                    <div className="flex justify-end gap-5">
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

              <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-6">
                <div className="flex gap-3 border border-yellow-200 bg-yellow-50 p-4">
                  <span className="text-yellow-700">⚠</span>
                  <p className="text-xs leading-5 text-neutral-700">
                    규칙 탭의 행동 수칙을 기준으로 답변하십시오. 통과 시 보안 관리자 페이지로 자동
                    접속됩니다.
                  </p>
                </div>

                <button
                  className="h-12 bg-black px-8 text-[12px] font-black tracking-[0.18em] text-white uppercase transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                  disabled={!allAnswered}
                  onClick={handleSubmitTest}
                  type="button"
                >
                  제출하기
                </button>
              </div>

              {error && (
                <div className="mt-6 border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
