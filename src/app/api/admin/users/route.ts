import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Only superadmins can create users." }, { status: 403 });
  }

  const body = await req.json();
  const { name, email, password, role } = body;

  if (!email?.trim() || !password || password.length < 8 || !["ADMIN", "SUPERADMIN"].includes(role)) {
    return NextResponse.json({ error: "Valid email, a password of at least 8 characters, and a role are required." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await prisma.user.create({
      data: { name: name?.trim() || null, email: email.trim().toLowerCase(), passwordHash, role },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
  }
}
