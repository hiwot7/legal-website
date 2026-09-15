"use client";

import { useEffect, useState } from "react";
import type { Translation } from "@/lib/i18n";
import { IconArrowRight } from "./Icons";
import Reveal from "./Reveal";

type Post = {
  id: string;
  type: "ARTICLE" | "CASE_STUDY";
  slug: string;
  title: string;
  excerpt: string;
  coverImageType: string | null;
};

export default function Insights({ t }: { t: Translation }) {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  if (posts !== null && posts.length === 0) return null;

  const shown = (posts ?? []).slice(0, 4);

  return (
    <section id="insights" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="container" style={{ padding: "72px 24px" }}>
        <Reveal>
          <div className="eyebrow">{t.insightsEyebrow}</div>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,36px)", fontWeight: 700, marginTop: 14, marginBottom: 40 }}>{t.insightsTitle}</h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="insights-grid">
          {shown.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <a href={`/insights/${p.slug}`} className="card" style={{ padding: 0, display: "flex", flexDirection: "column", height: "100%", textDecoration: "none", color: "inherit", overflow: "hidden" }}>
                {p.coverImageType && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/api/post-covers/${p.id}`} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
                )}
                <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11.5,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      color: "var(--accent)",
                      fontWeight: 700,
                    }}
                  >
                    {p.type === "CASE_STUDY" ? "Case Study" : "Article"}
                  </div>
                  <h3 className="serif" style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.3 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{p.excerpt}</p>
                  <span style={{ color: "var(--ink)", fontWeight: 700, fontSize: 13.5, display: "inline-flex", alignItems: "center", gap: 6, marginTop: "auto" }}>
                    {t.readMore} <IconArrowRight size={14} />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
