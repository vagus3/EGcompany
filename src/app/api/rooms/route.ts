import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import type { ApiResponse } from "@/types";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      include: { puzzles: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json<ApiResponse<typeof rooms>>({ success: true, data: rooms });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "방 목록 조회 실패" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const room = await prisma.room.create({ data: body });
    return NextResponse.json<ApiResponse<typeof room>>(
      { success: true, data: room },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "방 생성 실패" },
      { status: 500 }
    );
  }
}
