"use client";

import { useState } from "react";
import { T, type Lang } from "@/lib/i18n";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import PracticeAreas from "@/components/site/PracticeAreas";
import Team from "@/components/site/Team";
import CaseLookup from "@/components/site/CaseLookup";
import Insights from "@/components/site/Insights";
import Contact from "@/components/site/Contact";
import SiteFooter from "@/components/site/SiteFooter";
import AIDrawer from "@/components/site/AIDrawer";
import LadyJustice from "@/components/site/LadyJustice";
import { IconBot } from "@/components/site/Icons";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [aiOpen, setAiOpen] = useState(false);
  const t = T[lang];

  const scrollToLookup = () => {
    document.getElementById("lookup")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div className="bg-decor" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
        <span className="blob b4" />
        <LadyJustice />
      </div>
      <div className="app-layer">
        <Nav lang={lang} setLang={setLang} t={t} onOpenAI={() => setAiOpen(true)} onTrack={scrollToLookup} />
        <Hero t={t} onOpenAI={() => setAiOpen(true)} onTrack={scrollToLookup} />
        <PracticeAreas t={t} />
        <Team t={t} />
        <CaseLookup t={t} />
        <Insights t={t} />
        <Contact t={t} />
        <SiteFooter t={t} />

        <button
          onClick={() => setAiOpen(true)}
          aria-label={t.aiOpenLabel}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 50,
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: "var(--accent)",
            color: "var(--accent-ink)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(150,19,26,.35)",
          }}
        >
          <IconBot size={26} />
        </button>

        <AIDrawer open={aiOpen} onClose={() => setAiOpen(false)} t={t} lang={lang} />
      </div>
    </div>
  );
}
