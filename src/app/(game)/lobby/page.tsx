import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/db/prisma";

type LobbyRoom = {
  id: string;
  title: string;
  description: string | null;
  difficulty: number;
  _count: {
    puzzles: number;
  };
};

export default async function LobbyPage() {
  await connection();

  let rooms: LobbyRoom[] = [];

  try {
    rooms = (await prisma.room.findMany({
      where: { isActive: true },
      include: { _count: { select: { puzzles: true } } },
    })) as LobbyRoom[];
  } catch {
    rooms = [];
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-8 py-12">
      <h1 className="text-4xl font-bold mb-2 text-center">이스케이프룸</h1>
      <p className="text-gray-400 text-center mb-12">방을 선택하여 퍼즐을 풀어보세요</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {rooms.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">등록된 방이 없습니다.</p>
        ) : (
          rooms.map((room: LobbyRoom) => (
            <Link key={room.id} href={`/room/${room.id}`}>
              <div className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold">{room.title}</h2>
                  <span className="text-yellow-400 text-sm">난이도 {"⭐".repeat(room.difficulty)}</span>
                </div>
                {room.description && (
                  <p className="text-gray-400 text-sm mb-4">{room.description}</p>
                )}
                <p className="text-blue-400 text-sm">{room._count.puzzles}개의 퍼즐</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
