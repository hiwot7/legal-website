"use client";

import { useEffect, useMemo, useState } from "react";
import { T, type Lang } from "@/lib/i18n";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import PracticeAreas from "@/components/site/PracticeAreas";
import Team from "@/components/site/Team";
import CaseLookup from "@/components/site/CaseLookup";
import Insights from "@/components/site/Insights";
import Testimonials from "@/components/site/Testimonials";
import Contact from "@/components/site/Contact";
import MessageStatus from "@/components/site/MessageStatus";
import SiteFooter from "@/components/site/SiteFooter";
import AIDrawer from "@/components/site/AIDrawer";
import AIChatLauncher from "@/components/site/AIChatLauncher";
import SubscribePopup from "@/components/site/SubscribePopup";
import LadyJustice from "@/components/site/LadyJustice";

type ContentOverrides = Record<string, { en: string; am: string; om: string }>;

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [aiOpen, setAiOpen] = useState(false);
  const [overrides, setOverrides] = useState<ContentOverrides>({});

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then(setOverrides)
      .catch(() => {});
  }, []);

  const t = useMemo(() => {
    const base = T[lang];
    const merged = { ...base };
    for (const [key, val] of Object.entries(overrides)) {
      (merged as unknown as Record<string, string>)[key] = val[lang];
    }
    return merged;
  }, [lang, overrides]);

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
        <Testimonials t={t} />
        <Contact t={t} />
        <MessageStatus t={t} />
        <SiteFooter t={t} />

        <AIChatLauncher t={t} onOpen={() => setAiOpen(true)} />

        <AIDrawer open={aiOpen} onClose={() => setAiOpen(false)} t={t} lang={lang} />
        <SubscribePopup t={t} />
      </div>
    </div>
  );
}
