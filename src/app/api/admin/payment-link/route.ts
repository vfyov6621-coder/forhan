import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

const PAYMENT_LINK_FILE = path.join(process.cwd(), "db", "payment_link.txt");

function readPaymentLink(): string {
  try {
    if (fs.existsSync(PAYMENT_LINK_FILE)) {
      return fs.readFileSync(PAYMENT_LINK_FILE, "utf-8").trim();
    }
  } catch {}
  return "";
}

function writePaymentLink(link: string): void {
  const dir = path.dirname(PAYMENT_LINK_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(PAYMENT_LINK_FILE, link, "utf-8");
}

// GET /api/admin/payment-link
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const link = readPaymentLink();
  return NextResponse.json({ link });
}

// PUT /api/admin/payment-link
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { link } = await req.json();

  if (typeof link !== "string") {
    return NextResponse.json({ error: "Invalid link" }, { status: 400 });
  }

  writePaymentLink(link);
  return NextResponse.json({ link, ok: true });
}
