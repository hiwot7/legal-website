import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { caseId, client, phone, attorney, court, status, ketero } = body;

  if (!caseId?.trim() || !client?.trim() || !attorney?.trim() || !court?.trim() || !status?.trim()) {
    return NextResponse.json({ error: "Case ID, client, attorney, court, and status are required." }, { status: 400 });
  }

  try {
    await prisma.caseRecord.update({
      where: { id },
      data: {
        caseId: caseId.trim(),
        client: client.trim(),
        phone: phone?.trim() || null,
        attorney: attorney.trim(),
        court: court.trim(),
        status: status.trim(),
        ketero: ketero ? new Date(ketero) : null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "A case with that Case ID already exists." }, { status: 409 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.caseRecord.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
