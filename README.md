# Beka law firm— Website

A Next.js (App Router) marketing site for a law firm, with a Gemini-powered AI support
chat widget.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AI chat setup (Gemini)

The chat widget calls a server-side API route (`src/app/api/chat/route.ts`) that talks
to Google's Gemini API. The API key is never exposed to the browser.

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and create a
   free API key.
2. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
3. Paste your key into `.env.local`:
   ```
   GEMINI_API_KEY=your-key-here
   ```
4. Restart `npm run dev`. The chat widget (bottom-right bubble) will now respond via
   Gemini. Without a key set, it shows a friendly "not configured" message instead of
   erroring.

The assistant's behavior (what it knows about the firm, what it's allowed to say) is
defined by the system prompt in `src/app/api/chat/route.ts`.

## Contact form email delivery (Resend)

The contact form (`src/app/api/contact/route.ts`) emails submissions to the firm via
[Resend](https://resend.com).

1. Create a free account at [resend.com](https://resend.com) and go to
   **API Keys** to create a key.
2. Add to `.env.local`:
   ```
   RESEND_API_KEY=your-key-here
   CONTACT_TO_EMAIL=intake@sterlingcolelaw.com
   ```
3. By default, emails send from Resend's shared sandbox address
   (`onboarding@resend.dev`), which works immediately but looks less
   professional and Resend limits it to your own verified account email as
   recipient in some cases. To send from your own domain (e.g.
   `intake@yourfirmdomain.com`), verify that domain under **Domains** in the
   Resend dashboard, then set `CONTACT_FROM_EMAIL` in `.env.local` to match.
4. Without `RESEND_API_KEY` set, submissions are just logged to the server
   console instead of emailed — useful for local development.

## Site content

Firm name, contact details, practice areas, and attorney bios are all defined in one
place: `src/lib/firm.ts`. Edit that file to update the site's content without touching
page markup.

## Structure

- `src/app/page.tsx` — Home
- `src/app/about/page.tsx` — About
- `src/app/practice-areas/page.tsx` — Practice Areas
- `src/app/attorneys/page.tsx` — Attorneys
- `src/app/contact/page.tsx` — Contact (intake form)
- `src/app/api/chat/route.ts` — Gemini chat backend
- `src/app/api/contact/route.ts` — Contact form submission handler (currently logs to
  console; wire up an email service like Resend or SendGrid before going live)
- `src/components/` — Navbar, Footer, ChatWidget

## Deploy

Deploy on [Vercel](https://vercel.com/new) or any Node host. Set the `GEMINI_API_KEY`
environment variable in your hosting provider's dashboard — do not commit `.env.local`.
