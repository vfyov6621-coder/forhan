import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

// GET /api/admin/users — list all users with online status
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;

  const where: Record<string, unknown> = q
    ? {
        OR: [
          { username: { contains: q } },
          { displayName: { contains: q } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        subscribed: true,
        isAdmin: true,
        createdAt: true,
      },
    }),
    db.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, page, limit });
}

// DELETE /api/admin/users — delete a user
export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Check if user is admin — prevent self-delete
  const session = await (await import("@/lib/auth")).getSession();
  if (session.userId === userId) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  // Delete all related data first (cascade)
  await db.like.deleteMany({ where: { userId } });
  await db.comment.deleteMany({ where: { authorId: userId } });
  await db.post.deleteMany({ where: { authorId: userId } });
  await db.user.delete({ where: { id: userId } });

  return NextResponse.json({ ok: true });
}

// PATCH /api/admin/users — toggle user fields
export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { userId, action } = await req.json();

  if (!userId || !action) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const data: Record<string, boolean> = {};
  if (action === "toggleSub") {
    const user = await db.user.findUnique({ where: { id: userId }, select: { subscribed: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    data.subscribed = !user.subscribed;
  } else if (action === "toggleAdmin") {
    const user = await db.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    data.isAdmin = !user.isAdmin;
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      subscribed: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user: updated });
}
