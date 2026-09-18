import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const resource = await prisma.resource.findUnique({
    where: { id },
    select: { id: true, title: true, description: true, kind: true, fileName: true, externalUrl: true, status: true },
  });
  if (!resource) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json(resource);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const form = await req.formData();
  const title = (form.get("title") as string | null)?.trim();
  const description = (form.get("description") as string | null)?.trim() || null;
  const kind = (form.get("kind") as string | null) || "FILE";
  const status = (form.get("status") as string | null) || "DRAFT";
  const externalUrl = (form.get("externalUrl") as string | null)?.trim() || null;
  const file = form.get("file") as File | null;

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!["FILE", "LINK"].includes(kind)) {
    return NextResponse.json({ error: "Invalid kind." }, { status: 400 });
  }
  if (!["DRAFT", "IN_REVIEW", "PUBLISHED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const base = { title, description, kind: kind as Prisma.ResourceUpdateInput["kind"], status: status as Prisma.ResourceUpdateInput["status"] };
  let data: Prisma.ResourceUpdateInput;

  if (kind === "LINK") {
    if (!externalUrl || !/^https?:\/\//i.test(externalUrl)) {
      return NextResponse.json({ error: "A valid URL (starting with http:// or https://) is required." }, { status: 400 });
    }
    data = { ...base, externalUrl, fileData: null, fileType: null, fileName: null };
  } else if (file && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File must be under 15MB." }, { status: 400 });
    }
    data = {
      ...base,
      fileData: new Uint8Array(await file.arrayBuffer()),
      fileType: file.type || "application/octet-stream",
      fileName: file.name,
      externalUrl: null,
    };
  } else {
    data = base;
  }

  await prisma.resource.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.resource.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
