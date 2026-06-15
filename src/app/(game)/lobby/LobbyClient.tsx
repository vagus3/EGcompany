"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

type LobbyRoom = {
  id: string;
  title: string;
  description: string | null;
  difficulty: number;
  _count: { puzzles: number };
};

export default function LobbyClient({ rooms }: { rooms: LobbyRoom[] }) {
  const lang = useLanguage();

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-10 text-white sm:px-8 sm:py-12">
      <h1 className="mb-2 text-center text-4xl font-bold">{t("lobby_heading", lang)}</h1>
      <p className="mb-12 text-center text-gray-400">{t("lobby_desc", lang)}</p>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">{t("lobby_empty", lang)}</p>
        ) : (
          rooms.map((room) => (
            <Link key={room.id} href={`/room/${room.id}`}>
              <div className="cursor-pointer rounded-xl border border-gray-700 bg-gray-800 p-6 transition-all hover:border-blue-500 hover:bg-gray-700">
                <div className="mb-3 flex items-start justify-between">
                  <h2 className="text-xl font-semibold">{room.title}</h2>
                  <span className="text-sm text-yellow-400">
                    {t("lobby_difficulty", lang)} {"⭐".repeat(room.difficulty)}
                  </span>
                </div>
                {room.description && (
                  <p className="mb-4 text-sm text-gray-400">{room.description}</p>
                )}
                <p className="text-sm text-blue-400">
                  {lang === "ko"
                    ? `${room._count.puzzles}개의 퍼즐`
                    : `${room._count.puzzles} Puzzles`}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
