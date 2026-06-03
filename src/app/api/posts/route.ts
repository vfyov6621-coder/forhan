import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    const posts = await db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            subscribed: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    // Check likes for current user
    let likedPostIds: Set<string> = new Set();
    if (session.isLoggedIn && session.userId) {
      const likes = await db.like.findMany({
        where: { userId: session.userId },
        select: { postId: true },
      });
      likedPostIds = new Set(likes.map((l) => l.postId));
    }

    const postsWithLikes = posts.map((p) => ({
      id: p.id,
      content: p.content,
      createdAt: p.createdAt.toISOString(),
      author: p.author,
      _count: p._count,
      isLiked: likedPostIds.has(p.id),
    }));

    return NextResponse.json(postsWithLikes);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content required" }, { status: 400 });
    }

    const post = await db.post.create({
      data: {
        content: content.trim(),
        authorId: session.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            subscribed: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    return NextResponse.json({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      author: post.author,
      _count: post._count,
      isLiked: false,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
