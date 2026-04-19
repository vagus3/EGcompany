import { prisma } from "@/lib/db/prisma";
import { connection } from "next/server";
import RoomClient from "./RoomClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default async function RoomPage({ params }: PageProps) {
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

  return <RoomClient room={room as any} />;
}
