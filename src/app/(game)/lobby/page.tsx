import { connection } from "next/server";
import { prisma } from "@/lib/db/prisma";
import LobbyClient from "./LobbyClient";

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

  return <LobbyClient rooms={rooms} />;
}
