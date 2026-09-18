import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = await prisma.resource.findUnique({
    where: { id },
    select: { fileData: true, fileType: true, fileName: true, status: true },
  });

  if (!resource?.fileData || resource.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(resource.fileData), {
    headers: {
      "Content-Type": resource.fileType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${(resource.fileName || "download").replace(/"/g, "")}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
