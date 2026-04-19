import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const roomId = searchParams.get("roomId");

  if (!userId) {
    return NextResponse.json<ApiResponse<null>>({ success: false, error: "userId 필요" }, { status: 400 });
  }

  try {
    const where = roomId ? { userId, roomId } : { userId };
    const progress = await prisma.progress.findMany({ where });
    return NextResponse.json<ApiResponse<typeof progress>>({ success: true, data: progress });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>({ success: false, error: "진행 상황 조회 실패" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const progress = await prisma.progress.upsert({
      where: {
        id: body.id ?? "new",
      },
      create: body,
      update: {
        status: body.status,
        attempts: body.attempts,
        hintUsed: body.hintUsed,
        solvedAt: body.solvedAt,
      },
    });
    return NextResponse.json<ApiResponse<typeof progress>>({ success: true, data: progress });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>({ success: false, error: "진행 상황 저장 실패" }, { status: 500 });
  }
}
