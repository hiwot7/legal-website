import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(testimonials);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const clientName = (body.clientName || "").trim();
  const clientRole = (body.clientRole || "").trim() || null;
  const quote = (body.quote || "").trim();
  const status = body.status || "DRAFT";

  if (!clientName || !quote) {
    return NextResponse.json({ error: "Client name and quote are required." }, { status: 400 });
  }
  if (!["DRAFT", "IN_REVIEW", "PUBLISHED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.create({
    data: { clientName, clientRole, quote, status },
  });
  return NextResponse.json({ ok: true, testimonial });
}
