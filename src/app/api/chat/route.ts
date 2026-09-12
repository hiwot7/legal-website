import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { firm } from "@/lib/firm";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "model"; text: string };

const LANG_NAMES: Record<string, string> = {
  en: "English",
  am: "Amharic",
  om: "Afaan Oromo",
};

function buildSystemPrompt(lang: string) {
  const langName = LANG_NAMES[lang] || "English";
  return `You are the virtual intake assistant for ${firm.name}, an Ethiopian law firm with offices serving Addis Ababa, Adama, and Hawassa.
Your job: greet visitors, answer general questions about the firm's practice areas, hours, and location, and help them describe their legal issue so a human attorney can follow up.

Firm practice areas: Litigation, Business Law, Personal Injury, Family Law.
Firm hours: ${firm.hours}. Phone: ${firm.phone}. Email: ${firm.email}.

Rules:
- Respond in ${langName}, matching the language the visitor writes in when possible.
- You are NOT an attorney and must never give specific legal advice, predict case outcomes, or tell someone what to do in their specific situation.
- Always make clear you are an AI assistant, not a lawyer, if asked or when giving anything resembling advice.
- Keep answers concise (2-4 sentences) and friendly.
- If the visitor describes a legal issue, briefly acknowledge it and encourage them to book a free consultation via the Contact section or by calling ${firm.phone}.
- If asked about pricing/fees for a specific case, say fees are discussed during a consultation and depend on the matter.
- Do not discuss topics unrelated to the firm's services; politely redirect.`;
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "AI support isn't configured yet. Set GEMINI_API_KEY in your environment to enable this feature.",
      },
      { status: 503 }
    );
  }

  let body: { message?: string; history?: ChatMessage[]; lang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const rawHistory = Array.isArray(body.history) ? body.history.slice(0, -1) : [];
  // Gemini requires the first turn in history to have role "user" — drop the
  // assistant's opening greeting (and anything before the first user turn).
  const firstUserIndex = rawHistory.findIndex((m) => m?.role === "user");
  const history = firstUserIndex === -1 ? [] : rawHistory.slice(firstUserIndex).slice(-10);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: buildSystemPrompt(body.lang || "en"),
    });

    const chat = model.startChat({
      history: history
        .filter((m) => m && typeof m.text === "string" && (m.role === "user" || m.role === "model"))
        .map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Gemini chat error:", err);
    return NextResponse.json(
      { error: "The AI assistant is temporarily unavailable. Please try again shortly." },
      { status: 502 }
    );
  }
}
