import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const resource = await prisma.resource.findUnique({
    where: { id },
    select: { fileData: true, fileType: true, fileName: true },
  });

  if (!resource?.fileData) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(resource.fileData), {
    headers: {
      "Content-Type": resource.fileType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${(resource.fileName || "download").replace(/"/g, "")}"`,
      "Cache-Control": "private, max-age=60",
    },
  });
}
