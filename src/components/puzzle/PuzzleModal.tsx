"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import HintBox from "./HintBox";
import type { PuzzleWithConfig } from "@/types";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

interface PuzzleModalProps {
  puzzle: PuzzleWithConfig;
  onSolve: (answer: string) => Promise<boolean>;
  onClose: () => void;
}

export default function PuzzleModal({ puzzle, onSolve, onClose }: PuzzleModalProps) {
  const lang = useLanguage();
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
      setError(t("puzzle_wrong", lang));
      setAnswer("");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 p-5 sm:p-8"
        >
          <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">{puzzle.title}</h2>
          <p className="mb-6 text-sm text-gray-300 sm:text-base">{puzzle.data.question}</p>

          {solved ? (
            <div className="py-4 text-center text-xl font-bold text-green-400">
              {t("puzzle_solved", lang)}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setError("");
                }}
                placeholder={t("puzzle_placeholder", lang)}
                className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  {t("puzzle_confirm", lang)}
                </button>
                <button
                  type="button"
                  onClick={toggleHint}
                  className="rounded-lg bg-yellow-600 px-4 py-3 text-white transition-colors hover:bg-yellow-700"
                >
                  {t("puzzle_hint", lang)}
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
