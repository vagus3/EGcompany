"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import GameScene from "@/components/three/GameScene";
import PuzzleObject from "@/components/three/PuzzleObject";
import PuzzleModal from "@/components/puzzle/PuzzleModal";
import type { RoomWithPuzzles, PuzzleWithConfig } from "@/types";

interface RoomClientProps {
  room: RoomWithPuzzles;
}

export default function RoomClient({ room }: RoomClientProps) {
  const { setRoom, completedPuzzles, currentPuzzle, setCurrentPuzzle, markPuzzleCompleted } = useGameStore();
  const [allSolved, setAllSolved] = useState(false);

  useEffect(() => {
    setRoom(room);
  }, [room, setRoom]);

  useEffect(() => {
    if (room.puzzles.length > 0 && completedPuzzles.size === room.puzzles.length) {
      setAllSolved(true);
    }
  }, [completedPuzzles, room.puzzles.length]);

  const handleSolve = async (answer: string): Promise<boolean> => {
    if (!currentPuzzle) return false;
    const correct = String(currentPuzzle.data.answer).toLowerCase() === answer.toLowerCase();
    if (correct) markPuzzleCompleted(currentPuzzle.id);
    return correct;
  };

  return (
    <div className="w-screen h-screen relative bg-black">
      <GameScene config={room.sceneConfig}>
        {room.puzzles.map((puzzle) => (
          <PuzzleObject
            key={puzzle.id}
            puzzle={puzzle as PuzzleWithConfig}
            solved={completedPuzzles.has(puzzle.id)}
          />
        ))}
      </GameScene>

      <div className="absolute top-4 left-4 text-white">
        <h1 className="text-xl font-bold">{room.title}</h1>
        <p className="text-gray-400 text-sm">
          {completedPuzzles.size} / {room.puzzles.length} 퍼즐 완료
        </p>
      </div>

      {allSolved && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">🎉 탈출 성공!</h2>
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
