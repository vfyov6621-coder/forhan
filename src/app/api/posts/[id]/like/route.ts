import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const { id } = await params;

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db.like.findUnique({
      where: { userId_postId: { userId: session.userId, postId: id } },
    });

    if (existing) {
      await db.like.delete({ where: { id: existing.id } });
      return NextResponse.json({ liked: false });
    } else {
      await db.like.create({
        data: { userId: session.userId, postId: id },
      });
      return NextResponse.json({ liked: true });
    }
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
