"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import HintBox from "./HintBox";
import { useGameStore } from "@/store/gameStore";

export default function PuzzleOverlay() {
  const {
    currentPuzzle,
    hintVisible,
    attempts,
    toggleHint,
    incrementAttempts,
    markPuzzleCompleted,
  } = useGameStore();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");

  if (!currentPuzzle) return null;

  const { data } = currentPuzzle;
  const currentHint = data.hints[Math.min(attempts, data.hints.length - 1)] ?? data.hints[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const correct = Array.isArray(data.answer)
      ? (data.answer as string[]).map(String).includes(answer.trim().toLowerCase())
      : String(data.answer).toLowerCase() === answer.trim().toLowerCase();

    if (correct) {
      setFeedback("correct");
      markPuzzleCompleted(currentPuzzle!.id);
    } else {
      setFeedback("wrong");
      incrementAttempts();
      setTimeout(() => setFeedback("idle"), 1200);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-1/2 z-20 w-full max-w-md -translate-x-1/2 px-4 sm:bottom-6"
    >
      <div className="space-y-4 rounded-xl border border-white/10 bg-black/70 p-4 backdrop-blur-md sm:p-5">
        <h2 className="text-lg font-semibold text-white">{currentPuzzle.title}</h2>
        <p className="text-sm text-gray-300">{data.question}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="정답 입력..."
            className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            확인
          </button>
        </form>

        {feedback === "correct" && (
          <p className="text-sm font-medium text-green-400">정답입니다! 🎉</p>
        )}
        {feedback === "wrong" && (
          <p className="text-sm text-red-400">틀렸습니다. 다시 시도해보세요.</p>
        )}

        <button
          onClick={toggleHint}
          className="text-xs text-yellow-400/80 underline hover:text-yellow-400"
        >
          {hintVisible ? "힌트 숨기기" : `힌트 보기 (시도 ${attempts}회)`}
        </button>

        <HintBox hint={currentHint} visible={hintVisible} />
      </div>
    </motion.div>
  );
}
