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

export default async function Page() {
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
    <main className="min-h-screen bg-gray-950 px-4 py-10 text-white sm:px-8 sm:py-12">
      <h1 className="mb-2 text-center text-4xl font-bold">이스케이프룸</h1>
      <p className="mb-12 text-center text-gray-400">방을 선택하여 퍼즐을 풀어보세요</p>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">등록된 방이 없습니다.</p>
        ) : (
          rooms.map((room: LobbyRoom) => (
            <Link key={room.id} href={`/room/${room.id}`}>
              <div className="cursor-pointer rounded-xl border border-gray-700 bg-gray-800 p-6 transition-all hover:border-blue-500 hover:bg-gray-700">
                <div className="mb-3 flex items-start justify-between">
                  <h2 className="text-xl font-semibold">{room.title}</h2>
                  <span className="text-sm text-yellow-400">
                    난이도 {"⭐".repeat(room.difficulty)}
                  </span>
                </div>
                {room.description && (
                  <p className="mb-4 text-sm text-gray-400">{room.description}</p>
                )}
                <p className="text-sm text-blue-400">{room._count.puzzles}개의 퍼즐</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
