import { prisma } from "@/lib/db/prisma";
import RoomClient from "./RoomClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default async function RoomPage({ params }: PageProps) {
  const { roomId } = await params;

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { puzzles: { orderBy: { order: "asc" } } },
  });

  if (!room || !room.isActive) notFound();

  return <RoomClient room={room as any} />;
}
