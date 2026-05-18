"use client";

import { useState } from "react";
import { rules } from "@/lib/rules-data";

const testQuestions = [
  {
    num: "01",
    question: "발신자 확인 후 알 수는 메일이라도, 긴급 요청이 있으면 즉시 협무업을 실행해도 된다.",
    hint: "금은 규칙: 03 서류 존금 법적 메인 수신",
    options: [
      { text: "O (맞음)", value: false },
      { text: "X (아니오)", value: true }
    ]
  },
  {
    num: "02",
    question: "시스템 로그에 보인의 이름이 개인 정보가 보인 경우, 최인을 유지한 채 관리에 즉 요청을 해야 한다.",
    hint: "금은 규칙: 04 시스템 로그 개인정보 노출",
    options: [
      { text: "O (맞음)", value: false },
      { text: "X (아니오)", value: true }
    ]
  },
  {
    num: "03",
    question: "직급 중 CCTV 화면에서 비정상적인 다른 나는 움직임이 보이면, 해당 정직의 직원을 자다하고 즉시 보안팀에 보고해야 한다.",
    hint: "금은 규칙: 05 모니터링 직원 정찰",
    options: [
      { text: "O (맞음)", value: false },
      { text: "X (아니오)", value: true }
    ]
  },
  {
    num: "04",
    question: "업무 중 '누구가 보 있다' 는 느낌이 들어 혼란 토워하는 것은 정상적인 한견 반응이므로 괜찮다.",
    hint: "금은 규칙: 06 심리적 위협 상태 대응",
    options: [
      { text: "O (맞음)", value: false },
      { text: "X (아니오)", value: true }
    ]
  },
  {
    num: "05",
    question: "당신은 현재 인원한 상태인가?",
    hint: "금은 규칙: 로드 규정 증빙",
    options: [
      { text: "O (맞음)", value: true },
      { text: "X (아니오)", value: false }
    ]
  }
];

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const progressCount = Math.min(answers.length + 1, testQuestions.length);

  const handleSignatureClick = () => {
    setIsModalOpen(true);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (value: boolean) => {
    if (answers.length >= testQuestions.length) {
      return;
    }

    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (newAnswers.length < testQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(testQuestions.length);
      setTimeout(() => {
        setIsModalOpen(false);
        setCurrentQuestion(0);
        setAnswers([]);
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
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16">
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
      <section className="mx-auto max-w-4xl space-y-12 px-6 pb-20">
        {rules.map(({ num, title, body }) => (
          <div key={num} className="grid grid-cols-[72px_1fr] gap-6">
            <span className="pt-1 text-4xl leading-none font-black text-gray-200 select-none">
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
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="flex gap-4 rounded border border-gray-300 p-6">
          <span className="mt-0.5 text-gray-400">ⓘ</span>
          <div>
            <p className="mb-2 text-xs font-bold text-black">Notice</p>
            <p className="text-xs leading-relaxed text-gray-500">
              위 지침은 모든 임직원의 안전을 보장하기 위한 최소한의 조치입니다. 지침 미준수로
              발생하는 &#39;존재적 불일치&#39;나 &#39;물리적 소실&#39;에 대해 EG 컴퍼니는 법적
              책임을 지지 않습니다. 모든 임직원은 본 문서를 숙지했음을{" "}
              <button
                onClick={handleSignatureClick}
                className="font-bold text-black hover:underline cursor-pointer transition-all"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded border-2 border-gray-800 flex items-center justify-center mt-1">
                  <span className="text-lg">🔒</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">EG COMPANY</p>
                  <h2 className="text-xl font-bold text-black">Administrator Access Protocol</h2>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-2">신규 관리자 규칙 숙지 테스트</h3>
                <p className="text-sm text-gray-600 mb-4">
                  본 테스트는 EG 컴퍼니 규칙 및 보안 정책 이해도를 위한 필수 과정입니다.
                </p>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-black">PROGRESS</span>
                  <span className="text-sm font-bold text-black">
                    {progressCount} / {testQuestions.length}
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
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex gap-4">
                      <span className="text-4xl font-black text-gray-300 leading-none min-w-fit">
                        {testQuestions[currentQuestion].num}
                      </span>
                      <div className="flex-1">
                        <p className="text-base text-black leading-relaxed mb-3">
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
                        className="w-full flex items-center gap-3 p-4 border-2 border-gray-300 rounded hover:border-black hover:bg-gray-50 transition-all text-left"
                      >
                        <input
                          type="radio"
                          className="w-5 h-5 cursor-pointer"
                          name="option"
                        />
                        <span className="text-sm font-medium text-black">{option.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete State */}
              {answers.length === testQuestions.length && (
                <div className="text-center py-8">
                  <p className="text-lg font-bold text-black mb-2">테스트 완료!</p>
                  <p className="text-sm text-gray-600">본 규정에 동의하셨습니다.</p>
                </div>
              )}

              {/* Notice */}
              {currentQuestion === testQuestions.length - 1 && answers.length === testQuestions.length - 1 && (
                <div className="mt-8 flex gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <span className="text-yellow-600 text-lg">⚠️</span>
                  <p className="text-xs text-gray-700">
                    테스트 중 성공 함수나 새로고침이 감지되면, 본 규정 미준수로 간주되며 법적 책임을 질 수 있습니다.
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
