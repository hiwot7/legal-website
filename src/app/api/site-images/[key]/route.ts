import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FALLBACKS: Record<string, string> = {
  "hero-1": "/hero/justice-statue.jpg",
  "hero-2": "/hero/library.jpg",
  "hero-3": "/hero/justice-full.jpg",
};

export async function GET(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const image = await prisma.siteImage.findUnique({ where: { key } });

  if (!image) {
    const fallback = FALLBACKS[key];
    if (fallback) {
      const proto = req.headers.get("x-forwarded-proto") || "https";
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
      return NextResponse.redirect(`${proto}://${host}${fallback}`);
    }
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=300",
    },
  });
}
