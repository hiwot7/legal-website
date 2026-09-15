import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EDITABLE_CONTENT_KEYS, defaultContentValue } from "@/lib/editableContent";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.siteContent.findMany();
  const byKey = new Map(rows.map((r) => [r.key, r]));

  const result = EDITABLE_CONTENT_KEYS.map((key) => {
    const existing = byKey.get(key);
    return existing
      ? { key, valueEn: existing.valueEn, valueAm: existing.valueAm, valueOm: existing.valueOm }
      : { key, ...defaultContentValue(key) };
  });

  return NextResponse.json(result);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const items = Array.isArray(body.items) ? body.items : [];

  for (const item of items) {
    if (!EDITABLE_CONTENT_KEYS.includes(item.key)) continue;
    const valueEn = (item.valueEn ?? "").toString();
    const valueAm = (item.valueAm ?? "").toString();
    const valueOm = (item.valueOm ?? "").toString();
    if (!valueEn.trim() || !valueAm.trim() || !valueOm.trim()) continue;

    await prisma.siteContent.upsert({
      where: { key: item.key },
      create: { key: item.key, valueEn, valueAm, valueOm },
      update: { valueEn, valueAm, valueOm },
    });
  }

  return NextResponse.json({ ok: true });
}
