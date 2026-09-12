import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  let body: { query?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const query = (body.query ?? "").trim();
  if (!query) {
    return NextResponse.json({ error: "A Case ID or phone number is required." }, { status: 400 });
  }

  const record = await prisma.caseRecord.findFirst({
    where: {
      OR: [{ caseId: { equals: query, mode: "insensitive" } }, { phone: query }],
    },
  });

  if (!record) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    record: {
      id: record.caseId,
      client: record.client,
      attorney: record.attorney,
      court: record.court,
      status: record.status,
      ketero: record.ketero
        ? record.ketero.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
        : "Not yet scheduled",
    },
  });
}
