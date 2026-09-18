import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  let body: { query?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const query = (body.query ?? "").trim();
  if (!query) {
    return NextResponse.json({ error: "An email or phone number is required." }, { status: 400 });
  }

  const messages = await prisma.lead.findMany({
    where: {
      OR: [{ email: { equals: query, mode: "insensitive" } }, { phone: query }],
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, message: true, status: true, response: true, respondedAt: true, createdAt: true },
  });

  return NextResponse.json({ messages });
}
