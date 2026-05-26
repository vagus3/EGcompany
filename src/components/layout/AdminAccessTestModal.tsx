"use client";

import { useMemo, useState } from "react";

import { adminTestQuestions } from "@/lib/admin-test";

type AdminAccessTestModalProps = {
  onClose: () => void;
  onPassed: () => void;
};

export function AdminAccessTestModal({ onClose, onPassed }: AdminAccessTestModalProps) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === adminTestQuestions.length;
  const passed = useMemo(
    () => adminTestQuestions.every((question) => answers[question.num] === true),
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

    onPassed();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-neutral-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center border border-neutral-500 text-neutral-700">
              E
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
            onClick={onClose}
            type="button"
            aria-label="Close administrator access test"
          >
            x
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
                  {answeredCount} / {adminTestQuestions.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {adminTestQuestions.map((question) => (
                  <span
                    className={`h-2.5 w-2.5 border border-neutral-400 ${
                      answers[question.num] !== undefined ? "bg-black" : "bg-white"
                    }`}
                    key={question.num}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-7 divide-y divide-neutral-200 border-y border-neutral-200">
            {adminTestQuestions.map((question) => (
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
              <span className="text-yellow-700">!</span>
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
            <div className="mt-6 border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
