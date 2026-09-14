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

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="team-grid">
          {shown.map((m, i) => (
            <Reveal key={m.id} delay={i * 130} from={i % 2 === 0 ? "left" : "right"}>
              <div>
                <div
                  style={{
                    aspectRatio: "3 / 4",
                    width: "100%",
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
                    <span className="serif" style={{ fontSize: 48, fontWeight: 700, color: "var(--ink-faint)" }}>
                      {m.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 className="serif" style={{ fontSize: 19, fontWeight: 700, marginTop: 18 }}>
                  {m.name}
                </h3>
                <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700, marginTop: 2 }}>{m.title}</div>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 10 }}>{m.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
