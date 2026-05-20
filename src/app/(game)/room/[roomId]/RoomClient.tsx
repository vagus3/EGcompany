"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import GameScene from "@/components/three/GameScene";
import PuzzleObject from "@/components/three/PuzzleObject";
import PuzzleModal from "@/components/puzzle/PuzzleModal";
import type { RoomWithPuzzles, PuzzleWithConfig } from "@/types";

interface RoomClientProps {
  room: RoomWithPuzzles;
}

export default function RoomClient({ room }: RoomClientProps) {
  const { setRoom, completedPuzzles, currentPuzzle, setCurrentPuzzle, markPuzzleCompleted } =
    useGameStore();
  const allSolved = room.puzzles.length > 0 && completedPuzzles.size === room.puzzles.length;

  useEffect(() => {
    setRoom(room);
  }, [room, setRoom]);

  const handleSolve = async (answer: string): Promise<boolean> => {
    if (!currentPuzzle) return false;
    const correct = String(currentPuzzle.data.answer).toLowerCase() === answer.toLowerCase();
    if (correct) markPuzzleCompleted(currentPuzzle.id);
    return correct;
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      <GameScene config={room.sceneConfig}>
        {room.puzzles.map((puzzle) => (
          <PuzzleObject
            key={puzzle.id}
            puzzle={puzzle as PuzzleWithConfig}
            solved={completedPuzzles.has(puzzle.id)}
          />
        ))}
      </GameScene>

      <div className="absolute top-4 right-4 left-4 text-white">
        <h1 className="text-lg font-bold sm:text-xl">{room.title}</h1>
        <p className="text-sm text-gray-400">
          {completedPuzzles.size} / {room.puzzles.length} 퍼즐 완료
        </p>
      </div>

      {allSolved && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="px-4 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">🎉 탈출 성공!</h2>
            <p className="text-gray-300">모든 퍼즐을 해결했습니다!</p>
          </div>
        </div>
      )}

      {currentPuzzle && (
        <PuzzleModal
          puzzle={currentPuzzle}
          onSolve={handleSolve}
          onClose={() => setCurrentPuzzle(null)}
        />
      )}
    </div>
  );
}
