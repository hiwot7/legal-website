import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const resources = await prisma.resource.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, description: true, kind: true, fileName: true, fileType: true, externalUrl: true },
  });
  return NextResponse.json(resources);
}
