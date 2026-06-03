import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { username, displayName, password, honeypot } = await req.json();

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ error: "Bot detected" }, { status: 400 });
    }

    if (!username || !displayName || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (username.length < 1 || username.length > 30) {
      return NextResponse.json({ error: "Username must be 1-30 characters" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        username,
        displayName,
        passwordHash,
      },
    });

    const session = await getSession();
    session.userId = user.id;
    session.username = user.username;
    session.isLoggedIn = true;
    session.isAdmin = user.isAdmin;
    await session.save();

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        subscribed: user.subscribed,
        isAdmin: user.isAdmin,
        theme: user.theme,
        accentColor: user.accentColor,
        language: user.language,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
