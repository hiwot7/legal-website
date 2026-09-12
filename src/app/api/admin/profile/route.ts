import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // 4MB

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const title = (form.get("title") as string | null)?.trim();
  const bio = (form.get("bio") as string | null)?.trim();
  const visible = form.get("visible") !== "false";
  const photo = form.get("photo") as File | null;

  if (!title || !bio) {
    return NextResponse.json({ error: "Title and bio are required." }, { status: 400 });
  }

  let photoData: { photo: Uint8Array<ArrayBuffer>; photoType: string } | Record<string, never> = {};
  if (photo && photo.size > 0) {
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: "Photo must be under 4MB." }, { status: 400 });
    }
    if (!photo.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image." }, { status: 400 });
    }
    photoData = { photo: new Uint8Array(await photo.arrayBuffer()), photoType: photo.type };
  }

  await prisma.teamMember.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, title, bio, visible, ...photoData },
    update: { title, bio, visible, ...photoData },
  });

  return NextResponse.json({ ok: true });
}
