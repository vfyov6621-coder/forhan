import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// In-memory online tracking (shared across all users)
const onlineUsers = new Map<string, number>();
const ONLINE_TIMEOUT = 60_000;

export async function POST() {
  const session = await getSession();

  if (session.isLoggedIn && session.userId) {
    onlineUsers.set(session.userId, Date.now());
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const now = Date.now();
  for (const [uid, ts] of onlineUsers) {
    if (now - ts > ONLINE_TIMEOUT) onlineUsers.delete(uid);
  }

  return NextResponse.json({ count: onlineUsers.size });
}

export { onlineUsers, ONLINE_TIMEOUT };
