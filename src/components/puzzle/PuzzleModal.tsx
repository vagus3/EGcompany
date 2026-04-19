"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import HintBox from "./HintBox";
import type { PuzzleWithConfig } from "@/types";

interface PuzzleModalProps {
  puzzle: PuzzleWithConfig;
  onSolve: (answer: string) => Promise<boolean>;
  onClose: () => void;
}

export default function PuzzleModal({ puzzle, onSolve, onClose }: PuzzleModalProps) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [solved, setSolved] = useState(false);
  const { hintVisible, toggleHint, incrementAttempts } = useGameStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    incrementAttempts();
    const correct = await onSolve(answer);
    if (correct) {
      setSolved(true);
      setTimeout(onClose, 1500);
    } else {
      setError("틀렸습니다. 다시 시도해보세요.");
      setAnswer("");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full mx-4"
        >
          <h2 className="text-2xl font-bold text-white mb-2">{puzzle.title}</h2>
          <p className="text-gray-300 mb-6">{puzzle.data.question}</p>

          {solved ? (
            <div className="text-center text-green-400 text-xl font-bold py-4">
              퍼즐 해결! 🎉
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={answer}
                onChange={(e) => { setAnswer(e.target.value); setError(""); }}
                placeholder="정답을 입력하세요"
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold transition-colors"
                >
                  확인
                </button>
                <button
                  type="button"
                  onClick={toggleHint}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-4 py-3 transition-colors"
                >
                  힌트
                </button>
              </div>
            </form>
          )}

          {/* PreText.js로 힌트 텍스트 높이를 미리 계산해 Framer Motion 애니메이션이 정확하게 동작 */}
          <HintBox
            hint={puzzle.data.hints[0] ?? ""}
            visible={hintVisible && !!puzzle.data.hints[0]}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
