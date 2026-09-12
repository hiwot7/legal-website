"use client";

import { useState } from "react";
import type { Translation } from "@/lib/i18n";
import { IconArrowRight, IconCheck, IconTelegram, IconLinkedin, IconFacebook, IconXTwitter } from "./Icons";
import Reveal from "./Reveal";

const ARTICLES = [
  {
    title: "What the 2026 Commercial Code Amendments Mean for Contract Drafting",
    tag: "Business Law",
    read: "6 min",
    excerpt:
      "Recent amendments tighten default remedies for breach and clarify arbitration enforceability — here's what changes for standard commercial agreements.",
  },
  {
    title: "Navigating Ketero: A Practical Guide to Court Adjournments",
    tag: "Litigation",
    read: "4 min",
    excerpt: "Hearing dates shift more often than clients expect. Understanding how ketero scheduling works can save months of frustration.",
  },
];

function ShareButtons({ t, articleTitle }: { t: Translation; articleTitle: string }) {
  const [copied, setCopied] = useState(false);
  const share = () => {
    try {
      navigator.clipboard?.writeText(`${window.location.origin}/#insights-${encodeURIComponent(articleTitle)}`);
    } catch {
      // clipboard unavailable — ignore
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  const btns: [string, typeof IconTelegram][] = [
    ["Telegram", IconTelegram],
    ["LinkedIn", IconLinkedin],
    ["Facebook", IconFacebook],
    ["X", IconXTwitter],
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {btns.map(([name, Ic]) => (
        <button
          key={name}
          onClick={share}
          aria-label={`Share via ${name}`}
          style={{
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: 2,
            color: "var(--ink-soft)",
          }}
        >
          <Ic size={15} />
        </button>
      ))}
      <span
        style={{
          fontSize: 12.5,
          fontWeight: 600,
          color: copied ? "var(--accent)" : "var(--ink-faint)",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          minWidth: 96,
        }}
      >
        {copied ? (
          <>
            <IconCheck size={13} /> {t.copied}
          </>
        ) : (
          t.share
        )}
      </span>
    </div>
  );
}

export default function Insights({ t }: { t: Translation }) {
  return (
    <section id="insights" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="container" style={{ padding: "72px 24px" }}>
        <Reveal>
          <div className="eyebrow">{t.insightsEyebrow}</div>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,36px)", fontWeight: 700, marginTop: 14, marginBottom: 40 }}>{t.insightsTitle}</h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="insights-grid">
          {ARTICLES.map((a, i) => (
            <Reveal key={i} delay={i * 100}>
            <article className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11.5,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  color: "var(--accent)",
                  fontWeight: 700,
                }}
              >
                <span>{a.tag}</span>
                <span style={{ color: "var(--ink-faint)" }}>{a.read}</span>
              </div>
              <h3 className="serif" style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.3 }}>
                {a.title}
              </h3>
              <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{a.excerpt}</p>
              <a href="#contact" style={{ color: "var(--ink)", fontWeight: 700, fontSize: 13.5, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                {t.readMore} <IconArrowRight size={14} />
              </a>
              <div style={{ borderTop: "1px solid var(--border)", marginTop: 6, paddingTop: 14 }}>
                <ShareButtons t={t} articleTitle={a.title} />
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
