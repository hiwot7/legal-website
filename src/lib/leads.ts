import { Resend } from "resend";
import { firm } from "@/lib/firm";
import { prisma } from "@/lib/prisma";

export type LeadInput = {
  name: string;
  email: string;
  phone?: string | null;
  practiceArea?: string | null;
  message: string;
};

export async function createLead(input: LeadInput) {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const phone = input.phone?.trim() || null;
  const practiceArea = input.practiceArea?.trim() || null;

  try {
    await prisma.lead.create({ data: { name, email, phone, practiceArea, message } });
  } catch (err) {
    console.error("Failed to save lead to database:", err);
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || firm.email;

  if (!resendKey) {
    console.log("New intake submission (email not configured):", { name, email, phone, practiceArea, message });
    return;
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
  } catch (err) {
    console.error("Failed to send contact email:", err);
    console.log("Intake submission (email delivery failed):", { name, email, phone, practiceArea, message });
  }
}
