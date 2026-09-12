# Building a Law Firm Website with Next.js, Postgres, and Gemini AI

A step-by-step walkthrough of how this project was built — from an empty folder to a
trilingual public site with a real admin panel, database-backed case lookup, and an
AI chat assistant. Written so you can follow along and understand *why* each piece
exists, not just copy-paste it.

**Prerequisites:** Node.js 18+, npm, basic familiarity with JavaScript/TypeScript and
the command line. You don't need prior Next.js experience — each new concept is
explained the first time it shows up.

---

## 1. Scaffold the Next.js app

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

**What this gives you:**
- `--app` — the App Router (`src/app/`), where folders map to URL routes and
  `page.tsx` files are what render at each route. This is the modern Next.js
  convention, replacing the older `pages/` router.
- `--src-dir` — keeps application code under `src/`, separate from config files at
  the project root.
- `--typescript` — type safety. Worth it even if you're new to TypeScript; it catches
  a large class of bugs before you ever run the app.

Run `npm run dev` and you'll have a starter page at `http://localhost:3000`.

> **Why this matters:** everything else in this tutorial is either a *page* (a route
> the browser visits), an *API route* (a server endpoint the browser calls), or a
> *component* (a reusable piece of UI). Get comfortable with that split early.

---

## 2. Design system first, pages second

Before writing any page, we defined the site's visual language as CSS custom
properties (variables) in `src/app/globals.css` — colors, fonts, spacing rules. For
example:

```css
:root {
  --bg: #f8f9fa;
  --ink: #0f172a;
  --accent: #96131a;
  --border: #e2e6ea;
}
```

Every component then references `var(--accent)` instead of hardcoding a hex color.
**Why:** change the palette in one place later, and the whole site updates — and it
makes supporting dark mode (see below) almost free.

We also loaded three Google Fonts via `next/font/google` in `layout.tsx` — a serif
(Spectral) for headings, a sans-serif (Public Sans) for body text, and a monospace
(IBM Plex Mono) for anything data-like (case IDs, code). Pairing typefaces
deliberately, rather than using one font everywhere, is what makes a site look
designed rather than default.

