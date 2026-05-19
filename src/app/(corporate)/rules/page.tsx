"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { rules } from "@/lib/rules-data";

const ADMIN_TERMINAL_PATH = "/portals/security/terminal";

const testQuestions = [
  {
    num: "01",
    question: "발신자 확인 후 알 수는 메일이라도, 긴급 요청이 있으면 즉시 협무업을 실행해도 된다.",
    hint: "금은 규칙: 03 서류 존금 법적 메인 수신",
    options: [
      { text: "O (맞음)", value: false },
      { text: "X (아니오)", value: true },
    ],
  },
  {
    num: "02",
    question:
      "시스템 로그에 보인의 이름이 개인 정보가 보인 경우, 최인을 유지한 채 관리에 즉 요청을 해야 한다.",
    hint: "금은 규칙: 04 시스템 로그 개인정보 노출",
    options: [
      { text: "O (맞음)", value: false },
      { text: "X (아니오)", value: true },
    ],
  },
  {
    num: "03",
    question:
      "직급 중 CCTV 화면에서 비정상적인 다른 나는 움직임이 보이면, 해당 정직의 직원을 자다하고 즉시 보안팀에 보고해야 한다.",
    hint: "금은 규칙: 05 모니터링 직원 정찰",
    options: [
      { text: "O (맞음)", value: false },
      { text: "X (아니오)", value: true },
    ],
  },
  {
    num: "04",
    question:
      "업무 중 '누구가 보 있다' 는 느낌이 들어 혼란 토워하는 것은 정상적인 한견 반응이므로 괜찮다.",
    hint: "금은 규칙: 06 심리적 위협 상태 대응",
    options: [
      { text: "O (맞음)", value: false },
      { text: "X (아니오)", value: true },
    ],
  },
  {
    num: "05",
    question: "당신은 현재 인원한 상태인가?",
    hint: "금은 규칙: 로드 규정 증빙",
    options: [
      { text: "O (맞음)", value: true },
      { text: "X (아니오)", value: false },
    ],
  },
];

export default function Page() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleSignatureClick = () => {
    setIsModalOpen(true);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (value: boolean) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (newAnswers.length < testQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      window.localStorage.removeItem("eg-new-admin-test-required");
      window.localStorage.setItem("eg-new-admin-test-passed", "true");

      setTimeout(() => {
        setIsModalOpen(false);
        setCurrentQuestion(0);
        setAnswers([]);
        router.replace(ADMIN_TERMINAL_PATH);
      }, 1500);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="mx-auto max-w-4xl px-4 pt-14 pb-12 sm:px-6 sm:pt-20 sm:pb-16">
        <h1 className="mb-6 text-[clamp(2.2rem,4.5vw,3.5rem)] leading-tight font-black tracking-tight text-black">
          Employee Conduct
          <br />& Workplace Safety
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-500">
          EG 컴퍼니 임직원의 안전과 효율적인 업무 환경 조성을 위한 기본 행동 수칙 및 보건
          가이드라인입니다. 본 규정은 사내 보안 등급에 따라 엄격히 준수되어야 합니다.
        </p>
        <hr className="mt-10 border-gray-200" />
      </section>

      {/* Rules list */}
      <section className="mx-auto max-w-4xl space-y-10 px-4 pb-16 sm:space-y-12 sm:px-6 sm:pb-20">
        {rules.map(({ num, title, body }) => (
          <div
            key={num}
            className="grid grid-cols-[48px_1fr] gap-4 sm:grid-cols-[72px_1fr] sm:gap-6"
          >
            <span className="pt-1 text-3xl leading-none font-black text-gray-200 select-none sm:text-4xl">
              {num}
            </span>
            <div>
              <h2 className="mb-2 text-base font-bold text-black">{title}</h2>
              <p className="text-sm leading-relaxed text-gray-500">{body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Notice box */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="flex gap-4 rounded border border-gray-300 p-5 sm:p-6">
          <span className="mt-0.5 text-gray-400">ⓘ</span>
          <div>
            <p className="mb-2 text-xs font-bold text-black">Notice</p>
            <p className="text-xs leading-relaxed text-gray-500">
              위 지침은 모든 임직원의 안전을 보장하기 위한 최소한의 조치입니다. 지침 미준수로
              발생하는 &#39;존재적 불일치&#39;나 &#39;물리적 소실&#39;에 대해 EG 컴퍼니는 법적
              책임을 지지 않습니다. 모든 임직원은 본 문서를 숙지했음을{" "}
              <button
                onClick={handleSignatureClick}
                className="cursor-pointer font-bold text-black transition-all hover:underline"
              >
                서명
              </button>
              으로 갈음합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded border-2 border-gray-800">
                  <span className="text-lg">🔒</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">EG COMPANY</p>
                  <h2 className="text-lg font-bold text-black sm:text-xl">
                    Administrator Access Protocol
                  </h2>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-2xl leading-none text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8">
              <div className="mb-8">
                <h3 className="mb-2 text-lg font-bold text-black">신규 관리자 규칙 숙지 테스트</h3>
                <p className="mb-4 text-sm text-gray-600">
                  본 테스트는 EG 컴퍼니 규칙 및 보안 정책 이해도를 위한 필수 과정입니다.
                </p>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-black">PROGRESS</span>
                  <span className="text-sm font-bold text-black">
                    {answers.length + 1} / {testQuestions.length}
                  </span>
                </div>
                <div className="flex gap-2">
                  {testQuestions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        idx < answers.length
                          ? "bg-black"
                          : idx === answers.length
                            ? "bg-black"
                            : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question */}
              {currentQuestion < testQuestions.length && (
                <div className="space-y-6">
                  <div className="rounded-lg bg-gray-50 p-6">
                    <div className="flex gap-4">
                      <span className="min-w-fit text-3xl leading-none font-black text-gray-300 sm:text-4xl">
                        {testQuestions[currentQuestion].num}
                      </span>
                      <div className="flex-1">
                        <p className="mb-3 text-base leading-relaxed text-black">
                          {testQuestions[currentQuestion].question}
                        </p>
                        <p className="text-xs text-gray-400">
                          (금은 규칙: {testQuestions[currentQuestion].hint})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {testQuestions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option.value)}
                        className="flex w-full items-center gap-3 rounded border-2 border-gray-300 p-4 text-left transition-all hover:border-black hover:bg-gray-50"
                      >
                        <input type="radio" className="h-5 w-5 cursor-pointer" name="option" />
                        <span className="text-sm font-medium text-black">{option.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete State */}
              {answers.length === testQuestions.length && (
                <div className="py-8 text-center">
                  <p className="mb-2 text-lg font-bold text-black">테스트 완료!</p>
                  <p className="text-sm text-gray-600">본 규정에 동의하셨습니다.</p>
                </div>
              )}

              {/* Notice */}
              {currentQuestion === testQuestions.length - 1 &&
                answers.length === testQuestions.length - 1 && (
                  <div className="mt-8 flex gap-3 rounded border border-yellow-200 bg-yellow-50 p-4">
                    <span className="text-lg text-yellow-600">⚠️</span>
                    <p className="text-xs text-gray-700">
                      테스트 중 성공 함수나 새로고침이 감지되면, 본 규정 미준수로 간주되며 법적
                      책임을 질 수 있습니다.
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
