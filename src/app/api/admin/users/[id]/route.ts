import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Only superadmins can change roles." }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.user.id) {
    return NextResponse.json({ error: "You can't change your own role." }, { status: 400 });
  }

  const body = await req.json();
  if (!["ADMIN", "SUPERADMIN"].includes(body.role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  await prisma.user.update({ where: { id }, data: { role: body.role } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Only superadmins can remove users." }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.user.id) {
    return NextResponse.json({ error: "You can't remove your own account." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
