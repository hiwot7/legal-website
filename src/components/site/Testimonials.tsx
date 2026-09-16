"use client";

import { useEffect, useState } from "react";
import type { Translation } from "@/lib/i18n";
import Reveal from "./Reveal";

type Testimonial = { id: string; clientName: string; clientRole: string | null; quote: string };

export default function Testimonials({ t }: { t: Translation }) {
  const [items, setItems] = useState<Testimonial[] | null>(null);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  if (items !== null && items.length === 0) return null;

  const shown = (items ?? []).slice(0, 3);

  return (
    <section id="testimonials" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
      <div className="container" style={{ padding: "72px 24px" }}>
        <Reveal>
          <div className="eyebrow">{t.testimonialsEyebrow}</div>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,36px)", fontWeight: 700, marginTop: 14, marginBottom: 40 }}>{t.testimonialsTitle}</h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="insights-grid">
          {shown.map((it, i) => (
            <Reveal key={it.id} delay={i * 100}>
              <div className="card card-hoverable" style={{ padding: 28, height: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="serif" style={{ fontSize: 40, lineHeight: 1, color: "var(--gold)" }}>
                  &ldquo;
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-soft)", flex: 1 }}>{it.quote}</p>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{it.clientName}</div>
                  {it.clientRole && <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 2 }}>{it.clientRole}</div>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
