import { GoogleGenerativeAI, SchemaType, type Content, type Tool } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { firm } from "@/lib/firm";
import { createLead } from "@/lib/leads";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "model"; text: string };

const LANG_NAMES: Record<string, string> = {
  en: "English",
  am: "Amharic",
  om: "Afaan Oromo",
};

const leadTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "submit_lead",
        description:
          "Submit the visitor's contact details and legal issue to the firm as a new lead so an attorney can follow up. Only call this after the visitor has explicitly confirmed they want their information sent, and after you have collected at least their name, email, and a brief description of their issue.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING, description: "The visitor's full name." },
            email: { type: SchemaType.STRING, description: "The visitor's email address." },
            phone: { type: SchemaType.STRING, description: "The visitor's phone number, if they gave one." },
            practiceArea: {
              type: SchemaType.STRING,
              description: "The relevant practice area: Litigation, Business Law, Personal Injury, or Family Law.",
            },
            message: { type: SchemaType.STRING, description: "A brief description of the visitor's legal issue." },
          },
          required: ["name", "email", "message"],
        },
      },
    ],
  },
];

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
- If the visitor describes a legal issue, briefly acknowledge it and offer to pass their details to the team. Ask for their name, email, and (optionally) phone and practice area one or two questions at a time — don't interrogate them all at once.
- Before submitting anything, briefly summarize what you collected and ask the visitor to confirm (e.g. "Should I send this to our team?"). Only call the submit_lead function after they explicitly confirm — never call it silently.
- After submit_lead succeeds, thank them and let them know the team will reach out, mentioning ${firm.hours} if relevant. If it fails, apologize and suggest calling ${firm.phone} instead.
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
      tools: leadTools,
    });

    // Built and driven manually (rather than via model.startChat()) because the
    // function-response turn below needs a "user" role — this endpoint rejects the
    // SDK's default "function" role for tool responses with a 400.
    const contents: Content[] = [
      ...history
        .filter((m) => m && typeof m.text === "string" && (m.role === "user" || m.role === "model"))
        .map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: "user", parts: [{ text: message }] },
    ];

    const result = await model.generateContent({ contents });
    let response = result.response;
    const modelContent = response.candidates?.[0]?.content;
    if (modelContent) contents.push(modelContent);

    const submitLeadCall = response.functionCalls()?.find((c) => c.name === "submit_lead");
    if (submitLeadCall) {
      const args = submitLeadCall.args as Partial<{
        name: string;
        email: string;
        phone: string;
        practiceArea: string;
        message: string;
      }>;

      let functionResult: { success: boolean; error?: string };
      if (!args.name?.trim() || !args.email?.trim() || !args.message?.trim()) {
        functionResult = { success: false, error: "Missing required fields: name, email, and message are all required before submitting." };
      } else {
        try {
          await createLead({
            name: args.name,
            email: args.email,
            phone: args.phone,
            practiceArea: args.practiceArea,
            message: args.message,
          });
          functionResult = { success: true };
        } catch (err) {
          console.error("Failed to submit lead from chat:", err);
          functionResult = { success: false, error: "Something went wrong submitting the lead." };
        }
      }

      contents.push({ role: "user", parts: [{ functionResponse: { name: "submit_lead", response: functionResult } }] });
      const followUp = await model.generateContent({ contents });
      response = followUp.response;
    }

    return NextResponse.json({ reply: response.text() });
  } catch (err) {
    console.error("Gemini chat error:", err);
    return NextResponse.json(
      { error: "The AI assistant is temporarily unavailable. Please try again shortly." },
      { status: 502 }
    );
  }
}
