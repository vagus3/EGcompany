import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { RoomWithPuzzles, PuzzleWithConfig, ProgressStatus } from "@/types";

interface GameState {
  currentRoom: RoomWithPuzzles | null;
  currentPuzzle: PuzzleWithConfig | null;
  completedPuzzles: Set<string>;
  attempts: number;
  hintVisible: boolean;

  setRoom: (room: RoomWithPuzzles) => void;
  setCurrentPuzzle: (puzzle: PuzzleWithConfig | null) => void;
  markPuzzleCompleted: (puzzleId: string) => void;
  incrementAttempts: () => void;
  toggleHint: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  devtools(
    (set) => ({
      currentRoom: null,
      currentPuzzle: null,
      completedPuzzles: new Set(),
      attempts: 0,
      hintVisible: false,

      setRoom: (room) => set({ currentRoom: room }),

      setCurrentPuzzle: (puzzle) => set({ currentPuzzle: puzzle, attempts: 0, hintVisible: false }),

      markPuzzleCompleted: (puzzleId) =>
        set((state) => ({
          completedPuzzles: new Set([...state.completedPuzzles, puzzleId]),
        })),

      incrementAttempts: () => set((state) => ({ attempts: state.attempts + 1 })),

      toggleHint: () => set((state) => ({ hintVisible: !state.hintVisible })),

      resetGame: () =>
        set({
          currentRoom: null,
          currentPuzzle: null,
          completedPuzzles: new Set(),
          attempts: 0,
          hintVisible: false,
        }),
    }),
    { name: "game-store" }
  )
);
