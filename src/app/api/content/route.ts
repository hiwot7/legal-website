import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.siteContent.findMany();
  const result: Record<string, { en: string; am: string; om: string }> = {};
  for (const r of rows) {
    result[r.key] = { en: r.valueEn, am: r.valueAm, om: r.valueOm };
  }
  return NextResponse.json(result, { headers: { "Cache-Control": "public, max-age=120" } });
}
