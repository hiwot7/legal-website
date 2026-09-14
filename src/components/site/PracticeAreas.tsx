import type { Translation } from "@/lib/i18n";
import { IconScale, IconBriefcase, IconHeart, IconUsers, IconCheck, IconClock, IconArrowRight } from "./Icons";
import Reveal from "./Reveal";

const ICONS = [IconBriefcase, IconScale, IconUsers, IconCheck, IconClock, IconHeart];

export default function PracticeAreas({ t }: { t: Translation }) {
  return (
    <section id="work" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="container" style={{ padding: "72px 24px" }}>
        <Reveal>
          <div className="eyebrow">{t.workEyebrow}</div>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,36px)", fontWeight: 700, marginTop: 14, marginBottom: 40 }}>{t.workTitle}</h2>
        </Reveal>
        <div
          className="areas-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: 1, background: "var(--border)", border: "1px solid var(--border)" }}
        >
          {t.areas.map((a, i) => {
            const Ic = ICONS[i % ICONS.length];
            return (
              <Reveal key={i} delay={i * 90}>
                <div
                  className="area-card"
                  style={{ background: "var(--surface)", padding: "30px 26px", height: "100%", display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "var(--ink)",
                      color: "var(--bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform .25s ease",
                    }}
                    className="area-icon"
                  >
                    <Ic size={21} strokeWidth={1.6} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 19, fontWeight: 700 }}>{a.t}</h3>
                    <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55, marginTop: 8 }}>{a.d}</p>
                  </div>
                  <a
                    href="#contact"
                    style={{
                      marginTop: "auto",
                      color: "var(--accent)",
                      fontWeight: 700,
                      fontSize: 13.5,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {t.discuss} <IconArrowRight size={14} />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