**Dark mode, almost for free:** because every color is a variable, supporting dark
mode is just redefining those variables inside a media query:

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0b0e14;
    --ink: #edeff3;
    /* ...etc */
  }
}
```

No component code changes — they were already reading from `var(--bg)`.

---

## 3. Build the content as data, not hardcoded JSX

Two files hold *everything* the site says: `src/lib/firm.ts` (name, phone, address —
things that don't change per-language) and `src/lib/i18n.ts` (a dictionary of every
piece of UI text, in three languages: English, Amharic, Oromo).

```ts
// src/lib/i18n.ts (shape, simplified)
export const T: Record<Lang, Translation> = {
  en: { heroTitle: "Built for Complex Decisions...", ctaPrimary: "Track My Case", ... },
  am: { heroTitle: "ውስብስብ ውሳኔዎችና...", ctaPrimary: "ጉዳዬን ተከታተል", ... },
  om: { heroTitle: "Murtoowwan Walxaxaa...", ctaPrimary: "Dhimma Koo Hordofi", ... },
};
```

Every component receives a `t: Translation` prop and reads `t.heroTitle` instead of
a hardcoded string. The page itself just holds a `lang` state variable and swaps
which dictionary it hands down:

```tsx
const [lang, setLang] = useState<Lang>("en");
const t = T[lang];
// ...
<Hero t={t} />
```

**Why this matters:** adding a fourth language later means adding one more object to
`T` — zero component changes. This pattern (content as data, UI as a function of
that data) is worth internalizing; it's the difference between a site you can
maintain and one you have to rewrite every time the copy changes.

---

## 4. Compose the page from small components

Rather than one giant `page.tsx`, the homepage is a composition of focused
components, each in its own file under `src/components/site/`:

```tsx
// src/app/page.tsx (simplified)
export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];
  return (
    <>
      <Nav lang={lang} setLang={setLang} t={t} />
      <Hero t={t} />
      <PracticeAreas t={t} />
      <CaseLookup t={t} />
      <Insights t={t} />
      <Contact t={t} />
      <SiteFooter t={t} />
    </>
  );
}
```

Each component owns its own layout and styling and takes only the data it needs as
props. When something breaks, you know exactly which ~100-line file to open instead
of hunting through one 1,500-line file.

---

## 5. Add a real backend feature: the AI chat assistant

This is the first place the site talks to a server. Two pieces:

**A server-only API route** (`src/app/api/chat/route.ts`) that holds the secret
Gemini API key and calls Google's API:

```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { message, history } = await req.json();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash", systemInstruction: "..." });
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(message);
  return Response.json({ reply: result.response.text() });
}
```

**A client component** (`AIDrawer.tsx`) that renders the chat UI and calls that route
with `fetch("/api/chat", { method: "POST", ... })`.

**Why the split matters — this is the single most important security lesson in this
project:** the API key lives in `.env.local` and is read with `process.env.GEMINI_API_KEY`
*inside the API route only*. It never appears in any file that ships to the
browser. If you ever find yourself putting an API key directly in a component that
renders client-side, stop — anyone can open dev tools and steal it.

**A real bug we hit, worth knowing about:** Gemini's chat API requires the *first*
message in a conversation's history to come from the user, not the assistant. Our
chat widget always opens with a greeting message from the assistant
(`{ role: "model", text: "Hi, I'm..." }`), which broke every visitor's first reply.
The fix: strip anything before the first user-authored message before sending
history to Gemini.

```ts
const firstUserIndex = rawHistory.findIndex((m) => m.role === "user");
const history = firstUserIndex === -1 ? [] : rawHistory.slice(firstUserIndex);
```

This kind of bug — where a UI convenience (a friendly greeting) quietly breaks an
external API's assumptions — is exactly why you test the actual feature end-to-end,
not just "does it compile."

---

## 6. Add a database: Prisma + Postgres

**Install:**
```bash
npm install prisma @prisma/client @prisma/adapter-pg pg
```

**Define your data as a schema** (`prisma/schema.prisma`) — this is the single source
of truth for your database structure:

```prisma
model CaseRecord {
  id        String    @id @default(cuid())
  caseId    String    @unique
  client    String
  attorney  String
  court     String
  status    String
  ketero    DateTime?
}
```

**Configure the connection.** In Prisma 7 (a recent breaking change worth knowing
about if you follow older tutorials), the connection string no longer lives inside
`schema.prisma` — it lives in a separate `prisma.config.ts`, and `PrismaClient` takes
an explicit "driver adapter":

```ts
// prisma.config.ts
import { defineConfig, env } from "prisma/config";
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: env("DATABASE_URL") },
});
```

```ts
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
```

**Push the schema to your actual database:**
```bash
npx prisma generate   # generates the typed client from your schema
npx prisma db push    # creates/updates the real tables to match
```

> If your database user doesn't have permission to create databases (common on
> managed/shared hosting), `prisma migrate dev` will fail with error `P3014`. Use
> `prisma db push` instead — it syncs the schema directly without needing that
> extra permission (the tradeoff: it doesn't keep a migration history file).

**Use it in a Server Component** — this is one of the most powerful things about the
App Router: a page can query the database directly, no separate API call needed:

```tsx
// src/app/admin/(dashboard)/cases/page.tsx
export default async function CasesPage() {
  const cases = await prisma.caseRecord.findMany({ orderBy: { createdAt: "desc" } });
  return <table>{/* render cases */}</table>;
}
```

Notice this function is `async` and there's no `useEffect`, no loading spinner, no
client-side fetch — the data is already there by the time this component renders on
the server.

---

## 7. Add authentication with roles

**Install:** `npm install next-auth@beta bcryptjs`

**Define the auth config** (`src/auth.ts`) using a Credentials provider (email +
password, hashed with bcrypt — never store a plaintext password):

```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !(await bcrypt.compare(credentials.password, user.passwordHash))) return null;
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) { token.role = user.role; token.id = user.id; }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});
```

**Protect a set of routes** with a `proxy.ts` file (this used to be called
`middleware.ts` in older Next.js versions — same idea, new name) at the project root:

```ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  if (!isLoggedIn && req.nextUrl.pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
});

