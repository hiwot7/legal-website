import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id }, select: { coverImage: true, coverImageType: true } });

  if (!post?.coverImage) {
    return NextResponse.json({ error: "No cover image." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(post.coverImage), {
    headers: {
      "Content-Type": post.coverImageType || "image/jpeg",
      "Cache-Control": "private, max-age=60",
    },
  });
}
