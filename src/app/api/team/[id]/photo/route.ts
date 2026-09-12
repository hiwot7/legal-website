import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id }, select: { photo: true, photoType: true } });

  if (!member?.photo) {
    return NextResponse.json({ error: "No photo found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(member.photo), {
    headers: {
      "Content-Type": member.photoType || "image/jpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
