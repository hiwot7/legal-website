import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const VALID_STATUSES = ["NEW", "CONTACTED", "CLOSED"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const data: Prisma.LeadUpdateInput = {};

  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = body.status;
  }

  if (body.response !== undefined) {
    const response = (body.response as string).trim();
    data.response = response || null;
    data.respondedAt = response ? new Date() : null;
    if (response && body.status === undefined) {
      data.status = "CONTACTED";
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  await prisma.lead.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}
