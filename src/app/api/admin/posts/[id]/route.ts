import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      type: true,
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      metaTitle: true,
      metaDescription: true,
      status: true,
      coverImageType: true,
    },
  });
  if (!post) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
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

  const existing = await prisma.post.findUnique({ where: { id }, select: { status: true, publishedAt: true } });
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const publishedAt = status === "PUBLISHED" ? existing.publishedAt ?? new Date() : existing.status === "PUBLISHED" ? existing.publishedAt : null;

  try {
    await prisma.post.update({
      where: { id },
      data: {
        type: type as "ARTICLE" | "CASE_STUDY",
        slug,
        title,
        excerpt,
        body,
        metaTitle,
        metaDescription,
        status: status as "DRAFT" | "IN_REVIEW" | "PUBLISHED",
        publishedAt,
        ...coverData,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "That URL slug is already taken." }, { status: 409 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
