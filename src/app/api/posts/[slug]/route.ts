import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      type: true,
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      metaTitle: true,
      metaDescription: true,
      publishedAt: true,
      coverImageType: true,
      author: { select: { name: true } },
    },
  });
  if (!post) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json(post);
}
