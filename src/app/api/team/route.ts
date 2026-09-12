import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const members = await prisma.teamMember.findMany({
    where: { visible: true },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    members.map((m) => ({
      id: m.id,
      name: m.user.name || m.user.email,
      title: m.title,
      bio: m.bio,
      hasPhoto: !!m.photo,
    }))
  );
}
