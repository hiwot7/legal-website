import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      slug: true,
      title: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      author: { select: { name: true, email: true } },
    },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const type = (form.get("type") as string | null) || "ARTICLE";
  const title = (form.get("title") as string | null)?.trim();
  const slugInput = (form.get("slug") as string | null)?.trim();
  const excerpt = (form.get("excerpt") as string | null)?.trim();
  const body = (form.get("body") as string | null)?.trim();
  const metaTitle = (form.get("metaTitle") as string | null)?.trim() || null;
  const metaDescription = (form.get("metaDescription") as string | null)?.trim() || null;
  const status = (form.get("status") as string | null) || "DRAFT";
  const cover = form.get("cover") as File | null;

  if (!title || !excerpt || !body) {
    return NextResponse.json({ error: "Title, excerpt, and body are required." }, { status: 400 });
  }
  if (!["ARTICLE", "CASE_STUDY"].includes(type)) {
    return NextResponse.json({ error: "Invalid type." }, { status: 400 });
  }
  if (!["DRAFT", "IN_REVIEW", "PUBLISHED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const slug = slugify(slugInput || title);
  if (!slug) {
    return NextResponse.json({ error: "A valid URL slug is required." }, { status: 400 });
  }

  let coverData: { coverImage: Uint8Array<ArrayBuffer>; coverImageType: string } | Record<string, never> = {};
  if (cover && cover.size > 0) {
    if (cover.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Cover image must be under 4MB." }, { status: 400 });
    }
    if (!cover.type.startsWith("image/")) {
      return NextResponse.json({ error: "Cover file must be an image." }, { status: 400 });
    }
    coverData = { coverImage: new Uint8Array(await cover.arrayBuffer()), coverImageType: cover.type };
  }

  try {
    const post = await prisma.post.create({
      data: {
        type: type as "ARTICLE" | "CASE_STUDY",
        slug,
        title,
        excerpt,
        body,
        metaTitle,
        metaDescription,
        status: status as "DRAFT" | "IN_REVIEW" | "PUBLISHED",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        authorId: session.user.id,
        ...coverData,
      },
    });
    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ error: "That URL slug is already taken." }, { status: 409 });
  }
}
