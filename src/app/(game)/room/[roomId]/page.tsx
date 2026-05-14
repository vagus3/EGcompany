import { connection } from "next/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import type { RoomWithPuzzles } from "@/types";
import RoomClient from "./RoomClient";

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default async function Page({ params }: PageProps) {
  await connection();

  const { roomId } = await params;

  let room: Awaited<ReturnType<typeof prisma.room.findUnique>>;

  try {
    room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { puzzles: { orderBy: { order: "asc" } } },
    });
  } catch {
    notFound();
  }

  if (!room || !room.isActive) notFound();

  return <RoomClient room={room as unknown as RoomWithPuzzles} />;
}
