import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id }, select: { coverImage: true, coverImageType: true, status: true } });

  if (!post?.coverImage || post.status !== "PUBLISHED") {
    return NextResponse.json({ error: "No cover image." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(post.coverImage), {
    headers: {
      "Content-Type": post.coverImageType || "image/jpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
