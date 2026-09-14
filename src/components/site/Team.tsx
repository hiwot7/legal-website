"use client";

import { useEffect, useState } from "react";
import type { Translation } from "@/lib/i18n";
import Reveal from "./Reveal";

type Member = { id: string; name: string; title: string; bio: string; hasPhoto: boolean };

export default function Team({ t }: { t: Translation }) {
  const [members, setMembers] = useState<Member[] | null>(null);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then(setMembers)
      .catch(() => setMembers([]));
  }, []);

  if (members !== null && members.length === 0) return null;

  const shown = (members ?? []).slice(0, 3);

  return (
    <section id="team" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="container" style={{ padding: "72px 24px" }}>
        <Reveal>
          <div className="eyebrow">{t.teamEyebrow}</div>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,36px)", fontWeight: 700, marginTop: 14, marginBottom: 40 }}>{t.teamTitle}</h2>
        </Reveal>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}
          className="team-grid"
        >
          {shown.map((m, i) => (
            <Reveal key={m.id} delay={i * 120} from={i % 2 === 0 ? "left" : "right"}>
              <div className="card" style={{ padding: 26, display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      flexShrink: 0,
                      overflow: "hidden",
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {m.hasPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/api/team/${m.id}/photo`} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span className="serif" style={{ fontSize: 20, fontWeight: 700, color: "var(--ink-faint)" }}>
                        {m.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15.5 }}>{m.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em", marginTop: 2 }}>
                      {m.title}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>{m.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
