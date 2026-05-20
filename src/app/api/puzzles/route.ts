import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId");

  try {
    const where = roomId ? { roomId } : {};
    const puzzles = await prisma.puzzle.findMany({
      where,
      orderBy: { order: "asc" },
    });
    return NextResponse.json<ApiResponse<typeof puzzles>>({ success: true, data: puzzles });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "퍼즐 조회 실패" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const puzzle = await prisma.puzzle.create({ data: body });
    return NextResponse.json<ApiResponse<typeof puzzle>>(
      { success: true, data: puzzle },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "퍼즐 생성 실패" },
      { status: 500 }
    );
  }
}
