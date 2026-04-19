"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import HintBox from "./HintBox";
import { useGameStore } from "@/store/gameStore";

export default function PuzzleOverlay() {
  const { currentPuzzle, hintVisible, attempts, toggleHint, incrementAttempts, markPuzzleCompleted } = useGameStore();
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
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-20"
    >
      <div className="rounded-xl border border-white/10 bg-black/70 backdrop-blur-md p-5 space-y-4">
        <h2 className="text-white font-semibold text-lg">{currentPuzzle.title}</h2>
        <p className="text-gray-300 text-sm">{data.question}</p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="정답 입력..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            확인
          </button>
        </form>

        {feedback === "correct" && (
          <p className="text-green-400 text-sm font-medium">정답입니다! 🎉</p>
        )}
        {feedback === "wrong" && (
          <p className="text-red-400 text-sm">틀렸습니다. 다시 시도해보세요.</p>
        )}

        <button
          onClick={toggleHint}
          className="text-xs text-yellow-400/80 hover:text-yellow-400 underline"
        >
          {hintVisible ? "힌트 숨기기" : `힌트 보기 (시도 ${attempts}회)`}
        </button>

        <HintBox hint={currentHint} visible={hintVisible} />
      </div>
    </motion.div>
  );
}
