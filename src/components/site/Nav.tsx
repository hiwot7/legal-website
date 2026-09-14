"use client";

import { useState } from "react";
import type { Lang, Translation } from "@/lib/i18n";
import { IconMenu, IconX, IconBot, IconMapPin } from "./Icons";
import Pill from "./Pill";
import LangToggle from "./LangToggle";
import BekaLogo from "./BekaLogo";
import ThemeToggle from "./ThemeToggle";

const SECTION_IDS = ["work", "team", "lookup", "insights", "contact"];

export default function Nav({
  lang,
  setLang,
  t,
  onOpenAI,
  onTrack,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translation;
  onOpenAI: () => void;
  onTrack: () => void;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "var(--accent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76, gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <div style={{ flexShrink: 0, borderRadius: 4, overflow: "hidden", boxShadow: "0 0 0 1px rgba(255,255,255,.2)" }}>
            <BekaLogo height={40} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="serif" style={{ fontWeight: 700, fontSize: 17.5, lineHeight: 1.1, whiteSpace: "nowrap", color: "#ffffff" }}>
              {t.firm}
            </div>
            <div style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#ffffff", opacity: 0.7 }}>
              {t.firmSub}
            </div>
          </div>
        </div>

        <nav style={{ display: "none", gap: 28, fontSize: 14, fontWeight: 600 }} className="nav-desktop">
          {t.nav.map((label, i) => (
            <button
              key={i}
              onClick={() => scrollTo(SECTION_IDS[i])}
              style={{ background: "none", border: "none", textDecoration: "none", color: "#ffffff", padding: 0 }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div style={{ display: "none", alignItems: "center", gap: 14 }} className="nav-desktop-right">
          <Pill>
            <IconMapPin size={13} /> {t.cities}
          </Pill>
          <LangToggle lang={lang} setLang={setLang} />
          <ThemeToggle dark />
          <button
            onClick={onTrack}
            style={{
              padding: "10px 18px",
              background: "var(--gold-surface)",
              color: "var(--gold-surface-ink)",
              border: "none",
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 14.5,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            {t.ctaPrimary}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="nav-mobile-right">
          <LangToggle lang={lang} setLang={setLang} />
          <ThemeToggle dark />
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,.5)", color: "#ffffff", borderRadius: 2, padding: 8, display: "flex" }}
          >
            <IconMenu size={20} />
          </button>
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          background: "rgba(15,23,42,.5)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity .2s",
        }}
        onClick={() => setDrawerOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            width: "min(320px,86vw)",
            background: "var(--surface)",
            borderLeft: "1px solid var(--border)",
            transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform .25s ease",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="serif" style={{ fontWeight: 700, fontSize: 17 }}>
              {t.firm}
            </span>
            <button
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              style={{ background: "transparent", border: "none", color: "var(--ink)" }}
            >
              <IconX size={22} />
            </button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 16, fontWeight: 600 }}>
            {t.nav.map((label, i) => (
              <button
                key={i}
                onClick={() => {
                  setDrawerOpen(false);
                  scrollTo(SECTION_IDS[i]);
                }}
                style={{ background: "none", border: "none", textAlign: "left", textDecoration: "none", color: "var(--ink)", padding: 0 }}
              >
                {label}
              </button>
            ))}
          </nav>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            <Pill>
              <IconMapPin size={13} /> {t.cities}
            </Pill>
            <ThemeToggle />
            <button
              className="btn btn-primary"
              onClick={() => {
                setDrawerOpen(false);
                onTrack();
              }}
            >
              {t.ctaPrimary}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setDrawerOpen(false);
                onOpenAI();
              }}
            >
              <IconBot size={17} /> {t.ctaSecondary}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
