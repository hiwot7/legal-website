"use client";

import { useEffect, useState } from "react";
import type { Translation } from "@/lib/i18n";
import { firm } from "@/lib/firm";
import { IconArrowRight, IconBot, IconClock } from "./Icons";
import { PhotoScene } from "./HeroScenes";

const SLIDES = [
  { src: "/api/site-images/hero-1", position: "center 30%" },
  { src: "/api/site-images/hero-2", position: "center" },
  { src: "/api/site-images/hero-3", position: "center 20%" },
];
const SLIDE_DURATION = 7000;

export default function Hero({ t, onOpenAI, onTrack }: { t: Translation; onOpenAI: () => void; onTrack: () => void }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ position: "relative", overflow: "hidden", minHeight: "min(88vh, 720px)", color: "#fff" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }} aria-hidden="true">
        {SLIDES.map((slide, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: i === active ? 1 : 0, transition: "opacity 1.4s ease" }}>
            <PhotoScene src={slide.src} position={slide.position} active={i === active} />
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(8,10,15,.32) 0%, rgba(8,10,15,.58) 65%, rgba(8,10,15,.8) 100%)",
          }}
        />
      </div>

      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "112px 24px 64px",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
        }}
      >
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48, alignItems: "end" }}>
          <div style={{ maxWidth: 640 }}>
            <div
              className="hero-in hero-in-1"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textTransform: "uppercase",
                letterSpacing: ".14em",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                border: "1px solid rgba(255,255,255,.35)",
                borderRadius: 100,
                padding: "7px 16px",
                marginBottom: 20,
                background: "rgba(255,255,255,.06)",
                backdropFilter: "blur(6px)",
              }}
            >
              {t.heroKicker}
            </div>
            <h1
              className="hero-in hero-in-2"
              style={{ fontSize: "clamp(34px, 5.4vw, 58px)", fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.01em", color: "#fff" }}
            >
              {t.heroTitle}
            </h1>
            <p className="hero-in hero-in-2" style={{ marginTop: 22, fontSize: 17.5, lineHeight: 1.65, color: "rgba(255,255,255,.82)", maxWidth: 560 }}>
              {t.heroSub}
            </p>
            <div className="hero-in hero-in-3" style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={onTrack}>
                {t.ctaPrimary} <IconArrowRight size={16} />
              </button>
              <button
                className="btn"
                onClick={onOpenAI}
                style={{ background: "rgba(255,255,255,.08)", border: "1.5px solid rgba(255,255,255,.4)", color: "#fff", backdropFilter: "blur(6px)" }}
              >
                <IconBot size={17} /> {t.ctaSecondary}
              </button>
            </div>

            <div className="hero-in hero-in-3" style={{ display: "flex", gap: 8, marginTop: 40 }}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show background ${i + 1}`}
                  onClick={() => setActive(i)}
                  style={{
                    width: i === active ? 22 : 8,
                    height: 8,
                    borderRadius: 100,
                    border: "none",
                    padding: 0,
                    background: i === active ? "#fff" : "rgba(255,255,255,.4)",
                    transition: "width .3s ease, background .3s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          <div
            className="card hero-in hero-in-3"
            style={{
              padding: 0,
              overflow: "hidden",
              minWidth: 0,
              background: "rgba(18,20,26,.55)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,.14)",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,.14)",
              }}
            >
              <span className="mono" style={{ fontSize: 11.5, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.75)" }}>
                At a Glance
              </span>
              <span className="mono" style={{ fontSize: 11.5, color: "rgba(255,255,255,.5)" }}>
                2026
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              {[
                [t.statCases, firm.stats.cases],
                [t.statYears, firm.stats.years],
                [t.statPartners, firm.stats.partners],
              ].map(([label, val], i) => (
                <div
                  key={i}
                  style={{
                    padding: "22px 18px",
                    borderRight: i < 2 ? "1px solid rgba(255,255,255,.14)" : "none",
                    borderTop: "1px solid rgba(255,255,255,.14)",
                  }}
                >
                  <div className="mono serif" style={{ fontSize: 30, fontWeight: 700, color: "var(--gold)" }}>
                    {val}
                  </div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.65)", marginTop: 6, lineHeight: 1.35 }}>{label}</div>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid rgba(255,255,255,.14)",
                display: "flex",
                gap: 10,
                alignItems: "center",
                color: "rgba(255,255,255,.75)",
                fontSize: 13,
              }}
            >
              <IconClock size={15} /> Federal &amp; regional courts, three cities.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
