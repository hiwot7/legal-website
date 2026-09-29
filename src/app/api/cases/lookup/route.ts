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

  const digitsOnly = query.replace(/\D/g, "");

  const [record] = await prisma.$queryRaw<
    { id: string; caseId: string; client: string; attorney: string; court: string; status: string; ketero: Date | null }[]
  >`
    SELECT id, "caseId", client, attorney, court, status, ketero
    FROM "CaseRecord"
    WHERE "caseId" ILIKE ${query}
       OR (${digitsOnly} != '' AND regexp_replace(phone, '\D', '', 'g') = ${digitsOnly})
    ORDER BY "createdAt" DESC
    LIMIT 1
  `;

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
