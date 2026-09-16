"use client";

import { useState } from "react";
import type { Translation } from "@/lib/i18n";
import { IconSearch, IconCheck, IconClock } from "./Icons";
import Pill from "./Pill";
import Reveal from "./Reveal";

type CaseResult = {
  id: string;
  client: string;
  attorney: string;
  court: string;
  status: string;
  ketero: string;
};

export default function CaseLookup({ t }: { t: Translation }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaseResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doSearch = async () => {
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setError(null);

    try {
      const res = await fetch("/api/cases/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else if (!data.found) {
        setNotFound(true);
      } else {
        setResult(data.record);
      }
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="lookup" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="container" style={{ padding: "72px 24px" }}>
        <Reveal>
          <div className="eyebrow">{t.lookupEyebrow}</div>
          <h2 style={{ fontSize: "clamp(26px,3.4vw,36px)", fontWeight: 700, marginTop: 14 }}>{t.lookupTitle}</h2>
          <p style={{ color: "var(--ink-soft)", marginTop: 10, maxWidth: 520, fontSize: 15 }}>{t.lookupSub}</p>
        </Reveal>

        <Reveal>
        <div className="card" style={{ marginTop: 22, padding: 22, maxWidth: 640 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 240px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid var(--border-strong)",
                borderRadius: 2,
                padding: "0 14px",
              }}
            >
              <IconSearch size={17} style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder={t.lookupPlaceholder}
                className="mono"
                style={{ border: "none", outline: "none", padding: "14px 0", fontSize: 14.5, width: "100%", background: "transparent", color: "var(--ink)" }}
              />
            </div>
            <button className="btn btn-primary" onClick={doSearch} disabled={loading} style={{ minWidth: 120 }}>
              {loading ? t.searching : t.search}
            </button>
          </div>

          {!result && !loading && !notFound && !error && (
            <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 12 }}>{t.noResultHint}</p>
          )}
          {notFound && (
            <p style={{ fontSize: 13, color: "var(--accent)", marginTop: 14 }}>{t.lookupNotFound}</p>
          )}
          {error && <p style={{ fontSize: 13, color: "var(--accent)", marginTop: 14 }}>{error}</p>}

          {result && (
            <div style={{ marginTop: 22, borderTop: "1px solid var(--border)", paddingTop: 20, animation: "resultIn .4s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>
                  {result.id}
                </span>
                <Pill>
                  <span style={{ display: "inline-flex", animation: "checkPop .4s ease .15s both" }}>
                    <IconCheck size={13} />
                  </span>{" "}
                  On File
                </Pill>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="result-grid">
                {[
                  [t.resultClient, result.client],
                  [t.resultAttorney, result.attorney],
                  [t.resultCourt, result.court],
                  [t.resultStatus, result.status],
                ].map(([label, val], i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-faint)" }}>{label}</div>
                    <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 4 }}>{val}</div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 18,
                  background: "var(--accent-tint)",
                  border: "1px solid var(--accent)",
                  borderRadius: 2,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <IconClock size={19} style={{ color: "var(--accent)", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--accent)", fontWeight: 700 }}>
                    {t.resultKetero}
                  </div>
                  <div className="mono" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>
                    {result.ketero}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </Reveal>
      </div>
    </section>
  );
}