export const config = { matcher: ["/admin/:path*"] };
```

**Role-based access (RBAC) beyond login:** being logged in isn't the same as being
*allowed to do everything*. For a superadmin-only page, check the role explicitly and
redirect if it doesn't match:

```tsx
const session = await auth();
if (session?.user.role !== "SUPERADMIN") redirect("/admin/leads");
```

Do the same check again inside any API route that performs the sensitive action —
never trust that the UI hid a button as your only protection. A button being hidden
doesn't stop someone from calling the API route directly.

---

## 8. Build the admin panel

With auth and the database in place, the admin panel is mostly familiar CRUD
(Create, Read, Update, Delete) patterns:

- **List page** (Server Component): fetch all rows with Prisma, render a table.
- **Create/Edit form** (Client Component): a `<form>` that `fetch()`s a `POST`/`PATCH`
  API route, then `router.push()` back to the list.
- **API route**: validates input, calls `prisma.model.create()` /
  `.update()` / `.delete()`, checks the session's role first.

The one Next.js-specific trick worth knowing: **route groups**. Folders wrapped in
parentheses, like `src/app/admin/(dashboard)/`, don't add a segment to the URL —
`(dashboard)/leads/page.tsx` still serves at `/admin/leads` — but they let you attach
a `layout.tsx` (which adds the shared nav bar and the auth check) to *only* the pages
inside that group, while `admin/login/page.tsx` sits outside it and stays
public. This is how we avoided the login page redirecting to itself in an infinite
loop.

---

## 9. Connect the public feature to real data

Once cases live in the database, the public-facing "Track Your Case" search stops
being a demo and becomes a real lookup:

```ts
// src/app/api/cases/lookup/route.ts — public, no auth required
const record = await prisma.caseRecord.findFirst({
  where: { OR: [{ caseId: { equals: query, mode: "insensitive" } }, { phone: query }] },
});
return Response.json(record ? { found: true, record } : { found: false });
```

**A subtle bug worth knowing about:** dates stored as "just a calendar date" (like a
court hearing date with no specific time) get saved as UTC midnight. If you then
format that date using your server's *local* timezone, it can display as the day
before what was actually entered. Fix: always format date-only fields with an
explicit `timeZone: "UTC"` option, so the calendar date you stored is the calendar
date you display, regardless of what timezone the server happens to run in.

---

## 10. Test the real thing, not just "did it compile"

A build succeeding only proves the code is syntactically valid — it proves nothing
about whether the feature actually works. Throughout this project, the real
verification looked like:

1. Start the dev server.
2. Call the actual API route with real data (`curl` or a small Node script) and read
   the actual response.
3. For a full login flow: get a CSRF token, submit real credentials, confirm the
   session comes back with the right role, confirm a protected page now returns
   `200` instead of a redirect.
4. Clean up any test data you created, so it doesn't pollute the real database.

This is how the Gemini history bug and the timezone bug above were actually found —
neither would show up in a TypeScript compile or a "the page loaded" check.

---

## 11. Deploy it

This app is built to deploy on any Node.js host; **Vercel** (made by the Next.js
team) is the path of least resistance:

1. Push the code to a GitHub repository.
2. Import that repository on vercel.com.
3. Add every variable from `.env.local` into the project's Environment Variables
   settings — same names, same values, just entered through their dashboard instead
   of a local file.
4. Deploy. You get a live URL immediately.

**Never commit `.env.local` to git.** It's already excluded via `.gitignore` in this
project (`.env*` is in there) — keep it that way. Secrets belong in your host's
environment variable settings, not in version control.

---

## The pattern underneath all of this

If you take one thing from this project: **data flows one direction, and secrets
never cross the client/server boundary.**

- Content lives in data files (`firm.ts`, `i18n.ts`), not scattered through JSX.
- The database is the source of truth; pages read from it, they don't duplicate it.
- Anything secret (API keys, password hashes, the database connection string) lives
  only in server-side code (API routes, Server Components) and `.env.local` — never
  in a component that renders in the browser.
- Every sensitive action is checked twice: once for "are you logged in," again for
  "are you allowed to do *this specific thing.*"

Once that structure is in place, adding a new feature is usually: add a field to the
schema, add a form, add an API route, add a page. The hard architectural decisions
are already made.
