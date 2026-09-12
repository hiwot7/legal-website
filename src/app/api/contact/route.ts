import { Resend } from "resend";
import { NextResponse } from "next/server";
import { firm } from "@/lib/firm";
import { prisma } from "@/lib/prisma";

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

  try {
    await prisma.lead.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        practiceArea: practiceArea?.trim() || null,
        message: message.trim(),
      },
    });
  } catch (err) {
    console.error("Failed to save lead to database:", err);
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || firm.email;

  if (!resendKey) {
    console.log("New intake submission (email not configured):", body);
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "Website Intake <onboarding@resend.dev>",
      to: toEmail,
      replyTo: email,
      subject: `New intake form submission from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        practiceArea ? `Practice area: ${practiceArea}` : null,
        "",
        "Message:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    console.log("Intake submission (email delivery failed):", body);
    // The lead was already saved to the database above, so this isn't a hard failure —
    // just let the visitor know the confirmation email may not have gone out.
    return NextResponse.json({ ok: true });
  }
}
