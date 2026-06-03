import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { onlineUsers, ONLINE_TIMEOUT } from "@/app/api/heartbeat/route";

export async function GET() {
  const { error, session } = await requireAdmin();
  if (error) return error;

  // Clean up expired entries
  const now = Date.now();
  for (const [uid, ts] of onlineUsers) {
    if (now - ts > ONLINE_TIMEOUT) onlineUsers.delete(uid);
  }

  // Register this admin as online
  if (session.userId) {
    onlineUsers.set(session.userId, now);
  }

  const onlineCount = onlineUsers.size;

  const totalUsers = await db.user.count();
  const subscribedCount = await db.user.count({ where: { subscribed: true } });
  const totalPosts = await db.post.count();
  const totalComments = await db.comment.count();
  const totalLikes = await db.like.count();

  return NextResponse.json({
    totalUsers,
    onlineNow: onlineCount,
    subscribedUsers: subscribedCount,
    totalPosts,
    totalComments,
    totalLikes,
  });
}
