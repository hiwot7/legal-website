import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      type: true,
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      coverImageType: true,
    },
  });
  return NextResponse.json(posts);
}
