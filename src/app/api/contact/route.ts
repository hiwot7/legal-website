import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads";

export async function POST(req: Request) {
  let body: { name?: string; email?: string; phone?: string; practiceArea?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, practiceArea, message } = body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  await createLead({ name, email, phone, practiceArea, message });

  return NextResponse.json({ ok: true });
}
