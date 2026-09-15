import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6MB

export async function POST(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  const form = await req.formData();
  const image = form.get("image") as File | null;

  if (!image || image.size === 0) {
    return NextResponse.json({ error: "An image file is required." }, { status: 400 });
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image must be under 6MB." }, { status: 400 });
  }
  if (!image.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image." }, { status: 400 });
  }

  const data = new Uint8Array(await image.arrayBuffer());
  await prisma.siteImage.upsert({
    where: { key },
    create: { key, data, mimeType: image.type },
    update: { data, mimeType: image.type },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  await prisma.siteImage.deleteMany({ where: { key } });
  return NextResponse.json({ ok: true });
}
